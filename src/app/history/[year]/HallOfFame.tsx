"use client";

import { useState } from "react";
import {
  BBCOR_ERA_START,
  displayNameOf,
  type HofEntry,
  type ProgramRecordContext,
} from "@/data/programHistory";
import { HomePlate } from "@/components/Ornaments";

type CompareMode = "all" | "bbcor";

interface Props {
  seasonYear: number;
  /** True if the year being viewed is itself in the BBCOR era. */
  seasonIsBbcor: boolean;
  batting: HofEntry[];
  pitching: HofEntry[];
  other: HofEntry[];
}

export default function HallOfFameSection({
  seasonYear,
  seasonIsBbcor,
  batting,
  pitching,
  other,
}: Props) {
  // Default: BBCOR years compare within era; Pre-BBCOR default to all-time.
  const [mode, setMode] = useState<CompareMode>(
    seasonIsBbcor ? "bbcor" : "all",
  );

  return (
    <div className="space-y-6">
      <CompareToggle
        mode={mode}
        setMode={setMode}
        seasonYear={seasonYear}
        seasonIsBbcor={seasonIsBbcor}
      />
      <div className="space-y-7">
        {batting.length > 0 && (
          <HofGroup label="Batting" entries={batting} mode={mode} seasonYear={seasonYear} />
        )}
        {pitching.length > 0 && (
          <HofGroup label="Pitching" entries={pitching} mode={mode} seasonYear={seasonYear} />
        )}
        {other.length > 0 && (
          <HofGroup label="Special" entries={other} mode={mode} seasonYear={seasonYear} />
        )}
      </div>
    </div>
  );
}

