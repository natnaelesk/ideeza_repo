"use client";

import Link from "next/link";
import { useState } from "react";
import { CountUp, NextStep, PageHeader, chipClass } from "@/components/ui";
import { RARITY_META } from "@/lib/catalog";
import { cn, formatPoints, formatWhen } from "@/lib/format";
import { useCohort } from "@/lib/store";
import type { SubmissionStatus } from "@/lib/types";

type Filter = "all" | SubmissionStatus;

const STATUS: Record<SubmissionStatus, string> = {
  pending: "bg-amber-200/15 text-amber-100",
  approved: "bg-emerald-300/15 text-emerald-200",
  rejected: "bg-rose-300/15 text-rose-100",
};

export function HistoryView() {
  const cohort = useCohort();
  const [filter, setFilter] = useState<Filter>("all");
  const [demo, setDemo] = useState(true);
  const rows = cohort.submissions.filter((item) => (filter === "all" ? true : item.status === filter));
  const pending = cohort.spotlight;

  return (
    <div className="space-y-8">
      <PageHeader explain="Approve a submission to add its points. Reject it and the card goes back." title="History" />
      {pending ? (
        <NextStep label={`Approve ${pending.challenge.title}`} onClick={() => cohort.reviewSubmission(pending.id, "approved")} />
      ) : (
        <NextStep href="/challenges" label="Do another challenge" />
      )}
      <div className="glass flex flex-col gap-4 rounded-[28px] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-fuchsia-200 uppercase">Profile total</p>
          <p className="font-display text-4xl tabular-nums">
            <CountUp value={cohort.points} />
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold">Demo review</p>
            <p className="text-xs text-mist">Simulate approve or reject.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={demo}
            onClick={() => setDemo((value) => !value)}
            className={cn("relative h-8 w-14 rounded-full p-1 transition", demo ? "bg-fuchsia-500" : "bg-white/15")}
          >
            <span className={cn("block h-6 w-6 rounded-full bg-white transition", demo && "translate-x-6")} />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "approved", "rejected"] as const).map((item) => (
          <button key={item} type="button" className={chipClass(filter === item)} onClick={() => setFilter(item)}>
            {item === "all" ? "All" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <p className="rounded-3xl border border-white/10 p-6 text-sm text-mist">Nothing in this filter.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((item) => (
            <li key={item.id} className="glass rounded-[28px] p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] uppercase", RARITY_META[item.challenge.rarity].chip)}>
                    {RARITY_META[item.challenge.rarity].label} · {item.challenge.category}
                  </p>
                  <h2 className="mt-2 font-display text-2xl">{item.challenge.title}</h2>
                </div>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", STATUS[item.status])}>{item.status}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/90">{item.note}</p>
              <p className="mt-2 truncate font-mono text-xs text-mist">{item.link}</p>
              <p className="mt-2 text-xs text-mist">
                Sent {formatWhen(item.submittedAt)}
                {item.resolvedAt ? ` · reviewed ${formatWhen(item.resolvedAt)}` : ""}
              </p>
              {item.response ? <p className="mt-2 text-sm text-mist">{item.response}</p> : null}
              {item.status === "approved" ? (
                <p className="mt-3 font-display text-xl text-emerald-300">+{formatPoints(item.challenge.points)} on your total</p>
              ) : null}
              {item.status === "rejected" ? (
                <Link href="/challenges" className="mt-3 inline-flex text-sm font-semibold text-fuchsia-200">
                  Card is back on Challenges
                </Link>
              ) : null}
              {item.status === "pending" && demo ? (
                <div className="mt-4 inline-flex rounded-full bg-black/40 p-1" role="group" aria-label={`Demo review for ${item.challenge.title}`}>
                  <button type="button" className="min-h-10 rounded-full bg-emerald-300/20 px-4 text-sm font-semibold text-emerald-100" onClick={() => cohort.reviewSubmission(item.id, "approved")}>
                    Approve +{formatPoints(item.challenge.points)}
                  </button>
                  <button type="button" className="min-h-10 rounded-full px-4 text-sm font-semibold text-rose-100" onClick={() => cohort.reviewSubmission(item.id, "rejected")}>
                    Reject
                  </button>
                </div>
              ) : null}
              {item.status === "pending" && !demo ? <p className="mt-3 text-sm text-mist">Turn on demo review to resolve this.</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
