"use client";

import AccountSettings from "@/components/settings/AccountSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AIPreferences from "@/components/settings/AIPreferences";
import AdvancedSettings from "@/components/settings/AdvancedSettings";

import {
  Settings,
  Shield,
  Palette,
  Bell,
  Bot,
  Wrench,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#070B17] text-white p-10">

      {/* Header */}

      <div className="mb-10 flex items-center gap-4">

        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 p-4">
          <Settings size={30} />
        </div>

        <div>
          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="text-slate-400">
            Customize your Career OS experience.
          </p>
        </div>

      </div>

      {/* Sections */}

      <div className="space-y-8">

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Shield className="text-cyan-400" />
            <h2 className="text-2xl font-bold">
              Account
            </h2>
          </div>

          <AccountSettings />
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Palette className="text-pink-400" />
            <h2 className="text-2xl font-bold">
              Appearance
            </h2>
          </div>

          <AppearanceSettings />
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Bell className="text-yellow-400" />
            <h2 className="text-2xl font-bold">
              Notifications
            </h2>
          </div>

          <NotificationSettings />
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Bot className="text-green-400" />
            <h2 className="text-2xl font-bold">
              AI Preferences
            </h2>
          </div>

          <AIPreferences />
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <Wrench className="text-red-400" />
            <h2 className="text-2xl font-bold">
              Advanced
            </h2>
          </div>

          <AdvancedSettings />
        </section>

      </div>

    </div>
  );
}