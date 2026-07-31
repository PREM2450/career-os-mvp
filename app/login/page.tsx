"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if (res.ok) {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Welcome Back 👋
          </h1>

          <p className="mt-3 text-slate-300">
            Login to continue your Career OS journey.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02] hover:shadow-lg disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="mt-8 text-center text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-cyan-400 hover:text-cyan-300"
          >
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}