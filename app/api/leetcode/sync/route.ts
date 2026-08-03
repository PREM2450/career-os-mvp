import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import LeetCode from "@/models/LeetCode";

const GRAPHQL_URL = "https://leetcode.com/graphql";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // ---------------- JWT ----------------

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
    ) as {
      id: string;
    };

    const user = await User.findById(decoded.id);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "User not found",
    },
    {
      status: 404,
    }
  );
}

console.log("USER ID:", user._id.toString());

const profile = await LeetCode.findOne({
  userId: user._id,
});

console.log("PROFILE:", profile);

    // ---------------- LeetCode Username ----------------
    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "LeetCode account not connected yet.",
        },
        {
          status: 404,
        }
      );
    }

    const username = profile.username;

    // ---------------- GraphQL ----------------

    const query =  `
query getUserProfile($username: String!) {

  matchedUser(username: $username) {

    username

    profile {
      ranking
      reputation
      starRating
    }

    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
  }
}
`;

    const response = await fetch(GRAPHQL_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
        variables: {
          username,
        },
      }),

      cache: "no-store",
    });

    const json = await response.json();
    console.log("GraphQL Response:");
console.log(JSON.stringify(json, null, 2));

    const data = json.data.matchedUser;

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid LeetCode username",
        },
        {
          status: 400,
        }
      );
    }

    const stats = data.submitStatsGlobal.acSubmissionNum;

const easy =
  stats.find((x: any) => x.difficulty === "Easy")?.count ?? 0;

const medium =
  stats.find((x: any) => x.difficulty === "Medium")?.count ?? 0;

const hard =
  stats.find((x: any) => x.difficulty === "Hard")?.count ?? 0;

const total =
  stats.find((x: any) => x.difficulty === "All")?.count ?? 0;

    profile.totalSolved = total;
    profile.easySolved = easy;
    profile.mediumSolved = medium;
    profile.hardSolved = hard;

    profile.ranking =
      data.profile?.ranking || 0;

    profile.lastSynced = new Date();

    await profile.save();

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
  console.error("SYNC ERROR:", error);

  return NextResponse.json(
    {
      success: false,
      message: error instanceof Error ? error.message : String(error),
    },
    {
      status: 500,
    }
  );
}
}