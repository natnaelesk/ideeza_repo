"use client";

import { NextStep, primaryClass } from "@/components/ui";
import { PROFILE, REFERRAL_POINTS } from "@/lib/catalog";
import { formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";

export function JoinView() {
  const cohort = useCohort();

  return (
    <div className="mx-auto max-w-xl py-6">
      <p className="text-base leading-snug text-ink sm:text-lg">Accepting this invite gives {PROFILE.name} {formatPoints(REFERRAL_POINTS)} referral points on this device.</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95]">Join with Selam&apos;s link.</h1>
      <div className="glass mt-8 rounded-[28px] p-6">
        <p className="text-xs tracking-[0.16em] text-mist uppercase">Code</p>
        <p className="mt-1 font-display text-3xl">{PROFILE.code}</p>
        <p className="mt-4 text-sm text-mist">Builders Cohort · gifts of access, credits, and printed hardware.</p>
        {cohort.inviteAccepted ? (
          <p className="mt-6 text-sm font-medium text-emerald-700">Already counted on this device. Her referral total includes you.</p>
        ) : (
          <button type="button" className={`${primaryClass} mt-6`} disabled={!cohort.ready} onClick={() => cohort.acceptInvite()}>
            Accept invite on this device
          </button>
        )}
      </div>
      <div className="mt-4">
        <NextStep href="/profile" label="See the profile total" />
      </div>
    </div>
  );
}
