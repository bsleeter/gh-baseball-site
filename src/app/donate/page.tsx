"use client";

import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";

export default function DonatePage() {
  return (
    <>
      <PageHeader
        kicker="Field Renovation"
        title={
          <>
            BRINGING OUR<br />
            <span className="text-carolina-light">TIDES HOME</span>
          </>
        }
        subtitle="Renovating the Gig Harbor High School baseball field so our players can finally play at home."
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <EditorialDivider label="The Project" />

        <section className="mb-12">
          <SectionHeader title="Our Goal" kicker="Why it matters" />
          <div className="record-paper border border-navy/15 p-6 sm:p-8 shadow-[0_1px_0_rgba(27,42,74,0.04),0_12px_30px_-18px_rgba(27,42,74,0.25)] space-y-4">
            <p
              className="text-navy/80 leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem" }}
            >
              The Gig Harbor High School baseball field needs significant
              improvements. Currently, our varsity team plays all home games
              off-campus at Sehmel Homestead Park because the on-campus field
              cannot host games.
            </p>
            <p
              className="text-navy/80 leading-relaxed"
              style={{ fontFamily: "var(--font-serif)", fontSize: "1.02rem" }}
            >
              The Booster Club is working with the Peninsula School District to
              renovate the GHHS baseball field so our players can finally play
              at home — building school pride, increasing attendance, and
              creating a facility that serves the entire community.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <SectionHeader title="Scope of Work" kicker="Improvements" />
          <div className="record-paper border border-navy/15 shadow-[0_1px_0_rgba(27,42,74,0.04),0_12px_30px_-18px_rgba(27,42,74,0.25)]">
            {[
              "Infield renovation with proper drainage and grading",
              "Warning track replacement for player safety",
              "Fencing repairs and upgrades",
              "Bullpen improvements",
              "Overall field improvements to meet game-ready standards",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 sm:px-6 py-4 border-b border-navy/10 last:border-b-0"
              >
                <span className="shrink-0 font-body text-[10px] font-medium tracking-[0.18em] text-navy/25 tabular-nums w-6 mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="shrink-0 w-5 h-5 rounded-full bg-carolina/15 flex items-center justify-center mt-0.5">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="#4B9CD3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span
                  className="text-navy/80"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "0.98rem",
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="record-paper border border-dashed border-navy/20 p-8 text-center">
          <div className="font-display text-3xl text-navy tracking-wide mb-3">
            MORE DETAILS COMING SOON
          </div>
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="h-px w-10 bg-carolina" />
            <span className="font-heading text-[10px] uppercase tracking-[0.3em] text-navy/40">
              Stay Tuned
            </span>
            <span className="h-px w-10 bg-carolina" />
          </div>
          <p
            className="text-navy/65 leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: "var(--font-serif)", fontSize: "0.98rem" }}
          >
            We&rsquo;re finalizing plans and costs with the district. Check back
            for updates on how you can help support this project.
          </p>
          <div className="mt-8 pt-6 border-t border-navy/10">
            <p className="font-heading font-bold text-[10px] uppercase tracking-[0.3em] text-navy/50 mb-2">
              Contact the Booster Club
            </p>
            <a
              href="mailto:scottharthornjr@gmail.com"
              className="text-carolina-dark hover:text-carolina font-heading font-semibold text-sm tracking-wider transition-colors"
            >
              scottharthornjr@gmail.com
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
