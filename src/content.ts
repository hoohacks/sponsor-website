// Everything that changes from year to year lives in this file.
// Source of truth: the HooHacks 2027 sponsorship packet.

export type TierId = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  color: string;
  pitch: string;
}

/** `true` = included, a string = included with a detail, `null` = not included. */
export type Cell = true | string | null;

export interface Benefit {
  label: string;
  /** One cell per tier, in the same order as `tiers`. */
  cells: [Cell, Cell, Cell, Cell, Cell];
}

export interface BenefitGroup {
  group: string;
  benefits: Benefit[];
}

export const event = {
  year: 2027,
  dateLine: "March 2027 at the University of Virginia",
  email: "team@hoohacks.io",
  packetUrl: "/hoohacks-sponsorship-packet-2027.pdf",
  devpostUrl: "https://hoohacks-2026.devpost.com/project-gallery",
};

export const stats = {
  label: "HooHacks 2026",
  participants: "760+",
  schools: "46",
  states: "18",
  womenPlus: "29%",
  mlhAverageWomenPlus: "24%",
  projects: "220+",
  sponsors: "22+",
};

export const tiers: Tier[] = [
  { id: "bronze", name: "Bronze", price: 1000, color: "#4E9F5B", pitch: "A simple way to support the event and get in front of hackers." },
  { id: "silver", name: "Silver", price: 3000, color: "#9AA3B8", pitch: "Meet students in person at the fair and the sponsor lounge." },
  { id: "gold", name: "Gold", price: 5000, color: "#E0A82E", pitch: "Add recruiting with the resume book and social reach." },
  { id: "platinum", name: "Platinum", price: 10000, color: "#6E8FE0", pitch: "Teach, award a prize, and reach every attendee after the event." },
  { id: "diamond", name: "Diamond", price: 15000, color: "#E57200", pitch: "The full weekend: your own track, the keynote, and coffee chats." },
];

const from = (first: number): Benefit["cells"] =>
  [0, 1, 2, 3, 4].map((i) => (i >= first ? true : null)) as Benefit["cells"];

export const benefits: BenefitGroup[] = [
  {
    group: "At the event",
    benefits: [
      { label: "Send mentors and judges", cells: from(0) },
      { label: "Network with students", cells: from(1) },
      { label: "Sponsorship fair", cells: from(1) },
      { label: "Sponsor lounge", cells: from(1) },
      { label: "Display and hand out merch", cells: from(1) },
      { label: "Host a workshop", cells: from(3) },
      { label: "Custom slides on venue TVs", cells: from(3) },
      { label: "Sponsor a prize", cells: from(3) },
      { label: "Sponsor a competition track", cells: from(4) },
      { label: "Keynote speech", cells: from(4) },
      { label: "Coffee chats", cells: from(4) },
    ],
  },
  {
    group: "Brand",
    benefits: [
      { label: "Logo on the website", cells: ["Logo", "Logo", "Logo", "Large logo", "Large logo"] },
      { label: "Logo on HooHacks T-shirts", cells: [null, "Logo", "Logo", "Large logo", "Large logo"] },
      { label: "Social media shoutout", cells: [null, null, "Before", "Before and after", "Before, during, and after"] },
      { label: "Newsletter feature (3,500+ readers)", cells: from(3) },
    ],
  },
  {
    group: "Recruiting",
    benefits: [
      { label: "Resume book", cells: [null, null, "After the event", "Early access", "Early access"] },
      { label: "Post-hackathon email to attendees", cells: from(3) },
      { label: "Participant listserv access", cells: from(4) },
    ],
  },
];

export const addOns = [
  { name: "Sponsor a snack", minTier: "Bronze", price: "$1,000" },
  { name: "Sponsor a meal", minTier: "Bronze", price: "from $2,000" },
  { name: "Non-technical activity", minTier: "Silver", price: "$1,000" },
  { name: "Coffee chat", minTier: "Gold", price: "$2,000" },
  { name: "Technical workshop", minTier: "Gold", price: "$2,500" },
];

