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

    const prompt = `
      You are a professional document analysis assistant. 
      Your task is to provide a highly detailed executive summary of the provided PDF text. 
      
      CRITICAL FOCUS AREAS:
      1. Command Hierarchy: Identify specific roles like Alpha-01, Underboss, and others mentioned.
      2. Financial Rules: Look for details on "Sistem 70/20/10" and mandatory deposits like "Rp25.000".
      3. Security Protocols: Detail "The Vault", "Admin Logistik", and "Burn Protocol".
      4. Target Regions & Agendas: Identify specific strategic plans for 2026.

      Use professional English, utilize clear headings, and use bullet points for readability.
      If the information is not present, state that it was not found in the provided text.

      TEXT TO ANALYZE:
      ${text.substring(0, 30000)} 
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text();

    // Also generate 3 strategic highlights separately for the sidebar
    const highlightPrompt = `Based on the following text, provide exactly 3 short, high-impact strategic highlights (1 sentence each). 
    Focus on hierarchy, finance, or security.
    
    TEXT: ${summaryText.substring(0, 2000)}`;
    
    const highlightResult = await model.generateContent(highlightPrompt);
    const highlightResponse = await highlightResult.response;
    const highlights = highlightResponse.text()
      .split("\n")
      .filter(line => line.trim().length > 5)
      .slice(0, 3)
      .map(line => line.replace(/^[-*•]\s*/, "").trim());

    return NextResponse.json({ 
      summary: summaryText, 
      highlights: highlights.length > 0 ? highlights : ["Strategic protocols detected.", "Financial rules extracted.", "Hierarchy identified."]
    });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "AI Processing failed. Please check your API configuration." },
      { status: 500 }
    );
  }
}
