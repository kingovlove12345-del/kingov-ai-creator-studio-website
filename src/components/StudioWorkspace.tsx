import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Loader2,
  RotateCcw,
  Wand2,
} from 'lucide-react';
import {
  MARKET_CONTEXT_OPTIONS,
  STUDIOS_CATALOG,
  TONE_PRESETS,
  getStudioById,
} from '../data/studios';
import {
  AppSection,
  type GeneratedEntry,
  type LengthPreferenceOption,
  type MarketContextOption,
  type ServiceStatusResponse,
  type StudioId,
  type ToolDraftState,
} from '../types/studio';
import { FormattedOutput } from './FormattedOutput';

interface StudioWorkspaceProps {
  studioId: StudioId;
  requestedToolId?: string;
  serviceStatus: ServiceStatusResponse | null;
  drafts: Record<string, ToolDraftState>;
  onUpdateDraft: (toolKey: string, next: Partial<ToolDraftState>) => void;
  resultsByTool: Record<string, GeneratedEntry>;
  history: GeneratedEntry[];
  onSaveResult: (toolKey: string, entry: GeneratedEntry) => void;
  onNavigate: (section: AppSection, toolId?: string) => void;
}

const DEFAULT_DRAFT: ToolDraftState = {
  prompt: '',
  additionalContext: '',
  marketContext: 'nigeria',
  tone: 'Professional & Engaging',
  lengthPreference: 'standard',
};

