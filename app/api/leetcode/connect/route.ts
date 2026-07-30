import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";

import User from "@/models/User";
import LeetCode from "@/models/LeetCode";

const GRAPHQL_URL = "https://leetcode.com/graphql";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

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

    const { username } = await req.json();

    if (!username) {
      return NextResponse.json(
        {
          success: false,
          message: "Username required",
        },
        {
          status: 400,
        }
      );
    }

    // Verify username exists on LeetCode
    const query = `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
          username
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
    });

    const json = await response.json();

    if (!json.data?.matchedUser) {
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

    const profile = await LeetCode.findOneAndUpdate(
      {
        userId: user._id,
      },
      {
        userId: user._id,
        username,
        profileUrl: `https://leetcode.com/u/${username}/`,
        lastSynced: new Date(),
      },
      {
        new: true,
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "LeetCode connected successfully",
      data: profile,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Connection failed",
      },
      {
        status: 500,
      }
    );
  }
}