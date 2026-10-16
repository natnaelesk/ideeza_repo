export type Category = "refer" | "build" | "bug" | "show";

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type Challenge = {
  id: string;
  title: string;
  category: Category;
  rarity: Rarity;
  points: number;
  seed: number;
  pitch: string;
  brief: string;
};

export type SubmissionStatus = "pending" | "approved" | "rejected";

export type Submission = {
  id: string;
  challengeId: string;
  link: string;
  note: string;
  status: SubmissionStatus;
  submittedAt: string;
  resolvedAt?: string;
  response?: string;
};

export type Ticket = {
  id: string;
  name: string;
  points: number;
  reward: string;
  detail: string;
};

export type Level = {
  id: string;
  name: string;
  points: number;
  badge: string;
  summary: string;
  detail: string;
};

export type StageKind = "auto" | "manual" | "final";

export type StageDef = {
  id: string;
  title: string;
  detail: string;
  kind: StageKind;
  auto?: "build" | "show";
};

export type Application = {
  name: string;
  email: string;
  city: string;
  why: string;
  link: string;
  submittedAt: string;
};

export type Persisted = {
  version: 1;
  referrals: number;
  inviteAccepted: boolean;
  claimedTicketIds: string[];
  manualStageIds: string[];
  application: Application | null;
  submissions: Submission[];
};

export type IconName =
  | "spark"
  | "users"
  | "cpu"
  | "bug"
  | "pin"
  | "ticket"
  | "star"
  | "circle"
  | "check"
  | "apply";

export type Badge = {
  id: string;
  name: string;
  hint: string;
  unlocked: boolean;
  icon: IconName;
};
