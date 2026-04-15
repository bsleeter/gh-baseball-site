"use client";

import { useState } from "react";

interface TeamTabsProps {
  tabs: { key: string; label: string }[];
  children: (activeTab: string) => React.ReactNode;
}

export default function TeamTabs({ tabs, children }: TeamTabsProps) {
  const [active, setActive] = useState(tabs[0].key);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 bg-navy/5 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`px-5 py-2 rounded-md font-heading font-bold uppercase tracking-wider text-sm transition-all ${
              active === tab.key
                ? "bg-navy text-white shadow-sm"
                : "text-navy/60 hover:text-navy hover:bg-white/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {children(active)}
    </div>
  );
}
