export type SkillKey =
  | "dsa"
  | "development"
  | "csSubjects"
  | "aptitude"
  | "english"
  | "mockInterview";

export const SKILL_LABELS: Record<SkillKey, string> = {
  dsa: "DSA",
  development: "Development",
  csSubjects: "CS Subjects",
  aptitude: "Aptitude",
  english: "English",
  mockInterview: "Mock Interview",
};

export const SKILL_COLORS: Record<SkillKey, string> = {
  dsa: "#8b5cf6",
  development: "#3b82f6",
  csSubjects: "#22d3ee",
  aptitude: "#fb923c",
  english: "#f472b6",
  mockInterview: "#34d399",
};

export const TRACKS = [
  "Backend",
  "Frontend",
  "Full Stack",
  "AI / ML",
  "Mobile",
  "DevOps",
] as const;
export type Track = (typeof TRACKS)[number];

export interface Company {
  id: string;
  name: string;
  logoInitial: string;
  weights: Record<SkillKey, number>;
  color: string;
}

// Weights encode what each company's process leans on. They drive the
// readiness estimate — NOT an actual hiring probability.
export const COMPANIES: Company[] = [
  {
    id: "google",
    name: "Google",
    logoInitial: "G",
    color: "#8b5cf6",
    weights: { dsa: 0.4, development: 0.2, csSubjects: 0.15, aptitude: 0.05, english: 0.05, mockInterview: 0.15 },
  },
  {
    id: "amazon",
    name: "Amazon",
    logoInitial: "A",
    color: "#fb923c",
    weights: { dsa: 0.35, development: 0.2, csSubjects: 0.15, aptitude: 0.1, english: 0.05, mockInterview: 0.15 },
  },
  {
    id: "microsoft",
    name: "Microsoft",
    logoInitial: "M",
    color: "#3b82f6",
    weights: { dsa: 0.3, development: 0.25, csSubjects: 0.2, aptitude: 0.05, english: 0.05, mockInterview: 0.15 },
  },
  {
    id: "adobe",
    name: "Adobe",
    logoInitial: "Ad",
    color: "#f472b6",
    weights: { dsa: 0.25, development: 0.3, csSubjects: 0.15, aptitude: 0.05, english: 0.1, mockInterview: 0.15 },
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logoInitial: "F",
    color: "#22d3ee",
    weights: { dsa: 0.3, development: 0.25, csSubjects: 0.15, aptitude: 0.1, english: 0.05, mockInterview: 0.15 },
  },
  {
    id: "tcs",
    name: "TCS",
    logoInitial: "T",
    color: "#34d399",
    weights: { dsa: 0.15, development: 0.15, csSubjects: 0.2, aptitude: 0.3, english: 0.1, mockInterview: 0.1 },
  },
];

export interface LevelDef {
  name: string;
  minXp: number;
}

export const LEVELS: LevelDef[] = [
  { name: "Explorer", minXp: 0 },
  { name: "Programmer", minXp: 200 },
  { name: "Developer", minXp: 500 },
  { name: "Engineer", minXp: 1000 },
  { name: "Placement Ready", minXp: 2000 },
  { name: "Google Ready", minXp: 3500 },
  { name: "Legend", minXp: 6000 },
];

export interface MissionTemplate {
  skill: SkillKey;
  title: string;
  detail: string;
  xp: number;
}

// Rotating pools of mission content per skill. A day's mission for a skill
// is picked deterministically from the pool using the date, so the same
// day always shows the same task, but tasks vary day to day.
export const MISSION_POOLS: Record<SkillKey, MissionTemplate[]> = {
  dsa: [
    { skill: "dsa", title: "Solve 2 Array problems", detail: "Focus on two-pointer and sliding-window patterns.", xp: 40 },
    { skill: "dsa", title: "Practice Binary Trees", detail: "Solve 2 problems on traversals or BSTs.", xp: 40 },
    { skill: "dsa", title: "Dynamic Programming set", detail: "Attempt 1 medium DP problem end-to-end.", xp: 45 },
    { skill: "dsa", title: "Graphs warm-up", detail: "Implement BFS/DFS on a sample graph problem.", xp: 40 },
    { skill: "dsa", title: "Revise Linked Lists", detail: "Solve 2 problems on reversal / cycle detection.", xp: 35 },
  ],
  development: [
    { skill: "development", title: "Ship a feature", detail: "Add one real feature to your portfolio project.", xp: 45 },
    { skill: "development", title: "Write a REST endpoint", detail: "Design and implement one clean API route.", xp: 40 },
    { skill: "development", title: "Refactor a component", detail: "Clean up and document one messy module.", xp: 30 },
    { skill: "development", title: "Push to GitHub", detail: "Commit meaningful, well-described changes today.", xp: 30 },
  ],
  csSubjects: [
    { skill: "csSubjects", title: "OS: Revise scheduling", detail: "Summarize CPU scheduling algorithms in your notes.", xp: 30 },
    { skill: "csSubjects", title: "DBMS: Normalization", detail: "Work through 1NF–BCNF with an example schema.", xp: 30 },
    { skill: "csSubjects", title: "Networks: OSI model", detail: "Explain each layer with a real-world example.", xp: 30 },
    { skill: "csSubjects", title: "OOP concepts", detail: "Write short notes on the 4 pillars with code samples.", xp: 30 },
  ],
  aptitude: [
    { skill: "aptitude", title: "Quant practice set", detail: "Solve 10 quantitative aptitude questions.", xp: 25 },
    { skill: "aptitude", title: "Logical reasoning set", detail: "Solve 10 logical reasoning questions.", xp: 25 },
    { skill: "aptitude", title: "Data interpretation", detail: "Practice 1 DI set with graphs/tables.", xp: 25 },
  ],
  english: [
    { skill: "english", title: "Group discussion topic", detail: "Speak for 2 minutes on a current-affairs topic, recorded.", xp: 25 },
    { skill: "english", title: "Email writing", detail: "Draft a formal email for a hypothetical work scenario.", xp: 20 },
    { skill: "english", title: "Vocabulary builder", detail: "Learn 10 new words and use each in a sentence.", xp: 20 },
  ],
  mockInterview: [
    { skill: "mockInterview", title: "HR mock round", detail: "Answer 5 common HR questions out loud.", xp: 35 },
    { skill: "mockInterview", title: "Technical mock round", detail: "Explain 1 project deeply, anticipate follow-ups.", xp: 40 },
    { skill: "mockInterview", title: "Behavioral (STAR) practice", detail: "Prepare 2 STAR-format stories from your experience.", xp: 30 },
  ],
};

export const SKILL_ORDER: SkillKey[] = [
  "dsa",
  "development",
  "csSubjects",
  "aptitude",
  "english",
  "mockInterview",
];
