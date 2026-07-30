"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Target,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Star,
} from "lucide-react";

type DashboardStats = {
  totalGoals: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  xp: number;
  level: number;
  xpToNextLevel: number;
};

export default function ProgressChart() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const data = await res.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="h-[320px] animate-pulse rounded-3xl border border-white/10 bg-white/5 p-6">
        Loading Progress...
      </div>
    );
  }

  if (!stats) return null;

  const levelStartXP = (stats.level - 1) * 100;
  const currentXP = stats.xp - levelStartXP;
  const progress = Math.min((currentXP / 100) * 100, 100);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      {/* Header */}

      <div className="mb-6 flex items-center gap-3">
        <TrendingUp className="text-violet-400" size={24} />
        <div>
          <h2 className="text-xl font-bold">
            Career Progress
          </h2>
          <p className="text-sm text-slate-400">
            Your overall growth
          </p>
        </div>
      </div>

      {/* XP */}

      <div className="rounded-2xl bg-slate-900/50 p-5">

        <div className="mb-3 flex items-center justify-between">

          <div className="flex items-center gap-2 font-semibold">
            <Trophy size={18} />
            Level {stats.level}
          </div>

          <span className="text-sm text-slate-400">
            {stats.xp} XP
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

        <div className="mt-2 text-right text-xs text-slate-400">
          {stats.xpToNextLevel} XP to next level
        </div>

      </div>

      {/* Stats */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <SmallCard
          icon={<Target className="text-cyan-400" />}
          label="Goals"
          value={stats.totalGoals}
        />

        <SmallCard
          icon={<Star className="text-yellow-400" />}
          label="Tasks"
          value={stats.totalTasks}
        />

        <SmallCard
          icon={<CheckCircle2 className="text-green-400" />}
          label="Done"
          value={stats.completedTasks}
        />

        <SmallCard
          icon={<Clock3 className="text-orange-400" />}
          label="Pending"
          value={stats.pendingTasks}
        />

      </div>

      {/* Completion */}

      <div className="mt-6">

        <div className="mb-2 flex justify-between">

          <span className="font-medium">
            Completion
          </span>

          <span className="font-semibold text-violet-400">
            {stats.completionRate}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
            style={{
              width: `${stats.completionRate}%`,
            }}
          />

        </div>

      </div>

    </section>
  );
}

function SmallCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/50 p-4">

      <div className="mb-2">
        {icon}
      </div>

      <div className="text-2xl font-bold">
        {value}
      </div>

      <div className="text-sm text-slate-400">
        {label}
      </div>

    </div>
  );
}