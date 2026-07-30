"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Target,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface LeetCodeProfile {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  lastSynced: string;
}

export default function LeetCodeCard() {
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [connected, setConnected] = useState(false);
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);

      const res = await fetch("/api/leetcode", {
        cache: "no-store",
      });

      const data = await res.json();

      console.log("LeetCode API:", data);

      setConnected(Boolean(data.connected));
      setProfile(data.profile ?? null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function sync() {
    try {
      setSyncing(true);

      await fetch("/api/leetcode/sync", {
        method: "POST",
      });

      await loadProfile();
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl bg-[#111827] border border-white/10 h-80 animate-pulse" />
    );
  }

  if (!connected || !profile) {
    return (
      <div className="rounded-2xl bg-[#111827] border border-white/10 p-6">
        <h2 className="text-2xl font-bold text-white">
          LeetCode
        </h2>

        <p className="mt-3 text-gray-400">
          No account connected.
        </p>

        <a
          href="/settings/leetcode"
          className="inline-block mt-5 rounded-lg bg-yellow-500 px-5 py-2 font-semibold text-white"
        >
          Connect Account
        </a>
      </div>
    );
  }

  const progress = Math.min((profile.totalSolved / 500) * 100, 100);

  return (
  <div className="h-[280px] rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Trophy className="text-yellow-400" size={22} />
        <h2 className="text-lg font-bold text-white">
          LeetCode
        </h2>
      </div>

      <button
        onClick={sync}
        disabled={syncing}
        className="rounded-lg bg-white/10 p-2 hover:bg-white/20 transition"
      >
        <RefreshCw
          size={18}
          className={syncing ? "animate-spin" : ""}
        />
      </button>
    </div>

    {/* Score */}
    <div className="mt-6 text-center">
      <h1 className="text-5xl font-extrabold text-yellow-400">
        {profile.totalSolved}
      </h1>

      <p className="mt-1 text-sm text-slate-400">
        Problems Solved
      </p>
    </div>

    {/* Progress */}
    <div className="mt-6">

      <div className="mb-2 flex justify-between text-sm">
        <span>Goal 500</span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2 rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>

    {/* Stats */}
    <div className="mt-6 grid grid-cols-3 gap-3">

      <div className="rounded-xl bg-green-500/10 p-3 text-center">
        <div className="text-lg font-bold text-green-400">
          {profile.easySolved}
        </div>
        <div className="text-xs text-slate-400">
          Easy
        </div>
      </div>

      <div className="rounded-xl bg-yellow-500/10 p-3 text-center">
        <div className="text-lg font-bold text-yellow-400">
          {profile.mediumSolved}
        </div>
        <div className="text-xs text-slate-400">
          Medium
        </div>
      </div>

      <div className="rounded-xl bg-red-500/10 p-3 text-center">
        <div className="text-lg font-bold text-red-400">
          {profile.hardSolved}
        </div>
        <div className="text-xs text-slate-400">
          Hard
        </div>
      </div>

    </div>

  </div>
);
}