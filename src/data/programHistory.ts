/**
 * Typed accessor over scripts/build_master_data.py output.
 *
 * Source data: src/data/programHistory.json (regenerate via:
 *   python3 scripts/build_master_data.py
 * from the repo root).
 *
 * Use the helpers in this file (not the raw JSON) so consumers stay
 * insulated from schema tweaks.
 */
import raw from "./programHistory.json";

// ─── Types ──────────────────────────────────────────────────────────────

export type Era = "pre-bbcor" | "bbcor";

export interface BattingLine {
  player: string;
  playerId: string;
  G?: number;
  AB?: number;
  R?: number;
  H?: number;
  "1B"?: number;
  "2B"?: number;
  "3B"?: number;
  HR?: number;
  RBI?: number;
  BB?: number;
  HBP?: number;
  K?: number;
  SAC?: number;
  TB?: number;
  SB?: number;
  CS?: number;
  E?: number;
  AVG?: number;
  OBP?: number;
  SLG?: number;
  OPS?: number;
  PA?: number;
}

export interface PitchingLine {
  player: string;
  playerId: string;
  W?: number;
  L?: number;
  SV?: number;
  G?: number;
  IP?: number; // decimal innings (5⅓ = 5.333...)
  IPDisplay?: string; // original display ("5.1")
  BF?: number;
  R?: number;
  H?: number;
  ER?: number;
  BB?: number;
  K?: number;
  HBP?: number;
  HR?: number;
  ERA?: number;
  OPPBA?: number;
  WHIP?: number;
  /** Strikeouts per 7 innings — HS games are 7 innings, so this is "K per game". */
  K7?: number;
  /** K / BB ratio (only present when BB > 0). */
  KBB?: number;
}

export interface RosterEntry {
  num: number | null;
  player: string;
  playerId: string;
  grade: number | null;
}

export interface ScheduleGame {
  date?: string;
  loc?: string;
  opponent?: string;
  // 'W' / 'L' / 'T'
  w_l?: string;
  // some sheets store score as string "8-1", others split into (R, H, E) cols
  score?: string;
  result_gh_opp?: string; // legacy "Result (GH-Opp)" column
  r?: number;
  h?: number;
  e?: number;
  [extra: string]: unknown;
}

export interface IndividualRecord {
  stat: string;
  holder: string;
  value: string | number | null;
  qualifier: string;
}

export interface Highlight {
  highlight: string;
  value: string | number | null;
  context: string;
}

export interface SourceQuality {
  status: "READABLE" | "NEEDS MANUAL UPDATE" | "NEEDS SPOT-CHECK" | "NOT PROVIDED";
  note: string;
}

export interface Season {
  year: number;
  era: Era;
  league?: string | null;
  leagueChamp: boolean;
  districtChamp: boolean;
  stateChamp: boolean;
  statePlace?: number | null;
  record?: { W: number; L: number } | null;
  headCoach?: string | null;
  coaches: string[];
  manager?: string | null;
  roster: RosterEntry[];
  schedule: ScheduleGame[];
  battingLines: BattingLine[];
  pitchingLines: PitchingLine[];
  teamBatting?: BattingLine | null;
  teamPitching?: PitchingLine | null;
  individualRecords: IndividualRecord[];
  highlights: Highlight[];
  sourceQuality: Record<string, SourceQuality>;
}

export interface Player {
  playerId: string;
  displayName: string;
  years: number[];
  grades: Record<string, number>;
}

export interface ProgramHistoryMeta {
  generatedAt: string;
  bbcorEraStart: number;
  yearsAvailable: number[];
  playerCount: number;
  schemaVersion: number;
}

export interface ProgramHistory {
  meta: ProgramHistoryMeta;
  seasons: Record<string, Season>;
  players: Record<string, Player>;
}

const data = raw as unknown as ProgramHistory;

// ─── Public accessors ─────────────────────────────────────────────────

export const meta: ProgramHistoryMeta = data.meta;
export const yearsAvailable: number[] = data.meta.yearsAvailable;
export const BBCOR_ERA_START = data.meta.bbcorEraStart;

export function getSeason(year: number | string): Season | undefined {
  return data.seasons[String(year)];
}

export function getAllSeasons(): Season[] {
  return Object.values(data.seasons).sort((a, b) => a.year - b.year);
}

export function getPlayer(playerId: string): Player | undefined {
  return data.players[playerId];
}

export function getAllPlayers(): Player[] {
  return Object.values(data.players);
}

/** Latest season year present in the data (e.g. 2026 once 2026 stats land). */
export const LATEST_YEAR: number =
  data.meta.yearsAvailable[data.meta.yearsAvailable.length - 1];

/**
 * Set of playerIds whose career extends into the current season — i.e.
 * they have a stat line in `LATEST_YEAR`. Used to flag still-playing
 * Tides on all-time leaderboards.
 */
const _activePlayerIds: Set<string> = (() => {
  const set = new Set<string>();
  for (const p of Object.values(data.players)) {
    if (p.years.includes(LATEST_YEAR)) set.add(p.playerId);
  }
  return set;
})();

export function isActivePlayer(playerId: string): boolean {
  return _activePlayerIds.has(playerId);
}

/**
 * Best display name for a playerId. Falls back to the raw name string the
 * source line carried (e.g. "Eibel, A" or "Cherbas") if we never saw a
 * fuller form. Use this anywhere you'd otherwise render `line.player`.
 */
export function displayNameOf(
  playerId: string | undefined,
  fallback: string,
): string {
  if (!playerId) return fallback;
  const p = data.players[playerId];
  if (!p) return fallback;
  // Only prefer the registry name if it's actually fuller (has a space and no comma)
  if (p.displayName.includes(" ") && !p.displayName.includes(",")) {
    return p.displayName;
  }
  return fallback;
}

export function eraFor(year: number): Era {
  return year >= BBCOR_ERA_START ? "bbcor" : "pre-bbcor";
}

export function eraLabel(era: Era): string {
  return era === "bbcor" ? "BBCOR (2012–present)" : "Pre-BBCOR (1990–2011)";
}

// ─── Stat helpers ─────────────────────────────────────────────────────

/** Format a decimal IP back to baseball notation (5.333 → '5.1'). */
export function formatIP(ip: number | undefined): string {
  if (ip === undefined || ip === null || Number.isNaN(ip)) return "—";
  const whole = Math.floor(ip);
  const fracRaw = ip - whole;
  const thirds = Math.round(fracRaw * 3);
  if (thirds === 0) return `${whole}.0`;
  if (thirds === 1) return `${whole}.1`;
  if (thirds === 2) return `${whole}.2`;
  return `${whole + 1}.0`;
}

