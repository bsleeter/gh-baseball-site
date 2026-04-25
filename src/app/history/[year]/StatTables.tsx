"use client";

import { useMemo, useState } from "react";
import {
  formatRatio,
  formatERA,
  formatIP,
  displayNameOf,
  type BattingLine,
  type PitchingLine,
} from "@/data/programHistory";

type SortDir = "asc" | "desc";

interface ColSpec<T> {
  key: keyof T | "player";
  label: string;
  /** Default direction when first clicked. Most stats default to descending. */
  defaultDir?: SortDir;
  format?: (v: unknown) => string;
}

const BAT_COLS: ColSpec<BattingLine>[] = [
  { key: "player", label: "Player", defaultDir: "asc" },
  { key: "G", label: "G" },
  { key: "AB", label: "AB" },
  { key: "R", label: "R" },
  { key: "H", label: "H" },
  { key: "1B", label: "1B" },
  { key: "2B", label: "2B" },
  { key: "3B", label: "3B" },
  { key: "HR", label: "HR" },
  { key: "RBI", label: "RBI" },
  { key: "BB", label: "BB" },
  { key: "K", label: "K" },
  { key: "SB", label: "SB" },
  { key: "TB", label: "TB" },
  { key: "AVG", label: "AVG", format: (v) => formatRatio(v as number) },
  { key: "OBP", label: "OBP", format: (v) => formatRatio(v as number) },
  { key: "SLG", label: "SLG", format: (v) => formatRatio(v as number) },
];

const PIT_COLS: ColSpec<PitchingLine>[] = [
  { key: "player", label: "Player", defaultDir: "asc" },
  { key: "W", label: "W" },
  { key: "L", label: "L", defaultDir: "asc" },
  { key: "SV", label: "SV" },
  { key: "G", label: "G" },
  { key: "IP", label: "IP", format: (v) => formatIP(v as number) },
  { key: "BF", label: "BF" },
  { key: "H", label: "H", defaultDir: "asc" },
  { key: "R", label: "R", defaultDir: "asc" },
  { key: "ER", label: "ER", defaultDir: "asc" },
  { key: "K", label: "K" },
  { key: "BB", label: "BB", defaultDir: "asc" },
  { key: "HBP", label: "HBP", defaultDir: "asc" },
  { key: "ERA", label: "ERA", defaultDir: "asc", format: (v) => formatERA(v as number) },
  { key: "OPPBA", label: "OPPBA", defaultDir: "asc", format: (v) => formatRatio(v as number) },
];

// ─── Generic sortable table ──────────────────────────────────────────

