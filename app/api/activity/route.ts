import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";

function getLocalDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
    };

    const today = new Date();

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 364);

    const missions = await Mission.find({
      userId: decoded.id,
      completed: true,
      completedAt: {
        $gte: startDate,
      },
    }).sort({
      completedAt: 1,
    });

    const activityMap = new Map<
      string,
      {
        xp: number;
        missions: number;
      }
    >();

    missions.forEach((mission: any) => {
      if (!mission.completedAt) return;

      const key = getLocalDateKey(new Date(mission.completedAt));

      if (!activityMap.has(key)) {
        activityMap.set(key, {
          xp: 0,
          missions: 0,
        });
      }

      const current = activityMap.get(key)!;

      current.xp += mission.xp ?? 0;
      current.missions += 1;
    });

    const activity = [];

    for (let i = 0; i < 365; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);

      const key = getLocalDateKey(day);

      const info = activityMap.get(key);

      const xp = info?.xp ?? 0;

      let level = 0;

      if (xp >= 100) level = 4;
      else if (xp >= 60) level = 3;
      else if (xp >= 30) level = 2;
      else if (xp > 0) level = 1;

      activity.push({
        date: key,
        xp,
        missions: info?.missions ?? 0,
        level,
      });
    }

    return NextResponse.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Activity API Error:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}