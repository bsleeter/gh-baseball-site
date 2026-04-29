"use client";

import type { ReactNode } from "react";
import { useGames } from "@/lib/hooks";
import PageHeader from "@/components/PageHeader";

interface Props {
  /** Active-season year — used to filter live Supabase games. */
  year: number;
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * Stats other than W–L (e.g. Team AVG, Team ERA) — these stay static
   * since live in-season aggregation isn't worth the complexity yet.
   */
  otherStats: Array<{ value: string | number; label: string }>;
  /**
   * The static record from programHistory.json. Used as a fallback when
   * Supabase is loading or when no completed games exist yet.
   */
  fallbackRecord: { W: number; L: number } | null;
  children?: ReactNode;
}

/**
 * Client wrapper for the year-page header. For the active season, derives
 * the W–L total from live Supabase game results so the displayed record
 * stays in sync with the schedule on the same page.
 */
export default function LiveSeasonHeader({
  year,
  kicker,
  title,
  subtitle,
  otherStats,
  fallbackRecord,
  children,
}: Props) {
  const { data } = useGames("varsity");

  let liveRecord: { W: number; L: number } | null = null;
  if (data) {
    let w = 0;
    let l = 0;
    for (const g of data) {
      if (g.type !== "game") continue;
      if (!g.date.startsWith(`${year}-`)) continue;
      if (g.result === "W") w += 1;
      else if (g.result === "L") l += 1;
    }
    if (w + l > 0) liveRecord = { W: w, L: l };
  }

  const record = liveRecord ?? fallbackRecord;

  const stats: Array<{ value: string | number; label: string }> = [];
  if (record) {
    stats.push({ value: `${record.W}–${record.L}`, label: "W–L" });
  }
  for (const s of otherStats) stats.push(s);

  return (
    <PageHeader
      kicker={kicker}
      title={title}
      subtitle={subtitle}
      stats={stats}
    >
      {children}
    </PageHeader>
  );
}
