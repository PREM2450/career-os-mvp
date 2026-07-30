import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `
You are an AI Career Mentor.

Generate exactly 4 daily tasks for a Computer Science student.

Student Details:
- Goal: AI Engineer
- XP: 160
- Streak: 1 Day

Rules:
- Return exactly 4 tasks.
- One task per line.
- Do not number the tasks.
- Keep each task under 12 words.
- Focus on DSA, Development, CS Fundamentals and Career.
`,
    });

    const text = response.text ?? "";

    const plan = text
      .split("\n")
      .map((line) => line.replace(/^[-*•\d.)\s]+/, "").trim())
      .filter(Boolean)
      .slice(0, 4);

    return NextResponse.json({
      success: true,
      source: "gemini",
      plan,
    });
  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Fallback plan if Gemini fails
    return NextResponse.json({
      success: true,
      source: "fallback",
      plan: [
        "Solve 2 LeetCode Medium problems",
        "Revise DBMS normalization",
        "Build Career OS for 1 hour",
        "Read Operating Systems scheduling",
      ],
      message: error?.message || "Gemini unavailable",
    });
  }
}