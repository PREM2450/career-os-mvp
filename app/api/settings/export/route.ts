import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";

import UserSettings from "@/models/UserSettings";
import Mission from "@/models/Mission";
import Achievement from "@/models/Achievement";
import Resume from "@/models/Resume";
import Goal from "@/models/Goal";

export async function GET() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const [
      settings,
      missions,
      achievements,
      resume,
      goals,
    ] = await Promise.all([
      UserSettings.findOne({ userId: user._id }),
      Mission.find({ userId: user._id }),
      Achievement.find({ userId: user._id }),
      Resume.findOne({ userId: user._id }),
      Goal.find({ userId: user._id }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),

      profile: {
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },

      settings,

      goals,

      missions,

      achievements,

      resume,
    };

    return new Response(
      JSON.stringify(exportData, null, 2),
      {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition":
            'attachment; filename="career-os-data.json"',
        },
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Export failed",
      },
      {
        status: 500,
      }
    );
  }
}