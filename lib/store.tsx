"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { LEVELS, REFERRAL_POINTS, challengeById } from "@/lib/catalog";
import { validEmail, validLink } from "@/lib/format";
import { derive, earnedPoints, levelState, sanitize, SEED } from "@/lib/logic";
import type { Application, Level, Persisted } from "@/lib/types";

const STORAGE_KEY = "ideeza-builders-cohort-v1";

let snapshot: Persisted = SEED;
let hydrated = false;
const listeners = new Set<() => void>();

function readSnapshot() {
  if (!hydrated && typeof window !== "undefined") {
    hydrated = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      snapshot = raw ? sanitize(JSON.parse(raw)) : structuredClone(SEED);
    } catch {
      snapshot = structuredClone(SEED);
    }
  }
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: Persisted) {
  snapshot = next;
  hydrated = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private mode can reject storage; the session still updates in memory.
  }
  listeners.forEach((listener) => listener());
}

type Toast = { id: string; title: string; body: string };
type Burst = { id: string; amount: number };

type CohortContextValue = ReturnType<typeof derive> & {
  ready: boolean;
  burst: Burst | null;
  levelUp: Level | null;
  toasts: Toast[];
  dismissToast: (id: string) => void;
  dismissLevelUp: () => void;
  addReferral: () => void;
  acceptInvite: () => boolean;
  submitChallenge: (challengeId: string, link: string, note: string) => boolean;
  reviewSubmission: (id: string, status: "approved" | "rejected") => void;
  claimTicket: (id: string) => boolean;
  completeStage: (id: string) => void;
  apply: (input: Omit<Application, "submittedAt">) => boolean;
  reset: () => void;
};

const CohortContext = createContext<CohortContextValue | null>(null);

