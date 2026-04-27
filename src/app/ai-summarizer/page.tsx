"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, BrainCircuit, CheckCircle2, ShieldAlert, Target, TrendingUp, BarChart3, AlertTriangle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function AiSummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [summary, setSummary] = useState("");
  const [strategicHighlights, setStrategicHighlights] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setSummary("");
    setStrategicHighlights([]);
    setErrorMessage("");

    try {
      // 1. Thorough Text Extraction
      setProcessingStep("Initializing neural core...");
      
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let extractedText = "";
      for (let i = 1; i <= doc.numPages; i++) {
        setProcessingStep(`Extracting data from page ${i} of ${doc.numPages}...`);
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        extractedText += content.items.map((it: any) => it.str).join(" ") + "\n";
      }

      // 2. Data Validation
      if (!extractedText.trim()) {
        throw new Error("EMPTY_DATA: No readable text found in the PDF. Please check if the document is scanned or protected.");
      }

      // 3. Backend AI Call (Gemini Integration)
      setProcessingStep("Connecting to Global AI Grid...");
      
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to communicate with AI server.");
      }

      setProcessingStep("Compiling Strategic Intelligence...");
      const data = await response.json();
      console.log("Raw API Response:", data);
      
      setSummary(data.summary);
      setStrategicHighlights(data.highlights || []);
      
    } catch (error: any) {
      console.error("AI Analysis Error:", error);
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`);
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <Sparkles className="text-orange-500 w-6 h-6 animate-pulse" /> AI Analysis Engine
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-4">
              <BrainCircuit className="w-10 h-10 text-red-600" />
              Intelligence Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real-time deep analysis of hierarchies, financial systems, and security protocols using the latest AI models.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4 min-h-[400px] flex flex-col justify-center">
            {errorMessage && (
              <div className="bg-red-50 border border-red-100 p-8 rounded-3xl mb-10 animate-in zoom-in-95">
                <div className="flex items-center gap-4 text-red-600 mb-4">
                  <AlertTriangle className="w-8 h-8" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Critical Analysis Error</h3>
                </div>
                <p className="text-red-800 font-bold leading-relaxed">{errorMessage}</p>
                <button 
                  onClick={() => { setErrorMessage(""); setFile(null); }} 
                  className="mt-6 bg-red-600 text-white px-8 py-3 rounded-full font-black text-sm hover:bg-red-700 transition-all"
                >
                  Try Different Document
                </button>
              </div>
            )}

            {!summary && !isProcessing && !errorMessage && (
              <div className="mb-10 animate-in fade-in">
                <label className="block text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] text-center">
                  Feed Protocol Document
                </label>
                <div className="relative group max-w-xl mx-auto">
                  <div className="absolute inset-0 bg-red-600 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => { setFile(e.target.files?.[0] || null); setErrorMessage(""); }} 
                    className="relative block w-full text-sm text-gray-500 file:mr-6 file:py-4 file:px-10 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-gray-100 file:text-gray-900 hover:file:bg-red-600 hover:file:text-white transition-all cursor-pointer border-2 border-dashed border-gray-200 p-10 rounded-3xl" 
                  />
                </div>
              </div>
            )}

            {file && !summary && !errorMessage && (
              <div className="flex flex-col items-center gap-8">
                {!isProcessing ? (
                  <button 
                    onClick={handleSummarize} 
                    className="bg-red-600 text-white px-20 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-red-200"
                  >
                    <Sparkles className="w-8 h-8" />
                    RUN ANALYSIS
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-8 w-full max-w-md animate-in zoom-in-95">
                    <div className="relative">
                      <div className="w-24 h-24 border-4 border-red-50 border-t-red-600 rounded-full animate-spin"></div>
                      <ShieldAlert className="absolute inset-0 m-auto w-10 h-10 text-red-600 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-gray-900 mb-2">{processingStep}</p>
                      <div className="flex items-center justify-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                        Live API Stream Active
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {summary && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col lg:flex-row gap-10">
                  <div className="flex-grow">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-inner prose prose-slate max-w-none">
                      <div className="markdown-content">
                        <ReactMarkdown>
                          {summary}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl sticky top-24 border border-gray-800">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-red-500" />
                        <h3 className="font-black text-white uppercase tracking-widest text-sm">Strategic Core</h3>
                      </div>
                      <div className="space-y-6">
                        {strategicHighlights.map((highlight, i) => (
                          <div key={i} className="flex gap-4 group">
                            <div className="mt-1 flex-shrink-0 w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm font-bold text-gray-300 leading-relaxed italic">{highlight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-12 gap-6">
                  <button 
                    onClick={() => { setSummary(""); setFile(null); }} 
                    className="px-10 py-4 rounded-full text-sm font-black text-gray-400 hover:text-red-600 transition-all"
                  >
                    Analyze New Protocol
                  </button>
                  <button 
                    onClick={() => window.print()} 
                    className="bg-red-600 text-white px-10 py-4 rounded-full font-black text-sm flex items-center gap-3 hover:bg-red-700 transition-all shadow-xl"
                  >
                    <BarChart3 className="w-4 h-4" /> Download Intelligence Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .markdown-content h1 { font-size: 2.25rem; font-weight: 900; margin-bottom: 2rem; color: #111827; letter-spacing: -0.04em; line-height: 1; border-left: 6px solid #dc2626; padding-left: 1.5rem; }
        .markdown-content h2 { font-size: 1.5rem; font-weight: 900; margin-top: 3rem; margin-bottom: 1.5rem; color: #111827; letter-spacing: -0.02em; background: #fef2f2; padding: 0.75rem 1.5rem; border-radius: 1rem; color: #991b1b; }
        .markdown-content p { font-size: 1.125rem; line-height: 1.8; margin-bottom: 1.5rem; color: #374151; font-weight: 500; }
        .markdown-content ul { list-style-type: none; padding-left: 0; margin-bottom: 2rem; }
        .markdown-content li { position: relative; padding-left: 2rem; margin-bottom: 1rem; font-size: 1.0625rem; color: #1f2937; font-weight: 600; }
        .markdown-content li::before { content: "→"; position: absolute; left: 0; top: 0; color: #dc2626; font-weight: 900; }
        .markdown-content strong { color: #111827; font-weight: 900; text-decoration: underline; text-decoration-color: #fecaca; text-underline-offset: 4px; }
      `}</style>
    </div>
  );
}
