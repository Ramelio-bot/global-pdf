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
      // 1. Ekstrak teks dari PDF (seperti OCR tapi untuk teks asli)
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const doc = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
      let text = "";
      for (let i = 1; i <= Math.min(doc.numPages, 5); i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((it: any) => it.str).join(" ");
      }

      // 2. Simulasi AI Summarizer (Placeholder untuk integrasi API)
      // Dalam implementasi nyata, kita akan mengirim 'text' ke GPT/Claude API
      await new Promise(r => setTimeout(r, 2000));
      
      setSummary(`[AI SUMMARY - PLACEHOLDER]\n\nDokumen "${file.name}" berisi informasi mengenai topik utama yang dibahas dalam 5 halaman pertama. \n\nKonteks Utama: Dokumen ini tampaknya merupakan materi profesional yang membutuhkan analisis mendalam. \n\nPoin Penting: \n- Analisis data terpadu \n- Kesimpulan strategis \n- Rekomendasi operasional.`);
      
    } catch (error) {
      console.error("AI Error:", error);
      alert("Gagal memproses rangkuman AI.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <Sparkles className="text-orange-500" /> AI Summarizer
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 flex flex-col items-center">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-3">
              Rangkum PDF dengan AI
            </h1>
            <p className="text-gray-600">Hemat waktu dengan rangkuman cerdas dari dokumen panjang Anda menggunakan teknologi AI.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center">
            <div className="mb-8">
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-orange-50 file:text-orange-600 hover:file:bg-orange-100 transition-all cursor-pointer" />
            </div>

            {file && !summary && (
              <button onClick={handleSummarize} disabled={isProcessing} className="bg-orange-500 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-orange-600 transition-all flex items-center gap-3 mx-auto">
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <BrainCircuit className="w-6 h-6" />}
                Rangkum dengan AI
              </button>
            )}

            {summary && (
              <div className="animate-in fade-in slide-in-from-bottom-4 text-left">
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">{summary}</pre>
                </div>
                <button onClick={() => setSummary("")} className="mt-6 text-sm font-bold text-orange-600 hover:underline">Rangkum file lain</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
