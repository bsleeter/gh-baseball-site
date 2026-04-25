import Link from "next/link";
import { buildCareerHallOfFame, BBCOR_ERA_START } from "@/data/programHistory";
import PageHeader from "@/components/PageHeader";
import { EditorialDivider } from "@/components/SectionHeader";
import CareerHallOfFameSection from "./CareerHallOfFame";

export const metadata = {
  title: "Career Leaders · Gig Harbor Tides Baseball",
};

export default function CareerLeadersPage() {
  // Compute both bundles at build time so the client toggle is instant.
  const allTime = buildCareerHallOfFame("all");
  const bbcor = buildCareerHallOfFame("bbcor");

  return (
    <main className="bg-cream min-h-screen pb-24">
      <PageHeader
        kicker="Program History · Career Records"
        title="CAREER LEADERS"
        subtitle={
          <span
            className="text-white/60 leading-snug"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1rem",
            }}
          >
            Aggregated across every archived season. Toggle to BBCOR Era to
            see records limited to {BBCOR_ERA_START}+ seasons of each
            player&rsquo;s career.
          </span>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
        <EditorialDivider label="Program Career Records" />

        {/* Quick nav strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 -mt-4">
          <Link
            href="/history/records"
            className="font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy"
          >
            ← Single-Season &amp; Deep Leaderboards
          </Link>
          <Link
            href="/history"
            className="font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy"
          >
            All Seasons
          </Link>
        </div>

        <CareerHallOfFameSection allTime={allTime} bbcor={bbcor} />

        <div
          className="pt-6 border-t border-navy/10 text-[12px] text-navy/55 italic"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Career stats accumulate across every season a player appears in the
          archive. Rate stats (AVG, OBP, SLG, ERA, WHIP, K/Game, K/BB) require a
          minimum sample to qualify; absolute totals (Hits, HR, etc.) include
          every player who has at least one. The &ldquo;Active&rdquo; tag
          marks any career whose most recent listed season is the latest year
          in the archive — meaning the record could still be growing.
        </div>
      </div>
    </main>
  );
}
