"use client";

import { useEffect, useState } from "react";

import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import AICoachCard from "@/components/dashboard/AICoachCard";

interface DashboardStats {
  totalGoals: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;

  xp: number;
  level: number;
  xpToNextLevel: number;

  streak: number;
  longestStreak: number;

  todayCompleted: number;
  weeklyCompleted: number;
  monthlyCompleted: number;

  aiScore: number;

  weeklyActivity: {
    day: string;
    completed: number;
  }[];
}

interface Coach {
  greeting: string;
  summary: string;
  focus: string[];
  motivation: string;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [dashboardRes, coachRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/ai/daily-coach"),
      ]);

      const dashboard = await dashboardRes.json();
      const coachData = await coachRes.json();

      if (dashboard.success) {
        setStats(dashboard.stats);
      }

      if (coachData.success) {
        setCoach(coachData.coach);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-2xl animate-pulse">
          Loading Analytics...
        </div>
      </div>
    );
  }

  // ✅ Console log should be here
  //console.log(stats);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      {/* AI Coach */}
      {coach && <AICoachCard coach={coach} />}

      <h1 className="mb-10 text-5xl font-bold">
        📊 Analytics Dashboard
      </h1>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
          <p className="text-gray-400">⭐ XP</p>
          <h2 className="mt-3 text-4xl font-bold">{stats.xp}</h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
          <p className="text-gray-400">🚀 Level</p>
          <h2 className="mt-3 text-4xl font-bold">{stats.level}</h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
          <p className="text-gray-400">🔥 Streak</p>
          <h2 className="mt-3 text-4xl font-bold">{stats.streak}</h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">
          <p className="text-gray-400">✅ Completed</p>
          <h2 className="mt-3 text-4xl font-bold">
            {stats.completedTasks}
          </h2>
        </div>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">📅 Today</p>
          <h2 className="mt-3 text-3xl font-bold">
            {stats.todayCompleted}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">📈 This Week</p>
          <h2 className="mt-3 text-3xl font-bold">
            {stats.weeklyCompleted}
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-900 p-6">
          <p className="text-gray-400">📆 This Month</p>
          <h2 className="mt-3 text-3xl font-bold">
            {stats.monthlyCompleted}
          </h2>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts
        completedTasks={stats.completedTasks}
        pendingTasks={stats.pendingTasks}
        completionRate={stats.completionRate}
        xp={stats.xp}
        xpToNextLevel={stats.xpToNextLevel}
        weeklyActivity={stats.weeklyActivity}
        aiScore={stats.aiScore}
      />
    </div>
  );
}