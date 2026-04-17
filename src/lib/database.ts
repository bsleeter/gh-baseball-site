import { supabase } from "./supabase";

// ─── Types matching DB schema ────────────────────────────────

export interface DbGame {
  id: string;
  team: "varsity" | "jv" | "cteam";
  date: string;
  time: string;
  opponent: string;
  location: "home" | "away" | "neutral";
  venue: string;
  type: string;
  score_us: number | null;
  score_them: number | null;
  result: "W" | "L" | "T" | null;
  notes: string | null;
  highlights: string | null;
}

export interface DbPlayer {
  id: string;
  team: "varsity" | "jv" | "cteam";
  first_name: string;
  last_name: string;
  number: number;
  positions: string[];
  grad_year: number;
  height: string | null;
  weight: number | null;
  bats: "R" | "L" | "S" | null;
  throws: "R" | "L" | null;
  college_commitment: string | null;
}

export interface DbAnnouncement {
  id: string;
  title: string;
  message: string;
  urgency: "info" | "warning" | "urgent";
  active: boolean;
  created_at: string;
}

export interface DbFundraising {
  id: number;
  goal: number;
  raised: number;
}

// ─── Read operations (public) ────────────────────────────────

export async function getGames(team?: string) {
  let query = supabase.from("games").select("*").order("date");
  if (team) query = query.eq("team", team);
  const { data, error } = await query;
  if (error) throw error;
  return data as DbGame[];
}

export async function getPlayers(team?: string) {
  let query = supabase.from("players").select("*").order("last_name");
  if (team) query = query.eq("team", team);
  const { data, error } = await query;
  if (error) throw error;
  return data as DbPlayer[];
}

export async function getAnnouncements(activeOnly = true) {
  let query = supabase.from("announcements").select("*").order("created_at", { ascending: false });
  if (activeOnly) query = query.eq("active", true);
  const { data, error } = await query;
  if (error) throw error;
  return data as DbAnnouncement[];
}

export async function getFundraising() {
  const { data, error } = await supabase.from("fundraising").select("*").single();
  if (error) throw error;
  return data as DbFundraising;
}

// ─── Write operations (require auth) ─────────────────────────

export async function createGame(game: {
  team: string;
  date: string;
  time: string;
  opponent: string;
  location: string;
  venue: string;
}) {
  const id = `${game.team[0]}${Date.now()}`;
  const { error } = await supabase
    .from("games")
    .insert({ id, ...game, type: "game" });
  if (error) throw error;
}

export async function deleteGame(gameId: string) {
  const { error } = await supabase.from("games").delete().eq("id", gameId);
  if (error) throw error;
}

export async function updateGameScore(
  gameId: string,
  scoreUs: number,
  scoreThem: number,
  highlights?: string
) {
  const result = scoreUs > scoreThem ? "W" : scoreUs < scoreThem ? "L" : "T";
  const { error } = await supabase
    .from("games")
    .update({ score_us: scoreUs, score_them: scoreThem, result, highlights: highlights || null })
    .eq("id", gameId);
  if (error) throw error;
}

export async function createAnnouncement(
  title: string,
  message: string,
  urgency: "info" | "warning" | "urgent"
) {
  const { error } = await supabase
    .from("announcements")
    .insert({ title, message, urgency, active: true });
  if (error) throw error;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

export async function updatePlayer(player: DbPlayer) {
  const { error } = await supabase
    .from("players")
    .update({
      first_name: player.first_name,
      last_name: player.last_name,
      number: player.number,
      positions: player.positions,
      grad_year: player.grad_year,
      height: player.height,
      weight: player.weight,
      bats: player.bats,
      throws: player.throws,
      college_commitment: player.college_commitment,
    })
    .eq("id", player.id);
  if (error) throw error;
}

export async function movePlayer(playerId: string, toTeam: string) {
  const { error } = await supabase
    .from("players")
    .update({ team: toTeam })
    .eq("id", playerId);
  if (error) throw error;
}

// ─── Calendar Events ─────────────────────────────────────────

export interface DbCalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  all_day: boolean;
  team: "varsity" | "jv" | "cteam" | "all";
  type: "practice" | "tryout" | "event";
  location: string | null;
  notes: string | null;
}

export async function getCalendarEvents() {
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("start_time");
  if (error) throw error;
  return data as DbCalendarEvent[];
}

export async function updateCalendarEvent(id: string, updates: Partial<DbCalendarEvent>) {
  const { error } = await supabase
    .from("calendar_events")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCalendarEvent(id: string) {
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) throw error;
}

export async function createCalendarEvent(event: Omit<DbCalendarEvent, "id">) {
  const { error } = await supabase.from("calendar_events").insert(event);
  if (error) throw error;
}

export async function updateGameDetails(
  gameId: string,
  updates: { date?: string; time?: string; venue?: string; opponent?: string }
) {
  const { error } = await supabase
    .from("games")
    .update(updates)
    .eq("id", gameId);
  if (error) throw error;
}

// ─── Photos ─────────────────────────────────────────────────

export interface DbPhoto {
  id: string;
  filename: string;
  caption: string | null;
  category: "game" | "practice" | "team" | "dinner" | "other";
  team: "varsity" | "jv" | "cteam" | "all" | null;
  date: string | null;
  storage_path: string;
  created_at: string;
}

export async function getPhotos(category?: string) {
  let query = supabase.from("photos").select("*").order("created_at", { ascending: false });
  if (category && category !== "all") query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as DbPhoto[];
}

export function getPhotoUrl(storagePath: string): string {
  const { data } = supabase.storage.from("photos").getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadPhoto(file: File, metadata: {
  caption?: string;
  category: DbPhoto["category"];
  team?: DbPhoto["team"];
  date?: string;
}) {
  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;

  const { error: dbError } = await supabase.from("photos").insert({
    filename: file.name,
    caption: metadata.caption || null,
    category: metadata.category,
    team: metadata.team || null,
    date: metadata.date || null,
    storage_path: path,
  });
  if (dbError) throw dbError;
}

export async function deletePhoto(id: string, storagePath: string) {
  await supabase.storage.from("photos").remove([storagePath]);
  const { error } = await supabase.from("photos").delete().eq("id", id);
  if (error) throw error;
}

// ─── Auth ────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
