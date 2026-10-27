import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AppSection, type StudioId } from '../types/studio';
import { STUDIOS_CATALOG } from '../data/studios';

interface HeaderProps {
  activeSection: AppSection;
  onNavigate: (section: AppSection, toolId?: string) => void;
}

export function Header({ activeSection, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: AppSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B192C]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto h-14 sm:h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick(AppSection.Overview)}
          className="font-display text-base sm:text-lg font-extrabold tracking-tight text-white hover:text-[#F5C451] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5C451] text-left min-h-[44px] flex items-center"
        >
          KingOv AI Creator Studio
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Creator Studios"
          className="hidden lg:flex items-center gap-6 text-sm font-medium"
        >
          {STUDIOS_CATALOG.map((studio) => {
            const section = studio.id as unknown as AppSection;
            const isActive = activeSection === section;
            return (
              <button
                key={studio.id}
                type="button"
                onClick={() => handleNavClick(section)}
                className={`min-h-[44px] inline-flex items-center border-b-2 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5C451] ${
                  isActive
                    ? 'border-[#F5C451] text-white font-semibold'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-white/40'
                }`}
              >
                {studio.navLabel}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (Desktop) + Mobile Drawer Toggle */}
        <div className="flex items-center shrink-0">
          {activeSection === AppSection.Pricing ? (
            <button
              type="button"
              onClick={() => handleNavClick(AppSection.Movie)}
              className="hidden lg:inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#F5C451] text-[#0B192C] rounded-lg hover:bg-[#fad16b] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Open Studio
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick(AppSection.Pricing)}
              className="hidden lg:inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-xs font-semibold bg-[#F5C451] text-[#0B192C] rounded-lg hover:bg-[#fad16b] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Pricing Plans
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-[#F5C451]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B192C] border-b border-white/15 px-4 pt-2 pb-5 shadow-xl">
          <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-white/10">
            <button
              type="button"
              onClick={() => handleNavClick(AppSection.Overview)}
              className={`min-h-[48px] flex items-center justify-between text-left text-sm font-medium py-2.5 ${
                activeSection === AppSection.Overview
                  ? 'text-[#F5C451] font-semibold'
                  : 'text-slate-200'
              }`}
            >
              <span>Home & Studio Overview</span>
              <span className="text-xs text-slate-400">Start</span>
            </button>

            {STUDIOS_CATALOG.map((studio) => {
              const section = studio.id as StudioId as unknown as AppSection;
              const isActive = activeSection === section;
              return (
                <button
                  key={studio.id}
                  type="button"
                  onClick={() => handleNavClick(section)}
                  className={`min-h-[48px] flex items-center justify-between text-left text-sm font-medium py-2.5 ${
                    isActive ? 'text-[#F5C451] font-semibold' : 'text-slate-200'
                  }`}
                >
                  <span>
                    {studio.editorialIndex}. {studio.title}
                  </span>
                  <span className="text-xs text-slate-400 tabular-nums">
                    {studio.tools.length} tools
                  </span>
                </button>
              );
            })}

            <div className="pt-3">
              <button
                type="button"
                onClick={() => handleNavClick(AppSection.Pricing)}
                className="w-full min-h-[48px] inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#F5C451] text-[#0B192C] font-semibold text-sm hover:bg-[#fad16b] transition-colors"
              >
                View Provisional Pricing Plans
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
