"use client";

import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Modal, PageHeader, SectionTitle, primaryClass } from "@/components/ui";
import { CATEGORIES } from "@/lib/catalog";
import { formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";
import type { IconName } from "@/lib/types";

const ICONS: Record<string, IconName> = {
  refer: "users",
  build: "cpu",
  bug: "bug",
  show: "pin",
};

export function PointsView() {
  const cohort = useCohort();
  const [giftId, setGiftId] = useState<string | null>(null);
  const gift = cohort.tickets.find((ticket) => ticket.id === giftId) ?? null;
  const max = cohort.leaderboard[0]?.points ?? 1;

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Points system"
        title="Earn it. Then take the gift."
        lede="Four ways in: Refer, Build, Bug, and Show up. Golden Tickets redeem for platform access, design credits, and printed IDEEZA hardware. Rewards are gifts only. There is no cash."
      />

      <section>
        <SectionTitle title="Four ways to earn" />
        <div className="grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((category) => {
            const range = cohort.ranges[category.id];
            const headline = category.id === "refer" ? "50" : formatPoints(range.max);
            return (
              <Link
                key={category.id}
                href={`/challenges#${category.id}`}
                className="glass group rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:border-fuchsia-300/40"
              >
                <span className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
                    <Icon name={ICONS[category.id]} className="h-5 w-5" />
                  </span>
                  <span className="font-display text-3xl tabular-nums">{headline}</span>
                </span>
                <span className="mt-4 block font-display text-2xl">{category.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-mist">{category.line}</span>
                <span className="mt-3 block text-sm text-white/80">
                  {category.id === "refer"
                    ? `+50 when a link is accepted, plus ${formatPoints(range.min)}–${formatPoints(range.max)} on a referral card.`
                    : `Cards pay ${formatPoints(range.min)}–${formatPoints(range.max)} when a submission is approved.`}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle title="Golden Tickets" aside={<span className="text-sm text-mist">Redeem once you clear the line</span>} />
        <div className="grid gap-3 lg:grid-cols-2">
          {cohort.tickets.map((ticket) => (
            <article key={ticket.id} className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent">
              <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-amber-100/90 uppercase">Golden Ticket</p>
                  <h3 className="mt-1 font-display text-2xl">{ticket.name}</h3>
                  <p className="mt-2 text-sm text-white">{ticket.reward}</p>
                  <p className="mt-1 text-sm text-mist">{ticket.detail}</p>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-dashed border-white/20 pt-4 sm:w-36 sm:flex-col sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <p className="font-display text-2xl tabular-nums">{formatPoints(ticket.points)}</p>
                  <button
                    type="button"
                    className={primaryClass}
                    disabled={ticket.claimed || !ticket.ready}
                    onClick={() => {
                      if (cohort.claimTicket(ticket.id)) setGiftId(ticket.id);
                    }}
                  >
                    {ticket.claimed ? "Gift ready" : ticket.ready ? "Redeem" : "Locked"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="Leaderboard" aside={<span className="text-sm text-mist">Lifetime points, this device</span>} />
        <LayoutGroup>
          <ol className="space-y-2">
            {cohort.leaderboard.map((row) => (
              <LeaderRow key={row.id} row={row} max={max} />
            ))}
          </ol>
        </LayoutGroup>
      </section>

      <Modal open={Boolean(gift)} title={gift ? gift.name : "Gift"} onClose={() => setGiftId(null)}>
        {gift ? (
          <div>
            <p className="text-sm leading-relaxed text-mist">
              {gift.reward}. This is a gift held for you in the demo. Platform access, credits, or printed hardware — never a cash transfer.
            </p>
            <button type="button" className={`${primaryClass} mt-6`} onClick={() => setGiftId(null)}>
              Keep it
            </button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function LeaderRow({
  row,
  max,
}: {
  row: { id: string; name: string; campus: string; points: number; rank: number; you: boolean };
  max: number;
}) {
  const reduce = useReducedMotion();
  const previous = useRef(row.rank);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const change = previous.current - row.rank;
    previous.current = row.rank;
    if (change === 0) return;
    setDelta(change);
    const timer = window.setTimeout(() => setDelta(0), 1600);
    return () => window.clearTimeout(timer);
  }, [row.rank]);

  const initials = row.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <motion.li
      layout
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
      className={`relative overflow-hidden rounded-2xl border px-3 py-3 ${row.you ? "border-fuchsia-300/50 bg-fuchsia-500/10" : "border-white/10 bg-white/[0.03]"}`}
    >
      <motion.span
        className="absolute inset-y-0 left-0 bg-violet-400/15"
        initial={false}
        animate={{ width: `${Math.max(8, (row.points / max) * 100)}%` }}
        transition={reduce ? { duration: 0 } : { duration: 0.6 }}
      />
      <span className="relative flex items-center gap-3">
        <span className="w-6 text-center text-sm text-mist tabular-nums">{row.rank}</span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-violet-800 text-xs font-semibold">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold">
            {row.name}
            {row.you ? " · you" : ""}
          </span>
          <span className="block truncate text-xs text-mist">{row.campus}</span>
        </span>
        {row.you && delta > 0 ? <span className="text-xs font-semibold text-emerald-300">▲{delta}</span> : null}
        <span className="font-display text-lg tabular-nums">{formatPoints(row.points)}</span>
      </span>
    </motion.li>
  );
}
