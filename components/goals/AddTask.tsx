"use client";

import { useState } from "react";

interface AddTaskProps {
  goalId: string;
  onTaskAdded: () => void;
}

export default function AddTask({
  goalId,
  onTaskAdded,
}: AddTaskProps) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function addTask() {
    if (!title.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          goalId,
          title,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setTitle("");
        onTaskAdded();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="mt-6">
      <div className="flex gap-3">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add today's task..."
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={addTask}
          disabled={loading}
          className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold hover:bg-cyan-500 disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add"}
        </button>

      </div>
    </div>
  );
}