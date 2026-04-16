"use client";

import Image from "next/image";
import Link from "next/link";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { useGames, useAllGames, useFundraising } from "@/lib/hooks";
import type { DbGame } from "@/lib/database";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getRecord(games: DbGame[]) {
  return games.reduce(
    (acc, g) => {
      if (g.result === "W") acc.wins++;
      else if (g.result === "L") acc.losses++;
      return acc;
    },
    { wins: 0, losses: 0 }
  );
}

export default function HomePage() {
  const { data: varsityGames } = useGames("varsity");
  const { grouped } = useAllGames();
  const { data: fundraising } = useFundraising();

  const games = varsityGames ?? [];
  const record = getRecord(games);
  const jvRecord = getRecord(grouped?.jv ?? []);
  const cRecord = getRecord(grouped?.cteam ?? []);
  const today = new Date().toISOString().split("T")[0];
  const upcoming = games.filter((g) => g.date >= today && !g.result).slice(0, 3);
  const recent = games.filter((g) => g.result).slice(-5).reverse();

  const goal = fundraising?.goal ?? 50000;
  const raised = fundraising?.raised ?? 0;
  const pct = Math.round((raised / goal) * 100);

  return (
    <>
      <AnnouncementBanner />

      {/* Hero */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/team-photo.webp"
            alt="Gig Harbor Tides Baseball Team"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[60px] bg-carolina" />
              <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-[0.25em]">
                2026 Season
              </span>
            </div>
            <h1 className="font-display text-5xl sm:text-7xl text-white leading-[0.9] tracking-wide">
              GIG HARBOR<br />
              <span className="text-carolina-light">TIDES BASEBALL</span>
            </h1>
            <p className="mt-5 text-white/60 text-lg font-heading max-w-md">
              Class 3A &middot; South Puget Sound League &middot; Gig Harbor, WA
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/10">
                <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-wider">Varsity</span>
                <span className="score-display text-2xl text-white">{record.wins}-{record.losses}</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/10">
                <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-wider">JV</span>
                <span className="score-display text-2xl text-white">{jvRecord.wins}-{jvRecord.losses}</span>
              </div>
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/10">
                <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-wider">C Team</span>
                <span className="score-display text-2xl text-white">{cRecord.wins}-{cRecord.losses}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 bg-cream" style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }} />
      </section>

      {/* Content grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Games */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-2xl tracking-wide text-navy">UPCOMING GAMES</h2>
              <Link href="/schedule" className="text-sm font-heading font-semibold text-carolina-dark hover:text-carolina uppercase tracking-wider">
                Full Schedule &rarr;
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-navy/50 font-heading">No upcoming games scheduled.</p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((game) => (
                  <div key={game.id} className="card-lift bg-white rounded-lg border border-navy/8 p-4 flex items-center gap-4">
                    <div className="shrink-0 w-14 text-center">
                      <span className="block font-display text-2xl text-navy leading-none">
                        {new Date(game.date + "T12:00:00").getDate()}
                      </span>
                      <span className="block text-[10px] font-heading uppercase tracking-wider text-navy/50">
                        {new Date(game.date + "T12:00:00").toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="w-px h-10 bg-navy/10" />
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-navy truncate">
                        {game.location === "home" ? "vs" : "@"} {game.opponent}
                      </p>
                      <p className="text-sm text-navy/50 truncate">{game.time} &middot; {game.venue}</p>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider ${
                      game.location === "home" ? "bg-home text-home-text" : game.location === "away" ? "bg-away text-away-text" : "bg-event text-event-text"
                    }`}>
                      {game.location === "home" ? "Home" : game.location === "away" ? "Away" : "Neutral"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Results */}
          <section>
            <h2 className="font-display text-2xl tracking-wide text-navy mb-5">RECENT RESULTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recent.map((game) => (
                <div key={game.id} className="bg-white rounded-lg border border-navy/8 p-4 flex items-center gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg ${
                    game.result === "W" ? "bg-green-100 text-win" : "bg-red-50 text-loss"
                  }`}>
                    {game.result}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-heading font-bold text-sm text-navy truncate">
                      {game.location === "home" ? "vs" : "@"} {game.opponent}
                    </p>
                    <p className="text-xs text-navy/50">{formatDate(game.date)}</p>
                  </div>
                  <span className="score-display text-xl text-navy">{game.score_us}-{game.score_them}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 2025 Season Recap */}
          <section className="bg-white rounded-lg border border-navy/8 p-6">
            <h2 className="font-display text-2xl tracking-wide text-navy mb-1">2025 SEASON</h2>
            <div className="stitch-line mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="score-display text-3xl text-navy">25-3</span>
                <span className="block text-xs font-heading uppercase tracking-wider text-navy/50 mt-1">Overall</span>
              </div>
              <div>
                <span className="score-display text-3xl text-navy">15-1</span>
                <span className="block text-xs font-heading uppercase tracking-wider text-navy/50 mt-1">Conference</span>
              </div>
              <div>
                <span className="score-display text-3xl text-carolina">#1</span>
                <span className="block text-xs font-heading uppercase tracking-wider text-navy/50 mt-1">State Rank</span>
              </div>
              <div>
                <span className="score-display text-3xl text-navy">1.42</span>
                <span className="block text-xs font-heading uppercase tracking-wider text-navy/50 mt-1">Team ERA</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-navy/60 font-heading">
              Class 3A State Final Four &middot; Fell to Kennewick in semifinals
            </p>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-navy/8 overflow-hidden">
            <div className="bg-navy px-5 py-4">
              <h3 className="font-display text-xl text-white tracking-wide">SUPPORT OUR FIELD</h3>
              <p className="text-xs font-heading text-white/50 mt-1 uppercase tracking-wider">Field Renovation Fund</p>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-end mb-2">
                <span className="score-display text-2xl text-navy">${raised.toLocaleString()}</span>
                <span className="text-xs font-heading text-navy/50 uppercase tracking-wider">of ${goal.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-navy/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-carolina to-carolina-light rounded-full animate-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-navy/40 mt-2 font-heading">{pct}% of goal reached</p>
              <Link href="/donate" className="mt-4 block text-center bg-carolina hover:bg-carolina-dark text-white font-heading font-bold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors">
                Make a Donation
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-navy/8 p-5 space-y-3">
            <h3 className="font-display text-lg tracking-wide text-navy">QUICK LINKS</h3>
            <div className="space-y-2">
              {[
                { href: "/schedule", label: "Full Schedule", icon: "📅" },
                { href: "/roster", label: "Team Rosters", icon: "👥" },
                { href: "/donate", label: "Donate Now", icon: "💙" },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-navy/5 transition-colors group">
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-heading font-semibold text-sm text-navy group-hover:text-carolina-dark transition-colors">{link.label}</span>
                  <span className="ml-auto text-navy/30 group-hover:text-carolina transition-colors">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-navy/8 p-5">
            <h3 className="font-display text-lg tracking-wide text-navy mb-2">HOME FIELD</h3>
            <p className="text-sm font-heading text-navy/70 leading-relaxed">Sehmel Homestead Park<br />Gig Harbor, WA 98335</p>
            <p className="text-sm font-heading text-navy/70 mt-2 leading-relaxed">Gig Harbor High School<br />5101 Rosedale St NW</p>
          </div>
        </div>
      </div>
    </>
  );
}
