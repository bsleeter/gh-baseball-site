"use client";

import { useGames } from "@/lib/hooks";
import type { DbGame } from "@/lib/database";
import type { ScheduleGame } from "@/data/programHistory";
import SectionHeader from "@/components/SectionHeader";

interface Props {
  /** Year being viewed. */
  year: number;
  /** Pre-extracted schedule from programHistory.json (used for archived years). */
  archived: ScheduleGame[];
}

/**
 * Renders the Schedule & Results section. For the active season we fetch
 * from Supabase (same source as /schedule); older years fall back to the
 * archived schedule baked into programHistory.json.
 */
export default function LiveSchedule({ year, archived }: Props) {
  const { data, loading } = useGames("varsity");

  const liveGames = (data ?? [])
    .filter((g) => g.type === "game" && g.date.startsWith(`${year}-`))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(toScheduleGame);

  const games = liveGames.length > 0 ? liveGames : archived;
  const stillLoading = loading && !data && archived.length === 0;

  if (!stillLoading && games.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="Schedule & Results"
        count={games.length}
        countLabel="games"
      />
      {stillLoading ? (
        <div className="bg-white border border-navy/15 rounded-md p-6 text-center text-navy/55">
          Loading schedule…
        </div>
      ) : (
        <ScheduleTable games={games} />
      )}
    </section>
  );
}

function toScheduleGame(g: DbGame): ScheduleGame {
  const d = new Date(g.date + "T12:00:00");
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const loc =
    g.location === "home" ? "Home" : g.location === "away" ? "Away" : "Neutral";
  const score =
    g.score_us !== null && g.score_them !== null
      ? `${g.score_us}-${g.score_them}`
      : "";
  return {
    date: dateStr,
    loc,
    opponent: g.opponent,
    w_l: g.result ?? undefined,
    score,
    notes: g.notes ?? undefined,
  };
}

// ─── Schedule table (moved here from page.tsx so the client component
//     can render it without crossing the server/client boundary) ──────

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

  return (
    <div className="bg-white border border-navy/15 rounded-md overflow-x-auto">
      {tally.w + tally.l + tally.t > 0 && (
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
