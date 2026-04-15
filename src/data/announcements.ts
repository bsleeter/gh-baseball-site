export interface Announcement {
  id: string;
  title: string;
  message: string;
  urgency: "info" | "warning" | "urgent";
  date: string;
  active: boolean;
}

export const announcements: Announcement[] = [
  {
    id: "a1",
    title: "Home Game Tomorrow",
    message: "Varsity hosts Mount Tahoma at Sehmel Homestead Park, 4:00 PM. Come out and support the Tides!",
    urgency: "info",
    date: "2026-04-14",
    active: true,
  },
];
