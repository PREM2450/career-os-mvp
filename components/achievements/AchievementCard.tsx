"use client";

type AchievementCardProps = {
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
};

export default function AchievementCard({
  title,
  description,
  icon,
  category,
  xpReward,
  unlocked,
}: AchievementCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
      ${
        unlocked
          ? "border-green-500 bg-gradient-to-br from-green-900/20 to-green-700/10"
          : "border-zinc-700 bg-zinc-900/60 opacity-70"
      }`}
    >
      {/* Lock Badge */}
      {!unlocked && (
        <div className="absolute right-4 top-4 text-xl">
          🔒
        </div>
      )}

      {/* Icon */}
      <div className="text-5xl">{icon}</div>

      {/* Title */}
      <h2 className="mt-4 text-xl font-bold text-white">
        {title}
      </h2>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-400">
        {description}
      </p>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-full bg-indigo-600/20 px-3 py-1 text-xs text-indigo-300">
          {category}
        </span>

        <span className="font-semibold text-yellow-400">
          +{xpReward} XP
        </span>
      </div>

      {/* Unlocked Badge */}
      {unlocked && (
        <div className="absolute right-4 top-4 rounded-full bg-green-500 px-2 py-1 text-xs font-semibold text-white">
          ✓ Unlocked
        </div>
      )}
    </div>
  );
}