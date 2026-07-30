"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Target,
  Trophy,
  Mail,
  Volume2,
  Smartphone,
} from "lucide-react";

import useSettings from "@/hooks/useSettings";

export default function NotificationSettings() {
  const { settings, loading, saveSettings } = useSettings();

  const [missionReminder, setMissionReminder] = useState(true);
  const [goalReminder, setGoalReminder] = useState(true);
  const [achievementPopup, setAchievementPopup] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);

  useEffect(() => {
    if (!settings) return;

    setMissionReminder(
      settings.notifications?.missionReminder ?? true
    );

    setGoalReminder(
      settings.notifications?.goalReminder ?? true
    );

    setAchievementPopup(
      settings.notifications?.achievementPopup ?? true
    );

    setEmailNotification(
      settings.notifications?.emailNotification ?? false
    );

    setSoundEffects(
      settings.notifications?.soundEffects ?? true
    );

    setPushNotification(
      settings.notifications?.pushNotification ?? false
    );
  }, [settings]);

  async function handleSave() {
    await saveSettings({
      notifications: {
        missionReminder,
        goalReminder,
        achievementPopup,
        emailNotification,
        soundEffects,
        pushNotification,
      },
    });
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-center text-slate-400">
          Loading notification settings...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <div className="space-y-5">

        <Toggle
          icon={<Target size={20} />}
          title="Mission Reminder"
          description="Daily reminder to complete today's missions."
          value={missionReminder}
          setValue={setMissionReminder}
        />

        <Toggle
          icon={<Bell size={20} />}
          title="Goal Reminder"
          description="Receive reminders about your goals."
          value={goalReminder}
          setValue={setGoalReminder}
        />

        <Toggle
          icon={<Trophy size={20} />}
          title="Achievement Popups"
          description="Show achievement unlock animations."
          value={achievementPopup}
          setValue={setAchievementPopup}
        />

        <Toggle
          icon={<Mail size={20} />}
          title="Email Notifications"
          description="Weekly email updates."
          value={emailNotification}
          setValue={setEmailNotification}
        />

        <Toggle
          icon={<Volume2 size={20} />}
          title="Sound Effects"
          description="Play sounds when missions complete."
          value={soundEffects}
          setValue={setSoundEffects}
        />

        <Toggle
          icon={<Smartphone size={20} />}
          title="Push Notifications"
          description="Browser notifications."
          value={pushNotification}
          setValue={setPushNotification}
        />

      </div>

      <button
        onClick={handleSave}
        className="mt-8 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold transition hover:scale-105"
      >
        Save Notification Settings
      </button>

    </div>
  );
}

function Toggle({
  icon,
  title,
  description,
  value,
  setValue,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 p-5">

      <div>

        <div className="flex items-center gap-2 font-semibold">
          {icon}
          {title}
        </div>

        <p className="mt-1 text-sm text-slate-400">
          {description}
        </p>

      </div>

      <button
        onClick={() => setValue(!value)}
        className={`relative h-8 w-16 rounded-full transition ${
          value
            ? "bg-green-500"
            : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            value
              ? "left-9"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}