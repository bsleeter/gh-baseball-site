"use client";

import { useState } from "react";
import {
  donationTiers,
  sponsors,
  renovationDetails,
} from "@/data/donations";
import { useFundraising } from "@/lib/hooks";

export default function DonatePage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const { data: fundraising } = useFundraising();
  const fundraisingGoal = fundraising?.goal ?? 50000;
  const fundraisingRaised = fundraising?.raised ?? 0;
  const pct = Math.round((fundraisingRaised / fundraisingGoal) * 100);

  const amount = selectedAmount ?? (customAmount ? parseInt(customAmount) : 0);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 noise-bg" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-[60px] bg-carolina" />
            <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-[0.25em]">
              Field Renovation
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl text-white tracking-wide leading-[0.9]">
            {renovationDetails.title.toUpperCase()}
          </h1>
          <p className="mt-4 text-white/50 text-lg font-heading max-w-xl">
            {renovationDetails.subtitle}
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-cream"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-10">
            {/* Why it matters */}
            <section>
              <h2 className="font-display text-2xl tracking-wide text-navy mb-4">
                WHY THIS MATTERS
              </h2>
              <p className="text-navy/70 font-heading leading-relaxed mb-6">
                {renovationDetails.description}
              </p>
              <div className="space-y-3">
                {renovationDetails.whyItMatters.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-carolina/15 flex items-center justify-center mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#4B9CD3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="font-heading text-navy/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Phased Plan */}
            <section>
              <h2 className="font-display text-2xl tracking-wide text-navy mb-5">
                THE PLAN
              </h2>
              <div className="space-y-4">
                {renovationDetails.phases.map((phase, i) => (
                  <div key={i} className="bg-white rounded-lg border border-navy/8 overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 bg-navy/5 border-b border-navy/8">
                      <h3 className="font-heading font-bold text-sm text-navy uppercase tracking-wider">
                        {phase.name}
                      </h3>
                      <span className="font-heading text-xs text-carolina-dark font-semibold uppercase tracking-wider">
                        {phase.cost}
                      </span>
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider bg-carolina/10 text-carolina-dark mb-3">
                        {phase.priority}
                      </span>
                      <ul className="space-y-2">
                        {phase.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm font-heading text-navy/70">
                            <span className="shrink-0 text-carolina mt-0.5">&#9679;</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost summary */}
              <div className="mt-4 bg-navy rounded-lg p-5 text-white">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="score-display text-xl">{renovationDetails.totalCost}</span>
                    <span className="block text-[10px] font-heading uppercase tracking-wider text-white/50 mt-1">Total Project</span>
                  </div>
                  <div>
                    <span className="score-display text-xl text-carolina-light">{renovationDetails.boosterFunds}</span>
                    <span className="block text-[10px] font-heading uppercase tracking-wider text-white/50 mt-1">Booster Committed</span>
                  </div>
                  <div>
                    <span className="score-display text-xl">{renovationDetails.fundingNeeded}</span>
                    <span className="block text-[10px] font-heading uppercase tracking-wider text-white/50 mt-1">Still Needed</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Donation tiers */}
            <section>
              <h2 className="font-display text-2xl tracking-wide text-navy mb-4">
                CHOOSE YOUR LEVEL
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => {
                      setSelectedAmount(tier.amount);
                      setCustomAmount("");
                    }}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAmount === tier.amount
                        ? "border-carolina bg-carolina/5 shadow-md"
                        : "border-navy/10 bg-white hover:border-carolina/40"
                    }`}
                  >
                    <span className="score-display text-2xl text-navy">${tier.amount}</span>
                    <span className="block font-heading font-bold text-sm text-carolina-dark uppercase tracking-wider mt-1">
                      {tier.label}
                    </span>
                    <span className="block text-xs text-navy/50 font-heading mt-1">
                      {tier.description}
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="mt-4">
                <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-2">
                  Or enter a custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-xl text-navy/40">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="0"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-navy/10 bg-white font-heading text-lg text-navy focus:border-carolina focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Donate button */}
              <button
                disabled={!amount || amount <= 0}
                className="mt-6 w-full bg-carolina hover:bg-carolina-dark disabled:bg-navy/20 disabled:cursor-not-allowed text-white font-heading font-bold uppercase tracking-wider text-sm py-4 rounded-lg transition-colors"
              >
                {amount > 0
                  ? `Donate $${amount.toLocaleString()}`
                  : "Select an Amount"}
              </button>
              <p className="text-xs text-navy/40 font-heading mt-2 text-center">
                Contact the Booster Club to donate: <a href="mailto:cpayne_9@me.com" className="text-carolina-dark hover:text-carolina">cpayne_9@me.com</a>
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div className="bg-white rounded-lg border border-navy/8 overflow-hidden sticky top-24">
              <div className="bg-navy px-5 py-4">
                <h3 className="font-display text-xl text-white tracking-wide">
                  FUNDRAISING PROGRESS
                </h3>
              </div>
              <div className="p-5">
                <div className="text-center mb-4">
                  <span className="score-display text-4xl text-navy">
                    ${fundraisingRaised.toLocaleString()}
                  </span>
                  <span className="block text-xs font-heading text-navy/50 mt-1 uppercase tracking-wider">
                    raised of ${fundraisingGoal.toLocaleString()} goal
                  </span>
                </div>

                {/* Thermometer */}
                <div className="relative h-6 bg-navy/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-carolina to-carolina-light rounded-full animate-fill relative"
                    style={{ width: `${pct}%` }}
                  >
                    {pct > 10 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-heading font-bold text-white">
                        {pct}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-xs font-heading text-navy/40">
                  <span>$0</span>
                  <span>${(fundraisingGoal / 2).toLocaleString()}</span>
                  <span>${fundraisingGoal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Current situation */}
            <div className="bg-white rounded-lg border border-navy/8 p-5">
              <h3 className="font-display text-lg tracking-wide text-navy mb-3">THE PROBLEM</h3>
              <div className="space-y-2 text-sm font-heading text-navy/70">
                <p>Our players deserve to play at home. Currently, the GHHS baseball field cannot host games due to:</p>
                <ul className="space-y-1.5 mt-2">
                  <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">&#9679;</span> Standing water with no drainage</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">&#9679;</span> Dangerous rock warning track</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">&#9679;</span> Deteriorated fencing with gaps</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">&#9679;</span> No proper infield mix</li>
                  <li className="flex items-start gap-2"><span className="text-red-400 shrink-0">&#9679;</span> Unusable bullpens</li>
                </ul>
              </div>
            </div>

            {/* Sponsors */}
            <div className="bg-white rounded-lg border border-navy/8 p-5">
              <h3 className="font-display text-lg tracking-wide text-navy mb-4">OUR SPONSORS</h3>
              {["Gold", "Silver", "Bronze"].map((tier) => {
                const tierSponsors = sponsors.filter((s) => s.tier === tier);
                if (tierSponsors.length === 0) return null;
                return (
                  <div key={tier} className="mb-4 last:mb-0">
                    <h4 className="font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-2">
                      {tier} Sponsors
                    </h4>
                    <div className="space-y-1.5">
                      {tierSponsors.map((s) => (
                        <div
                          key={s.name}
                          className="px-3 py-2 bg-navy/5 rounded text-sm font-heading font-semibold text-navy"
                        >
                          {s.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg border border-navy/8 p-5">
              <h3 className="font-display text-lg tracking-wide text-navy mb-2">GET INVOLVED</h3>
              <p className="text-sm font-heading text-navy/70 leading-relaxed">
                Interested in sponsorship, volunteering, or making a donation? Contact the Booster Club:
              </p>
              <p className="mt-2">
                <a href="mailto:cpayne_9@me.com" className="text-sm font-heading font-semibold text-carolina-dark hover:text-carolina transition-colors">
                  cpayne_9@me.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
