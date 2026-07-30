import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { generateAI } from "@/lib/gemini";
import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import Goal from "@/models/Goal";
import Task from "@/models/Task";
import Resume from "@/models/Resume";

import { calculateReadiness } from "@/lib/calculateReadiness";




export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id || decoded.userId;

    const user = await User.findById(userId);

    const goals = await Goal.find({
      userId,
    });

    const goalIds = goals.map((g) => g._id);

    const totalTasks = await Task.countDocuments({
      goalId: {
        $in: goalIds,
      },
    });

    const completedTasks = await Task.countDocuments({
      goalId: {
        $in: goalIds,
      },
      completed: true,
    });
    const latestResume = await Resume.findOne({
  userId,
}).sort({ createdAt: -1 });

const atsScore = latestResume?.atsScore || 0;

const readiness = calculateReadiness({
  xp: user.xp,
  streak: user.streak,
  atsScore,
  tasksCompleted: completedTasks,
  totalTasks,
  company: user.dreamCompany,
});

    const prompt = `
You are an expert career mentor and interview coach.

Student Profile

Name: ${user.name}

Goal:
${user.goal}

Dream Company:
${user.dreamCompany || "Not Selected"}

XP:
${user.xp}

Level:
${user.level}

Current Streak:
${user.streak}

Resume ATS Score:
${atsScore}

Completed Tasks:
${completedTasks}

Pending Tasks:
${totalTasks - completedTasks}

Career Readiness:
${readiness.readiness}

Selection Probability:
${readiness.probability}%

Current Status:
${readiness.status}

Estimated Ready:
${readiness.estimatedMonths} months

Give practical advice based on THIS data.

Do not motivate without reason.

If ATS is low, suggest resume improvements.

If readiness is low, explain why.

If dream company exists, give company-specific advice.

Return ONLY valid JSON.

{
  "greeting":"",
  "summary":"",
  "focus":[
    "",
    "",
    ""
  ],
  "strengths":[
    "",
    ""
  ],
  "weaknesses":[
    "",
    ""
  ],
  "motivation":"",
  "nextGoal":""
}

No markdown.

Only JSON.
`;
   let text = await generateAI(prompt);
    
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let coach;

try {
  coach = JSON.parse(text);
} catch {
  coach = {
  greeting: "Welcome back 👋",
  summary:
    "Let's improve your placement readiness today.",
  focus: [
    "Complete today's study tasks",
    "Improve Resume ATS",
    "Solve LeetCode problems",
  ],
  strengths: [],
  weaknesses: [],
  motivation:
    "Small consistent improvements lead to big results.",
  nextGoal:
    "Increase your readiness score by improving your weakest area.",
};
}

    return NextResponse.json({
      success: true,
      coach,
    });

  } catch (err: any) {
  console.error("Daily Coach Error:", err);

  return NextResponse.json(
    {
      success: false,
      error: err?.message || "Unknown Error",
      stack:
        process.env.NODE_ENV === "development"
          ? err?.stack
          : undefined,
    },
    {
      status: 500,
    }
  );
}


}