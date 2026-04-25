import Link from "next/link";
import { buildTeamRecords, buildChampionshipSummary, BBCOR_ERA_START } from "@/data/programHistory";
import PageHeader from "@/components/PageHeader";
import { EditorialDivider } from "@/components/SectionHeader";
import TeamRecordsSection from "./TeamRecords";

export const metadata = {
  title: "Team Records · Gig Harbor Tides Baseball",
};

export default function TeamRecordsPage() {
  const allTime = buildTeamRecords("all");
  const bbcor = buildTeamRecords("bbcor");
  const champs = buildChampionshipSummary();

  return (
    <main className="bg-cream min-h-screen pb-24">
      <PageHeader
        kicker="Program History · Team Records"
        title="TEAM RECORDS"
        subtitle={
          <span
            className="text-white/60 leading-snug"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1rem",
            }}
          >
            Season highs, single-game peaks, and postseason honors. Toggle to
            BBCOR Era to limit comparisons to {BBCOR_ERA_START}+ seasons.
          </span>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
        <EditorialDivider label="Program Team Records" />

        <div className="flex flex-wrap items-center justify-between gap-3 -mt-4">
          <Link
            href="/history/career-leaders"
            className="font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy"
          >
            ← Career Leaders
          </Link>
          <Link
            href="/history/records"
            className="font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy"
          >
            Single-Season &amp; Career Leaderboards →
          </Link>
        </div>

        <TeamRecordsSection allTime={allTime} bbcor={bbcor} champs={champs} />

        <div
          className="pt-6 border-t border-navy/10 text-[12px] text-navy/55 italic"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Season Performance, Team Batting, and Team Pitching records are
          computed from each year&rsquo;s team-totals row. Single-Game records
          take the peak value from each year&rsquo;s Team Highlights sheet —
          which means coverage varies by year (some older seasons didn&rsquo;t
          publish all categories). Click any year to jump to that season.
        </div>
      </div>
    </main>
  );
}
