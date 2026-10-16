import type { IconName } from "@/lib/types";

const paths: Record<IconName, string> = {
  spark: "M12 2.5l1.7 5.2 5.3 1.3-4.1 3.4 1.3 5.3L12 15.2 7.8 17.7l1.3-5.3L5 9l5.3-1.3L12 2.5z",
  users: "M8.5 11.2a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm7 0a2.6 2.6 0 1 0-2.6-2.6 2.6 2.6 0 0 0 2.6 2.6zM3.2 19.2v-1.2A3.6 3.6 0 0 1 6.8 14.4h3.4a3.6 3.6 0 0 1 3.6 3.6v1.2M14 14.6h1.2a3.2 3.2 0 0 1 3.2 3.2V19",
  cpu: "M8 8h8v8H8zM9 2.8v2.4M12 2.8v2.4M15 2.8v2.4M9 18.8v2.4M12 18.8v2.4M15 18.8v2.4M2.8 9h2.4M2.8 12h2.4M2.8 15h2.4M18.8 9h2.4M18.8 12h2.4M18.8 15h2.4",
  bug: "M8 9.5a4 4 0 0 1 8 0V13a4 4 0 0 1-8 0zM12 5.5V4M5.5 10.5H4M20 10.5h-1.5M6 16.5l-1.6 1.4M18 16.5l1.6 1.4M8 13H4.8M19.2 13H16",
  pin: "M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10zM12 11.5a1.7 1.7 0 1 0-1.7-1.7 1.7 1.7 0 0 0 1.7 1.7z",
  ticket: "M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v1.2a2 2 0 0 0 0 4v1.8A2.5 2.5 0 0 1 17.5 18h-11A2.5 2.5 0 0 1 4 15.5v-1.8a2 2 0 0 0 0-4zM12 8.2v7.6",
  star: "M12 3.2l2.1 4.7 5.1.6-3.8 3.4 1 5-4.4-2.5L7.6 17l1-5L4.8 8.5l5.1-.6z",
  circle: "M12 20a8 8 0 1 0-8-8 8 8 0 0 0 8 8zM12 8.2v3.6l2.4 1.6",
  check: "M5 12.5l4.2 4.2L19 7.2",
  apply: "M7 3.8h7.2L19 8.6V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V5A1.2 1.2 0 0 1 7 3.8zM14 3.8V8.6h5M8.2 12.4h7.6M8.2 16h5.2",
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={paths[name]} />
    </svg>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="ideeza-mark" x1="4" y1="2" x2="28" y2="30">
          <stop offset="0%" stopColor="#7b3bff" />
          <stop offset="100%" stopColor="#4b17c9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="10" fill="url(#ideeza-mark)" />
      <path d="M16 5.2l2.2 6.4 6.6 1.5-5 4.2 1.5 6.6L16 20.6l-5.3 3.3 1.5-6.6-5-4.2 6.6-1.5z" fill="#fff" />
    </svg>
  );
}
