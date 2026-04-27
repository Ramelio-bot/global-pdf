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

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Precise System Prompt for High-Stakes Analysis
    const primaryPrompt = `
      Analyze this document in depth as a Senior Strategic Analyst.
      
      SPECIFIC REQUIREMENTS:
      1. Organizational Hierarchy: Identify and detail roles such as Alpha-01, Underboss, and other specific command structures mentioned.
      2. Financial Rules: Detail the "70/20/10 system" and any specific monetary requirements or deposit protocols.
      3. Security & Operational Protocols: Detail "The Vault", "Burn Protocol", and "Admin Logistik" procedures.
      4. Target Regions & Agendas: Identify strategic focus areas, specifically looking for references to "Solo", "Jogja", or key expansion markers for 2026.

      Output Format: Use clean Markdown with sharp headings. Be professional, direct, and exhaustive. 
      Do NOT use generic or placeholder text. If information is missing, explicitly state "Data not found in source text".

      DOCUMENT TEXT:
      ${text.substring(0, 35000)} 
    `;

    const primaryResult = await model.generateContent(primaryPrompt);
    const summaryText = primaryResult.response.text();

    // Generate 3 High-Impact Highlights directly from the analysis
    const highlightPrompt = `
      Based on the following analysis, provide exactly 3 short, high-impact strategic highlights (1 sentence each). 
      Focus ONLY on Hierarchy, Finance, or Security. 
      Use active, intelligence-grade language.
      
      ANALYSIS: ${summaryText.substring(0, 5000)}
    `;
    
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
    console.error("Gemini Critical Error:", error);
    return NextResponse.json(
      { error: `Internal API Error: ${error.message || "Unknown Failure"}` },
      { status: 500 }
    );
  }
}
