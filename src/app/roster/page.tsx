"use client";

import { useState } from "react";
import { useAllPlayersGrouped } from "@/lib/hooks";
import type { DbPlayer } from "@/lib/database";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";

type TeamKey = "varsity" | "jv" | "cteam";

const tabs: { key: TeamKey; label: string }[] = [
  { key: "varsity", label: "Varsity" },
  { key: "jv", label: "JV" },
  { key: "cteam", label: "C Team" },
];

function PlayerRow({ player, index }: { player: DbPlayer; index: number }) {
  return (
    <div className="relative border-b border-navy/10 last:border-b-0 hover:bg-navy/[0.015] transition-colors">
      <div className="px-4 sm:px-5 py-3.5 flex items-center gap-4">
        {/* Ordinal */}
        <span className="shrink-0 font-body text-[10px] font-medium tracking-[0.18em] text-navy/25 tabular-nums w-6">
          {String(index).padStart(2, "0")}
        </span>

        {/* Jersey number */}
        <div className="shrink-0 w-12 h-12 flex items-center justify-center bg-navy text-white relative">
          <span className="font-display text-2xl tabular-nums leading-none">
            {player.number}
          </span>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-px bg-carolina" />
        </div>

        {/* Name + positions */}
        <div className="flex-1 min-w-0">
          <p
            className="text-navy leading-tight"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.05rem",
              fontWeight: 500,
            }}
          >
            {player.first_name} {player.last_name}
          </p>
          <p className="text-[11px] text-navy/45 font-heading uppercase tracking-[0.15em] mt-0.5 truncate">
            {player.positions.join(" · ")}
          </p>
        </div>

        {/* Bats/Throws */}
        {player.bats && player.throws && (
          <div className="shrink-0 hidden sm:flex items-baseline gap-2 text-[10px] font-heading text-navy/45 uppercase tracking-[0.15em]">
            <span>
              B:<span className="text-navy/70 ml-0.5 font-bold">{player.bats}</span>
            </span>
            <span className="text-navy/20">·</span>
            <span>
              T:<span className="text-navy/70 ml-0.5 font-bold">{player.throws}</span>
            </span>
          </div>
        )}

        {/* Class year */}
        <span className="shrink-0 font-display text-sm tracking-wider text-navy/55 tabular-nums">
          &rsquo;{String(player.grad_year).slice(-2)}
        </span>
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
    <>
      <PageHeader
        kicker="Tides Baseball · 2026"
        title={
          <>
            <span className="text-carolina-light">2026</span> ROSTER
          </>
        }
        subtitle="The players chronicled this season — Varsity, JV, and C Team."
        stats={[
          { value: players.length, label: `${tabs.find((t) => t.key === activeTab)?.label} players` },
          { value: years.length, label: "Class years" },
          { value: 3, label: "Teams on the field" },
        ]}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <EditorialDivider label="Roster" />

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

        {loading ? (
          <p
            className="text-navy/40 py-12 text-center"
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "0.95rem",
            }}
          >
            Loading roster…
          </p>
        ) : (
          years.map((year) => {
            const classPlayers = players
              .filter((p) => p.grad_year === year)
              .sort((a, b) =>
                `${a.first_name} ${a.last_name}`.localeCompare(
                  `${b.first_name} ${b.last_name}`
                )
              );
            return (
              <section key={year} className="mb-12">
                <SectionHeader
                  title={`Class of ${year}`}
                  count={classPlayers.length}
                  countLabel={classPlayers.length === 1 ? "Player" : "Players"}
                />
                <div className="record-paper border border-navy/15 shadow-[0_1px_0_rgba(27,42,74,0.04),0_12px_30px_-18px_rgba(27,42,74,0.25)]">
                  {classPlayers.map((player, i) => (
                    <PlayerRow key={player.id} player={player} index={i + 1} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>
    </>
  );
}
