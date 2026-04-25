import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSeason,
  yearsAvailable,
  buildSeasonLeaderMap,
  buildSeasonHallOfFame,
  formatRatio,
  formatERA,
  type Season,
} from "@/data/programHistory";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";
import { BattingTable, PitchingTable } from "./StatTables";
import HallOfFameSection from "./HallOfFame";

export const dynamicParams = false; // only the years we have

/** Loose match for "Pete Jansen" vs "Peter Jansen" so we don't double-list. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/\bpeter\b/, "pete")
    .replace(/[^a-z]/g, "");
}

export function generateStaticParams() {
  return yearsAvailable.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  return {
    title: `${year} Season · Gig Harbor Tides Baseball`,
  };
}

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;
  const season = getSeason(year);
  if (!season) notFound();

  const idx = yearsAvailable.indexOf(season.year);
  const prevYear = idx > 0 ? yearsAvailable[idx - 1] : null;
  const nextYear =
    idx < yearsAvailable.length - 1 ? yearsAvailable[idx + 1] : null;

  const leaderMap = buildSeasonLeaderMap(season);
  const hof = buildSeasonHallOfFame(season);
  const hofBatting = hof.filter((h) => h.group === "batting");
  const hofPitching = hof.filter((h) => h.group === "pitching");
  const hofOther = hof.filter((h) => h.group === "other");

  // Header stats
  const headerStats: { value: string | number; label: string }[] = [];
  if (season.record) {
    headerStats.push({
      value: `${season.record.W}–${season.record.L}`,
      label: "W–L",
    });
  }
  if (season.teamBatting?.AVG !== undefined) {
    headerStats.push({
      value: formatRatio(season.teamBatting.AVG),
      label: "Team AVG",
    });
  }
  if (season.teamPitching?.ERA !== undefined) {
    headerStats.push({
      value: formatERA(season.teamPitching.ERA),
      label: "Team ERA",
    });
  }

  const titles: string[] = [];
  if (season.stateChamp) titles.push("State Champions");
  if (season.districtChamp) titles.push("District Champions");
  if (season.statePlace)
    titles.push(season.statePlace === 2 ? "2nd at State" : "3rd at State");
  if (season.leagueChamp) titles.push("League Champions");

  return (
    <main className="bg-cream min-h-screen pb-24">
      <PageHeader
        kicker={`Season ${season.year} · ${
          season.era === "bbcor" ? "BBCOR Era" : "Pre-BBCOR Era"
        }`}
        title={String(season.year)}
        subtitle={
          <div className="flex flex-wrap gap-x-6 gap-y-1 items-baseline">
            {season.league && (
              <span
                className="text-white/60 leading-snug"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                }}
              >
                {season.league}
              </span>
            )}
            {season.headCoach && (
              <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-white/55">
                Head Coach:{" "}
                <span className="text-carolina-light">{season.headCoach}</span>
              </span>
            )}
            {(() => {
              const assistants = season.coaches.filter(
                (c) =>
                  !season.headCoach ||
                  normalize(c) !== normalize(season.headCoach),
              );
              return assistants.length > 0 ? (
                <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-white/40">
                  Assistants: {assistants.join(" · ")}
                </span>
              ) : null;
            })()}
          </div>
        }
        stats={headerStats}
      >
        {titles.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {titles.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-[0.18em] bg-amber-300/20 border border-amber-300/40 text-amber-200"
              >
                ★ {t}
              </span>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-14">
        <EditorialDivider label={`Season Record · ${season.year}`} />

        {/* Year nav strip */}
        <div className="flex items-center justify-between -mt-6 mb-4 text-sm">
          {prevYear ? (
            <Link
              href={`/history/${prevYear}`}
              className="font-heading text-xs uppercase tracking-[0.22em] text-navy/60 hover:text-navy"
            >
              ← {prevYear}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/history"
            className="font-heading text-xs uppercase tracking-[0.22em] text-navy/60 hover:text-navy"
          >
            All Seasons
          </Link>
          {nextYear ? (
            <Link
              href={`/history/${nextYear}`}
              className="font-heading text-xs uppercase tracking-[0.22em] text-navy/60 hover:text-navy"
            >
              {nextYear} →
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Roster */}
        {season.roster.length > 0 && (
          <section>
            <SectionHeader
              title="Roster"
              count={season.roster.length}
              countLabel="players"
            />
            <RosterGrid season={season} />
          </section>
        )}

        {/* Year Hall of Fame — moved here so top performers are above the fold */}
        {hof.length > 0 && (
          <section>
            <SectionHeader
              title={`${season.year} Top Performers`}
              kicker="Hall of Fame"
            />
            <HallOfFameSection
              seasonYear={season.year}
              seasonIsBbcor={season.era === "bbcor"}
              batting={hofBatting}
              pitching={hofPitching}
              other={hofOther}
            />
          </section>
        )}

        {/* Team Batting */}
        {season.battingLines.length > 0 && (
          <section>
            <SectionHeader
              title="Team Batting"
              kicker="Click any column to sort"
              count={season.battingLines.length}
            />
            <BattingTable
              lines={season.battingLines}
              team={season.teamBatting}
              leaders={Object.fromEntries(
                Object.entries(leaderMap.batting).map(([k, v]) => [
                  k,
                  v as Set<string>,
                ]),
              )}
            />
            <div className="mt-3 text-[11px] text-navy/55 italic">
              Highlighted cells show team leaders. Min 30 AB for AVG/OBP/SLG.
            </div>
          </section>
        )}

        {/* Team Pitching */}
        {season.pitchingLines.length > 0 && (
          <section>
            <SectionHeader
              title="Team Pitching"
              kicker="Click any column to sort"
              count={season.pitchingLines.length}
            />
            <PitchingTable
              lines={season.pitchingLines}
              team={season.teamPitching}
              leaders={Object.fromEntries(
                Object.entries(leaderMap.pitching).map(([k, v]) => [
                  k,
                  v as Set<string>,
                ]),
              )}
            />
            <div className="mt-3 text-[11px] text-navy/55 italic">
              Highlighted cells show team leaders. Min 15 IP for ERA.
            </div>
          </section>
        )}

        {/* Team Highlights */}
        {season.highlights.length > 0 && (
          <section>
            <SectionHeader title="Team Highlights" />
            <HighlightsList highlights={season.highlights} />
          </section>
        )}

        {/* Source quality footer */}
        {Object.keys(season.sourceQuality).length > 0 && (
          <section className="pt-4 border-t border-navy/10">
            <div className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/50 mb-3">
              Source Quality
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
              {Object.entries(season.sourceQuality).map(([sheet, sq]) => (
                <div key={sheet} className="border border-navy/10 rounded p-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-heading font-bold text-[10px] uppercase tracking-[0.18em] text-navy">
                      {sheet}
                    </span>
                    <StatusPill status={sq.status} />
                  </div>
                  {sq.note && (
                    <div
                      className="text-navy/60 leading-snug"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.78rem",
                      }}
                    >
                      {sq.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ─── Roster ──────────────────────────────────────────────────────────

function RosterGrid({ season }: { season: Season }) {
  const sorted = [...season.roster].sort((a, b) => {
    const ga = a.grade ?? 0,
      gb = b.grade ?? 0;
    if (ga !== gb) return gb - ga;
    return (a.num ?? 999) - (b.num ?? 999);
  });
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-1.5 bg-white border border-navy/15 rounded-md p-5">
      {sorted.map((r) => (
        <div
          key={r.player + r.num}
          className="flex items-baseline gap-2 leading-snug"
        >
          {r.num != null && (
            <span className="font-display text-sm text-navy/45 tabular-nums w-7 shrink-0">
              {r.num}
            </span>
          )}
          <span
            className="text-navy"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            {r.player}
          </span>
          {r.grade != null && (
            <span className="text-[10px] font-heading uppercase tracking-[0.15em] text-navy/40 ml-auto">
              {gradeLabel(r.grade)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function gradeLabel(g: number): string {
  if (g === 12) return "Sr";
  if (g === 11) return "Jr";
  if (g === 10) return "So";
  if (g === 9) return "Fr";
  return `Gr${g}`;
}

// ─── Highlights ──────────────────────────────────────────────────────

function HighlightsList({
  highlights,
}: {
  highlights: {
    highlight: string;
    value: string | number | null;
    context: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 bg-white border border-navy/15 rounded-md p-5">
      {highlights.map((h, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between gap-3 border-b border-navy/5 pb-1.5 last:border-b-0"
        >
          <div className="flex-1 min-w-0">
            <div
              className="text-navy"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.92rem",
                fontWeight: 500,
              }}
            >
              {h.highlight}
            </div>
            {h.context && (
              <div className="text-[11px] text-navy/50 italic">{h.context}</div>
            )}
          </div>
          <span className="font-display text-2xl text-navy tabular-nums shrink-0">
            {h.value === null ? "—" : String(h.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "READABLE"
      ? "bg-green-100 text-green-800"
      : status === "NEEDS SPOT-CHECK"
        ? "bg-amber-100 text-amber-900"
        : status === "NEEDS MANUAL UPDATE"
          ? "bg-red-100 text-red-800"
          : "bg-stone-200 text-stone-700";
  return (
    <span
      className={`text-[8.5px] font-heading font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded ${cls}`}
    >
      {status}
    </span>
  );
}
