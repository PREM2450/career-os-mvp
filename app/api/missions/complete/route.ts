import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";
import User from "@/models/User";
import Achievement from "@/models/Achievement";

export async function POST(req: NextRequest) {
  console.log("================================");
  console.log("🔥 COMPLETE API HIT");
  console.log("================================");

  try {
    await connectDB();

    const { missionId } = await req.json();

    if (!missionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Mission ID is required",
        },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id || decoded.userId;

    // ===========================
// Find Mission
// ===========================

console.log("Mission ID:", missionId);
console.log("User ID:", userId);

if (!mongoose.Types.ObjectId.isValid(missionId)) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid Mission ID",
    },
    { status: 400 }
  );
}

const mission = await Mission.findById(missionId);

console.log("Mission Found:", mission);

if (!mission) {
  return NextResponse.json(
    {
      success: false,
      message: "Mission not found",
    },
    { status: 404 }
  );
}

console.log("Mission User:", mission.userId.toString());
console.log("Logged User:", userId.toString());

if (mission.userId.toString() !== userId.toString()) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized mission access",
    },
    { status: 403 }
  );
}

    // ===========================
// Complete Mission
// ===========================

console.log("Before Update:", {
  id: mission._id.toString(),
  completed: mission.completed,
  completedAt: mission.completedAt,
});

mission.completed = true;
mission.completedAt = new Date();

// Save
await mission.save();

// Read again from DB
const updatedMission = await Mission.findById(mission._id).lean();

console.log("After Save:", updatedMission);

if (!updatedMission?.completed) {
  return NextResponse.json(
    {
      success: false,
      message: "Mission was not updated in database.",
    },
    {
      status: 500,
    }
  );
}

// ===========================
// Find User
// ===========================

const user = await User.findById(userId);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "User not found",
    },
    {
      status: 404,
    }
  );
}

    // ===========================
    // XP & Level
    // ===========================

    user.xp += mission.xp;
    user.level = Math.floor(user.xp / 100) + 1;

    // ===========================
    // Daily Streak
    // ===========================

    const today = new Date();

    const startToday = new Date(today);
    startToday.setHours(0, 0, 0, 0);

    const startYesterday = new Date(startToday);
    startYesterday.setDate(startYesterday.getDate() - 1);

    if (!user.lastActivityDate) {
      user.streak = 1;
    } else {
      const last = new Date(user.lastActivityDate);

      last.setHours(0, 0, 0, 0);

      if (last.getTime() === startToday.getTime()) {
        // already counted today
      } else if (last.getTime() === startYesterday.getTime()) {
        user.streak += 1;
      } else {
        user.streak = 1;
      }
    }

    user.lastActivityDate = today;

    if (user.streak > user.longestStreak) {
      user.longestStreak = user.streak;
    }

    await user.save();

    // ===========================
    // Achievement
    // ===========================

    let achievementUnlocked = false;

    const exists = await Achievement.findOne({
      userId: user._id,
      key: "first-task",
    });

    if (!exists) {
      await Achievement.create({
        userId: user._id,
        key: "first-task",
        title: "First Mission",
        description: "Completed your first mission.",
        category: "Mission",
        icon: "🥇",
        xpReward: 0,
        unlocked: true,
        unlockedAt: new Date(),
      });

      achievementUnlocked = true;
    }

    // ===========================
    // Response
    // ===========================

    return NextResponse.json({
      success: true,
      message: "Mission completed successfully.",
      xp: mission.xp,
      totalXP: user.xp,
      level: user.level,
      streak: user.streak,
      longestStreak: user.longestStreak,
      achievementUnlocked,
    });
  } catch (error) {
    console.error("Mission Complete Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}