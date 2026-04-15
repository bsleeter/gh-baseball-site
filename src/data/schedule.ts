export type GameType = "game" | "practice" | "event" | "tryout";
export type GameLocation = "home" | "away" | "neutral";

export interface Game {
  id: string;
  date: string; // ISO date
  time: string;
  opponent: string;
  location: GameLocation;
  venue: string;
  type: GameType;
  scoreUs?: number;
  scoreThem?: number;
  result?: "W" | "L" | "T";
  notes?: string;
  highlights?: string;
}

export interface TeamSchedule {
  team: "varsity" | "jv" | "cteam";
  label: string;
  games: Game[];
}

export const varsitySchedule: Game[] = [
  { id: "v1", date: "2026-03-16", time: "4:00 PM", opponent: "Rogers", location: "away", venue: "Rogers HS", type: "game", scoreUs: 2, scoreThem: 5, result: "L" },
  { id: "v2", date: "2026-03-19", time: "4:00 PM", opponent: "North Thurston", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 15, scoreThem: 1, result: "W", highlights: "Cuda dominant on the mound. Payne 3-for-4 with 2 RBI." },
  { id: "v3", date: "2026-03-20", time: "4:00 PM", opponent: "Lakes", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 1, scoreThem: 3, result: "L" },
  { id: "v4", date: "2026-03-21", time: "12:00 PM", opponent: "Kelso", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 0, scoreThem: 1, result: "L" },
  { id: "v5", date: "2026-03-23", time: "12:00 PM", opponent: "River Ridge", location: "away", venue: "River Ridge HS", type: "game", scoreUs: 16, scoreThem: 3, result: "W" },
  { id: "v6", date: "2026-03-25", time: "4:00 PM", opponent: "Bellarmine Prep", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 8, scoreThem: 0, result: "W", highlights: "Bockhorn complete game shutout, 9 K's. Sleeter 2-run double in the 3rd." },
  { id: "v7", date: "2026-03-27", time: "4:00 PM", opponent: "Bellarmine Prep", location: "away", venue: "Bellarmine Prep", type: "game", scoreUs: 3, scoreThem: 1, result: "W" },
  { id: "v8", date: "2026-03-28", time: "1:00 PM", opponent: "West Seattle", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 5, scoreThem: 7, result: "L" },
  { id: "v9", date: "2026-03-31", time: "4:00 PM", opponent: "Silas", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 5, scoreThem: 0, result: "W" },
  { id: "v10", date: "2026-04-01", time: "4:00 PM", opponent: "Silas", location: "away", venue: "Silas HS", type: "game", scoreUs: 3, scoreThem: 9, result: "L" },
  { id: "v11", date: "2026-04-06", time: "12:00 PM", opponent: "Lincoln", location: "away", venue: "Lincoln HS", type: "game", scoreUs: 16, scoreThem: 0, result: "W" },
  { id: "v12", date: "2026-04-07", time: "4:00 PM", opponent: "Lincoln", location: "home", venue: "Sehmel Homestead Park", type: "game", scoreUs: 14, scoreThem: 0, result: "W" },
  { id: "v13", date: "2026-04-11", time: "1:00 PM", opponent: "Curtis", location: "neutral", venue: "Cheney Stadium", type: "game", scoreUs: 3, scoreThem: 5, result: "L" },
  { id: "v14", date: "2026-04-13", time: "4:00 PM", opponent: "Mount Tahoma", location: "away", venue: "Mount Tahoma HS", type: "game", scoreUs: 27, scoreThem: 1, result: "W", highlights: "Season-high 27 runs. Every starter reached base. Riley 4-for-5 with a grand slam." },
  { id: "v15", date: "2026-04-15", time: "4:00 PM", opponent: "Mount Tahoma", location: "home", venue: "Sehmel Homestead Park", type: "game" },
  { id: "v16", date: "2026-04-21", time: "4:00 PM", opponent: "Central Kitsap", location: "home", venue: "Sehmel Homestead Park", type: "game" },
  { id: "v17", date: "2026-04-22", time: "4:00 PM", opponent: "Central Kitsap", location: "away", venue: "Central Kitsap HS", type: "game" },
  { id: "v18", date: "2026-04-28", time: "4:00 PM", opponent: "Peninsula", location: "home", venue: "Sehmel Homestead Park", type: "game" },
  { id: "v19", date: "2026-04-29", time: "4:00 PM", opponent: "Capital", location: "home", venue: "Sehmel Homestead Park", type: "game" },
  { id: "v20", date: "2026-05-04", time: "4:00 PM", opponent: "Timberline", location: "away", venue: "Timberline HS", type: "game" },
];

