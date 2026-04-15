"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  signIn,
  signOut,
  getSession,
  updateGameScore,
  createAnnouncement,
  deleteAnnouncement,
  createGame,
  deleteGame,
} from "@/lib/database";
import { useAllGames, useAnnouncements, useFundraising } from "@/lib/hooks";
import RosterManager from "@/components/RosterManager";
import type { DbGame } from "@/lib/database";

type TeamKey = "varsity" | "jv" | "cteam";

const teamLabels: Record<TeamKey, string> = {
  varsity: "Varsity",
  jv: "JV",
  cteam: "C Team",
};

export default function AdminPage() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [scoreTeam, setScoreTeam] = useState<TeamKey>("varsity");
  const [selectedGameId, setSelectedGameId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showAddGame, setShowAddGame] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annUrgency, setAnnUrgency] = useState<"info" | "warning" | "urgent">("info");

  // Data
  const { grouped, loading: gamesLoading, refetch: refetchGames } = useAllGames();
  const { data: announcements, refetch: refetchAnnouncements } = useAnnouncements(false);
  const { data: fundraising } = useFundraising();

  // Check auth on mount
  useEffect(() => {
    getSession().then((s) => {
      setSession(s);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed");
    }
  }

  async function handleSignOut() {
    await signOut();
    setSession(null);
  }

  // Login screen
  if (authLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-navy/40 font-heading">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-lg border border-navy/8 p-8">
          <h1 className="font-display text-3xl tracking-wide text-navy mb-2 text-center">COACH LOGIN</h1>
          <div className="stitch-line mb-6 max-w-[100px] mx-auto" />
          <form onSubmit={handleSignIn}>
            <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-navy/10 bg-white font-heading text-navy focus:border-carolina focus:outline-none transition-colors mb-3"
              placeholder="coach@ghbaseball.com"
              required
            />
            <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-navy/10 bg-white font-heading text-navy focus:border-carolina focus:outline-none transition-colors"
              placeholder="Enter password"
              required
            />
            {authError && <p className="text-red-600 text-xs font-heading mt-2">{authError}</p>}
            <button type="submit" className="mt-4 w-full bg-navy hover:bg-navy-light text-white font-heading font-bold uppercase tracking-wider text-sm py-3 rounded-lg transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  const currentGames = grouped?.[scoreTeam] ?? [];
  const unplayedGames = currentGames.filter((g) => !g.result);
  const playedGames = currentGames.filter((g) => g.result);
  const selectedGame = currentGames.find((g) => g.id === selectedGameId);

  async function handleSaveScore(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGame) return;
    setSaving(true);
    setSaveMsg("");
    const form = e.target as HTMLFormElement;
    const scoreUs = parseInt((form.elements.namedItem("scoreUs") as HTMLInputElement).value);
    const scoreThem = parseInt((form.elements.namedItem("scoreThem") as HTMLInputElement).value);
    const highlights = (form.elements.namedItem("highlights") as HTMLTextAreaElement).value;
    try {
      await updateGameScore(selectedGame.id, scoreUs, scoreThem, highlights);
      setSaveMsg("Score saved!");
      setSelectedGameId("");
      refetchGames();
    } catch (err: unknown) {
      setSaveMsg(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handlePostAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createAnnouncement(annTitle, annMessage, annUrgency);
      setAnnTitle("");
      setAnnMessage("");
      setAnnUrgency("info");
      refetchAnnouncements();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to post");
    }
  }

  async function handleDeleteAnnouncement(id: string) {
    try {
      await deleteAnnouncement(id);
      refetchAnnouncements();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-navy">ADMIN DASHBOARD</h1>
          <div className="stitch-line mt-2 max-w-[200px]" />
        </div>
        <div className="text-right">
          <p className="text-xs font-heading text-navy/40">{session.user.email}</p>
          <button onClick={handleSignOut} className="text-sm font-heading font-semibold text-navy/40 hover:text-navy uppercase tracking-wider transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Game Score */}
          <AdminCard title="UPDATE GAME SCORE">
            <div className="flex gap-1 bg-navy/5 rounded-lg p-1 mb-4">
              {(["varsity", "jv", "cteam"] as TeamKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setScoreTeam(t); setSelectedGameId(""); }}
                  className={`flex-1 px-3 py-1.5 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${
                    scoreTeam === t ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-white/60"
                  }`}
                >
                  {teamLabels[t]}
                </button>
              ))}
            </div>

            {gamesLoading ? (
              <p className="text-navy/40 font-heading text-sm py-4 text-center">Loading...</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1.5">Select Game</label>
                  <select
                    value={selectedGameId}
                    onChange={(e) => { setSelectedGameId(e.target.value); setSaveMsg(""); }}
                    className="w-full px-3 py-2.5 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white"
                  >
                    <option value="">Choose a game...</option>
                    {unplayedGames.length > 0 && (
                      <optgroup label="Needs Score">
                        {unplayedGames.map((g) => {
                          const d = new Date(g.date + "T12:00:00");
                          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                          return <option key={g.id} value={g.id}>{dateStr} — {g.location === "home" ? "vs" : "@"} {g.opponent}</option>;
                        })}
                      </optgroup>
                    )}
                    {playedGames.length > 0 && (
                      <optgroup label="Completed">
                        {playedGames.map((g) => {
                          const d = new Date(g.date + "T12:00:00");
                          const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                          return <option key={g.id} value={g.id}>{g.result} {g.score_us}-{g.score_them} · {dateStr} — {g.location === "home" ? "vs" : "@"} {g.opponent}</option>;
                        })}
                      </optgroup>
                    )}
                  </select>
                </div>

                {selectedGame && (
                  <form onSubmit={handleSaveScore} className="bg-navy/3 rounded-lg p-4 border border-navy/5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-heading font-bold text-sm text-navy">
                          {new Date(selectedGame.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} — {selectedGame.location === "home" ? "vs" : "@"} {selectedGame.opponent}
                        </span>
                        <span className="block text-xs text-navy/40 font-heading">{selectedGame.time} &middot; {selectedGame.venue}</span>
                      </div>
                      {selectedGame.result && (
                        <span className={`font-display text-sm px-2 py-0.5 rounded ${selectedGame.result === "W" ? "bg-green-100 text-win" : "bg-red-50 text-loss"}`}>
                          {selectedGame.result}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">Tides</label>
                        <input name="scoreUs" type="number" min="0" required defaultValue={selectedGame.score_us ?? ""} className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">{selectedGame.opponent}</label>
                        <input name="scoreThem" type="number" min="0" required defaultValue={selectedGame.score_them ?? ""} className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1">Game Highlights (optional)</label>
                      <textarea name="highlights" rows={2} defaultValue={selectedGame.highlights ?? ""} placeholder="Key plays, standout performances..." className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={saving} className="flex-1 bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white font-heading font-bold uppercase tracking-wider text-xs py-2 rounded-lg transition-colors">
                        {saving ? "Saving..." : "Save Score"}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!selectedGame || !confirm(`Delete the game vs ${selectedGame.opponent} on ${selectedGame.date}?`)) return;
                          try {
                            await deleteGame(selectedGame.id);
                            setSelectedGameId("");
                            refetchGames();
                          } catch (err) {
                            alert(err instanceof Error ? err.message : "Delete failed");
                          }
                        }}
                        className="px-4 py-2 rounded-lg border border-red-200 text-xs font-heading font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    {saveMsg && <p className="text-xs font-heading text-center mt-2 text-carolina-dark">{saveMsg}</p>}
                  </form>
                )}

                {!selectedGame && (
                  <p className="text-navy/30 font-heading text-xs text-center py-2">
                    {currentGames.length} games &middot; {unplayedGames.length} need scores
                  </p>
                )}

                {/* Add Game */}
                <div className="pt-3 border-t border-navy/8 mt-4">
                  {!showAddGame ? (
                    <button
                      onClick={() => setShowAddGame(true)}
                      className="w-full py-2 rounded-lg border border-dashed border-navy/20 text-xs font-heading font-bold uppercase tracking-wider text-navy/40 hover:text-navy hover:border-navy/40 transition-colors"
                    >
                      + Add Game
                    </button>
                  ) : (
                    <AddGameForm
                      team={scoreTeam}
                      onSave={() => { setShowAddGame(false); refetchGames(); }}
                      onCancel={() => setShowAddGame(false)}
                    />
                  )}
                </div>
              </div>
            )}
          </AdminCard>

          {/* Roster Management */}
          <AdminCard title="MANAGE ROSTERS">
            <RosterManager />
          </AdminCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Post Announcement */}
          <AdminCard title="POST ANNOUNCEMENT">
            <form onSubmit={handlePostAnnouncement}>
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-1.5">Title</label>
              <input type="text" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required placeholder="e.g., Practice Cancelled" className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors mb-3" />
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-1.5">Message</label>
              <textarea value={annMessage} onChange={(e) => setAnnMessage(e.target.value)} required rows={3} placeholder="Details..." className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors resize-none mb-3" />
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-navy/50 mb-1.5">Urgency</label>
              <select value={annUrgency} onChange={(e) => setAnnUrgency(e.target.value as "info" | "warning" | "urgent")} className="w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors mb-4">
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="urgent">Urgent</option>
              </select>
              <button type="submit" className="w-full bg-carolina hover:bg-carolina-dark text-white font-heading font-bold uppercase tracking-wider text-xs py-2.5 rounded-lg transition-colors">
                Publish Announcement
              </button>
            </form>

            {/* Active announcements */}
            {announcements && announcements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-navy/8">
                <h4 className="font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-2">Active ({announcements.length})</h4>
                <div className="space-y-2">
                  {announcements.map((a) => (
                    <div key={a.id} className="flex items-start gap-2 p-2 rounded-lg bg-navy/3 border border-navy/5">
                      <div className="flex-1 min-w-0">
                        <p className="font-heading font-bold text-xs text-navy truncate">{a.title}</p>
                        <p className="text-[10px] text-navy/40 truncate">{a.message}</p>
                      </div>
                      <button onClick={() => handleDeleteAnnouncement(a.id)} className="text-xs text-red-400 hover:text-red-600 font-heading shrink-0">
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AdminCard>

          {/* Donation Summary */}
          <AdminCard title="DONATION SUMMARY">
            <div className="text-center py-2">
              <span className="score-display text-4xl text-navy">${(fundraising?.raised ?? 0).toLocaleString()}</span>
              <span className="block text-xs font-heading text-navy/50 mt-2 uppercase tracking-wider">Total Raised</span>
              <div className="mt-3 h-3 bg-navy/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-carolina to-carolina-light rounded-full" style={{ width: `${Math.round(((fundraising?.raised ?? 0) / (fundraising?.goal ?? 50000)) * 100)}%` }} />
              </div>
              <span className="text-xs font-heading text-navy/40 mt-2 block">
                {Math.round(((fundraising?.raised ?? 0) / (fundraising?.goal ?? 50000)) * 100)}% of ${(fundraising?.goal ?? 50000).toLocaleString()} goal
              </span>
            </div>
          </AdminCard>

          {/* Season Records */}
          <AdminCard title="SEASON AT A GLANCE">
            <div className="space-y-3">
              {(["varsity", "jv", "cteam"] as TeamKey[]).map((t) => {
                const teamGames = grouped?.[t] ?? [];
                const wins = teamGames.filter((g) => g.result === "W").length;
                const losses = teamGames.filter((g) => g.result === "L").length;
                return (
                  <div key={t} className="flex items-center justify-between py-2 border-b border-navy/5 last:border-0">
                    <span className="font-heading font-bold text-sm text-navy uppercase tracking-wider">{teamLabels[t]}</span>
                    <span className="score-display text-lg text-navy">{wins}-{losses}</span>
                  </div>
                );
              })}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}

function AddGameForm({
  team,
  onSave,
  onCancel,
}: {
  team: TeamKey;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const form = e.target as HTMLFormElement;
    try {
      await createGame({
        team,
        date: (form.elements.namedItem("date") as HTMLInputElement).value,
        time: (form.elements.namedItem("time") as HTMLInputElement).value,
        opponent: (form.elements.namedItem("opponent") as HTMLInputElement).value,
        location: (form.elements.namedItem("location") as HTMLSelectElement).value,
        venue: (form.elements.namedItem("venue") as HTMLInputElement).value,
      });
      onSave();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white";
  const labelClass = "block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1";

  return (
    <form onSubmit={handleSubmit} className="bg-navy/3 rounded-lg p-4 border border-navy/5 space-y-3">
      <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-navy">
        Add {teamLabels[team]} Game
      </h4>
      <div>
        <label className={labelClass}>Opponent</label>
        <input name="opponent" type="text" required placeholder="e.g., Peninsula" className={inputClass} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input name="date" type="date" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Time</label>
          <input name="time" type="text" required placeholder="4:00 PM" className={inputClass} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Home / Away</label>
          <select name="location" className={inputClass}>
            <option value="home">Home</option>
            <option value="away">Away</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Venue</label>
          <input name="venue" type="text" required placeholder="e.g., Sehmel Park" className={inputClass} />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-lg border border-navy/10 text-xs font-heading font-bold uppercase tracking-wider text-navy/50 hover:text-navy transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors">
          {saving ? "Adding..." : "Add Game"}
        </button>
      </div>
    </form>
  );
}

function AdminCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-navy/8 overflow-hidden">
      <div className="bg-navy/5 px-5 py-3 border-b border-navy/8">
        <h2 className="font-display text-lg tracking-wide text-navy">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