/** Format an AVG/OBP/SLG-style ratio. .327 → '.327'. */
export function formatRatio(v: number | undefined): string {
  if (v === undefined || v === null || Number.isNaN(v)) return "—";
  // baseball convention: drop leading 0 if 0..1
  if (v < 1) return v.toFixed(3).replace(/^0/, "");
  return v.toFixed(3);
}

export function formatERA(v: number | undefined): string {
  if (v === undefined || v === null || Number.isNaN(v)) return "—";
  return v.toFixed(2);
}

// ─── Leader helpers ───────────────────────────────────────────────────

export interface SeasonLeader<TLine> {
  player: string;
  playerId: string;
  year: number;
  value: number;
  era: Era;
  line: TLine;
}

type BattingNumeric = Exclude<keyof BattingLine, "player" | "playerId">;
type PitchingNumeric = Exclude<keyof PitchingLine, "player" | "playerId" | "IPDisplay">;

interface LeaderOpts {
  /** "best" = higher is better (default for most stats);
   *  "lowest" = lower is better (ERA, OPPBA). */
  direction?: "best" | "lowest";
  /** Filter: minimum AB (batting) or IP (pitching) to qualify. */
  minAB?: number;
  minIP?: number;
  /** Filter: only seasons in this era. */
  era?: Era | "all";
  /** Cap. */
  limit?: number;
}

/**
 * Top single-season values for a batting stat across the program.
 */
export function singleSeasonBattingLeaders(
  stat: BattingNumeric,
  opts: LeaderOpts = {},
): SeasonLeader<BattingLine>[] {
  const { direction = "best", minAB = 0, era = "all", limit = 10 } = opts;
  const out: SeasonLeader<BattingLine>[] = [];
  for (const season of getAllSeasons()) {
    if (era !== "all" && season.era !== era) continue;
    for (const line of season.battingLines) {
      const v = line[stat];
      if (typeof v !== "number") continue;
      const ab = line.AB ?? 0;
      if (ab < minAB) continue;
      // skip team-total rows
      if (/^team/i.test(line.player)) continue;
      out.push({
        player: line.player,
        playerId: line.playerId,
        year: season.year,
        value: v,
        era: season.era,
        line,
      });
    }
  }
  out.sort((a, b) =>
    direction === "best" ? b.value - a.value : a.value - b.value,
  );
  return out.slice(0, limit);
}

/**
 * Top single-season values for a pitching stat across the program.
 */
export function singleSeasonPitchingLeaders(
  stat: PitchingNumeric,
  opts: LeaderOpts = {},
): SeasonLeader<PitchingLine>[] {
  const { direction = "best", minIP = 0, era = "all", limit = 10 } = opts;
  const out: SeasonLeader<PitchingLine>[] = [];
  for (const season of getAllSeasons()) {
    if (era !== "all" && season.era !== era) continue;
    for (const line of season.pitchingLines) {
      const v = line[stat];
      if (typeof v !== "number") continue;
      const ip = line.IP ?? 0;
      if (ip < minIP) continue;
      if (/^team/i.test(line.player)) continue;
      out.push({
        player: line.player,
        playerId: line.playerId,
        year: season.year,
        value: v,
        era: season.era,
        line,
      });
    }
  }
  out.sort((a, b) =>
    direction === "best" ? b.value - a.value : a.value - b.value,
  );
  return out.slice(0, limit);
}

// ─── Career aggregates ────────────────────────────────────────────────

export interface CareerBatting {
  playerId: string;
  player: string;
  years: number[];
  G: number;
  AB: number;
  R: number;
  H: number;
  "1B": number;
  "2B": number;
  "3B": number;
  HR: number;
  RBI: number;
  BB: number;
  HBP: number;
  K: number;
  TB: number;
  SB: number;
  PA: number;
  AVG: number;
  OBP: number;
  SLG: number;
}

export interface CareerPitching {
  playerId: string;
  player: string;
  years: number[];
  W: number;
  L: number;
  SV: number;
  G: number;
  IP: number;
  H: number;
  R: number;
  ER: number;
  BB: number;
  K: number;
  ERA: number;
  WHIP: number;
  K7: number;
  KBB: number;
}

export function getCareerBatting(opts: { era?: Era | "all" } = {}): CareerBatting[] {
  const { era = "all" } = opts;
  const acc: Record<string, CareerBatting> = {};
  for (const season of getAllSeasons()) {
    if (era !== "all" && season.era !== era) continue;
    for (const line of season.battingLines) {
      if (/^team/i.test(line.player)) continue;
      const key = line.playerId;
      const c = acc[key] ?? (acc[key] = {
        playerId: key,
        player: data.players[key]?.displayName ?? line.player,
        years: [],
        G: 0, AB: 0, R: 0, H: 0, "1B": 0, "2B": 0, "3B": 0, HR: 0, RBI: 0,
        BB: 0, HBP: 0, K: 0, TB: 0, SB: 0, PA: 0,
        AVG: 0, OBP: 0, SLG: 0,
      });
      if (!c.years.includes(season.year)) c.years.push(season.year);
      c.G += line.G ?? 0;
      c.AB += line.AB ?? 0;
      c.R += line.R ?? 0;
      c.H += line.H ?? 0;
      c["1B"] += line["1B"] ?? 0;
      c["2B"] += line["2B"] ?? 0;
      c["3B"] += line["3B"] ?? 0;
      c.HR += line.HR ?? 0;
      c.RBI += line.RBI ?? 0;
      c.BB += line.BB ?? 0;
      c.HBP += line.HBP ?? 0;
      c.K += line.K ?? 0;
      c.TB += line.TB ?? 0;
      c.SB += line.SB ?? 0;
      c.PA += line.PA ?? 0;
    }
  }
  for (const c of Object.values(acc)) {
    c.years.sort();
    c.AVG = c.AB ? c.H / c.AB : 0;
    const obpDen = c.AB + c.BB + c.HBP;
    c.OBP = obpDen ? (c.H + c.BB + c.HBP) / obpDen : 0;
    c.SLG = c.AB ? c.TB / c.AB : 0;
  }
  return Object.values(acc).sort((a, b) => b.H - a.H);
}

