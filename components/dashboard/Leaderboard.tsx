"use client";

import { useEffect, useState } from "react";
import { Trophy, Medal, Crown } from "lucide-react";

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  level: number;
  streak: number;
}

export default function Leaderboard() {

  const [users, setUsers] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    const res = await fetch("/api/leaderboard");

    const data = await res.json();

    if (data.success) {
      setUsers(data.leaderboard);
    }
  }

  return (
    <div className="rounded-3xl border border-yellow-500/20 bg-white/5 p-8">

      <div className="mb-8 flex items-center gap-3">
        <Crown className="text-yellow-400" />
        <h2 className="text-2xl font-bold">
          Leaderboard
        </h2>
      </div>

      <div className="space-y-4">

        {users.map((user) => (

          <div
            key={user.rank}
            className="flex items-center justify-between rounded-xl bg-white/5 p-4"
          >

            <div className="flex items-center gap-4">

              <div className="text-xl font-bold">

                {user.rank === 1 ? (
                  "🥇"
                ) : user.rank === 2 ? (
                  "🥈"
                ) : user.rank === 3 ? (
                  "🥉"
                ) : (
                  `#${user.rank}`
                )}

              </div>

              <div>

                <h3 className="font-semibold">
                  {user.name}
                </h3>

                <p className="text-sm text-gray-400">
                  Level {user.level}
                </p>

              </div>

            </div>

            <div className="text-right">

              <p className="font-bold text-violet-400">
                {user.xp} XP
              </p>

              <p className="text-sm text-orange-400">
                🔥 {user.streak}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}