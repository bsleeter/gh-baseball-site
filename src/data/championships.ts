export type ChampionshipTier = "state" | "district" | "league";

export interface ChampionshipEntry {
  year: number;
  note?: string;
}

export interface StateFinish {
  year: number;
  place: 2 | 3;
  note?: string;
}

export const stateChampions: ChampionshipEntry[] = [
  { year: 1997 },
  { year: 2017 },
];

export const districtChampions: ChampionshipEntry[] = [
  { year: 1997 },
  { year: 2017 },
  { year: 2019 },
];

export const leagueChampions: ChampionshipEntry[] = [
  { year: 1997 },
  { year: 2006 },
  { year: 2010 },
  { year: 2016 },
  { year: 2017 },
  { year: 2018 },
  { year: 2019 },
  { year: 2021 },
  { year: 2025 },
];

export const stateTopThree: StateFinish[] = [
  { year: 2015, place: 3 },
  { year: 2019, place: 3 },
  { year: 2025, place: 3 },
];
