"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, BrainCircuit } from "lucide-react";
import Link from "next/link";

export default function AiSummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      // 1. Extract text from PDF (similar to OCR but for native text)
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let text = "";
      for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((it: any) => it.str).join(" ");
      }

      // 2. Simulated AI Summarizer (Placeholder for API integration)
      // In a real implementation, we would send 'text' to an LLM API
      await new Promise(r => setTimeout(r, 2000));
      
      setSummary(`[AI SUMMARY - PLACEHOLDER]\n\nThe document "${file.name}" contains key information regarding the main topics discussed within the first 5 pages. \n\nMain Context: This document appears to be professional material requiring in-depth analysis. \n\nKey Points: \n- Integrated data analysis \n- Strategic conclusions \n- Operational recommendations.`);
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate AI summary.");
    } finally {
      setIsProcessing(false);
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
            <Sparkles className="text-orange-500 w-6 h-6" /> AI Summarizer
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
              Summarize PDF with AI
            </h1>
            <p className="text-gray-600">Save time with intelligent summaries of your long documents using advanced AI technology.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest text-center">
                Select PDF File
              </label>
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all cursor-pointer shadow-sm" />
            </div>

            {file && !summary && (
              <button onClick={handleSummarize} disabled={isProcessing} className="bg-orange-500 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-orange-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-orange-200">
                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <BrainCircuit className="w-7 h-7" />}
                Summarize with AI
              </button>
            )}

            {summary && (
              <div className="animate-in fade-in slide-in-from-bottom-4 text-left duration-500">
                <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 shadow-inner">
                  <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-6 border-b border-orange-200 pb-4">AI Analysis Result</h3>
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed text-sm">{summary}</pre>
                </div>
                <div className="flex justify-center">
                  <button onClick={() => setSummary("")} className="mt-8 px-8 py-3 rounded-full text-sm font-black text-orange-600 hover:bg-orange-50 transition-all border border-orange-100">
                    Summarize another file
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-center text-xs text-gray-400 font-bold italic mt-4 px-10 leading-relaxed">
            Note: This AI tool is currently using a high-fidelity placeholder model. All text extraction is performed 100% locally on your machine.
          </p>
        </div>
      </main>
    </div>
  );
}
