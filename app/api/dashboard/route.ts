import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

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
        {
          success: false,
          message: "Token not found",
        },
        { status: 401 }
      );
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    console.log("Decoded Token:", decoded);

    // Support both id and userId
    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id missing in token",
        },
        { status: 401 }
      );
    }

    const user = await User.findById(userId);

    console.log("User:", user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          userId,
        },
        { status: 404 }
      );
    }

    const goals = await Goal.find({
      userId: user._id,
    });

    const goalIds = goals.map((goal) => goal._id);

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

    const pendingTasks = totalTasks - completedTasks;
    // Today's Date
const today = new Date();
today.setHours(0, 0, 0, 0);

// 7 Days Ago
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 6);

// 30 Days Ago
const monthAgo = new Date(today);
monthAgo.setDate(monthAgo.getDate() - 29);

// Today's completed tasks
const todayCompleted = await Task.countDocuments({
  goalId: { $in: goalIds },
  completed: true,
  completedAt: { $gte: today },
});

// Weekly completed tasks
const weeklyCompleted = await Task.countDocuments({
  goalId: { $in: goalIds },
  completed: true,
  completedAt: { $gte: weekAgo },
});

// Monthly completed tasks
const monthlyCompleted = await Task.countDocuments({
  goalId: { $in: goalIds },
  completed: true,
  completedAt: { $gte: monthAgo },
});

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);
       const weeklyActivity: {
  day: string;
  completed: number;
}[] = [];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

for (let i = 6; i >= 0; i--) {
  const start = new Date(today);
  start.setDate(today.getDate() - i);

  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  const completed = await Task.countDocuments({
    goalId: { $in: goalIds },
    completed: true,
    completedAt: {
      $gte: start,
      $lt: end,
    },
  });

  weeklyActivity.push({
    day: days[start.getDay()],
    completed,
  });
}

   // Latest Resume
const latestResume = await Resume.findOne({
  userId: user._id,
}).sort({ createdAt: -1 });

const atsScore = latestResume?.atsScore || 0;

// XP Required For Next Level
const nextLevelXP = user.level * 100;

// AI Score
const aiScore = Math.min(
  100,
  Math.round(
    completionRate * 0.5 +
      Math.min(user.streak * 5, 25) +
      Math.min(user.level * 2, 25)
  )
);

// Readiness Calculation
const readiness = calculateReadiness({
  xp: user.xp,
  streak: user.streak,
  atsScore,
  tasksCompleted: completedTasks,
  totalTasks,
  company: user.dreamCompany,
});
    

    return NextResponse.json({
  success: true,
  stats: {
    // Existing Stats
    totalGoals: goals.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,

    // XP
    xp: user.xp,
    level: user.level,
    xpToNextLevel: nextLevelXP - user.xp,

    // Streak
    streak: user.streak,
    longestStreak: user.longestStreak,

    // Daily Stats
    todayCompleted,
    weeklyCompleted,
    monthlyCompleted,
    weeklyActivity,

    // AI Score
    aiScore,

    // Resume
    atsScore,

    // Dream Company
    dreamCompany: user.dreamCompany || "",

    // Career Intelligence
    readinessScore: readiness.readiness,
    selectionProbability: readiness.probability,
    readinessStatus: readiness.status,
    estimatedMonths: readiness.estimatedMonths,

    // Complete object (future use)
    readiness,
  },
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}