"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, RARITY_META } from "@/lib/catalog";
import { cn, formatPoints } from "@/lib/format";
import type { Category, Rarity } from "@/lib/types";
import { Schematic } from "@/components/Schematic";

export type CardModel = {
  id: string;
  title: string;
  category: Category;
  rarity: Rarity;
  points: number;
  seed: number;
  pitch: string;
  availability: "open" | "pending" | "approved";
};

function useTilt(reduce: boolean | null) {
  function tilt(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rx", `${(py - 0.5) * -10}deg`);
    event.currentTarget.style.setProperty("--ry", `${(px - 0.5) * 12}deg`);
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
  }

  function resetTilt(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return { tilt, resetTilt };
}

export function TradingCard({ card, onOpen }: { card: CardModel; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const { tilt, resetTilt } = useTilt(reduce);
  const [flipped, setFlipped] = useState(false);
  const meta = RARITY_META[card.rarity];
  const category = CATEGORIES.find((item) => item.id === card.category)?.label ?? card.category;
  const locked = card.availability !== "open";

  return (
    <div className="aspect-[3/4.15] [perspective:1100px]" onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div
        className="relative h-full transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
      >
        <motion.div
          className="relative h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={cn("card-face absolute inset-0", flipped && "pointer-events-none")}>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className={cn("pack-shell relative h-full w-full rounded-[1.15rem] p-[7px] text-left", `pack-${card.rarity}`, locked && "opacity-75")}
              aria-label={`${card.title}, ${meta.label} card, ${card.points} points. Flip for the task.`}
            >
              <span className={cn("relative flex h-full flex-col overflow-hidden rounded-[0.7rem] px-2.5 pt-2 pb-2", meta.frame)}>
                {meta.holo ? <span className={cn("pointer-events-none absolute inset-0", meta.holo)} /> : null}
                <span className="relative z-10 flex items-start justify-between gap-2">
                  <span className="font-display text-[1.15rem] leading-none tracking-tight">{card.title}</span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[9px] tracking-widest text-white/50 uppercase">Pts</span>
                    <span className="font-display text-lg leading-none">{formatPoints(card.points)}</span>
                  </span>
                </span>
                <span className="relative z-10 mt-2 min-h-0 flex-1 overflow-hidden rounded-lg border border-white/15 bg-black/30">
                  <Schematic seed={card.seed} />
                </span>
                <span className="relative z-10 mt-2 text-[10px] font-semibold tracking-[0.16em] text-fuchsia-100/80 uppercase">{category}</span>
                <span className="relative z-10 mt-1 line-clamp-2 text-xs leading-snug text-white/80">{card.pitch}</span>
                <span className="relative z-10 mt-2 flex items-center justify-between">
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase", meta.chip)}>{meta.label}</span>
                  <span className="text-sm tracking-widest text-amber-100" aria-hidden>
                    {meta.mark}
                  </span>
                </span>
                {locked ? (
                  <span className="absolute top-12 right-3 z-10 rounded-full bg-black/70 px-2 py-1 text-[10px] tracking-widest uppercase">{card.availability}</span>
                ) : null}
              </span>
            </button>
          </div>
          <div className={cn("card-face absolute inset-0 [transform:rotateY(180deg)]", !flipped && "pointer-events-none")}>
            <div className={cn("flex h-full flex-col rounded-[1.15rem] p-[7px]", `pack-${card.rarity}`)}>
              <div className="flex h-full flex-col rounded-[0.7rem] bg-[#120816] p-4">
                <p className="text-[10px] font-bold tracking-[0.16em] text-fuchsia-200 uppercase">
                  {meta.label} {meta.mark}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-none">{card.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">{card.pitch}</p>
                <p className="text-sm text-white">{formatPoints(card.points)} points when approved</p>
                <div className="mt-3 flex flex-col gap-2">
                  <button type="button" className="min-h-11 rounded-full bg-white text-sm font-semibold text-[#2e1065]" onClick={onOpen} disabled={locked}>
                    {locked ? card.availability : "Open challenge"}
                  </button>
                  <button type="button" className="min-h-11 rounded-full border border-white/15 text-sm text-mist" onClick={() => setFlipped(false)}>
                    Flip back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export function GoldenTicketCard() {
  const reduce = useReducedMotion();
  const { tilt, resetTilt } = useTilt(reduce);
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="aspect-[3/4.15] [perspective:1100px]" onPointerMove={tilt} onPointerLeave={resetTilt}>
      <div
        className="relative h-full transition-transform duration-150 ease-out [transform-style:preserve-3d]"
        style={{ transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}
      >
        <motion.div
          className="relative h-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={cn("card-face absolute inset-0", flipped && "pointer-events-none")}>
            <button type="button" onClick={() => setFlipped(true)} className="pack-golden relative h-full w-full rounded-[1.15rem] p-[7px] text-left" aria-label="Golden Ticket, super rare shiny card. Flip to read it.">
              <span className="relative flex h-full flex-col overflow-hidden rounded-[0.7rem] bg-[#1a1204] px-2.5 pt-2 pb-2">
                <span className="holo-shiny pointer-events-none absolute inset-0" />
                <span className="relative z-10 flex items-start justify-between">
                  <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold tracking-[0.14em] text-[#3b2604] uppercase">Shiny</span>
                  <span className="text-xs font-bold tracking-[0.18em] text-amber-100 uppercase">Super rare</span>
                </span>
                <span className="relative z-10 mt-3 grid flex-1 place-items-center rounded-lg border border-amber-200/40 bg-gradient-to-b from-amber-200/20 to-transparent">
                  <span className="text-center">
                    <span className="block text-3xl" aria-hidden>
                      ✦
                    </span>
                    <span className="mt-2 block font-display text-3xl leading-none text-amber-50">Golden Ticket</span>
                    <span className="mt-2 block text-xs tracking-[0.2em] text-amber-100/80 uppercase">Gift card</span>
                  </span>
                </span>
                <span className="relative z-10 mt-2 text-xs leading-snug text-amber-50">The jackpot pull. A gift, not a task.</span>
                <span className="relative z-10 mt-2 text-right text-sm tracking-[0.3em] text-amber-200" aria-hidden>
                  ✦ ✦ ✦
                </span>
              </span>
            </button>
          </div>
          <div className={cn("card-face absolute inset-0 [transform:rotateY(180deg)]", !flipped && "pointer-events-none")}>
            <div className="pack-golden flex h-full flex-col rounded-[1.15rem] p-[7px]">
              <div className="flex h-full flex-col rounded-[0.7rem] bg-[#1a1204] p-4">
                <p className="text-[10px] font-bold tracking-[0.16em] text-amber-200 uppercase">Shiny · Golden Ticket</p>
                <h3 className="mt-2 font-display text-2xl leading-none">Not a challenge</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-amber-50/90">
                  This is the rarest card in the pack. You unlock it with points, then redeem a gift: platform access, design credits, or printed IDEEZA hardware.
                </p>
                <Link href="/points" className="mt-3 grid min-h-11 place-items-center rounded-full bg-amber-200 text-sm font-semibold text-[#3b2604]">
                  See how to unlock it
                </Link>
                <button type="button" className="mt-2 min-h-11 rounded-full border border-amber-200/30 text-sm text-amber-100" onClick={() => setFlipped(false)}>
                  Flip back
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
