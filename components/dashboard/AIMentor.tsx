"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

interface CoachData {
  greeting: string;
  summary: string;
  focus: string[];
  strengths: string[];
  weaknesses: string[];
  motivation: string;
  nextGoal: string;
}

export default function AIMentor() {
  const { user } = useUser();

  const [loading, setLoading] = useState(false);

  const [coach, setCoach] = useState<CoachData>({
    greeting: "",
    summary: "",
    focus: [],
    strengths: [],
    weaknesses: [],
    motivation: "",
    nextGoal: "",
  });

  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    loadCoach();

    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  async function loadCoach() {
    try {
      setLoading(true);

      const res = await fetch("/api/ai/daily-coach");
      const data = await res.json();

      if (data.success) {
        setCoach(data.coach);
      }
    } catch (err) {
      console.error(err);

      setCoach({
        greeting: "Welcome Back 👋",
        summary:
          "Let's continue improving your placement readiness today.",
        focus: [
          "Complete today's tasks",
          "Solve LeetCode problems",
          "Improve Resume ATS",
        ],
        strengths: [],
        weaknesses: [],
        motivation:
          "Consistency beats intensity. Keep moving forward.",
        nextGoal: "Increase your readiness score this week.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function generatePlan() {
    await loadCoach();
  }

  return (
  <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-violet-500/10 to-indigo-500/10 p-8 backdrop-blur-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-cyan-400">🤖 AI Mentor</p>

        <h2 className="mt-2 text-3xl font-bold">
          {greeting},{" "}
          <span className="text-cyan-400">
            {user?.name || "Explorer"}
          </span>
        </h2>

        <p className="mt-2 text-gray-400">
          {coach.greeting}
        </p>
      </div>

      <div className="text-6xl">🧠</div>
    </div>

    <div className="mt-8 rounded-2xl bg-black/20 p-6">
      <h3 className="text-lg font-semibold text-violet-300">
        Today's Summary
      </h3>

      <p className="mt-3 text-gray-300">
        {coach.summary}
      </p>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-cyan-400">
          🎯 Today's Focus
        </h3>

        <div className="mt-4 space-y-3">
          {coach.focus.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-white/5 p-3 hover:bg-white/10 transition"
            >
              ✅ {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-emerald-500/10 p-5">
          <h3 className="font-bold text-emerald-400">
            💪 Strengths
          </h3>

          <div className="mt-3 space-y-2">
            {coach.strengths.length === 0 ? (
              <p className="text-gray-400">
                No strengths available.
              </p>
            ) : (
              coach.strengths.map((item, index) => (
                <p key={index}>✅ {item}</p>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-red-500/10 p-5">
          <h3 className="font-bold text-red-400">
            ⚠️ Weak Areas
          </h3>

          <div className="mt-3 space-y-2">
            {coach.weaknesses.length === 0 ? (
              <p className="text-gray-400">
                No weak areas available.
              </p>
            ) : (
              coach.weaknesses.map((item, index) => (
                <p key={index}>• {item}</p>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-violet-500/10 p-5">
        <h3 className="font-bold text-violet-400">
          🚀 Next Goal
        </h3>

        <p className="mt-3 text-gray-300">
          {coach.nextGoal}
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-cyan-500/10 p-5">
        <h3 className="font-bold text-cyan-400">
          💡 Motivation
        </h3>

        <p className="mt-3 text-gray-300">
          {coach.motivation}
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-cyan-500/10 p-4">
          <p className="text-sm text-gray-400">
            🔥 Current Streak
          </p>

          <h3 className="mt-2 text-2xl font-bold text-cyan-400">
            {user?.streak ?? 0} Days
          </h3>
        </div>

        <div className="rounded-xl bg-violet-500/10 p-4">
          <p className="text-sm text-gray-400">
            ⭐ XP
          </p>

          <h3 className="mt-2 text-2xl font-bold text-violet-400">
            {user?.xp ?? 0}
          </h3>
        </div>
      </div>

      <button
        onClick={generatePlan}
        disabled={loading}
        className="mt-8 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 py-4 font-bold transition hover:scale-[1.02] disabled:opacity-50"
      >
        {loading ? "Refreshing..." : "🔄 Refresh AI Advice"}
      </button>
    </div>
  </div>
);
}