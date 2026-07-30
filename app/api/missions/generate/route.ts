import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/mongodb";
import Mission from "@/models/Mission";
import Goal from "@/models/Goal";
import { generateAI } from "@/lib/gemini";

export async function POST() {
  try {
    console.log("\n========== Mission Generate API Called ==========");

    await connectDB();
    console.log("✅ MongoDB Connected");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      console.log("❌ Token not found");

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

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const userId = decoded.id || decoded.userId;

    console.log("✅ User ID:", userId);

    const today = new Date().toISOString().split("T")[0];

    console.log("📅 Today:", today);

    // Already generated?
    const existing = await Mission.find({
      userId,
      missionDate: today,
    });

    console.log("📌 Existing Missions:", existing.length);

    if (existing.length > 0) {
      console.log("✅ Returning existing missions");

      return NextResponse.json({
        success: true,
        missions: existing,
      });
    }

    const goal = await Goal.findOne({
      userId,
    }).sort({
      createdAt: -1,
    });

    console.log("🎯 Goal Document:");
    console.log(goal);

    if (!goal) {
      console.log("❌ No Goal Found");

      return NextResponse.json({
        success: false,
        message: "No goal found",
      });
    }

    // Try title first, then goal, then name
    const goalText =
      goal.title ||
      goal.goal ||
      goal.name ||
      "Software Engineer";

    console.log("🎯 Goal Used:", goalText);

    const prompt = `
You are an expert AI Career Mentor.

Career Goal:
${goalText}

Generate exactly 5 daily missions.

Return ONLY a JSON array.

Example:

[
  {
    "title":"Solve 2 Array Problems",
    "description":"Practice array questions on LeetCode",
    "category":"DSA",
    "difficulty":"Easy",
    "xp":20
  }
]
`;

    console.log("🤖 Calling Gemini...");

    const aiResponse = await generateAI(prompt);

    console.log("========== Gemini Raw Response ==========");
    console.log(aiResponse);
    console.log("=========================================");

    let missions;

    try {
      // Remove markdown if Gemini returns ```json ... ```
      const cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      missions = JSON.parse(cleaned);

      console.log("✅ JSON Parsed Successfully");
    } catch (err) {
      console.error("❌ JSON Parse Error");
      console.error(err);

      return NextResponse.json(
        {
          success: false,
          message: "Gemini returned invalid JSON",
          raw: aiResponse,
        },
        {
          status: 500,
        }
      );
    }

  console.log("📦 Parsed Missions:");
console.log(missions);

if (!Array.isArray(missions)) {
  console.error("❌ Gemini did not return an array");

  return NextResponse.json(
    {
      success: false,
      message: "Gemini response is not an array",
    },
    {
      status: 500,
    }
  );
}

const docs = missions.map((m: any) => ({
  userId,
  missionDate: today,
  title: String(m.title || "").trim(),
  description: String(m.description || ""),
  category: String(m.category || "General"),
  difficulty: ["Easy", "Medium", "Hard"].includes(m.difficulty)
    ? m.difficulty
    : "Easy",
  xp: Number(m.xp) || 20,
  completed: false,
}));

console.log("📄 Documents to Save:");
console.log(JSON.stringify(docs, null, 2));

try {
  console.log("🗑️ Removing today's existing missions...");

  await Mission.deleteMany({
    userId,
    missionDate: today,
  });

  console.log("💾 Saving Missions...");

  const saved = await Mission.insertMany(docs);

  console.log("✅ Saved:", saved.length);

  return NextResponse.json({
    success: true,
    missions: saved,
  });

} catch (err: any) {
  console.error("❌ INSERT ERROR");
  console.error(err);

  return NextResponse.json(
    {
      success: false,
      message: "Mission insert failed",
      error: err?.message,
      code: err?.code,
      stack:
        process.env.NODE_ENV === "development"
          ? err?.stack
          : undefined,
    },
    {
      status: 500,
    }
  );
}

} catch (err) {
  console.error("🔥 Mission Generator Error");
  console.error(err);

  return NextResponse.json(
    {
      success: false,
      message: "Failed to generate missions",
    },
    {
      status: 500,
    }
  );
}
}