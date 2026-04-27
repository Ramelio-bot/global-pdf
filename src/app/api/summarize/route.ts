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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in the system." },
        { status: 500 }
      );
    }

    // Initialize Google Generative AI with the official SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the specific model name requested: gemini-1.5-flash
    // The SDK handles the API versioning automatically.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const primaryPrompt = `Analyze this document in depth. Identify the organizational hierarchy (e.g., Alpha-01, Underboss), financial rules (e.g., 70/20/10 system), and security protocols (e.g., The Vault, Burn Protocol). 
    Focus also on target regions like Solo and Jogja.
    
    Structure the response with clear Markdown headings. Use a professional and analytical tone.
    
    DOCUMENT TEXT:
    ${text.substring(0, 35000)}`;

    const primaryResult = await model.generateContent(primaryPrompt);
    const summaryText = primaryResult.response.text();

    const highlightPrompt = `Based on the following analysis, provide exactly 3 short, high-impact strategic highlights (1 sentence each). Focus only on critical findings related to hierarchy, finance, or security.
    
    ANALYSIS: ${summaryText.substring(0, 5000)}`;
    
    const highlightResult = await model.generateContent(highlightPrompt);
    const highlights = highlightResult.response.text()
      .split("\n")
      .filter(line => line.trim().length > 10)
      .slice(0, 3)
      .map(line => line.replace(/^[-*•\d.]+\s*/, "").trim());

    return NextResponse.json({ 
      summary: summaryText, 
      highlights: highlights 
    });
    
  } catch (error: any) {
    console.error("Gemini API Error (404/Auth):", error);
    // Return the actual error message for debugging as requested
    return NextResponse.json(
      { error: `Gemini API Error: ${error.message || "Internal Failure"}` },
      { status: error.status || 500 }
    );
  }
}
