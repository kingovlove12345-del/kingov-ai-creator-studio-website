import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;



interface ModelCandidate {
  model: string;
  useLowThinking: boolean;
}

// Ordered free-tier model cascade:
// 1. gemini-3.1-flash-lite: ~0.7s time-to-first-token & ~2.3s full script completion on free tier.
// 2. Retry gemini-3.1-flash-lite once after brief backoff if a transient network/503 blip occurs.
// 3. gemini-3.8-flash (with ThinkingLevel.LOW): secondary free-tier model fallback.
const FREE_TIER_MODEL_CASCADE: ModelCandidate[] = [
  { model: 'gemini-3.1-flash-lite', useLowThinking: false },
  { model: 'gemini-3.1-flash-lite', useLowThinking: false },
  { model: 'gemini-3.8-flash', useLowThinking: true },
];

interface GenerateRequestBody {
  studioId?: string;
  toolId?: string;
  prompt?: string;
  additionalContext?: string;
  marketContext?: string;
  tone?: string;
  lengthPreference?: string;
}

const VALID_STUDIOS = new Set([
  'movie',
  'social',
  'script',
  'marketing',
  'education',
]);

const TOOL_INSTRUCTIONS: Record<string, string> = {
  // 1. AI Movie Studio
  movie_ideas:
    'Generate 3 distinct, original movie concepts. For each concept provide: Title, Genre, Logline (1-2 punchy sentences), Core Synopsis, Cultural/Box-Office Appeal, and Key Dramatic Conflict.',
  movie_scripts:
    'Write a properly structured screenplay excerpt using standard sluglines (INT./EXT. LOCATION - DAY/NIGHT), vivid visual action paragraphs, character names in uppercase before dialogue, parentheticals only when essential, and natural cinematic pacing.',
  character_descriptions:
    'Create rich character profiles including Full Name, Age & Role, Personality Archetype, Visible Wardrobe/Presence, Backstory & Wound, Core Motivation, Internal Flaw, and Character Arc.',
  movie_dialogue:
    'Write sharp, subtext-rich dramatic or comedic character dialogue. Distinguish each character voice clearly, include brief beat/action cues between lines, and ensure every exchange advances conflict or reveals character.',
  scene_descriptions:
    'Write detailed cinematic scene breakdowns covering Setting & Atmosphere, Lighting & Color Palette, Camera Blocking & Lens Suggestions, Soundscape/Ambient Audio, and Emotional Progression.',
  video_prompts:
    'Generate 4 ready-to-paste AI video-generation text prompts (suitable for text-to-video tools). For each shot specify: Shot Number & Duration, Subject & Action, Environment, Camera Movement & Lens (e.g., 35mm slow dolly-in, aerial tracking), Lighting & Mood, and Recommended Aspect Ratio (16:9 or 9:16).',

  // 2. Social Media Studio
  tiktok_captions:
    'Create 5 scroll-stopping TikTok caption packages. For each option include: On-Screen 3-Second Text Hook, Spoken Opening Line, Engaging Caption Copy, Call-to-Action (comment/save trigger), and 5 targeted hashtags.',
  youtube_scripts:
    'Write a high-retention YouTube video script structured into: [0:00-0:30] High-Stakes Hook & Promise, Structured Main Segments with [B-Roll / Visual Cue] markers, Pattern Interrupts, and a natural Outro Call-to-Action.',
  instagram_content:
    'Create a complete Instagram content pack featuring: a 7-slide Carousel breakdown (Slide-by-Slide headline + concise body copy), a companion Reel concept, and a polished caption with engagement question and hashtags.',
  short_video_ideas:
    'Generate 5 high-performing Short-Video Ideas (for YouTube Shorts, Instagram Reels, and TikTok). For each idea specify: Concept Title, First 3 Seconds Visual + Audio Hook, 30-45 Second Storyboard Beats, and Why Viewers Will Share It.',

  // 3. AI Script Writer
  stories:
    'Write an original, emotionally resonant story with vivid sensory detail, authentic setting, well-paced narrative tension, memorable characters, and a satisfying resolution.',
  narration_scripts:
    'Write a clear, evocative narration script for documentary, storytelling, or brand films. Include [PAUSE], [EMPHASIS], and [MUSIC/SFX CUE] markers so a narrator can read it effortlessly.',
  voiceover_scripts:
    'Write 2 polished Voice-Over (VO) script variations (30-second and 60-second versions) with exact timecode brackets (e.g. [0:00 - 0:07]), Vocal Delivery Notes, Sound Design cues, and a crisp closing Call-to-Action.',
  script_dialogue:
    'Write engaging multi-speaker dialogue (suitable for stage, audio drama, skit, or scripted podcast). Give each speaker a distinct rhythm and perspective, with clear speaker labels and natural conversational flow.',

  // 4. Business Marketing Studio
  advertisements:
    'Create 3 high-converting Advertisement variations across Digital Social Ads, Search/Display Headlines, and Radio/Video Spot copy. Include Attention Headline, Primary Persuasive Copy, Proof/Value Angle, and Clear Call-to-Action.',
  promotional_messages:
    'Write ready-to-send Promotional Messages tailored for: (1) WhatsApp Broadcast / Business Status, (2) Concise SMS Campaign (under 160 characters), and (3) Customer Email Promo — persuasive, respectful, and action-oriented.',
  product_descriptions:
    'Write persuasive e-commerce and social-commerce Product Descriptions including: Benefit-Driven Headline, Engaging Overview Paragraph, 5 Key Feature-to-Benefit Bullet Points, Ideal Customer Use Case, and Trust/Ordering CTA.',
  marketing_ideas:
    'Develop a practical, budget-smart Marketing Action Plan featuring 5 actionable campaign ideas, target customer positioning, content calendar pillars, partnership/referral angles, and measurable KPIs to track.',

  // 5. AI Education Studio
  study_notes:
    'Create comprehensive, well-organized Study Notes on the topic. Include: Learning Objectives, Clear Core Explanations, Key Definitions & Formulas, Step-by-Step Worked Examples or Real-World Analogies, and a Quick Summary.',
  revision_guides:
    'Create a focused Exam Revision Guide featuring: High-Yield Key Points, Memory Aids / Mnemonics, Common Exam Mistakes to Avoid, Rapid-Fire Review Checklist, and How Examiners Frame Questions on this topic.',
  practice_questions:
    'Generate a structured set of 6 Practice Questions ranging from foundational recall to analytical application (short-answer and structured essay style), followed by a complete Marking Guide / Model Answers section at the end.',
  quizzes:
    'Create an 8-question Multiple-Choice Quiz (Options A, B, C, D) testing true understanding of the topic. Present all 8 questions cleanly first, then provide a dedicated Answer Key & Brief Explanations section below.',
};

