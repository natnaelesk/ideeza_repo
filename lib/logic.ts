import {
  CATEGORIES,
  CHALLENGES,
  LEVELS,
  PROFILE,
  REFERRAL_POINTS,
  RIVALS,
  STAGES,
  TICKETS,
  challengeById,
} from "@/lib/catalog";
import type {
  Application,
  Badge,
  Category,
  Persisted,
  Submission,
  SubmissionStatus,
} from "@/lib/types";

const noon = (day: number) => `2026-10-${String(day).padStart(2, "0")}T12:00:00.000Z`;

function submission(
  id: string,
  challengeId: string,
  status: SubmissionStatus,
  day: number,
  note: string,
  response?: string,
  resolvedDay?: number,
): Submission {
  return {
    id,
    challengeId,
    link: `https://example.com/ideeza/${challengeId}`,
    note,
    status,
    submittedAt: noon(day),
    resolvedAt: resolvedDay ? noon(resolvedDay) : undefined,
    response,
  };
}

export const SEED: Persisted = {
  version: 1,
  referrals: 2,
  inviteAccepted: false,
  claimedTicketIds: [],
  manualStageIds: [],
  application: null,
  submissions: [
    submission(
      "sub-enclosure",
      "enclosure-drop",
      "pending",
      15,
      "Snap-fit shell for the soil-sensor board. Lid tolerance is still a little proud.",
    ),
    submission(
      "sub-night",
      "night-market",
      "approved",
      11,
      "Table by the stair. Most people asked whether the prompt wrote the board or only the picture.",
      "Counted. The room saw the build.",
      12,
    ),
    submission(
      "sub-trace",
      "broken-trace",
      "rejected",
      9,
      "Crop of a trace crossing the antenna keep-out.",
      "That crop is from an older build. The card is back on the table — file a current one.",
      10,
    ),
    submission(
      "sub-campus",
      "campus-beacon",
      "approved",
      8,
      "Five students outside the AAU lab. Left the referral link on the whiteboard.",
      "Headcount checks out.",
      8,
    ),
    submission(
      "sub-coffee",
      "coffee-circuit",
      "approved",
      4,
      "Ambassador Coffee at the hub. Sat beside Liya and swapped enclosure prompts.",
      "Check-in confirmed.",
      4,
    ),
    submission(
      "sub-dorm",
      "dorm-antenna",
      "approved",
      2,
      "Matchbox LoRa node. Would buy the SMA connector at Mercato.",
      "BOM looks buildable.",
      3,
    ),
  ],
};

export function earnedPoints(data: Persisted) {
  const cards = data.submissions.reduce((sum, item) => {
    if (item.status !== "approved") return sum;
    return sum + (challengeById(item.challengeId)?.points ?? 0);
  }, 0);
  return {
    cards,
    referrals: data.referrals * REFERRAL_POINTS,
    total: cards + data.referrals * REFERRAL_POINTS,
  };
}

export function levelState(points: number) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i += 1) {
    if (points >= LEVELS[i].points) index = i;
  }
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  const progress = next ? (points - level.points) / (next.points - level.points) : 1;
  return {
    index,
    level,
    next,
    progress: Math.min(1, Math.max(0, progress)),
  };
}

function isStatus(value: unknown): value is SubmissionStatus {
  return value === "pending" || value === "approved" || value === "rejected";
}

function isSubmission(value: unknown): value is Submission {
  if (!value || typeof value !== "object") return false;
  const item = value as Submission;
  return (
    typeof item.id === "string" &&
    typeof item.challengeId === "string" &&
    Boolean(challengeById(item.challengeId)) &&
    isStatus(item.status) &&
    typeof item.link === "string" &&
    typeof item.note === "string" &&
    typeof item.submittedAt === "string"
  );
}

function isApplication(value: unknown): value is Application {
  if (!value || typeof value !== "object") return false;
  const item = value as Application;
  return (
    typeof item.name === "string" &&
    typeof item.email === "string" &&
    typeof item.city === "string" &&
    typeof item.why === "string" &&
    typeof item.link === "string" &&
    typeof item.submittedAt === "string"
  );
}

export function sanitize(input: unknown): Persisted {
  if (!input || typeof input !== "object") return structuredClone(SEED);
  const raw = input as Partial<Persisted>;
  if (raw.version !== 1) return structuredClone(SEED);
  const referrals = Number.isFinite(raw.referrals) ? Math.max(0, Math.floor(raw.referrals as number)) : SEED.referrals;
  const manualIds = new Set(STAGES.filter((stage) => stage.kind === "manual").map((stage) => stage.id));
  const ticketIds = new Set(TICKETS.map((ticket) => ticket.id));
  return {
    version: 1,
    referrals,
    inviteAccepted: Boolean(raw.inviteAccepted),
    claimedTicketIds: Array.isArray(raw.claimedTicketIds)
      ? raw.claimedTicketIds.filter((id): id is string => typeof id === "string" && ticketIds.has(id))
      : [],
    manualStageIds: Array.isArray(raw.manualStageIds)
      ? raw.manualStageIds.filter((id): id is string => typeof id === "string" && manualIds.has(id))
      : [],
    application: isApplication(raw.application) ? raw.application : null,
    submissions: Array.isArray(raw.submissions) ? raw.submissions.filter(isSubmission) : structuredClone(SEED.submissions),
  };
}