export function getCareerPitching(opts: { era?: Era | "all" } = {}): CareerPitching[] {
  const { era = "all" } = opts;
  const acc: Record<string, CareerPitching> = {};
  for (const season of getAllSeasons()) {
    if (era !== "all" && season.era !== era) continue;
    for (const line of season.pitchingLines) {
      if (/^team/i.test(line.player)) continue;
      const key = line.playerId;
      const c = acc[key] ?? (acc[key] = {
        playerId: key,
        player: data.players[key]?.displayName ?? line.player,
        years: [],
        W: 0, L: 0, SV: 0, G: 0, IP: 0, H: 0, R: 0, ER: 0, BB: 0, K: 0,
        ERA: 0, WHIP: 0, K7: 0, KBB: 0,
      });
      if (!c.years.includes(season.year)) c.years.push(season.year);
      c.W += line.W ?? 0;
      c.L += line.L ?? 0;
      c.SV += line.SV ?? 0;
      c.G += line.G ?? 0;
      c.IP += line.IP ?? 0;
      c.H += line.H ?? 0;
      c.R += line.R ?? 0;
      c.ER += line.ER ?? 0;
      c.BB += line.BB ?? 0;
      c.K += line.K ?? 0;
    }
  }
  for (const c of Object.values(acc)) {
    c.years.sort();
    c.ERA = c.IP ? (c.ER * 7) / c.IP : 0; // 7-inning HS games
    c.WHIP = c.IP ? (c.BB + c.H) / c.IP : 0;
    c.K7 = c.IP ? (c.K * 7) / c.IP : 0;
    c.KBB = c.BB > 0 ? c.K / c.BB : 0;
  }
  return Object.values(acc).sort((a, b) => b.K - a.K);
}

// ─── Per-season Hall of Fame (computed from stats; falls back to typed) ─

export type HofSource = "computed" | "typed";

export interface HofEntry {
  /** "Highest Average", "Most Hits", … */
  category: string;
  /** Everyone tied for the leading value (so we show co-leaders). */
  holders: { player: string; playerId?: string }[];
  /** Display string for the value. */
  display: string;
  /** Numeric for sort comparisons elsewhere if needed. */
  numeric?: number;
  /** Sub-line: "(min 30 AB)", "30+ AB (24-58)", etc. */
  qualifier?: string;
  /** Where this record came from. */
  source: HofSource;
  /** Group used for layout. */
  group: "batting" | "pitching" | "other";
  /** All-time program-wide context (only set for computed entries). */
  programContext?: ProgramRecordContext;
  /** BBCOR-era-only context (2012+); only set when relevant. */
  bbcorContext?: ProgramRecordContext;
}

export interface ProgramRecordContext {
  /** Where this year's value ranks among qualifying seasons in the pool.
   *  1 = matches the leader; 2+ = nth-best (or hypothetically would slot
   *  there for a season outside this pool's era). */
  rank: number;
  /** Total qualifying seasons in the pool. */
  pool: number;
  /** Whether `season.year` is itself in this pool. False for a pre-BBCOR
   *  season viewed under the BBCOR-only filter — rank becomes "would-be". */
  inPool: boolean;
  /** Formatted record value, e.g. ".538". */
  recordDisplay: string;
  /** Every season tied at the record value, ordered most-recent first. */
  recordHolders: {
    player: string;
    playerId: string;
    year: number;
  }[];
  /** This year's value matches the leader's value AND season is in pool. */
  isRecord: boolean;
  /** Multiple seasons share the leader's value. */
  isTie: boolean;
}

/**
 * Stricter qualifying minimums when treating a season as a *program record*.
 * Per-year leader determination uses a lower threshold so each year still
 * highlights its best qualifying pitcher even in short-IP cases. The all-time
 * records page and program-context lookups use these stricter values so a
 * thin-sample season can't claim the program record over a substantial one.
 *
 * 25 IP ≈ "1 IP per team game" rule-of-thumb for HS baseball (~20-25 game
 * regular season).
 */
export const PROGRAM_RECORD_MIN_IP: Record<string, number> = {
  ERA: 25,
  OPPBA: 25,
  WHIP: 25,
  K7: 25,
  KBB: 25,
};
export const PROGRAM_RECORD_MIN_AB: Record<string, number> = {
  AVG: 30,
  OBP: 30,
  SLG: 30,
};

/** Compute pool-wide rank + record-holder context for a HoF entry.
 *  era: "all"   → ranks against every program season
 *  era: "bbcor" → ranks against BBCOR-era seasons only (2012+) */
function programContextFor(
  thisYear: number,
  thisValue: number,
  kind: "batting" | "pitching",
  statKey: string,
  dir: "best" | "lowest",
  minQual: number,
  fmt: (v: number) => string,
  era: "all" | "bbcor" = "all",
): ProgramRecordContext | undefined {
  const opts = { direction: dir, era, limit: 1000 };
  const all =
    kind === "batting"
      ? singleSeasonBattingLeaders(statKey as BattingNumeric, {
          ...opts,
          minAB: minQual,
        })
      : singleSeasonPitchingLeaders(statKey as PitchingNumeric, {
          ...opts,
          minIP: minQual,
        });
  if (!all.length) return undefined;
  const top = all[0];
  const better = new Set<number>();
  for (const r of all) {
    const isBetter =
      dir === "best" ? r.value > thisValue : r.value < thisValue;
    if (isBetter) better.add(r.value);
  }
  const rank = better.size + 1;
  const atTop = all
    .filter((r) => r.value === top.value)
    .sort((a, b) => b.year - a.year); // most-recent first
  const inPool = era === "all" || thisYear >= BBCOR_ERA_START;
  return {
    rank,
    pool: all.length,
    inPool,
    recordDisplay: fmt(top.value),
    recordHolders: atTop.map((r) => ({
      player: displayNameOf(r.playerId, r.player),
      playerId: r.playerId,
      year: r.year,
    })),
    isRecord: inPool && rank === 1,
    isTie: inPool && rank === 1 && atTop.length > 1,
  };
}

/**
 * Build a per-year Hall of Fame, preferring stats-derived records and
 * falling back to typed records (e.g. "Longest Hitting Streak" can't be
 * recovered from box scores).
 */
