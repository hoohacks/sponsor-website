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
  teamUrl: "https://team.hoohacks.io",
};

export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/hoohacks/" },
  { name: "Facebook", url: "https://www.facebook.com/hoohacks/" },
  { name: "X", url: "https://x.com/hoohacks" },
];

export const stats = {
  label: "HooHacks 2026",
  participants: "760+",
  schools: "46",
  states: "18",
  womenPlus: "29%",
  mlhAverageWomenPlus: "24%",
  projects: "220+",
  sponsors: "15",
  partners: "7",
};

export const tiers: Tier[] = [
  { id: "bronze", name: "Bronze", price: 1000, color: "#B8763E", pitch: "Support the event, send mentors and judges, and put your logo on the website." },
  { id: "silver", name: "Silver", price: 3000, color: "#A9B1C0", pitch: "Adds a table at the sponsorship fair, the sponsor lounge, and your logo on the T-shirt." },
  { id: "gold", name: "Gold", price: 5000, color: "#D4A72C", pitch: "Adds the resume book and a social media shoutout." },
  { id: "platinum", name: "Platinum", price: 10000, color: "#6E8FE0", pitch: "Adds a workshop, a sponsored prize, and an email to all attendees after the event." },
  { id: "diamond", name: "Diamond", price: 15000, color: "#E26DAE", pitch: "Adds your own competition track, the keynote, and coffee chats with students." },
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
  { group: "Food", name: "Sponsor a snack", minTier: "Bronze", price: "$1,000" },
  { group: "Food", name: "Sponsor a meal", minTier: "Bronze", price: "from $2,000" },
  { group: "Programming", name: "Non-technical activity", minTier: "Silver", price: "$1,000" },
  { group: "Programming", name: "Coffee chat", minTier: "Gold", price: "$2,000" },
  { group: "Programming", name: "Technical workshop", minTier: "Gold", price: "$2,500" },
];

/** Photo base names in /public/img, each available as -800.webp and -1600.webp. Mostly HooHacks 2026. */
export type Photo =
  | "hall"
  | "booth"
  | "booth-chat"
  | "fair-crowd"
  | "team-desk"
  | "late-night"
  | "judging"
  | "winners-stage"
  | "lettuce"
  | "award-handshake"
  | "crowd-smiles"
  | "opening-crowd"
  | "booth-talk"
  | "balloon-group"
  | "countdown-team"
  | "pizza-team"
  | "happy-hacking"
  | "winners-team"
  | "team-peace"
  | "atrium"
  | "speaker";

/** Hero strip. Every photo here is used nowhere else on the page. */
export const heroPhotos: { photo: Photo; alt: string }[] = [
  { photo: "team-desk", alt: "A team smiling at their laptops mid-build" },
  { photo: "opening-crowd", alt: "Hackers filling the lecture hall for the opening ceremony" },
  { photo: "booth-talk", alt: "Students talking with a sponsor at their booth" },
  { photo: "balloon-group", alt: "A group of hackers posing under a balloon arch" },
  { photo: "countdown-team", alt: "A team giving a thumbs up next to a four-hour countdown" },
  { photo: "lettuce", alt: "A crowd cheering on the lettuce-eating competition" },
  { photo: "pizza-team", alt: "A team working late around their laptops and a pizza box" },
  { photo: "team-peace", alt: "A team throwing peace signs at their table" },
  { photo: "happy-hacking", alt: "A full hall under the Happy Hacking slide at kickoff" },
  { photo: "winners-team", alt: "A winning team posing on stage" },
];

// TODO(confirm): times are placeholders from the prototype; replace with the real 2026 schedule.
export const weekend: { photo: Photo; when: string; day: string; time: string; title: string; body: string }[] = [
  { photo: "hall", when: "Kickoff", day: "Saturday", time: "12:30 PM", title: "Opening ceremony", body: "Everyone meets in the lecture hall. Sponsors can introduce themselves and their challenges." },
  { photo: "fair-crowd", when: "First afternoon", day: "Saturday", time: "2:00 PM", title: "Sponsorship fair", body: "Students visit sponsor tables to ask about jobs, internships, and the tools they can use." },
  { photo: "late-night", when: "Overnight", day: "Overnight", time: "3:00 AM", title: "Heads down", body: "Teams work through the night, and mentors help them when they get stuck." },
  { photo: "judging", when: "Final morning", day: "Sunday", time: "9:00 AM", title: "Demos", body: "Each team presents its project to the judges." },
  { photo: "winners-stage", when: "Closing", day: "Sunday", time: "11:00 AM", title: "Awards", body: "Winners are announced on stage, including the sponsor prizes." },
];

export const roles: { photo: Photo; alt: string; title: string; body: string; tag: string }[] = [
  { photo: "booth-chat", alt: "Sponsor representatives talking with a crowd of students", title: "Meet students", body: "Talk with students at the sponsorship fair, hand out swag, and follow up with the resume book.", tag: "Silver and up" },
  { photo: "speaker", alt: "A speaker talking to a full lecture hall", title: "Run a workshop", body: "Teach a technical workshop, or give the keynote at Diamond.", tag: "Platinum and up" },
  { photo: "award-handshake", alt: "A judge congratulating a winning team on stage", title: "Judge and award", body: "Send mentors and judges, sponsor a prize, or run a competition track at Diamond.", tag: "Every tier" },
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
