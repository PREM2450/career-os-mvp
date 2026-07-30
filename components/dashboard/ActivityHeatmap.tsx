
"use client";

import { Flame } from "lucide-react";
import useActivity from "@/hooks/useActivity";
import CustomTooltip from "@/components/ui/Tooltip";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

const WEEK_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

export default function ActivityHeatmap() {
  const { activity, loading } = useActivity();

  function getColor(level: number) {
    switch (level) {
      case 0:
        return "bg-slate-800";
      case 1:
        return "bg-violet-900";
      case 2:
        return "bg-violet-700";
      case 3:
        return "bg-violet-500";
      case 4:
        return "bg-cyan-400";
      default:
        return "bg-slate-800";
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-gray-400">Loading activity...</p>
      </div>
    );
  }

  const activeDays = activity.filter((d) => d.level > 0).length;
  const totalXP = activity.reduce((sum, d) => sum + d.xp, 0);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="text-orange-400" size={28} />

          <div>
            <h2 className="text-2xl font-bold">
              Activity Heatmap
            </h2>

            <p className="text-sm text-gray-400">
              Last 365 Days
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-orange-500/20 px-4 py-2 text-orange-300">
          🔥 {activeDays} Active Days
        </div>
      </div>

      {/* Month Labels */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="mb-2 ml-10 flex justify-between text-xs text-gray-500">
            {MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          <div className="flex gap-3">
            {/* Week Labels */}
            <div className="flex flex-col justify-between text-xs text-gray-500 py-1">
             {WEEK_LABELS.map((d, index) => (
  <span key={`week-${index}`}>
    {d}
  </span>
))}
            </div>

            {/* Heatmap */}
            <div className="grid grid-flow-col grid-rows-7 gap-2 w-max">
              {activity.map((day, index) => (
                <CustomTooltip
  key={`${day.date}-${index}`}
  date={day.date}
  xp={day.xp}
  missions={day.missions}
>
  <div
    className={`h-5 w-5 rounded transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-cyan-400 cursor-pointer ${getColor(day.level)}`}
  />
</CustomTooltip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-900/60 p-4">
          <p className="text-sm text-gray-400">Active Days</p>
          <h3 className="mt-2 text-3xl font-bold text-orange-400">
            {activeDays}
          </h3>
        </div>

        <div className="rounded-xl bg-slate-900/60 p-4">
          <p className="text-sm text-gray-400">Total XP</p>
          <h3 className="mt-2 text-3xl font-bold text-cyan-400">
            {totalXP}
          </h3>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center justify-end gap-2 text-xs text-gray-400">
        <span>Less</span>

        <div className="h-4 w-4 rounded bg-slate-800" />
        <div className="h-4 w-4 rounded bg-violet-900" />
        <div className="h-4 w-4 rounded bg-violet-700" />
        <div className="h-4 w-4 rounded bg-violet-500" />
        <div className="h-4 w-4 rounded bg-cyan-400" />

        <span>More</span>
      </div>
    </div>
  );
}