"use client";

import { useState, useRef, useEffect } from "react";
import { POSITION_OPTIONS } from "@/data/roster";
import type { Position, BatsThrows } from "@/data/roster";
import { useAllPlayersGrouped } from "@/lib/hooks";
import { updatePlayer, movePlayer, type DbPlayer } from "@/lib/database";

type TeamKey = "varsity" | "jv" | "cteam";

interface DragData {
  playerId: string;
  fromTeam: TeamKey;
}

interface EditState {
  player: DbPlayer;
  team: TeamKey;
}

const teamLabels: Record<TeamKey, string> = {
  varsity: "Varsity",
  jv: "JV",
  cteam: "C Team",
};

const teamOrder: TeamKey[] = ["varsity", "jv", "cteam"];

const gradYearColors: Record<number, string> = {
  2026: "bg-navy text-white",
  2027: "bg-emerald-600 text-white",
  2028: "bg-carolina text-white",
  2029: "bg-amber-500 text-white",
};

// ─── Player Edit Modal ───────────────────────────────────────
function PlayerEditModal({
  player,
  team,
  onSave,
  onClose,
}: {
  player: DbPlayer;
  team: TeamKey;
  onSave: (updated: DbPlayer) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DbPlayer>({ ...player, positions: [...player.positions] });
  const [saving, setSaving] = useState(false);

  function setField<K extends keyof DbPlayer>(key: K, value: DbPlayer[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePosition(pos: string) {
    setForm((prev) => {
      const has = prev.positions.includes(pos);
      return { ...prev, positions: has ? prev.positions.filter((p) => p !== pos) : [...prev.positions, pos] };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePlayer(form);
      onSave(form);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white";
  const labelClass = "block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1";
  const selectClass = "w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white appearance-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
      <div className="relative bg-cream rounded-xl shadow-2xl border border-navy/10 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-navy px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-white tracking-wide">EDIT PLAYER</h3>
            <p className="text-xs font-heading text-white/50 uppercase tracking-wider">{teamLabels[team]}</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none transition-colors">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>First Name</label><input type="text" value={form.first_name} onChange={(e) => setField("first_name", e.target.value)} className={inputClass} required /></div>
            <div><label className={labelClass}>Last Name</label><input type="text" value={form.last_name} onChange={(e) => setField("last_name", e.target.value)} className={inputClass} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Jersey Number</label><input type="number" min="0" max="99" value={form.number} onChange={(e) => setField("number", parseInt(e.target.value) || 0)} className={inputClass} /></div>
            <div><label className={labelClass}>Grad Year</label><select value={form.grad_year} onChange={(e) => setField("grad_year", parseInt(e.target.value))} className={selectClass}>
              {[2026, 2027, 2028, 2029, 2030].map((y) => <option key={y} value={y}>{y}</option>)}
            </select></div>
          </div>
          <div>
            <label className={labelClass}>Positions</label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {POSITION_OPTIONS.map((pos) => {
                const selected = form.positions.includes(pos);
                return (
                  <button key={pos} type="button" onClick={() => togglePosition(pos)}
                    className={`px-2.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider transition-all border ${selected ? "bg-carolina text-white border-carolina" : "bg-white text-navy/40 border-navy/10 hover:border-carolina/40 hover:text-navy/60"}`}>
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Height</label><input type="text" placeholder={`5'11"`} value={form.height ?? ""} onChange={(e) => setField("height", e.target.value || null)} className={inputClass} /></div>
            <div><label className={labelClass}>Weight (lbs)</label><input type="number" min="80" max="300" placeholder="175" value={form.weight ?? ""} onChange={(e) => setField("weight", e.target.value ? parseInt(e.target.value) : null)} className={inputClass} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className={labelClass}>Bats</label><div className="flex gap-1">
              {(["R", "L", "S"] as BatsThrows[]).map((v) => (
                <button key={v} type="button" onClick={() => setField("bats", v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider border transition-all ${form.bats === v ? "bg-navy text-white border-navy" : "bg-white text-navy/40 border-navy/10 hover:border-navy/30"}`}>
                  {v === "R" ? "Right" : v === "L" ? "Left" : "Switch"}
                </button>
              ))}
            </div></div>
            <div><label className={labelClass}>Throws</label><div className="flex gap-1">
              {(["R", "L"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setField("throws", v)}
                  className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold uppercase tracking-wider border transition-all ${form.throws === v ? "bg-navy text-white border-navy" : "bg-white text-navy/40 border-navy/10 hover:border-navy/30"}`}>
                  {v === "R" ? "Right" : "Left"}
                </button>
              ))}
            </div></div>
          </div>
          <div><label className={labelClass}>College Commitment</label><input type="text" placeholder="e.g., University of Washington" value={form.college_commitment ?? ""} onChange={(e) => setField("college_commitment", e.target.value || null)} className={inputClass} /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-navy/10 text-xs font-heading font-bold uppercase tracking-wider text-navy/50 hover:text-navy transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors">
              {saving ? "Saving..." : "Save Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main RosterManager ──────────────────────────────────────
export default function RosterManager() {
  const { grouped, loading, refetch } = useAllPlayersGrouped();
  const [dragOver, setDragOver] = useState<TeamKey | null>(null);
  const dragDataRef = useRef<DragData | null>(null);
  const [editing, setEditing] = useState<EditState | null>(null);

  function handleDragStart(playerId: string, fromTeam: TeamKey) {
    dragDataRef.current = { playerId, fromTeam };
  }

  function handleDragOver(e: React.DragEvent, team: TeamKey) {
    e.preventDefault();
    if (dragDataRef.current && dragDataRef.current.fromTeam !== team) setDragOver(team);
  }

  function handleDragLeave() { setDragOver(null); }

  async function handleDrop(e: React.DragEvent, toTeam: TeamKey) {
    e.preventDefault();
    setDragOver(null);
    const data = dragDataRef.current;
    if (!data || data.fromTeam === toTeam) return;
    dragDataRef.current = null;
    try {
      await movePlayer(data.playerId, toTeam);
      refetch();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Move failed");
    }
  }

  function handleDragEnd() { dragDataRef.current = null; setDragOver(null); }

  function handleChipClick(player: DbPlayer, team: TeamKey) {
    setEditing({ player, team });
  }

  function handleSavePlayer() {
    setEditing(null);
    refetch();
  }

  if (loading) return <p className="text-navy/40 font-heading text-sm py-4 text-center">Loading rosters...</p>;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {teamOrder.map((teamKey) => {
          const players = grouped?.[teamKey] ?? [];
          const isOver = dragOver === teamKey;

          return (
            <div
              key={teamKey}
              onDragOver={(e) => handleDragOver(e, teamKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, teamKey)}
              className={`rounded-lg border-2 border-dashed p-3 min-h-[200px] transition-colors ${isOver ? "border-carolina bg-carolina/5" : "border-navy/10 bg-navy/[0.02]"}`}
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-navy/10">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-navy">{teamLabels[teamKey]}</h4>
                <span className="font-heading text-[10px] text-navy/40 uppercase tracking-wider">{players.length}</span>
              </div>
              <div className="flex flex-col gap-1">
                {players.map((player) => {
                  const colorClass = gradYearColors[player.grad_year] ?? "bg-navy/20 text-navy";
                  return (
                    <div
                      key={player.id}
                      draggable
                      onDragStart={() => handleDragStart(player.id, teamKey)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleChipClick(player, teamKey)}
                      title={`#${player.number} ${player.first_name} ${player.last_name}\n${player.positions.join(", ")}\nClass of ${player.grad_year}\nClick to edit`}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-heading font-semibold cursor-grab active:cursor-grabbing select-none transition-all hover:opacity-80 hover:ring-2 hover:ring-carolina/40 ${colorClass}`}
                    >
                      <span className="opacity-60 text-[10px] w-5 text-right shrink-0">#{player.number}</span>
                      <span className="truncate">{player.first_name} {player.last_name}</span>
                      {player.college_commitment && <span className="ml-auto text-[9px] opacity-50 shrink-0">🎓</span>}
                    </div>
                  );
                })}
              </div>
              {players.length === 0 && <p className="text-xs text-navy/30 font-heading text-center py-6">Drop players here</p>}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-navy/8">
        <p className="text-[10px] font-heading text-navy/30 uppercase tracking-wider">Drag to move &middot; Click to edit</p>
      </div>

      {editing && (
        <PlayerEditModal
          player={editing.player}
          team={editing.team}
          onSave={handleSavePlayer}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
