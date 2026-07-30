import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find(
      {},
      {
        name: 1,
        xp: 1,
        level: 1,
        streak: 1,
      }
    )
      .sort({
        xp: -1,
        streak: -1,
      })
      .limit(20);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
    });

  } catch (err) {
    console.error(err);

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