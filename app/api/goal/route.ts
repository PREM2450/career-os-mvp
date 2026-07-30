import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Goal from "@/models/Goal";
import Task from "@/models/Task";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      goal,
      company,
      deadline,
      dailyHours,
      level,
    } = await req.json();

    if (!goal || !deadline) {
      return NextResponse.json(
        {
          success: false,
          message: "Goal and Deadline are required.",
        },
        {
          status: 400,
        }
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
        {
          status: 401,
        }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    // Update current goal in User
    await User.findByIdAndUpdate(decoded.id, {
      goal,
    });

    // Delete previous goal
    const oldGoal = await Goal.findOne({
      userId: decoded.id,
    });

    if (oldGoal) {
      await Task.deleteMany({
        goalId: oldGoal._id,
      });

      await Goal.findByIdAndDelete(oldGoal._id);
    }

    // Create new goal
    const newGoal = await Goal.create({
      userId: decoded.id,
      title: goal,
      company,
      deadline,
      dailyHours,
      level,
    });

    // Default Tasks
    const defaultTasks = [
      {
        title: "Complete today's study session",
        xp: 20,
      },
      {
        title: "Solve 2 LeetCode Problems",
        xp: 30,
      },
      {
        title: "Read one CS topic",
        xp: 15,
      },
      {
        title: "Revise yesterday's notes",
        xp: 15,
      },
      {
        title: "Build or improve project",
        xp: 40,
      },
    ];

    await Task.insertMany(
      defaultTasks.map((task) => ({
        goalId: newGoal._id,
        title: task.title,
        xp: task.xp,
      }))
    );

    return NextResponse.json({
      success: true,
      message: "Goal Created Successfully",
      goal: newGoal,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}