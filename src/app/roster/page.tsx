"use client";

import { useState } from "react";
import { useAllPlayersGrouped } from "@/lib/hooks";
import type { DbPlayer } from "@/lib/database";

type TeamKey = "varsity" | "jv" | "cteam";

const tabs: { key: TeamKey; label: string }[] = [
  { key: "varsity", label: "Varsity" },
  { key: "jv", label: "JV" },
  { key: "cteam", label: "C Team" },
];

function PlayerCard({ player }: { player: DbPlayer }) {
  return (
    <div className="bg-white rounded-lg border border-navy/8 p-4 card-lift flex items-center gap-4">
      <div className="shrink-0 w-12 h-12 rounded-lg bg-navy flex items-center justify-center">
        <span className="font-display text-xl text-white">{player.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-heading font-bold text-navy truncate">{player.first_name} {player.last_name}</p>
        <p className="text-xs text-navy/50 font-heading truncate">{player.positions.join(", ")}</p>
      </div>
      <div className="shrink-0 text-right">
        <span className="block text-xs font-heading font-semibold text-navy/40 uppercase tracking-wider">
          &rsquo;{String(player.grad_year).slice(-2)}
        </span>
        {player.bats && player.throws && (
          <span className="block text-[10px] font-heading text-navy/30">
            B/T: {player.bats}/{player.throws}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RosterPage() {
  const [activeTab, setActiveTab] = useState<TeamKey>("varsity");
  const { grouped, loading } = useAllPlayersGrouped();

  const players = grouped?.[activeTab] ?? [];
  const years = [...new Set(players.map((p) => p.grad_year))].sort();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl tracking-wide text-navy">2026 ROSTERS</h1>
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

      <div className="mb-6 bg-white rounded-lg border border-navy/8 px-5 py-3 w-fit">
        <span className="font-heading font-bold text-sm text-navy uppercase tracking-wider">
          {tabs.find((t) => t.key === activeTab)?.label}
        </span>
        <span className="text-navy/40 mx-2">&middot;</span>
        <span className="font-heading text-sm text-navy/60">{players.length} players</span>
      </div>

      {loading ? (
        <p className="text-navy/40 font-heading py-8 text-center">Loading roster...</p>
      ) : (
        years.map((year) => (
          <div key={year} className="mb-8">
            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-navy/40 mb-3">
              Class of {year}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {players
                .filter((p) => p.grad_year === year)
                .sort((a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`))
                .map((player) => (
                  <PlayerCard key={player.id} player={player} />
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