export function CohortProvider({ children }: { children: ReactNode }) {
  const data = useSyncExternalStore(subscribe, readSnapshot, () => SEED);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [burst, setBurst] = useState<Burst | null>(null);
  const [levelUp, setLevelUp] = useState<Level | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const bucket = timers.current;
    return () => bucket.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const pushToast = useCallback((title: string, body: string) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, body }].slice(-3));
    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3400);
    timers.current.push(timer);
  }, []);

  const flash = useCallback((amount: number) => {
    const id = crypto.randomUUID();
    setBurst({ id, amount });
    const timer = window.setTimeout(() => {
      setBurst((current) => (current?.id === id ? null : current));
    }, 1100);
    timers.current.push(timer);
  }, []);

  const noteLevel = useCallback((before: number, after: number) => {
    const previous = levelState(before).index;
    const next = levelState(after).index;
    if (next > previous) setLevelUp(LEVELS[next]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);
  const dismissLevelUp = useCallback(() => setLevelUp(null), []);

  const addReferral = useCallback(() => {
    const current = readSnapshot();
    const next = { ...current, referrals: current.referrals + 1 };
    write(next);
    noteLevel(earnedPoints(current).total, earnedPoints(next).total);
    flash(REFERRAL_POINTS);
    pushToast(`+${REFERRAL_POINTS} points`, "A new builder joined with your link.");
  }, [flash, noteLevel, pushToast]);

  const acceptInvite = useCallback(() => {
    const current = readSnapshot();
    if (current.inviteAccepted) return false;
    const next = { ...current, inviteAccepted: true, referrals: current.referrals + 1 };
    write(next);
    noteLevel(earnedPoints(current).total, earnedPoints(next).total);
    flash(REFERRAL_POINTS);
    pushToast(`+${REFERRAL_POINTS} points`, "Referral counted on this device.");
    return true;
  }, [flash, noteLevel, pushToast]);

  const submitChallenge = useCallback(
    (challengeId: string, link: string, note: string) => {
      const current = readSnapshot();
      const challenge = challengeById(challengeId);
      if (!challenge || !validLink(link) || note.trim().length < 8) return false;
      const blocked = current.submissions.some(
        (item) => item.challengeId === challengeId && (item.status === "pending" || item.status === "approved"),
      );
      if (blocked) return false;
      write({
        ...current,
        submissions: [
          {
            id: crypto.randomUUID(),
            challengeId,
            link: link.trim(),
            note: note.trim(),
            status: "pending",
            submittedAt: new Date().toISOString(),
          },
          ...current.submissions,
        ],
      });
      pushToast("Submitted", "It is pending in History. Demo review can approve or reject it.");
      return true;
    },
    [pushToast],
  );

  const reviewSubmission = useCallback(
    (id: string, status: "approved" | "rejected") => {
      const current = readSnapshot();
      const target = current.submissions.find((item) => item.id === id);
      if (!target || target.status !== "pending") return;
      const challenge = challengeById(target.challengeId);
      const next = {
        ...current,
        submissions: current.submissions.map((item) =>
          item.id === id ? { ...item, status, resolvedAt: new Date().toISOString() } : item,
        ),
      };
      write(next);
      if (status === "approved" && challenge) {
        noteLevel(earnedPoints(current).total, earnedPoints(next).total);
        flash(challenge.points);
        pushToast(`+${challenge.points} points`, `${challenge.title} landed on your profile total.`);
      } else if (challenge) {
        pushToast("Card returned", `${challenge.title} is back on the Challenges table.`);
      }
    },
    [flash, noteLevel, pushToast],
  );

  const claimTicket = useCallback(
    (id: string) => {
      const view = derive(readSnapshot());
      const ticket = view.tickets.find((item) => item.id === id);
      if (!ticket || ticket.claimed || !ticket.ready) return false;
      const current = readSnapshot();
      write({ ...current, claimedTicketIds: [...current.claimedTicketIds, id] });
      pushToast("Gift unlocked", ticket.reward);
      return true;
    },
    [pushToast],
  );

  const completeStage = useCallback(
    (id: string) => {
      const current = readSnapshot();
      const stage = derive(current).stages.find((item) => item.id === id);
      if (!stage || stage.kind !== "manual" || !stage.current) return;
      write({ ...current, manualStageIds: [...current.manualStageIds, id] });
      pushToast("Stage complete", stage.title);
    },
    [pushToast],
  );

  const apply = useCallback(
    (input: Omit<Application, "submittedAt">) => {
      const current = readSnapshot();
      const finalStage = derive(current).stages.find((item) => item.kind === "final");
      if (!finalStage?.current || current.application) return false;
      if (input.name.trim().length < 2 || input.city.trim().length < 2) return false;
      if (!validEmail(input.email) || input.why.trim().length < 20) return false;
      if (input.link.trim() && !validLink(input.link)) return false;
      write({
        ...current,
        application: {
          name: input.name.trim(),
          email: input.email.trim(),
          city: input.city.trim(),
          why: input.why.trim(),
          link: input.link.trim(),
          submittedAt: new Date().toISOString(),
        },
      });
      pushToast("Application saved", "It stays on this device. Nothing was sent.");
      return true;
    },
    [pushToast],
  );

  const reset = useCallback(() => {
    write(structuredClone(SEED));
    setBurst(null);
    setLevelUp(null);
    pushToast("Demo reset", "Mock data is back to the opening scene.");
  }, [pushToast]);

  const view = useMemo(() => derive(data), [data]);
  const value = useMemo<CohortContextValue>(
    () => ({
      ...view,
      ready,
      burst,
      levelUp,
      toasts,
      dismissToast,
      dismissLevelUp,
      addReferral,
      acceptInvite,
      submitChallenge,
      reviewSubmission,
      claimTicket,
      completeStage,
      apply,
      reset,
    }),
    [
      view,
      ready,
      burst,
      levelUp,
      toasts,
      dismissToast,
      dismissLevelUp,
      addReferral,
      acceptInvite,
      submitChallenge,
      reviewSubmission,
      claimTicket,
      completeStage,
      apply,
      reset,
    ],
  );

  return <CohortContext.Provider value={value}>{children}</CohortContext.Provider>;
}

export function useCohort() {
  const value = useContext(CohortContext);
  if (!value) throw new Error("useCohort must be used inside CohortProvider");
  return value;
}
