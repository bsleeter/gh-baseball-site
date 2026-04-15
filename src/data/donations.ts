export interface DonationTier {
  amount: number;
  label: string;
  description: string;
}

export interface Sponsor {
  name: string;
  tier: string;
  logo?: string;
}

export const fundraisingGoal = 50000;
export const fundraisingRaised = 14750;

export const donationTiers: DonationTier[] = [
  { amount: 25, label: "Single", description: "Help us get to first base" },
  { amount: 50, label: "Double", description: "A solid hit for the program" },
  { amount: 100, label: "Triple", description: "Rounding the bases for our team" },
  { amount: 250, label: "Home Run", description: "A grand slam contribution" },
];

export const sponsors: Sponsor[] = [
  { name: "Harbor Family Dentistry", tier: "Gold" },
  { name: "Gig Harbor Marina", tier: "Gold" },
  { name: "Tides Tavern", tier: "Silver" },
  { name: "Peninsula Light Company", tier: "Silver" },
  { name: "Kopachuck Brewing", tier: "Bronze" },
];

export const renovationDetails = {
  title: "Field Renovation Project",
  subtitle: "Building a Home Field Worthy of Our Tides",
  description:
    "The Gig Harbor Tides baseball program is raising funds to renovate our home field at Sehmel Homestead Park. This project will transform our facility into a top-tier high school baseball venue.",
  improvements: [
    "New infield turf and professional-grade clay",
    "Upgraded dugouts with protective screening",
    "LED scoreboard and field lighting",
    "New backstop and fencing",
    "Improved drainage system",
    "Spectator seating and accessibility upgrades",
    "Batting cages and bullpen area",
  ],
};
