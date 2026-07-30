"use client";

import { SKILL_COLORS, SKILL_LABELS } from "@/lib/data";
import { DailyMission } from "@/lib/logic";

export default function MissionCard({
  mission,
  done,
  onComplete,
}: {
  mission: DailyMission;
  done: boolean;
  onComplete: () => void;
}) {
  const color = SKILL_COLORS[mission.skill];

  return (
    <div
      className={`glass-card flex flex-col gap-3 p-5 transition ${
        done ? "opacity-60" : "hover:shadow-glow-purple"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: `${color}22`, color }}
        >
          {SKILL_LABELS[mission.skill]}
        </span>
        <span className="font-mono text-xs text-slate-400">+{mission.xp} XP</span>
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold">{mission.title}</h3>
        <p className="mt-1 text-sm text-slate-400">{mission.detail}</p>
      </div>
      <button
        onClick={onComplete}
        disabled={done}
        className={`mt-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
          done
            ? "glass cursor-default text-emerald-400"
            : "bg-gradient-to-r from-neon-purple to-neon-cyan text-white hover:brightness-110"
        }`}
      >
        {done ? "✓ Completed" : "Mark complete"}
      </button>
    </div>
  );
}