function countCategory(data: Persisted, category: Category) {
  return data.submissions.filter(
    (item) => item.status === "approved" && challengeById(item.challengeId)?.category === category,
  ).length;
}

export function derive(data: Persisted) {
  const breakdown = earnedPoints(data);
  const points = breakdown.total;
  const level = levelState(points);
  const builds = countCategory(data, "build");
  const shows = countCategory(data, "show");
  const bugs = countCategory(data, "bug");
  const refers = countCategory(data, "refer");

  const levels = LEVELS.map((item, index) => ({
    ...item,
    unlocked: index <= level.index,
    current: index === level.index,
  }));

  const badges: Badge[] = [
    { id: "spark", name: "Spark", hint: "Joined the cohort", unlocked: true, icon: "spark" },
    { id: "signal", name: "Signal", hint: "Reach 120 points", unlocked: points >= 120, icon: "spark" },
    { id: "maker", name: "Maker", hint: "Approve a Build card", unlocked: builds >= 1, icon: "cpu" },
    { id: "regular", name: "Regular", hint: "Show up twice", unlocked: shows >= 2, icon: "pin" },
    { id: "recruiter", name: "Recruiter", hint: "Two people on your link", unlocked: data.referrals >= 2, icon: "users" },
    { id: "scout", name: "Bug Scout", hint: "Approve a Bug card", unlocked: bugs >= 1, icon: "bug" },
    { id: "beacon", name: "Beacon", hint: "Reach 480 points", unlocked: points >= 480, icon: "star" },
    { id: "gifted", name: "Gifted", hint: "Redeem a Golden Ticket", unlocked: data.claimedTicketIds.length > 0, icon: "ticket" },
    { id: "architect", name: "Architect", hint: "Reach 720 points", unlocked: points >= 720, icon: "cpu" },
    { id: "inner", name: "Inner Circle", hint: "Reach 1,000 points", unlocked: points >= 1000, icon: "circle" },
    { id: "applicant", name: "Applicant", hint: "Send the internship form", unlocked: Boolean(data.application), icon: "apply" },
  ];

  const milestones = [
    { id: "schematic", label: "First schematic", detail: "A Build card approved", unlocked: builds >= 1 },
    { id: "sessions", label: "Two sessions", detail: "Show up, twice", unlocked: shows >= 2 },
    { id: "brought", label: "Brought a builder", detail: "One referral on your link", unlocked: data.referrals >= 1 },
    { id: "bug", label: "Bug on file", detail: "A Bug card approved", unlocked: bugs >= 1 },
    { id: "gift", label: "Gift claimed", detail: "A Golden Ticket redeemed", unlocked: data.claimedTicketIds.length > 0 },
    { id: "applied", label: "Application in", detail: "Internship form saved", unlocked: Boolean(data.application) },
  ];

  const challenges = CHALLENGES.map((challenge) => {
    const related = data.submissions.filter((item) => item.challengeId === challenge.id);
    const availability = related.some((item) => item.status === "approved")
      ? "approved"
      : related.some((item) => item.status === "pending")
        ? "pending"
        : "open";
    return { ...challenge, availability } as const;
  });

  const submissions = [...data.submissions]
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))
    .map((item) => ({ ...item, challenge: challengeById(item.challengeId)! }));

  const stageDone = STAGES.map((stage) => {
    if (stage.kind === "auto" && !stage.auto) return true;
    if (stage.auto === "build") return builds >= 1;
    if (stage.auto === "show") return shows >= 2;
    if (stage.kind === "manual") return data.manualStageIds.includes(stage.id);
    return Boolean(data.application);
  });
  const currentIndex = stageDone.findIndex((done) => !done);
  const stages = STAGES.map((stage, index) => ({
    ...stage,
    index,
    done: stageDone[index],
    current: index === currentIndex,
    locked: currentIndex !== -1 && index > currentIndex,
  }));

  const tickets = TICKETS.map((ticket) => ({
    ...ticket,
    claimed: data.claimedTicketIds.includes(ticket.id),
    ready: points >= ticket.points,
  }));

  const leaderboard = [
    ...RIVALS.map((rival) => ({ ...rival, you: false as const })),
    {
      id: "selam",
      name: PROFILE.name,
      campus: PROFILE.campus,
      points,
      you: true as const,
    },
  ]
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (a.you) return -1;
      if (b.you) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const pending = submissions.filter((item) => item.status === "pending");
  const spotlight = pending.slice().sort((a, b) => b.challenge.points - a.challenge.points)[0] ?? null;

  const ranges = Object.fromEntries(
    CATEGORIES.map((category) => {
      const values = CHALLENGES.filter((item) => item.category === category.id).map((item) => item.points);
      return [category.id, { min: Math.min(...values), max: Math.max(...values) }];
    }),
  ) as Record<Category, { min: number; max: number }>;

  return {
    profile: PROFILE,
    referrals: data.referrals,
    inviteAccepted: data.inviteAccepted,
    points,
    breakdown,
    level,
    levels,
    badges,
    milestones,
    challenges,
    submissions,
    stages,
    tickets,
    leaderboard,
    spotlight,
    ranges,
    application: data.application,
    counts: { builds, shows, bugs, refers },
  };
}
