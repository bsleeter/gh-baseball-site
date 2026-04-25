"use client";

import { useState } from "react";
import {
  BBCOR_ERA_START,
  formatCareerSpan,
  type CareerHofEntry,
} from "@/data/programHistory";
import { HomePlate } from "@/components/Ornaments";

type CompareMode = "all" | "bbcor";

interface Props {
  /** Pre-computed all-time bundle (from server). */
  allTime: { batting: CareerHofEntry[]; pitching: CareerHofEntry[] };
  /** Pre-computed BBCOR-era bundle (from server). */
  bbcor: { batting: CareerHofEntry[]; pitching: CareerHofEntry[] };
}

export default function CareerHallOfFameSection({ allTime, bbcor }: Props) {
  const [mode, setMode] = useState<CompareMode>("all");
  const data = mode === "bbcor" ? bbcor : allTime;

  return (
    <div className="space-y-6">
      <CompareToggle mode={mode} setMode={setMode} />
      <div className="space-y-7">
        {data.batting.length > 0 && (
          <HofGroup label="Career Batting" entries={data.batting} mode={mode} />
        )}
        {data.pitching.length > 0 && (
          <HofGroup label="Career Pitching" entries={data.pitching} mode={mode} />
        )}
      </div>
    </div>
  );
}

function CompareToggle({
  mode,
  setMode,
}: {
  mode: CompareMode;
  setMode: (m: CompareMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55 mr-1">
        Compare
      </span>
      {(
        [
          { key: "all", label: "All-Time", note: "1990–" },
          {
            key: "bbcor",
            label: "BBCOR Era",
            note: `${BBCOR_ERA_START}–`,
          },
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
            <span
              className={`text-[9px] tabular-nums ${
                active ? "text-white/55" : "text-navy/35"
              }`}
            >
              {b.note}
            </span>
          </button>
        );
      })}
      {mode === "bbcor" && (
        <span
          className="text-[11px] text-navy/55 italic ml-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          BBCOR mode counts only seasons from {BBCOR_ERA_START}+ in each
          player&rsquo;s career totals.
        </span>
      )}
    </div>
  );
}

function HofGroup({
  label,
  entries,
  mode,
}: {
  label: string;
  entries: CareerHofEntry[];
  mode: CompareMode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <HomePlate className="w-2.5 h-2.5 text-navy/40 shrink-0" />
        <span className="font-heading text-[10px] uppercase tracking-[0.28em] text-navy/55">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-navy/15 via-navy/8 to-transparent" />
        <span className="font-heading text-[9.5px] uppercase tracking-[0.22em] text-navy/40 tabular-nums">
          {entries.length} categories
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entries.map((e, i) => (
          <CareerHofCard key={e.category + i} entry={e} mode={mode} />
        ))}
      </div>
    </div>
  );
}

function CareerHofCard({
  entry,
  mode,
}: {
  entry: CareerHofEntry;
  mode: CompareMode;
}) {
  const tied = entry.leaders.length > 1;
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

      {/* Leader(s) */}
      <div className="mt-1.5 space-y-1">
        {entry.leaders.map((l, i) => (
          <div key={i} className="leading-tight">
            <div
              className="text-navy"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                fontWeight: 500,
              }}
            >
              {l.player}
            </div>
            <div className="text-[10.5px] text-navy/45 tabular-nums">
              {formatCareerSpan(l.years)} ·{" "}
              <span className="font-heading uppercase tracking-[0.15em]">
                {l.years.length} {l.years.length === 1 ? "season" : "seasons"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Qualifier */}
      {entry.qualifier && (
        <div className="mt-1.5 text-[10.5px] text-navy/45 italic">
          {entry.qualifier}
          {entry.pool > 1 && (
            <span className="ml-1 text-navy/35">
              · {entry.pool} qualifying {entry.pool === 1 ? "career" : "careers"}
            </span>
          )}
        </div>
      )}

      {/* Runner-up */}
      {entry.runnerUp && (
        <div className="mt-2.5 pt-2 border-t border-navy/10">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <span className="font-heading font-bold text-[9.5px] uppercase tracking-[0.22em] text-navy/45">
              {tied ? "Next-best" : "Runner-up"}
            </span>
            <span className="font-display text-navy/80 tabular-nums text-base leading-none">
              {entry.runnerUp.display}
            </span>
          </div>
          <div
            className="text-navy/55 leading-tight truncate"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.8rem",
            }}
            title={`${entry.runnerUp.player} · ${formatCareerSpan(
              entry.runnerUp.years,
            )}`}
          >
            {entry.runnerUp.player} · {formatCareerSpan(entry.runnerUp.years)}
          </div>
        </div>
      )}

      {/* Empty pool fallback (rare) */}
      {!entry.runnerUp && (
        <div className="mt-2 text-[10px] text-navy/35 italic">
          Sole qualifying career in this pool
        </div>
      )}
    </div>
  );
}
