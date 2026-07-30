import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        success: true,
        chats: [],
      });
    }

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id || decoded.userId;

    const chats = await Chat.find({ userId })
      .sort({ createdAt: 1 })
      .select("role message createdAt");

    return NextResponse.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load chat history",
      },
      { status: 500 }
    );
  }
}