"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Crop, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CropPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [margin, setMargin] = useState(30);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processCrop = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const { width, height } = page.getSize();
        // Set CropBox to trim margins
        page.setCropBox(margin, margin, width - (margin * 2), height - (margin * 2));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cropped_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error cropping PDF:", error);
      alert("An error occurred while cropping the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">Crop PDF</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Crop PDF Margins</h1>
            <p className="text-gray-600">Automatically remove unnecessary white margins around your PDF pages.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-widest">
                1. Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer shadow-sm"
              />
            </div>

            {file && (
              <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner">
                  <label className="block text-xs font-black text-gray-700 mb-4 uppercase tracking-widest">Crop Intensity ({margin}pt)</label>
                  <input type="range" min="0" max="150" value={margin} onChange={(e) => setMargin(parseInt(e.target.value))} className="w-full max-w-sm mx-auto accent-red-600 block cursor-pointer" />
                </div>

                <button
                  onClick={processCrop}
                  disabled={isProcessing}
                  className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-red-200 mx-auto"
                >
                  {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Crop className="w-7 h-7" />}
                  Crop & Download PDF
                </button>
              </div>
            )}
          </div>

          {isDone && (
            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
              <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 tracking-tight text-lg">Success!</h3>
                <p className="text-sm text-green-700 font-bold">The PDF pages have been successfully cropped according to the selected margin.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
