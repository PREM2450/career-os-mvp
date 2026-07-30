import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Goal from "@/models/Goal";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        {
          success: false,
          message: "Plan is required.",
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

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id || decoded.userId;

    console.log("========== USER ==========");
    console.log(userId);

    console.log("========== PLAN ==========");
    console.log(plan);

    // Extract only task titles
    const extractedTasks: string[] = (plan as string)
  .split("\n")
  .filter((line: string) => line.includes("**Task:**"))
  .map((line: string) =>
    line
      .replace("* **Task:**", "")
      .replace("**Task:**", "")
      .trim()
  );

    console.log("========== EXTRACTED TASKS ==========");
    console.log(extractedTasks);

    // Find latest goal
    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });

    if (!goal) {
      return NextResponse.json(
        {
          success: false,
          message: "No goal found. Please create a goal first.",
        },
        { status: 404 }
      );
    }

    // Delete previous tasks
    await Task.deleteMany({
      goalId: goal._id,
    });

    // Create new tasks
    const taskDocuments = extractedTasks.map((taskTitle: string) => ({
      goalId: goal._id,
      title: taskTitle,
      completed: false,
      xp: 20,
    }));

    console.log("========== TASK DOCUMENTS ==========");
    console.log(taskDocuments);

    await Task.insertMany(taskDocuments);

    return NextResponse.json({
      success: true,
      message: `${taskDocuments.length} tasks saved successfully.`,
      tasks: taskDocuments,
    });

  } catch (error: any) {
    console.error("SAVE PLAN ERROR");
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}