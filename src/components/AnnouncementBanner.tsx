"use client";

import { useState } from "react";
import { useAnnouncements } from "@/lib/hooks";

const urgencyStyles = {
  info: "bg-carolina/10 border-carolina text-navy",
  warning: "bg-amber-50 border-warning text-amber-900",
  urgent: "bg-red-50 border-urgent text-red-900",
};

const urgencyIcons = {
  info: "\u24D8",
  warning: "\u26A0",
  urgent: "\u26A0",
};

export default function AnnouncementBanner() {
  const { data: announcements } = useAnnouncements();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const active = (announcements ?? []).filter((a) => !dismissed.has(a.id));

  if (active.length === 0) return null;

  return (
    <div className="space-y-0">
      {active.map((a) => (
        <div
          key={a.id}
          className={`animate-slide-down border-l-4 ${urgencyStyles[a.urgency]}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-start gap-3">
            <span className="text-lg mt-0.5 shrink-0">{urgencyIcons[a.urgency]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-sm uppercase tracking-wide">
                {a.title}
              </p>
              <p className="text-sm mt-0.5 opacity-90">{a.message}</p>
            </div>
            <button
              onClick={() =>
                setDismissed((prev) => new Set([...prev, a.id]))
              }
              className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors text-current opacity-50 hover:opacity-100"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
