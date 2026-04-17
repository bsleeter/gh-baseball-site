"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/calendar", label: "Calendar" },
  { href: "/roster", label: "Roster" },
  { href: "/photos", label: "Photos" },
  { href: "/donate", label: "Support the Field" },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo + team name */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <Image
                src="/logos/gh-logo.png"
                alt="GH Baseball"
                width={40}
                height={40}
                className="rounded"
              />
              <div className="hidden sm:block">
                <span className="font-display text-xl tracking-wide leading-none">
                  GIG HARBOR TIDES
                </span>
                <span className="block text-[10px] font-heading uppercase tracking-[0.3em] text-carolina-light opacity-80">
                  Baseball
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded text-sm font-heading font-semibold uppercase tracking-wider transition-colors ${
                      active
                        ? "bg-carolina/20 text-carolina-light"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    } ${link.href === "/donate" ? "ml-2 bg-carolina hover:bg-carolina-dark text-white rounded-md !opacity-100" : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                className={`ml-1 px-3 py-2 rounded text-sm font-heading font-semibold uppercase tracking-wider transition-colors ${
                  pathname === "/admin"
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                Admin
              </Link>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-5 flex flex-col gap-1">
                <span
                  className={`block h-0.5 bg-white transition-transform duration-200 ${
                    mobileOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-opacity duration-200 ${
                    mobileOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 bg-white transition-transform duration-200 ${
                    mobileOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Carolina accent line */}
        <div className="h-[3px] bg-gradient-to-r from-carolina via-carolina-light to-carolina" />

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-navy-dark border-t border-white/10 animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded font-heading font-semibold uppercase tracking-wider text-sm transition-colors ${
                      active
                        ? "bg-carolina/20 text-carolina-light"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded font-heading font-semibold uppercase tracking-wider text-sm transition-colors ${
                  pathname === "/admin"
                    ? "bg-white/15 text-white"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
