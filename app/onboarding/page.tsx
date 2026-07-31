"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { COMPANIES, TRACKS, Track } from "@/lib/data";
import { useCareerStore } from "@/lib/store";
import GlassCard from "@/components/GlassCard";

const currentYear = new Date().getFullYear();
const GRAD_YEARS = Array.from({ length: 6 }, (_, i) => currentYear + i);

export default function OnboardingPage() {
  const router = useRouter();
  const onboarded = useCareerStore((s) => s.onboarded);
  const completeOnboarding = useCareerStore((s) => s.completeOnboarding);

  const [name, setName] = useState("");
  const [dreamCompanyId, setDreamCompanyId] = useState(COMPANIES[0].id);
  const [gradYear, setGradYear] = useState(GRAD_YEARS[1]);
  const [semester, setSemester] = useState(5);
  const [track, setTrack] = useState<Track>(TRACKS[0]);

  useEffect(() => {
    if (onboarded) router.replace("/dashboard");
  }, [onboarded, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    completeOnboarding({
      name: name.trim() || "Future Engineer",
      dreamCompanyId,
      gradYear,
      semester,
      track,
    });
    router.push("/missions");
  }

  return (
    <main className="mx-auto flex min-h-screen w-[95%] max-w-3xl flex-col items-center justify-center gap-8 py-16">
      <div className="text-center">
        <p className="mb-3 inline-block rounded-full glass px-4 py-1 text-xs uppercase tracking-widest text-neon-cyan">
          Mission Zero → Dream Job
        </p>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="gradient-text">Career Operating System</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Tell us where you&apos;re headed. We&apos;ll turn it into a daily game plan —
          missions, XP, streaks, and a live readiness score for your dream company.
        </p>
      </div>

      <GlassCard className="w-full gradient-border">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aditi Sharma"
              className="w-full rounded-xl glass px-4 py-2.5 text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Dream company</label>
              <select
                value={dreamCompanyId}
                onChange={(e) => setDreamCompanyId(e.target.value)}
                className="w-full rounded-xl glass px-4 py-2.5 text-sm outline-none"
              >
                {COMPANIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-base-900">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Career track</label>
              <select
                value={track}
                onChange={(e) => setTrack(e.target.value as Track)}
                className="w-full rounded-xl glass px-4 py-2.5 text-sm outline-none"
              >
                {TRACKS.map((t) => (
                  <option key={t} value={t} className="bg-base-900">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Graduation year</label>
              <select
                value={gradYear}
                onChange={(e) => setGradYear(Number(e.target.value))}
                className="w-full rounded-xl glass px-4 py-2.5 text-sm outline-none"
              >
                {GRAD_YEARS.map((y) => (
                  <option key={y} value={y} className="bg-base-900">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Current semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full rounded-xl glass px-4 py-2.5 text-sm outline-none"
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((s) => (
                  <option key={s} value={s} className="bg-base-900">
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-full bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan px-6 py-3 font-display font-semibold text-white transition hover:brightness-110"
          >
            Start my journey →
          </button>
        </form>
      </GlassCard>
    </main>
  );
}