"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn, formatPoints } from "@/lib/format";

export const primaryClass = "btn-primary";

export const ghostClass = "btn-ghost";

export const fieldClass = "field mt-1 min-h-12 px-4 text-base";

export function PageHeader({ explain, title }: { explain: string; title: string }) {
  return (
    <header className="max-w-2xl">
      <p className="text-base leading-snug text-ink sm:text-lg">{explain}</p>
      <h1 className="mt-3 font-display text-[2.4rem] leading-[1.02] tracking-tight sm:text-5xl">{title}</h1>
    </header>
  );
}

export function NextStep({ href, label, onClick }: { href?: string; label: string; onClick?: () => void }) {
  const className = `${primaryClass} w-full sm:w-auto`;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#6a2ff033] bg-[#f4eeff] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[#4b17c9]">Next step</p>
      {href ? (
        <Link href={href} className={className}>
          {label}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={className}>
          {label}
        </button>
      )}
    </div>
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
      <div className="absolute inset-5 rounded-full bg-[#cbb6ff]/50 blur-2xl" />
      <svg viewBox="0 0 148 148" className="relative h-full w-full -rotate-90">
        <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(106,47,240,0.16)" strokeWidth="8" />
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
            <stop offset="0%" stopColor="#8b45ff" />
            <stop offset="55%" stopColor="#6a2ff0" />
            <stop offset="100%" stopColor="#4b17c9" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-[16%] grid place-items-center rounded-full bg-gradient-to-br from-[#7b3bff] to-[#4b17c9] font-display text-3xl text-white shadow-[inset_0_0_24px_rgba(255,255,255,0.35)]">
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
        className="absolute inset-0 bg-[#1c0f45]/45 backdrop-blur-md"
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
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[#6a2ff033] bg-white text-sm text-mist hover:bg-[#f4eeff]">
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
    "min-h-10 rounded-full border border-transparent px-3.5 text-sm font-medium transition",
    active ? "bg-gradient-to-br from-[#2a1170] to-[#6a2ff0] text-white shadow-[0_8px_20px_#5a1edc33]" : "border border-[#6a2ff026] bg-white text-mist hover:border-[#6a2ff059]",
  );
}