export function buildSeasonHallOfFame(season: Season): HofEntry[] {
  const out: HofEntry[] = [];
  const computedCategories = new Set<string>();

  // ── Batting ──
  type BatSpec = {
    key: BattingNumeric;
    label: string;
    min?: number; // min AB to qualify
    fmt?: (v: number) => string;
    dir?: "lowest";
    group?: "batting";
  };
  const batSpecs: BatSpec[] = [
    { key: "AVG", label: "Highest Average", min: 30, fmt: formatRatio },
    { key: "H", label: "Most Hits" },
    { key: "1B", label: "Most Singles" },
    { key: "2B", label: "Most Doubles" },
    { key: "3B", label: "Most Triples" },
    { key: "HR", label: "Most Home Runs" },
    { key: "RBI", label: "Most RBIs" },
    { key: "R", label: "Most Runs Scored" },
    { key: "TB", label: "Most Total Bases" },
    { key: "BB", label: "Most Walks" },
    { key: "SB", label: "Most Stolen Bases" },
    { key: "HBP", label: "Most HBP" },
    { key: "OBP", label: "Best On-Base %", min: 30, fmt: formatRatio },
    { key: "SLG", label: "Best Slugging %", min: 30, fmt: formatRatio },
    { key: "AB", label: "Most At Bats" },
  ];
  for (const s of batSpecs) {
    const cands = season.battingLines.filter(
      (l) => !/^team/i.test(l.player) &&
        (l.AB ?? 0) >= (s.min ?? 0) &&
        typeof l[s.key] === "number",
    );
    if (!cands.length) continue;
    const cmp = (a: BattingLine, b: BattingLine) =>
      s.dir === "lowest"
        ? (a[s.key] as number) - (b[s.key] as number)
        : (b[s.key] as number) - (a[s.key] as number);
    cands.sort(cmp);
    const top = cands[0][s.key] as number;
    // Skip degenerate "top" values (everyone has 0 HRs, etc.)
    if (top === 0 && s.key !== "AVG" && s.key !== "OBP" && s.key !== "SLG") continue;
    const tied = cands.filter((l) => l[s.key] === top);
    const ab = cands[0].AB ?? 0;
    const h = cands[0].H ?? 0;
    const qualifier = s.min
      ? `30+ AB${tied.length === 1 ? ` · ${h}-${ab}` : ""}`
      : undefined;
    const fmt = s.fmt ?? ((v: number) => String(v));
    out.push({
      category: s.label,
      holders: tied.map((l) => ({ player: l.player, playerId: l.playerId })),
      display: fmt(top),
      numeric: top,
      qualifier,
      source: "computed",
      group: "batting",
      programContext: programContextFor(
        season.year,
        top,
        "batting",
        s.key,
        s.dir ?? "best",
        PROGRAM_RECORD_MIN_AB[s.key as string] ?? s.min ?? 0,
        fmt,
        "all",
      ),
      bbcorContext: programContextFor(
        season.year,
        top,
        "batting",
        s.key,
        s.dir ?? "best",
        PROGRAM_RECORD_MIN_AB[s.key as string] ?? s.min ?? 0,
        fmt,
        "bbcor",
      ),
    });
    computedCategories.add(s.label.toLowerCase());
  }

  // Lowest K Ratio (computed: K / (AB+BB+HBP+SAC))
  const kCands = season.battingLines.filter(
    (l) => !/^team/i.test(l.player) && (l.AB ?? 0) >= 30 && typeof l.K === "number",
  );
  if (kCands.length) {
    const withRatio = kCands.map((l) => {
      const denom = l.PA ?? (l.AB ?? 0) + (l.BB ?? 0) + (l.HBP ?? 0) + (l.SAC ?? 0);
      return { line: l, ratio: denom ? (l.K as number) / denom : 1 };
    });
    withRatio.sort((a, b) => a.ratio - b.ratio);
    const top = withRatio[0].ratio;
    if (top > 0 || (kCands[0].K ?? 0) === 0) {
      const tied = withRatio.filter((r) => r.ratio === top);
      const ln = withRatio[0].line;
      const denom = ln.PA ?? (ln.AB ?? 0) + (ln.BB ?? 0) + (ln.HBP ?? 0) + (ln.SAC ?? 0);
      // K ratio is a derived stat, so scan manually for both pools.
      const allKRates: { year: number; era: Era; player: string; playerId: string; ratio: number }[] = [];
      for (const ss of getAllSeasons()) {
        for (const ll of ss.battingLines) {
          if (/^team/i.test(ll.player)) continue;
          if ((ll.AB ?? 0) < 30) continue;
          if (typeof ll.K !== "number") continue;
          const d = ll.PA ?? (ll.AB ?? 0) + (ll.BB ?? 0) + (ll.HBP ?? 0) + (ll.SAC ?? 0);
          if (!d) continue;
          allKRates.push({ year: ss.year, era: ss.era, player: ll.player, playerId: ll.playerId, ratio: ll.K / d });
        }
      }
      const buildKCtx = (
        pool: typeof allKRates,
        targetEra: "all" | "bbcor",
      ): ProgramRecordContext | undefined => {
        if (!pool.length) return undefined;
        const sorted = [...pool].sort((a, b) => a.ratio - b.ratio);
        const topRow = sorted[0];
        const better = new Set<number>();
        for (const r of sorted) if (r.ratio < top) better.add(r.ratio);
        const rank = better.size + 1;
        const atTop = sorted
          .filter((r) => r.ratio === topRow.ratio)
          .sort((a, b) => b.year - a.year);
        const inPool = targetEra === "all" || season.year >= BBCOR_ERA_START;
        return {
          rank,
          pool: sorted.length,
          inPool,
          recordDisplay: `${(topRow.ratio * 100).toFixed(1)}%`,
          recordHolders: atTop.map((r) => ({
            player: displayNameOf(r.playerId, r.player),
            playerId: r.playerId,
            year: r.year,
          })),
          isRecord: inPool && rank === 1,
          isTie: inPool && rank === 1 && atTop.length > 1,
        };
      };
      const pctx = buildKCtx(allKRates, "all");
      const bctx = buildKCtx(
        allKRates.filter((r) => r.era === "bbcor"),
        "bbcor",
      );
      out.push({
        category: "Lowest K Ratio",
        holders: tied.map((r) => ({ player: r.line.player, playerId: r.line.playerId })),
        display: `${(top * 100).toFixed(1)}%`,
        numeric: top,
        qualifier:
          tied.length === 1 ? `${ln.K}-${denom} (PA)` : "30+ AB",
        source: "computed",
        group: "batting",
        programContext: pctx,
        bbcorContext: bctx,
      });
      computedCategories.add("lowest k ratio");
    }
  }

  // ── Pitching ──
  type PitSpec = {
    key: PitchingNumeric;
    label: string;
    minIP?: number;
    fmt?: (v: number) => string;
    dir?: "lowest";
  };
  const pitSpecs: PitSpec[] = [
    { key: "ERA", label: "Lowest ERA", minIP: 15, fmt: formatERA, dir: "lowest" },
    { key: "W", label: "Most Wins Pitching" },
    { key: "K", label: "Most K's" },
    { key: "IP", label: "Most Innings Pitched", fmt: formatIP },
    { key: "SV", label: "Most Saves" },
    { key: "OPPBA", label: "Lowest Opp. BA", minIP: 15, fmt: formatRatio, dir: "lowest" },
    { key: "WHIP", label: "Lowest WHIP", minIP: 15, fmt: (v) => v.toFixed(2), dir: "lowest" },
    { key: "K7", label: "Best K/Game", minIP: 15, fmt: (v) => v.toFixed(1) },
    { key: "KBB", label: "Best K/BB Ratio", minIP: 15, fmt: (v) => v.toFixed(2) },
  ];
  for (const s of pitSpecs) {
    const cands = season.pitchingLines.filter(
      (l) => !/^team/i.test(l.player) &&
        (l.IP ?? 0) >= (s.minIP ?? 0) &&
        typeof l[s.key] === "number",
    );
    if (!cands.length) continue;
    cands.sort((a, b) =>
      s.dir === "lowest"
        ? (a[s.key] as number) - (b[s.key] as number)
        : (b[s.key] as number) - (a[s.key] as number),
    );
    const top = cands[0][s.key] as number;
    if (top === 0 && s.key !== "ERA" && s.key !== "OPPBA") continue;
    const tied = cands.filter((l) => l[s.key] === top);
    const fmt = s.fmt ?? ((v: number) => String(v));
    out.push({
      category: s.label,
      holders: tied.map((l) => ({ player: l.player, playerId: l.playerId })),
      display: fmt(top),
      numeric: top,
      qualifier: s.minIP ? "min 15 IP" : undefined,
      source: "computed",
      group: "pitching",
      programContext: programContextFor(
        season.year,
        top,
        "pitching",
        s.key,
        s.dir ?? "best",
        PROGRAM_RECORD_MIN_IP[s.key as string] ?? s.minIP ?? 0,
        fmt,
        "all",
      ),
      bbcorContext: programContextFor(
        season.year,
        top,
        "pitching",
        s.key,
        s.dir ?? "best",
        PROGRAM_RECORD_MIN_IP[s.key as string] ?? s.minIP ?? 0,
        fmt,
        "bbcor",
      ),
    });
    computedCategories.add(s.label.toLowerCase());
  }

  // ── Typed-only fallbacks (records the box-score data can't recover) ──
  // Best On-Base Avg. is intentionally excluded — we compute "Best On-Base %"
  // from the box scores, which supersedes it.
  const typedAllowList = [
    "longest hitting streak",
    "longest hit streak",
  ];
  for (const r of season.individualRecords) {
    const lc = r.stat.toLowerCase().trim();
    // Skip any category we already computed
    if (computedCategories.has(lc)) continue;
    // Skip near-duplicates (avg, hits, hr, etc.)
    if (
      [
        "highest average",
        "most hits",
        "most at bats",
        "most plate appearances",
        "most home runs",
        "most rbis",
        "most rbi's",
        "most runs scored",
        "most total bases",
        "most doubles",
        "most triples",
        "most walks",
        "most stolen bases",
        "most hbp",
        "most wins pitching",
        "most innings pitched",
        "most k's",
        "lowest era",
        "most saves",
        "best on-base avg.",
        "best on base average",
        "best on-base average",
        "best obp",
        "lowest k ratio",
        "lowest k ratio batting",
      ].includes(lc)
    )
      continue;
    // Only allow specific categories
    if (!typedAllowList.includes(lc) && !lc.startsWith("longest")) continue;
    if (r.value === null || r.value === undefined || r.value === "") continue;
    out.push({
      category: r.stat,
      holders: [{ player: r.holder }],
      display: String(r.value),
      qualifier: r.qualifier || undefined,
      source: "typed",
      group: "other",
    });
  }
  return out;
}

