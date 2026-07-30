"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SkillKey, Track } from "./data";
import { daysBetween, emptySkillCompletion, todayKey } from "./logic";

export interface Profile {
  name: string;
  dreamCompanyId: string;
  gradYear: number;
  semester: number;
  track: Track;
}

interface CareerState {
  onboarded: boolean;
  theme: "dark" | "light";
  profile: Profile | null;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  skillCompletion: Record<SkillKey, number>;
  completedByDate: Record<string, string[]>; // dateKey -> mission ids completed
  history: { date: string; xp: number }[]; // for weekly report

  setTheme: (t: "dark" | "light") => void;
  completeOnboarding: (profile: Profile) => void;
  completeMission: (missionId: string, skill: SkillKey, xp: number) => void;
  resetProgress: () => void;
}

export const useCareerStore = create<CareerState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      theme: "dark",
      profile: null,
      xp: 0,
      streak: 0,
      lastActiveDate: null,
      skillCompletion: emptySkillCompletion(),
      completedByDate: {},
      history: [],

      setTheme: (t) => set({ theme: t }),

      completeOnboarding: (profile) => set({ onboarded: true, profile }),

      completeMission: (missionId, skill, xp) => {
        const state = get();
        const today = todayKey();
        const doneToday = state.completedByDate[today] ?? [];
        if (doneToday.includes(missionId)) return; // already logged

        // Streak logic: compare today to lastActiveDate
        let newStreak = state.streak;
        if (!state.lastActiveDate) {
          newStreak = 1;
        } else if (state.lastActiveDate === today) {
          newStreak = state.streak; // same day, already active
        } else {
          const gap = daysBetween(state.lastActiveDate, today);
          newStreak = gap === 1 ? state.streak + 1 : 1;
        }

        const newSkillCompletion = {
          ...state.skillCompletion,
          [skill]: Math.min(100, (state.skillCompletion[skill] ?? 0) + 15),
        };

        const newXp = state.xp + xp;

        const newHistory = [...state.history];
        const todayEntry = newHistory.find((h) => h.date === today);
        if (todayEntry) {
          todayEntry.xp += xp;
        } else {
          newHistory.push({ date: today, xp });
        }

        set({
          xp: newXp,
          streak: newStreak,
          lastActiveDate: today,
          skillCompletion: newSkillCompletion,
          completedByDate: { ...state.completedByDate, [today]: [...doneToday, missionId] },
          history: newHistory.slice(-30),
        });
      },

      resetProgress: () =>
        set({
          onboarded: false,
          profile: null,
          xp: 0,
          streak: 0,
          lastActiveDate: null,
          skillCompletion: emptySkillCompletion(),
          completedByDate: {},
          history: [],
        }),
    }),
    { name: "career-os-storage" }
  )
);
