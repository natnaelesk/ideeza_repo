import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CopyLink } from "@/components/CopyLink";
import { Avatar, CoinLine, DemoPill } from "@/components/ui";
import { PROFILE, formatCoins, tierFor, you } from "@/lib/data";

export const metadata: Metadata = {
  title: "Profile",
  description: "Sample IDEEZA builder profile with tier, coins, and a referral link.",
};

export default function ProfilePage() {
  const person = you();
  const tier = tierFor(person.coins);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <DemoPill />

      <section className="card p-5">
        <div className="flex items-center gap-4">
          <Avatar initials={person.initials} tone={person.tone} className="h-20 w-20 text-2xl" />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{person.name}</h1>
            <p className="mt-0.5 text-sm text-mist">
              {person.club} · {person.country}
            </p>
            <p className="mt-2">
              <span className="inline-flex rounded-full bg-gradient-to-r from-[#4b17c9] to-[#7b3bff] px-3 py-1 text-sm font-semibold text-white">{tier.name}</span>
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-mist">Builder 0–99 · Ambassador 100–299 · Lead Builder 300+. This sample profile is {tier.name}.</p>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-extrabold">Achievements</h2>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Coins total" value={<CoinLine>{formatCoins(person.coins)}</CoinLine>} />
          <Stat label="Referrals" value={String(PROFILE.referrals)} />
          <Stat label="Challenges completed" value={String(PROFILE.challengesDone)} />
          <Stat label="Mints" value={String(PROFILE.mints)} />
        </dl>
        <h3 className="mt-5 text-sm font-bold text-mist">Badges</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {PROFILE.badges.map((badge) => (
            <li key={badge} className="rounded-full bg-[#efe8ff] px-3 py-1 text-xs font-bold text-[#4b17c9]">
              {badge}
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5">
        <h2 className="text-lg font-extrabold">Referral link</h2>
        <p className="mt-1 text-sm text-mist">Friends use this to join the waitlist. In this demo, opening it brings you back to this profile.</p>
        <CopyLink path={PROFILE.referralPath} />
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#f4eeff] px-3 py-3">
      <dt className="text-[11px] font-semibold tracking-wide text-mist uppercase">{label}</dt>
      <dd className="mt-1 text-xl font-extrabold">{value}</dd>
    </div>
  );
}
