import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

const AVATAR = [
  ["#7b3bff", "#4b17c9"],
  ["#6a2ff0", "#2a1170"],
  ["#8b45ff", "#5b21b6"],
  ["#9b6dff", "#4c1d95"],
];

export function Avatar({ initials, tone, className }: { initials: string; tone: number; className?: string }) {
  const [from, to] = AVATAR[tone % AVATAR.length];
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-extrabold text-white ${className ?? "h-10 w-10 text-sm"}`}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {initials}
    </span>
  );
}

export function DemoPill() {
  return (
    <p className="inline-flex rounded-full bg-[#efe8ff] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#4b17c9] uppercase">
      Demo data
    </p>
  );
}

export function CoinLine({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-bold text-ink">
      <Icon name="coin" className="h-4 w-4 text-[#6a2ff0]" />
      {children}
    </span>
  );
}
