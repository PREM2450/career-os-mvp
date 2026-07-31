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
      <div className="animate-pulse rounded-[32px] border border-white/10 bg-[#12182D] p-8 text-white">
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
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#141B3A] via-[#232B67] to-[#5D2DE6] p-8 shadow-[0_20px_80px_rgba(65,60,180,0.45)]">

      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10">

        <p className="text-sm uppercase tracking-[0.3em] text-white/60">
          {greeting}
        </p>

        <h1 className="mt-3 text-5xl font-black tracking-tight leading-tight text-white">
          Welcome back, {user.name} 👋
        </h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
          Your journey towards{" "}
          <span className="font-bold text-cyan-300">
            {dashboard?.dreamCompany}
          </span>{" "}
          continues. Complete your roadmap daily and increase your
          chances of landing your dream company.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          {/* Dream Company */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
              <Target className="h-7 w-7 text-cyan-300" />
            </div>

            <p className="text-sm text-white/60">
              Dream Company
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {dashboard?.dreamCompany}
            </h2>

          </div>

          {/* Selection Probability */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10">
              <TrendingUp className="h-7 w-7 text-emerald-300" />
            </div>

            <p className="text-sm text-white/60">
              Selection Chance
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {dashboard?.selectionProbability}%
            </h2>

            <div className="mt-6">

              <div className="mb-2 flex items-center justify-between text-sm">

                <span className="text-white/60">
                  Progress
                </span>

                <span className="font-bold text-cyan-300">
                  {dashboard?.selectionProbability}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-1000"
                  style={{
                    width: `${dashboard?.selectionProbability ?? 0}%`,
                  }}
                />

              </div>

            </div>

          </div>          {/* Readiness */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
              <Star className="h-7 w-7 text-yellow-300" />
            </div>

            <p className="text-sm text-white/60">
              Career Readiness
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              {dashboard?.readinessStatus}
            </h2>

            <p className="mt-3 text-base text-white/70">
              Score:
              <span className="ml-2 font-bold text-yellow-300">
                {dashboard?.readinessScore}/100
              </span>
            </p>

          </div>

          {/* ETA */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-400/10">
              <Clock3 className="h-7 w-7 text-orange-300" />
            </div>

            <p className="text-sm text-white/60">
              Estimated Time
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {dashboard?.estimatedMonths}
            </h2>

            <p className="mt-2 text-white/70">
              Months Remaining
            </p>

          </div>

        </div>

        {/* AI Insight */}

        <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-white/10 p-7 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-white/15">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
              💡
            </div>

            <div>

              <h3 className="text-xl font-black text-cyan-300">
                AI Insight
              </h3>

              <p className="text-sm text-white/50">
                Personalized recommendation
              </p>

            </div>

          </div>

          <p className="mt-5 leading-8 text-white/90">
            {dashboard?.reason}
          </p>

        </div>

        {/* XP / Level / Streak */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* XP */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400/10">
              <Star className="h-7 w-7 text-yellow-300" />
            </div>

            <p className="text-sm text-white/60">
              Experience
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {user.xp}
            </h2>

            <p className="mt-2 text-white/70">
              XP Earned
            </p>

          </div>

          {/* Level */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10">
              <Trophy className="h-7 w-7 text-amber-300" />
            </div>

            <p className="text-sm text-white/60">
              Current Level
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {user.level}
            </h2>

            <p className="mt-2 text-white/70">
              Keep Climbing
            </p>

          </div>

          {/* Streak */}

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur shadow-[0_10px_35px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/15">

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-400/10">
              <Flame className="h-7 w-7 text-red-300" />
            </div>

            <p className="text-sm text-white/60">
              Daily Streak
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              🔥 {user.streak}
            </h2>

            <p className="mt-2 text-white/70">
              Days in a Row
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}