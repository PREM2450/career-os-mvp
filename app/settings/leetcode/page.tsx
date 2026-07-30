"use client";

import { useEffect, useState } from "react";

export default function LeetCodeSettings() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function connectAccount() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/leetcode/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });

    const data = await res.json();

    setLoading(false);

    setMessage(data.message);
  }

  async function syncAccount() {
    setSyncLoading(true);

    const res = await fetch("/api/leetcode/sync", {
      method: "POST",
    });

    const data = await res.json();

    setSyncLoading(false);

    setMessage(data.message || "Synced Successfully");
  }

  useEffect(() => {
    setUsername("prem2450");
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-12 bg-zinc-900 rounded-xl p-8 border border-zinc-700">

      <h1 className="text-3xl font-bold mb-8">
        Connect LeetCode
      </h1>

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="LeetCode Username"
        className="w-full p-4 rounded-lg bg-zinc-800 border border-zinc-700"
      />

      <button
        onClick={connectAccount}
        disabled={loading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg"
      >
        {loading ? "Connecting..." : "Connect"}
      </button>

      <button
        onClick={syncAccount}
        disabled={syncLoading}
        className="mt-4 w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg"
      >
        {syncLoading ? "Syncing..." : "Sync Progress"}
      </button>

      {message && (
        <div className="mt-6 text-center text-green-400">
          {message}
        </div>
      )}
    </div>
  );
}