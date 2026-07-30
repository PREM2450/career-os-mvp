"use client";

import { useEffect } from "react";
import {
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Palette,
  Layers,
} from "lucide-react";

import { useTheme } from "@/context/ThemeContext";
import useSettings from "@/hooks/useSettings";

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#EF4444",
];

export default function AppearanceSettings() {
  const { settings, loading, saveSettings } = useSettings();

  const {
    theme,
    accentColor,
    animations,
    glassmorphism,
    setTheme,
    setAccentColor,
    setAnimations,
    setGlassmorphism,
  } = useTheme();

  useEffect(() => {
    if (!settings) return;

    setTheme(settings.appearance?.theme ?? "dark");
    setAnimations(settings.appearance?.animations ?? true);
    setGlassmorphism(
      settings.appearance?.glassmorphism ?? true
    );
    setAccentColor(
      settings.appearance?.accentColor ?? COLORS[0]
    );
  }, [
    settings,
    setTheme,
    setAnimations,
    setGlassmorphism,
    setAccentColor,
  ]);

  async function handleSave() {
    await saveSettings({
      appearance: {
        theme,
        accentColor,
        animations,
        glassmorphism,
      },
    });
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="text-center text-slate-400">
          Loading appearance settings...
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      {/* Theme */}

      <div className="mb-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Moon className="text-violet-400" size={20} />
          Theme
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <ThemeCard
            icon={<Moon size={22} />}
            title="Dark"
            active={theme === "dark"}
            onClick={() => setTheme("dark")}
          />

          <ThemeCard
            icon={<Sun size={22} />}
            title="Light"
            active={theme === "light"}
            onClick={() => setTheme("light")}
          />

          <ThemeCard
            icon={<Monitor size={22} />}
            title="System"
            active={theme === "system"}
            onClick={() => setTheme("system")}
          />
        </div>
      </div>

      {/* Animations */}

      <Toggle
        title="Enable Animations"
        description="Smooth transitions and hover effects."
        icon={<Sparkles size={20} />}
        value={animations}
        setValue={setAnimations}
      />

      {/* Glass */}

      <div className="mt-6">
        <Toggle
          title="Glassmorphism UI"
          description="Enable blur and glass effects."
          icon={<Layers size={20} />}
          value={glassmorphism}
          setValue={setGlassmorphism}
        />
      </div>

      {/* Accent */}

      <div className="mt-8">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Palette className="text-cyan-400" size={20} />
          Accent Color
        </h3>

        <div className="flex gap-4">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              className={`h-12 w-12 rounded-full border-4 transition ${
                accentColor === color
                  ? "scale-110 border-white"
                  : "border-transparent"
              }`}
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-10 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold transition hover:scale-105"
      >
        Save Appearance
      </button>

    </div>
  );
}

function ThemeCard({
  icon,
  title,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 transition ${
        active
          ? "border-violet-500 bg-violet-500/20"
          : "border-white/10 hover:border-violet-400"
      }`}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <p className="font-semibold">{title}</p>
    </button>
  );
}

function Toggle({
  title,
  description,
  icon,
  value,
  setValue,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: boolean;
  setValue: (value: boolean) => void;
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
          value ? "bg-green-500" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
            value ? "left-9" : "left-1"
          }`}
        />
      </button>

    </div>
  );
}