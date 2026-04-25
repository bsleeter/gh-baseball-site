"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BBCOR_ERA_START,
  LATEST_YEAR,
  type TeamRecordEntry,
} from "@/data/programHistory";
import { HomePlate } from "@/components/Ornaments";

type CompareMode = "all" | "bbcor";

interface ChampSummary {
  stateTitles: number[];
  districtTitles: number[];
  leagueTitles: number[];
  topThreeFinishes: { year: number; place: number }[];
}

interface RecordBundle {
  season: TeamRecordEntry[];
  batting: TeamRecordEntry[];
  pitching: TeamRecordEntry[];
  singleGame: TeamRecordEntry[];
}

interface Props {
  allTime: RecordBundle;
  bbcor: RecordBundle;
  champs: ChampSummary;
}

export default function TeamRecordsSection({ allTime, bbcor, champs }: Props) {
  const [mode, setMode] = useState<CompareMode>("all");
  const data = mode === "bbcor" ? bbcor : allTime;

  return (
    <div className="space-y-10">
      <ChampionshipsPanel champs={champs} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55 mr-1">
          Compare
        </span>
        {(
          [
            { key: "all", label: "All-Time", note: "1990–" },
            { key: "bbcor", label: "BBCOR Era", note: `${BBCOR_ERA_START}–` },
          ] as { key: CompareMode; label: string; note: string }[]
        ).map((b) => {
          const active = mode === b.key;
          return (
            <button
              key={b.key}
              onClick={() => setMode(b.key)}
              className={`px-3 py-1.5 rounded-full text-[10.5px] font-heading font-bold uppercase tracking-[0.18em] transition-colors flex items-baseline gap-1.5 ${
                active
                  ? "bg-navy text-white"
                  : "bg-white text-navy/60 border border-navy/15 hover:border-navy/40"
              }`}
            >
              <span>{b.label}</span>
              <span className={`text-[9px] tabular-nums ${active ? "text-white/55" : "text-navy/35"}`}>
                {b.note}
              </span>
            </button>
          );
        })}
        <span
          className="text-[11px] text-navy/45 italic ml-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Single-game records aggregate the &ldquo;peak&rdquo; entries from
          each year&rsquo;s Team Highlights sheet.
        </span>
      </div>

      <div className="space-y-7">
        {data.season.length > 0 && (
          <RecordGroup label="Season Performance" entries={data.season} mode={mode} />
        )}
        {data.batting.length > 0 && (
          <RecordGroup label="Team Batting" entries={data.batting} mode={mode} />
        )}
        {data.pitching.length > 0 && (
          <RecordGroup label="Team Pitching" entries={data.pitching} mode={mode} />
        )}
        {data.singleGame.length > 0 && (
          <RecordGroup label="Single-Game Records" entries={data.singleGame} mode={mode} />
        )}
      </div>
    </div>
  );
}

function ChampionshipsPanel({ champs }: { champs: ChampSummary }) {
  const blocks: { label: string; years: (number | string)[]; tone: string }[] = [
    {
      label: `${champs.stateTitles.length} State Title${champs.stateTitles.length === 1 ? "" : "s"}`,
      years: champs.stateTitles,
      tone: "amber",
    },
    {
      label: `${champs.districtTitles.length} District Title${champs.districtTitles.length === 1 ? "" : "s"}`,
      years: champs.districtTitles,
      tone: "carolina",
    },
    {
      label: `${champs.leagueTitles.length} League Title${champs.leagueTitles.length === 1 ? "" : "s"}`,
      years: champs.leagueTitles,
      tone: "navy",
    },
    {
      label: `${champs.topThreeFinishes.length} State Top-3 Finish${champs.topThreeFinishes.length === 1 ? "" : "es"}`,
      years: champs.topThreeFinishes.map(
        (f) => `${f.year}${f.place === 2 ? " (2nd)" : " (3rd)"}`,
      ),
      tone: "stone",
    },
  ];
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <HomePlate className="w-2.5 h-2.5 text-navy/40 shrink-0" />
        <span className="font-heading text-[10px] uppercase tracking-[0.28em] text-navy/55">
          Postseason Honors
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-navy/15 via-navy/8 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {blocks.map((b, i) => (
          <ChampCard key={i} block={b} />
        ))}
      </div>
    </section>
  );
}

