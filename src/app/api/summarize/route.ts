import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Document text is empty. Extraction failed." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 1. Primary Analysis Prompt (Strictly following user requirements)
    const primaryPrompt = `Analyze this document in depth. Identify the organizational hierarchy (e.g., Alpha-01, Underboss), financial rules (e.g., 70/20/10 system), and security protocols (e.g., The Vault, Burn Protocol). 
    
    Structure the response with clear Markdown headings. Use a professional and analytical tone.
    
    DOCUMENT TEXT:
    ${text.substring(0, 30000)}`;

    const primaryResult = await model.generateContent(primaryPrompt);
    const summaryText = primaryResult.response.text();

    // 2. High-Impact Strategic Highlights (Derived from the AI summary, no mocks)
    const highlightPrompt = `Based on the following analysis, provide exactly 3 short, high-impact strategic highlights (1 sentence each). Focus only on critical findings related to hierarchy, finance, or security. Do not use generic text.
    
    ANALYSIS: ${summaryText.substring(0, 5000)}`;
    
    const highlightResult = await model.generateContent(highlightPrompt);
    const highlightResponse = highlightResult.response.text();
    
    const highlights = highlightResponse
      .split("\n")
      .filter(line => line.trim().length > 10)
      .slice(0, 3)
      .map(line => line.replace(/^[-*•\d.]+\s*/, "").trim());

    return NextResponse.json({ 
      summary: summaryText, 
      highlights: highlights 
    });
    
  } catch (error: any) {
    console.error("Gemini Live Integration Error:", error);
    return NextResponse.json(
      { error: "AI Processing failed. Ensure your GEMINI_API_KEY is valid." },
      { status: 500 }
    );
  }
}
