"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  Brain,
  BookOpen,
  Target,
  Rocket,
  Save,
} from "lucide-react";

import useSettings from "@/hooks/useSettings";

export default function AIPreferences() {
  const { settings, loading, saveSettings } = useSettings();

  const [difficulty, setDifficulty] = useState("Adaptive");
  const [missionCount, setMissionCount] = useState(5);
  const [learningStyle, setLearningStyle] = useState("Mixed");
  const [motivation, setMotivation] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [roadmapUpdate, setRoadmapUpdate] = useState(true);

  useEffect(() => {
    if (!settings) return;

    setDifficulty(settings.ai?.difficulty ?? "Adaptive");
    setMissionCount(settings.ai?.missionCount ?? 5);
    setLearningStyle(settings.ai?.learningStyle ?? "Mixed");
    setMotivation(settings.ai?.motivation ?? true);
    setStrictMode(settings.ai?.strictMode ?? false);
    setRoadmapUpdate(settings.ai?.roadmapUpdate ?? true);
  }, [settings]);

  async function handleSave() {
    await saveSettings({
      ai: {
        difficulty,
        missionCount,
        learningStyle,
        motivation,
        strictMode,
        roadmapUpdate,
      },
    });
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <p className="text-center text-slate-400">
          Loading AI Preferences...
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <SectionTitle
        icon={<Brain size={20} />}
        title="Mission Difficulty"
      />

      <Select
        value={difficulty}
        setValue={setDifficulty}
        options={["Easy", "Medium", "Hard", "Adaptive"]}
      />

      <div className="mt-8">
        <SectionTitle
          icon={<Target size={20} />}
          title="Daily Mission Count"
        />

        <Select
          value={String(missionCount)}
          setValue={(v: string) => setMissionCount(Number(v))}
          options={["3", "5", "7", "10"]}
        />
      </div>

      <div className="mt-8">
        <SectionTitle
          icon={<BookOpen size={20} />}
          title="Learning Style"
        />

        <Select
          value={learningStyle}
          setValue={setLearningStyle}
          options={[
            "Coding",
            "Reading",
            "Video",
            "Mixed",
          ]}
        />
      </div>

      <div className="mt-10 space-y-5">

        <Toggle
          icon={<Bot size={20} />}
          title="AI Motivation Messages"
          description="Receive motivational tips."
          value={motivation}
          setValue={setMotivation}
        />

        <Toggle
          icon={<Rocket size={20} />}
          title="Strict Mode"
          description="Generate harder AI missions."
          value={strictMode}
          setValue={setStrictMode}
        />

        <Toggle
          icon={<Target size={20} />}
          title="Auto Career Roadmap Updates"
          description="AI updates roadmap automatically."
          value={roadmapUpdate}
          setValue={setRoadmapUpdate}
        />

      </div>

      <button
        onClick={handleSave}
        className="mt-10 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold transition hover:scale-105"
      >
        <Save size={18} />
        Save AI Preferences
      </button>

    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
      {icon}
      {title}
    </div>
  );
}

function Select({
  value,
  setValue,
  options,
}: {
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-violet-500"
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
        >
          {option}
        </option>
      ))}
    </select>
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