// ─── Career Hall of Fame (one card per category, leader + runner-up) ─

export interface CareerHofEntry {
  category: string;
  group: "batting" | "pitching";
  /** Every career tied at the leading value. */
  leaders: {
    playerId: string;
    player: string;
    years: number[];
    value: number;
  }[];
  /** Formatted leader value, e.g. "162" or ".538". */
  display: string;
  /** Total qualifying careers in the pool. */
  pool: number;
  /** Qualifier sub-line, e.g. "min 100 AB". */
  qualifier?: string;
  /** Next-best career (first one not at the leading value). */
  runnerUp?: {
    playerId: string;
    player: string;
    years: number[];
    value: number;
    display: string;
  };
  /** True if at least one leader's most recent year is the latest in the data
   *  set — meaning this record could still be growing. */
  active?: boolean;
}

const _latestYearInData = (() => {
  const years = data.meta.yearsAvailable;
  return years[years.length - 1];
})();

function pickLeadersAndRunnerUp<T>(
  pool: T[],
  getValue: (x: T) => number,
  dir: "best" | "lowest",
): { leaders: T[]; runnerUp: T | undefined } {
  if (!pool.length) return { leaders: [], runnerUp: undefined };
  const sorted = [...pool].sort((a, b) =>
    dir === "lowest" ? getValue(a) - getValue(b) : getValue(b) - getValue(a),
  );
  const top = getValue(sorted[0]);
  const leaders = sorted.filter((x) => getValue(x) === top);
  const runnerUp = sorted.find((x) => getValue(x) !== top);
  return { leaders, runnerUp };
}

/**
 * Build a Career Hall of Fame for the given era. Returns one card per
 * batting + pitching category with the program leader(s), runner-up,
 * and active-year flag.
 */
