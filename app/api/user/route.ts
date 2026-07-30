import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    console.log("==================================");
    console.log("Database:", mongoose.connection.db?.databaseName);
    console.log(
      "Collections:",
      Object.keys(mongoose.connection.collections)
    );

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
    ) as {
      id: string;
      email: string;
    };

    console.log("Decoded Token:", decoded);

    // RAW MongoDB Query
    const rawUser = await mongoose.connection.db
      ?.collection("users")
      .findOne({
        email: decoded.email,
      });

    console.log("RAW USER:", rawUser);

    // Mongoose Query
    const userById = await User.findById(decoded.id).select("-password");
    console.log("User By ID:", userById);

    const userByEmail = await User.findOne({
      email: decoded.email,
    }).select("-password");
    console.log("User By Email:", userByEmail);

    return NextResponse.json({
      success: true,
      rawUser,
      user: userById,
    });

  } catch (error) {
    console.error("USER API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}