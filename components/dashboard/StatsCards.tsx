"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  FileText,
  BrainCircuit,
  TrendingUp,
  Star,
} from "lucide-react";

interface DashboardStats {
  atsScore: number;
  readinessScore: number;
  selectionProbability: number;
}

export default function StatsCards() {
  const { user } = useUser();

  const [stats, setStats] = useState<DashboardStats>({
    atsScore: 0,
    readinessScore: 0,
    selectionProbability: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
  try {
    const res = await fetch("/api/dashboard");

    if (!res.ok) return;

    const data = await res.json();

    setStats({
      atsScore: data.stats?.atsScore ?? 0,
      readinessScore: data.stats?.readinessScore ?? 0,
      selectionProbability: data.stats?.selectionProbability ?? 0,
    });
  } catch (err) {
    console.error(err);
  }
}

  const cards = [
    {
      title: "Resume ATS",
      value: `${stats.atsScore}/100`,
      icon: FileText,
      color: "text-cyan-400",
      border: "border-cyan-500/20",
      bg: "bg-cyan-500/5",
    },
    {
      title: "Career Readiness",
      value: `${stats.readinessScore}/100`,
      icon: BrainCircuit,
      color: "text-violet-400",
      border: "border-violet-500/20",
      bg: "bg-violet-500/5",
    },
    {
      title: "Selection Chance",
      value: `${stats.selectionProbability}%`,
      icon: TrendingUp,
      color: "text-emerald-400",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/5",
    },
    {
      title: "Total XP",
      value: `${user?.xp ?? 0}`,
      icon: Star,
      color: "text-yellow-400",
      border: "border-yellow-500/20",
      bg: "bg-yellow-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl border ${card.border} ${card.bg} p-6 backdrop-blur transition-all duration-300 hover:scale-[1.03] hover:border-opacity-60`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">
                  {card.title}
                </p>

                <h2
                  className={`mt-3 text-3xl font-bold ${card.color}`}
                >
                  {card.value}
                </h2>
              </div>

              <Icon
                className={`h-10 w-10 ${card.color}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}