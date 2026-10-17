import Link from "next/link";
import type { Metadata } from "next";
import { Brand, Icon } from "@/components/icons";
import { ThumbArt } from "@/components/Thumbs";
import { Avatar, CoinLine, DemoPill } from "@/components/ui";
import { platformColor } from "@/components/ChallengeArt";
import { PEOPLE, POSTS, challengeById, formatCoins, formatCount, personById } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home",
  description: "Demo leaderboard and posts for the IDEEZA Build The Future campaign.",
};

const PODIUM = [
  { place: 2 as const, label: "2nd" },
  { place: 1 as const, label: "1st" },
  { place: 3 as const, label: "3rd" },
];

const PLACE_STYLE = {
  1: "min-h-[13.5rem] ring-2 ring-[#f5c451]",
  2: "min-h-[11.5rem] ring-2 ring-[#d9deee]",
  3: "min-h-[10.5rem] ring-2 ring-[#e7b089]",
};

const BADGE = {
  1: "bg-[#f6c445] text-[#5c3d00]",
  2: "bg-[#e7ebf5] text-[#3d4663]",
  3: "bg-[#f3d2b5] text-[#6b3d16]",
};

export default function HomePage() {
  const top = PEOPLE.slice(0, 3);
  const rest = PEOPLE.slice(3);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <DemoPill />
        <p className="mt-3 text-sm font-semibold text-[#6a2ff0]">Build The Future</p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Leaderboard</h1>
        <p className="mt-2 text-base text-mist">Sample builders and posts for the IDEEZA walkthrough. Nothing here is live.</p>
      </header>

      <section aria-label="Top 3">
        <ol className="grid grid-cols-3 items-end gap-2 sm:gap-3">
          {PODIUM.map(({ place, label }) => {
            const person = top[place - 1];
            return (
              <li key={person.id} className={`card flex flex-col items-center px-2 py-4 text-center ${PLACE_STYLE[place]}`}>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${BADGE[place]}`}>{label}</span>
                <Avatar initials={person.initials} tone={person.tone} className={place === 1 ? "mt-3 h-16 w-16 text-lg" : "mt-3 h-12 w-12 text-sm"} />
                <p className="mt-2 line-clamp-2 text-sm font-extrabold leading-tight">{person.name}</p>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-mist">
                  {person.club}
                  <span className="block">{person.country}</span>
                </p>
                <p className="mt-2">
                  <CoinLine>{formatCoins(person.coins)}</CoinLine>
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-label="Rest of the board">
        <h2 className="mb-3 text-sm font-bold text-mist">Rest of the board</h2>
        <ol className="space-y-2">
          {rest.map((person, index) => (
            <li key={person.id} className={person.you ? "flex items-center gap-3 rounded-2xl border-2 border-[#6a2ff0] bg-[#f4eeff] px-3 py-3" : "card flex items-center gap-3 px-3 py-3"}>
              <span className="w-5 text-center text-sm font-bold text-mist">{index + 4}</span>
              <Avatar initials={person.initials} tone={person.tone} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold">
                  {person.name}
                  {person.you ? <span className="ml-2 rounded-full bg-[#6a2ff0] px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">You</span> : null}
                </span>
                <span className="block truncate text-xs text-mist">
                  {person.club} · {person.country}
                </span>
              </span>
              <CoinLine>{formatCoins(person.coins)}</CoinLine>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold tracking-tight">Posts from the leaders</h2>
        <p className="text-sm text-mist">What the top builders shared. Each post links to its challenge.</p>
        <ul className="space-y-4">
          {POSTS.map((post) => {
            const person = personById(post.personId);
            const challenge = challengeById(post.challengeId);
            return (
              <li key={post.id} className="card overflow-hidden">
                <div className="flex items-center gap-3 px-4 pt-4">
                  <Avatar initials={person.initials} tone={person.tone} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{person.name}</p>
                    <Link href={`/challenges#${challenge.id}`} className="text-sm font-semibold text-[#6a2ff0]">
                      {challenge.title}
                    </Link>
                  </div>
                </div>
                <div className="relative mt-3 aspect-[16/9] bg-[#efe8ff]">
                  <ThumbArt name={post.thumb} />
                  <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-full bg-white shadow-[0_6px_16px_#1c0f4526]" style={{ color: platformColor(post.platform) }}>
                    <Brand name={post.platform} className="h-4 w-4" />
                    <span className="sr-only">{post.platform}</span>
                  </span>
                </div>
                <div className="px-4 py-4">
                  <p className="text-sm leading-relaxed text-ink">{post.caption}</p>
                  <p className="mt-3 flex items-center gap-4 text-xs font-semibold text-mist">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="heart" className="h-3.5 w-3.5" />
                      {formatCount(post.likes)} likes
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Icon name="eye" className="h-3.5 w-3.5" />
                      {formatCount(post.views)} views
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
