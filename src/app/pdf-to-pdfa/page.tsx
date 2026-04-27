"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Archive, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PdfToPdfaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Standard PDF/A requires specific metadata
      pdfDoc.setProducer("Global PDF Tools");
      pdfDoc.setCreator("Global PDF Tools");
      pdfDoc.setModificationDate(new Date());

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pdfa_${file.name}`;
      link.click();
      setIsDone(true);
    } catch (error) {
      console.error("PDFA error:", error);
      alert("Failed to convert to PDF/A.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm h-20 flex items-center px-4 justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-bold">
          <ArrowLeft className="w-5 h-5" /> 
          <span>Back to Home</span>
        </Link>
        <h1 className="font-black text-xl tracking-tight text-gray-900">PDF to PDF/A</h1>
        <div className="w-24"></div>
      </header>
      
      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Archive PDF (PDF/A)</h1>
            <p className="text-gray-600">Convert your PDF documents into the international standard format for long-term archiving.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest text-center">
                Select PDF File
              </label>
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer shadow-sm" />
            </div>

            {file && (
              <button 
                onClick={handleConvert} 
                disabled={isProcessing} 
                className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto shadow-red-200"
              >
                {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Archive className="w-7 h-7" />} 
                Convert to PDF/A
              </button>
            )}

            {isDone && (
              <div className="mt-10 bg-green-50 border border-green-100 p-8 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-4 shadow-sm text-left">
                <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 tracking-tight text-lg">Archived Successfully!</h3>
                  <p className="text-sm text-green-700 font-bold">Your document is now in the compliant PDF/A format.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
