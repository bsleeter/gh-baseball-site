export const LEGACY_ERA = "1990–Present Hall of Fame";

export interface RecordHolder {
  player: string;
  year?: number | string;
  context?: string;
}

export interface LegacyRecord {
  stat: string;
  value: string;
  holders: RecordHolder[];
  qualifier?: string;
}

export const legacySingleSeasonBatting: LegacyRecord[] = [
  {
    stat: "Highest Average",
    value: ".538",
    holders: [{ player: "Spencer Manjarrez", context: "35 H / 65 AB" }],
  },
  {
    stat: "Best On-Base %",
    value: ".677",
    holders: [{ player: "Spencer Manjarrez" }],
  },
  { stat: "Most Hits", value: "47", holders: [{ player: "Tim Friedman" }] },
  {
    stat: "Most Singles",
    value: "30",
    holders: [{ player: "Jayce Corley", year: 2025 }],
  },
  { stat: "Most Doubles", value: "13", holders: [{ player: "Tim Friedman" }] },
  { stat: "Most Triples", value: "7", holders: [{ player: "Jordan Haworth" }] },
  {
    stat: "Most Home Runs",
    value: "7",
    holders: [
      { player: "Tim Friedman" },
      { player: "David Bigelow" },
      { player: "Spencer Manjarrez" },
    ],
  },
  { stat: "Most Total Bases", value: "83", holders: [{ player: "Tim Friedman" }] },
  { stat: "Most RBIs", value: "41", holders: [{ player: "Tim Friedman" }] },
  { stat: "Most Runs Scored", value: "45", holders: [{ player: "Tim Friedman" }] },
  { stat: "Most At Bats", value: "114", holders: [{ player: "RJ Green" }] },
  { stat: "Most Walks", value: "32", holders: [{ player: "Aaron Araujo" }] },
  {
    stat: "Most HBP",
    value: "14",
    holders: [
      { player: "Cage Hardy" },
      { player: "Cooper McCutcheon", year: 2024 },
    ],
  },
  { stat: "Most Stolen Bases", value: "26", holders: [{ player: "Spencer Manjarrez" }] },
  {
    stat: "Longest Hit Streak",
    value: "20",
    holders: [{ player: "Tim Friedman", context: "games" }],
  },
  {
    stat: "Lowest K Rate",
    value: "0%",
    holders: [{ player: "Tyler Rice", context: "0 K / 72 AB" }],
  },
];

export const legacySingleSeasonPitching: LegacyRecord[] = [
  { stat: "Most Wins", value: "10", holders: [{ player: "Matt Gardner" }] },
  { stat: "Most Saves", value: "5", holders: [{ player: "Anthony Gilich" }] },
  { stat: "Most Innings Pitched", value: "78", holders: [{ player: "Owen Wild" }] },
  { stat: "Most Strikeouts", value: "112", holders: [{ player: "Owen Wild" }] },
  {
    stat: "Lowest ERA",
    value: "0.42",
    holders: [
      { player: "Quentin Bockhorn", year: 2025, context: "7-0 · 50.0 IP" },
    ],
    qualifier: "Min. 5 decisions",
  },
];

export const legacyCareerPitching: LegacyRecord[] = [
  { stat: "Most Wins", value: "23", holders: [{ player: "Matt Gardner" }] },
];

export const legacyCareerBatting: LegacyRecord[] = [];

export const legacyTeamSingleSeason: LegacyRecord[] = [
  {
    stat: "Most Wins",
    value: "25",
    holders: [{ player: "2025 Tides", year: 2025 }],
  },
  {
    stat: "Most Team Hits",
    value: "280",
    holders: [{ player: "1997 Tides", year: 1997 }],
  },
  {
    stat: "Most Team Stolen Bases",
    value: "78",
    holders: [{ player: "1997 Tides", year: 1997 }],
  },
  {
    stat: "Most Team Home Runs",
    value: "20",
    holders: [{ player: "2010 Tides", year: 2010 }],
  },
];
