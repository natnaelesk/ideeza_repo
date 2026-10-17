import type { Metadata } from "next";
import { ChallengeArt } from "@/components/ChallengeArt";
import { CoinLine, DemoPill } from "@/components/ui";
import { CHALLENGES, formatCoins } from "@/lib/data";

export const metadata: Metadata = {
  title: "Challenges",
  description: "Sample Build The Future challenges and the coins each one pays.",
};

export default function ChallengesPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-2xl">
        <DemoPill />
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Challenges</h1>
        <p className="mt-2 text-base text-mist">Campaign cards for Build The Future. Post the work, earn the coins. Sample rewards only.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHALLENGES.map((challenge) => (
          <li key={challenge.id} id={challenge.id} className="card scroll-mt-24 overflow-hidden">
            <ChallengeArt art={challenge.art} label={challenge.title} />
            <div className="p-4">
              <h2 className="text-lg font-extrabold leading-tight">{challenge.title}</h2>
              <p className="mt-1 text-sm leading-snug text-mist">{challenge.description}</p>
              <p className="mt-4 border-t border-[#6a2ff014] pt-3 text-sm">
                <CoinLine>{formatCoins(challenge.coins)} coins</CoinLine>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
