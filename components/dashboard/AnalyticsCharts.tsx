"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
 XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Props {
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
  xp: number;
  xpToNextLevel: number;

  weeklyActivity: {
    day: string;
    completed: number;
  }[];

  aiScore: number;
}

const COLORS = ["#22c55e", "#ef4444"];

export default function AnalyticsCharts({
  completedTasks,
  pendingTasks,
  completionRate,
  xp,
  xpToNextLevel,
  weeklyActivity,
  aiScore,
}: Props) {
  const pieData = [
    {
      name: "Completed",
      value: completedTasks,
    },
    {
      name: "Pending",
      value: pendingTasks,
    },
  ];

  const xpPercentage =
    xp + xpToNextLevel === 0
      ? 0
      : (xp / (xp + xpToNextLevel)) * 100;
      

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart */}

        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

          <h2 className="mb-4 text-xl font-bold">
            📋 Task Completion
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>

          <p className="mt-4 text-center text-lg font-semibold text-cyan-400">
            {completionRate}% Completed
          </p>

        </div>

        {/* Weekly Activity */}

        <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

          <h2 className="mb-4 text-xl font-bold">
            📅 Weekly Activity
          </h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyActivity}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="day" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="completed"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* XP Card */}

      <div className="rounded-2xl bg-slate-900 p-6 shadow-lg">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold">
            ⭐ XP Progress
          </h2>

          <span className="text-xl font-bold text-cyan-400">
            {xp} XP
          </span>

        </div>

        <div className="mt-6 h-4 rounded-full bg-slate-700 overflow-hidden">

          <div
            className="h-4 rounded-full bg-cyan-500 transition-all duration-700"
            style={{
              width: `${xpPercentage}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-sm text-gray-400">

          <span>Current XP</span>

          <span>
            {xp + xpToNextLevel} XP Needed
          </span>

        </div>

      </div>

      {/* AI Score */}

      <div className="rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 p-8 shadow-xl">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>

            <h2 className="text-3xl font-bold">
              🤖 AI Performance
            </h2>

            <p className="mt-2 text-gray-200">
              Your overall productivity score based on
              consistency, XP and completed tasks.
            </p>

          </div>

          <div className="text-center">

            <div className="text-6xl font-extrabold">
              {aiScore}
            </div>

            <div className="text-xl">
              /100
            </div>

          </div>

        </div>

        <div className="mt-8">

          <div className="flex justify-between mb-2">

            <span>Performance</span>

            <span>{aiScore}%</span>

          </div>

          <div className="h-4 rounded-full bg-white/20 overflow-hidden">

            <div
              className="h-4 rounded-full bg-white transition-all duration-700"
              style={{
                width: `${aiScore}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  );
}