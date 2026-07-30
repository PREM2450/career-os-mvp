"use client";

import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import MissionCard from "@/components/dashboard/MissionCard";

export default function MissionsPage() {
  return (
    <div className="min-h-screen bg-[#070B17] text-white">
      <div className="flex">
        <Sidebar />

        <main className="ml-72 flex-1 overflow-x-hidden">
          <Navbar />

          <div className="p-8">
            <h1 className="text-4xl font-bold">Today's Missions</h1>

            <div className="mt-8">
              <MissionCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}