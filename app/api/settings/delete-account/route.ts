import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/getCurrentUser";

import User from "@/models/User";
import UserSettings from "@/models/UserSettings";
import Mission from "@/models/Mission";
import Achievement from "@/models/Achievement";
import Resume from "@/models/Resume";
import Goal from "@/models/Goal";

export async function DELETE() {
  try {
    await connectDB();

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = user._id;

    await Promise.all([
      Mission.deleteMany({ userId }),
      Achievement.deleteMany({ userId }),
      Goal.deleteMany({ userId }),
      Resume.deleteMany({ userId }),
      UserSettings.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    const response = NextResponse.json({
      success: true,
      message: "Account deleted successfully.",
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete account.",
      },
      {
        status: 500,
      }
    );
  }
}