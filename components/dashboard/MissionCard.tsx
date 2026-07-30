"use client";

import useMissions from "@/hooks/useMissions";
import { useUser } from "@/context/UserContext";
import AchievementToast from "@/components/ui/AchievementToast";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Target,
} from "lucide-react";

export default function MissionCard() {
  const { missions, loading, refresh } = useMissions();
  const { refreshUser } = useUser();

  async function completeMission(missionId: string) {
    try {
      const res = await fetch("/api/missions/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missionId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        await refreshUser();
        await refresh();

        toast.success(`Mission Completed! +${data.xp} XP`);

        if (data.achievementUnlocked) {
          toast.custom(() => (
            <AchievementToast
              icon="🥇"
              title="First Mission"
              description="Completed your first mission."
            />
          ));
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 animate-pulse">
        Loading today's missions...
      </div>
    );
  }

  const completed = missions.filter((m) => m.completed).length;
  const total = missions.length;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-3">
          <Target className="text-violet-400" size={28} />

          <div>
            <h2 className="text-2xl font-bold">
              Today's Missions
            </h2>

            <p className="text-sm text-gray-400">
              Complete missions to earn XP
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-violet-500/20 px-4 py-2 font-semibold text-violet-300">
          {completed}/{total}
        </div>

      </div>

      {/* Progress */}

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-sm">

          <span className="text-gray-400">
            Daily Progress
          </span>

          <span className="font-semibold">
            {Math.round(progress)}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {missions.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-10 text-center">
          <Trophy className="mx-auto mb-4 text-yellow-400" size={40} />

          <p className="text-lg font-semibold">
            No missions available today
          </p>

          <p className="mt-2 text-gray-400">
            New missions will be generated automatically.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">

          {missions.map((mission) => (

            <div
              key={mission._id}
              className={`rounded-2xl border p-5 transition-all ${
                mission.completed
                  ? "border-green-500/40 bg-green-500/10"
                  : "border-white/10 bg-slate-900/40 hover:border-violet-500/40"
              }`}
            >

              <div className="flex justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    {mission.completed ? (
                      <CheckCircle2
                        className="text-green-400"
                        size={20}
                      />
                    ) : (
                      <Circle
                        className="text-gray-500"
                        size={20}
                      />
                    )}

                    <h3 className="text-lg font-semibold">
                      {mission.title}
                    </h3>

                  </div>

                  <p className="mt-2 text-sm text-gray-400">
                    {mission.category}
                  </p>

                </div>

                <span className="rounded-lg bg-violet-500/20 px-3 py-2 font-bold text-violet-300">
                  +{mission.xp} XP
                </span>

              </div>

              <button
                disabled={mission.completed}
                onClick={() => completeMission(mission._id)}
                className={`mt-5 w-full rounded-xl py-3 font-semibold transition-all ${
                  mission.completed
                    ? "cursor-not-allowed bg-green-600"
                    : "bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-[1.02]"
                }`}
              >
                {mission.completed
                  ? "✅ Mission Completed"
                  : "Complete Mission"}
              </button>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}