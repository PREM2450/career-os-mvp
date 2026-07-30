import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { generateAI } from "@/lib/gemini";
import Chat from "@/models/Chat";
import connectDB from "@/lib/mongodb";
import { buildAIContext } from "@/lib/ai";



export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: "Message is required",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    let aiContext = "";
let userId = "";
let chatHistory = "";

if (token) {
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    userId = decoded.id || decoded.userId;

    if (userId) {
      aiContext = await buildAIContext(userId);

      const previousChats = await Chat.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20);

      chatHistory = previousChats
        .reverse()
        .map(
          (chat: any) =>
            `${chat.role === "user" ? "User" : "AI"}: ${chat.message}`
        )
        .join("\n");
    }
  } catch (error) {
    console.log("AI Context Error:", error);
  }
}
    const systemPrompt = `
You are Career OS AI Coach.

Rules:
- Help users prepare for software engineering placements.
- Always personalize your response using the user's context if available.
- Explain concepts in simple language.
- If the user asks coding questions:
  1. Explain the intuition.
  2. Give the optimal approach.
  3. Provide code.
  4. Mention time and space complexity.
  5. Share interview tips.
- If the user asks for a roadmap, provide a structured daily plan.
- If the user asks "What should I study today?", recommend pending tasks first.
- Motivate the user using their XP, Level, Goal, and Streak.
- Keep answers well formatted using Markdown.
- If the user asks:
  "Make today's plan"
  "Generate today's plan"
  "Create today's schedule"
  "Plan my study"

Generate a structured study plan.

IMPORTANT:
Return the study plan ONLY in the following format.

Do NOT use markdown tables.
Do NOT use "|" characters.
Do NOT change this format.

#### Task 1
* **Time:** 09:00 AM - 10:00 AM
* **Task:** Learn Arrays
* **Duration:** 1 Hour
* **Why this task:** Improve DSA fundamentals.
* **XP Reward:** 20 XP

#### Task 2
* **Time:** ...
* **Task:** ...
* **Duration:** ...
* **Why this task:** ...
* **XP Reward:** ...

#### Task 3
...

Rules:
- Always use the user's pending tasks first.
- If there are no pending tasks, generate tasks according to the user's goal.
- Every task MUST contain exactly one line starting with:
  * **Task:**
- Never return the plan in a table.
- At the end write:
  **TOTAL XP:**
`;

    const finalPrompt = `
${systemPrompt}

========================
USER CONTEXT
========================

${aiContext}

========================
PREVIOUS CONVERSATION
========================

${chatHistory}

========================
CURRENT USER QUESTION
========================

${message}
`;

    const reply = await generateAI(finalPrompt);
    // Save chat history only if user is logged in
    if (userId) {
      await Chat.create({
        userId,
        role: "user",
        message,
      });

      await Chat.create({
        userId,
        role: "assistant",
        message: reply,
      });
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate response",
      },
      { status: 500 }
    );
  }
}