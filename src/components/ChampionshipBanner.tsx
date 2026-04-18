import {
  stateChampions,
  leagueChampions,
  stateTopThree,
} from "@/data/championships";

function TrophyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M7 3h10v2h3a2 2 0 0 1 2 2v2a4 4 0 0 1-4 4h-.35A5 5 0 0 1 13 15.9V18h3v3H8v-3h3v-2.1A5 5 0 0 1 7.35 13H7a4 4 0 0 1-4-4V7a2 2 0 0 1 2-2h2V3zm0 4H5v2a2 2 0 0 0 2 2V7zm10 0v4a2 2 0 0 0 2-2V7h-2z"
      />
    </svg>
  );
}

type ShieldVariant = "champion" | "third";
type ShieldSize = "sm" | "md";

const variantStyles: Record<ShieldVariant, { bg: string; tag: string }> = {
  champion: {
    bg: "linear-gradient(160deg, #F7DD7B 0%, #D4AF37 45%, #9C7D2A 100%)",
    tag: "State Champions",
  },
  third: {
    bg: "linear-gradient(160deg, #E8B180 0%, #C77A3E 45%, #8A4F23 100%)",
    tag: "3rd in State",
  },
};

const shieldDimensions: Record<
  ShieldSize,
  {
    width: string;
    pad: string;
    trophy: string;
    tag: string;
    year: string;
    team: string;
    gap: string;
  }
> = {
  sm: {
    width: "w-[100px]",
    pad: "px-2 pt-2.5 pb-5",
    trophy: "w-4 h-4",
    tag: "text-[7px]",
    year: "text-[1.45rem]",
    team: "text-[6px]",
    gap: "gap-3",
  },
  md: {
    width: "w-[150px]",
    pad: "px-3 pt-4 pb-7",
    trophy: "w-7 h-7",
    tag: "text-[9px]",
    year: "text-[2.25rem]",
    team: "text-[8px]",
    gap: "gap-4",
  },
};

function Shield({
  year,
  variant,
  size = "md",
}: {
  year: number;
  variant: ShieldVariant;
  size?: ShieldSize;
}) {
  const d = shieldDimensions[size];
  const v = variantStyles[variant];
  return (
    <div className={`relative ${d.width} group`}>
      <div
        className={`relative ${d.pad} text-center text-navy transition-transform duration-200 group-hover:-translate-y-1`}
        style={{
          background: v.bg,
          clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
          boxShadow:
            "0 10px 22px rgba(0,0,0,0.40), inset 0 0 0 2px rgba(255,255,255,0.32)",
        }}
      >
        <div
          className="absolute inset-1 pointer-events-none"
          style={{
            border: "1.5px solid rgba(27,42,74,0.55)",
            clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
          }}
        />
        <TrophyIcon className={`mx-auto ${d.trophy} text-navy/90`} />
        <div
          className={`mt-0.5 font-heading font-bold ${d.tag} uppercase tracking-[0.18em] text-navy/85 leading-tight`}
        >
          {v.tag}
        </div>
        <div
          className={`font-display ${d.year} leading-none tracking-wide text-navy mt-1 drop-shadow-sm`}
        >
          {year}
        </div>
        <div
          className={`${d.team} font-heading font-semibold uppercase tracking-[0.18em] text-navy/70 mt-0.5`}
        >
          Gig Harbor Tides
        </div>
      </div>
    </div>
  );
}

export function StateChampionsRow({ size = "sm" }: { size?: ShieldSize }) {
  const entries: { year: number; variant: ShieldVariant }[] = [
    ...stateChampions.map((c) => ({ year: c.year, variant: "champion" as const })),
    ...stateTopThree.map((f) => ({ year: f.year, variant: "third" as const })),
  ].sort((a, b) => a.year - b.year);

  if (entries.length === 0) return null;
  const d = shieldDimensions[size];
  return (
    <div className={`flex flex-wrap ${d.gap}`}>
      {entries.map((e) => (
        <Shield
          key={`${e.variant}-${e.year}`}
          year={e.year}
          variant={e.variant}
          size={size}
        />
      ))}
    </div>
  );
}

function TierLine({
  label,
  years,
  colorClass,
}: {
  label: string;
  years: number[];
  colorClass: string;
}) {
  if (years.length === 0) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 font-heading text-sm">
      <span
        className={`font-display tracking-[0.22em] text-[11px] uppercase ${colorClass}`}
      >
        {label}
      </span>
      <span className="text-white/30 text-xs">&middot;</span>
      <span className="text-white/85 font-display tracking-[0.15em]">
        {years.join(" · ")}
      </span>
    </div>
  );
}

export default function ChampionshipBanner() {
  const leagueYears = leagueChampions.map((c) => c.year).sort((a, b) => a - b);

  if (leagueYears.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <TierLine
        label="League Champions"
        years={leagueYears}
        colorClass="text-[#E0A878]"
      />
    </div>
  );
}
