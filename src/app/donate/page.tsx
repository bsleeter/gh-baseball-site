"use client";

export default function DonatePage() {
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
            BRINGING OUR<br />
            <span className="text-carolina-light">TIDES HOME</span>
          </h1>
          <p className="mt-4 text-white/50 text-lg font-heading max-w-xl">
            Renovating the Gig Harbor High School baseball field
          </p>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-12 bg-cream"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Overview */}
        <section className="mb-10">
          <h2 className="font-display text-2xl tracking-wide text-navy mb-4">
            OUR GOAL
          </h2>
          <p className="text-navy/70 font-heading leading-relaxed mb-4">
            The Gig Harbor High School baseball field needs significant improvements. Currently, our varsity team plays all home games off-campus at Sehmel Homestead Park because the on-campus field cannot host games.
          </p>
          <p className="text-navy/70 font-heading leading-relaxed">
            The Booster Club is working with the Peninsula School District to renovate the GHHS baseball field so our players can finally play at home — building school pride, increasing attendance, and creating a facility that serves the entire community.
          </p>
        </section>

        {/* What needs to happen */}
        <section className="mb-10">
          <h2 className="font-display text-2xl tracking-wide text-navy mb-4">
            WHAT WE&rsquo;RE WORKING ON
          </h2>
          <div className="space-y-3">
            {[
              "Infield renovation with proper drainage and grading",
              "Warning track replacement for player safety",
              "Fencing repairs and upgrades",
              "Bullpen improvements",
              "Overall field improvements to meet game-ready standards",
            ].map((item, i) => (
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

        {/* Coming soon */}
        <section className="bg-white rounded-lg border border-navy/8 p-8 text-center">
          <div className="font-display text-3xl text-navy tracking-wide mb-3">
            MORE DETAILS COMING SOON
          </div>
          <div className="stitch-line max-w-[150px] mx-auto mb-4" />
          <p className="text-navy/60 font-heading leading-relaxed max-w-md mx-auto">
            We&rsquo;re finalizing plans and costs with the district. Check back for updates on how you can help support this project.
          </p>
          <p className="mt-6 text-sm font-heading text-navy/50">
            Questions? Contact the Booster Club:<br />
            <a href="mailto:scottharthornjr@gmail.com" className="text-carolina-dark hover:text-carolina font-semibold transition-colors">
              scottharthornjr@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
