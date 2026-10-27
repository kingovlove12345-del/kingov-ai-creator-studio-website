import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { HERO_SHOWCASE_IMAGE, STUDIOS_CATALOG } from '../data/studios';
import { AppSection, type ServiceStatusResponse } from '../types/studio';
import { ResilientImage } from './ResilientImage';

interface OverviewSectionProps {
  serviceStatus: ServiceStatusResponse | null;
  onNavigate: (section: AppSection, toolId?: string) => void;
}

export function OverviewSection({
  serviceStatus,
  onNavigate,
}: OverviewSectionProps) {
  const aiReady = serviceStatus?.aiConfigured !== false;

  return (
    <div>
      {/* Hero Section — Navy Blue, White & Imperial Gold */}
      <section className="bg-[#0B192C] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Proposition Column */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#F5C451] font-medium mb-4">
                <span>Built for Nigeria & Global Creators</span>
                <span aria-hidden="true">·</span>
                <span>5 Specialized Studios</span>
                <span aria-hidden="true">·</span>
                <span>Free Preview Access</span>
              </div>

              <h1
                className="font-display text-[clamp(2rem,4vw,3.5rem)] font-extrabold leading-[1.12] tracking-tight text-white mb-5 max-w-2xl"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                Write screenplays, social hooks, ad campaigns, and study guides in one studio.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl tracking-[0.01em]">
                KingOv AI Creator Studio brings filmmaking, social media scripting,
                voice-over copy, business marketing, and exam preparation together in a
                fast, mobile-ready web workspace tailored for creators in Nigeria and
                worldwide.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5">
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Movie)}
                  className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5C451] text-[#0B192C] font-display font-bold text-sm sm:text-base hover:bg-[#fad16b] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Start Creating in Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Pricing)}
                  className="min-h-[48px] inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-slate-200 hover:text-[#F5C451] underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
                >
                  Explore Provisional Pricing
                </button>
              </div>
            </div>

            {/* Right Visual Showcase Column */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden border border-white/15 min-h-[260px] sm:min-h-[340px]">
              <ResilientImage
                src={HERO_SHOWCASE_IMAGE.src}
                alt={HERO_SHOWCASE_IMAGE.alt}
                fallbackTitle="KingOv AI Creator Studio Workspace"
                className="w-full h-full lg:h-full object-cover aspect-video lg:aspect-auto"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 bg-gradient-to-t from-black/85 via-black/45 to-transparent">
                <p className="text-xs sm:text-sm text-slate-100 font-medium">
                  From Nollywood script drafts and TikTok storyboards to SME WhatsApp
                  promotions and WAEC/university study notes.
                </p>
              </div>
            </div>
          </div>

          {/* Full-width 4-column summary strip below hero split */}
          <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F5C451] tabular-nums">
                05
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Dedicated Content Studios
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                22
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Specialized Writing Tools
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                Server
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Protected Backend AI Calls
              </div>
            </div>
            <div>
              <div className="font-mono text-2xl sm:text-3xl font-bold text-[#F5C451] tabular-nums">
                ₦0 / $0
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1">
                Open Testing — No Card Needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Creator Studios — Asymmetric Bento Directory */}
      <section className="py-14 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-semibold text-[#8A6408] mb-2">
              Complete Creative Suite · Click any studio or tool to launch
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0B192C] tracking-tight"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Five purpose-built studios designed for mobile and desktop workflows
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {STUDIOS_CATALOG.map((studio, index) => {
              const isWide = index === 0 || index === 4;
              const section = studio.id as unknown as AppSection;

              return (
                <article
                  key={studio.id}
                  className={`${
                    isWide ? 'lg:col-span-7' : 'lg:col-span-5'
                  } rounded-2xl border border-slate-200 bg-slate-50/60 hover:border-[#0B192C]/40 transition-colors flex flex-col justify-between overflow-hidden`}
                >
                  {isWide && (
                    <div className="h-48 sm:h-56 w-full overflow-hidden border-b border-slate-200">
                      <ResilientImage
                        src={studio.showcaseImage}
                        alt={studio.showcaseAlt}
                        fallbackTitle={studio.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mb-2">
                        <span>
                          {studio.editorialIndex}. {studio.tagline}
                        </span>
                        <span className="font-mono tabular-nums shrink-0">
                          {studio.tools.length} tools
                        </span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C] mb-2.5">
                        {studio.title}
                      </h3>

                      <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed mb-5">
                        {studio.summary}
                      </p>

                      {/* Direct sub-tool jump buttons */}
                      <div className="pt-4 border-t border-slate-200/80 mb-6">
                        <div className="text-xs font-medium text-slate-500 mb-2.5">
                          Jump directly to a tool:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {studio.tools.map((tool) => (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => onNavigate(section, tool.id)}
                              className="min-h-[38px] px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-800 hover:border-[#0B192C] hover:text-[#0B192C] transition-colors whitespace-nowrap shrink-0"
                            >
                              {tool.shortLabel}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <span className="text-xs text-slate-500">
                        {aiReady
                          ? 'Live AI · Server-side Gemini'
                          : 'Awaiting server API key'}
                      </span>

                      <button
                        type="button"
                        onClick={() => onNavigate(section)}
                        className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B192C] text-white text-xs sm:text-sm font-semibold hover:bg-[#162d4c] transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Open {studio.navLabel}</span>
                        <ArrowRight className="w-4 h-4 text-[#F5C451]" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Transparency & Live AI vs. Preview Matrix */}
      <section className="py-14 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8">
            <p className="text-xs sm:text-sm font-semibold text-[#8A6408] mb-2">
              Platform Transparency · Live AI vs. Preview Scope
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-[#0B192C] tracking-tight mb-3"
              style={{ textWrap: 'balance' } as React.CSSProperties}
            >
              Clear distinction between live AI tools and provisional business previews
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              KingOv AI Creator Studio never displays pre-written mock responses as live AI
              generations. Every studio request is processed through our server-side
              backend so API keys never appear in browser code.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                    <th className="py-3.5 px-5">Platform Area</th>
                    <th className="py-3.5 px-5">Included Capabilities</th>
                    <th className="py-3.5 px-5">Connection Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-4 px-5 font-semibold text-[#0B192C]">
                      01–05. All Five Content Studios
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      Movie scripts, character profiles, scene & video text prompts, TikTok/YouTube/IG
                      copy, voice-over scripts, SME ads, study notes & quizzes (22 tools total)
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          {aiReady
                            ? 'Live Server-Side AI Service'
                            : 'Live Backend Endpoint (Needs Key)'}
                        </span>
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-4 px-5 font-semibold text-[#0B192C]">
                      AI Video-Generation Prompts
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      Generates detailed camera, lighting, lens & motion text prompts ready to paste
                      into video rendering platforms (does not bill or render paid MP4 video files)
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 whitespace-nowrap">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Live AI Text Prompt Generation</span>
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-4 px-5 font-semibold text-[#0B192C]">
                      Pricing Plans & Checkout
                    </td>
                    <td className="py-4 px-5 text-slate-600">
                      Proposed Free, Pay-per-use, and Premium Monthly plans in NGN (₦) and USD ($).
                      No payment gateway is active and no payment is required to test the site.
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center gap-1.5 font-medium text-amber-800 whitespace-nowrap">
                        <Info className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Provisional Proposal (No Billing Active)</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
