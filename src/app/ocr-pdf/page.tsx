"use client";

import { useState } from "react";
import Tesseract from "tesseract.js";
import { FileUp, ArrowLeft, Search, Loader2, Download, CheckCircle2, Languages } from "lucide-react";
import Link from "next/link";

export default function OcrPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOcrResult("");
    }
  };

  const processOcr = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = "";
      
      // Kita proses halaman pertama sebagai demo OCR (proses seluruh halaman PDF bisa sangat berat di client)
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({ canvasContext: context, viewport } as any).promise;
        const imageData = canvas.toDataURL("image/png");

        const result = await Tesseract.recognize(imageData, "eng", {
          logger: m => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          }
        });
        fullText = result.data.text;
      }

      setOcrResult(fullText);
    } catch (error) {
      console.error("OCR Error:", error);
      alert("Terjadi kesalahan saat memproses OCR. Pastikan file adalah dokumen PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([ocrResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ocr_result.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <Search className="text-red-600" /> OCR PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Ekstrak Teks dari PDF (OCR)</h1>
            <p className="text-gray-600">Gunakan kecerdasan buatan untuk membaca teks dari PDF hasil scan secara lokal.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
            <div className="mb-8 text-center">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer" />
            </div>

            {file && !ocrResult && (
              <div className="flex flex-col items-center gap-4">
                <button onClick={processOcr} disabled={isProcessing} className="bg-red-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-red-700 transition-all flex items-center gap-3">
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Languages className="w-6 h-6" />}
                  Mulai OCR (Halaman 1)
                </button>
                {isProcessing && (
                  <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                    <p className="text-center text-xs font-bold mt-2 text-gray-500">Memproses: {progress}%</p>
                  </div>
                )}
              </div>
            )}

            {ocrResult && (
              <div className="animate-in fade-in">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Hasil OCR:</label>
                <textarea readOnly value={ocrResult} className="w-full h-64 p-6 rounded-2xl bg-gray-50 border border-gray-100 font-mono text-sm focus:outline-none mb-4" />
                <div className="flex justify-center">
                  <button onClick={downloadTxt} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-black transition-all">
                    <Download className="w-5 h-5" /> Unduh .txt
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
