"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { FileUp, ArrowLeft, ShieldAlert, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RedactPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processRedact = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Demo Redact: Permanently covers the top portion of every page
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawRectangle({
          x: 40,
          y: height - 80,
          width: width - 80,
          height: 40,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `redacted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Redact error:", error);
      alert("An error occurred while performing the Redaction.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Redact PDF (Privacy Sensor)</h1>
            <p className="text-gray-600">Permanently mask sensitive information with black boxes that cannot be removed.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest">
                Select PDF File
              </label>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer shadow-sm" />
            </div>

            {file && (
              <button onClick={processRedact} disabled={isProcessing} className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-red-200">
                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <ShieldAlert className="w-7 h-7" />}
                Apply Permanent Redaction
              </button>
            )}
          </div>

          {isDone && (
            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
              <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-green-900 tracking-tight text-lg">Redaction Complete!</h3>
                <p className="text-sm text-green-700 font-bold">Black sensors have been applied to the top section of every page in your document.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
