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

          <div className="space-y-8 p-8">

            {/* Welcome Hero */}
            <WelcomeHero />

            {/* Progress + Resume + GitHub */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

              <div className="xl:col-span-2">
                <ProgressChart />
              </div>

              <ResumeTracker />

              <GitHubCard />

            </div>

            {/* Career + LeetCode */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              <CareerRoadmap />

              <LeetCodeCard />

            </div>

            {/* Activity + Leaderboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              <ActivityHeatmap />

              <Leaderboard />

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}