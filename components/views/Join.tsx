"use client";

import Link from "next/link";
import { primaryClass } from "@/components/ui";
import { PROFILE, REFERRAL_POINTS } from "@/lib/catalog";
import { formatPoints } from "@/lib/format";
import { useCohort } from "@/lib/store";

export function JoinView() {
  const cohort = useCohort();

  return (
    <div className="mx-auto max-w-xl py-6">
      <p className="text-[11px] font-semibold tracking-[0.22em] text-fuchsia-200/80 uppercase">Cohort invite</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95]">Selam saved you a seat.</h1>
      <p className="mt-4 text-base leading-relaxed text-mist">
        {PROFILE.name} is building with IDEEZA in Addis. Accepting this invite on this device adds {formatPoints(REFERRAL_POINTS)} points to her profile. No account is created.
      </p>
      <div className="glass mt-8 rounded-[28px] p-6">
        <p className="text-xs tracking-[0.16em] text-mist uppercase">Code</p>
        <p className="mt-1 font-display text-3xl">{PROFILE.code}</p>
        <p className="mt-4 text-sm text-mist">Builders Cohort · gifts of access, credits, and printed hardware.</p>
        {cohort.inviteAccepted ? (
          <p className="mt-6 text-sm text-emerald-200">Already counted on this device. Her referral total includes you.</p>
        ) : (
          <button type="button" className={`${primaryClass} mt-6`} disabled={!cohort.ready} onClick={() => cohort.acceptInvite()}>
            Accept invite on this device
          </button>
        )}
        <Link href="/profile" className="mt-4 block text-sm font-semibold text-fuchsia-200">
          See the profile total
        </Link>
      </div>
    </div>
  );
}
