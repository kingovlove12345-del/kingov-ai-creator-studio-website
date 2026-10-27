import heroStudioImg from '../assets/images/hero_creator_studio_1792900782490.jpg';
import movieCinemaImg from '../assets/images/studio_movie_cinema_1792900783645.jpg';
import socialMarketingImg from '../assets/images/studio_social_marketing_1792900784300.jpg';
import educationLearningImg from '../assets/images/studio_education_learning_1792900785624.jpg';
import type { MarketContextOption, StudioDefinition } from '../types/studio';

export const HERO_SHOWCASE_IMAGE = {
  src: heroStudioImg,
  alt: 'Creative film and digital media production desk in a navy and warm brass studio',
};

export const MARKET_CONTEXT_OPTIONS: {
  value: MarketContextOption;
  label: string;
  hint: string;
}[] = [
  {
    value: 'nigeria',
    label: 'Nigeria & West Africa',
    hint: 'Culturally grounded for Lagos, Abuja, Port Harcourt, Nollywood, SMEs & Nigerian exams',
  },
  {
    value: 'global',
    label: 'Global / International',
    hint: 'Universal international English framing for worldwide audiences',
  },
  {
    value: 'pan_african',
    label: 'Pan-African',
    hint: 'Resonates across Nigeria, Ghana, Kenya, South Africa & diaspora markets',
  },
  {
    value: 'nigeria_pidgin',
    label: 'English + Nigerian Pidgin',
    hint: 'Natural blend of crisp English and relatable Naija Pidgin expressions',
  },
];

export const TONE_PRESETS: string[] = [
  'Professional & Engaging',
  'Cinematic & Dramatic',
  'Energetic & Conversational',
  'Persuasive & High-Converting',
  'Academic & Crystal Clear',
  'Witty & Humorous',
];

