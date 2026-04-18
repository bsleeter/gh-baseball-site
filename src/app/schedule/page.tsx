"use client";

import { useState } from "react";
import { useAllGames } from "@/lib/hooks";
import type { DbGame } from "@/lib/database";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";

type TeamKey = "varsity" | "jv" | "cteam";

const tabs: { key: TeamKey; label: string }[] = [
  { key: "varsity", label: "Varsity" },
  { key: "jv", label: "JV" },
  { key: "cteam", label: "C Team" },
];

function GameRow({ game, index }: { game: DbGame; index: number }) {
  const d = new Date(game.date + "T12:00:00");
  const day = d.toLocaleDateString("en-US", { day: "numeric" });
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });

  const locationBadge =
    game.location === "home"
      ? "bg-home text-home-text"
      : game.location === "away"
      ? "bg-away text-away-text"
      : "bg-event text-event-text";

  const locationLabel =
    game.location === "home"
      ? "Home"
      : game.location === "away"
      ? "Away"
      : "Neutral";

  return (
    <div className="relative border-b border-navy/10 last:border-b-0 hover:bg-navy/[0.015] transition-colors">
      <div className="px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Ordinal */}
        <span className="absolute top-3 right-4 sm:static sm:shrink-0 font-body text-[10px] font-medium tracking-[0.18em] text-navy/25 tabular-nums sm:order-none">
          №&thinsp;{String(index).padStart(2, "0")}
        </span>

        {/* Date block */}
        <div className="shrink-0 sm:w-24 flex sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0">
          <span className="font-display text-3xl leading-none text-navy tabular-nums">
            {day}
          </span>
          <div className="flex sm:flex-col items-baseline gap-2 sm:gap-0 sm:mt-1">
            <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-navy/50">
              {month}
            </span>
            <span className="font-heading text-[10px] uppercase tracking-[0.18em] text-navy/35">
              {weekday}
            </span>
          </div>
        </div>

        {/* Rule (desktop only) */}
        <span className="hidden sm:block w-px h-10 bg-navy/10 shrink-0" />

        {/* Opponent */}
        <div className="flex-1 min-w-0">
          <p
            className="text-navy leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.05rem",
              fontWeight: 500,
            }}
          >
            <span className="text-navy/55 mr-1.5">
              {game.location === "home" ? "vs" : "@"}
            </span>
            {game.opponent}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-navy/45 font-heading">
            <span>{game.time}</span>
            <span className="text-navy/20">·</span>
            <span className="truncate">{game.venue}</span>
          </div>
          {game.notes && (
            <p className="text-xs text-carolina-dark font-heading mt-1">
              {game.notes}
            </p>
          )}
          {game.highlights && (
            <p
              className="text-xs text-navy/60 mt-1 leading-relaxed"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "0.82rem",
              }}
            >
              {game.highlights}
            </p>
          )}
        </div>

        {/* Location badge */}
        <span
          className={`shrink-0 px-2.5 py-0.5 rounded-full text-[9px] font-heading font-bold uppercase tracking-[0.18em] ${locationBadge}`}
        >
          {locationLabel}
        </span>

        {/* Result */}
        <div className="shrink-0 w-24 text-right">
          {game.result ? (
            <div className="flex items-center justify-end gap-2">
              <span
                className={`font-display text-xs px-1.5 py-0.5 rounded tracking-wider ${
                  game.result === "W"
                    ? "bg-green-100 text-win"
                    : "bg-red-50 text-loss"
                }`}
              >
                {game.result}
              </span>
              <span className="font-display text-xl text-navy tabular-nums">
                {game.score_us}-{game.score_them}
              </span>
            </div>
          ) : (
            <span className="font-heading text-[10px] uppercase tracking-[0.2em] text-navy/30">
              Upcoming
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<TeamKey>("varsity");
  const { grouped, loading } = useAllGames();

  const games = grouped?.[activeTab] ?? [];
  const record = games.reduce(
    (acc, g) => {
      if (g.result === "W") acc.wins++;
      else if (g.result === "L") acc.losses++;
      return acc;
    },
    { wins: 0, losses: 0 }
  );
  const total = games.length;
  const played = record.wins + record.losses;
  const upcoming = total - played;

  return (
    <>
      <PageHeader
        kicker="Tides Baseball · 2026"
        title={
          <>
            <span className="text-carolina-light">2026</span> SCHEDULE
          </>
        }
        subtitle="Every game on the 2026 slate — Varsity, JV, and C Team. Track the season game by game."
        stats={[
          {
            value: `${record.wins}-${record.losses}`,
            label: `${tabs.find((t) => t.key === activeTab)?.label} record`,
          },
          { value: played, label: "Games played" },
          { value: upcoming, label: "Games remaining" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <EditorialDivider label="Schedule" />

        {/* Team tabs */}
        <div className="mb-6 flex items-center gap-3 border-b border-navy/10">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 font-heading font-bold uppercase tracking-[0.18em] text-sm transition-colors relative ${
                  active ? "text-navy" : "text-navy/40 hover:text-navy/70"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-carolina" />
                )}
              </button>
            );
          })}
        </div>

        <SectionHeader
          title={`${tabs.find((t) => t.key === activeTab)?.label} Games`}
          kicker={`${record.wins}-${record.losses}`}
          count={total}
          countLabel={total === 1 ? "Game" : "Games"}
        />

        {loading ? (
          <p
            className="text-navy/40 py-12 text-center"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.95rem",
            }}
          >
            Loading schedule…
          </p>
        ) : games.length === 0 ? (
          <div className="record-paper border border-dashed border-navy/20 py-10 px-6 text-center">
            <p
              className="text-navy/55"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "0.95rem",
              }}
            >
              No games on the schedule yet.
            </p>
          </div>
        ) : (
          <div className="record-paper border border-navy/15 shadow-[0_1px_0_rgba(27,42,74,0.04),0_12px_30px_-18px_rgba(27,42,74,0.25)]">
            {games.map((game, i) => (
              <GameRow key={game.id} game={game} index={i + 1} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
