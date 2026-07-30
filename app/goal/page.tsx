"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Code2,
  Database,
  Globe,
  Briefcase,
  Sparkles,
} from "lucide-react";

const goals = [
  {
    title: "Google SDE",
    icon: Code2,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI Engineer",
    icon: Brain,
    color: "from-violet-500 to-fuchsia-500",
  },
  {
    title: "Full Stack Developer",
    icon: Globe,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Data Scientist",
    icon: Database,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Software Engineer",
    icon: Briefcase,
    color: "from-pink-500 to-purple-500",
  },
];

export default function GoalPage() {
  const router = useRouter();

  const [selectedGoal, setSelectedGoal] = useState("");
  const [company, setCompany] = useState("");
  const [deadline, setDeadline] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);

  async function saveGoal() {
    if (!selectedGoal) {
      alert("Please select a goal");
      return;
    }

    if (!deadline) {
      alert("Please select deadline");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goal: selectedGoal,
          company,
          deadline,
          dailyHours,
          level,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        setLoading(false);
        return;
      }

      alert("Goal Saved Successfully 🎉");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white p-10">

      <div className="mx-auto max-w-6xl">

        <div className="mb-12 text-center">
          <Sparkles className="mx-auto mb-5 h-14 w-14 text-violet-400" />

          <h1 className="text-5xl font-black">
            Choose Your Career Goal
          </h1>

          <p className="mt-3 text-slate-400">
            Configure your learning journey.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const Icon = goal.icon;

            return (
              <button
                key={goal.title}
                onClick={() => setSelectedGoal(goal.title)}
                className={`rounded-3xl border p-8 text-left transition-all duration-300 ${
                  selectedGoal === goal.title
                    ? "border-violet-500 scale-105"
                    : "border-white/10 hover:border-violet-500 hover:scale-105"
                }`}
              >
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${goal.color}`}
                >
                  <Icon size={34} />
                </div>

                <h2 className="text-2xl font-bold">
                  {goal.title}
                </h2>

                <p className="mt-3 text-sm text-slate-400">
                  Personalized roadmap and progress tracking.
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8">

          <div>
            <label className="mb-2 block text-sm">
              Target Company
            </label>

            <input
              type="text"
              placeholder="Google, Microsoft..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl bg-[#101827] p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Deadline
            </label>

            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-xl bg-[#101827] p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Daily Study Hours
            </label>

            <input
              type="number"
              min={1}
              max={12}
              value={dailyHours}
              onChange={(e) =>
                setDailyHours(Number(e.target.value))
              }
              className="w-full rounded-xl bg-[#101827] p-4 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Current Level
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-xl bg-[#101827] p-4 outline-none"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <button
            onClick={saveGoal}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 text-xl font-bold transition hover:scale-105"
          >
            {loading ? "Saving..." : "Save Goal"}
          </button>

        </div>

      </div>

    </main>
  );
}