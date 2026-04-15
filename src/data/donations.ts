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
  subtitle: "Bringing Our Tides Home",
  description:
    "The Gig Harbor High School baseball field is in poor condition, forcing our varsity team to play all home games at an off-campus facility. The Booster Club is partnering with the Peninsula School District to renovate our on-campus field so our players can finally play at home.",
  whyItMatters: [
    "Our current field has standing water, no proper infield mix, and deteriorated fencing with safety hazards",
    "The warning track uses large rock material that presents serious injury risk to players",
    "Our team plays every home game off-campus at Sehmel Homestead Park instead of at school",
    "Renovation would bring home games back to campus, building school pride and increasing attendance",
    "A renovated field serves JV, C Team, PE classes, youth programs, and the entire community",
  ],
  phases: [
    {
      name: "Phase 1: Safety & Playability",
      priority: "Highest Priority",
      items: [
        "Complete infield renovation with laser leveling",
        "Proper infield mix material and top dressing",
        "Drainage improvements to eliminate standing water",
        "Warning track replacement with crushed brick/stone dust",
      ],
      cost: "$40,000 – $65,000",
    },
    {
      name: "Phase 2: Fencing & Boundaries",
      priority: "High Priority",
      items: [
        "Replace all deteriorated perimeter fencing",
        "Install permanent outfield fence at regulation distance",
        "Address safety gaps in current fencing system",
      ],
      cost: "$25,000 – $50,000",
    },
    {
      name: "Phase 3: Bullpens & Finishing",
      priority: "Important",
      items: [
        "Rebuild home and visitor bullpens",
        "Proper mound construction with drainage",
        "Protective fencing and appropriate surfacing",
      ],
      cost: "$15,000 – $30,000",
    },
  ],
  totalCost: "$80,000 – $145,000",
  boosterFunds: "$30,000",
  fundingNeeded: "$50,000 – $115,000",
};
