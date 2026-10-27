export enum AppSection {
  Overview = 'overview',
  Movie = 'movie',
  Social = 'social',
  Script = 'script',
  Marketing = 'marketing',
  Education = 'education',
  Pricing = 'pricing',
}

export type StudioId = 'movie' | 'social' | 'script' | 'marketing' | 'education';

export interface SubToolDefinition {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  starterPrompts: {
    label: string;
    prompt: string;
    additionalContext?: string;
    marketContext?: MarketContextOption;
  }[];
  deliverableSummary: string;
}

export interface StudioDefinition {
  id: StudioId;
  editorialIndex: string;
  title: string;
  navLabel: string;
  tagline: string;
  summary: string;
  showcaseImage: string;
  showcaseAlt: string;
  tools: SubToolDefinition[];
}

export type MarketContextOption =
  | 'nigeria'
  | 'nigeria_pidgin'
  | 'pan_african'
  | 'global';

export type LengthPreferenceOption = 'concise' | 'standard' | 'detailed';

export interface ToolDraftState {
  prompt: string;
  additionalContext: string;
  marketContext: MarketContextOption;
  tone: string;
  lengthPreference: LengthPreferenceOption;
}

export interface GeneratedEntry {
  id: string;
  studioId: StudioId;
  toolId: string;
  toolName: string;
  promptSnapshot: string;
  content: string;
  generatedAt: string;
  model: string;
  source: 'live_gemini_api';
}

export interface ServiceStatusResponse {
  aiConfigured: boolean;
  model: string;
  studios: Record<StudioId, 'live_ai' | 'needs_api_key'>;
  billingAndPayments: 'provisional_preview_only';
}
