"use client";

import { usePlayers } from "@/lib/hooks";
import type { DbPlayer } from "@/lib/database";
import type { Season } from "@/data/programHistory";
import SectionHeader from "@/components/SectionHeader";

interface Props {
  year: number;
  /** Pre-extracted roster from programHistory.json (used for archived years). */
  archived: Season["roster"];
  /** True for the current season: pull live varsity from Supabase instead of
   *  the archived list (which gets noisy from GameChanger call-ups and name
   *  variants). */
  isLatest: boolean;
}

type RosterRow = { num: number | null; player: string; grade: number | null };

/**
 * Renders the Roster section. For the current season we fetch from Supabase
 * (same source as /roster); older years use the archived roster baked into
 * programHistory.json.
 */
export default function LiveRoster({ year, archived, isLatest }: Props) {
  const { data, loading } = usePlayers(isLatest ? "varsity" : undefined);

  const live: RosterRow[] = isLatest
    ? (data ?? []).map((p) => toRow(p, year))
    : [];

  const players = isLatest ? live : archived;
  const stillLoading = isLatest && loading && !data;

  if (!stillLoading && players.length === 0) return null;

  return (
    <section>
      <SectionHeader
        title="Roster"
        count={players.length}
        countLabel="players"
      />
      {stillLoading ? (
        <div className="bg-white border border-navy/15 rounded-md p-6 text-center text-navy/55">
          Loading roster…
        </div>
      ) : (
        <RosterGrid players={players} />
      )}
    </section>
  );
}

function toRow(p: DbPlayer, year: number): RosterRow {
  const grade = 12 - (p.grad_year - year);
  return {
    num: typeof p.number === "number" ? p.number : null,
    player: `${p.first_name} ${p.last_name}`.trim(),
    grade: grade >= 9 && grade <= 12 ? grade : null,
  };
}

// ─── Roster grid (kept inline so the client component can render it
//     without crossing the server/client boundary) ─────────────────────

function RosterGrid({ players }: { players: RosterRow[] }) {
  type Bucket = { key: string; label: string; players: RosterRow[] };
  const buckets: Bucket[] = [
    { key: "12", label: "Seniors", players: [] },
    { key: "11", label: "Juniors", players: [] },
    { key: "10", label: "Sophomores", players: [] },
    { key: "9", label: "Freshmen", players: [] },
  ];
  const other: RosterRow[] = [];
  const unknown: RosterRow[] = [];
  for (const p of players) {
    if (p.grade === 12) buckets[0].players.push(p);
    else if (p.grade === 11) buckets[1].players.push(p);
    else if (p.grade === 10) buckets[2].players.push(p);
    else if (p.grade === 9) buckets[3].players.push(p);
    else if (typeof p.grade === "number") other.push(p);
    else unknown.push(p);
  }
  const byNumThenName = (a: RosterRow, b: RosterRow) => {
    const an = a.num ?? 999, bn = b.num ?? 999;
    if (an !== bn) return an - bn;
    return a.player.localeCompare(b.player);
  };
  for (const b of buckets) b.players.sort(byNumThenName);
  other.sort(byNumThenName);
  unknown.sort(byNumThenName);

  const visibleBuckets = buckets.filter((b) => b.players.length > 0);
  if (other.length) {
    visibleBuckets.push({ key: "other", label: "Other Grades", players: other });
  }
  if (unknown.length) {
    visibleBuckets.push({ key: "unknown", label: "Roster", players: unknown });
  }

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
  players: RosterRow[];
  showGrade: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-1">
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
