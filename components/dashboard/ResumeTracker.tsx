"use client";

import { useEffect, useState } from "react";
import { FileText, TrendingUp } from "lucide-react";

export default function ResumeTracker() {
  const [atsScore, setAtsScore] = useState(0);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();

      if (data.success) {
        setAtsScore(data.stats?.atsScore ?? 0);
      }
    } catch {}
  }

  const color =
    atsScore >= 80
      ? "text-green-400"
      : atsScore >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">

      <div className="flex items-center gap-3">

        <div className="rounded-xl bg-cyan-500/20 p-3">
          <FileText className="text-cyan-400" size={24} />
        </div>

        <div>
          <h3 className="font-semibold">
            Resume Score
          </h3>

          <p className="text-xs text-slate-400">
            ATS Compatibility
          </p>
        </div>

      </div>

      <div className={`mt-6 text-5xl font-bold ${color}`}>
        {atsScore}%
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">

        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
          style={{
            width: `${atsScore}%`,
          }}
        />

      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-green-400">

        <TrendingUp size={16} />

        Target 80+

      </div>

    </div>
  );
}