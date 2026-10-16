"use client";

import { motion, useReducedMotion } from "framer-motion";
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

export function TradingCard({ card, onOpen }: { card: CardModel; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const meta = RARITY_META[card.rarity];
  const category = CATEGORIES.find((item) => item.id === card.category)?.label ?? card.category;
  const locked = card.availability !== "open";

  function tilt(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rx", `${(py - 0.5) * -12}deg`);
    event.currentTarget.style.setProperty("--ry", `${(px - 0.5) * 14}deg`);
    event.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    event.currentTarget.style.setProperty("--my", `${py * 100}%`);
  }

  function resetTilt(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  }

  return (
    <div className="aspect-[3/4.2] [perspective:1100px]" onPointerMove={tilt} onPointerLeave={resetTilt}>
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
              className={cn("relative h-full w-full overflow-hidden rounded-[28px] p-[2px] text-left", locked && "opacity-80")}
              aria-label={`${card.title}, ${meta.label}, ${card.points} points. Flip for the brief.`}
            >
              <span
                className={cn("absolute inset-[-60%]", meta.spin && "motion-safe:animate-spin [animation-duration:9s]")}
                style={{ background: meta.foil }}
              />
              <span className="relative flex h-full flex-col overflow-hidden rounded-[26px] bg-[#140818]">
                <span
                  className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
                  style={{
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.55), transparent 36%)",
                  }}
                />
                <span className="relative z-10 flex items-center justify-between px-4 pt-4">
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase", meta.chip)}>
                    {meta.label}
                  </span>
                  <span className="font-display text-lg text-white">{formatPoints(card.points)}</span>
                </span>
                <span className="relative z-10 mx-3 mt-3 min-h-0 flex-1">
                  <Schematic seed={card.seed} />
                </span>
                <span className="relative z-10 px-4 pb-4">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-fuchsia-200/80 uppercase">{category}</span>
                  <span className="mt-1 block font-display text-2xl leading-none tracking-tight">{card.title}</span>
                  <span className="mt-2 line-clamp-2 block text-sm leading-snug text-mist">{card.pitch}</span>
                </span>
                {locked ? (
                  <span className="absolute top-14 right-3 rounded-full bg-black/50 px-2 py-1 text-[10px] tracking-widest uppercase">
                    {card.availability}
                  </span>
                ) : null}
              </span>
            </button>
          </div>
          <div className={cn("card-face absolute inset-0 [transform:rotateY(180deg)]", !flipped && "pointer-events-none")}>
            <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#120816] p-5">
              <p className="text-[10px] font-semibold tracking-[0.18em] text-fuchsia-200/80 uppercase">{meta.label} mission</p>
              <h3 className="mt-2 font-display text-3xl leading-none">{card.title}</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-mist">{card.pitch}</p>
              <p className="text-sm text-white/80">{formatPoints(card.points)} points when approved</p>
              <div className="mt-4 flex flex-col gap-2">
                <button type="button" className="min-h-11 rounded-full bg-white text-sm font-semibold text-[#2e1065]" onClick={onOpen} disabled={locked}>
                  {locked ? card.availability : "Open challenge"}
                </button>
                <button type="button" className="min-h-11 rounded-full border border-white/15 text-sm text-mist" onClick={() => setFlipped(false)}>
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
