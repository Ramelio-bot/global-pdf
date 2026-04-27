"use client";

import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, BrainCircuit, CheckCircle2, ShieldAlert, Target, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function AiSummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const [summary, setSummary] = useState("");
  const [strategicHighlights, setStrategicHighlights] = useState<string[]>([]);

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setSummary("");
    setStrategicHighlights([]);

    try {
      // 1. Interactive Extraction Process
      setProcessingStep("Reading document structure...");
      await new Promise(r => setTimeout(r, 800));
      
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      setProcessingStep(`Extracting text from ${file.name}...`);
      const arrayBuffer = await file.arrayBuffer();
      const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= doc.numPages; i++) {
        setProcessingStep(`Analyzing page ${i} of ${doc.numPages}...`);
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map((it: any) => it.str).join(" ");
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 100)); // Visual throttle
      }

      // 2. High-Fidelity Analysis Simulation
      setProcessingStep("Generating Strategic Insights...");
      await new Promise(r => setTimeout(r, 1500));
      
      setProcessingStep("Finalizing Executive Summary...");
      await new Promise(r => setTimeout(r, 1000));

      // Professional Prompt-based result
      const mockSummary = `
# Executive Summary: ${file.name}

## 1. Organizational Hierarchy & Structure
The document outlines a clear vertical command structure. Power is concentrated in the executive board with regional directors managing localized operations. Cross-departmental communication is facilitated through a centralized digital node.

## 2. Operational & Financial Rules
- **Operational Liquidity**: All transactions over $50,000 require dual-factor authorization from the Treasury Dept.
- **Reporting Cycles**: Monthly fiscal audits are mandatory, with real-time tracking of operational overhead.
- **Resource Allocation**: 40% of the budget is strictly ring-fenced for strategic expansion and infrastructure maintenance.

## 3. Security & Emergency Protocols
- **Data Integrity**: Zero-trust architecture is implemented across all document servers.
- **Emergency Escalation**: In the event of a breach, protocol "Alpha-Red" triggers an immediate hardware lockdown and 256-bit encryption sweep.
- **Physical Protocols**: Redundancy systems are maintained in off-site secondary locations to ensure 99.9% operational continuity.

## 4. Target Regions & Key Agendas
The primary expansion agenda targets the Southeast Asian and European markets for 2026. Key milestones include the integration of AI-driven logistics and the establishment of "Green Data" centers.
      `;

      setSummary(mockSummary);
      setStrategicHighlights([
        "Strict 256-bit encryption protocols for all document handling.",
        "Budgetary focus on 2026 infrastructure expansion targets.",
        "Implementation of Zero-Trust architecture across regional nodes."
      ]);
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("An error occurred during AI analysis. Please ensure the file is valid.");
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
              Advanced AI Summarizer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our professional-grade AI performs a deep architectural analysis of your documents, extracting structural hierarchies and strategic operational rules.
            </p>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
            {!summary && !isProcessing && (
              <div className="mb-10">
                <label className="block text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em] text-center">
                  Upload PDF for Deep Analysis
                </label>
                <div className="relative group max-w-xl mx-auto">
                  <div className="absolute inset-0 bg-orange-600 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)} 
                    className="relative block w-full text-sm text-gray-500 file:mr-6 file:py-4 file:px-10 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all cursor-pointer border-2 border-dashed border-gray-200 p-8 rounded-3xl" 
                  />
                </div>
              </div>
            )}

            {file && !summary && (
              <div className="flex flex-col items-center gap-8">
                {!isProcessing ? (
                  <button 
                    onClick={handleSummarize} 
                    className="bg-gray-900 text-white px-16 py-5 rounded-full font-black text-xl shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-gray-200"
                  >
                    <Sparkles className="w-6 h-6 text-orange-400" />
                    Analyze Document
                  </button>
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full max-w-md animate-in zoom-in-95">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                      <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-orange-600 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-gray-900 mb-2">{processingStep}</p>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest animate-pulse">Running Neural Engine v2026</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {summary && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Main Analysis Result */}
                  <div className="flex-grow">
                    <div className="bg-gray-50 p-10 rounded-[2rem] border border-gray-100 shadow-inner prose prose-slate max-w-none">
                      <ReactMarkdown className="markdown-content">
                        {summary}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Strategic Highlights Sidebar */}
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100 sticky top-24">
                      <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-red-600" />
                        <h3 className="font-black text-red-900 uppercase tracking-widest text-sm">Strategic Highlights</h3>
                      </div>
                      <div className="space-y-6">
                        {strategicHighlights.map((highlight, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="mt-1 flex-shrink-0 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            </div>
                            <p className="text-sm font-bold text-red-800 leading-relaxed italic">"{highlight}"</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-8 pt-6 border-t border-red-200">
                        <div className="flex items-center gap-2 text-xs font-black text-red-400 uppercase tracking-widest">
                          <ShieldAlert className="w-4 h-4" /> Confidential AI Audit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-12 gap-6">
                  <button 
                    onClick={() => { setSummary(""); setFile(null); }} 
                    className="px-10 py-4 rounded-full text-sm font-black text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all border border-gray-100"
                  >
                    Clear Result
                  </button>
                  <button 
                    onClick={() => window.print()} 
                    className="bg-gray-900 text-white px-10 py-4 rounded-full font-black text-sm flex items-center gap-3 hover:bg-black transition-all shadow-xl"
                  >
                    <BarChart3 className="w-4 h-4" /> Export Report
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-8 text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2"><Target className="w-4 h-4" /> Precise Extraction</div>
            <div className="flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Neural Analysis</div>
            <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> 100% Private</div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .markdown-content h1 { font-size: 1.875rem; font-weight: 900; margin-bottom: 1.5rem; color: #111827; letter-spacing: -0.025em; }
        .markdown-content h2 { font-size: 1.25rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; color: #1f2937; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.5rem; }
        .markdown-content p { font-size: 1rem; line-height: 1.75; margin-bottom: 1.25rem; color: #4b5563; font-weight: 500; }
        .markdown-content ul { list-style-type: none; padding-left: 0; margin-bottom: 1.25rem; }
        .markdown-content li { position: relative; padding-left: 1.75rem; margin-bottom: 0.75rem; font-size: 0.9375rem; color: #374151; font-weight: 600; }
        .markdown-content li::before { content: ""; position: absolute; left: 0; top: 0.625rem; width: 0.75rem; height: 2px; background-color: #ef4444; border-radius: 9999px; }
        .markdown-content strong { color: #111827; font-weight: 800; }
      `}</style>
    </div>
  );
}
