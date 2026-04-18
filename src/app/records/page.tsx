import {
  LEGACY_ERA,
  legacySingleSeasonBatting,
  legacySingleSeasonPitching,
  legacyCareerBatting,
  legacyCareerPitching,
  legacyTeamSingleSeason,
  type LegacyRecord,
} from "@/data/legacyRecords";
import PageHeader from "@/components/PageHeader";
import SectionHeader, { EditorialDivider } from "@/components/SectionHeader";
import { HomePlate } from "@/components/Ornaments";

export const metadata = {
  title: "Program Records · Gig Harbor Tides Baseball",
};

function RecordCell({
  record,
  index,
  total,
}: {
  record: LegacyRecord;
  index: number;
  total: number;
}) {
  const primary = record.holders[0];
  const hasFooter = !!(primary?.context || record.qualifier);
  return (
    <div
      className="record-cell relative px-5 py-5 flex flex-col group hover:bg-navy/[0.018] transition-colors"
      style={{ animationDelay: `${Math.min(index * 28, 420)}ms` }}
    >
      <span className="absolute top-3 right-4 font-body text-[10px] font-medium tracking-[0.18em] text-navy/30 tabular-nums">
        №&thinsp;{String(index).padStart(2, "0")}
        <span className="text-navy/15 mx-0.5">/</span>
        <span className="text-navy/25">{String(total).padStart(2, "0")}</span>
      </span>

      <div className="font-heading font-bold text-[10px] uppercase tracking-[0.22em] text-navy/55">
        {record.stat}
      </div>

      <div
        className="mt-1 font-display text-[3.4rem] leading-[0.85] tracking-[0.01em] text-navy tabular-nums"
        style={{ fontFeatureSettings: '"tnum"' }}
      >
        {record.value}
      </div>

      <div className="mt-2.5 mb-2 flex items-center gap-2">
        <span className="h-px w-6 bg-carolina" />
        <HomePlate className="w-2 h-2 text-navy/25" />
      </div>

      <div className="space-y-0.5">
        {record.holders.map((h, i) => (
          <div
            key={i}
            className="flex items-baseline justify-between gap-2 leading-tight"
          >
            <span
              className="text-navy"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.98rem",
                fontWeight: 500,
                fontOpticalSizing: "auto",
                letterSpacing: "-0.005em",
              }}
            >
              {h.player}
            </span>
            {h.year && (
              <span className="font-display text-xs tracking-[0.08em] text-navy/45 tabular-nums">
                {h.year}
              </span>
            )}
          </div>
        ))}
      </div>

      {hasFooter && (
        <div
          className="mt-auto pt-3 text-[11px] text-navy/50 leading-snug"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          {record.holders.map(
            (h, i) =>
              h.context && (
                <div key={i}>
                  {h.player.split(" ").slice(-1)[0]}:&nbsp;{h.context}
                </div>
              )
          )}
          {record.qualifier && <div>{record.qualifier}</div>}
        </div>
      )}
    </div>
  );
}

function GhostCell() {
  return (
    <div className="relative px-5 py-5 flex items-center justify-center">
      <span className="font-display text-navy/10 text-4xl select-none">—</span>
    </div>
  );
}

function Section({
  title,
  records,
  kicker,
  cols = 4,
}: {
  title: string;
  records: LegacyRecord[];
  kicker?: string;
  cols?: 3 | 4;
}) {
  if (records.length === 0) return null;
  const ghostCount =
    records.length % cols === 0 ? 0 : cols - (records.length % cols);
  const lgCols = cols === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <section className="mb-14">
      <SectionHeader
        title={title}
        kicker={kicker}
        count={records.length}
        countLabel={records.length === 1 ? "Entry" : "Entries"}
      />
      <div className="record-paper border border-navy/15 shadow-[0_1px_0_rgba(27,42,74,0.04),0_12px_30px_-18px_rgba(27,42,74,0.25)]">
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${lgCols} [&>*]:border-b [&>*]:border-r [&>*]:border-navy/10 [&>*:last-child]:border-r-0`}
        >
          {records.map((r, i) => (
            <div
              key={r.stat}
              className={`
                sm:[&:nth-child(2n)]:border-r-0
                ${
                  cols === 4
                    ? "lg:!border-r lg:[&:nth-child(4n)]:!border-r-0"
                    : "lg:!border-r lg:[&:nth-child(3n)]:!border-r-0"
                }
              `}
            >
              <RecordCell record={r} index={i + 1} total={records.length} />
            </div>
          ))}
          {Array.from({ length: ghostCount }).map((_, i) => (
            <div
              key={`ghost-${i}`}
              className={`hidden lg:block
                ${
                  cols === 4
                    ? "lg:[&:nth-child(4n)]:border-r-0"
                    : "lg:[&:nth-child(3n)]:border-r-0"
                }
              `}
            >
              <GhostCell />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmptySection({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="mb-14">
      <SectionHeader title={title} kicker="Coming Soon" count={0} countLabel="Entries" />
      <div className="record-paper border border-dashed border-navy/20 py-10 px-6 text-center">
        <p
          className="max-w-xl mx-auto text-navy/55"
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "0.95rem",
          }}
        >
          {message}
        </p>
      </div>
    </section>
  );
}

export default function RecordsPage() {
  const totalRecords =
    legacySingleSeasonBatting.length +
    legacySingleSeasonPitching.length +
    legacyCareerBatting.length +
    legacyCareerPitching.length +
    legacyTeamSingleSeason.length;

  return (
    <>
      <PageHeader
        kicker="Tides Baseball · Hall of Fame"
        title={
          <>
            PROGRAM <span className="text-carolina-light">RECORDS</span>
          </>
        }
        subtitle={
          <>
            <span className="font-heading font-bold text-white/75 uppercase tracking-[0.22em] text-sm">
              {LEGACY_ERA}
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span
              className="text-white/55 leading-snug"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "0.95rem",
              }}
            >
              Every record the program has put to paper — hand-engraved across
              three decades at Gig Harbor High School.
            </span>
          </>
        }
        stats={[
          { value: totalRecords.toString().padStart(2, "0"), label: "Records on the wall" },
          { value: 30, label: "Seasons chronicled" },
          { value: 2, label: "State titles" },
        ]}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <EditorialDivider />

        <Section
          title="Single-Season Batting"
          kicker="At the plate"
          records={legacySingleSeasonBatting}
        />

        <Section
          title="Single-Season Pitching"
          kicker="On the mound"
          records={legacySingleSeasonPitching}
        />

        {legacyCareerBatting.length > 0 ? (
          <Section
            title="Career Batting"
            kicker="Across seasons"
            records={legacyCareerBatting}
          />
        ) : (
          <EmptySection
            title="Career Batting"
            message="Career batting leaders will be tallied as GameChanger data accumulates across seasons. Check back after the 2026 season."
          />
        )}

        <Section
          title="Career Pitching"
          kicker="Across seasons"
          records={legacyCareerPitching}
        />

        <Section
          title="Team Records"
          kicker="Program bests"
          records={legacyTeamSingleSeason}
        />

        <div className="mt-16 pt-6 border-t border-navy/12 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-navy/55">
              Record keeping
            </p>
            <p
              className="mt-1 text-navy/60 max-w-md"
              style={{
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: "0.92rem",
              }}
            >
              Single-season and career marks through the 2019 season. Modern-era
              leaderboards from GameChanger stats (2023–present) to be merged in
              an upcoming chapter.
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-[11px] uppercase tracking-[0.3em] text-navy/55">
              Tides Baseball
            </p>
            <p className="mt-1 font-display text-xl text-navy tracking-wider tabular-nums">
              Est. 1990
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
