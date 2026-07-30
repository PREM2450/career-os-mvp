import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Achievement from "@/models/Achievement";

const ALL_ACHIEVEMENTS = [
  {
    key: "first-task",
    title: "First Mission",
    description: "Complete your first mission.",
    icon: "🥇",
    category: "Mission",
    xpReward: 100,
  },
  {
    key: "7day",
    title: "7 Day Streak",
    description: "Maintain a 7-day streak.",
    icon: "🔥",
    category: "Streak",
    xpReward: 300,
  },
  {
    key: "resume-uploaded",
    title: "Resume Uploaded",
    description: "Upload your first resume.",
    icon: "📄",
    category: "Resume",
    xpReward: 100,
  },
  {
    key: "goal1",
    title: "First Goal",
    description: "Create your first career goal.",
    icon: "🎯",
    category: "Goal",
    xpReward: 100,
  },
  {
    key: "100xp",
    title: "100 XP Club",
    description: "Earn 100 XP.",
    icon: "⚡",
    category: "XP",
    xpReward: 100,
  },
];
export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id || decoded.userId;

    const unlocked = await Achievement.find({ userId });

    const unlockedMap = new Map(
      unlocked.map((a) => [a.key, a])
    );

    const achievements = ALL_ACHIEVEMENTS.map((item) => {
      const found = unlockedMap.get(item.key);

      return {
        ...item,
        unlocked: !!found,
        unlockedAt: found?.unlockedAt || null,
      };
    });

    const unlockedCount = achievements.filter(
      (a) => a.unlocked
    ).length;

    const progress = Math.round(
      (unlockedCount / achievements.length) * 100
    );

    return NextResponse.json({
      success: true,
      progress,
      total: achievements.length,
      unlocked: unlockedCount,
      achievements,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch achievements",
      },
      {
        status: 500,
      }
    );
  }
}