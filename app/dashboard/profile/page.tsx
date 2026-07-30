"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();

  const [selectionChance, setSelectionChance] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) return;

      const data = await res.json();

      setSelectionChance(
        data?.stats?.selectionProbability ?? 0
      );
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-[#070B17] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">

        {/* Profile Picture */}
        <div className="flex justify-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-5xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Name */}
        <h1 className="mt-6 text-center text-3xl font-bold">
          {user?.name}
        </h1>

        <p className="mt-2 text-center text-slate-400">
          Career OS User
        </p>

        {/* Hiring Chance */}
        <div className="mt-8 rounded-2xl bg-white/10 p-6">

          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" />
            <span className="text-lg font-semibold">
              Chance of Getting Hired
            </span>
          </div>

          <h2 className="mt-5 text-center text-5xl font-black text-green-400">
            {selectionChance}%
          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-green-400 to-emerald-500 transition-all duration-700"
              style={{
                width: `${selectionChance}%`,
              }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}