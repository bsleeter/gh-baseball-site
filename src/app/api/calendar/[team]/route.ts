import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const teamNames: Record<string, string> = {
  all: "All Teams",
  varsity: "Varsity",
  jv: "JV",
  cteam: "C Team",
};

function escapeIcal(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function formatIcalDate(date: string, time?: string): string {
  // Convert to YYYYMMDDTHHMMSS format
  const d = date.replace(/-/g, "");
  if (!time) return d;
  const t = time.replace(/:/g, "").padEnd(6, "0");
  return `${d}T${t}`;
}

// Convert "4:00 PM" to "16:00:00"
function timeTo24(time: string): string {
  const match = time.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "12:00:00";
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ team: string }> }
) {
  const { team } = await params;

  if (!teamNames[team]) {
    return NextResponse.json({ error: "Invalid team" }, { status: 400 });
  }

  const calName = `GH Tides Baseball - ${teamNames[team]}`;

  // Fetch games
  let gamesQuery = supabase.from("games").select("*").order("date");
  if (team !== "all") gamesQuery = gamesQuery.eq("team", team);
  const { data: games } = await gamesQuery;

  // Fetch calendar events (practices, tryouts)
  let eventsQuery = supabase.from("calendar_events").select("*").order("start_time");
  if (team !== "all") {
    eventsQuery = eventsQuery.or(`team.eq.${team},team.eq.all`);
  }
  const { data: calEvents } = await eventsQuery;

  // Build iCal
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//GH Tides Baseball//EN`,
    `X-WR-CALNAME:${escapeIcal(calName)}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-TIMEZONE:America/Los_Angeles",
    // Timezone definition
    "BEGIN:VTIMEZONE",
    "TZID:America/Los_Angeles",
    "BEGIN:DAYLIGHT",
    "TZOFFSETFROM:-0800",
    "TZOFFSETTO:-0700",
    "TZNAME:PDT",
    "DTSTART:19700308T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU",
    "END:DAYLIGHT",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:-0700",
    "TZOFFSETTO:-0800",
    "TZNAME:PST",
    "DTSTART:19701101T020000",
    "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU",
    "END:STANDARD",
    "END:VTIMEZONE",
  ];

  // Add games
  for (const g of games ?? []) {
    const prefix = g.team === "varsity" ? "V" : g.team === "jv" ? "JV" : "C";
    const title = `${prefix} ${g.location === "home" ? "vs" : "@"} ${g.opponent}`;
    const time24 = timeTo24(g.time);
    const dtStart = formatIcalDate(g.date, time24);

    // Assume ~2.5 hour game
    const startDate = new Date(`${g.date}T${time24}`);
    const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000);
    const dtEnd = formatIcalDate(
      endDate.toISOString().split("T")[0],
      endDate.toTimeString().slice(0, 8)
    );

    let description = `${g.time} at ${g.venue}`;
    if (g.result) description += `\\nResult: ${g.result} ${g.score_us}-${g.score_them}`;
    if (g.highlights) description += `\\n${escapeIcal(g.highlights)}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:game-${g.id}@ghbaseball`,
      `DTSTART;TZID=America/Los_Angeles:${dtStart}`,
      `DTEND;TZID=America/Los_Angeles:${dtEnd}`,
      `SUMMARY:${escapeIcal(title)}`,
      `LOCATION:${escapeIcal(g.venue)}`,
      `DESCRIPTION:${description}`,
      "END:VEVENT"
    );
  }

  // Add calendar events (practices, tryouts)
  for (const ce of calEvents ?? []) {
    const start = new Date(ce.start_time);
    const dtStart = formatIcalDate(
      `${start.getFullYear()}-${(start.getMonth() + 1).toString().padStart(2, "0")}-${start.getDate().toString().padStart(2, "0")}`,
      `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}:00`
    );

    let dtEnd = dtStart;
    if (ce.end_time) {
      const end = new Date(ce.end_time);
      dtEnd = formatIcalDate(
        `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, "0")}-${end.getDate().toString().padStart(2, "0")}`,
        `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}:00`
      );
    }

    lines.push(
      "BEGIN:VEVENT",
      `UID:cal-${ce.id}@ghbaseball`,
      `DTSTART;TZID=America/Los_Angeles:${dtStart}`,
      `DTEND;TZID=America/Los_Angeles:${dtEnd}`,
      `SUMMARY:${escapeIcal(ce.title)}`,
      ce.location ? `LOCATION:${escapeIcal(ce.location)}` : "",
      ce.notes ? `DESCRIPTION:${escapeIcal(ce.notes)}` : "",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");

  const ical = lines.filter(Boolean).join("\r\n");

  return new NextResponse(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `inline; filename="gh-tides-${team}.ics"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