function copyTextReliably(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export function StudioWorkspace({
  studioId,
  requestedToolId,
  serviceStatus,
  drafts,
  onUpdateDraft,
  resultsByTool,
  history,
  onSaveResult,
  onNavigate,
}: StudioWorkspaceProps) {
  const studio = getStudioById(studioId);
  const [activeToolId, setActiveToolId] = useState<string>(
    requestedToolId && studio.tools.some((t) => t.id === requestedToolId)
      ? requestedToolId
      : studio.tools[0].id
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  // Sync active tool when studio or requestedToolId changes
  useEffect(() => {
    if (requestedToolId && studio.tools.some((t) => t.id === requestedToolId)) {
      setActiveToolId(requestedToolId);
    } else if (!studio.tools.some((t) => t.id === activeToolId)) {
      setActiveToolId(studio.tools[0].id);
    }
    setErrorMessage(null);
    setCopiedState(false);
  }, [studioId, requestedToolId, studio.tools]);

  const currentTool =
    studio.tools.find((t) => t.id === activeToolId) || studio.tools[0];
  const toolKey = `${studio.id}:${currentTool.id}`;
  const currentDraft: ToolDraftState = {
    ...DEFAULT_DRAFT,
    ...(drafts[toolKey] || {}),
  };
  const currentResult = resultsByTool[toolKey] || null;
  const studioHistory = history.filter((item) => item.studioId === studio.id);

  const aiReady = serviceStatus?.aiConfigured !== false;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    const trimmedPrompt = currentDraft.prompt.trim();
    if (trimmedPrompt.length < 3) {
      setErrorMessage(
        'Please enter a topic, idea, or brief of at least 3 characters before clicking Generate.'
      );
      return;
    }

    setIsGenerating(true);
    setStreamingContent('');
    setErrorMessage(null);
    setCopiedState(false);

    const requestBody = JSON.stringify({
      studioId: studio.id,
      toolId: currentTool.id,
      prompt: trimmedPrompt,
      additionalContext: currentDraft.additionalContext.trim(),
      marketContext: currentDraft.marketContext,
      tone: currentDraft.tone,
      lengthPreference: currentDraft.lengthPreference,
    });

    try {
      const response = await fetch('/api/generate-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: requestBody,
      });

      const contentType = response.headers.get('content-type') || '';

      // Handle non-stream JSON validation or error responses
      if (!response.ok || !contentType.includes('text/event-stream')) {
        let payload: {
          content?: string;
          error?: string;
          generatedAt?: string;
          model?: string;
        } = {};
        try {
          payload = await response.json();
        } catch {
          throw new Error(
            'The server connection timed out or returned an unexpected response. Your input is safely preserved—please click Retry Generation.'
          );
        }

        if (!response.ok || !payload.content) {
          throw new Error(
            payload.error ||
              'Generation could not be completed right now. Your input has been preserved so you can retry without retyping.'
          );
        }

        const entry: GeneratedEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          studioId: studio.id,
          toolId: currentTool.id,
          toolName: currentTool.name,
          promptSnapshot: trimmedPrompt,
          content: payload.content,
          generatedAt: payload.generatedAt || new Date().toISOString(),
          model: payload.model || 'gemini-3.1-flash-lite',
          source: 'live_gemini_api',
        };
        onSaveResult(toolKey, entry);
        return;
      }

      if (!response.body) {
        throw new Error('Streaming response body is unavailable in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';
      let finalModel = 'gemini-3.1-flash-lite';
      let finalTimestamp = new Date().toISOString();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';

        for (const rawEvent of events) {
          const lines = rawEvent.split('\n');
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const jsonText = line.slice(6).trim();
            if (!jsonText) continue;

            let eventData: {
              type?: string;
              text?: string;
              error?: string;
              model?: string;
              generatedAt?: string;
            };
            try {
              eventData = JSON.parse(jsonText);
            } catch {
              continue;
            }

            if (eventData.type === 'chunk' && eventData.text) {
              accumulatedText += eventData.text;
              setStreamingContent(accumulatedText);
            } else if (eventData.type === 'done') {
              if (eventData.model) finalModel = eventData.model;
              if (eventData.generatedAt) finalTimestamp = eventData.generatedAt;
            } else if (eventData.type === 'error') {
              throw new Error(
                eventData.error ||
                  'Live AI generation encountered an upstream error. Your input is preserved.'
              );
            }
          }
        }
      }

      if (!accumulatedText.trim()) {
        throw new Error(
          'The AI service closed the stream before returning content. Your input has been preserved—please click Retry Generation.'
        );
      }

      const entry: GeneratedEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        studioId: studio.id,
        toolId: currentTool.id,
        toolName: currentTool.name,
        promptSnapshot: trimmedPrompt,
        content: accumulatedText.trim(),
        generatedAt: finalTimestamp,
        model: finalModel,
        source: 'live_gemini_api',
      };

      onSaveResult(toolKey, entry);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Network connection interrupted while contacting the AI backend. Your input has been preserved.';
      setErrorMessage(message);
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
    }
  };

  const handleCopyResult = async () => {
    if (!currentResult?.content) return;
    const ok = await copyTextReliably(currentResult.content);
    if (ok) {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2500);
    } else {
      setErrorMessage(
        'Automatic clipboard access was blocked by your browser. You can select the text in the results box below and copy manually.'
      );
    }
  };

  const handleDownloadTxt = () => {
    if (!currentResult?.content) return;
    const header = [
      `KingOv AI Creator Studio — ${studio.title} (${currentTool.name})`,
      `Generated: ${new Date(currentResult.generatedAt).toLocaleString()}`,
      `Prompt: ${currentResult.promptSnapshot}`,
      '------------------------------------------------------------',
      '',
    ].join('\n');
    const blob = new Blob([header + currentResult.content], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kingov-${currentTool.id}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const wordCount = currentResult
    ? currentResult.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] pb-16">
      {/* Top Studio Switcher Bar — Effortless 1-Tap Navigation Across All 5 Studios */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onNavigate(AppSection.Overview)}
                className="hover:text-[#0B192C] underline underline-offset-2 transition-colors"
              >
                Overview
              </button>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-[#0B192C]">{studio.title}</span>
              <span aria-hidden="true">/</span>
              <span>{currentTool.shortLabel}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {aiReady ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Live AI Service Connected · Server-Side Gemini</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Server Gemini Key Required in Settings &gt; Secrets</span>
                </span>
              )}
            </div>
          </div>

          {/* Horizontal scrollable 5-Studio Switcher */}
          <div
            role="tablist"
            aria-label="Switch between the five Creator Studios"
            className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1"
          >
            {STUDIOS_CATALOG.map((item) => {
              const isCurrentStudio = item.id === studio.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrentStudio}
                  onClick={() => onNavigate(item.id as unknown as AppSection)}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    isCurrentStudio
                      ? 'bg-[#0B192C] text-[#F5C451]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-[#0B192C]'
                  }`}
                >
                  {item.editorialIndex}. {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Header & Sub-Tool Selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 sm:pt-9">
        <div className="mb-6">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B192C] tracking-tight mb-2">
            {studio.editorialIndex}. {studio.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
            {studio.summary}
          </p>
        </div>

        {/* Sub-Tool Selector Tabs */}
        <div className="mb-7">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            Select a tool in {studio.title}:
          </div>
          <div
            role="tablist"
            aria-label={`${studio.title} tools`}
            className="flex items-center gap-2 overflow-x-auto pb-2"
          >
            {studio.tools.map((tool) => {
              const selected = tool.id === currentTool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setActiveToolId(tool.id);
                    setErrorMessage(null);
                    setCopiedState(false);
                  }}
                  className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium border transition-colors whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-white border-[#0B192C] text-[#0B192C] font-semibold shadow-xs'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  {tool.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Workspace Grid: Left Input Form | Right Results Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Input Controls */}
          <form
            onSubmit={handleGenerate}
            className="lg:col-span-5 rounded-2xl bg-white border border-slate-200 p-5 sm:p-6"
          >
            <div className="pb-4 mb-4 border-b border-slate-200">
              <div className="text-xs text-[#8A6408] font-semibold mb-1">
                {currentTool.deliverableSummary}
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B192C]">
                {currentTool.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {currentTool.description}
              </p>
            </div>

            {/* Quick-Fill Example Prompts (Clearly labeled as input fillers, not fake outputs) */}
            {currentTool.starterPrompts.length > 0 && (
              <div className="mb-4">
                <span className="block text-xs font-medium text-slate-500 mb-2">
                  Need inspiration? Tap to fill an editable example brief:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentTool.starterPrompts.map((starter, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onUpdateDraft(toolKey, {
                          prompt: starter.prompt,
                          marketContext:
                            starter.marketContext || currentDraft.marketContext,
                        });
                        setErrorMessage(null);
                      }}
                      className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-slate-800 transition-colors text-left"
                    >
                      + {starter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Prompt Textarea */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <label
                  htmlFor={`prompt-${currentTool.id}`}
                  className="text-xs sm:text-sm font-semibold text-[#0B192C]"
                >
                  {currentTool.inputLabel}
                </label>
                {currentDraft.prompt.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateDraft(toolKey, { prompt: '', additionalContext: '' });
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 py-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <textarea
                id={`prompt-${currentTool.id}`}
                rows={5}
                value={currentDraft.prompt}
                onChange={(e) =>
                  onUpdateDraft(toolKey, { prompt: e.target.value })
                }
                placeholder={currentTool.placeholder}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm sm:text-[15px] text-slate-900 placeholder:text-slate-400 focus:border-[#0B192C] focus:outline-none focus:ring-2 focus:ring-[#0B192C]/15 resize-y"
              />

              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>Input is automatically preserved across tabs and retries</span>
                <span className="font-mono tabular-nums">
                  {currentDraft.prompt.length} / 6000
                </span>
              </div>
            </div>

            {/* Audience / Cultural Context & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4 pt-3 border-t border-slate-100">
              <div>
                <label
                  htmlFor={`market-${currentTool.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Audience & Cultural Context
                </label>
                <select
                  id={`market-${currentTool.id}`}
                  value={currentDraft.marketContext}
                  onChange={(e) =>
                    onUpdateDraft(toolKey, {
                      marketContext: e.target.value as MarketContextOption,
                    })
                  }
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#0B192C] focus:outline-none"
                >
                  {MARKET_CONTEXT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor={`tone-${currentTool.id}`}
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Writing Tone
                </label>
                <select
                  id={`tone-${currentTool.id}`}
                  value={currentDraft.tone}
                  onChange={(e) =>
                    onUpdateDraft(toolKey, { tone: e.target.value })
                  }
                  className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-[#0B192C] focus:outline-none"
                >
                  {TONE_PRESETS.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Output Length & Optional Constraints */}
            <div className="mb-5">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">
                Output Depth
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {(
                  [
                    { id: 'concise', label: 'Concise' },
                    { id: 'standard', label: 'Balanced' },
                    { id: 'detailed', label: 'Detailed' },
                  ] as { id: LengthPreferenceOption; label: string }[]
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      onUpdateDraft(toolKey, { lengthPreference: item.id })
                    }
                    className={`min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      currentDraft.lengthPreference === item.id
                        ? 'bg-white text-[#0B192C] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label
                htmlFor={`notes-${currentTool.id}`}
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Optional Constraints (target names, CTA, exam board, duration)
              </label>
              <input
                id={`notes-${currentTool.id}`}
                type="text"
                value={currentDraft.additionalContext}
                onChange={(e) =>
                  onUpdateDraft(toolKey, { additionalContext: e.target.value })
                }
                placeholder="e.g., Keep under 60 seconds, include WhatsApp CTA, or target WAEC syllabus"
                className="w-full min-h-[44px] rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0B192C] focus:outline-none"
              />
            </div>

            {/* Primary Generate Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#0B192C] hover:bg-[#152c4a] disabled:opacity-70 disabled:cursor-not-allowed text-white font-display font-bold text-sm sm:text-base transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B192C]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 text-[#F5C451] animate-spin" />
                  <span>Generating Live Content...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#F5C451]" />
                  <span>Generate {currentTool.shortLabel}</span>
                </>
              )}
            </button>
          </form>

          {/* Right Column: Results Area, Error Alert, Copy Controls & Session History */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
              {/* Results Header & Copy Bar */}
              <div className="px-5 sm:px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-bold text-[#0B192C]">
                    Results Area — {currentTool.name}
                  </h3>
                  {currentResult ? (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                      <span>Live AI Output</span>
                      <span aria-hidden="true">·</span>
                      <span>{wordCount} words</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {new Date(currentResult.generatedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Outputs are generated live on demand—never pre-filled with mock text
                    </p>
                  )}
                </div>

                {/* Copy & Download Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyResult}
                    disabled={!currentResult || isGenerating}
                    aria-label="Copy generated result to clipboard"
                    className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                      copiedState
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : currentResult && !isGenerating
                          ? 'bg-[#F5C451] border-[#e5b33d] text-[#0B192C] hover:bg-[#fad16b]'
                          : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {copiedState ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {currentResult && !isGenerating && (
                    <button
                      type="button"
                      onClick={handleDownloadTxt}
                      aria-label="Download result as text file"
                      className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Save .txt</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Error Banner (Preserves input and explains issue clearly) */}
              {errorMessage && (
                <div
                  role="alert"
                  className="m-5 sm:m-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-900"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-red-900">
                        Could not complete generation
                      </p>
                      <p className="text-xs sm:text-sm text-red-800 mt-1 leading-relaxed">
                        {errorMessage}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleGenerate()}
                          disabled={isGenerating}
                          className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                        >
                          Retry Generation
                        </button>
                        <span className="text-xs text-red-700">
                          Your prompt and settings are still intact on the left.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Body: Streaming | Loading | Populated | Empty */}
              <div className="p-5 sm:p-7 min-h-[340px]">
                {isGenerating && streamingContent ? (
                  <article aria-live="polite">
                    <div className="mb-4 pb-2.5 border-b border-slate-100 flex items-center gap-2 text-xs font-medium text-[#0B192C]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6408] shrink-0" />
                      <span>Writing live from server-side AI...</span>
                    </div>
                    <FormattedOutput content={streamingContent} />
                  </article>
                ) : isGenerating ? (
                  <div
                    aria-live="polite"
                    className="py-8 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Loader2 className="w-6 h-6 text-[#0B192C] animate-spin shrink-0" />
                      <div>
                        <p className="text-sm sm:text-base font-semibold text-[#0B192C]">
                          Writing your {currentTool.name.toLowerCase()} via live server-side AI...
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tailoring output for{' '}
                          {
                            MARKET_CONTEXT_OPTIONS.find(
                              (m) => m.value === currentDraft.marketContext
                            )?.label
                          }{' '}
                          in a {currentDraft.tone.toLowerCase()} style.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 animate-pulse">
                      <div className="h-5 bg-slate-200 rounded w-2/5" />
                      <div className="h-4 bg-slate-100 rounded w-full" />
                      <div className="h-4 bg-slate-100 rounded w-11/12" />
                      <div className="h-4 bg-slate-100 rounded w-4/5" />
                      <div className="pt-3 h-5 bg-slate-200 rounded w-1/3" />
                      <div className="h-4 bg-slate-100 rounded w-full" />
                      <div className="h-4 bg-slate-100 rounded w-5/6" />
                    </div>
                  </div>
                ) : currentResult ? (
                  <article aria-live="polite">
                    <FormattedOutput content={currentResult.content} />
                  </article>
                ) : (
                  <div className="py-12 px-4 text-center max-w-md mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#0B192C] text-[#F5C451] flex items-center justify-center mx-auto mb-4">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-display text-lg font-bold text-[#0B192C] mb-2">
                      Ready to generate {currentTool.name}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      Enter your idea in the input panel—or tap one of the starter
                      prompts—and click <strong>Generate {currentTool.shortLabel}</strong>{' '}
                      to create original content using our live AI backend.
                    </p>
                    <p className="text-xs text-slate-500">
                      Deliverables: {currentTool.deliverableSummary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Session Generations for Current Studio */}
            {studioHistory.length > 0 && (
              <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <h4 className="font-display text-sm font-bold text-[#0B192C]">
                      Recent Generations in {studio.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {studioHistory.length} saved this session
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {studioHistory.slice(0, 5).map((entry) => (
                    <div
                      key={entry.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#0B192C] truncate">
                          {entry.toolName}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {entry.promptSnapshot}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveToolId(entry.toolId);
                          onSaveResult(`${studio.id}:${entry.toolId}`, entry);
                        }}
                        className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:border-[#0B192C] hover:text-[#0B192C] transition-colors whitespace-nowrap shrink-0"
                      >
                        View Result
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
