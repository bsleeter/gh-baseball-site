import { HomePlate } from "./Ornaments";

interface SectionHeaderProps {
  title: string;
  kicker?: string;
  count?: number | string;
  countLabel?: string;
}

/**
 * Title + plate ornament + gradient rule + right-aligned kicker.
 * Used above any record-book-style section.
 */
export default function SectionHeader({
  title,
  kicker,
  count,
  countLabel,
}: SectionHeaderProps) {
  const showRight = kicker || count !== undefined;
  return (
    <div className="flex items-center gap-3 sm:gap-5 mb-4 px-0.5">
      <h2 className="font-display text-[1.7rem] sm:text-[1.9rem] tracking-[0.08em] text-navy leading-none shrink-0">
        {title}
      </h2>
      <HomePlate className="w-3 h-3 text-navy/40 shrink-0 hidden sm:block" />
      <div className="flex-1 h-px bg-gradient-to-r from-navy/25 via-navy/15 to-navy/5" />
      {showRight && (
        <span className="font-body text-[10px] font-medium tracking-[0.2em] uppercase text-navy/50 shrink-0 tabular-nums">
          {kicker && <span>{kicker}</span>}
          {kicker && count !== undefined && <span> · </span>}
          {count !== undefined && (
            <span>
              {count}
              {countLabel && ` ${countLabel}`}
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/** Small editorial divider used between page header and main content. */
export function EditorialDivider({ label = "Record Book" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-navy/45 mb-10">
      <span className="h-px flex-1 bg-navy/15" />
      <HomePlate className="w-2.5 h-2.5" />
      <span className="font-heading text-[11px] uppercase tracking-[0.3em]">
        {label}
      </span>
      <HomePlate className="w-2.5 h-2.5" />
      <span className="h-px flex-1 bg-navy/15" />
    </div>
  );
}
