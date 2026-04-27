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
      
      // We process the first page as an OCR demo (processing all pages can be heavy client-side)
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
      alert("An error occurred while processing OCR. Please ensure the file is a valid PDF document.");
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <Search className="text-red-600 w-6 h-6" /> OCR PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Extract Text from PDF (OCR)</h1>
            <p className="text-gray-600">Use advanced AI to read and extract text from scanned PDF documents locally in your browser.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="mb-10 text-center">
              <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest">
                Select PDF File
              </label>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer shadow-sm" />
            </div>

            {file && !ocrResult && (
              <div className="flex flex-col items-center gap-6">
                <button onClick={processOcr} disabled={isProcessing} className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-red-200">
                  {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Languages className="w-7 h-7" />}
                  Start OCR (Page 1)
                </button>
                {isProcessing && (
                  <div className="w-full max-w-sm">
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-3 shadow-inner">
                      <div className="bg-red-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-center text-sm font-black text-gray-500">Processing: {progress}%</p>
                  </div>
                )}
              </div>
            )}

            {ocrResult && (
              <div className="animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-black text-gray-700 uppercase tracking-widest">OCR Results:</label>
                  <div className="flex items-center gap-2 text-green-600 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Extraction Complete
                  </div>
                </div>
                <textarea readOnly value={ocrResult} className="w-full h-80 p-8 rounded-3xl bg-gray-50 border border-gray-100 font-mono text-sm focus:outline-none mb-8 shadow-inner resize-none scrollbar-thin" />
                <div className="flex justify-center">
                  <button onClick={downloadTxt} className="bg-gray-900 text-white px-10 py-4 rounded-full font-black flex items-center gap-3 hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lg">
                    <Download className="w-6 h-6" /> Download .txt
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-center text-xs text-gray-400 font-bold italic mt-4 px-10 leading-relaxed">
            Note: For performance and privacy, we currently process the first page of your document. All AI computations are done 100% locally on your machine.
          </p>
        </div>
      </main>
    </div>
  );
}