/** Photo base names in /public/img, each available as -800.webp and -1600.webp. Mostly HooHacks 2026. */
export type Photo =
  | "hall"
  | "booth"
  | "booth-chat"
  | "fair-crowd"
  | "team-desk"
  | "heads-down"
  | "judging"
  | "winners-stage"
  | "lettuce"
  | "award-handshake"
  | "crowd-smiles"
  | "chalkboard";

export const heroPhotos: { photo: Photo; alt: string }[] = [
  { photo: "booth", alt: "Students talking with recruiters at the Capital One booth" },
  { photo: "team-desk", alt: "A team smiling at their laptops mid-build" },
  { photo: "hall", alt: "A packed lecture hall at the HooHacks 2026 opening ceremony" },
  { photo: "winners-stage", alt: "A winning team holding their prizes on stage" },
  { photo: "lettuce", alt: "A crowd cheering on the lettuce-eating competition" },
];

export const weekend: { photo: Photo; when: string; title: string; body: string }[] = [
  { photo: "hall", when: "Kickoff", title: "Opening ceremony", body: "Hundreds of hackers pack the hall. Sponsors introduce themselves and their challenges." },
  { photo: "fair-crowd", when: "First afternoon", title: "Sponsorship fair", body: "Students make the rounds, ask about internships, and pick which APIs to build on." },
  { photo: "heads-down", when: "Overnight", title: "Heads down", body: "Teams build through the night. Mentors make rounds and unblock the hard problems." },
  { photo: "judging", when: "Final morning", title: "Demos", body: "Every team shows what they made. Judges walk the floor and ask the tough questions." },
  { photo: "winners-stage", when: "Closing", title: "Awards", body: "Winners are named on stage, and sponsor prizes go to the projects that earned them." },
];

export const roles: { photo: Photo; alt: string; title: string; body: string; tag: string }[] = [
  { photo: "booth-chat", alt: "Sponsor representatives talking with a crowd of students", title: "Meet students", body: "Talk to hackers at the sponsorship fair, hand out swag, and follow up with the resume book.", tag: "Silver and up" },
  { photo: "chalkboard", alt: "A student presenting at a chalkboard", title: "Teach something", body: "Run a workshop or give the keynote. Hackers remember the companies that taught them something.", tag: "Platinum and up" },
  { photo: "award-handshake", alt: "A judge congratulating a winning team on stage", title: "Judge and award", body: "Send mentors and judges, sponsor a prize, or run a whole track built around your product.", tag: "All tiers" },
];

/** Past sponsors. `ratio` is the trimmed logo's width / height, used for equal-area sizing. */
export const sponsors: { file: string; name: string; ratio: number }[] = [
  { file: "capitalone", name: "Capital One", ratio: 2.778 },
  { file: "deloitte", name: "Deloitte", ratio: 5.238 },
  { file: "googlecloud", name: "Google Cloud", ratio: 6.204 },
  { file: "ibm", name: "IBM", ratio: 2.492 },
  { file: "intel", name: "Intel", ratio: 2.543 },
  { file: "janestreet", name: "Jane Street", ratio: 3.728 },
  { file: "perplexity", name: "Perplexity", ratio: 4.138 },
  { file: "costar", name: "CoStar Group", ratio: 5.714 },
  { file: "leidos", name: "Leidos", ratio: 4.088 },
  { file: "fanniemae", name: "Fannie Mae", ratio: 5.1 },
  { file: "appian", name: "Appian", ratio: 2.6 },
  { file: "wolfram", name: "Wolfram", ratio: 4.333 },
  { file: "roboflow", name: "Roboflow", ratio: 4.447 },
  { file: "nordvpn", name: "NordVPN", ratio: 4.613 },
  { file: "cci", name: "Commonwealth Cyber Initiative", ratio: 0.9 },
  { file: "mlh", name: "Major League Hacking", ratio: 2.362 },
];
