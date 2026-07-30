"use client";

export default function TestPage() {
  async function saveGoal() {
    const res = await fetch("/api/goal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal: "Google SDE",
      }),
    });

    const data = await res.json();

    console.log(data);
    alert(JSON.stringify(data));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070B17]">
      <button
        onClick={saveGoal}
        className="rounded-lg bg-violet-600 px-6 py-3 text-white hover:bg-violet-700"
      >
        Save Goal
      </button>
    </div>
  );
}