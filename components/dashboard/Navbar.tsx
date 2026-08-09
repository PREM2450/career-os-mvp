"use client";

import { useEffect, useState } from "react";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Adobe",
  "Atlassian",
  "Uber",
  "NVIDIA",
  "Oracle",
  "Flipkart",
  "Walmart",
  "TCS",
  "Infosys",
  "Wipro",
];

export default function Navbar() {
  const [dreamCompany, setDreamCompany] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/user/dream-company");

      const data = await res.json();

      if (data.success) {
        setDreamCompany(data.dreamCompany || "");
        setGithubUsername(data.githubUsername || "");
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function saveProfile() {
  setSaving(true);

  try {
    const res = await fetch("/api/user/dream-company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dreamCompany,
        githubUsername,
      }),
    });

    const data = await res.json();

    console.log("Response:", data);

    if (data.success) {
      alert("✅ Profile Updated");

      // Reload latest profile from DB
      await loadProfile();
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  } finally {
    setSaving(false);
  }
}

  return (
  <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070B17]/90 backdrop-blur-xl">
    <div className="flex flex-col gap-4 px-8 py-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-400">
          Welcome back, Prem 👋
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">

        

        {/* GitHub */}

        <input
          type="text"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          placeholder="🐙 GitHub Username"
          className="h-11 w-64 rounded-xl border border-slate-700 bg-slate-900 px-4 text-white placeholder:text-gray-500 outline-none focus:border-cyan-500"
        />

        {/* Save */}

        <button
          onClick={saveProfile}
          disabled={saving}
          className="h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 font-semibold text-white transition hover:scale-105 disabled:opacity-50"
        >
          {saving ? "Saving..." : "💾 Save"}
        </button>

      </div>
    </div>
  </header>
);
}