"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if (res.ok) {
      router.push("/login");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Create Account 🚀
          </h1>

          <p className="mt-3 text-slate-300">
            Start your AI-powered Career OS journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400"
            placeholder="Full Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400"
            placeholder="Email Address"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white placeholder:text-slate-400 outline-none transition focus:border-cyan-400"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-70"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}