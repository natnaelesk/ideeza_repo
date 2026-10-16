"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Confetti } from "@/components/Confetti";
import { Mark } from "@/components/icons";
import { CountUp } from "@/components/ui";
import { cn, formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";

const NAV = [
  { href: "/", label: "Roadmap" },
  { href: "/points", label: "Points" },
  { href: "/challenges", label: "Challenges" },
  { href: "/internship", label: "Internship" },
  { href: "/history", label: "History" },
  { href: "/profile", label: "Profile" },
];

function active(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { points, burst, toasts, dismissToast, levelUp, dismissLevelUp } = useCohort();

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="grid-fade" />
      </div>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-[#2e1065]">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#09040f]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Mark className="h-8 w-8" />
            <span className="font-display text-sm tracking-[0.22em]">IDEEZA</span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              const on = active(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("relative rounded-full px-3 py-2 text-sm", on ? "text-white" : "text-mist hover:text-white")}
                  aria-current={on ? "page" : undefined}
                >
                  {on ? (
                    <motion.span layoutId="nav-desktop" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <Link href="/profile" className="relative ml-auto rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-right" aria-label="Your points">
            <span className="block text-[10px] tracking-[0.16em] text-fuchsia-100/80 uppercase">Points</span>
            <span className="block font-display text-lg leading-none tabular-nums">
              <CountUp value={points} />
            </span>
            <AnimatePresence>
              {burst ? (
                <motion.span
                  key={burst.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: -6 }}
                  exit={{ opacity: 0, y: -18 }}
                  className="absolute -top-3 right-2 font-display text-sm text-emerald-300"
                >
                  +{formatPoints(burst.amount)}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </Link>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-28 md:px-6 md:pb-16">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#09040f]/90 backdrop-blur-xl md:hidden" aria-label="Mobile">
        <ul className="grid grid-cols-6 pb-[max(0.4rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const on = active(pathname, item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} className={cn("flex min-h-14 flex-col items-center justify-center gap-1 text-[10px]", on ? "text-white" : "text-mist")} aria-current={on ? "page" : undefined}>
                  <span className={cn("h-1.5 w-1.5 rounded-full", on ? "bg-fuchsia-300" : "bg-transparent")} />
                  {item.label === "Challenges" ? "Cards" : item.label === "Internship" ? "Intern" : item.label === "Roadmap" ? "Path" : item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.button
              key={toast.id}
              type="button"
              onClick={() => dismissToast(toast.id)}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass pointer-events-auto w-full max-w-sm rounded-2xl px-4 py-3 text-left"
            >
              <span className="block text-sm font-semibold">{toast.title}</span>
              <span className="mt-0.5 block text-sm text-mist">{toast.body}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <LevelUp open={Boolean(levelUp)} name={levelUp?.name ?? ""} detail={levelUp?.detail ?? ""} onClose={dismissLevelUp} />
    </>
  );
}

function LevelUp({ open, name, detail, onClose }: { open: boolean; name: string; detail: string; onClose: () => void }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[55] grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Level up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Confetti fire={1} />
          <button type="button" className="absolute inset-0 bg-[#05020c]/70 backdrop-blur-md" aria-label="Dismiss level up" onClick={onClose} />
          <motion.div
            initial={reduce ? false : { scale: 0.92, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass relative w-full max-w-md rounded-[28px] p-6 text-center"
          >
            <p className="text-[11px] font-semibold tracking-[0.22em] text-fuchsia-200 uppercase">Level up</p>
            <h2 className="mt-2 font-display text-4xl">{name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">{detail}</p>
            <button type="button" onClick={onClose} className="mt-6 min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-[#2e1065]">
              Keep building
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
