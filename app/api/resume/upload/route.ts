import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { checkAchievements } from "@/lib/achievements";

// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";

import { generateAI } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // ==========================
    // Connect Database
    // ==========================

    await connectDB();

    // ==========================
    // Authenticate User
    // ==========================

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

    let decoded: any;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        {
          status: 401,
        }
      );
    }

    const userId = decoded.id || decoded.userId;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User id missing",
        },
        {
          status: 401,
        }
      );
    }

    // ==========================
    // Read Uploaded File
    // ==========================

    const formData = await req.formData();

    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume file is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Convert to Buffer
    // ==========================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ==========================
    // Save PDF
    // ==========================

    const uploadDir = path.join(process.cwd(), "uploads");

    await fs.mkdir(uploadDir, {
      recursive: true,
    });

    const filename = `${Date.now()}-${file.name}`;

    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    // ==========================
    // Extract Resume Text
    // ==========================

    const pdfData = await pdf(buffer);

    const cleanedText = pdfData.text
      .replace(/\r/g, "")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    console.log("========== Resume ==========");
    console.log(cleanedText);
    console.log("============================");

    // ==========================
    // Gemini Prompt
    // ==========================

    const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

{
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "technicalSkills": [],
  "softSkills": [],
  "missingKeywords": [],
  "improvements": [],
  "companyRecommendations": []
}

Resume:

${cleanedText}
`;

    // ==========================
    // Generate AI Analysis
    // ==========================

    const aiResponse = await generateAI(prompt);

    console.log("========== Gemini Raw ==========");
    console.log(aiResponse);
    console.log("===============================");

    const cleanedAIResponse = aiResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let analysis: any;

    try {
      analysis = JSON.parse(cleanedAIResponse);
    } catch (err) {
      console.error("JSON Parse Error:", err);

      return NextResponse.json(
        {
          success: false,
          message: "Gemini returned invalid JSON.",
          rawResponse: aiResponse,
        },
        {
          status: 500,
        }
      );
    }

    console.log("========== Parsed Analysis ==========");
    console.log(analysis);
    console.log("=====================================");
        // ==========================
    // Save Resume Analysis
    // ==========================

    const resumeData = {
      userId,

      fileName: filename,

      atsScore: analysis.atsScore ?? 0,

      summary: analysis.summary ?? "",

      strengths: analysis.strengths ?? [],

      weaknesses: analysis.weaknesses ?? [],

      technicalSkills: analysis.technicalSkills ?? [],

      softSkills: analysis.softSkills ?? [],

      missingKeywords: analysis.missingKeywords ?? [],

      suggestions: analysis.improvements ?? [],

      companyRecommendations:
        analysis.companyRecommendations ?? [],
    };

    // Update existing resume if available,
    // otherwise create a new one.

   await Resume.findOneAndUpdate(
  {
    userId,
  },
  resumeData,
  {
    new: true,
    upsert: true,
    runValidators: true,
  }
);

// ==========================
// Update User Resume Status
// ==========================

await User.findByIdAndUpdate(userId, {
  resumeUploadedAt: new Date(),
});

// ==========================
// Check Achievements
// ==========================

await checkAchievements(userId);

console.log("========== Resume Saved ==========");
console.log(resumeData);
console.log("==================================");
    // ==========================
    // Success Response
    // ==========================

    return NextResponse.json({
      success: true,
      message: "Resume uploaded and analyzed successfully.",

      data: {
        fileName: filename,

        extractedText: cleanedText,

        analysis,
      },
    });
  } catch (error: any) {
    console.error("Resume Upload Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message || "Failed to upload resume.",
      },
      {
        status: 500,
      }
    );
  }
}