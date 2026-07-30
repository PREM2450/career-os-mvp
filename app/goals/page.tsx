"use client";

import { useEffect, useState } from "react";
import GoalCard from "@/components/goals/GoalCard";
import { useUser } from "@/context/UserContext";

interface Goal {
  _id: string;
  title: string;
  deadline: string;
}

interface Task {
  _id: string;
  goalId: string;
  title: string;
  completed: boolean;
  xp: number;
}

export default function GoalsPage() {
  const [title, setTitle] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>({});
  const { refreshUser } = useUser();

  async function fetchGoals() {
    const res = await fetch("/api/goals");
    const data = await res.json();

    if (data.success) {
      setGoals(data.goals);

      for (const goal of data.goals) {
        fetchTasks(goal._id);
      }
    }
  }

  async function fetchTasks(goalId: string) {
    const res = await fetch(`/api/tasks?goalId=${goalId}`);
    const data = await res.json();

    if (data.success) {
      setTasks((prev) => ({
        ...prev,
        [goalId]: data.tasks,
      }));
    }
  }

  useEffect(() => {
    fetchGoals();
  }, []);

  async function saveGoal() {
    if (!title.trim()) return;

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        deadline: "2026-12-31",
      }),
    });

    const data = await res.json();

    if (data.success) {
      setTitle("");
      fetchGoals();
    }
  }

  async function deleteGoal(id: string) {
    if (!confirm("Delete this goal?")) return;

    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      fetchGoals();
    }
  }

  async function toggleTask(id: string, completed: boolean) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      completed,
    }),
  });

  await fetchGoals();
  await refreshUser();
}

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    fetchGoals();
  }

  return (    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          🎯 Career Goals
        </h1>

        <p className="text-gray-400 mb-10">
          Build your dream career one goal at a time.
        </p>

        {/* Add Goal */}

        <div className="rounded-3xl bg-white/10 border border-white/10 backdrop-blur-xl p-6 mb-10">

          <div className="flex gap-4">

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your dream goal..."
              className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-5 py-4 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={saveGoal}
              className="rounded-xl bg-indigo-600 px-8 hover:bg-indigo-500 transition"
            >
              Save Goal
            </button>

          </div>

        </div>

        {goals.length === 0 ? (

          <div className="rounded-3xl bg-white/10 p-10 text-center">

            <div className="text-7xl mb-5">
              🎯
            </div>

            <h2 className="text-3xl font-bold">
              No Goals Yet
            </h2>

            <p className="text-gray-400 mt-3">
              Create your first career goal.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-8">

            {goals.map((goal) => (

              <GoalCard
  key={goal._id}
  goal={goal}
  tasks={tasks[goal._id] || []}
  onToggleTask={toggleTask}
  onDeleteTask={deleteTask}
  onDeleteGoal={deleteGoal}
  onTaskAdded={fetchTasks}
/>

            ))}

          </div>

        )}

      </div>
    </div>
  );
};