"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useAllGames, useCalendarEvents, useAuth } from "@/lib/hooks";
import {
  updateCalendarEvent,
  updateGameDetails,
  updateGameScore,
  deleteCalendarEvent,
  createCalendarEvent,
  createGame,
  deleteGame,
  type DbCalendarEvent,
  type DbGame,
} from "@/lib/database";

type TeamFilter = "all" | "varsity" | "jv" | "cteam";
type TypeFilter = "all" | "game" | "practice" | "tryout";

// Color maps
const gameColors: Record<string, { bg: string; border: string; text: string }> = {
  varsity: { bg: "#1B2A4A", border: "#1B2A4A", text: "#FFFFFF" },
  jv: { bg: "#4B9CD3", border: "#3A87BF", text: "#FFFFFF" },
  cteam: { bg: "#A8D8F0", border: "#8ECAE6", text: "#1B2A4A" },
};
const practiceColors: Record<string, { bg: string; border: string; text: string }> = {
  varsity: { bg: "#E3F2FD", border: "#90CAF9", text: "#1565C0" },
  jv: { bg: "#E8F5E9", border: "#A5D6A7", text: "#2E7D32" },
  cteam: { bg: "#FFF3E0", border: "#FFCC80", text: "#E65100" },
  all: { bg: "#F3E5F5", border: "#7B1FA2", text: "#7B1FA2" },
};

interface EditingEvent {
  source: "game" | "calendar_event";
  game?: DbGame;
  calEvent?: DbCalendarEvent;
}

