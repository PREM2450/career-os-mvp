import {
  Company,
  LEVELS,
  MISSION_POOLS,
  MissionTemplate,
  SKILL_ORDER,
  SkillKey,
} from "./data";

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** Deterministic pick so a given date always shows the same mission per skill. */
function pickForDate(pool: MissionTemplate[], dateKey: string, salt: string): MissionTemplate {
  let hash = 0;
  const str = dateKey + salt;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return pool[hash % pool.length];
}

export interface DailyMission extends MissionTemplate {
  id: string;
}

export function getMissionsForDate(dateKey: string): DailyMission[] {
  return SKILL_ORDER.map((skill) => {
    const template = pickForDate(MISSION_POOLS[skill], dateKey, skill);
    return { ...template, id: `${dateKey}-${skill}` };
  });
}

export function levelForXp(xp: number) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (xp >= lvl.minXp) current = lvl;
  }
  const idx = LEVELS.findIndex((l) => l.name === current.name);
  const next = LEVELS[idx + 1] ?? null;
  const progressToNext = next
    ? Math.min(1, (xp - current.minXp) / (next.minXp - current.minXp))
    : 1;
  return { current, next, progressToNext };
}

export function computeReadiness(
  skillCompletion: Record<SkillKey, number>,
  company: Company
): number {
  let score = 0;
  for (const skill of SKILL_ORDER) {
    score += (skillCompletion[skill] ?? 0) * company.weights[skill];
  }
  return Math.round(Math.min(100, score));
}

export function emptySkillCompletion(): Record<SkillKey, number> {
  return {
    dsa: 0,
    development: 0,
    csSubjects: 0,
    aptitude: 0,
    english: 0,
    mockInterview: 0,
  };
}

export function overallProgress(skillCompletion: Record<SkillKey, number>): number {
  const vals = SKILL_ORDER.map((s) => skillCompletion[s] ?? 0);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}
