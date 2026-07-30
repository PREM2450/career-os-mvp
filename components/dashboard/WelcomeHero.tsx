"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  Trophy,
  Flame,
  Star,
  Target,
  TrendingUp,
  Clock3,
} from "lucide-react";

interface DashboardData {
  dreamCompany: string;
  selectionProbability: number;
  readinessScore: number;
  readinessStatus: string;
  estimatedMonths: number;
  reason: string;
}

export default function WelcomeHero() {
  const { user } = useUser();

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const res = await fetch("/api/dashboard");

      if (!res.ok) return;

      const data = await res.json();

const stats = data.stats;

setDashboard({
  dreamCompany: stats?.dreamCompany || "Not Set",
  selectionProbability:
    stats?.selectionProbability ?? 0,
  readinessScore:
    stats?.readinessScore ?? 0,
  readinessStatus:
    stats?.readinessStatus ??
    "Needs Improvement",
  estimatedMonths:
    stats?.estimatedMonths ?? 0,
  reason:
    stats?.readiness?.reason ??
    "Keep improving every day.",
});
    } catch (err) {
      console.error(err);

      setDashboard({
        dreamCompany: "Not Set",
        selectionProbability: 0,
        readinessScore: 0,
        readinessStatus: "Needs Improvement",
        estimatedMonths: 0,
        reason:
          "Unable to load AI insight.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!user || loading) {
    return (
      <div className="rounded-3xl bg-white/5 p-8 animate-pulse">
        Loading...
      </div>
    );
  }

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  return (
  <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-cyan-700 p-8 shadow-2xl">
    <p className="text-sm uppercase tracking-widest text-white/70">
      {greeting}
    </p>

    <h1 className="mt-2 text-4xl font-black">
      Welcome back, {user.name} 👋
    </h1>

    <p className="mt-2 text-white/80 text-lg">
      Your journey to{" "}
      <span className="font-bold text-cyan-200">
        {dashboard?.dreamCompany}
      </span>{" "}
      is in progress.
    </p>

    <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {/* Dream Company */}
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Target className="mb-3 h-8 w-8 text-cyan-300" />

        <p className="text-sm text-white/70">
          Dream Company
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {dashboard?.dreamCompany}
        </h2>
      </div>

      {/* Selection Probability */}
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <TrendingUp className="mb-3 h-8 w-8 text-green-300" />

        <p className="text-sm text-white/70">
          Selection Chance
        </p>

        <h2 className="mt-2 text-3xl font-black">
          {dashboard?.selectionProbability}%
        </h2>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700"
            style={{
              width: `${dashboard?.selectionProbability ?? 0}%`,
            }}
          />
        </div>
      </div>

      {/* Readiness */}
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Star className="mb-3 h-8 w-8 text-yellow-300" />

        <p className="text-sm text-white/70">
          Career Readiness
        </p>

        <h2 className="mt-2 text-xl font-bold">
          {dashboard?.readinessStatus}
        </h2>

        <p className="mt-2 text-sm text-white/70">
          Score: {dashboard?.readinessScore}/100
        </p>
      </div>

      {/* ETA */}
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Clock3 className="mb-3 h-8 w-8 text-orange-300" />

        <p className="text-sm text-white/70">
          Estimated Time
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {dashboard?.estimatedMonths} Months
        </h2>
      </div>
    </div>

    {/* AI Insight */}
    <div className="mt-6 rounded-2xl bg-white/10 p-6 backdrop-blur">
      <h3 className="text-lg font-bold text-cyan-300">
        💡 AI Insight
      </h3>

      <p className="mt-3 text-white/90 leading-7">
        {dashboard?.reason}
      </p>
    </div>

    {/* XP / Level / Streak */}
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Star className="mb-2 h-6 w-6 text-yellow-300" />

        <p className="text-sm text-white/70">
          Experience
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {user.xp} XP
        </h3>
      </div>

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Trophy className="mb-2 h-6 w-6 text-amber-300" />

        <p className="text-sm text-white/70">
          Current Level
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          Level {user.level}
        </h3>
      </div>

      <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
        <Flame className="mb-2 h-6 w-6 text-red-300" />

        <p className="text-sm text-white/70">
          Daily Streak
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          🔥 {user.streak}
        </h3>
      </div>
    </div>
  </section>
);
}