export function buildCareerHallOfFame(era: Era | "all" = "all"): {
  batting: CareerHofEntry[];
  pitching: CareerHofEntry[];
} {
  const careerBat = getCareerBatting({ era });
  const careerPit = getCareerPitching({ era });

  type BatSpec = {
    key: keyof CareerBatting;
    label: string;
    minAB?: number;
    fmt?: (v: number) => string;
    dir?: "lowest";
  };
  const batSpecs: BatSpec[] = [
    { key: "H", label: "Most Career Hits" },
    { key: "1B", label: "Most Career Singles" },
    { key: "2B", label: "Most Career Doubles" },
    { key: "3B", label: "Most Career Triples" },
    { key: "HR", label: "Most Career Home Runs" },
    { key: "RBI", label: "Most Career RBIs" },
    { key: "R", label: "Most Career Runs" },
    { key: "TB", label: "Most Career Total Bases" },
    { key: "BB", label: "Most Career Walks" },
    { key: "SB", label: "Most Career Stolen Bases" },
    { key: "HBP", label: "Most Career HBP" },
    { key: "AB", label: "Most Career At Bats" },
    { key: "G", label: "Most Career Games" },
    {
      key: "AVG",
      label: "Highest Career AVG",
      minAB: 100,
      fmt: formatRatio,
    },
    {
      key: "OBP",
      label: "Highest Career OBP",
      minAB: 100,
      fmt: formatRatio,
    },
    {
      key: "SLG",
      label: "Highest Career SLG",
      minAB: 100,
      fmt: formatRatio,
    },
  ];

  const batting: CareerHofEntry[] = [];
  for (const s of batSpecs) {
    const filtered = careerBat.filter((c) => {
      if (s.minAB && c.AB < s.minAB) return false;
      const v = c[s.key] as number;
      return typeof v === "number" && v > 0;
    });
    if (!filtered.length) continue;
    const fmt = s.fmt ?? ((v: number) => String(v));
    const { leaders, runnerUp } = pickLeadersAndRunnerUp(
      filtered,
      (c) => c[s.key] as number,
      s.dir ?? "best",
    );
    if (!leaders.length) continue;
    const topVal = leaders[0][s.key] as number;
    const active = leaders.some(
      (l) => l.years[l.years.length - 1] === _latestYearInData,
    );
    batting.push({
      category: s.label,
      group: "batting",
      leaders: leaders.map((l) => ({
        playerId: l.playerId,
        player: l.player,
        years: l.years,
        value: l[s.key] as number,
      })),
      display: fmt(topVal),
      pool: filtered.length,
      qualifier: s.minAB ? `min ${s.minAB} AB` : undefined,
      runnerUp: runnerUp
        ? {
            playerId: runnerUp.playerId,
            player: runnerUp.player,
            years: runnerUp.years,
            value: runnerUp[s.key] as number,
            display: fmt(runnerUp[s.key] as number),
          }
        : undefined,
      active,
    });
  }

  type PitSpec = {
    key: keyof CareerPitching;
    label: string;
    minIP?: number;
    fmt?: (v: number) => string;
    dir?: "lowest";
  };
  const pitSpecs: PitSpec[] = [
    { key: "W", label: "Most Career Wins" },
    { key: "K", label: "Most Career Strikeouts" },
    { key: "IP", label: "Most Career Innings", fmt: formatIP },
    { key: "SV", label: "Most Career Saves" },
    {
      key: "ERA",
      label: "Lowest Career ERA",
      minIP: 50,
      fmt: formatERA,
      dir: "lowest",
    },
    {
      key: "WHIP",
      label: "Lowest Career WHIP",
      minIP: 50,
      fmt: (v) => v.toFixed(2),
      dir: "lowest",
    },
    {
      key: "K7",
      label: "Best Career K/Game",
      minIP: 50,
      fmt: (v) => v.toFixed(1),
    },
    {
      key: "KBB",
      label: "Best Career K/BB Ratio",
      minIP: 50,
      fmt: (v) => v.toFixed(2),
    },
  ];

  const pitching: CareerHofEntry[] = [];
  for (const s of pitSpecs) {
    const filtered = careerPit.filter((c) => {
      if (s.minIP && c.IP < s.minIP) return false;
      const v = c[s.key] as number;
      return typeof v === "number" && v > 0;
    });
    if (!filtered.length) continue;
    const fmt = s.fmt ?? ((v: number) => String(v));
    const { leaders, runnerUp } = pickLeadersAndRunnerUp(
      filtered,
      (c) => c[s.key] as number,
      s.dir ?? "best",
    );
    if (!leaders.length) continue;
    const topVal = leaders[0][s.key] as number;
    const active = leaders.some(
      (l) => l.years[l.years.length - 1] === _latestYearInData,
    );
    pitching.push({
      category: s.label,
      group: "pitching",
      leaders: leaders.map((l) => ({
        playerId: l.playerId,
        player: l.player,
        years: l.years,
        value: l[s.key] as number,
      })),
      display: fmt(topVal),
      pool: filtered.length,
      qualifier: s.minIP ? `min ${s.minIP} IP` : undefined,
      runnerUp: runnerUp
        ? {
            playerId: runnerUp.playerId,
            player: runnerUp.player,
            years: runnerUp.years,
            value: runnerUp[s.key] as number,
            display: fmt(runnerUp[s.key] as number),
          }
        : undefined,
      active,
    });
  }

  return { batting, pitching };
}

// ─── Team-Level Records (single-season + single-game + championships) ─

export interface TeamRecordEntry {
  category: string;
  group: "season" | "batting" | "pitching" | "single-game";
  /** Formatted display value, e.g. "25", "1.82", ".404". */
  display: string;
  /** Numeric value used for sort + tied-record detection. */
  numeric: number;
  /** Tied seasons, most-recent first. */
  holders: { year: number; context?: string }[];
  /** Total seasons that qualified for this category. */
  pool: number;
  /** "min 15 IP", etc. */
  qualifier?: string;
  /** True if any holder is `LATEST_YEAR` and value could grow. */
  active?: boolean;
}

interface ChampSummary {
  stateTitles: number[];
  districtTitles: number[];
  leagueTitles: number[];
  topThreeFinishes: { year: number; place: number }[];
}

/** Roll up championship years from per-season metadata. */
export function buildChampionshipSummary(): ChampSummary {
  const stateTitles: number[] = [];
  const districtTitles: number[] = [];
  const leagueTitles: number[] = [];
  const topThreeFinishes: { year: number; place: number }[] = [];
  for (const s of getAllSeasons()) {
    if (s.stateChamp) stateTitles.push(s.year);
    if (s.districtChamp) districtTitles.push(s.year);
    if (s.leagueChamp) leagueTitles.push(s.year);
    if (s.statePlace && !s.stateChamp)
      topThreeFinishes.push({ year: s.year, place: s.statePlace });
  }
  return {
    stateTitles: stateTitles.sort(),
    districtTitles: districtTitles.sort(),
    leagueTitles: leagueTitles.sort(),
    topThreeFinishes: topThreeFinishes.sort((a, b) => a.year - b.year),
  };
}

