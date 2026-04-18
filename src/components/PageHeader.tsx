import { Ball } from "./Ornaments";
import type { ReactNode } from "react";

interface PageHeaderProps {
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  stats?: Array<{ value: string | number; label: string }>;
  children?: ReactNode;
  /** Hide the diagonal cut into cream at the bottom. */
  flush?: boolean;
}

/**
 * Navy-band page header with pinstripe overlay, editorial kicker,
 * display title, optional italic serif subtitle, and stats ribbon.
 * Used across all non-home pages for consistent chrome.
 */
export default function PageHeader({
  kicker,
  title,
  subtitle,
  stats,
  children,
  flush = false,
}: PageHeaderProps) {
  return (
    <section className="relative bg-navy text-white overflow-hidden">
      {/* Pinstripe texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 14px, rgba(255,255,255,0.4) 14px 15px)",
        }}
      />
      {/* Warm radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 85% 40%, rgba(201,169,74,0.12), transparent 55%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14">
        {/* Kicker line */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-12 bg-carolina" />
          <Ball className="w-3.5 h-3.5 text-carolina" />
          <span className="font-heading font-bold text-carolina-light text-xs uppercase tracking-[0.3em]">
            {kicker}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-5xl sm:text-7xl tracking-[0.04em] leading-[0.9]">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-2 max-w-4xl">
            {typeof subtitle === "string" ? (
              <span
                className="text-white/55 leading-snug"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: "0.95rem",
                }}
              >
                {subtitle}
              </span>
            ) : (
              subtitle
            )}
          </div>
        )}

        {/* Stats ribbon */}
        {stats && stats.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-6 sm:gap-10">
            {stats.map((s, i) => (
              <div key={i} className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl text-white tabular-nums leading-none">
                  {s.value}
                </span>
                <span className="font-heading text-[11px] uppercase tracking-[0.22em] text-white/50 max-w-[10rem] leading-tight">
                  {s.label}
                </span>
                {i < stats.length - 1 && (
                  <div className="h-6 w-px bg-white/15 hidden sm:block ml-6 sm:ml-10" />
                )}
              </div>
            ))}
          </div>
        )}

        {children && <div className="mt-8">{children}</div>}
      </div>

      {!flush && (
        <div
          className="absolute bottom-0 left-0 right-0 h-8 bg-cream"
          style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
        />
      )}
    </section>
  );
}