export const STUDIOS_CATALOG: StudioDefinition[] = [
  {
    id: 'movie',
    editorialIndex: '01',
    title: 'AI Movie Studio',
    navLabel: 'Movie Studio',
    tagline: 'Screenwriting, world-building, and shot-by-shot cinema prompts',
    summary:
      'Develop Nollywood and global box-office concepts, formatted screenplay scenes, multi-layered characters, character dialogue, atmospheric scene breakdowns, and text-to-video generation prompts.',
    showcaseImage: movieCinemaImg,
    showcaseAlt: 'Behind the scenes on a film production stage with cinema camera and warm key lighting',
    tools: [
      {
        id: 'movie_ideas',
        name: 'Movie Ideas',
        shortLabel: 'Movie Ideas',
        description:
          'Generate original feature film or series concepts with loglines, synopses, and dramatic stakes.',
        inputLabel: 'Genre, theme, or rough story spark',
        placeholder:
          'e.g., A suspenseful heist thriller set during a high-society wedding in Victoria Island, Lagos, where two estranged siblings discover they are targeting the same vault...',
        deliverableSummary: '3 original film concepts · Loglines · Box-office angle',
        starterPrompts: [
          {
            label: 'Lagos High-Society Thriller',
            prompt:
              'A suspense thriller set at an elite art auction in Victoria Island, Lagos, where an ethical provenance researcher realizes the centerpiece bronze sculpture hides a decades-old family secret.',
            marketContext: 'nigeria',
          },
          {
            label: 'Global Sci-Fi Drama',
            prompt:
              'A near-future drama about an undersea cable repair crew in the Atlantic who intercept an unexplainable acoustic signal.',
            marketContext: 'global',
          },
        ],
      },
      {
        id: 'movie_scripts',
        name: 'Screenplay Scripts',
        shortLabel: 'Scripts',
        description:
          'Write formatted screenplay scenes with sluglines, visual action lines, and natural pacing.',
        inputLabel: 'Scene premise, characters involved, and dramatic turning point',
        placeholder:
          'e.g., Write an opening 2-minute scene in a bustling Abuja tech hub at midnight. Amaka confronts her co-founder Tunde after discovering an unauthorized transfer before their Series A pitch...',
        deliverableSummary: 'Sluglines · Action lines · Formatted dialogue',
        starterPrompts: [
          {
            label: 'Startup Midnight Confrontation',
            prompt:
              'Opening scene in a glass-walled fintech office in Lekki at 11:45 PM during a thunderstorm. Lead engineer Kemi confronts CEO Dapo over a critical security flaw hours before public launch.',
            marketContext: 'nigeria',
          },
          {
            label: 'Courtroom Cross-Examination',
            prompt:
              'A tense courtroom scene where a junior defense counsel uncovers a contradiction in the star witness testimony using a timestamped transit receipt.',
            marketContext: 'global',
          },
        ],
      },
      {
        id: 'character_descriptions',
        name: 'Character Descriptions',
        shortLabel: 'Characters',
        description:
          'Build deep character bibles covering backstory, motivation, wardrobe, flaws, and arc.',
        inputLabel: 'Character role, world, and personality traits',
        placeholder:
          'e.g., Create two contrasting lead characters for a family succession drama centered around a 40-year-old textile empire in Kano and Onitsha...',
        deliverableSummary: 'Backstory · Motivation · Wardrobe · Character arc',
        starterPrompts: [
          {
            label: 'Textile Dynasty Rivals',
            prompt:
              'Create detailed profiles for the matriarch founder of a West African textile house and her London-trained architect youngest son who never wanted the family business.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'movie_dialogue',
        name: 'Character Dialogue',
        shortLabel: 'Dialogue',
        description:
          'Craft sharp, subtext-rich exchanges with distinct character voices and emotional beats.',
        inputLabel: 'Who is speaking, what each person wants, and what they are hiding',
        placeholder:
          'e.g., Two childhood friends stuck in Third Mainland Bridge traffic on the way to an audition; one secretly already got offered the lead role...',
        deliverableSummary: 'Multi-character exchange · Subtext · Beat cues',
        starterPrompts: [
          {
            label: 'Audition Secret in Traffic',
            prompt:
              'Two ambitious actors sharing a ride across Third Mainland Bridge to a callback audition. Chidi already signed the contract yesterday but has not told his best friend Seyi.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'scene_descriptions',
        name: 'Scene Descriptions',
        shortLabel: 'Scenes',
        description:
          'Design cinematic atmosphere, lighting palettes, camera blocking, and soundscapes.',
        inputLabel: 'Location, time of day, mood, and dramatic action',
        placeholder:
          'e.g., Describe a rain-soaked night market scene in Port Harcourt where a detective searches for an informant among lantern-lit stalls...',
        deliverableSummary: 'Lighting palette · Camera blocking · Sound design',
        starterPrompts: [
          {
            label: 'Lantern-Lit Night Market Pursuit',
            prompt:
              'A rain-slicked evening market in Port Harcourt, warm tungsten generator bulbs reflecting on puddles, a quiet detective tracking a courier without alerting the crowd.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'video_prompts',
        name: 'AI Video-Generation Prompts',
        shortLabel: 'Video Prompts',
        description:
          'Generate detailed text-to-video shot prompts specifying camera movement, lens, lighting, and aspect ratio.',
        inputLabel: 'Visual sequence or trailer concept you want prompts for',
        placeholder:
          'e.g., Create a 4-shot cinematic trailer sequence for a historical epic about ancient Benin Kingdom bronze casters working by furnace light...',
        deliverableSummary: '4 shot-by-shot text prompts · Lens & motion specs',
        starterPrompts: [
          {
            label: 'Historical Kingdom Trailer Sequence',
            prompt:
              'A 4-shot cinematic sequence depicting master artisans in a royal courtyard workshop at golden hour, glowing molten bronze, intricate carvings, dramatic 35mm cinema aesthetic.',
            marketContext: 'nigeria',
          },
          {
            label: 'Luxury Product Commercial Shots',
            prompt:
              'Four sleek macro slow-motion video prompts for an artisanal wristwatch commercial with water droplets, brushed gold bezel, and dark slate studio lighting.',
            marketContext: 'global',
          },
        ],
      },
    ],
  },
  {
    id: 'social',
    editorialIndex: '02',
    title: 'Social Media Studio',
    navLabel: 'Social Media',
    tagline: 'Scroll-stopping hooks, scripts, and carousels built for retention',
    summary:
      'Produce TikTok captions, high-retention YouTube scripts, Instagram carousel & Reel copy, and viral short-video storyboards for creators and brands.',
    showcaseImage: socialMarketingImg,
    showcaseAlt: 'Digital content creator filming vertical product setup with studio key light and laptop',
    tools: [
      {
        id: 'tiktok_captions',
        name: 'TikTok Captions',
        shortLabel: 'TikTok Captions',
        description:
          'Generate 3-second visual text hooks, spoken openers, captions, and niche hashtags.',
        inputLabel: 'What is your TikTok video about and who is watching?',
        placeholder:
          'e.g., Sharing 3 realistic ways young professionals in Nigeria can budget their salary against rising food and transport costs without feeling deprived...',
        deliverableSummary: '5 hook + caption variations · CTA · Niche hashtags',
        starterPrompts: [
          {
            label: 'Smart Salary Budgeting Tips',
            prompt:
              'A 45-second TikTok showing young professionals in Lagos and Abuja how to split monthly income using a practical 50/30/20 rule adapted for real local expenses.',
            marketContext: 'nigeria',
          },
          {
            label: 'Behind-the-Scenes Bakery Order',
            prompt:
              'Decorating a 4-tier custom wedding cake in 60 seconds after a last-minute design change.',
            marketContext: 'global',
          },
        ],
      },
      {
        id: 'youtube_scripts',
        name: 'YouTube Scripts',
        shortLabel: 'YouTube Scripts',
        description:
          'Write complete YouTube scripts with 30-second retention hooks, B-roll cues, and structured chapters.',
        inputLabel: 'Video title/topic, target viewer, and main takeaways',
        placeholder:
          'e.g., How African remote software designers and freelancers can build a global portfolio that lands $3,000+ international client retainers...',
        deliverableSummary: '0:00 Hook · Chapter script · B-Roll cues · Outro',
        starterPrompts: [
          {
            label: 'Global Freelance Portfolio Guide',
            prompt:
              'An 8-minute YouTube guide teaching Nigerian and global freelance designers how to structure case studies that win international B2B clients.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'instagram_content',
        name: 'Instagram Content',
        shortLabel: 'Instagram',
        description:
          'Create slide-by-slide educational carousels, Reel concepts, and save-worthy captions.',
        inputLabel: 'Topic, brand niche, or product launch angle',
        placeholder:
          'e.g., An Instagram carousel + Reel pack for a modern skincare brand explaining how to protect melanin-rich skin during dry Harmattan weather...',
        deliverableSummary: '7-Slide Carousel · Companion Reel · Caption',
        starterPrompts: [
          {
            label: 'Harmattan Skincare Carousel',
            prompt:
              'Educational 7-slide Instagram carousel for a skincare brand on keeping skin hydrated and glowing during dry Harmattan season without heavy pore-clogging oils.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'short_video_ideas',
        name: 'Short-Video Ideas',
        shortLabel: 'Short-Video Ideas',
        description:
          'Brainstorm 5 high-retention Reels, YouTube Shorts, and TikTok storyboards.',
        inputLabel: 'Your creator niche, business type, or expertise area',
        placeholder:
          'e.g., I run a solar inverter installation company in Nigeria and want educational short videos that build trust with homeowners and small clinics...',
        deliverableSummary: '5 Short concepts · 3-sec hooks · Beat-by-beat plan',
        starterPrompts: [
          {
            label: 'Solar Energy Myths & Facts',
            prompt:
              'Short-video series for a clean-energy solar installer showing homeowners why inverter batteries fail early and how to size loads accurately.',
            marketContext: 'nigeria',
          },
        ],
      },
    ],
  },
  {
    id: 'script',
    editorialIndex: '03',
    title: 'AI Script Writer',
    navLabel: 'Script Writer',
    tagline: 'Stories, documentary narration, commercial voice-overs, and audio drama',
    summary:
      'Craft original short fiction, documentary narration with pacing cues, timed 30s/60s commercial voice-over scripts, and multi-speaker dramatic or podcast dialogue.',
    showcaseImage: movieCinemaImg,
    showcaseAlt: 'Production script and studio camera setup',
    tools: [
      {
        id: 'stories',
        name: 'Stories',
        shortLabel: 'Stories',
        description:
          'Write vivid short stories, serialized drama episodes, or modern folktales.',
        inputLabel: 'Story premise, setting, mood, or central lesson',
        placeholder:
          'e.g., A heartwarming story about a retired railway stationmaster in Ibadan whose forgotten pocket watch reunites three generations of his family...',
        deliverableSummary: 'Complete narrative arc · Sensory detail · Pacing',
        starterPrompts: [
          {
            label: 'The Ibadan Stationmaster’s Watch',
            prompt:
              'A warm, atmospheric story about a retired railway engineer in Ibadan whose granddaughter discovers an unmailed 1978 letter tucked inside his brass pocket watch.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'narration_scripts',
        name: 'Narration Scripts',
        shortLabel: 'Narration',
        description:
          'Produce documentary, explainer, or brand story narration with pause and music cues.',
        inputLabel: 'Subject matter, audience, and emotional tone',
        placeholder:
          'e.g., A 3-minute documentary narration exploring how Afrobeats evolved from local Lagos studios into sold-out global stadium tours...',
        deliverableSummary: 'Spoken narration · [PAUSE] & [SFX] cues',
        starterPrompts: [
          {
            label: 'Global Rise of Afrobeats Documentary',
            prompt:
              'A 3-minute documentary opening narration tracing how West African rhythm, cassette street culture, and digital studios reshaped global pop music.',
            marketContext: 'pan_african',
          },
        ],
      },
      {
        id: 'voiceover_scripts',
        name: 'Voice-Over Scripts',
        shortLabel: 'Voice-Over (VO)',
        description:
          'Write timed 30-second and 60-second radio, TV, and digital commercial VO scripts.',
        inputLabel: 'Brand/service name, key offer, target listener, and CTA',
        placeholder:
          'e.g., Radio and digital video voice-over script for SwiftPay Business POS—instant settlement, zero network downtime panic for market merchants and supermarkets...',
        deliverableSummary: '30s & 60s timed scripts · Vocal tone notes',
        starterPrompts: [
          {
            label: 'Instant Settlement POS Radio Spot',
            prompt:
              'Commercial voice-over for a reliable merchant payment app that settles funds in under 5 seconds for busy retail shops, pharmacies, and restaurants.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'script_dialogue',
        name: 'Dialogue & Skits',
        shortLabel: 'Dialogue',
        description:
          'Create lively two- or three-speaker scripts for podcasts, comedy skits, or audio drama.',
        inputLabel: 'Characters, scenario, and comedic or dramatic payoff',
        placeholder:
          'e.g., A 90-second relatable comedy skit between a meticulous tailor and an impatient client picking up an outfit two hours before an owambe...',
        deliverableSummary: 'Distinct speaker voices · Timing & reaction beats',
        starterPrompts: [
          {
            label: 'Saturday Event Tailor Skit',
            prompt:
              'A witty 90-second skit between a confident Lagos fashion designer promising "just two buttons left" and a client whose ceremony starts in one hour.',
            marketContext: 'nigeria_pidgin',
          },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    editorialIndex: '04',
    title: 'Business Marketing Studio',
    navLabel: 'Marketing',
    tagline: 'Ad copy, WhatsApp/SMS promos, product listings, and growth campaigns',
    summary:
      'Equip SMEs, e-commerce sellers, agencies, and startups in Nigeria and worldwide with persuasive advertisements, promotional broadcasts, product descriptions, and practical marketing plans.',
    showcaseImage: socialMarketingImg,
    showcaseAlt: 'Commercial marketing studio desk with product styling and laptop',
    tools: [
      {
        id: 'advertisements',
        name: 'Advertisements',
        shortLabel: 'Advertisements',
        description:
          'Generate multi-channel ad variations for Meta (Facebook/IG), Google Search, and audio/video spots.',
        inputLabel: 'Product or service, unique value proposition, and target buyer',
        placeholder:
          'e.g., Same-day cold-chain grocery delivery service in Abuja and Lagos delivering farm-fresh produce and proteins directly to busy families...',
        deliverableSummary: '3 Ad variations · Headlines · Value proof · CTA',
        starterPrompts: [
          {
            label: 'Farm-to-Doorstep Grocery Delivery',
            prompt:
              'Paid social and search ads for FreshBasket Express, delivering farm-fresh vegetables, grains, and proteins to busy working households within 3 hours.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'promotional_messages',
        name: 'Promotional Messages',
        shortLabel: 'Promo Messages',
        description:
          'Write ready-to-send WhatsApp broadcasts, concise 160-character SMS alerts, and promo emails.',
        inputLabel: 'Special offer, discount/bundle details, deadline, and how to order',
        placeholder:
          'e.g., End-of-month 15% restock bundle on unisex luxury perfumes with free delivery on orders above ₦50,000 this weekend...',
        deliverableSummary: 'WhatsApp broadcast · 160-char SMS · Promo email',
        starterPrompts: [
          {
            label: 'Weekend Fragrance Bundle Promo',
            prompt:
              'Weekend payday promotion offering 15% off signature Eau de Parfum gift sets plus complimentary delivery on orders placed before Sunday 9 PM.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'product_descriptions',
        name: 'Product Descriptions',
        shortLabel: 'Product Copy',
        description:
          'Turn raw product specs into persuasive e-commerce and social-commerce listings.',
        inputLabel: 'Product name, materials/specs, price tier, and customer pain point solved',
        placeholder:
          'e.g., Handcrafted full-grain leather laptop satchel made in Aba/Lagos, padded for 16-inch laptops, water-resistant lining, brass hardware...',
        deliverableSummary: 'Headline · Overview · 5 Benefit bullets · Specs',
        starterPrompts: [
          {
            label: 'Handcrafted Leather Executive Bag',
            prompt:
              'Full-grain vegetable-tanned leather 16-inch laptop briefcase with solid brass buckles, luggage trolley sleeve, and rain-resistant suede interior.',
            marketContext: 'global',
          },
        ],
      },
      {
        id: 'marketing_ideas',
        name: 'Marketing Ideas',
        shortLabel: 'Marketing Ideas',
        description:
          'Build a 30-day low-waste growth campaign with content pillars, referrals, and KPIs.',
        inputLabel: 'Business type, current stage, approximate budget level, and sales goal',
        placeholder:
          'e.g., Launching a modern co-working and podcast recording studio in Yaba/Ikeja; goal is 100 monthly members in 60 days on a lean budget...',
        deliverableSummary: '5 Campaign angles · Referral loop · KPIs to track',
        starterPrompts: [
          {
            label: 'Co-Working & Podcast Hub Launch',
            prompt:
              'A practical 30-day launch marketing plan for a reliable 24/7 solar-powered co-working and creator podcast studio targeting remote workers and startups.',
            marketContext: 'nigeria',
          },
        ],
      },
    ],
  },
  {
    id: 'education',
    editorialIndex: '05',
    title: 'AI Education Studio',
    navLabel: 'Education',
    tagline: 'Structured study notes, exam revision guides, practice questions, and quizzes',
    summary:
      'Support secondary school (WAEC, NECO, JAMB UTME, IGCSE), university students, self-learners, and educators with clear notes, revision summaries, worked questions, and multiple-choice quizzes.',
    showcaseImage: educationLearningImg,
    showcaseAlt: 'Student writing structured academic notes under a warm brass library lamp',
    tools: [
      {
        id: 'study_notes',
        name: 'Study Notes',
        shortLabel: 'Study Notes',
        description:
          'Generate clear, structured lesson notes with definitions, formulas, and worked examples.',
        inputLabel: 'Subject, specific topic, and academic level (e.g., SS3/WAEC, JAMB, 200L University)',
        placeholder:
          'e.g., Explain Electromagnetic Induction and Faraday’s Laws for SS3 Physics / WAEC & JAMB students, including formulas and 2 worked calculation examples...',
        deliverableSummary: 'Objectives · Core concepts · Worked examples',
        starterPrompts: [
          {
            label: 'Physics: Electromagnetic Induction (WAEC/JAMB)',
            prompt:
              'Comprehensive study notes on Electromagnetic Induction, Faraday’s Law, and Lenz’s Law for Senior Secondary / UTME Physics students with 2 step-by-step numerical examples.',
            marketContext: 'nigeria',
          },
          {
            label: 'Macroeconomics: Inflation & Monetary Policy',
            prompt:
              'Undergraduate 100-level Economics study notes explaining demand-pull vs. cost-push inflation and how central banks use interest rates and reserve requirements.',
            marketContext: 'global',
          },
        ],
      },
      {
        id: 'revision_guides',
        name: 'Revision Guides',
        shortLabel: 'Revision Guides',
        description:
          'Condense complex topics into high-yield exam summaries, mnemonics, and pitfall alerts.',
        inputLabel: 'Topic or syllabus unit you are revising for',
        placeholder:
          'e.g., High-yield revision sheet on Organic Chemistry Functional Groups (Alkanes, Alkenes, Alkynes, Alkanols, Alkanoic acids) and laboratory tests...',
        deliverableSummary: 'High-yield summary · Mnemonics · Common pitfalls',
        starterPrompts: [
          {
            label: 'Organic Chemistry Functional Groups',
            prompt:
              'Exam revision guide covering homologous series, IUPAC naming rules, and distinguishing laboratory chemical tests for alkenes, alkanols, and alkanoic acids.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'practice_questions',
        name: 'Practice Questions',
        shortLabel: 'Practice Questions',
        description:
          'Create exam-standard short-answer and structured theory questions with a full marking scheme.',
        inputLabel: 'Subject, topic, and exam style',
        placeholder:
          'e.g., Generate 6 structured Biology theory practice questions on Cellular Respiration (Aerobic vs Anaerobic) with a complete marking guide...',
        deliverableSummary: '6 Graded questions · Complete model marking guide',
        starterPrompts: [
          {
            label: 'Biology: Cellular Respiration Theory',
            prompt:
              'Six exam-standard structured practice questions on Aerobic and Anaerobic Cellular Respiration, ATP yield, and real-world applications, complete with marking scheme.',
            marketContext: 'nigeria',
          },
        ],
      },
      {
        id: 'quizzes',
        name: 'Quizzes',
        shortLabel: 'Quizzes',
        description:
          'Generate an 8-question multiple-choice quiz (A–D) with a separate answer key and explanations.',
        inputLabel: 'Topic and difficulty level for the quiz',
        placeholder:
          'e.g., Create an 8-question multiple-choice quiz on Constitutional Law & Separation of Powers (or JavaScript Async/Await fundamentals) with detailed answer explanations...',
        deliverableSummary: '8 Multiple-choice questions (A–D) · Answer key',
        starterPrompts: [
          {
            label: 'Government & Civic Studies Quiz',
            prompt:
              'An 8-question multiple-choice quiz on Principles of Separation of Powers, Checks and Balances, and Federalism, suitable for WAEC/JAMB preparation.',
            marketContext: 'nigeria',
          },
          {
            label: 'Data Structures & Algorithms Quiz',
            prompt:
              'An 8-question multiple-choice quiz on Big-O time complexity, hash tables, binary search, and stacks vs. queues for computer science students.',
            marketContext: 'global',
          },
        ],
      },
    ],
  },
];

export function getStudioById(id: string): StudioDefinition {
  return STUDIOS_CATALOG.find((s) => s.id === id) || STUDIOS_CATALOG[0];
}