function ChampCard({
  block,
}: {
  block: { label: string; years: (number | string)[]; tone: string };
}) {
  const toneClass =
    block.tone === "amber"
      ? "border-amber-400/70 bg-amber-50/30"
      : block.tone === "carolina"
        ? "border-carolina/40 bg-carolina/[0.04]"
        : block.tone === "navy"
          ? "border-navy/30 bg-navy/[0.03]"
          : "border-stone-300 bg-stone-50/40";
  const accentClass =
    block.tone === "amber"
      ? "text-amber-700"
      : block.tone === "carolina"
        ? "text-carolina-dark"
        : block.tone === "navy"
          ? "text-navy"
          : "text-stone-700";
  return (
    <div className={`bg-white border rounded-md px-4 py-3.5 flex flex-col ${toneClass}`}>
      <span
        className={`font-heading font-bold text-[10px] uppercase tracking-[0.22em] ${accentClass}`}
      >
        {block.label}
      </span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {block.years.length === 0 ? (
          <span className="text-[12px] text-navy/40 italic">—</span>
        ) : (
          block.years.map((y) => (
            <Link
              key={String(y)}
              href={`/history/${String(y).split(" ")[0]}`}
              className="font-display text-base text-navy/80 tabular-nums hover:text-navy transition-colors"
            >
              {y}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function RecordGroup({
  label,
  entries,
  mode,
}: {
  label: string;
  entries: TeamRecordEntry[];
  mode: CompareMode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <HomePlate className="w-2.5 h-2.5 text-navy/40 shrink-0" />
        <span className="font-heading text-[10px] uppercase tracking-[0.28em] text-navy/55">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-navy/15 via-navy/8 to-transparent" />
        <span className="font-heading text-[9.5px] uppercase tracking-[0.22em] text-navy/40 tabular-nums">
          {entries.length} categor{entries.length === 1 ? "y" : "ies"}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entries.map((e, i) => (
          <TeamRecordCard key={e.category + i} entry={e} mode={mode} />
        ))}
      </div>
    </section>
  );
}

function TeamRecordCard({
  entry,
  mode: _mode,
}: {
  entry: TeamRecordEntry;
  mode: CompareMode;
}) {
  const tied = entry.holders.length > 1;
  return (
    <div className="bg-white border border-navy/15 rounded-md px-4 py-3.5 flex flex-col group hover:border-navy/40 transition-colors">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55 leading-tight">
          {entry.category}
        </span>
        {entry.active && (
          <span className="text-[8.5px] font-heading font-bold uppercase tracking-[0.18em] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-1 py-0.5">
            Active
          </span>
        )}
      </div>

      <div
        className="mt-1 font-display tabular-nums leading-[0.9] text-navy"
        style={{
          fontSize: "2.4rem",
          letterSpacing: "0.01em",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {entry.display}
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        <span className="h-px w-5 bg-carolina" />
        <HomePlate className="w-1.5 h-1.5 text-navy/25" />
      </div>

      <div className="mt-1.5 space-y-0.5">
        {entry.holders.slice(0, 4).map((h, i) => (
          <Link
            key={i}
            href={`/history/${h.year}`}
            className="block text-navy hover:text-carolina-dark transition-colors leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            <span className="tabular-nums">{h.year}</span>
            {h.context && (
              <span className="text-navy/45 ml-2 text-[12px]">
                {h.context}
              </span>
            )}
          </Link>
        ))}
        {entry.holders.length > 4 && (
          <div className="text-[10px] font-heading uppercase tracking-[0.18em] text-navy/45">
            +{entry.holders.length - 4} more tied
          </div>
        )}
      </div>

      {entry.qualifier && (
        <div className="mt-1.5 text-[10.5px] text-navy/45 italic">
          {entry.qualifier}
          {entry.pool > 1 && (
            <span className="ml-1 text-navy/35">
              · {entry.pool} qualifying season{entry.pool === 1 ? "" : "s"}
            </span>
          )}
        </div>
      )}
      {!entry.qualifier && entry.pool > 1 && tied && (
        <div className="mt-1 text-[10.5px] text-navy/40 italic">
          {entry.holders.length}-way tie
        </div>
      )}
    </div>
  );
}