function getMarketInstruction(marketContext?: string): string {
  switch (marketContext) {
    case 'nigeria':
      return 'Tailor cultural references, audience sensibilities, examples, idioms, and market realities authentically for audiences in Nigeria (e.g., Lagos, Abuja, Port Harcourt, Kano, Enugu; Nollywood storytelling craft; Nigerian SMEs, creators, and WAEC/JAMB/university learners where relevant) while keeping the writing globally intelligible and professional.';
    case 'nigeria_pidgin':
      return 'Blend clear English with natural, authentic Nigerian Pidgin expressions where appropriate for dialogue, hooks, or relatable audience engagement, keeping structure crisp and easy to read.';
    case 'pan_african':
      return 'Tailor examples, cultural resonance, and market context for creators, businesses, and learners across Nigeria, Ghana, Kenya, South Africa, and the broader African continent.';
    default:
      return 'Write for a broad international English-speaking audience worldwide with clear, universally relatable examples and high professional polish.';
  }
}

function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(
    key &&
      key.trim().length > 0 &&
      key.trim() !== 'MY_GEMINI_API_KEY' &&
      key.trim() !== 'YOUR_API_KEY'
  );
}

function createGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function buildConfig(
  systemInstruction: string,
  candidate: ModelCandidate
): GenerateContentConfig {
  const config: GenerateContentConfig = {
    systemInstruction,
    temperature: 0.75,
  };
  if (candidate.useLowThinking) {
    config.thinkingConfig = {
      thinkingLevel: ThinkingLevel.LOW,
    };
  }
  return config;
}

