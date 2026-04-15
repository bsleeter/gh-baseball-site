"use client";

import { useState } from "react";
import { useAllGames } from "@/lib/hooks";
import type { DbGame } from "@/lib/database";

type TeamKey = "varsity" | "jv" | "cteam";

const tabs: { key: TeamKey; label: string }[] = [
  { key: "varsity", label: "Varsity" },
  { key: "jv", label: "JV" },
  { key: "cteam", label: "C Team" },
];

function GameRow({ game }: { game: DbGame }) {
  const d = new Date(game.date + "T12:00:00");
  const dateStr = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const locationBadge =
    game.location === "home" ? "bg-home text-home-text"
    : game.location === "away" ? "bg-away text-away-text"
    : "bg-event text-event-text";

  const locationLabel =
    game.location === "home" ? "Home" : game.location === "away" ? "Away" : "Neutral";

  return (
    <div className="bg-white rounded-lg border border-navy/8 p-4 flex flex-col sm:flex-row sm:items-center gap-3 card-lift">
      <div className="shrink-0 w-28">
        <span className="text-sm font-heading font-semibold text-navy">{dateStr}</span>
        <span className="block text-xs text-navy/40 font-heading">{game.time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-navy truncate">
          {game.location === "home" ? "vs" : "@"} {game.opponent}
        </p>
        <p className="text-xs text-navy/40 truncate font-heading">{game.venue}</p>
        {game.notes && <p className="text-xs text-carolina-dark font-heading mt-0.5">{game.notes}</p>}
        {game.highlights && <p className="text-xs text-navy/60 font-body mt-1 italic leading-relaxed">{game.highlights}</p>}
      </div>
      <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${locationBadge}`}>
        {locationLabel}
      </span>
      <div className="shrink-0 w-20 text-right">
        {game.result ? (
          <div className="flex items-center justify-end gap-2">
            <span className={`font-display text-sm px-2 py-0.5 rounded ${game.result === "W" ? "bg-green-100 text-win" : "bg-red-50 text-loss"}`}>
              {game.result}
            </span>
            <span className="score-display text-lg text-navy">{game.score_us}-{game.score_them}</span>
          </div>
        ) : (
          <span className="text-xs font-heading text-navy/30 uppercase tracking-wider">{game.time}</span>
        )}
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-navy">2026 SCHEDULE</h1>
        <div className="stitch-line mt-2 max-w-[200px]" />
      </div>

      <div className="flex gap-1 bg-navy/5 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-md font-heading font-bold uppercase tracking-wider text-sm transition-all ${
              activeTab === tab.key ? "bg-navy text-white shadow-sm" : "text-navy/60 hover:text-navy hover:bg-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-6 bg-white rounded-lg border border-navy/8 px-5 py-3 w-fit">
        <span className="font-heading font-bold text-sm text-navy uppercase tracking-wider">
          {tabs.find((t) => t.key === activeTab)?.label} Record:
        </span>
        <span className="score-display text-xl text-navy">{record.wins}-{record.losses}</span>
      </div>

      {loading ? (
        <p className="text-navy/40 font-heading py-8 text-center">Loading schedule...</p>
      ) : (
        <div className="space-y-2">
          {games.map((game) => (
            <GameRow key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
