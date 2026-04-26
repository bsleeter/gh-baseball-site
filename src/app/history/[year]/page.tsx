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
  type ScheduleGame,
} from "@/data/programHistory";
import { varsitySchedule } from "@/data/schedule";
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

/** Pull live schedule entries from the site's authoritative schedule.ts
 *  for the requested year. Used so the active season's year page
 *  reflects /schedule without duplicating data. */
function liveScheduleFor(year: number): ScheduleGame[] {
  const isoPrefix = `${year}-`;
  return varsitySchedule
    .filter((g) => g.type === "game" && g.date.startsWith(isoPrefix))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((g) => {
      // Format ISO date "2026-04-13" → "Apr 13, 2026" (matches archived
      // schedules from older years).
      const d = new Date(g.date + "T12:00:00");
      const dateStr = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const loc =
        g.location === "home"
          ? "Home"
          : g.location === "away"
            ? "Away"
            : "Neutral";
      const score =
        g.scoreUs !== undefined && g.scoreThem !== undefined
          ? `${g.scoreUs}-${g.scoreThem}`
          : "";
      return {
        date: dateStr,
        loc,
        opponent: g.opponent,
        w_l: g.result,
        score,
      } as ScheduleGame;
    });
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

  // For the active season, prefer the live schedule from src/data/schedule.ts
  // (single source of truth shared with /schedule). Fall back to the archived
  // schedule baked into programHistory.json for older years.
  const liveGames = liveScheduleFor(season.year);
  const scheduleGames =
    liveGames.length > 0 ? liveGames : season.schedule;
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

        {/* Roster + Schedule — side by side when both have data */}
        {(season.roster.length > 0 || scheduleGames.length > 0) && (() => {
          const showRoster = season.roster.length > 0;
          const showSchedule = scheduleGames.length > 0;
          const sideBySide = showRoster && showSchedule;
          return (
            <div
              className={`grid gap-6 ${sideBySide ? "lg:grid-cols-2" : "grid-cols-1"}`}
            >
              {showRoster && (
                <section>
                  <SectionHeader
                    title="Roster"
                    count={season.roster.length}
                    countLabel="players"
                  />
                  <RosterGrid season={season} />
                </section>
              )}
              {showSchedule && (
                <section>
                  <SectionHeader
                    title="Schedule & Results"
                    count={scheduleGames.length}
                    countLabel="games"
                  />
                  <ScheduleTable games={scheduleGames} />
                </section>
              )}
            </div>
          );
        })()}

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
  // Group by grade; "Unknown" bucket holds anyone without a grade.
  type Bucket = { key: string; label: string; players: typeof season.roster };
  const buckets: Bucket[] = [
    { key: "12", label: "Seniors", players: [] },
    { key: "11", label: "Juniors", players: [] },
    { key: "10", label: "Sophomores", players: [] },
    { key: "9", label: "Freshmen", players: [] },
  ];
  const other: typeof season.roster = [];
  const unknown: typeof season.roster = [];
  for (const p of season.roster) {
    if (p.grade === 12) buckets[0].players.push(p);
    else if (p.grade === 11) buckets[1].players.push(p);
    else if (p.grade === 10) buckets[2].players.push(p);
    else if (p.grade === 9) buckets[3].players.push(p);
    else if (typeof p.grade === "number") other.push(p);
    else unknown.push(p);
  }
  // Within each grade, sort by jersey number then alphabetically by player.
  const byNumThenName = (a: typeof season.roster[number], b: typeof season.roster[number]) => {
    const an = a.num ?? 999, bn = b.num ?? 999;
    if (an !== bn) return an - bn;
    return a.player.localeCompare(b.player);
  };
  for (const b of buckets) b.players.sort(byNumThenName);
  other.sort(byNumThenName);
  unknown.sort(byNumThenName);

  // Hide buckets that are empty
  const visibleBuckets = buckets.filter((b) => b.players.length > 0);
  if (other.length) {
    visibleBuckets.push({ key: "other", label: "Other Grades", players: other });
  }
  if (unknown.length) {
    visibleBuckets.push({ key: "unknown", label: "Roster", players: unknown });
  }

  // If the only bucket is "Roster" (everyone unknown grade), render flat
  // without per-bucket headers — same look as before.
  const flat = visibleBuckets.length === 1 && visibleBuckets[0].key === "unknown";
  if (flat) {
    return (
      <div className="bg-white border border-navy/15 rounded-md p-5">
        <PlayerColumns players={visibleBuckets[0].players} showGrade={false} />
      </div>
    );
  }

  return (
    <div className="bg-white border border-navy/15 rounded-md p-5 space-y-5">
      {visibleBuckets.map((b, i) => (
        <div key={b.key} className={i > 0 ? "pt-4 border-t border-navy/10" : ""}>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
              {b.label}
            </span>
            <span className="font-heading text-[9px] uppercase tracking-[0.18em] text-navy/35 tabular-nums">
              {b.players.length}
            </span>
          </div>
          <PlayerColumns players={b.players} showGrade={false} />
        </div>
      ))}
    </div>
  );
}

