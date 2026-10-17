export type Platform = "tiktok" | "x" | "linkedin" | "telegram";

export type Art =
  | "spark"
  | "story"
  | "clock"
  | "sketch"
  | "refer"
  | "mint"
  | Platform;

export type Thumb = "console" | "antenna" | "enclosure" | "sketch" | "sprint";

export type Person = {
  id: string;
  name: string;
  initials: string;
  club: string;
  country: string;
  coins: number;
  tone: number;
  you?: boolean;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  coins: number;
  art: Art;
};

export type Post = {
  id: string;
  personId: string;
  challengeId: string;
  platform: Platform;
  caption: string;
  likes: number;
  views: number;
  thumb: Thumb;
};

/** Sample builders for the IDEEZA team walkthrough. Not a live cohort. */
export const PEOPLE: Person[] = [
  { id: "mara", name: "Mara Desta", initials: "MD", club: "AAU Robotics", country: "Ethiopia", coins: 860, tone: 0 },
  { id: "yonas", name: "Yonas Bekele", initials: "YB", club: "AAiT", country: "Ethiopia", coins: 640, tone: 1 },
  { id: "helen", name: "Helen Tadesse", initials: "HT", club: "Unity University", country: "Ethiopia", coins: 510, tone: 2 },
  { id: "kidus", name: "Kidus Alemu", initials: "KA", club: "AASTU", country: "Ethiopia", coins: 430, tone: 3 },
  { id: "selam", name: "Selam Tesfaye", initials: "ST", club: "AAU", country: "Ethiopia", coins: 240, tone: 0, you: true },
  { id: "liya", name: "Liya Worku", initials: "LW", club: "St. Mary's", country: "Ethiopia", coins: 180, tone: 1 },
  { id: "nahom", name: "Nahom Getachew", initials: "NG", club: "HiLCoE", country: "Ethiopia", coins: 120, tone: 2 },
  { id: "sara", name: "Sara Mengistu", initials: "SM", club: "AAU", country: "Ethiopia", coins: 70, tone: 3 },
];

export const PROFILE = {
  id: "selam",
  referrals: 4,
  challengesDone: 6,
  mints: 1,
  referralPath: "/r/selam-7k",
  badges: ["First build", "Recruiter", "Minter", "48h squad"],
};

export const CHALLENGES: Challenge[] = [
  {
    id: "share-your-build",
    title: "Share Your Build",
    description: "Post your build with #WeAreIDEEZA #IdeaToReal #BuildTheFuture.",
    coins: 40,
    art: "spark",
  },
  {
    id: "idea-i-almost-didnt-build",
    title: "The Idea I Almost Didn't Build",
    description: "Tell the short story of the build you nearly skipped.",
    coins: 60,
    art: "story",
  },
  {
    id: "48h-build",
    title: "The 48h Build Challenge",
    description: "Build for 48 hours, then nominate 3 people.",
    coins: 120,
    art: "clock",
  },
  {
    id: "sketchpad-reveal",
    title: "Sketchpad Reveal",
    description: "Show the first sketch next to the finished build.",
    coins: 50,
    art: "sketch",
  },
  {
    id: "refer-a-friend",
    title: "Refer a friend to the waitlist",
    description: "Send your link and bring one builder to the waitlist.",
    coins: 80,
    art: "refer",
  },
  {
    id: "mint-your-first-project",
    title: "Mint your first project",
    description: "Mint the project on IDEEZA and show the result.",
    coins: 100,
    art: "mint",
  },
  {
    id: "tiktok-build-video",
    title: "TikTok build video",
    description: "A short video of the build, from idea to object.",
    coins: 90,
    art: "tiktok",
  },
  {
    id: "linkedin-build-post",
    title: "LinkedIn build post",
    description: "A LinkedIn post about what you built and why.",
    coins: 70,
    art: "linkedin",
  },
  {
    id: "x-build-thread",
    title: "X build thread",
    description: "A short thread on X with the campaign hashtags.",
    coins: 40,
    art: "x",
  },
  {
    id: "telegram-build-drop",
    title: "Telegram build drop",
    description: "Share the build in the builders' Telegram chat.",
    coins: 30,
    art: "telegram",
  },
];

export const POSTS: Post[] = [
  {
    id: "mara-tiktok",
    personId: "mara",
    challengeId: "tiktok-build-video",
    platform: "tiktok",
    caption: "Opened the mouse console on a dorm desk. Idea to object in one clip.",
    likes: 1482,
    views: 18640,
    thumb: "console",
  },
  {
    id: "yonas-linkedin",
    personId: "yonas",
    challengeId: "linkedin-build-post",
    platform: "linkedin",
    caption: "Printed a campus antenna and posted the build log.",
    likes: 226,
    views: 3410,
    thumb: "antenna",
  },
  {
    id: "helen-share",
    personId: "helen",
    challengeId: "share-your-build",
    platform: "x",
    caption: "The lid finally snapped shut. #WeAreIDEEZA #IdeaToReal #BuildTheFuture",
    likes: 890,
    views: 7244,
    thumb: "enclosure",
  },
  {
    id: "kidus-sketch",
    personId: "kidus",
    challengeId: "sketchpad-reveal",
    platform: "x",
    caption: "Napkin from Tuesday. Board from Thursday.",
    likes: 164,
    views: 980,
    thumb: "sketch",
  },
  {
    id: "mara-48h",
    personId: "mara",
    challengeId: "48h-build",
    platform: "telegram",
    caption: "48 hours, then I nominated three people from the lab.",
    likes: 305,
    views: 2104,
    thumb: "sprint",
  },
];

export function personById(id: string) {
  const person = PEOPLE.find((item) => item.id === id);
  if (!person) throw new Error(`Missing person ${id}`);
  return person;
}

export function challengeById(id: string) {
  const challenge = CHALLENGES.find((item) => item.id === id);
  if (!challenge) throw new Error(`Missing challenge ${id}`);
  return challenge;
}

export function you() {
  const person = personById(PROFILE.id);
  return person;
}

export function tierFor(coins: number) {
  if (coins >= 300) return { name: "Lead Builder", detail: "300+ coins" };
  if (coins >= 100) return { name: "Ambassador", detail: "100–299 coins" };
  return { name: "Builder", detail: "0–99 coins" };
}

export function formatCoins(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCount(value: number) {
  if (value >= 10000) return `${Math.round(value / 1000)}k`;
  if (value >= 1000) {
    const scaled = Math.round(value / 100) / 10;
    return `${scaled.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(value);
}
