export const POSITION_OPTIONS = [
  "RHP", "LHP", "C", "1B", "2B", "3B", "SS",
  "LF", "CF", "RF", "OF", "IF", "DH", "UT",
] as const;

export type Position = (typeof POSITION_OPTIONS)[number];

export type BatsThrows = "R" | "L" | "S";

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  number: number | string;
  positions: Position[];
  gradYear: number;
  height?: string;
  weight?: number;
  bats?: BatsThrows;
  throws?: BatsThrows;
  collegeCommitment?: string;
  collegeCommitmentLogo?: string;
}

export interface TeamRoster {
  team: "varsity" | "jv" | "cteam";
  label: string;
  players: Player[];
}

// Helper to get display name
export function displayName(p: Player): string {
  return `${p.firstName} ${p.lastName}`;
}

// Helper to get positions as comma string
export function positionsDisplay(p: Player): string {
  return p.positions.join(", ");
}

export const varsityRoster: Player[] = [
  { id: "v-anderson", firstName: "Kyle", lastName: "Anderson", number: 5, positions: ["LHP"], gradYear: 2026, bats: "L", throws: "L" },
  { id: "v-bentley", firstName: "Cam", lastName: "Bentley", number: 12, positions: ["RHP", "1B", "OF"], gradYear: 2027, bats: "R", throws: "R" },
  { id: "v-bergford", firstName: "Max", lastName: "Bergford", number: 22, positions: ["LHP", "DH"], gradYear: 2028, bats: "L", throws: "L" },
  { id: "v-bockhorn", firstName: "Quentin", lastName: "Bockhorn", number: 20, positions: ["RHP"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-cheek", firstName: "Nate", lastName: "Cheek", number: 18, positions: ["RHP"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-collins", firstName: "Carter", lastName: "Collins", number: 19, positions: ["C"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-coray", firstName: "Jason", lastName: "Coray", number: 3, positions: ["2B", "3B"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "v-cuda", firstName: "Jake", lastName: "Cuda", number: 16, positions: ["RHP", "OF"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-harthorn", firstName: "Spencer", lastName: "Harthorn", number: 4, positions: ["RHP", "2B", "SS", "3B"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "v-knight", firstName: "Jaxson", lastName: "Knight", number: 15, positions: ["C"], gradYear: 2027, bats: "R", throws: "R" },
  { id: "v-hpayne", firstName: "Hunter", lastName: "Payne", number: 11, positions: ["SS", "3B", "2B"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-spayne", firstName: "Sawyer", lastName: "Payne", number: 1, positions: ["RHP", "IF", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "v-pedersen", firstName: "Logan", lastName: "Pedersen", number: 14, positions: ["RHP", "1B"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-price", firstName: "Jack", lastName: "Price", number: 10, positions: ["RHP", "OF"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-riley", firstName: "Greyson", lastName: "Riley", number: 13, positions: ["LHP", "OF"], gradYear: 2026, bats: "L", throws: "L" },
  { id: "v-sams", firstName: "Mason", lastName: "Sams", number: 7, positions: ["OF"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-sleeter", firstName: "Daniel", lastName: "Sleeter", number: 2, positions: ["RHP", "SS", "3B", "C"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "v-hasmith", firstName: "Hawken", lastName: "Smith", number: 14, positions: ["C", "1B", "IF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "v-husmith", firstName: "Hudson", lastName: "Smith", number: 8, positions: ["OF", "IF"], gradYear: 2026, bats: "R", throws: "R" },
  { id: "v-zsmith", firstName: "Zach", lastName: "Smith", number: 9, positions: ["RHP", "SS", "3B", "C"], gradYear: 2027, bats: "R", throws: "R" },
  { id: "v-wilson", firstName: "Parker", lastName: "Wilson", number: 17, positions: ["RHP", "1B"], gradYear: 2027, bats: "R", throws: "R" },
];

export const jvRoster: Player[] = [
  { id: "j-attebery", firstName: "Chase", lastName: "Attebery", number: 1, positions: ["IF", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-bass", firstName: "Oliver", lastName: "Bass", number: 3, positions: ["RHP", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-evans", firstName: "Henry", lastName: "Evans", number: 5, positions: ["IF", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-flowers", firstName: "Cam", lastName: "Flowers", number: 7, positions: ["RHP", "C"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-griswold", firstName: "Luke", lastName: "Griswold", number: 9, positions: ["OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-hildebrand", firstName: "Griffin", lastName: "Hildebrand", number: 11, positions: ["IF", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-justice", firstName: "Michael", lastName: "Justice", number: 13, positions: ["RHP", "1B"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-knapp", firstName: "Ethan", lastName: "Knapp", number: 15, positions: ["C", "IF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-newgard", firstName: "Jackson", lastName: "Newgard", number: 17, positions: ["IF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-rioux", firstName: "Finley", lastName: "Rioux", number: 19, positions: ["OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-shoquist", firstName: "Evan", lastName: "Shoquist", number: 21, positions: ["RHP", "IF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-turnley", firstName: "Ryder", lastName: "Turnley", number: 23, positions: ["OF", "IF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-vitcovich", firstName: "Jonah", lastName: "Vitcovich", number: 25, positions: ["C", "OF"], gradYear: 2028, bats: "R", throws: "R" },
  { id: "j-vorobets", firstName: "Danny", lastName: "Vorobets", number: 27, positions: ["RHP", "IF"], gradYear: 2028, bats: "R", throws: "R" },
];

export const cteamRoster: Player[] = [
  { id: "c-barclay", firstName: "Evan", lastName: "Barclay", number: 2, positions: ["IF", "OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-blankers", firstName: "Rowan", lastName: "Blankers", number: 4, positions: ["RHP", "IF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-brown", firstName: "Trevor", lastName: "Brown", number: 6, positions: ["C", "IF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-bush", firstName: "Alexander", lastName: "Bush", number: 8, positions: ["OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-cuda", firstName: "Sam", lastName: "Cuda", number: 10, positions: ["IF", "OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-janin", firstName: "Cooper", lastName: "Janin", number: 12, positions: ["RHP", "OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-krause", firstName: "Cole", lastName: "Krause", number: 14, positions: ["IF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-laplante", firstName: "Gabe", lastName: "LaPlante", number: 16, positions: ["C", "1B"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-michael", firstName: "Henry", lastName: "Michael", number: 18, positions: ["RHP", "IF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-occhiogrosso", firstName: "Luca", lastName: "Occhiogrosso", number: 20, positions: ["OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-olsen", firstName: "Hunter", lastName: "Olsen", number: 22, positions: ["IF", "OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-reed", firstName: "Landon", lastName: "Reed", number: 24, positions: ["RHP", "OF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-richards", firstName: "Lucas", lastName: "Richards", number: 26, positions: ["IF"], gradYear: 2029, bats: "R", throws: "R" },
  { id: "c-wellborn", firstName: "Lief", lastName: "Wellborn", number: 28, positions: ["C", "OF"], gradYear: 2029, bats: "R", throws: "R" },
];

export const rosters: TeamRoster[] = [
  { team: "varsity", label: "Varsity", players: varsityRoster },
  { team: "jv", label: "JV", players: jvRoster },
  { team: "cteam", label: "C Team", players: cteamRoster },
];
