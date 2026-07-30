"use client";

import { useEffect, useState } from "react";
import AchievementCard from "./AchievementCard";

interface Achievement {
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  xpReward: number;
  unlocked: boolean;
}

export default function AchievementGrid() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [total, setTotal] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      const res = await fetch("/api/achievements");

      const data = await res.json();

      if (data.success) {
        setAchievements(data.achievements);
        setProgress(data.progress);
        setUnlocked(data.unlocked);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading achievements...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">
            🏆 Achievements
          </h2>

          <span className="text-lg font-semibold text-green-400">
            {unlocked} / {total}
          </span>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <p className="mt-3 text-gray-400">
          {progress}% Completed
        </p>

      </div>

      {/* Grid */}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
  {achievements.map((achievement) => (
    <AchievementCard
      key={achievement.key}
      title={achievement.title}
      description={achievement.description}
      icon={achievement.icon}
      category={achievement.category}
      xpReward={achievement.xpReward}
      unlocked={achievement.unlocked}
    />
  ))}
</div>

    </div>
  );
}