function SortableTable<T extends { player: string; playerId: string }>({
  cols,
  lines,
  team,
  leaders,
  initialSort,
}: {
  cols: ColSpec<T>[];
  lines: T[];
  team?: T | null;
  leaders: Record<string, Set<string>>;
  /** Default sort key when the page loads. */
  initialSort: { key: keyof T | "player"; dir: SortDir };
}) {
  const [sortKey, setSortKey] = useState<keyof T | "player">(initialSort.key);
  const [sortDir, setSortDir] = useState<SortDir>(initialSort.dir);

  // Only keep cols where at least one line has the value (drops trivial empties)
  const visibleCols = useMemo(
    () =>
      cols.filter(
        (c) =>
          c.key === "player" ||
          lines.some(
            (l) =>
              (l as Record<string, unknown>)[c.key as string] !== undefined &&
              (l as Record<string, unknown>)[c.key as string] !== null,
          ),
      ),
    [cols, lines],
  );

  const sorted = useMemo(() => {
    const arr = [...lines];
    arr.sort((a, b) => {
      if (sortKey === "player") {
        // Sort by full display name (so "Austin Eibel" beats "Eibel, A")
        const an = displayNameOf(a.playerId, a.player).toLowerCase();
        const bn = displayNameOf(b.playerId, b.player).toLowerCase();
        return sortDir === "asc" ? an.localeCompare(bn) : bn.localeCompare(an);
      }
      const av = (a as Record<string, unknown>)[sortKey as string];
      const bv = (b as Record<string, unknown>)[sortKey as string];
      const aMissing = av === undefined || av === null;
      const bMissing = bv === undefined || bv === null;
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1; // missing always last
      if (bMissing) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      const as = String(av), bs = String(bv);
      return sortDir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
    return arr;
  }, [lines, sortKey, sortDir]);

  function handleSort(col: ColSpec<T>) {
    if (sortKey === col.key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(col.key);
      setSortDir(col.defaultDir ?? "desc");
    }
  }

  return (
    <div className="bg-white border border-navy/15 rounded-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-navy text-white">
          <tr>
            {visibleCols.map((c, i) => {
              const isPlayer = c.key === "player";
              const isActive = sortKey === c.key;
              return (
                <th
                  key={String(c.key)}
                  className={`${
                    isPlayer ? "text-left sticky left-0 bg-navy" : "text-right"
                  } px-${isPlayer ? "3" : "2"} py-2`}
                >
                  <button
                    onClick={() => handleSort(c)}
                    className={`group inline-flex items-center gap-1 font-heading text-[11px] uppercase tracking-[0.18em] tabular-nums transition-colors ${
                      isActive
                        ? "text-carolina-light"
                        : "text-white hover:text-carolina-light"
                    }`}
                    aria-label={`Sort by ${c.label}`}
                  >
                    <span>{c.label}</span>
                    <SortGlyph
                      active={isActive}
                      dir={isActive ? sortDir : undefined}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((l, i) => (
            <tr
              key={l.playerId + i}
              className={i % 2 === 0 ? "bg-white" : "bg-navy/[0.02]"}
            >
              {visibleCols.map((c) => {
                const isPlayer = c.key === "player";
                if (isPlayer) {
                  return (
                    <td
                      key="player"
                      className="px-3 py-1.5 text-navy whitespace-nowrap sticky left-0 bg-inherit"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                      }}
                    >
                      {displayNameOf(l.playerId, l.player)}
                    </td>
                  );
                }
                const v = (l as Record<string, unknown>)[c.key as string];
                const isLeader = leaders[c.key as string]?.has(l.playerId);
                return (
                  <td
                    key={String(c.key)}
                    className={`px-2 py-1.5 text-right font-display tabular-nums ${
                      isLeader
                        ? "bg-amber-200/60 text-navy font-bold"
                        : v === undefined || v === null
                          ? "text-navy/30"
                          : "text-navy/85"
                    }`}
                  >
                    {v === undefined || v === null
                      ? "—"
                      : c.format
                        ? c.format(v)
                        : String(v)}
                  </td>
                );
              })}
            </tr>
          ))}
          {team && (
            <tr className="bg-navy/[0.06] border-t-2 border-navy/30 font-bold">
              {visibleCols.map((c) => {
                if (c.key === "player") {
                  return (
                    <td
                      key="player"
                      className="px-3 py-2 text-navy sticky left-0 bg-navy/[0.06]"
                      style={{
                        fontFamily: "var(--font-serif)",
                        fontSize: "0.95rem",
                      }}
                    >
                      TEAM
                    </td>
                  );
                }
                const v = (team as Record<string, unknown>)[c.key as string];
                return (
                  <td
                    key={String(c.key)}
                    className="px-2 py-2 text-right font-display tabular-nums text-navy"
                  >
                    {v === undefined || v === null
                      ? "—"
                      : c.format
                        ? c.format(v)
                        : String(v)}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortGlyph({
  active,
  dir,
}: {
  active: boolean;
  dir?: SortDir;
}) {
  if (!active) {
    return (
      <span
        aria-hidden
        className="inline-block w-2.5 text-[10px] leading-none opacity-30 group-hover:opacity-70"
      >
        ↕
      </span>
    );
  }
  return (
    <span aria-hidden className="inline-block w-2.5 text-[10px] leading-none">
      {dir === "asc" ? "▲" : "▼"}
    </span>
  );
}

// ─── Public components ───────────────────────────────────────────────

export function BattingTable({
  lines,
  team,
  leaders,
}: {
  lines: BattingLine[];
  team?: BattingLine | null;
  leaders: Record<string, Set<string>>;
}) {
  return (
    <SortableTable
      cols={BAT_COLS}
      lines={lines}
      team={team}
      leaders={leaders}
      initialSort={{ key: "AB", dir: "desc" }}
    />
  );
}

export function PitchingTable({
  lines,
  team,
  leaders,
}: {
  lines: PitchingLine[];
  team?: PitchingLine | null;
  leaders: Record<string, Set<string>>;
}) {
  return (
    <SortableTable
      cols={PIT_COLS}
      lines={lines}
      team={team}
      leaders={leaders}
      initialSort={{ key: "IP", dir: "desc" }}
    />
  );
}
