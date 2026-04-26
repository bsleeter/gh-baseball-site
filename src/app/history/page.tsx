"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  getAllSeasons,
  BBCOR_ERA_START,
  type Season,
  type Era,
} from "@/data/programHistory";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";

type Filter = "all" | "bbcor" | "pre-bbcor";

export default function HistoryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const all = useMemo(() => getAllSeasons(), []);

  const filtered = useMemo(() => {
    if (filter === "all") return [...all].reverse();
    return all.filter((s) => s.era === filter).reverse();
  }, [all, filter]);

  const totalSeasons = all.length;
  const bbcorCount = all.filter((s) => s.era === "bbcor").length;
  const preBbcorCount = all.filter((s) => s.era === "pre-bbcor").length;

  return (
    <main className="bg-cream min-h-screen pb-24">
      <PageHeader
        kicker="Program History"
        title="GIG HARBOR BASEBALL"
        subtitle={`${all[0].year}–${all[all.length - 1].year} · A program record book.`}
        stats={[
          { value: totalSeasons, label: "Seasons Archived" },
          { value: 2, label: "State Titles" },
          { value: 3, label: "District Titles" },
          { value: 9, label: "League Titles" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12">
        {/* Records hub CTAs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            href="/history/career-leaders"
            className="block bg-navy text-white border border-navy hover:bg-navy-dark transition-colors rounded-md px-5 py-4 group"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-heading text-[10px] uppercase tracking-[0.28em] text-carolina-light mb-1">
                  Player Records
                </div>
                <div className="font-display text-xl tracking-[0.04em] leading-tight">
                  Career Leaders
                </div>
                <div
                  className="mt-2 text-white/65 leading-snug"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                  }}
                >
                  The all-time leader per career stat — hits, HRs, ERA, WHIP,
                  and rate-stat leaders.
                </div>
              </div>
              <span className="font-display text-2xl text-carolina-light shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/history/team-records"
            className="block bg-navy text-white border border-navy hover:bg-navy-dark transition-colors rounded-md px-5 py-4 group"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-heading text-[10px] uppercase tracking-[0.28em] text-amber-300 mb-1">
                  Team Records
                </div>
                <div className="font-display text-xl tracking-[0.04em] leading-tight">
                  Team &amp; Game Records
                </div>
                <div
                  className="mt-2 text-white/65 leading-snug"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                  }}
                >
                  Most team wins, lowest team ERA, single-game peaks,
                  postseason honors.
                </div>
              </div>
              <span className="font-display text-2xl text-amber-300 shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>

          <Link
            href="/history/records"
            className="block bg-white text-navy border border-navy/20 hover:border-navy/50 transition-colors rounded-md px-5 py-4 group"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <div className="font-heading text-[10px] uppercase tracking-[0.28em] text-carolina-dark mb-1">
                  Player Rankings
                </div>
                <div className="font-display text-xl tracking-[0.04em] text-navy leading-tight">
                  Top-10 Lists · Season &amp; Career
                </div>
                <div
                  className="mt-2 text-navy/65 leading-snug"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: "0.88rem",
                  }}
                >
                  Ranks 1-10 for every category, with BBCOR-era filter.
                </div>
              </div>
              <span className="font-display text-2xl text-navy/40 shrink-0 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        </div>

        <EditorialDivider label="Browse by Year" />

        {/* Era filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="font-heading text-[10px] uppercase tracking-[0.22em] text-navy/55 mr-2">
            Era
          </span>
          {(
            [
              { key: "all", label: `All ${totalSeasons} seasons` },
              { key: "pre-bbcor", label: `Pre-BBCOR (1990–${BBCOR_ERA_START - 1}) · ${preBbcorCount}` },
              { key: "bbcor", label: `BBCOR (${BBCOR_ERA_START}–) · ${bbcorCount}` },
            ] as { key: Filter; label: string }[]
          ).map((b) => (
            <button
              key={b.key}
              onClick={() => setFilter(b.key)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-heading font-bold uppercase tracking-[0.18em] transition-colors ${
                filter === b.key
                  ? "bg-navy text-white"
                  : "bg-white text-navy/60 border border-navy/15 hover:border-navy/40"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Year grid */}
        <SectionHeader
          title="Seasons"
          count={filtered.length}
          countLabel="archived"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filtered.map((s) => (
            <YearCard key={s.year} season={s} />
          ))}
        </div>
      </div>
    </main>
  );
}

interface Honor {
  label: string;
  /** Banner color class, used only for the top (most-prestigious) honor. */
  bannerCls: string;
  /** Inline pill color class (used when honor isn't on the banner). */
  pillCls: string;
}

/** Build the ordered list of honors a season earned, most-prestigious first.
 *  Order: State Champ → State medal (2nd/3rd) → District Champ → League
 *         Champ → Made-State (4th-16th). */
function honorsFor(season: Season): Honor[] {
  const out: Honor[] = [];
  const sp = season.statePlace;
  if (season.stateChamp) {
    out.push({
      label: "State Champs",
      bannerCls: "bg-amber-400 text-navy",
      pillCls: "border-amber-400/70 bg-amber-50 text-amber-900",
    });
  } else if (sp === 2 || sp === 3) {
    out.push({
      label: sp === 2 ? "2nd at State" : "3rd at State",
      bannerCls: "bg-stone-300 text-navy",
      pillCls: "border-stone-300 bg-stone-50 text-stone-700",
    });
  }
  if (season.districtChamp) {
    out.push({
      label: "District Champs",
      bannerCls: "bg-carolina text-white",
      pillCls: "border-carolina/40 bg-carolina/10 text-carolina-dark",
    });
  }
  if (season.leagueChamp) {
    out.push({
      label: "League Champs",
      bannerCls: "bg-navy text-white",
      pillCls: "border-navy/30 bg-navy/[0.04] text-navy",
    });
  }
  // Made-state-but-not-podium goes last (less prestigious than league title)
  if (sp && sp > 3) {
    out.push({
      label: `T-${sp} @ State`,
      bannerCls: "bg-stone-200 text-navy",
      pillCls: "border-navy/15 bg-white text-navy/65",
    });
  }
  return out;
}

function YearCard({ season }: { season: Season }) {
  const recordStr = season.record
    ? `${season.record.W}–${season.record.L}`
    : "—";

  const honors = honorsFor(season);
  const banner = honors[0];
  const secondaryHonors = honors.slice(1);

  return (
    <Link
      href={`/history/${season.year}`}
      className="group relative bg-white border border-navy/15 rounded-md overflow-hidden hover:border-navy/40 transition-colors flex flex-col"
    >
      {banner && (
        <div
          className={`text-[9px] font-heading font-bold uppercase tracking-[0.18em] py-1 px-2 text-center ${banner.bannerCls}`}
        >
          {banner.label}
        </div>
      )}
      <div className="p-3 sm:p-4">
        <div className="font-display text-3xl sm:text-4xl tracking-[0.04em] text-navy tabular-nums leading-none">
          {season.year}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg text-navy/80 tabular-nums">
            {recordStr}
          </span>
          {season.record && (
            <span className="font-heading text-[9px] uppercase tracking-[0.2em] text-navy/45">
              W–L
            </span>
          )}
        </div>
        {season.league && (
          <div
            className="mt-2.5 text-navy/60 leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.78rem",
            }}
          >
            {season.league}
          </div>
        )}
        {secondaryHonors.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {secondaryHonors.map((h) => (
              <span
                key={h.label}
                className={`text-[8.5px] font-heading font-bold uppercase tracking-[0.16em] border rounded px-1.5 py-0.5 ${h.pillCls}`}
              >
                {h.label}
              </span>
            ))}
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={`text-[8.5px] font-heading font-bold uppercase tracking-[0.18em] px-1.5 py-0.5 rounded ${
              season.era === "bbcor"
                ? "bg-carolina/15 text-carolina-dark"
                : "bg-amber-100 text-amber-900"
            }`}
          >
            {season.era === "bbcor" ? "BBCOR" : "Pre-BBCOR"}
          </span>
          <span className="text-[10px] text-navy/40 ml-auto group-hover:text-navy transition-colors">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
