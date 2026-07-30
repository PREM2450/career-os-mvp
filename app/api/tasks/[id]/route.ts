import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import Goal from "@/models/Goal";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  req: NextRequest,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Task ID",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Existing task
    const oldTask = await Task.findById(id);

    if (!oldTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    // Update task
    const task = await Task.findByIdAndUpdate(id, body, {
      new: true,
    });

    // XP only if completed status changed
    if (body.completed !== undefined && oldTask.completed !== body.completed) {

      const goal = await Goal.findById(task.goalId);

      if (goal) {
        const user = await User.findById(goal.userId);

        if (user) {

          if (body.completed) {
            // Add XP
            user.xp += task.xp;
          } else {
            // Remove XP
            user.xp = Math.max(0, user.xp - task.xp);
          }

          // Level Calculation
          user.level = Math.floor(user.xp / 100) + 1;

          // ---------- STREAK ----------

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (body.completed) {

            const last = user.lastActivityDate
              ? new Date(user.lastActivityDate)
              : null;

            if (last) {
              last.setHours(0, 0, 0, 0);

              const diff =
                (today.getTime() - last.getTime()) /
                (1000 * 60 * 60 * 24);

              if (diff === 1) {
                user.streak += 1;
              } else if (diff > 1) {
                user.streak = 1;
              }

            } else {
              user.streak = 1;
            }

            if (user.streak > user.longestStreak) {
              user.longestStreak = user.streak;
            }

            user.lastActivityDate = new Date();
          }

          await user.save();
        }
      }
    }

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