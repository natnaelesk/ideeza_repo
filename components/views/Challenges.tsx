"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { GoldenTicketCard, TradingCard } from "@/components/TradingCard";
import { Modal, NextStep, PageHeader, chipClass, ghostClass, primaryClass } from "@/components/ui";
import { CATEGORIES, RARITY_META, RARITY_ORDER } from "@/lib/catalog";
import { cn, formatPoints, validLink } from "@/lib/format";
import { useCohort } from "@/lib/store";
import type { Category } from "@/lib/types";

type Filter = "all" | Category;

export function ChallengesView() {
  const cohort = useCohort();
  const [filter, setFilter] = useState<Filter>("all");
  const [showDone, setShowDone] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const cards = useMemo(() => {
    return cohort.challenges
      .filter((card) => (filter === "all" ? true : card.category === filter))
      .filter((card) => (showDone ? true : card.availability === "open"))
      .slice()
      .sort((a, b) => RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity) || b.points - a.points);
  }, [cohort.challenges, filter, showDone]);

  const active = cohort.challenges.find((card) => card.id === activeId) ?? null;

  function close() {
    setActiveId(null);
    setError("");
    setSent(false);
    setLink("");
    setNote("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!active) return;
    if (!validLink(link)) {
      setError("Paste a full link, starting with http:// or https://.");
      return;
    }
    if (note.trim().length < 8) {
      setError("Add a short note about the work.");
      return;
    }
    const ok = cohort.submitChallenge(active.id, link, note);
    if (!ok) {
      setError("This card is already in review or approved.");
      return;
    }
    setError("");
    setSent(true);
  }

  return (
    <div className="space-y-8">
      <PageHeader explain="Pick a card, do the task, and submit a link. Rarer cards are worth more points." title="Challenge cards" />
      <p className="text-sm text-mist">
        Common <span aria-hidden>●</span> · Rare <span aria-hidden>◆</span> · Epic <span aria-hidden>★</span> · Legendary <span aria-hidden>★★</span> · Golden Ticket is the shiny gift card.
      </p>
      <NextStep href="/history" label="Review submissions in History" />
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chipClass(filter === "all")} onClick={() => setFilter("all")}>
          All
        </button>
        {CATEGORIES.map((category) => (
          <button key={category.id} type="button" className={chipClass(filter === category.id)} onClick={() => setFilter(category.id)}>
            {category.label}
          </button>
        ))}
        <button type="button" className={cn(chipClass(showDone), "ml-auto")} onClick={() => setShowDone((value) => !value)} aria-pressed={showDone}>
          {showDone ? "Hide finished" : "Show finished"}
        </button>
      </div>
      {cards.length === 0 && filter !== "all" ? (
        <div className="glass rounded-[28px] p-8 text-center">
          <p className="font-display text-3xl">The deck is clear.</p>
          <p className="mt-2 text-sm text-mist">Everything in this filter is pending or approved. History can send a card back.</p>
          <Link href="/history" className={`${primaryClass} mt-5`}>
            Open History
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filter === "all" ? <GoldenTicketCard /> : null}
          {cards.map((card) => (
            <TradingCard key={card.id} card={card} onOpen={() => setActiveId(card.id)} />
          ))}
        </div>
      )}
      <Modal open={Boolean(active)} title={active?.title ?? "Challenge"} onClose={close}>
        {active ? (
          sent ? (
            <div>
              <p className="text-sm leading-relaxed text-mist">
                {active.title} is pending. Open History and use demo review to approve the points or send the card back.
              </p>
              <Link href="/history" className={`${primaryClass} mt-5`} onClick={close}>
                Review in History
              </Link>
            </div>
          ) : (
            <div>
              <p className={cn("inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase", RARITY_META[active.rarity].chip)}>
                {RARITY_META[active.rarity].label} · {formatPoints(active.points)} pts
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/90">{active.brief}</p>
              {active.availability === "open" ? (
                <form onSubmit={submit} className="mt-5 space-y-3">
                  <label className="block text-sm">
                    <span className="text-mist">Link to the work</span>
                    <input value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://example.com/ideeza/your-build" className="mt-1 min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base outline-none" />
                  </label>
                  <label className="block text-sm">
                    <span className="text-mist">Note</span>
                    <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} placeholder="What you made, what broke, what you would print." className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none" />
                  </label>
                  {error ? <p className="text-sm text-rose-200">{error}</p> : null}
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className={primaryClass}>
                      Submit work
                    </button>
                    <button type="button" className={ghostClass} onClick={close}>
                      Close
                    </button>
                  </div>
                </form>
              ) : (
                <p className="mt-4 text-sm text-mist">This card is {active.availability}. It is not open for a new submission.</p>
              )}
            </div>
          )
        ) : null}
      </Modal>
    </div>
  );
}
