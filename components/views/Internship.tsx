"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Confetti } from "@/components/Confetti";
import { Icon } from "@/components/icons";
import { Modal, NextStep, PageHeader, ghostClass, primaryClass } from "@/components/ui";
import { PROFILE } from "@/lib/catalog";
import { cn, formatWhen, validEmail, validLink } from "@/lib/format";
import { useCohort } from "@/lib/store";

export function InternshipView() {
  const cohort = useCohort();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const currentIndex = cohort.stages.findIndex((stage) => stage.current);
  const fillIndex = currentIndex === -1 ? cohort.stages.length - 1 : currentIndex;
  const fill = fillIndex / (cohort.stages.length - 1);

  return (
    <div className="space-y-10">
      <PageHeader explain="Finish these steps, then apply. The reward is a studio seat, not money." title="Internship" />
      <InternshipNext onApply={() => setOpen(true)} />
      <ol className="relative space-y-4">
        <div className="absolute top-6 bottom-6 left-6 w-px bg-white/10" aria-hidden>
          <motion.div
            className="w-full origin-top bg-gradient-to-b from-fuchsia-300 via-violet-500 to-amber-200"
            initial={false}
            animate={{ height: `${fill * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.7 }}
          />
        </div>
        {cohort.stages.map((stage) => (
          <li key={stage.id} className="grid grid-cols-[3rem_1fr] gap-3">
            <div
              className={cn(
                "relative z-10 grid h-12 w-12 place-items-center rounded-full border text-sm font-semibold",
                stage.done && "border-emerald-300/50 bg-emerald-400/15",
                stage.current && "border-fuchsia-300 bg-fuchsia-500/20 shadow-[0_0_24px_rgba(232,121,249,0.45)]",
                stage.locked && "border-white/10 bg-[#120816] text-mist",
              )}
            >
              {stage.done ? <Icon name="check" className="h-5 w-5" /> : String(stage.index + 1).padStart(2, "0")}
            </div>
            <article className={cn("rounded-[28px] border p-5", stage.kind === "final" ? "border-amber-200/30 bg-gradient-to-br from-amber-200/10 to-fuchsia-500/10" : "glass")}>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl">{stage.title}</h2>
                {stage.current ? <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold tracking-widest text-[#2e1065] uppercase">Now</span> : null}
                {stage.done ? <span className="text-xs text-emerald-300">Done</span> : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mist">{stage.detail}</p>
              {stage.kind === "manual" && stage.current ? (
                <button type="button" className={`${primaryClass} mt-4`} onClick={() => cohort.completeStage(stage.id)}>
                  Mark this done
                </button>
              ) : null}
              {stage.kind === "manual" && stage.locked ? <p className="mt-3 text-sm text-white/70">Finish the previous stage first.</p> : null}
              {stage.kind === "final" && stage.current ? (
                <button type="button" className={`${primaryClass} mt-4`} onClick={() => setOpen(true)}>
                  Apply
                </button>
              ) : null}
              {stage.kind === "final" && stage.locked ? <p className="mt-3 text-sm text-white/70">The Apply button opens when the showcase is done.</p> : null}
              {stage.kind === "final" && stage.done && cohort.application ? (
                <div className="mt-4 rounded-2xl bg-black/25 p-4">
                  <p className="text-[11px] tracking-[0.16em] text-amber-100 uppercase">Application saved {formatWhen(cohort.application.submittedAt)}</p>
                  <p className="mt-2 text-sm leading-relaxed">{cohort.application.why}</p>
                </div>
              ) : null}
            </article>
          </li>
        ))}
      </ol>
      <ApplyModal
        open={open}
        celebrating={celebrating}
        onClose={() => {
          setOpen(false);
          setCelebrating(false);
        }}
        onSuccess={() => setCelebrating(true)}
      />
      {celebrating ? <Confetti fire={celebrating ? 2 : 0} /> : null}
    </div>
  );
}

function InternshipNext({ onApply }: { onApply: () => void }) {
  const cohort = useCohort();
  const current = cohort.stages.find((stage) => stage.current);
  if (current?.kind === "final") return <NextStep label="Apply for the internship" onClick={onApply} />;
  if (current?.kind === "manual") return <NextStep label={`Mark ${current.title} done`} onClick={() => cohort.completeStage(current.id)} />;
  if (current) return <NextStep href="/challenges" label="Do a challenge" />;
  return <NextStep href="/profile" label="Back to your profile" />;
}

function ApplyModal({
  open,
  celebrating,
  onClose,
  onSuccess,
}: {
  open: boolean;
  celebrating: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const cohort = useCohort();
  const [name, setName] = useState(PROFILE.name);
  const [email, setEmail] = useState("selam@builders.demo");
  const [city, setCity] = useState(PROFILE.city);
  const [why, setWhy] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2 || city.trim().length < 2) {
      setError("Add your name and city.");
      return;
    }
    if (!validEmail(email)) {
      setError("Use a real-looking email. Nothing is sent.");
      return;
    }
    if (why.trim().length < 20) {
      setError("Tell the studio a little more — at least 20 characters.");
      return;
    }
    if (link.trim() && !validLink(link)) {
      setError("Project link needs to start with http:// or https://.");
      return;
    }
    const ok = cohort.apply({ name, email, city, why, link });
    if (!ok) {
      setError("The application opens after the showcase.");
      return;
    }
    setError("");
    onSuccess();
  }

  return (
    <Modal open={open} title={celebrating ? "You are in the queue" : "Studio application"} onClose={onClose}>
      {celebrating ? (
        <div>
          <p className="font-display text-3xl leading-tight">The Addis studio has your name.</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">
            Saved on this device only. In the cohort, this note is what puts you in the internship queue. The path pays in access, credits, and printed hardware — never cash.
          </p>
          <button type="button" className={`${primaryClass} mt-6`} onClick={onClose}>
            Back to the path
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <Field label="Full name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} type="email" />
          <Field label="City" value={city} onChange={setCity} />
          <label className="block text-sm">
            <span className="text-mist">Why this internship</span>
            <textarea value={why} onChange={(event) => setWhy(event.target.value)} rows={4} className="mt-1 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none" placeholder="The build you want to finish inside the studio." />
          </label>
          <Field label="Project link, optional" value={link} onChange={setLink} />
          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          <div className="flex flex-wrap gap-2 pt-2">
            <button type="submit" className={primaryClass}>
              Send application
            </button>
            <button type="button" className={ghostClass} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="text-mist">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-base outline-none" />
    </label>
  );
}