function classifyGeminiError(err: unknown): {
  httpStatus: number;
  code: string;
  message: string;
  isAuthError: boolean;
} {
  const rawMessage = err instanceof Error ? err.message : String(err);
  const statusProp =
    typeof err === 'object' && err !== null && 'status' in err
      ? Number((err as { status?: unknown }).status)
      : NaN;
  const statusMatch = rawMessage.match(/\b(400|401|403|404|429|500|502|503|504)\b/);
  const statusCode = !Number.isNaN(statusProp)
    ? statusProp
    : statusMatch
      ? Number(statusMatch[1])
      : 500;

  // Safe diagnostic log (never logs API key)
  console.error(
    `[KingOv AI Backend] Generation error (status=${statusCode}): ${rawMessage.slice(0, 300)}`
  );

  if (
    statusCode === 401 ||
    statusCode === 403 ||
    rawMessage.includes('API_KEY_INVALID') ||
    rawMessage.includes('PERMISSION_DENIED')
  ) {
    return {
      httpStatus: 403,
      code: 'AUTH_ERROR',
      message:
        'The server Gemini API key could not be authorized. Please check your key in the Settings > Secrets panel. Your input has been preserved.',
      isAuthError: true,
    };
  }

  if (
    statusCode === 429 ||
    rawMessage.includes('RESOURCE_EXHAUSTED') ||
    rawMessage.toLowerCase().includes('quota')
  ) {
    return {
      httpStatus: 429,
      code: 'RATE_LIMIT',
      message:
        'Free-tier AI rate limit or quota temporarily reached across available Flash models. Please wait 30–60 seconds and click Generate again. Your input has been preserved.',
      isAuthError: false,
    };
  }

  if (
    statusCode === 503 ||
    statusCode === 504 ||
    rawMessage.includes('UNAVAILABLE') ||
    rawMessage.includes('DEADLINE_EXCEEDED') ||
    rawMessage.toLowerCase().includes('overloaded') ||
    rawMessage.toLowerCase().includes('timeout')
  ) {
    return {
      httpStatus: 503,
      code: 'MODEL_BUSY',
      message:
        'The upstream Gemini AI service is momentarily busy or timed out on a long generation. Try choosing "Concise" or "Balanced" depth, or click Retry Generation in a few seconds. Your input has been preserved.',
      isAuthError: false,
    };
  }

  return {
    httpStatus: 500,
    code: 'GENERATION_FAILED',
    message:
      'We could not complete the live AI request right now due to an upstream service interruption. Your input is intact—please click Retry Generation.',
    isAuthError: false,
  };
}

