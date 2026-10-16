"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn, formatPoints } from "@/lib/format";

export const primaryClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-400 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(168,85,247,0.38)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100";

export const ghostClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40";

export function PageHeader({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <header className="max-w-2xl">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-fuchsia-200/80 uppercase">{kicker}</p>
      <h1 className="mt-2 font-display text-[2.4rem] leading-[1.02] tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-mist sm:text-lg">{lede}</p>
    </header>
  );
}

export function SectionTitle({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl tracking-tight">{title}</h2>
      {aside}
    </div>
  );
}

export function LevelRing({
  progress,
  initials,
  size = 148,
}: {
  progress: number;
  initials: string;
  size?: number;
}) {
  const raw = useId();
  const id = `ring-${raw.replace(/:/g, "")}`;
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const reduce = useReducedMotion();
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-5 rounded-full bg-fuchsia-500/30 blur-2xl" />
      <svg viewBox="0 0 148 148" className="relative h-full w-full -rotate-90">
        <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <motion.circle
          cx="74"
          cy="74"
          r={radius}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={false}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={reduce ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0abfc" />
            <stop offset="55%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[16%] grid place-items-center rounded-full bg-gradient-to-br from-fuchsia-300 via-violet-600 to-[#2e1065] font-display text-3xl text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.28)]">
        {initials}
      </div>
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open ? <ModalBody title={title} onClose={onClose}>{children}</ModalBody> : null}
    </AnimatePresence>
  );
}

function ModalBody({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <motion.button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-[#05020c]/75 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="glass relative z-10 max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] p-5 sm:max-w-xl sm:rounded-[28px] sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight">{title}</h2>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sm text-mist hover:bg-white/10">
            Close
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export function CountUp({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const start = from.current;
    const delta = value - start;
    if (delta === 0) return;
    const began = performance.now();
    let frame = 0;
    let latest = start;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - began) / 780);
      const eased = 1 - (1 - progress) ** 3;
      latest = Math.round(start + delta * eased);
      setShown(latest);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      from.current = latest;
    };
  }, [reduce, value]);

  return <>{formatPoints(reduce ? value : shown)}</>;
}

export function chipClass(active: boolean) {
  return cn(
    "min-h-10 rounded-full px-3.5 text-sm font-medium transition",
    active ? "bg-white text-[#2e1065]" : "bg-white/5 text-mist hover:bg-white/10",
  );
}
