import { STUDIOS_CATALOG } from '../data/studios';
import { AppSection } from '../types/studio';

interface FooterProps {
  onNavigate: (section: AppSection) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#0B192C] text-slate-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          <div className="md:col-span-5">
            <button
              type="button"
              onClick={() => onNavigate(AppSection.Overview)}
              className="font-display text-lg font-extrabold text-white tracking-tight hover:text-[#F5C451] transition-colors text-left"
            >
              KingOv AI Creator Studio
            </button>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-sm">
              All-in-one AI content creation web studio serving filmmakers, social media
              creators, scriptwriters, businesses, and students in Nigeria and worldwide.
            </p>
          </div>

          <div className="md:col-span-4">
            <h3 className="font-display text-xs font-semibold text-[#F5C451] tracking-wide mb-3">
              Creator Studios
            </h3>
            <ul className="space-y-2 text-sm">
              {STUDIOS_CATALOG.map((studio) => (
                <li key={studio.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(studio.id as unknown as AppSection)}
                    className="text-slate-300 hover:text-white transition-colors py-1"
                  >
                    {studio.editorialIndex}. {studio.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-display text-xs font-semibold text-[#F5C451] tracking-wide mb-3">
              Platform & Plans
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Overview)}
                  className="text-slate-300 hover:text-white transition-colors py-1"
                >
                  Platform Overview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Pricing)}
                  className="text-slate-300 hover:text-white transition-colors py-1"
                >
                  Provisional Pricing Plans
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} KingOv AI Creator Studio. Web Application Edition.</p>
          <p>
            Server-side AI architecture · No client-side API keys · Open preview mode
          </p>
        </div>
      </div>
    </footer>
  );
}
