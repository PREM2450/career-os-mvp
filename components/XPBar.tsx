"use client";

import { levelForXp } from "@/lib/logic";

export default function XPBar({ xp }: { xp: number }) {
  const { current, next, progressToNext } = levelForXp(xp);

  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Current level</p>
          <p className="font-display text-2xl font-bold gradient-text">{current.name}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-sm text-slate-300">{xp} XP</p>
          {next && (
            <p className="text-xs text-slate-500">{next.minXp - xp} XP to {next.name}</p>
          )}
        </div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan transition-all duration-700"
          style={{ width: `${Math.round(progressToNext * 100)}%` }}
        />
      </div>
    </div>
  );
}
