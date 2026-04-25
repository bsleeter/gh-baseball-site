"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BBCOR_ERA_START,
  LATEST_YEAR,
  singleSeasonBattingLeaders,
  singleSeasonPitchingLeaders,
  getCareerBatting,
  getCareerPitching,
  displayNameOf,
  isActivePlayer,
  formatRatio,
  formatERA,
  formatIP,
  type Era,
  type SeasonLeader,
  type BattingLine,
  type PitchingLine,
  type CareerBatting,
  type CareerPitching,
} from "@/data/programHistory";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";

type EraFilter = "all" | Era;
type Tab = "single-season" | "career";

export default function AllTimeRecordsPage() {
  const [eraFilter, setEraFilter] = useState<EraFilter>("all");
  const [tab, setTab] = useState<Tab>("single-season");

  return (
    <main className="bg-cream min-h-screen pb-24">
      <PageHeader
        kicker="Program History · All-Time Records"
        title="ALL-TIME RECORDS"
        subtitle="Computed from every archived season. Filter by era to see records that were set on aluminum or BBCOR bats."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-10">
        <EditorialDivider label="Leaderboards" />

        {/* Era filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55 mr-1">
            Era
          </span>
          {(
            [
              { key: "all", label: "All Time" },
              { key: "pre-bbcor", label: `Pre-BBCOR (1990–${BBCOR_ERA_START - 1})` },
              { key: "bbcor", label: `BBCOR (${BBCOR_ERA_START}–)` },
            ] as { key: EraFilter; label: string }[]
          ).map((b) => (
            <button
              key={b.key}
              onClick={() => setEraFilter(b.key)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-[0.18em] transition-colors ${
                eraFilter === b.key
                  ? "bg-navy text-white"
                  : "bg-white text-navy/60 border border-navy/15 hover:border-navy/40"
              }`}
            >
              {b.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-navy/45 italic">
            BBCOR adopted by NFHS in 2012; pre-BBCOR allowed higher exit velocities.
          </span>
        </div>

        <div className="flex items-baseline gap-2 text-[11px] text-navy/55 italic -mt-3">
          <span
            className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
            aria-hidden
          />
          <span>= currently active ({LATEST_YEAR} roster)</span>
        </div>

        {/* View tabs */}
        <div className="flex border-b border-navy/15">
          {(
            [
              { key: "single-season", label: "Single-Season" },
              { key: "career", label: "Career" },
            ] as { key: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 font-heading text-[11px] uppercase tracking-[0.22em] border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? "border-navy text-navy"
                  : "border-transparent text-navy/45 hover:text-navy"
              }`}
            >
              {t.label}
            </button>
          ))}
          <Link
            href="/history/career-leaders"
            className="ml-auto self-center font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy"
          >
            Career Leaders →
          </Link>
          <Link
            href="/history"
            className="self-center font-heading text-[11px] uppercase tracking-[0.22em] text-navy/55 hover:text-navy ml-4"
          >
            All Seasons
          </Link>
        </div>

        {tab === "single-season" ? (
          <SingleSeasonView era={eraFilter} />
        ) : (
          <CareerView era={eraFilter} />
        )}
      </div>
    </main>
  );
}

// ─── Single-Season View ──────────────────────────────────────────────

function SingleSeasonView({ era }: { era: EraFilter }) {
  const eraOpt = era === "all" ? "all" : era;

  const battingBoards = useMemo(
    () => [
      { stat: "AVG" as const, label: "Highest Average", min: 30, format: formatRatio, dir: "best" as const, qual: "min 30 AB" },
      { stat: "H" as const, label: "Most Hits" },
      { stat: "1B" as const, label: "Most Singles" },
      { stat: "2B" as const, label: "Most Doubles" },
      { stat: "3B" as const, label: "Most Triples" },
      { stat: "HR" as const, label: "Most Home Runs" },
      { stat: "RBI" as const, label: "Most RBIs" },
      { stat: "R" as const, label: "Most Runs Scored" },
      { stat: "TB" as const, label: "Most Total Bases" },
      { stat: "BB" as const, label: "Most Walks" },
      { stat: "SB" as const, label: "Most Stolen Bases" },
      { stat: "OBP" as const, label: "Best On-Base %", min: 30, format: formatRatio, qual: "min 30 AB" },
      { stat: "SLG" as const, label: "Best Slugging %", min: 30, format: formatRatio, qual: "min 30 AB" },
    ],
    [],
  );

  const pitchingBoards = useMemo(
    () => [
      { stat: "ERA" as const, label: "Lowest ERA", min: 25, format: formatERA, dir: "lowest" as const, qual: "min 25 IP" },
      { stat: "W" as const, label: "Most Wins" },
      { stat: "K" as const, label: "Most Strikeouts" },
      { stat: "IP" as const, label: "Most Innings Pitched", format: formatIP },
      { stat: "SV" as const, label: "Most Saves" },
      { stat: "OPPBA" as const, label: "Lowest Opp. BA", min: 25, format: formatRatio, dir: "lowest" as const, qual: "min 25 IP" },
      { stat: "WHIP" as const, label: "Lowest WHIP", min: 25, format: (v: number) => v.toFixed(2), dir: "lowest" as const, qual: "min 25 IP" },
      { stat: "K7" as const, label: "Best K/Game", min: 25, format: (v: number) => v.toFixed(1), qual: "min 25 IP · K × 7 / IP" },
      { stat: "KBB" as const, label: "Best K/BB Ratio", min: 25, format: (v: number) => v.toFixed(2), qual: "min 25 IP" },
    ],
    [],
  );

  return (
    <div className="space-y-12">
      <section>
        <SectionHeader title="Single-Season Batting" kicker="Top 10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {battingBoards.map((b) => {
            const rows = singleSeasonBattingLeaders(b.stat, {
              direction: b.dir,
              minAB: b.min ?? 0,
              era: eraOpt,
              limit: 10,
            });
            return (
              <Leaderboard
                key={b.stat}
                title={b.label}
                qualifier={b.qual}
                rows={rows}
                format={b.format}
              />
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader title="Single-Season Pitching" kicker="Top 10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pitchingBoards.map((b) => {
            const rows = singleSeasonPitchingLeaders(b.stat, {
              direction: b.dir,
              minIP: b.min ?? 0,
              era: eraOpt,
              limit: 10,
            });
            return (
              <Leaderboard
                key={b.stat}
                title={b.label}
                qualifier={b.qual}
                rows={rows}
                format={b.format}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

/**
 * Standard competition ranking ("1224"): equal values share a rank, and the
 * next distinct value skips ahead by the size of the tied group.
 *   values [.538, .500, .500, .475] → ranks [1, 2, 2, 4]
 */
function competitionRanks<T extends { value: number }>(rows: T[]): number[] {
  const ranks: number[] = [];
  let prevValue: number | undefined;
  let prevRank = 0;
  for (let i = 0; i < rows.length; i++) {
    if (prevValue !== undefined && rows[i].value === prevValue) {
      ranks.push(prevRank);
    } else {
      ranks.push(i + 1);
      prevRank = i + 1;
      prevValue = rows[i].value;
    }
  }
  return ranks;
}

function Leaderboard<T extends BattingLine | PitchingLine>({
  title,
  qualifier,
  rows,
  format,
}: {
  title: string;
  qualifier?: string;
  rows: SeasonLeader<T>[];
  format?: (v: number) => string;
}) {
  if (!rows.length) {
    return (
      <div className="bg-white border border-navy/15 rounded-md p-4">
        <div className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
          {title}
        </div>
        <div className="mt-3 text-sm text-navy/45 italic">No qualifying seasons in this era.</div>
      </div>
    );
  }
  const ranks = competitionRanks(rows);
  const lastTopIdx = ranks.lastIndexOf(1);
  return (
    <div className="bg-white border border-navy/15 rounded-md p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
          {title}
        </span>
        {qualifier && (
          <span className="text-[10px] text-navy/40 italic">{qualifier}</span>
        )}
      </div>
      <ol className="space-y-0.5">
        {rows.map((r, i) => {
          const rank = ranks[i];
          const isTop = rank === 1;
          const showRank = i === 0 || ranks[i - 1] !== rank;
          return (
          <li
            key={`${r.playerId}-${r.year}-${i}`}
            className={`flex items-baseline gap-2 ${i === lastTopIdx ? "pb-1 mb-1 border-b border-navy/10" : ""}`}
          >
            <span
              className={`font-display tabular-nums w-5 shrink-0 ${
                isTop ? "text-navy" : "text-navy/30"
              }`}
            >
              {showRank ? rank : ""}
            </span>
            <Link
              href={`/history/${r.year}`}
              className="text-navy/45 hover:text-navy font-display tabular-nums text-xs w-10 shrink-0"
            >
              {r.year}
            </Link>
            <span
              className="flex-1 text-navy truncate flex items-baseline gap-1.5"
              style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: isTop ? 600 : 500 }}
            >
              <span className="truncate">{displayNameOf(r.playerId, r.player)}</span>
              {isActivePlayer(r.playerId) && <ActiveDot />}
            </span>
            <span
              className={`font-display tabular-nums shrink-0 ${
                isTop ? "text-navy text-lg" : "text-navy/85 text-sm"
              }`}
            >
              {format ? format(r.value) : r.value}
            </span>
            {r.era === "bbcor" && (
              <span className="text-[8.5px] font-heading uppercase tracking-[0.15em] text-carolina-dark bg-carolina/10 rounded px-1 py-0.5 shrink-0">
                BBCOR
              </span>
            )}
          </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Subtle emerald dot signaling the player is on the current-year roster. */
function ActiveDot() {
  return (
    <span
      className="inline-flex items-center justify-center w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
      title={`Active — on the ${LATEST_YEAR} roster`}
      aria-label="Active player"
    />
  );
}

// ─── Career View ─────────────────────────────────────────────────────

function CareerView({ era }: { era: EraFilter }) {
  const eraOpt = era === "all" ? "all" : era;
  const careerBat = useMemo(() => getCareerBatting({ era: eraOpt }), [eraOpt]);
  const careerPit = useMemo(() => getCareerPitching({ era: eraOpt }), [eraOpt]);

  const battingBoards: {
    key: keyof CareerBatting;
    label: string;
    minAB?: number;
    format?: (v: number) => string;
  }[] = [
    { key: "H", label: "Most Career Hits" },
    { key: "1B", label: "Most Career Singles" },
    { key: "HR", label: "Most Career Home Runs" },
    { key: "RBI", label: "Most Career RBIs" },
    { key: "R", label: "Most Career Runs" },
    { key: "TB", label: "Most Career Total Bases" },
    { key: "SB", label: "Most Career Stolen Bases" },
    { key: "BB", label: "Most Career Walks" },
    { key: "AVG", label: "Career Highest AVG", minAB: 100, format: formatRatio },
    { key: "OBP", label: "Career Best OBP", minAB: 100, format: formatRatio },
    { key: "SLG", label: "Career Best SLG", minAB: 100, format: formatRatio },
    { key: "AB", label: "Most Career At Bats" },
    { key: "G", label: "Most Career Games" },
  ];

  const pitchingBoards: {
    key: keyof CareerPitching;
    label: string;
    minIP?: number;
    format?: (v: number) => string;
    dir?: "lowest";
  }[] = [
    { key: "W", label: "Most Career Wins" },
    { key: "K", label: "Most Career Strikeouts" },
    { key: "IP", label: "Most Career Innings", format: formatIP },
    { key: "SV", label: "Most Career Saves" },
    { key: "ERA", label: "Career Lowest ERA", minIP: 50, format: formatERA, dir: "lowest" },
  ];

  return (
    <div className="space-y-12">
      <section>
        <SectionHeader title="Career Batting" kicker="Top 10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {battingBoards.map((b) => (
            <CareerBoard
              key={String(b.key)}
              title={b.label}
              rows={careerBat
                .filter((c) => (b.minAB ? c.AB >= b.minAB : true))
                .map((c) => ({ ...c, _v: c[b.key] as number }))
                .sort((a, b2) => (b2._v as number) - (a._v as number))
                .slice(0, 10)
                .map((c) => ({
                  player: c.player,
                  playerId: c.playerId,
                  years: c.years,
                  value: c[b.key] as number,
                }))}
              qualifier={b.minAB ? `min ${b.minAB} AB` : undefined}
              format={b.format}
            />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Career Pitching" kicker="Top 10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pitchingBoards.map((b) => (
            <CareerBoard
              key={String(b.key)}
              title={b.label}
              rows={careerPit
                .filter((c) => (b.minIP ? c.IP >= b.minIP : true))
                .map((c) => ({ ...c, _v: c[b.key] as number }))
                .sort((a, b2) =>
                  b.dir === "lowest"
                    ? (a._v as number) - (b2._v as number)
                    : (b2._v as number) - (a._v as number),
                )
                .slice(0, 10)
                .map((c) => ({
                  player: c.player,
                  playerId: c.playerId,
                  years: c.years,
                  value: c[b.key] as number,
                }))}
              qualifier={b.minIP ? `min ${b.minIP} IP` : undefined}
              format={b.format}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

interface CareerRow {
  player: string;
  playerId: string;
  years: number[];
  value: number;
}

function CareerBoard({
  title,
  qualifier,
  rows,
  format,
}: {
  title: string;
  qualifier?: string;
  rows: CareerRow[];
  format?: (v: number) => string;
}) {
  if (!rows.length) {
    return (
      <div className="bg-white border border-navy/15 rounded-md p-4">
        <div className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
          {title}
        </div>
        <div className="mt-3 text-sm text-navy/45 italic">No qualifying careers.</div>
      </div>
    );
  }
  const ranks = competitionRanks(rows);
  const lastTopIdx = ranks.lastIndexOf(1);
  return (
    <div className="bg-white border border-navy/15 rounded-md p-4 flex flex-col">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
          {title}
        </span>
        {qualifier && (
          <span className="text-[10px] text-navy/40 italic">{qualifier}</span>
        )}
      </div>
      <ol className="space-y-0.5">
        {rows.map((r, i) => {
          const rank = ranks[i];
          const isTop = rank === 1;
          const showRank = i === 0 || ranks[i - 1] !== rank;
          return (
          <li
            key={r.playerId + i}
            className={`flex items-baseline gap-2 ${i === lastTopIdx ? "pb-1 mb-1 border-b border-navy/10" : ""}`}
          >
            <span
              className={`font-display tabular-nums w-5 shrink-0 ${
                isTop ? "text-navy" : "text-navy/30"
              }`}
            >
              {showRank ? rank : ""}
            </span>
            <span
              className="flex-1 text-navy truncate flex items-baseline gap-1.5"
              style={{ fontFamily: "var(--font-serif)", fontSize: "0.92rem", fontWeight: isTop ? 600 : 500 }}
            >
              <span className="truncate">{displayNameOf(r.playerId, r.player)}</span>
              {isActivePlayer(r.playerId) && <ActiveDot />}
            </span>
            <span className="text-[10px] text-navy/45 tabular-nums shrink-0 mr-2">
              {r.years.length === 1
                ? r.years[0]
                : `${r.years[0]}–${String(r.years[r.years.length - 1]).slice(2)}`}
            </span>
            <span
              className={`font-display tabular-nums shrink-0 ${
                isTop ? "text-navy text-lg" : "text-navy/85 text-sm"
              }`}
            >
              {format ? format(r.value) : r.value}
            </span>
          </li>
          );
        })}
      </ol>
    </div>
  );
}
