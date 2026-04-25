import { permanentRedirect } from "next/navigation";

/**
 * Records moved into the Program History section. The curated plaque view
 * has been superseded by `/history/records` (computed top-10 leaderboards),
 * `/history/career-leaders` (editorial career cards), and
 * `/history/team-records` (team-level records). Old `/records` URLs are
 * permanently redirected to the History hub.
 */
export default function RecordsPage(): never {
  permanentRedirect("/history");
}
