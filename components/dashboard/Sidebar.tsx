"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

  const [user, setUser] = useState<{ name: string } | null>(null);
  useEffect(() => {
  const fetchUser = async () => {
    const res = await fetch("/api/me");

    if (res.ok) {
     const data = await res.json();
      setUser(data);
    }
  };

  fetchUser();
}, []);

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
    <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col border-r border-[#2d2f52] bg-[#0A0D1C] text-white shadow-2xl">
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
        <nav className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            const active = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 rounded-xl px-5 py-3.5 transition-all duration-300 ${
                  active
? "bg-gradient-to-r from-[#7B2FF7] via-[#B620E0] to-[#FF00C8] text-white shadow-[0_0_35px_rgba(183,0,255,0.35)]"
: "text-slate-300 hover:bg-[#181C31] hover:text-white"
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
        <div className="rounded-[28px] border border-[#2C3154] bg-[#12162A] p-5 backdrop-blur-lg">
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B2FF7] to-[#4ACBFF] shadow-lg shadow-cyan-500/20">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <h2 className="font-semibold text-white">
                  {user?.name || "Loading..."}
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
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5A2030] to-[#6A2435] py-3 font-medium text-red-300 transition hover:from-[#6E273A] hover:to-[#7A2B40]"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}