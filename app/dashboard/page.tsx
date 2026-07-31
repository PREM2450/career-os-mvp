import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";

import WelcomeHero from "@/components/dashboard/WelcomeHero";

import ProgressChart from "@/components/dashboard/ProgressChart";
import ResumeTracker from "@/components/dashboard/ResumeTracker";
import GitHubCard from "@/components/dashboard/GitHubCard";

import CareerRoadmap from "@/components/dashboard/CareerRoadmap";
import LeetCodeCard from "@/components/dashboard/LeetCodeCard";

import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import Leaderboard from "@/components/dashboard/Leaderboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#070B17] text-white">
      <div className="flex">
        <Sidebar />

        <main className="ml-72 flex-1 overflow-x-hidden">
          <Navbar />

          <div className="space-y-6 p-8">

            {/* Hero */}
            <WelcomeHero />

            {/* Main Dashboard */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 items-start">

              {/* Left Side */}
              <div className="xl:col-span-6">
                <ProgressChart />
              </div>

              {/* Middle */}
              <div className="flex flex-col gap-6 xl:col-span-3">
                <ResumeTracker />
                <CareerRoadmap />
              </div>

              {/* Right */}
              <div className="flex flex-col gap-6 xl:col-span-3">
                <GitHubCard />
                <LeetCodeCard />
              </div>

            </div>

            {/* Bottom */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <ActivityHeatmap />
              <Leaderboard />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}