function PlayerColumns({
  players,
  showGrade,
}: {
  players: { num: number | null; player: string; grade: number | null }[];
  showGrade: boolean;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-1">
      {players.map((r) => (
        <div
          key={r.player + (r.num ?? "")}
          className="flex items-baseline gap-2 leading-snug"
        >
          {r.num != null && (
            <span className="font-display text-sm text-navy/45 tabular-nums w-7 shrink-0">
              {r.num}
            </span>
          )}
          <span
            className="text-navy truncate"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            {r.player}
          </span>
          {showGrade && r.grade != null && (
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

// ─── Schedule ───────────────────────────────────────────────────────

function ScheduleTable({ games }: { games: ScheduleGame[] }) {
  const hasRich = games.some((g) => g.date || g.w_l);
  const tally = games.reduce<{ w: number; l: number; t: number }>(
    (acc, g) => {
      if (g.w_l === "W") acc.w += 1;
      else if (g.w_l === "L") acc.l += 1;
      else if (g.w_l === "T") acc.t += 1;
      return acc;
    },
    { w: 0, l: 0, t: 0 },
  );

  if (!hasRich) {
    // Simple opponent + result format (older years)
    return (
      <div className="bg-white border border-navy/15 rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-navy text-white">
            <tr>
              <th className="px-4 py-2.5 text-left font-heading text-[11px] uppercase tracking-[0.18em]">
                Opponent
              </th>
              <th className="px-4 py-2.5 text-right font-heading text-[11px] uppercase tracking-[0.18em]">
                Result (GH–Opp)
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((g, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-navy/[0.02]"}>
                <td
                  className="px-4 py-2 text-navy"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {String(g.opponent ?? "")}
                </td>
                <td className="px-4 py-2 text-right font-display tabular-nums text-navy">
                  {String(g.result_gh_opp ?? g.score ?? "")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Rich format with date / loc / W-L / score
  return (
    <div className="bg-white border border-navy/15 rounded-md overflow-x-auto">
      {(tally.w + tally.l + tally.t) > 0 && (
        <div className="flex items-baseline justify-between px-4 py-2 border-b border-navy/10 bg-navy/[0.02]">
          <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55">
            Running Record
          </span>
          <span className="font-display text-base text-navy tabular-nums">
            {tally.w}–{tally.l}
            {tally.t > 0 && `–${tally.t}`}
          </span>
        </div>
      )}
      <table className="w-full text-sm">
        <thead className="bg-navy text-white">
          <tr>
            <th className="px-3 py-2.5 text-left font-heading text-[11px] uppercase tracking-[0.18em]">
              Date
            </th>
            <th className="px-3 py-2.5 text-left font-heading text-[11px] uppercase tracking-[0.18em]">
              Loc
            </th>
            <th className="px-3 py-2.5 text-left font-heading text-[11px] uppercase tracking-[0.18em]">
              Opponent
            </th>
            <th className="px-3 py-2.5 text-center font-heading text-[11px] uppercase tracking-[0.18em]">
              W/L
            </th>
            <th className="px-3 py-2.5 text-right font-heading text-[11px] uppercase tracking-[0.18em]">
              Score
            </th>
          </tr>
        </thead>
        <tbody>
          {games.map((g, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-navy/[0.02]"}>
              <td className="px-3 py-2 text-navy/70 font-mono text-xs whitespace-nowrap">
                {String(g.date ?? "")}
              </td>
              <td className="px-3 py-2 text-navy/60 text-xs">
                {String(g.loc ?? "")}
              </td>
              <td className="px-3 py-2 text-navy">
                <div style={{ fontFamily: "var(--font-serif)" }}>
                  {String(g.opponent ?? "")}
                </div>
                {g.notes && (
                  <div className="text-[10px] font-heading uppercase tracking-[0.18em] text-navy/45 mt-0.5">
                    {String(g.notes)}
                  </div>
                )}
              </td>
              <td
                className={`px-3 py-2 text-center font-display ${
                  g.w_l === "W"
                    ? "text-green-700"
                    : g.w_l === "L"
                      ? "text-red-700"
                      : "text-navy/40"
                }`}
              >
                {String(g.w_l ?? "")}
              </td>
              <td className="px-3 py-2 text-right font-display tabular-nums text-navy">
                {String(g.score ?? "")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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
