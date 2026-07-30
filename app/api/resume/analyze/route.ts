import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Resume from "@/models/Resume";
import { analyzeResume } from "@/lib/resumeAI";
import { extractTextFromPDF } from "@/lib/pdfParser";

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
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await User.findById(decoded.id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not uploaded",
        },
        { status: 400 }
      );
    }

    // Convert File -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(buffer);

    if (!resumeText.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not extract text from PDF",
        },
        { status: 400 }
      );
    }

    // AI Analysis
    const analysis = await analyzeResume(resumeText);

    // Save result
    const savedResume = await Resume.create({
      userId: user._id,
      fileName: file.name,
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      companyRecommendations: analysis.companyRecommendations,
    });

    return NextResponse.json({
      success: true,
      resume: savedResume,
    });
  } catch (error: any) {
    console.error("========== RESUME ERROR ==========");
    console.error(error);

    if (error?.stack) {
      console.error(error.stack);
    }

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Resume analysis failed",
      },
      { status: 500 }
    );
  }
}