/** Find the seasons that lead a given key, with tie support. */
function pickTopSeasons(
  candidates: { year: number; value: number; context?: string }[],
  dir: "best" | "lowest",
): { value: number; tied: { year: number; context?: string }[]; pool: number } | undefined {
  if (!candidates.length) return undefined;
  const sorted = [...candidates].sort((a, b) =>
    dir === "lowest" ? a.value - b.value : b.value - a.value,
  );
  const top = sorted[0].value;
  const tied = sorted
    .filter((c) => c.value === top)
    .sort((a, b) => b.year - a.year)
    .map(({ year, context }) => ({ year, context }));
  return { value: top, tied, pool: sorted.length };
}

/**
 * Build the program's team-level record book. Era filter "all" includes
 * every season; "bbcor" filters to {LATEST_YEAR} ≥ year ≥ BBCOR_ERA_START.
 */
export function buildTeamRecords(
  era: Era | "all" = "all",
): { season: TeamRecordEntry[]; batting: TeamRecordEntry[]; pitching: TeamRecordEntry[]; singleGame: TeamRecordEntry[] } {
  const seasons = getAllSeasons().filter(
    (s) => era === "all" || s.era === era,
  );

  // Helper: pull a numeric value from a team line (handles undefined cleanly)
  const pullBat = (s: Season, key: keyof BattingLine): number | undefined => {
    const v = s.teamBatting?.[key];
    return typeof v === "number" ? v : undefined;
  };
  const pullPit = (s: Season, key: keyof PitchingLine): number | undefined => {
    const v = s.teamPitching?.[key];
    return typeof v === "number" ? v : undefined;
  };

  // Build a generic entry from a stat name + year-value list
  function build(
    category: string,
    group: TeamRecordEntry["group"],
    items: { year: number; value: number; context?: string }[],
    fmt: (v: number) => string,
    dir: "best" | "lowest" = "best",
    qualifier?: string,
  ): TeamRecordEntry | undefined {
    const top = pickTopSeasons(items, dir);
    if (!top) return undefined;
    const active = top.tied.some((h) => h.year === LATEST_YEAR);
    return {
      category,
      group,
      display: fmt(top.value),
      numeric: top.value,
      holders: top.tied,
      pool: top.pool,
      qualifier,
      active,
    };
  }

  const intFmt = (v: number) => String(Math.round(v));
  const ratioFmt = (v: number) => formatRatio(v);
  const eraFmt = (v: number) => formatERA(v);
  const whipFmt = (v: number) => v.toFixed(2);

  // ── Season performance ──
  const seasonEntries: TeamRecordEntry[] = [];
  const wlData = seasons
    .filter((s) => s.record)
    .map((s) => ({
      year: s.year,
      w: s.record!.W,
      l: s.record!.L,
      ctx: `${s.record!.W}-${s.record!.L}`,
    }));
  const winsItems = wlData.map((d) => ({ year: d.year, value: d.w, context: d.ctx }));
  const winPctItems = wlData
    .filter((d) => d.w + d.l >= 4)
    .map((d) => ({ year: d.year, value: d.w / (d.w + d.l), context: d.ctx }));
  const lossesItems = wlData
    .filter((d) => d.w + d.l >= 10) // require a meaningful schedule
    .map((d) => ({ year: d.year, value: d.l, context: d.ctx }));
  const winStreakItems: { year: number; value: number; context?: string }[] = [];
  const loseStreakItems: { year: number; value: number; context?: string }[] = [];
  for (const s of seasons) {
    for (const h of s.highlights) {
      if (typeof h.value !== "number") continue;
      if (h.highlight === "Longest Winning Streak")
        winStreakItems.push({ year: s.year, value: h.value });
      if (h.highlight === "Longest Losing Streak")
        loseStreakItems.push({ year: s.year, value: h.value });
    }
  }
  for (const e of [
    build("Most Wins (Season)", "season", winsItems, intFmt),
    build("Best Win %", "season", winPctItems, (v) => v.toFixed(3).replace(/^0/, ""), "best", "min 4 decisions"),
    build("Fewest Losses (Season)", "season", lossesItems, intFmt, "lowest", "min 10 decisions"),
    build("Longest Winning Streak", "season", winStreakItems, intFmt),
    build("Fewest Consecutive Losses", "season", loseStreakItems, intFmt, "lowest", "season's longest losing streak — lower is better"),
  ]) {
    if (e) seasonEntries.push(e);
  }

  // ── Team batting ──
  const battingEntries: TeamRecordEntry[] = [];
  const batSpecs: {
    label: string;
    key: keyof BattingLine;
    fmt: (v: number) => string;
    dir?: "lowest";
    qual?: string;
  }[] = [
    { label: "Most Runs (Season)", key: "R", fmt: intFmt },
    { label: "Most Hits (Season)", key: "H", fmt: intFmt },
    { label: "Most Home Runs (Season)", key: "HR", fmt: intFmt },
    { label: "Most Doubles (Season)", key: "2B", fmt: intFmt },
    { label: "Most Triples (Season)", key: "3B", fmt: intFmt },
    { label: "Most Total Bases (Season)", key: "TB", fmt: intFmt },
    { label: "Most Walks (Season)", key: "BB", fmt: intFmt },
    { label: "Most Stolen Bases (Season)", key: "SB", fmt: intFmt },
    { label: "Most HBP (Season)", key: "HBP", fmt: intFmt },
    { label: "Highest Team AVG", key: "AVG", fmt: ratioFmt },
    { label: "Highest Team OBP", key: "OBP", fmt: ratioFmt },
    { label: "Highest Team SLG", key: "SLG", fmt: ratioFmt },
    { label: "Fewest Strikeouts (Season)", key: "K", fmt: intFmt, dir: "lowest" },
  ];
  for (const s of batSpecs) {
    const items = seasons
      .map((season) => {
        const v = pullBat(season, s.key);
        return v !== undefined ? { year: season.year, value: v } : null;
      })
      .filter((x): x is { year: number; value: number } => x !== null);
    const entry = build(s.label, "batting", items, s.fmt, s.dir ?? "best", s.qual);
    if (entry) battingEntries.push(entry);
  }

  // ── Team pitching ──
  const pitchingEntries: TeamRecordEntry[] = [];
  const pitSpecs: {
    label: string;
    key: keyof PitchingLine;
    fmt: (v: number) => string;
    dir?: "lowest";
    qual?: string;
  }[] = [
    { label: "Lowest Team ERA", key: "ERA", fmt: eraFmt, dir: "lowest" },
    { label: "Lowest Team WHIP", key: "WHIP", fmt: whipFmt, dir: "lowest" },
    { label: "Most Strikeouts (Season)", key: "K", fmt: intFmt },
    { label: "Most Innings (Season)", key: "IP", fmt: formatIP },
    { label: "Most Saves (Season)", key: "SV", fmt: intFmt },
    { label: "Fewest Walks Allowed", key: "BB", fmt: intFmt, dir: "lowest" },
    { label: "Fewest Hits Allowed", key: "H", fmt: intFmt, dir: "lowest" },
    { label: "Fewest Runs Allowed", key: "R", fmt: intFmt, dir: "lowest" },
    { label: "Lowest Opp. BA", key: "OPPBA", fmt: ratioFmt, dir: "lowest" },
  ];
  for (const s of pitSpecs) {
    const items = seasons
      .map((season) => {
        const v = pullPit(season, s.key);
        return v !== undefined ? { year: season.year, value: v } : null;
      })
      .filter((x): x is { year: number; value: number } => x !== null);
    const entry = build(s.label, "pitching", items, s.fmt, s.dir ?? "best", s.qual);
    if (entry) pitchingEntries.push(entry);
  }

  // ── Single-game records (peak across all years' highlight sheets) ──
  const singleGameEntries: TeamRecordEntry[] = [];
  const gameHighlightSpecs: {
    label: string;
    sourceKey: string;
    dir?: "lowest";
  }[] = [
    { label: "Most Runs (Game)", sourceKey: "Most Runs (Game)" },
    { label: "Most Runs (Inning)", sourceKey: "Most Runs (Inning)" },
    { label: "Widest Margin of Victory", sourceKey: "Widest Margin of Victory" },
    { label: "Most Hits (Game)", sourceKey: "Most Hits (Game)" },
    { label: "Most Singles (Game)", sourceKey: "Most Singles (Game)" },
    { label: "Most Doubles (Game)", sourceKey: "Most Doubles (Game)" },
    { label: "Most Triples (Game)", sourceKey: "Most Triples (Game)" },
    { label: "Most Home Runs (Game)", sourceKey: "Most Home Runs (Game)" },
    { label: "Most Walks (Game)", sourceKey: "Most Walks (Game for GH)" },
    { label: "Most Steals (Game)", sourceKey: "Most Steals (Game)" },
    { label: "Most Strikeouts (Game, by GH)", sourceKey: "Most K's (by GH Pitchers)" },
  ];
  for (const spec of gameHighlightSpecs) {
    const items: { year: number; value: number; context?: string }[] = [];
    for (const s of seasons) {
      for (const h of s.highlights) {
        if (h.highlight === spec.sourceKey && typeof h.value === "number") {
          items.push({ year: s.year, value: h.value, context: h.context });
        }
      }
    }
    const entry = build(spec.label, "single-game", items, intFmt, spec.dir ?? "best");
    if (entry) singleGameEntries.push(entry);
  }

  return {
    season: seasonEntries,
    batting: battingEntries,
    pitching: pitchingEntries,
    singleGame: singleGameEntries,
  };
}