export const jvSchedule: Game[] = [
  { id: "j1", date: "2026-03-16", time: "3:30 PM", opponent: "Rogers", location: "away", venue: "PRC", type: "game", scoreUs: 3, scoreThem: 2, result: "W" },
  { id: "j2", date: "2026-03-19", time: "4:00 PM", opponent: "North Thurston", location: "away", venue: "North Thurston HS", type: "game", scoreUs: 11, scoreThem: 0, result: "W" },
  { id: "j3", date: "2026-03-23", time: "4:00 PM", opponent: "Bellarmine Prep", location: "away", venue: "Bellarmine HS", type: "game", scoreUs: 6, scoreThem: 0, result: "W" },
  { id: "j4", date: "2026-03-25", time: "4:00 PM", opponent: "Bellarmine Prep", location: "home", venue: "GHHS", type: "game", scoreUs: 11, scoreThem: 1, result: "W" },
  { id: "j5", date: "2026-03-31", time: "4:00 PM", opponent: "Silas", location: "away", venue: "Silas HS", type: "game", scoreUs: 14, scoreThem: 3, result: "W" },
  { id: "j6", date: "2026-04-01", time: "4:00 PM", opponent: "Silas", location: "home", venue: "GHHS", type: "game", scoreUs: 6, scoreThem: 5, result: "W" },
  { id: "j7", date: "2026-04-06", time: "4:00 PM", opponent: "Lincoln", location: "home", venue: "GHHS", type: "game", scoreUs: 20, scoreThem: 2, result: "W" },
  { id: "j8", date: "2026-04-07", time: "4:00 PM", opponent: "Lincoln", location: "away", venue: "Lincoln HS", type: "game", scoreUs: 20, scoreThem: 0, result: "W" },
  { id: "j9", date: "2026-04-10", time: "4:00 PM", opponent: "Tahoma", location: "away", venue: "Summit Park", type: "game", scoreUs: 6, scoreThem: 5, result: "W" },
  { id: "j10", date: "2026-04-13", time: "4:00 PM", opponent: "Mount Tahoma", location: "home", venue: "GHHS", type: "game", scoreUs: 10, scoreThem: 0, result: "W" },
  { id: "j11", date: "2026-04-15", time: "4:00 PM", opponent: "Peninsula (PHS)", location: "home", venue: "GHHS", type: "game" },
  { id: "j12", date: "2026-04-17", time: "4:00 PM", opponent: "Peninsula (PHS)", location: "away", venue: "Peninsula HS", type: "game" },
  { id: "j13", date: "2026-04-21", time: "4:00 PM", opponent: "Central Kitsap", location: "home", venue: "GHHS", type: "game" },
  { id: "j14", date: "2026-04-22", time: "4:00 PM", opponent: "Central Kitsap", location: "away", venue: "Central Kitsap HS", type: "game" },
  { id: "j15", date: "2026-04-25", time: "11:00 AM", opponent: "West Seattle", location: "home", venue: "GHHS", type: "game" },
  { id: "j16", date: "2026-04-28", time: "4:00 PM", opponent: "Peninsula", location: "home", venue: "GHHS", type: "game" },
  { id: "j17", date: "2026-04-29", time: "4:00 PM", opponent: "Capital", location: "home", venue: "GHHS", type: "game" },
  { id: "j18", date: "2026-05-04", time: "4:00 PM", opponent: "Timberline", location: "away", venue: "Timberline HS", type: "game" },
  { id: "j19", date: "2026-05-08", time: "4:00 PM", opponent: "Curtis", location: "away", venue: "Curtis HS", type: "game" },
];