function validateAndPreparePrompt(
  body: GenerateRequestBody
):
  | {
      ok: true;
      systemInstruction: string;
      combinedUserPrompt: string;
    }
  | {
      ok: false;
      httpStatus: number;
      code: string;
      error: string;
    } {
  const studioId = (body.studioId || '').trim();
  const toolId = (body.toolId || '').trim();
  const prompt = (body.prompt || '').trim();
  const additionalContext = (body.additionalContext || '').trim();
  const marketContext = (body.marketContext || 'nigeria').trim();
  const tone = (body.tone || 'Professional & Engaging').trim();
  const lengthPreference = (body.lengthPreference || 'standard').trim();

  if (!VALID_STUDIOS.has(studioId)) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_STUDIO',
      error: 'Please select one of the five supported studios before generating.',
    };
  }

  if (!toolId || !TOOL_INSTRUCTIONS[toolId]) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'INVALID_TOOL',
      error: 'Please choose a valid content tool within the selected studio.',
    };
  }

  if (!prompt || prompt.length < 3) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'EMPTY_PROMPT',
      error:
        'Please enter a topic, idea, or brief (at least 3 characters) to generate content.',
    };
  }

  if (prompt.length > 6000) {
    return {
      ok: false,
      httpStatus: 400,
      code: 'PROMPT_TOO_LONG',
      error:
        'Your input exceeds the 6,000-character limit. Please shorten your brief slightly and try again.',
    };
  }

  if (!isGeminiConfigured()) {
    return {
      ok: false,
      httpStatus: 503,
      code: 'API_KEY_MISSING',
      error:
        'Live AI generation requires a configured GEMINI_API_KEY on the server. Please verify your key in Settings > Secrets. Your input has been preserved.',
    };
  }

  const lengthGuide =
    lengthPreference === 'concise'
      ? 'Keep the output concise, tight, and fast to scan (roughly 200-350 words).'
      : lengthPreference === 'detailed'
        ? 'Provide thorough, comprehensive depth and rich detail (roughly 650-950 words).'
        : 'Provide a well-balanced, complete response (roughly 400-600 words).';

  const systemInstruction = [
    'You are the senior creative, commercial, and academic writing engine powering KingOv AI Creator Studio.',
    TOOL_INSTRUCTIONS[toolId],
    getMarketInstruction(marketContext),
    `Desired Tone/Style: ${tone}.`,
    lengthGuide,
    'Format your output cleanly using clear Markdown headings (##, ###), bold key labels (**Label:**), and structured lists where helpful. Do not wrap the entire output in a markdown code fence. Deliver original, actionable content directly without meta-commentary or filler introductions.',
  ].join('\n\n');

  const combinedUserPrompt = additionalContext
    ? `Primary Topic / Request:\n${prompt}\n\nAdditional Notes / Constraints:\n${additionalContext}`
    : prompt;

  return {
    ok: true,
    systemInstruction,
    combinedUserPrompt,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Health & AI service transparency endpoint (never exposes secrets)
  app.get('/api/status', (_req: Request, res: Response) => {
    const configured = isGeminiConfigured();
    res.json({
      aiConfigured: configured,
      model: FREE_TIER_MODEL_CASCADE[0].model,
      studios: {
        movie: configured ? 'live_ai' : 'needs_api_key',
        social: configured ? 'live_ai' : 'needs_api_key',
        script: configured ? 'live_ai' : 'needs_api_key',
        marketing: configured ? 'live_ai' : 'needs_api_key',
        education: configured ? 'live_ai' : 'needs_api_key',
      },
      billingAndPayments: 'provisional_preview_only',
    });
  });

  // Live SSE Streaming generation endpoint (prevents 60s reverse-proxy idle timeouts)
  app.post('/api/generate-stream', async (req: Request, res: Response) => {
    const prepared = validateAndPreparePrompt((req.body || {}) as GenerateRequestBody);
    if (!prepared.ok) {
      res.status(prepared.httpStatus).json({
        error: prepared.error,
        code: prepared.code,
      });
      return;
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    let clientDisconnected = false;
    res.on('close', () => {
      if (!res.writableEnded) {
        clientDisconnected = true;
      }
    });

    const writeSseEvent = (payload: Record<string, unknown>) => {
      if (!clientDisconnected && !res.writableEnded) {
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }
    };

    // Keep reverse proxy connection active while waiting for tokens
    const heartbeatTimer = setInterval(() => {
      if (!clientDisconnected && !res.writableEnded) {
        res.write(': keepalive\n\n');
      }
    }, 4000);

    try {
      const ai = createGeminiClient();
      let lastError: unknown = null;

      for (let idx = 0; idx < FREE_TIER_MODEL_CASCADE.length; idx++) {
        if (clientDisconnected) break;
        const candidate = FREE_TIER_MODEL_CASCADE[idx];
        let emittedChars = 0;

        try {
          const stream = await ai.models.generateContentStream({
            model: candidate.model,
            contents: prepared.combinedUserPrompt,
            config: buildConfig(prepared.systemInstruction, candidate),
          });

          for await (const chunk of stream) {
            if (clientDisconnected) break;
            const piece = chunk.text;
            if (piece) {
              emittedChars += piece.length;
              writeSseEvent({ type: 'chunk', text: piece });
            }
          }

          if (emittedChars > 0) {
            writeSseEvent({
              type: 'done',
              model: candidate.model,
              generatedAt: new Date().toISOString(),
            });
            res.end();
            return;
          }

          lastError = new Error(`Empty stream returned from ${candidate.model}`);
        } catch (err: unknown) {
          lastError = err;
          const classified = classifyGeminiError(err);
          // Do not retry auth errors, or if partial text was already streamed to client
          if (classified.isAuthError || emittedChars > 0) {
            writeSseEvent({
              type: 'error',
              error: classified.message,
              code: classified.code,
            });
            res.end();
            return;
          }
          if (idx < FREE_TIER_MODEL_CASCADE.length - 1) {
            await delay(600 * (idx + 1));
          }
        }
      }

      if (!clientDisconnected && !res.writableEnded) {
        const classified = classifyGeminiError(lastError);
        writeSseEvent({
          type: 'error',
          error: classified.message,
          code: classified.code,
        });
        res.end();
      }
    } finally {
      clearInterval(heartbeatTimer);
    }
  });

  // Standard unary JSON generation endpoint (also uses fast free-tier model cascade)
  app.post('/api/generate', async (req: Request, res: Response) => {
    const prepared = validateAndPreparePrompt((req.body || {}) as GenerateRequestBody);
    if (!prepared.ok) {
      res.status(prepared.httpStatus).json({
        error: prepared.error,
        code: prepared.code,
      });
      return;
    }

    const ai = createGeminiClient();
    let lastError: unknown = null;

    for (let idx = 0; idx < FREE_TIER_MODEL_CASCADE.length; idx++) {
      const candidate = FREE_TIER_MODEL_CASCADE[idx];
      try {
        const response = await ai.models.generateContent({
          model: candidate.model,
          contents: prepared.combinedUserPrompt,
          config: buildConfig(prepared.systemInstruction, candidate),
        });

        const outputText = response.text;
        if (outputText && outputText.trim()) {
          res.json({
            content: outputText.trim(),
            model: candidate.model,
            generatedAt: new Date().toISOString(),
            source: 'live_gemini_api',
          });
          return;
        }
        lastError = new Error(`Empty response from ${candidate.model}`);
      } catch (err: unknown) {
        lastError = err;
        const classified = classifyGeminiError(err);
        if (classified.isAuthError) {
          res.status(classified.httpStatus).json({
            error: classified.message,
            code: classified.code,
          });
          return;
        }
        if (idx < FREE_TIER_MODEL_CASCADE.length - 1) {
          await delay(600 * (idx + 1));
        }
      }
    }

    const classified = classifyGeminiError(lastError);
    res.status(classified.httpStatus).json({
      error: classified.message,
      code: classified.code,
    });
  });

  const distPath = path.join(__dirname, 'dist');
  const isProd =
    process.env.NODE_ENV === 'production' && fs.existsSync(distPath);

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KingOv AI Creator Studio running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
