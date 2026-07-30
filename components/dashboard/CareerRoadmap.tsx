"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  FileText,
  Code2,
  Briefcase,
} from "lucide-react";

interface RoadmapData {
  atsScore: number;
  readinessScore: number;
  selectionProbability: number;
}

export default function CareerRoadmap() {
  const [data, setData] = useState<RoadmapData>({
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

      const result = await res.json();

      const stats = result.stats ?? {};

      setData({
        atsScore: stats.atsScore ?? 0,
        readinessScore: stats.readinessScore ?? 0,
        selectionProbability: stats.selectionProbability ?? 0,
      });
    } catch (err) {
      console.error(err);
    }
  }

  const items = [
    {
      title: "Resume",
      value: data.atsScore,
      icon: FileText,
      color: "bg-cyan-500",
    },
    {
      title: "DSA",
      value: data.readinessScore,
      icon: Code2,
      color: "bg-violet-500",
    },
    {
      title: "Placement",
      value: data.selectionProbability,
      icon: Briefcase,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-yellow-500/20 p-3">
          <Trophy className="text-yellow-400" size={22} />
        </div>

        <div>
          <h3 className="font-semibold">
            Career Readiness
          </h3>

          <p className="text-xs text-slate-400">
            Placement Progress
          </p>
        </div>
      </div>

      <div className="space-y-5">

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title}>

              <div className="mb-2 flex items-center justify-between">

                <div className="flex items-center gap-2">
                  <Icon size={16} />
                  <span className="text-sm">
                    {item.title}
                  </span>
                </div>

                <span className="text-sm font-semibold">
                  {item.value}%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-800">

                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{
                    width: `${item.value}%`,
                  }}
                />

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}