"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { LevelRing, NextStep, SectionTitle } from "@/components/ui";
import { formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";

export function RoadmapView() {
  const cohort = useCohort();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(cohort.level.level.id);
  const fill = (cohort.level.index + cohort.level.progress) / (cohort.levels.length - 1);

  const steps = [
    { href: "/join/selam-7k", label: "Join" },
    { href: "/challenges", label: "Do challenges" },
    { href: "/points", label: "Earn points" },
    { href: "/profile", label: "Refer friends" },
    { href: "/internship", label: "Unlock rewards & internship" },
  ];

  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-base leading-snug text-ink sm:text-lg">
        Builders join, do challenge cards, earn points, refer friends, and unlock gifts plus an internship.
      </p>
      <section className="grid items-center gap-8 lg:grid-cols-[1.3fr_auto]">
        <div>
          <h1 className="max-w-xl font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">Ambassador roadmap</h1>
        </div>
        <div className="glass flex items-center gap-5 rounded-[28px] p-5">
          <LevelRing progress={cohort.level.progress} initials={cohort.profile.initials} />
          <div>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#6a2ff0] uppercase">You are here</p>
            <p className="mt-1 font-display text-3xl">{cohort.level.level.name}</p>
            <p className="mt-1 text-sm text-mist">{formatPoints(cohort.points)} points</p>
            {cohort.level.next ? (
              <p className="mt-2 text-sm text-mist">
                {formatPoints(cohort.level.next.points - cohort.points)} to {cohort.level.next.name}
              </p>
            ) : (
              <p className="mt-2 text-sm text-mist">Top of the cohort path.</p>
            )}
          </div>
        </div>
      </section>

      <section aria-label="How it works">
        <h2 className="mb-3 font-display text-2xl">How it works</h2>
        <ol className="flex gap-2 overflow-x-auto pb-1">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-2">
              <Link href={step.href} className="glass block min-w-[10.5rem] rounded-2xl px-3 py-3 transition hover:border-[#6a2ff059]">
                <span className="text-[11px] font-semibold text-[#6a2ff0]">Step {index + 1}</span>
                <span className="mt-1 block text-sm font-semibold leading-snug">{step.label}</span>
              </Link>
              {index < steps.length - 1 ? (
                <span className="text-lg text-[#6a2ff0]" aria-hidden>
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </section>

      {cohort.spotlight ? (
        <NextStep href="/history" label={`Approve ${cohort.spotlight.challenge.title}`} />
      ) : (
        <NextStep href="/challenges" label="Do a challenge" />
      )}

      <section>
        <SectionTitle title="The journey" aside={<span className="text-sm text-mist">{cohort.badges.filter((badge) => badge.unlocked).length} badges lit</span>} />
        <ol className="relative space-y-4 pl-0">
          <div className="absolute top-6 bottom-6 left-6 w-px bg-[#6a2ff026]" aria-hidden>
            <motion.div
              className="w-full origin-top bg-gradient-to-b from-[#8b45ff] to-[#4b17c9]"
              initial={false}
              animate={{ height: `${Math.min(100, fill * 100)}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.7 }}
            />
          </div>
          {cohort.levels.map((level, index) => {
            const expanded = open === level.id;
            return (
              <li key={level.id} className="relative grid grid-cols-[3rem_1fr] gap-3">
                <div
                  className={`relative z-10 grid h-12 w-12 place-items-center rounded-full border text-sm font-semibold ${
                    level.current
                      ? "border-[#6a2ff0] bg-[#efe8ff] text-[#4b17c9] shadow-[0_8px_24px_#6a2ff040]"
                      : level.unlocked
                        ? "border-[#6a2ff040] bg-white text-[#4b17c9]"
                        : "border-[#6a2ff01a] bg-[#f7f3ff] text-mist"
                  }`}
                >
                  {level.unlocked ? <Icon name="check" className="h-5 w-5" /> : index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? "" : level.id)}
                  className="glass rounded-3xl p-4 text-left sm:p-5"
                  aria-expanded={expanded}
                >
                  <span className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-2xl">{level.name}</span>
                    <span className="rounded-full bg-[#efe8ff] px-2.5 py-1 text-xs font-medium text-mist">{formatPoints(level.points)} pts</span>
                  </span>
                  <span className="mt-1 block text-sm text-mist">{level.summary}</span>
                  <AnimatePresence initial={false}>
                    {expanded ? (
                      <motion.span
                        initial={reduce ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="block overflow-hidden"
                      >
                        <span className="mt-3 block border-t border-[#6a2ff01f] pt-3 text-sm leading-relaxed text-ink">
                          {level.detail} Badge: {level.badge}.
                        </span>
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <section>
        <SectionTitle title="Milestones" aside={<span className="text-sm text-mist">Unlock by doing the work</span>} />
        <div className="flex gap-3 overflow-x-auto pb-2">
          {cohort.milestones.map((item) => (
            <motion.article
              key={item.id}
              initial={false}
              animate={item.unlocked ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 0 }}
              className={`min-w-[11.5rem] rounded-3xl border p-4 ${item.unlocked ? "border-[#6a2ff040] bg-[#f4eeff]" : "border-[#6a2ff01a] bg-white/80"}`}
            >
              <p className="text-[10px] font-semibold tracking-[0.16em] text-[#6a2ff0] uppercase">{item.unlocked ? "Unlocked" : "Locked"}</p>
              <h3 className="mt-2 font-display text-xl leading-tight">{item.label}</h3>
              <p className="mt-2 text-sm text-mist">{item.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
