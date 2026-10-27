import { useState } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import { AppSection } from '../types/studio';

interface PricingSectionProps {
  onNavigate: (section: AppSection) => void;
}

type CurrencyDisplay = 'NGN' | 'USD';

interface PlanSpec {
  id: 'free' | 'payg' | 'premium';
  name: string;
  audience: string;
  ngnPrice: string;
  usdPrice: string;
  cadence: string;
  statusNote: string;
  description: string;
  highlights: string[];
  isOpenNow: boolean;
}

const PROVISIONAL_PLANS: PlanSpec[] = [
  {
    id: 'free',
    name: 'Free Starter',
    audience: 'For students, solo creators & initial platform testing',
    ngnPrice: '₦0',
    usdPrice: '$0',
    cadence: 'Open preview access today',
    statusNote: 'Active Now · No Card Required',
    description:
      'Test all five KingOv AI Creator Studios right now in your browser without creating a billing account or entering payment details.',
    highlights: [
      'Access to all 5 Studios & 22 writing tools',
      'Nigeria, Pan-African & Global audience modes',
      'Standard server-side Gemini generation speed',
      'One-click clipboard Copy & .txt file export',
    ],
    isOpenNow: true,
  },
  {
    id: 'payg',
    name: 'Pay-Per-Use Flex',
    audience: 'For occasional filmmakers, SMEs & exam candidates',
    ngnPrice: '₦2,500',
    usdPrice: '$2.00',
    cadence: 'Provisional per 50-generation credit pack',
    statusNote: 'Provisional Proposal · Checkout Not Active',
    description:
      'Designed for creators and business owners who prefer flexible top-up packs instead of recurring monthly commitments.',
    highlights: [
      '50 full-length studio generations per pack',
      'Proposed non-expiring credits across all 5 Studios',
      'Detailed output depth (up to ~1,000 words/run)',
      'Planned support for local NGN transfers & global cards',
    ],
    isOpenNow: false,
  },
  {
    id: 'premium',
    name: 'Premium Monthly',
    audience: 'For Nollywood script rooms, agencies & marketing teams',
    ngnPrice: '₦12,500',
    usdPrice: '$12.00',
    cadence: 'Provisional per month',
    statusNote: 'Provisional Proposal · Checkout Not Active',
    description:
      'Built for high-volume scriptwriters, social media managers, educators, and growing brands producing content daily.',
    highlights: [
      'Up to 600 studio generations per month',
      'Priority queue throughput during peak hours',
      'Full access to screenplay, ad & quiz generators',
      'Cancel or switch to Pay-Per-Use anytime once live',
    ],
    isOpenNow: false,
  },
];

