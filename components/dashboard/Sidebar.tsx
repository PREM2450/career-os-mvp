"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Target,
  BookOpen,
  BarChart3,
  Bot,
  Trophy,
  User,
  Settings,
  LogOut,
  Rocket,
  FileText, // 👈 Add this
} from "lucide-react";


const menu = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },

  { icon: Target, label: "Goals", href: "/goal" },

  { icon: BookOpen, label: "Missions", href: "/missions" },

  {
    icon: FileText,
    label: "Resume",
    href: "/dashboard/resume",
  },

  { icon: BarChart3, label: "Analytics", href: "/analytics" },

 { icon: Bot, label: "AI Mentor", href: "/dashboard/mentor" },

  {
    icon: Trophy,
    label: "Achievements",
    href: "/achievements",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
        router.refresh();
      } else {
        alert("Logout failed.");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-white/10 bg-gradient-to-b from-[#0b1022] via-[#0d1228] to-[#050814] text-white">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* Logo */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500">
            <Rocket size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Career OS</h1>

            <p className="text-xs text-slate-400">
              Build Your Future
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30"
                    : "hover:bg-white/5"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 text-lg font-bold">
              P
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Prem Kumar
              </h2>

              <p className="text-xs text-slate-400">
                Explorer
              </p>
            </div>
          </div>

          {/* Profile Button */}
          <Link
            href="/dashboard/profile"
            className="mt-5 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10"
          >
            <User size={18} />
            <span>Profile</span>
          </Link>

          {/* Settings Button */}
          <Link
            href="/dashboard/settings"
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-white/10"
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/20 py-3 font-medium text-red-300 transition hover:bg-red-500/30"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}