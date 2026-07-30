import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserSettings from "@/models/UserSettings";

// Replace this with your existing auth helper
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: NextRequest) {
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

    let settings = await UserSettings.findOne({
      userId: user._id,
    });

    if (!settings) {
      settings = await UserSettings.create({
        userId: user._id,
      });
    }

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    const body = await req.json();

    let settings = await UserSettings.findOne({
      userId: user._id,
    });

    if (!settings) {
      settings = await UserSettings.create({
        userId: user._id,
      });
    }

    // Merge appearance settings
    if (body.appearance) {
      settings.appearance = {
        ...(settings.appearance?.toObject?.() ?? settings.appearance),
        ...body.appearance,
      };
    }

    // Merge notification settings
    if (body.notifications) {
      settings.notifications = {
        ...(settings.notifications?.toObject?.() ?? settings.notifications),
        ...body.notifications,
      };
    }

    // Merge AI settings
    if (body.ai) {
      settings.ai = {
        ...(settings.ai?.toObject?.() ?? settings.ai),
        ...body.ai,
      };
    }

    await settings.save();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update settings",
      },
      {
        status: 500,
      }
    );
  }
}