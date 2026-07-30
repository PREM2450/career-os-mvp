export default function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center gap-1 p-6 text-center">
      <span className="text-4xl">🔥</span>
      <span className="font-display text-3xl font-bold">{streak}</span>
      <span className="text-xs uppercase tracking-wide text-slate-400">
        day streak
      </span>
    </div>
  );
}