/** Format a sorted year array as a baseball-style span: "1992-95" / "2025". */
export function formatCareerSpan(years: number[]): string {
  if (!years.length) return "—";
  if (years.length === 1) return String(years[0]);
  const first = years[0];
  const last = years[years.length - 1];
  return `${first}–${String(last).slice(2)}`;
}

// ─── Per-season leader detection (for highlighting in tables) ────────

/**
 * Returns the set of stat-keys for which this player is the season leader,
 * by playerId. Used by the year-detail page to highlight leader cells.
 */
export function buildSeasonLeaderMap(season: Season): {
  batting: Record<string, Set<string>>; // statKey -> Set<playerId>
  pitching: Record<string, Set<string>>;
} {
  const batting: Record<string, Set<string>> = {};
  const pitching: Record<string, Set<string>> = {};

  const battingStats: { key: BattingNumeric; dir?: "lowest"; minAB?: number }[] = [
    { key: "AVG", minAB: 30 },
    { key: "H" },
    { key: "HR" },
    { key: "RBI" },
    { key: "R" },
    { key: "2B" },
    { key: "3B" },
    { key: "BB" },
    { key: "SB" },
    { key: "OBP", minAB: 30 },
    { key: "SLG", minAB: 30 },
    { key: "TB" },
  ];
  for (const { key, dir, minAB = 0 } of battingStats) {
    const lines = season.battingLines.filter(
      (l) => !/^team/i.test(l.player) && (l.AB ?? 0) >= minAB && typeof l[key] === "number",
    );
    if (!lines.length) continue;
    const sorted = [...lines].sort((a, b) => {
      const av = a[key] as number, bv = b[key] as number;
      return dir === "lowest" ? av - bv : bv - av;
    });
    const top = sorted[0][key] as number;
    const ids = new Set<string>();
    for (const l of sorted) {
      if ((l[key] as number) === top) ids.add(l.playerId);
      else break;
    }
    batting[key] = ids;
  }

  const pitchingStats: { key: PitchingNumeric; dir?: "lowest"; minIP?: number }[] = [
    { key: "ERA", dir: "lowest", minIP: 15 },
    { key: "W" },
    { key: "K" },
    { key: "IP" },
    { key: "SV" },
  ];
  for (const { key, dir, minIP = 0 } of pitchingStats) {
    const lines = season.pitchingLines.filter(
      (l) => !/^team/i.test(l.player) && (l.IP ?? 0) >= minIP && typeof l[key] === "number",
    );
    if (!lines.length) continue;
    const sorted = [...lines].sort((a, b) => {
      const av = a[key] as number, bv = b[key] as number;
      return dir === "lowest" ? av - bv : bv - av;
    });
    const top = sorted[0][key] as number;
    const ids = new Set<string>();
    for (const l of sorted) {
      if ((l[key] as number) === top) ids.add(l.playerId);
      else break;
    }
    pitching[key] = ids;
  }
  return { batting, pitching };
}