// ─── Event Edit Modal ────────────────────────────────────────
function EventEditModal({
  event,
  onSave,
  onDelete,
  onClose,
}: {
  event: EditingEvent;
  onSave: () => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const isGame = event.source === "game";
  const g = event.game;
  const ce = event.calEvent;

  const [title, setTitle] = useState(isGame ? `${g!.location === "home" ? "vs" : "@"} ${g!.opponent}` : ce!.title);
  const [date, setDate] = useState(() => {
    if (isGame) return g!.date;
    const d = new Date(ce!.start_time);
    return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}-${d.getDate().toString().padStart(2,"0")}`;
  });
  const [startTime, setStartTime] = useState(() => {
    if (isGame) return g!.time;
    const d = new Date(ce!.start_time);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  });
  const [endTime, setEndTime] = useState(() => {
    if (isGame || !ce!.end_time) return "";
    const d = new Date(ce!.end_time);
    return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
  });
  const [location, setLocation] = useState(isGame ? g!.venue : ce!.location ?? "");
  const [team, setTeam] = useState(isGame ? g!.team : ce!.team);
  const [type, setType] = useState(isGame ? "game" : ce!.type);
  const [notes, setNotes] = useState(!isGame ? ce!.notes ?? "" : "");
  const [scoreUs, setScoreUs] = useState(isGame ? g!.score_us ?? "" : "");
  const [scoreThem, setScoreThem] = useState(isGame ? g!.score_them ?? "" : "");
  const [highlights, setHighlights] = useState(isGame ? g!.highlights ?? "" : "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isGame && g) {
        await updateGameDetails(g.id, { date, time: startTime, venue: location });
        if (scoreUs !== "" && scoreThem !== "") {
          await updateGameScore(g.id, Number(scoreUs), Number(scoreThem), highlights || undefined);
        }
      } else if (ce) {
        await updateCalendarEvent(ce.id, {
          title,
          start_time: toTimestampTZ(date, startTime),
          end_time: endTime ? toTimestampTZ(date, endTime) : null,
          location: location || null,
          team: team as DbCalendarEvent["team"],
          type: type as DbCalendarEvent["type"],
          notes: notes || null,
        });
      }
      onSave();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const label = isGame ? `game vs ${g!.opponent}` : `event "${ce!.title}"`;
    if (!confirm(`Delete this ${label}?`)) return;
    try {
      if (isGame && g) {
        await deleteGame(g.id);
      } else if (ce) {
        await deleteCalendarEvent(ce.id);
      }
      onDelete?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-navy/10 font-heading text-sm text-navy focus:border-carolina focus:outline-none transition-colors bg-white";
  const labelClass = "block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
      <div className="relative bg-cream rounded-xl shadow-2xl border border-navy/10 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-navy px-6 py-4 rounded-t-xl flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl text-white tracking-wide">
              {isGame ? "EDIT GAME" : "EDIT EVENT"}
            </h3>
            <p className="text-xs font-heading text-white/50 uppercase tracking-wider">
              {isGame ? `${g!.team} — ${g!.opponent}` : ce!.team}
            </p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title (calendar events only) */}
          {!isGame && (
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
            </div>
          )}

          {/* Date + Times */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Start</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
            </div>
            {!isGame && (
              <div>
                <label className={labelClass}>End</label>
                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="e.g., Sehmel #1" />
          </div>

          {/* Team + Type (calendar events only) */}
          {!isGame && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Team</label>
                <select value={team} onChange={(e) => setTeam(e.target.value as typeof team)} className={inputClass}>
                  <option value="all">All Teams</option>
                  <option value="varsity">Varsity</option>
                  <option value="jv">JV</option>
                  <option value="cteam">C Team</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                  <option value="practice">Practice</option>
                  <option value="tryout">Tryout</option>
                  <option value="event">Event</option>
                </select>
              </div>
            </div>
          )}

          {/* Notes (calendar events only) */}
          {!isGame && (
            <div>
              <label className={labelClass}>Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={`${inputClass} resize-none`} placeholder="Optional notes..." />
            </div>
          )}

          {/* Game score + highlights */}
          {isGame && g && (
            <div className="bg-navy/5 rounded-lg p-4 space-y-3">
              <h4 className="font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40">Score</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Tides</label>
                  <input type="number" min="0" value={scoreUs} onChange={(e) => setScoreUs(e.target.value === "" ? "" : Number(e.target.value))} placeholder="—" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{g.opponent}</label>
                  <input type="number" min="0" value={scoreThem} onChange={(e) => setScoreThem(e.target.value === "" ? "" : Number(e.target.value))} placeholder="—" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Game Highlights</label>
                <textarea value={highlights} onChange={(e) => setHighlights(e.target.value)} rows={2} placeholder="Key plays, standout performances..." className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleDelete} className="px-3 py-2.5 rounded-lg border border-red-200 text-xs font-heading font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 transition-colors">
              Delete
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-navy/10 text-xs font-heading font-bold uppercase tracking-wider text-navy/50 hover:text-navy transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── New Event Modal ─────────────────────────────────────────
function NewEventModal({
  initialDate,
  onSave,
  onClose,
}: {
  initialDate: string;
  onSave: () => void;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<"game" | "other">("game");
  const [date, setDate] = useState(initialDate);
  const [startTime, setStartTime] = useState("16:00");
  const [endTime, setEndTime] = useState("18:30");
  const [location, setLocation] = useState("");
  const [team, setTeam] = useState<"varsity" | "jv" | "cteam">("varsity");
  const [saving, setSaving] = useState(false);

  // Game fields
  const [opponent, setOpponent] = useState("");
  const [homeAway, setHomeAway] = useState<"home" | "away" | "neutral">("home");
  const [venue, setVenue] = useState("Sehmel Homestead Park");

  // Other event fields
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState<"practice" | "tryout" | "event">("practice");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (category === "game") {
        await createGame({
          team,
          date,
          time: formatTimeFor12h(startTime),
          opponent,
          location: homeAway,
          venue,
        });
      } else {
        await createCalendarEvent({
          title,
          start_time: toTimestampTZ(date, startTime),
          end_time: endTime ? toTimestampTZ(date, endTime) : null,
          all_day: false,
          team: team as DbCalendarEvent["team"],
          type: eventType,
          location: location || null,
          notes: null,
        });
      }
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" />
      <div className="relative bg-cream rounded-xl shadow-2xl border border-navy/10 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-navy px-6 py-4 rounded-t-xl flex items-center justify-between">
          <h3 className="font-display text-xl text-white tracking-wide">
            {category === "game" ? "NEW GAME" : "NEW EVENT"}
          </h3>
          <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Game vs Other toggle */}
          <div className="flex gap-1 bg-navy/5 rounded-lg p-1">
            <button type="button" onClick={() => setCategory("game")}
              className={`flex-1 px-3 py-2 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${category === "game" ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy"}`}>
              Game
            </button>
            <button type="button" onClick={() => setCategory("other")}
              className={`flex-1 px-3 py-2 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${category === "other" ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy"}`}>
              Practice / Event
            </button>
          </div>

          {/* Team */}
          <div>
            <label className={labelClass}>Team</label>
            <select value={team} onChange={(e) => setTeam(e.target.value as typeof team)} className={inputClass}>
              <option value="varsity">Varsity</option>
              <option value="jv">JV</option>
              <option value="cteam">C Team</option>
            </select>
          </div>

          {category === "game" ? (
            <>
              {/* Game-specific fields */}
              <div>
                <label className={labelClass}>Opponent</label>
                <input type="text" value={opponent} onChange={(e) => setOpponent(e.target.value)} className={inputClass} required placeholder="e.g., Peninsula" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Game Time</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Home / Away</label>
                  <select value={homeAway} onChange={(e) => setHomeAway(e.target.value as typeof homeAway)} className={inputClass}>
                    <option value="home">Home</option>
                    <option value="away">Away</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Venue</label>
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className={inputClass} required placeholder="e.g., Sehmel Park" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Practice/Event fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required placeholder="e.g., V Practice" />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value as typeof eventType)} className={inputClass}>
                    <option value="practice">Practice</option>
                    <option value="tryout">Tryout</option>
                    <option value="event">Event</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className={labelClass}>Start</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>End</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} placeholder="e.g., Upper Turf" />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-navy/10 text-xs font-heading font-bold uppercase tracking-wider text-navy/50 hover:text-navy transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-carolina hover:bg-carolina-dark disabled:opacity-50 text-white text-xs font-heading font-bold uppercase tracking-wider transition-colors">
              {saving ? "Creating..." : category === "game" ? "Add Game" : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper: convert "16:00" → "4:00 PM"
function formatTimeFor12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

// ─── Main Calendar Page ──────────────────────────────────────
export default function CalendarPage() {
  const [teamFilter, setTeamFilter] = useState<TeamFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [editing, setEditing] = useState<EditingEvent | null>(null);
  const [newEventDate, setNewEventDate] = useState<string | null>(null);

  const { isAdmin } = useAuth();
  const { data: games, refetch: refetchGames } = useAllGames();
  const { data: calEvents, refetch: refetchCalEvents } = useCalendarEvents();

  // Build FullCalendar events from both sources
  const allEvents = [];

  // Games → calendar events
  for (const g of games ?? []) {
    if (teamFilter !== "all" && g.team !== teamFilter) continue;
    if (typeFilter !== "all" && typeFilter !== "game") continue;
    const colors = gameColors[g.team] ?? gameColors.varsity;
    const prefix = g.team === "varsity" ? "V" : g.team === "jv" ? "JV" : "C";
    allEvents.push({
      id: `game-${g.id}`,
      title: `${prefix} ${g.location === "home" ? "vs" : "@"} ${g.opponent}`,
      start: `${g.date}T${convertTimeTo24(g.time)}:00${getLocalTZOffset()}`,
      end: undefined,
      display: "block",
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: { source: "game", gameId: g.id, team: g.team, type: "game", location: g.venue },
    });
  }

  // Calendar events → FullCalendar events
  for (const ce of calEvents ?? []) {
    if (teamFilter !== "all" && ce.team !== teamFilter && ce.team !== "all") continue;
    if (typeFilter !== "all" && ce.type !== typeFilter) continue;
    const colorSet = ce.type === "tryout" ? practiceColors.all : (practiceColors[ce.team] ?? practiceColors.all);
    allEvents.push({
      id: `cal-${ce.id}`,
      title: ce.title,
      start: ce.start_time,
      end: ce.end_time ?? undefined,
      allDay: ce.all_day,
      backgroundColor: colorSet.bg,
      borderColor: colorSet.border,
      textColor: colorSet.text,
      extendedProps: { source: "calendar_event", calEventId: ce.id, team: ce.team, type: ce.type, location: ce.location },
    });
  }

  function handleEventClick(info: { event: { extendedProps: Record<string, string> } }) {
    if (!isAdmin) return;
    const props = info.event.extendedProps;
    if (props.source === "game") {
      const game = (games ?? []).find((g) => g.id === props.gameId);
      if (game) setEditing({ source: "game", game });
    } else {
      const calEvent = (calEvents ?? []).find((ce) => ce.id === props.calEventId);
      if (calEvent) setEditing({ source: "calendar_event", calEvent });
    }
  }

  async function handleEventDrop(info: { event: { id: string; startStr: string; extendedProps: Record<string, string> }; revert: () => void }) {
    if (!isAdmin) { info.revert(); return; }
    const props = info.event.extendedProps;
    const newDate = info.event.startStr.split("T")[0];
    const newTime = info.event.startStr.includes("T") ? info.event.startStr.split("T")[1].slice(0, 5) : undefined;

    try {
      if (props.source === "game") {
        await updateGameDetails(props.gameId, { date: newDate, ...(newTime ? { time: newTime } : {}) });
        refetchGames();
      } else {
        await updateCalendarEvent(props.calEventId, { start_time: info.event.startStr });
        refetchCalEvents();
      }
    } catch {
      info.revert();
    }
  }

  function handleDateClick(info: { dateStr: string }) {
    if (!isAdmin) return;
    setNewEventDate(info.dateStr);
  }

  function handleSave() {
    setEditing(null);
    refetchGames();
    refetchCalEvents();
  }

  function handleDelete() {
    setEditing(null);
    refetchCalEvents();
  }

  function handleNewEventSave() {
    setNewEventDate(null);
    refetchCalEvents();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-navy">MASTER CALENDAR</h1>
          <div className="stitch-line mt-2 max-w-[200px]" />
        </div>
        {isAdmin && (
          <span className="px-3 py-1 rounded-full bg-carolina/10 text-carolina-dark text-xs font-heading font-bold uppercase tracking-wider">
            Admin Mode — Click to edit, drag to move
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1.5">Team</label>
          <div className="flex gap-1 bg-navy/5 rounded-lg p-1">
            {([{ key: "all", label: "All Teams" }, { key: "varsity", label: "Varsity" }, { key: "jv", label: "JV" }, { key: "cteam", label: "C Team" }] as const).map((t) => (
              <button key={t.key} onClick={() => setTeamFilter(t.key)}
                className={`px-3 py-1.5 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${teamFilter === t.key ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-white/60"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-heading font-bold text-[10px] uppercase tracking-wider text-navy/40 mb-1.5">Event Type</label>
          <div className="flex gap-1 bg-navy/5 rounded-lg p-1">
            {([{ key: "all", label: "All" }, { key: "game", label: "Games" }, { key: "practice", label: "Practice" }] as const).map((t) => (
              <button key={t.key} onClick={() => setTypeFilter(t.key)}
                className={`px-3 py-1.5 rounded-md font-heading font-bold text-xs uppercase tracking-wider transition-all ${typeFilter === t.key ? "bg-navy text-white shadow-sm" : "text-navy/50 hover:text-navy hover:bg-white/60"}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs font-heading">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-navy" /> Varsity Game</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-carolina" /> JV Game</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-carolina-light" /> C Team Game</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#E3F2FD" }} /> V Practice</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#E8F5E9" }} /> JV Practice</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: "#FFF3E0" }} /> C Practice</span>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-navy/8 p-4 sm:p-6 calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate="2026-04-01"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,listMonth",
          }}
          events={allEvents}
          height="auto"
          editable={isAdmin}
          droppable={isAdmin}
          eventStartEditable={isAdmin}
          dateClick={isAdmin ? handleDateClick : undefined}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventTimeFormat={{ hour: "numeric", minute: "2-digit", meridiem: "short" }}
          eventDidMount={(info) => {
            const loc = info.event.extendedProps.location;
            const type = info.event.extendedProps.type;
            if (loc) info.el.title = `${info.event.title}\n${loc}`;
            if (isAdmin) info.el.style.cursor = "pointer";
            if (type === "game") info.el.classList.add("event-game");
          }}
        />
      </div>

      {/* Edit Modal */}
      {editing && (
        <EventEditModal event={editing} onSave={handleSave} onDelete={handleDelete} onClose={() => setEditing(null)} />
      )}

      {/* New Event Modal */}
      {newEventDate && (
        <NewEventModal initialDate={newEventDate} onSave={handleNewEventSave} onClose={() => setNewEventDate(null)} />
      )}
    </div>
  );
}

// Helper: convert "4:00 PM", "4:00PM", "4:00 pm", "16:00" → "16:00"
function convertTimeTo24(time: string): string {
  const trimmed = time.trim();
  // Already 24h format
  if (/^\d{1,2}:\d{2}$/.test(trimmed)) return trimmed.padStart(5, "0");
  // 12h format with AM/PM
  const match = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "16:00";
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

// Helper: get local timezone offset string like "-07:00"
function getLocalTZOffset(): string {
  const offset = new Date().getTimezoneOffset();
  const sign = offset <= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, "0");
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
}

// Helper: build a timestamptz string from date + time
function toTimestampTZ(date: string, time: string): string {
  return `${date}T${time}:00${getLocalTZOffset()}`;
}
