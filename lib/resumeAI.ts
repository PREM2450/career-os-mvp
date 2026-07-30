import { generateAI } from "@/lib/gemini";

export async function analyzeResume(resumeText: string) {
  const prompt = `
You are an expert ATS Resume Analyzer.

Analyze the resume below and return ONLY valid JSON.

Return this exact structure:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "companyRecommendations": []
}

Resume:

${resumeText}
`;

  const response = await generateAI(prompt);

  const cleaned = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned);
}