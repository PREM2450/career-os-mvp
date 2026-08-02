type ReadinessInput = {
  xp: number;
  streak: number;
  atsScore?: number;
  leetcodeSolved?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  projectScore?: number;
  communicationScore?: number;
  company?: string;

  graduationYear?: number;
  graduationMonth?: number;
};

const companyMultiplier: Record<string, number> = {
  Google: 1.0,
  Microsoft: 0.97,
  Amazon: 0.95,
  Adobe: 0.92,
  Atlassian: 0.92,
  Uber: 0.91,
  NVIDIA: 0.90,
  Flipkart: 0.88,
  Oracle: 0.85,
  Walmart: 0.84,
  TCS: 0.72,
  Infosys: 0.70,
  Wipro: 0.70,
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

export function calculateReadiness(data: ReadinessInput) {
  const xpScore = clamp((data.xp / 1000) * 100);

  const streakScore = clamp((data.streak / 30) * 100);

  const atsScore = data.atsScore ?? 50;

  const leetcodeScore = clamp(
    ((data.leetcodeSolved ?? 0) / 300) * 100
  );

  const taskScore = data.totalTasks
    ? clamp(
        ((data.tasksCompleted ?? 0) /
          data.totalTasks) *
          100
      )
    : 50;

  const projectScore = data.projectScore ?? 70;

  const communication =
    data.communicationScore ?? 60;

  // Dynamic Weight Distribution

let totalWeight = 0;
let readiness = 0;

// XP
readiness += xpScore * 0.20;
totalWeight += 0.20;

// Streak
readiness += streakScore * 0.10;
totalWeight += 0.10;

// Resume
readiness += atsScore * 0.25;
totalWeight += 0.25;

// Task Completion
readiness += taskScore * 0.25;
totalWeight += 0.25;

// LeetCode (only if available)
if ((data.leetcodeSolved ?? 0) > 0) {
  readiness += leetcodeScore * 0.10;
  totalWeight += 0.10;
}

// Projects (only if available)
if (data.projectScore !== undefined) {
  readiness += projectScore * 0.05;
  totalWeight += 0.05;
}

// Communication (only if available)
if (data.communicationScore !== undefined) {
  readiness += communication * 0.05;
  totalWeight += 0.05;
}

// Normalize to 100
readiness = readiness / totalWeight;

  const multiplier =
    companyMultiplier[data.company || ""] ?? 0.85;

  const probability = clamp(
    readiness * multiplier
  );

  let status = "Needs Improvement";

  if (probability >= 80)
    status = "Interview Ready";
  else if (probability >= 65)
    status = "Good Progress";
  else if (probability >= 45)
    status = "Average";

  const now = new Date();

const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

let estimatedMonths = 6; // default

if (
  data.graduationYear !== undefined &&
  data.graduationMonth !== undefined
) {
  estimatedMonths = Math.max(
    1,
    (data.graduationYear - currentYear) * 12 +
      (data.graduationMonth - currentMonth)
  );
}

  const strengths: string[] = [];
const weaknesses: string[] = [];
const nextWeekTarget: string[] = [];

if (atsScore >= 75)
  strengths.push("Strong ATS resume");
else {
  weaknesses.push("Resume ATS is below target");
  nextWeekTarget.push("Increase ATS score above 75");
}

if (leetcodeScore >= 60)
  strengths.push("Good DSA practice");
else {
  weaknesses.push("Solve more LeetCode problems");
  nextWeekTarget.push("Solve at least 15 LeetCode problems");
}

if (taskScore >= 80)
  strengths.push("Excellent consistency");
else {
  weaknesses.push("Daily task completion is low");
  nextWeekTarget.push("Complete at least 90% daily tasks");
}

if (communication >= 70)
  strengths.push("Good communication skills");
else {
  weaknesses.push("Improve communication skills");
  nextWeekTarget.push("Practice mock interviews");
}

if (projectScore >= 75)
  strengths.push("Strong project portfolio");
else {
  weaknesses.push("Projects need improvement");
  nextWeekTarget.push("Complete one portfolio-quality project");
}

let reason = "";

if (probability >= 80)
  reason =
    "Your overall profile is strong and you are close to being interview-ready.";
else if (probability >= 65)
  reason =
    "You have a solid foundation, but a few improvements can significantly increase your chances.";
else if (probability >= 45)
  reason =
    "Your profile is progressing, but resume, DSA, and consistency need attention.";
else
  reason =
    "Focus on building fundamentals before targeting top product companies.";

return {
  readiness: Math.round(readiness),
  probability: Math.round(probability),
  status,
  estimatedMonths,

  reason,
  strengths,
  weaknesses,
  nextWeekTarget,
};
}