import { useCallback, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { OverviewSection } from './components/OverviewSection';
import { PricingSection } from './components/PricingSection';
import { StudioWorkspace } from './components/StudioWorkspace';
import {
  AppSection,
  type GeneratedEntry,
  type ServiceStatusResponse,
  type StudioId,
  type ToolDraftState,
} from './types/studio';

const DRAFTS_STORAGE_KEY = 'kingov_studio_drafts_v1';

const VALID_SECTIONS = new Set<string>([
  AppSection.Overview,
  AppSection.Movie,
  AppSection.Social,
  AppSection.Script,
  AppSection.Marketing,
  AppSection.Education,
  AppSection.Pricing,
]);

function parseSectionFromHash(): AppSection {
  const raw = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  if (VALID_SECTIONS.has(raw)) {
    return raw as AppSection;
  }
  return AppSection.Overview;
}

function loadSavedDrafts(): Record<string, ToolDraftState> {
  try {
    const raw = sessionStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ToolDraftState>;
  } catch {
    return {};
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>(() =>
    parseSectionFromHash()
  );
  const [requestedToolId, setRequestedToolId] = useState<string | undefined>(
    undefined
  );
  const [serviceStatus, setServiceStatus] =
    useState<ServiceStatusResponse | null>(null);
  const [drafts, setDrafts] = useState<Record<string, ToolDraftState>>(() =>
    loadSavedDrafts()
  );
  const [resultsByTool, setResultsByTool] = useState<
    Record<string, GeneratedEntry>
  >({});
  const [history, setHistory] = useState<GeneratedEntry[]>([]);

  // Sync browser URL hash for clean back/forward button support
  useEffect(() => {
    const onHashChange = () => {
      setActiveSection(parseSectionFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Check server-side AI configuration status without exposing keys
  useEffect(() => {
    let active = true;
    fetch('/api/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ServiceStatusResponse | null) => {
        if (active && data) {
          setServiceStatus(data);
        }
      })
      .catch(() => {
        // Keep graceful default if status probe fails transiently
      });
    return () => {
      active = false;
    };
  }, []);

  // Persist user input drafts so zero work is lost across failures or navigation
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch {
      // Ignore storage quota issues
    }
  }, [drafts]);

  const handleNavigate = useCallback((section: AppSection, toolId?: string) => {
    setActiveSection(section);
    setRequestedToolId(toolId);
    if (window.location.hash !== `#${section}`) {
      window.history.pushState(null, '', `#${section}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateDraft = useCallback(
    (toolKey: string, next: Partial<ToolDraftState>) => {
      setDrafts((prev) => {
        const existing: ToolDraftState = prev[toolKey] || {
          prompt: '',
          additionalContext: '',
          marketContext: 'nigeria',
          tone: 'Professional & Engaging',
          lengthPreference: 'standard',
        };
        return {
          ...prev,
          [toolKey]: {
            ...existing,
            ...next,
          },
        };
      });
    },
    []
  );

  const handleSaveResult = useCallback(
    (toolKey: string, entry: GeneratedEntry) => {
      setResultsByTool((prev) => ({
        ...prev,
        [toolKey]: entry,
      }));
      setHistory((prev) => {
        const exists = prev.some((item) => item.id === entry.id);
        if (exists) return prev;
        return [entry, ...prev].slice(0, 25);
      });
    },
    []
  );

  const isStudioSection =
    activeSection === AppSection.Movie ||
    activeSection === AppSection.Social ||
    activeSection === AppSection.Script ||
    activeSection === AppSection.Marketing ||
    activeSection === AppSection.Education;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        {activeSection === AppSection.Overview && (
          <OverviewSection
            serviceStatus={serviceStatus}
            onNavigate={handleNavigate}
          />
        )}

        {isStudioSection && (
          <StudioWorkspace
            studioId={activeSection as unknown as StudioId}
            requestedToolId={requestedToolId}
            serviceStatus={serviceStatus}
            drafts={drafts}
            onUpdateDraft={handleUpdateDraft}
            resultsByTool={resultsByTool}
            history={history}
            onSaveResult={handleSaveResult}
            onNavigate={handleNavigate}
          />
        )}

        {activeSection === AppSection.Pricing && (
          <PricingSection onNavigate={handleNavigate} />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

