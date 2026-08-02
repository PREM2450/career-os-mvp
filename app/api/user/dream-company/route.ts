import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const {
  dreamCompany,
  githubUsername,
  graduationYear,
  graduationMonth,
} = await req.json();
    const updateData: {
  dreamCompany?: string;
  githubUsername?: string;
  graduationYear?: number;
  graduationMonth?: number;
} = {};
    if (dreamCompany !== undefined) {
      updateData.dreamCompany = dreamCompany.trim();
    }

    if (githubUsername !== undefined) {
      updateData.githubUsername =
        githubUsername.trim();
    }
    if (graduationYear !== undefined) {
  updateData.graduationYear = graduationYear;
}

if (graduationMonth !== undefined) {
  updateData.graduationMonth = graduationMonth;
}

    const user = await User.findByIdAndUpdate(
      decoded.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await User.findById(decoded.id).select(
  "dreamCompany githubUsername graduationYear graduationMonth"
)

    return NextResponse.json({
  success: true,

  dreamCompany:
    user?.dreamCompany || "",

  githubUsername:
    user?.githubUsername || "",

  graduationYear:
    user?.graduationYear || null,

  graduationMonth:
    user?.graduationMonth || null,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile.",
      },
      { status: 500 }
    );
  }
}