export const cteamSchedule: Game[] = [
  { id: "c1", date: "2026-03-21", time: "11:00 AM", opponent: "South Kitsap (G1)", location: "home", venue: "GHHS", type: "game", scoreUs: 1, scoreThem: 10, result: "L", notes: "DH Game 1" },
  { id: "c2", date: "2026-03-21", time: "2:00 PM", opponent: "South Kitsap (G2)", location: "home", venue: "GHHS", type: "game", scoreUs: 17, scoreThem: 15, result: "W", notes: "DH Game 2" },
  { id: "c3", date: "2026-03-24", time: "3:30 PM", opponent: "Puyallup", location: "away", venue: "PRC", type: "game", scoreUs: 3, scoreThem: 4, result: "L" },
  { id: "c4", date: "2026-03-28", time: "12:00 PM", opponent: "Steilacoom (G1)", location: "home", venue: "GHHS", type: "game", scoreUs: 5, scoreThem: 9, result: "L", notes: "DH Game 1" },
  { id: "c5", date: "2026-03-28", time: "2:00 PM", opponent: "Steilacoom (G2)", location: "home", venue: "GHHS", type: "game", scoreUs: 22, scoreThem: 18, result: "W", notes: "DH Game 2" },
  { id: "c6", date: "2026-03-30", time: "4:00 PM", opponent: "Peninsula (PHS)", location: "home", venue: "GHHS", type: "game", scoreUs: 14, scoreThem: 15, result: "L" },
  { id: "c7", date: "2026-04-04", time: "11:00 AM", opponent: "North Kitsap (G1)", location: "away", venue: "North Kitsap HS", type: "game", scoreUs: 15, scoreThem: 6, result: "W", notes: "DH Game 1" },
  { id: "c8", date: "2026-04-04", time: "1:00 PM", opponent: "North Kitsap (G2)", location: "away", venue: "North Kitsap HS", type: "game", scoreUs: 5, scoreThem: 9, result: "L", notes: "DH Game 2" },
  { id: "c9", date: "2026-04-09", time: "4:00 PM", opponent: "Peninsula (PHS)", location: "away", venue: "PHS", type: "game", scoreUs: 11, scoreThem: 1, result: "W" },
  { id: "c10", date: "2026-04-10", time: "3:30 PM", opponent: "Puyallup", location: "away", venue: "PRC", type: "game" },
  { id: "c11", date: "2026-04-15", time: "3:30 PM", opponent: "Puyallup", location: "away", venue: "PRC", type: "game" },
  { id: "c12", date: "2026-04-18", time: "11:00 AM", opponent: "Bellarmine Prep (DH)", location: "away", venue: "Bellarmine HS", type: "game" },
  { id: "c13", date: "2026-04-25", time: "2:00 PM", opponent: "West Seattle", location: "home", venue: "Sehmel Park", type: "game" },
  { id: "c14", date: "2026-04-27", time: "4:00 PM", opponent: "Peninsula (PHS)", location: "away", venue: "PHS", type: "game" },
  { id: "c15", date: "2026-05-02", time: "11:00 AM", opponent: "Bellarmine Prep (DH)", location: "away", venue: "Bellarmine HS", type: "game" },
  { id: "c16", date: "2026-05-08", time: "3:30 PM", opponent: "Puyallup", location: "away", venue: "PRC", type: "game" },
];

export const schedules: TeamSchedule[] = [
  { team: "varsity", label: "Varsity", games: varsitySchedule },
  { team: "jv", label: "JV", games: jvSchedule },
  { team: "cteam", label: "C Team", games: cteamSchedule },
];

export function getTeamRecord(games: Game[]): { wins: number; losses: number; ties: number } {
  return games.reduce(
    (acc, g) => {
      if (g.result === "W") acc.wins++;
      else if (g.result === "L") acc.losses++;
      else if (g.result === "T") acc.ties++;
      return acc;
    },
    { wins: 0, losses: 0, ties: 0 }
  );
}

export function getUpcomingGames(games: Game[], count = 3): Game[] {
  const today = new Date().toISOString().split("T")[0];
  return games.filter((g) => g.date >= today && !g.result).slice(0, count);
}
