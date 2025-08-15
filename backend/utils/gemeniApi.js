import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
function safeOcrText(ocrText, maxChars = 5000) {
  if (!ocrText) return "";
  return ocrText.length > maxChars 
    ? ocrText.slice(0, maxChars) + "\n...[OCR content truncated for brevity]"
    : ocrText;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiFeedback(ocrText, pdfUrl) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const truncatedOcr = safeOcrText(ocrText);

  const prompt = `
You are an AI teacher assistant evaluating a student's assignment.

You have two sources:
1. **OCR text from PDF** (may be truncated for token safety):
"""
${truncatedOcr}
"""

2. **Original PDF link** (contains diagrams, formatting, and complete text):
${pdfUrl}

Task:
1. Analyze both sources (use OCR for quick reading, refer to PDF for missing parts).
2. Give a short feedback summary.
3. Assign a score out of 100.

Respond with ONLY valid JSON:
{
  "summary": "...",
  "marks": 85
}
`;

  const result = await model.generateContent(prompt);
  const text = await result.response.text();

  try {
    // Remove any code fence formatting Gemini might add
    const cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Gemini response was not valid JSON:", text);
    throw new Error("Gemini response parse failed");
  }
}

