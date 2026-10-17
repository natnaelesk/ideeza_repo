"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, Mark } from "@/components/icons";

const NAV = [
  { href: "/", label: "Home", icon: "home" as const },
  { href: "/challenges", label: "Challenges", icon: "cards" as const },
  { href: "/profile", label: "Profile", icon: "user" as const },
];

function onPage(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[#6a2ff0] focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[#6a2ff01a] bg-[#fbfaff]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <Link href="/" className="flex items-center gap-2">
            <Mark className="h-8 w-8" />
            <span className="text-sm font-extrabold tracking-[0.16em] text-ink">IDEEZA</span>
          </Link>
          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              const on = onPage(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={on ? "rounded-full bg-gradient-to-r from-[#4b17c9] to-[#7b3bff] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_18px_#5a1edc33]" : "rounded-full px-4 py-2 text-sm font-semibold text-mist hover:text-ink"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-28 md:pb-16">
        {children}
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[#6a2ff01a] bg-white/95 backdrop-blur-xl md:hidden" aria-label="Primary">
        <ul className="mx-auto grid max-w-lg grid-cols-3 pb-[max(0.35rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const on = onPage(pathname, item.href);
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={on ? "page" : undefined} className={on ? "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-bold text-[#4b17c9]" : "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold text-mist"}>
                  <Icon name={item.icon} className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
