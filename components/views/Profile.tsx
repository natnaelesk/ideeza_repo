"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Icon } from "@/components/icons";
import { CountUp, LevelRing, PageHeader, SectionTitle, ghostClass, primaryClass } from "@/components/ui";
import { formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";

export function ProfileView() {
  const cohort = useCohort();
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function copy() {
    const value = `${window.location.origin}${cohort.profile.path}`;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-12">
      <PageHeader
        kicker="Profile"
        title={cohort.profile.name}
        lede={`${cohort.profile.role} · ${cohort.profile.campus}. Your points, badges, and referral link stay in this browser.`}
      />

      <section className="glass grid items-center gap-6 rounded-[32px] p-5 sm:grid-cols-[auto_1fr] sm:p-7">
        <LevelRing progress={cohort.level.progress} initials={cohort.profile.initials} size={132} />
        <div>
          <p className="text-sm text-fuchsia-100">@{cohort.profile.handle}</p>
          <h2 className="mt-1 font-display text-4xl">{cohort.level.level.name}</h2>
          <p className="mt-1 text-sm text-mist">
            {cohort.profile.city}
            {cohort.level.next ? ` · ${formatPoints(cohort.level.next.points - cohort.points)} points to ${cohort.level.next.name}` : " · Inner Circle"}
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Points" value={<CountUp value={cohort.points} />} />
            <Stat label="Referrals" value={<CountUp value={cohort.referrals} />} />
            <Stat label="Badges" value={`${cohort.badges.filter((badge) => badge.unlocked).length}/${cohort.badges.length}`} />
          </dl>
        </div>
      </section>

      <section>
        <SectionTitle title="Referral link" />
        <div className="glass rounded-[28px] p-5">
          <p className="text-sm leading-relaxed text-mist">
            Copy builds a full link from this path. Each accepted invite adds {formatPoints(50)} points and ticks the referral count. Referral mission cards pay extra when approved.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input readOnly value={cohort.profile.path} aria-label="Referral link" className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 font-mono text-sm" />
            <button type="button" onClick={copy} className={primaryClass}>
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={cohort.addReferral} className={ghostClass}>
              Add a demo referral
            </button>
            <Link href={cohort.profile.path} className={ghostClass}>
              Open invite page
            </Link>
          </div>
          <p className="mt-4 text-sm text-mist">
            Card points {formatPoints(cohort.breakdown.cards)} · referral points {formatPoints(cohort.breakdown.referrals)} · profile total {formatPoints(cohort.points)}
          </p>
        </div>
      </section>

      <section>
        <SectionTitle title="Badges" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {cohort.badges.map((badge) => (
            <li key={badge.id} className={`rounded-3xl border p-4 ${badge.unlocked ? "border-fuchsia-300/30 bg-fuchsia-500/10" : "border-white/10 bg-white/[0.03] opacity-70"}`}>
              <span className={`grid h-10 w-10 place-items-center rounded-2xl ${badge.unlocked ? "bg-white text-[#2e1065]" : "bg-white/10 text-mist"}`}>
                <Icon name={badge.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-display text-xl">{badge.name}</h3>
              <p className="mt-1 text-sm text-mist">{badge.unlocked ? "Unlocked" : badge.hint}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-white/10 p-5">
        <h2 className="font-display text-xl">Reset the demo</h2>
        <p className="mt-2 text-sm text-mist">Clears this browser back to Selam&apos;s opening scene: Maker, 2 referrals, one card waiting in History.</p>
        {confirmReset ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className={primaryClass}
              onClick={() => {
                cohort.reset();
                setConfirmReset(false);
              }}
            >
              Confirm reset
            </button>
            <button type="button" className={ghostClass} onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className={`${ghostClass} mt-4`} onClick={() => setConfirmReset(true)}>
            Reset demo data
          </button>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-black/25 px-3 py-3">
      <dt className="text-[10px] tracking-[0.16em] text-mist uppercase">{label}</dt>
      <dd className="mt-1 font-display text-2xl tabular-nums">{value}</dd>
    </div>
  );
}
