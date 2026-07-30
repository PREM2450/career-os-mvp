import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const goalId = req.nextUrl.searchParams.get("goalId");

    const tasks = await Task.find({ goalId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const task = await Task.create(body);

    return NextResponse.json({
      success: true,
      task,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}