export function PricingSection({ onNavigate }: PricingSectionProps) {
  const [currency, setCurrency] = useState<CurrencyDisplay>('NGN');
  const [selectedPreviewPlan, setSelectedPreviewPlan] = useState<PlanSpec | null>(
    null
  );

  return (
    <div className="bg-slate-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Provisional Notice */}
        <div className="max-w-3xl mb-8">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#8A6408] mb-2">
            <span>Provisional Pricing Proposal</span>
            <span aria-hidden="true">·</span>
            <span>No Payment Required to Test</span>
          </div>

          <h1
            className="font-display text-3xl sm:text-4xl font-extrabold text-[#0B192C] tracking-tight mb-4"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            Transparent, flexible plans proposed for Nigeria and global creators
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            All paid figures shown below are <strong>provisional proposed rates</strong>{' '}
            shared for customer planning and feedback. Billing and payment checkout are
            not enabled during this preview phase—you can test every studio tool free of
            charge right now.
          </p>
        </div>

        {/* Provisional Disclosure Banner */}
        <div className="mb-8 rounded-2xl bg-[#0B192C] text-white p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#F5C451] shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-white font-semibold">
                Important Billing Transparency:
              </strong>{' '}
              No credit card, bank transfer, or payment gateway is connected to this
              preview website. Clicking a proposed paid tier will never simulate a fake
              purchase or charge you.
            </div>
          </div>

          {/* Currency Reference Switcher */}
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl shrink-0 self-start md:self-center">
            <button
              type="button"
              onClick={() => setCurrency('NGN')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                currency === 'NGN'
                  ? 'bg-[#F5C451] text-[#0B192C]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              NGN (₦) Nigeria
            </button>
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                currency === 'USD'
                  ? 'bg-[#F5C451] text-[#0B192C]'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              USD ($) Global
            </button>
          </div>
        </div>

        {/* Non-Payment Plan Inspection Disclosure (When user clicks a provisional paid plan) */}
        {selectedPreviewPlan && (
          <div
            role="status"
            className="mb-8 rounded-2xl bg-amber-50 border border-amber-300 p-5 sm:p-6 text-amber-950"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-base sm:text-lg font-bold text-[#0B192C]">
                  {selectedPreviewPlan.name} ({currency === 'NGN' ? selectedPreviewPlan.ngnPrice : selectedPreviewPlan.usdPrice}) — Provisional Plan Preview Only
                </h2>
                <p className="text-xs sm:text-sm text-amber-900 mt-1 leading-relaxed max-w-2xl">
                  No purchase has been made and no payment was processed. Paid checkout is
                  intentionally disabled until official billing approval. In the meantime,
                  all 5 Creator Studios are unlocked for free testing.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onNavigate(AppSection.Movie)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0B192C] text-white text-xs sm:text-sm font-semibold hover:bg-[#162d4c] transition-colors whitespace-nowrap shrink-0"
                >
                  Test Studios Free Now
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewPlan(null)}
                  className="min-h-[44px] px-3 py-2 rounded-xl border border-amber-300 text-xs sm:text-sm font-medium text-amber-950 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3 Plan Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {PROVISIONAL_PLANS.map((plan) => {
            const displayPrice =
              currency === 'NGN' ? plan.ngnPrice : plan.usdPrice;
            const secondaryPrice =
              currency === 'NGN'
                ? `Approx. ${plan.usdPrice} USD`
                : `Approx. ${plan.ngnPrice} NGN`;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl bg-white p-6 sm:p-7 flex flex-col justify-between border ${
                  plan.id === 'premium'
                    ? 'border-[#0B192C] ring-1 ring-[#0B192C]'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="text-xs font-semibold text-[#8A6408] mb-1.5">
                    {plan.statusNote}
                  </div>

                  <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B192C]">
                    {plan.name}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 mb-5">
                    {plan.audience}
                  </p>

                  <div className="pb-5 mb-5 border-b border-slate-200">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0B192C] tabular-nums">
                        {displayPrice}
                      </span>
                      {!plan.isOpenNow && (
                        <span className="text-xs font-semibold text-amber-800">
                          (Provisional)
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span>{plan.cadence}</span>
                      {!plan.isOpenNow && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {secondaryPrice}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {plan.description}
                  </p>

                  <ul className="space-y-2.5 mb-7">
                    {plan.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                      >
                        <Check className="w-4 h-4 text-[#8A6408] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.isOpenNow ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(AppSection.Movie)}
                    className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B192C] hover:bg-[#162d4c] text-white font-display font-bold text-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>Start Free in Studio</span>
                    <ArrowRight className="w-4 h-4 text-[#F5C451]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewPlan(plan)}
                    className="w-full min-h-[48px] inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[#0B192C] font-display font-semibold text-sm transition-colors whitespace-nowrap shrink-0"
                  >
                    Preview Plan (Checkout Inactive)
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Concrete Plan Comparison Matrix */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="font-display text-lg font-bold text-[#0B192C]">
              Proposed Plan Comparison Matrix
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Side-by-side breakdown of active free preview access versus proposed future
              commercial tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-600">
                  <th className="py-3.5 px-6">Specification</th>
                  <th className="py-3.5 px-6">Free Starter</th>
                  <th className="py-3.5 px-6">Pay-Per-Use (Provisional)</th>
                  <th className="py-3.5 px-6">Premium Monthly (Provisional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-800">
                    Proposed Price ({currency})
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums font-semibold text-[#0B192C]">
                    {currency === 'NGN' ? '₦0' : '$0.00'}
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums text-slate-700">
                    {currency === 'NGN' ? '₦2,500 / pack' : '$2.00 / pack'}
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums text-slate-700">
                    {currency === 'NGN' ? '₦12,500 / mo' : '$12.00 / mo'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-800">
                    Generation Allowance
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums text-slate-700">
                    Shared free-tier API quota
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums text-slate-700">
                    50 generations / pack
                  </td>
                  <td className="py-3.5 px-6 font-mono tabular-nums text-slate-700">
                    600 generations / month
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-800">
                    Studios Included
                  </td>
                  <td className="py-3.5 px-6 text-slate-700">All 5 Studios (22 tools)</td>
                  <td className="py-3.5 px-6 text-slate-700">All 5 Studios (22 tools)</td>
                  <td className="py-3.5 px-6 text-slate-700">All 5 Studios (22 tools)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-6 font-medium text-slate-800">
                    Current Availability
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-emerald-700">
                    Available Now (Free Testing)
                  </td>
                  <td className="py-3.5 px-6 text-amber-800">
                    Provisional — Billing Off
                  </td>
                  <td className="py-3.5 px-6 text-amber-800">
                    Provisional — Billing Off
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
