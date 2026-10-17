import type { Thumb } from "@/lib/data";

export function ThumbArt({ name }: { name: Thumb }) {
  return (
    <svg viewBox="0 0 640 360" className="h-full w-full" aria-hidden>
      <rect width="640" height="360" fill="#efe8ff" />
      <rect x="36" y="28" width="568" height="304" rx="28" fill="#fbfaff" stroke="#6a2ff033" />
      {name === "console" ? <Console /> : null}
      {name === "antenna" ? <Antenna /> : null}
      {name === "enclosure" ? <Enclosure /> : null}
      {name === "sketch" ? <Sketch /> : null}
      {name === "sprint" ? <Sprint /> : null}
    </svg>
  );
}

function Console() {
  return (
    <g>
      <rect x="150" y="78" width="340" height="200" rx="24" fill="#f4eeff" stroke="#6a2ff0" strokeWidth="3" />
      <rect x="176" y="104" width="200" height="120" rx="12" fill="#fff" stroke="#6a2ff066" />
      <rect x="400" y="128" width="64" height="48" rx="8" fill="#6a2ff0" />
      <path d="M196 140h90M196 160h130M196 180h70" stroke="#4b17c9" strokeWidth="4" strokeLinecap="round" />
      <circle cx="250" cy="244" r="8" fill="#7b3bff" />
      <circle cx="280" cy="244" r="8" fill="#c4b5fd" />
    </g>
  );
}

function Antenna() {
  return (
    <g fill="none" stroke="#6a2ff0" strokeWidth="4" strokeLinecap="round">
      <path d="M120 250h400" />
      <path d="M320 250V110" strokeWidth="6" />
      <path d="M250 150a70 70 0 0 1 140 0" />
      <path d="M210 120a110 110 0 0 1 220 0" />
      <circle cx="320" cy="110" r="10" fill="#6a2ff0" stroke="none" />
      <rect x="250" y="230" width="140" height="28" rx="8" fill="#fff" />
    </g>
  );
}

function Enclosure() {
  return (
    <g>
      <path d="M160 150 320 90l160 60v110L320 320 160 260z" fill="#f4eeff" stroke="#6a2ff0" strokeWidth="3" />
      <path d="M160 150 320 210l160-60" fill="none" stroke="#6a2ff0" strokeWidth="3" />
      <path d="M320 210v110" stroke="#6a2ff0" strokeWidth="3" />
      <rect x="230" y="168" width="70" height="36" rx="6" fill="#6a2ff0" />
    </g>
  );
}

function Sketch() {
  return (
    <g>
      <rect x="120" y="80" width="220" height="180" rx="16" fill="none" stroke="#6a2ff0" strokeWidth="3" strokeDasharray="8 8" />
      <rect x="280" y="120" width="230" height="160" rx="18" fill="#fff" stroke="#4b17c9" strokeWidth="3" />
      <path d="M310 180h150M310 210h110" stroke="#7b3bff" strokeWidth="4" strokeLinecap="round" />
      <path d="M470 70l36 10-46 70-28-8z" fill="#6a2ff0" />
    </g>
  );
}

function Sprint() {
  return (
    <g>
      <circle cx="320" cy="180" r="92" fill="#fff" stroke="#6a2ff0" strokeWidth="8" />
      <path d="M320 112v72l48 28" fill="none" stroke="#4b17c9" strokeWidth="8" strokeLinecap="round" />
      <text x="320" y="292" textAnchor="middle" fill="#4b17c9" fontSize="28" fontWeight="700" fontFamily="Poppins, sans-serif">
        48h
      </text>
    </g>
  );
}
