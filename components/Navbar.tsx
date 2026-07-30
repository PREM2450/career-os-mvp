"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { useCareerStore } from "@/lib/store";
import { levelForXp } from "@/lib/logic";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/missions", label: "Missions" },
];

export default function Navbar() {
  const pathname = usePathname();
  const xp = useCareerStore((s) => s.xp);
  const streak = useCareerStore((s) => s.streak);
  const { current } = levelForXp(xp);

  return (
    <header className="sticky top-0 z-40 mx-auto mt-4 w-[95%] max-w-6xl">
      <nav className="glass-card flex items-center justify-between px-5 py-3">
        <Link href="/dashboard" className="font-display text-lg font-bold tracking-tight">
          <span className="gradient-text">Career OS</span>
        </Link>

        <div className="hidden gap-1 sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                pathname === l.href
                  ? "glass shadow-glow-purple text-white"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="glass hidden items-center gap-1 rounded-full px-3 py-1.5 text-sm sm:flex">
            <span>🔥</span>
            <span className="font-mono">{streak}</span>
          </div>
          <div className="glass hidden items-center gap-1 rounded-full px-3 py-1.5 text-sm md:flex">
            <span className="text-neon-cyan">{current.name}</span>
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
