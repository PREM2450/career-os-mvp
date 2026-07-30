"use client";

import { CheckCircle2 } from "lucide-react";

interface Mission {
  _id: string;
  title: string;
  xp: number;
  completed: boolean;
  category: string;
}

interface Props {
  missions: Mission[];
  onComplete: (id: string) => void;
}

export default function MissionTimeline({
  missions,
  onComplete,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="mb-6 text-2xl font-bold">
        Today's Missions
      </h2>

      <div className="space-y-4">

        {missions.map((mission) => (

          <div
            key={mission._id}
            className="rounded-2xl border border-white/10 bg-slate-900/40 p-5 transition hover:border-cyan-400"
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-semibold text-lg">
                  {mission.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {mission.category}
                </p>

              </div>

              <div className="text-cyan-400 font-bold">
                +{mission.xp} XP
              </div>

            </div>

            <div className="mt-4 flex items-center justify-between">

              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  mission.completed
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {mission.completed ? "Completed" : "Pending"}
              </span>

              {!mission.completed && (
                <button
                  onClick={() => onComplete(mission._id)}
                  className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-white transition hover:bg-cyan-400"
                >
                  <CheckCircle2 size={18} />
                  Complete
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}