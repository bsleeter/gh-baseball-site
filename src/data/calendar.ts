export interface CalendarEvent {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  team: "varsity" | "jv" | "cteam" | "all";
  type: "game" | "practice" | "tryout" | "event";
  location: string;
  color: string;
  textColor: string;
  borderColor: string;
}

// Colors per team
const teamColors = {
  varsity: { bg: "#1B2A4A", border: "#1B2A4A", text: "#FFFFFF" },
  jv: { bg: "#4B9CD3", border: "#3A87BF", text: "#FFFFFF" },
  cteam: { bg: "#6BB3E0", border: "#4B9CD3", text: "#1B2A4A" },
};

const practiceColors = {
  varsity: { bg: "#E3F2FD", border: "#90CAF9", text: "#1565C0" },
  jv: { bg: "#E8F5E9", border: "#A5D6A7", text: "#2E7D32" },
  cteam: { bg: "#FFF3E0", border: "#FFCC80", text: "#E65100" },
};

const tryoutColor = { bg: "#F3E5F5", border: "#7B1FA2", text: "#7B1FA2" };

// Varsity events
const varsityEvents: CalendarEvent[] = [
  // Tryouts (shared)
  { title: "Tryouts", start: "2026-03-02T17:00:00", end: "2026-03-02T21:00:00", team: "all", type: "tryout", location: "Upper Turf", color: tryoutColor.bg, textColor: tryoutColor.text, borderColor: tryoutColor.border },
  { title: "Tryouts", start: "2026-03-03T14:30:00", end: "2026-03-03T17:00:00", team: "all", type: "tryout", location: "Sehmel #1", color: tryoutColor.bg, textColor: tryoutColor.text, borderColor: tryoutColor.border },
  { title: "Tryouts", start: "2026-03-04T17:00:00", end: "2026-03-04T21:00:00", team: "all", type: "tryout", location: "Upper Turf", color: tryoutColor.bg, textColor: tryoutColor.text, borderColor: tryoutColor.border },
  // Varsity practices
  { title: "V Practice", start: "2026-03-05T14:30:00", end: "2026-03-05T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-06T17:00:00", end: "2026-03-06T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-09T14:30:00", end: "2026-03-09T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-10T18:30:00", end: "2026-03-10T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-12T14:30:00", end: "2026-03-12T17:00:00", team: "varsity", type: "practice", location: "Sehmel #2", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-13T14:30:00", end: "2026-03-13T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-19T14:30:00", end: "2026-03-19T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-23T14:30:00", end: "2026-03-23T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-26T18:30:00", end: "2026-03-26T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-27T14:30:00", end: "2026-03-27T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-03-30T19:00:00", end: "2026-03-30T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-02T14:30:00", end: "2026-04-02T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-03T18:30:00", end: "2026-04-03T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-08T14:30:00", end: "2026-04-08T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-09T14:30:00", end: "2026-04-09T18:30:00", team: "varsity", type: "practice", location: "GHHS", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-10T14:30:00", end: "2026-04-10T18:30:00", team: "varsity", type: "practice", location: "GHHS", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-15T18:30:00", end: "2026-04-15T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-16T14:30:00", end: "2026-04-16T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-17T18:30:00", end: "2026-04-17T21:00:00", team: "varsity", type: "practice", location: "Upper Turf", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  { title: "V Practice", start: "2026-04-20T14:30:00", end: "2026-04-20T17:00:00", team: "varsity", type: "practice", location: "Sehmel #1", color: practiceColors.varsity.bg, textColor: practiceColors.varsity.text, borderColor: practiceColors.varsity.border },
  // Varsity games
  { title: "V @ Rogers", start: "2026-03-16T19:00:00", end: "2026-03-16T21:30:00", team: "varsity", type: "game", location: "Rogers HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs North Thurston", start: "2026-03-19T16:00:00", end: "2026-03-19T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Lakes", start: "2026-03-20T16:00:00", end: "2026-03-20T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Kelso", start: "2026-03-21T12:00:00", end: "2026-03-21T14:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ River Ridge", start: "2026-03-23T12:00:00", end: "2026-03-23T14:30:00", team: "varsity", type: "game", location: "River Ridge HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Bellarmine", start: "2026-03-25T16:00:00", end: "2026-03-25T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Bellarmine", start: "2026-03-27T16:00:00", end: "2026-03-27T18:30:00", team: "varsity", type: "game", location: "Bellarmine HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs West Seattle", start: "2026-03-28T11:00:00", end: "2026-03-28T13:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Silas", start: "2026-03-31T16:00:00", end: "2026-03-31T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Silas", start: "2026-04-01T16:30:00", end: "2026-04-01T19:00:00", team: "varsity", type: "game", location: "Silas HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Lincoln", start: "2026-04-06T16:30:00", end: "2026-04-06T19:00:00", team: "varsity", type: "game", location: "Lincoln HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Lincoln", start: "2026-04-07T16:00:00", end: "2026-04-07T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Curtis", start: "2026-04-11T15:00:00", end: "2026-04-11T17:30:00", team: "varsity", type: "game", location: "Cheney Stadium", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Mt Tahoma", start: "2026-04-13T16:30:00", end: "2026-04-13T19:00:00", team: "varsity", type: "game", location: "Mt Tahoma HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Mt Tahoma", start: "2026-04-14T16:00:00", end: "2026-04-14T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Central Kitsap", start: "2026-04-21T16:00:00", end: "2026-04-21T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Central Kitsap", start: "2026-04-22T16:00:00", end: "2026-04-22T18:30:00", team: "varsity", type: "game", location: "Central Kitsap HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Peninsula", start: "2026-04-28T16:00:00", end: "2026-04-28T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V vs Capital", start: "2026-04-29T16:00:00", end: "2026-04-29T18:30:00", team: "varsity", type: "game", location: "Sehmel #1", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
  { title: "V @ Timberline", start: "2026-05-04T16:30:00", end: "2026-05-04T19:00:00", team: "varsity", type: "game", location: "Timberline HS", color: teamColors.varsity.bg, textColor: teamColors.varsity.text, borderColor: teamColors.varsity.border },
];

// JV events (games + select practices)
const jvEvents: CalendarEvent[] = [
  { title: "JV Practice", start: "2026-03-05T17:00:00", end: "2026-03-05T21:00:00", team: "jv", type: "practice", location: "Upper Turf", color: practiceColors.jv.bg, textColor: practiceColors.jv.text, borderColor: practiceColors.jv.border },
  { title: "JV Practice", start: "2026-03-06T14:30:00", end: "2026-03-06T18:30:00", team: "jv", type: "practice", location: "GHHS", color: practiceColors.jv.bg, textColor: practiceColors.jv.text, borderColor: practiceColors.jv.border },
  { title: "JV Practice", start: "2026-03-09T19:00:00", end: "2026-03-09T21:00:00", team: "jv", type: "practice", location: "Upper Turf", color: practiceColors.jv.bg, textColor: practiceColors.jv.text, borderColor: practiceColors.jv.border },
  { title: "JV Practice", start: "2026-03-10T14:30:00", end: "2026-03-10T17:00:00", team: "jv", type: "practice", location: "Sehmel #2", color: practiceColors.jv.bg, textColor: practiceColors.jv.text, borderColor: practiceColors.jv.border },
  { title: "JV @ Rogers", start: "2026-03-16T15:30:00", end: "2026-03-16T18:00:00", team: "jv", type: "game", location: "PRC", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ North Thurston", start: "2026-03-18T16:00:00", end: "2026-03-18T18:30:00", team: "jv", type: "game", location: "North Thurston HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Bellarmine", start: "2026-03-23T16:00:00", end: "2026-03-23T18:30:00", team: "jv", type: "game", location: "Bellarmine HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Bellarmine", start: "2026-03-25T16:00:00", end: "2026-03-25T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Silas", start: "2026-03-31T16:00:00", end: "2026-03-31T18:30:00", team: "jv", type: "game", location: "Silas HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Silas", start: "2026-04-01T16:00:00", end: "2026-04-01T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Lincoln", start: "2026-04-06T16:00:00", end: "2026-04-06T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Lincoln", start: "2026-04-07T16:30:00", end: "2026-04-07T19:00:00", team: "jv", type: "game", location: "Lincoln HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Tahoma", start: "2026-04-10T16:00:00", end: "2026-04-10T18:30:00", team: "jv", type: "game", location: "Summit Park", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Mt Tahoma", start: "2026-04-13T16:00:00", end: "2026-04-13T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs PHS", start: "2026-04-15T16:00:00", end: "2026-04-15T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ PHS", start: "2026-04-17T16:00:00", end: "2026-04-17T18:30:00", team: "jv", type: "game", location: "Peninsula HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Central Kitsap", start: "2026-04-21T16:00:00", end: "2026-04-21T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Central Kitsap", start: "2026-04-22T18:00:00", end: "2026-04-22T20:30:00", team: "jv", type: "game", location: "Central Kitsap HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs West Seattle", start: "2026-04-25T11:00:00", end: "2026-04-25T13:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Peninsula", start: "2026-04-28T16:00:00", end: "2026-04-28T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV vs Capital", start: "2026-04-29T16:00:00", end: "2026-04-29T18:30:00", team: "jv", type: "game", location: "GHHS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Timberline", start: "2026-05-04T16:30:00", end: "2026-05-04T19:00:00", team: "jv", type: "game", location: "Timberline HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
  { title: "JV @ Curtis", start: "2026-05-08T16:00:00", end: "2026-05-08T18:30:00", team: "jv", type: "game", location: "Curtis HS", color: teamColors.jv.bg, textColor: teamColors.jv.text, borderColor: teamColors.jv.border },
];

// C Team events (games + select practices)
const cteamEvents: CalendarEvent[] = [
  { title: "C Practice", start: "2026-03-05T17:00:00", end: "2026-03-05T21:00:00", team: "cteam", type: "practice", location: "Upper Turf", color: practiceColors.cteam.bg, textColor: practiceColors.cteam.text, borderColor: practiceColors.cteam.border },
  { title: "C Practice", start: "2026-03-06T14:30:00", end: "2026-03-06T18:30:00", team: "cteam", type: "practice", location: "GHHS", color: practiceColors.cteam.bg, textColor: practiceColors.cteam.text, borderColor: practiceColors.cteam.border },
  { title: "C vs PHS", start: "2026-03-19T16:00:00", end: "2026-03-19T18:30:00", team: "cteam", type: "game", location: "GHHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C vs S. Kitsap (G1)", start: "2026-03-21T11:00:00", end: "2026-03-21T13:00:00", team: "cteam", type: "game", location: "GHHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C vs S. Kitsap (G2)", start: "2026-03-21T14:00:00", end: "2026-03-21T16:00:00", team: "cteam", type: "game", location: "GHHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Puyallup", start: "2026-03-24T15:30:00", end: "2026-03-24T18:00:00", team: "cteam", type: "game", location: "PRC", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C vs Steilacoom (DH)", start: "2026-03-28", allDay: true, team: "cteam", type: "game", location: "GHHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C vs PHS", start: "2026-03-31T16:00:00", end: "2026-03-31T18:30:00", team: "cteam", type: "game", location: "GHHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ N. Kitsap (G1)", start: "2026-04-04T11:00:00", end: "2026-04-04T13:00:00", team: "cteam", type: "game", location: "North Kitsap HS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ N. Kitsap (G2)", start: "2026-04-04T13:00:00", end: "2026-04-04T15:00:00", team: "cteam", type: "game", location: "North Kitsap HS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ PHS", start: "2026-04-09T16:00:00", end: "2026-04-09T18:30:00", team: "cteam", type: "game", location: "PHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Puyallup", start: "2026-04-10T15:30:00", end: "2026-04-10T18:00:00", team: "cteam", type: "game", location: "PRC", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Puyallup", start: "2026-04-15T15:30:00", end: "2026-04-15T18:00:00", team: "cteam", type: "game", location: "PRC", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Bellarmine (DH)", start: "2026-04-18T11:00:00", end: "2026-04-18T16:00:00", team: "cteam", type: "game", location: "Bellarmine HS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C vs West Seattle", start: "2026-04-25T14:00:00", end: "2026-04-25T16:30:00", team: "cteam", type: "game", location: "Sehmel", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ PHS", start: "2026-04-27T16:00:00", end: "2026-04-27T18:30:00", team: "cteam", type: "game", location: "PHS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Bellarmine (DH)", start: "2026-05-02T11:00:00", end: "2026-05-02T16:00:00", team: "cteam", type: "game", location: "Bellarmine HS", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
  { title: "C @ Puyallup", start: "2026-05-08T15:30:00", end: "2026-05-08T18:00:00", team: "cteam", type: "game", location: "PRC", color: teamColors.cteam.bg, textColor: teamColors.cteam.text, borderColor: teamColors.cteam.border },
];

export const allCalendarEvents: CalendarEvent[] = [
  ...varsityEvents,
  ...jvEvents,
  ...cteamEvents,
];
