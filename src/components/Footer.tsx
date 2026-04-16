import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white/70 mt-auto">
      <div className="h-[3px] bg-gradient-to-r from-carolina via-carolina-light to-carolina" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Program info */}
          <div>
            <h3 className="font-display text-2xl text-white tracking-wide mb-3">
              GIG HARBOR TIDES
            </h3>
            <p className="text-sm leading-relaxed">
              Gig Harbor High School Baseball<br />
              5101 Rosedale St NW<br />
              Gig Harbor, WA 98335
            </p>
            <p className="text-sm mt-3">
              Home Field: Sehmel Homestead Park
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider text-white text-sm mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/schedule" className="hover:text-carolina-light transition-colors">Schedule</Link></li>
              <li><Link href="/roster" className="hover:text-carolina-light transition-colors">Roster</Link></li>
              <li><Link href="/donate" className="hover:text-carolina-light transition-colors">Support the Field</Link></li>
              <li><Link href="/admin" className="hover:text-carolina-light transition-colors">Coach Login</Link></li>
            </ul>
          </div>

          {/* Booster club */}
          <div>
            <h4 className="font-heading font-bold uppercase tracking-wider text-white text-sm mb-3">
              Booster Club
            </h4>
            <p className="text-sm leading-relaxed">
              Contact: Scott Harthorn
            </p>
            <p className="text-sm mt-1">
              <a
                href="mailto:scottharthornjr@gmail.com"
                className="text-carolina-light hover:text-carolina transition-colors"
              >
                scottharthornjr@gmail.com
              </a>
            </p>
            <p className="text-sm mt-3 leading-relaxed">
              The Booster Club supports equipment purchases, field improvements, tournaments, and player awards.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>&copy; {new Date().getFullYear()} Gig Harbor High School Baseball</p>
          <p className="text-white/40">Go Tides!</p>
        </div>
      </div>
    </footer>
  );
}