function CompareToggle({
  mode,
  setMode,
  seasonYear,
  seasonIsBbcor,
}: {
  mode: CompareMode;
  setMode: (m: CompareMode) => void;
  seasonYear: number;
  seasonIsBbcor: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 -mt-2">
      <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55 mr-1">
        Compare against
      </span>
      {(
        [
          { key: "all", label: "All-Time", note: `1990–${new Date().getFullYear()}` },
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
      {!seasonIsBbcor && mode === "bbcor" && (
        <span
          className="text-[11px] text-navy/55 italic ml-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {seasonYear} predates BBCOR — ranks show where this season&rsquo;s
          numbers would slot in the modern pool.
        </span>
      )}
    </div>
  );
}

function HofGroup({
  label,
  entries,
  mode,
  seasonYear,
}: {
  label: string;
  entries: HofEntry[];
  mode: CompareMode;
  seasonYear: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <HomePlate className="w-2.5 h-2.5 text-navy/40 shrink-0" />
        <span className="font-heading text-[10px] uppercase tracking-[0.28em] text-navy/55">
          {label}
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-navy/15 via-navy/8 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {entries.map((e, i) => (
          <HofCard key={e.category + i} entry={e} mode={mode} seasonYear={seasonYear} />
        ))}
      </div>
    </div>
  );
}

function HofCard({
  entry,
  mode,
  seasonYear,
}: {
  entry: HofEntry;
  mode: CompareMode;
  seasonYear: number;
}) {
  // Pick which context to show based on the toggle. Typed-only entries
  // (e.g. Longest Hitting Streak) carry no context regardless.
  const ctx: ProgramRecordContext | undefined =
    mode === "bbcor" ? entry.bbcorContext : entry.programContext;
  const isProgramRecord = ctx?.isRecord ?? false;
  return (
    <div
      className={`bg-white border rounded-md px-4 py-3.5 flex flex-col group transition-colors ${
        isProgramRecord
          ? "border-amber-400/70 ring-1 ring-amber-300/30"
          : "border-navy/15 hover:border-navy/40"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55 leading-tight">
          {entry.category}
        </span>
        {isProgramRecord && (
          <span className="text-[8.5px] font-heading font-bold uppercase tracking-[0.18em] text-amber-700">
            ★ {ctx?.isTie ? "Tied Record" : "Program Record"}
          </span>
        )}
        {entry.source === "typed" && (
          <span className="text-[8.5px] font-heading uppercase tracking-[0.18em] text-navy/35">
            typed
          </span>
        )}
      </div>
      <div
        className={`mt-1 font-display tabular-nums leading-[0.9] ${
          isProgramRecord ? "text-amber-700" : "text-navy"
        }`}
        style={{
          fontSize: "2.4rem",
          letterSpacing: "0.01em",
          fontFeatureSettings: '"tnum"',
        }}
      >
        {entry.display}
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span
          className={`h-px w-5 ${
            isProgramRecord ? "bg-amber-400" : "bg-carolina"
          }`}
        />
        <HomePlate className="w-1.5 h-1.5 text-navy/25" />
      </div>
      <div className="mt-1.5 space-y-0.5">
        {entry.holders.map((h, i) => (
          <div
            key={i}
            className="text-navy leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.92rem",
              fontWeight: 500,
            }}
          >
            {displayNameOf(h.playerId, h.player)}
          </div>
        ))}
      </div>
      {entry.qualifier && (
        <div className="mt-1 text-[10.5px] text-navy/45 italic">
          {entry.qualifier}
        </div>
      )}
      {ctx && !isProgramRecord && (
        <div className="mt-2.5 pt-2 border-t border-navy/10">
          {ctx.inPool ? (
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="font-display text-navy tabular-nums leading-none"
                style={{
                  fontSize: "1.35rem",
                  letterSpacing: "0.02em",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                #{ctx.rank}
              </span>
              <span className="font-heading font-bold text-[9.5px] uppercase tracking-[0.22em] text-navy/55 tabular-nums">
                of {ctx.pool} {mode === "bbcor" ? "BBCOR" : "all-time"}
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-heading font-bold text-[9.5px] uppercase tracking-[0.22em] text-navy/45 tabular-nums">
                Would slot
              </span>
              <span
                className="font-display text-navy/80 tabular-nums leading-none"
                style={{
                  fontSize: "1.15rem",
                  letterSpacing: "0.02em",
                  fontFeatureSettings: '"tnum"',
                }}
              >
                #{ctx.rank}
              </span>
              <span className="font-heading font-bold text-[9.5px] uppercase tracking-[0.22em] text-navy/45 tabular-nums">
                in BBCOR pool
              </span>
            </div>
          )}
          <RecordHoldersLine
            prefix={`Record ${ctx.recordDisplay}`}
            holders={ctx.recordHolders}
          />
        </div>
      )}
      {ctx && isProgramRecord && ctx.isTie && (
        // Tied program record — list the OTHER holders so the user can see
        // who else shares the mark. Exclude any tied entry from this season.
        <div className="mt-2.5 pt-2 border-t border-amber-300/40">
          <div className="font-heading font-bold text-[9.5px] uppercase tracking-[0.22em] text-amber-700/80 mb-1">
            Tied with
          </div>
          <RecordHoldersLine
            holders={ctx.recordHolders.filter((h) => h.year !== seasonYear)}
            tone="amber"
          />
        </div>
      )}
    </div>
  );
}

/** Compact "holder 'YY · holder 'YY · +N more" rendering of tied holders. */
function RecordHoldersLine({
  prefix,
  holders,
  tone = "navy",
  maxShown = 3,
}: {
  prefix?: string;
  holders: { player: string; year: number; playerId: string }[];
  tone?: "navy" | "amber";
  maxShown?: number;
}) {
  if (!holders.length) return null;
  const shown = holders.slice(0, maxShown);
  const overflow = holders.length - shown.length;
  const colorClass = tone === "amber" ? "text-amber-800/80" : "text-navy/55";
  const fullText = holders
    .map((h) => `${h.player} '${String(h.year).slice(2)}`)
    .join(" · ");
  const text = shown
    .map((h) => `${h.player} '${String(h.year).slice(2)}`)
    .join(" · ");
  return (
    <div
      className={`leading-tight ${colorClass}`}
      style={{
        fontFamily: "var(--font-serif)",
        fontStyle: "italic",
        fontSize: "0.8rem",
      }}
      title={prefix ? `${prefix} — ${fullText}` : fullText}
    >
      {prefix && <span>{prefix} · </span>}
      <span>{text}</span>
      {overflow > 0 && (
        <span className="not-italic font-heading text-[9.5px] uppercase tracking-[0.18em] ml-1 opacity-70">
          + {overflow} more
        </span>
      )}
    </div>
  );
}
