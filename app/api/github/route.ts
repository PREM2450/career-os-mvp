import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await User.findById(decoded.id).select(
      "githubUsername"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (!user.githubUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "GitHub username not set.",
        },
        { status: 400 }
      );
    }

    const githubRes = await fetch(
      `https://api.github.com/users/${user.githubUsername}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "Career-OS",
        },
        cache: "no-store",
      }
    );

    if (!githubRes.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "GitHub user not found.",
        },
        { status: 404 }
      );
    }

    const github = await githubRes.json();

    return NextResponse.json({
      success: true,

      profile: {
        username: github.login,

        name: github.name,

        avatar: github.avatar_url,

        bio: github.bio,

        company: github.company,

        location: github.location,

        blog: github.blog,

        publicRepos: github.public_repos,

        followers: github.followers,

        following: github.following,

        createdAt: github.created_at,

        profileUrl: github.html_url,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch GitHub profile.",
      },
      { status: 500 }
    );
  }
}