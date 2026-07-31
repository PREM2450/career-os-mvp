"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-cyan-400 text-sm font-semibold tracking-widest uppercase">
        AI Powered Career Platform
      </p>

      <h1 className="text-5xl font-bold">
        Career <span className="text-cyan-400">Operating System</span>
      </h1>

      <p className="mt-6 max-w-2xl text-gray-400">
        Prepare for your dream company with AI Roadmaps, Daily Missions,
        GitHub Analysis, LeetCode Tracking and Resume Reviews.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/signup"
          className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-600"
        >
          Create Account
        </Link>

        <Link
          href="/login"
          className="rounded-lg border border-gray-600 px-6 py-3 font-semibold hover:bg-gray-800"
        >
          Login
        </Link>
      </div>
    </main>
  );
}