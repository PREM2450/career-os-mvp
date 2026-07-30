import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Goal from "@/models/Goal";

export async function GET() {
  try {
    await connectDB();

    const goals = await Goal.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      goals,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch goals",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const goal = await Goal.create(body);

    return NextResponse.json({
      success: true,
      goal,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create goal",
      },
      { status: 500 }
    );
  }
}