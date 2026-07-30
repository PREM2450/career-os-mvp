"use client";

export default function TestMissionPage() {
  async function createMission() {
    const res = await fetch("/api/missions", {
      method: "POST",
    });

    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  }

  async function getMissions() {
    const res = await fetch("/api/missions");

    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <div className="flex min-h-screen items-center justify-center gap-6 bg-[#070B17]">
      <button
        onClick={createMission}
        className="rounded-lg bg-violet-600 px-6 py-3 text-white"
      >
        Create Missions
      </button>

      <button
        onClick={getMissions}
        className="rounded-lg bg-green-600 px-6 py-3 text-white"
      >
        Get Missions
      </button>
    </div>
  );
}