"use client";

import { useState } from "react";
import { ArrowLeft, Diff, Loader2, FileSearch } from "lucide-react";
import Link from "next/link";

export default function ComparePdfPage() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setIsComparing(true);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const doc1 = await pdfjsLib.getDocument({ data: await file1.arrayBuffer() }).promise;
      const doc2 = await pdfjsLib.getDocument({ data: await file2.arrayBuffer() }).promise;

      setComparison({
        file1: { name: file1.name, pages: doc1.numPages, size: (file1.size / 1024).toFixed(1) + " KB" },
        file2: { name: file2.name, pages: doc2.numPages, size: (file2.size / 1024).toFixed(1) + " KB" },
        diffPages: Math.abs(doc1.numPages - doc2.numPages),
        isIdentical: file1.size === file2.size && doc1.numPages === doc2.numPages
      });
    } catch (error) {
      console.error("Compare error:", error);
      alert("Failed to compare the PDF files.");
    } finally {
      setIsComparing(false);
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
            <Diff className="text-red-600 w-6 h-6" /> Compare PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Compare PDF Files</h1>
            <p className="text-gray-600">Compare structural data and metadata between two PDF files side-by-side.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center hover:border-red-200 transition-colors shadow-sm group">
              <label className="block text-xs font-black text-gray-400 mb-6 uppercase tracking-widest group-hover:text-red-500 transition-colors">First PDF File</label>
              <input type="file" accept=".pdf" onChange={(e) => setFile1(e.target.files?.[0] || null)} className="text-xs w-full cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-600" />
              {file1 && <p className="mt-6 font-black text-red-600 animate-in zoom-in-95 truncate px-4">{file1.name}</p>}
            </div>
            <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-gray-200 text-center hover:border-red-200 transition-colors shadow-sm group">
              <label className="block text-xs font-black text-gray-400 mb-6 uppercase tracking-widest group-hover:text-red-500 transition-colors">Second PDF File</label>
              <input type="file" accept=".pdf" onChange={(e) => setFile2(e.target.files?.[0] || null)} className="text-xs w-full cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-red-50 file:text-red-600" />
              {file2 && <p className="mt-6 font-black text-red-600 animate-in zoom-in-95 truncate px-4">{file2.name}</p>}
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <button 
              onClick={handleCompare} 
              disabled={!file1 || !file2 || isComparing} 
              className={`px-14 py-5 rounded-full font-black text-lg shadow-xl transition-all flex items-center gap-4
                ${file1 && file2 && !isComparing ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isComparing ? <Loader2 className="w-7 h-7 animate-spin" /> : <FileSearch className="w-7 h-7" />}
              Compare Now
            </button>
          </div>

          {comparison && (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-2 gap-12 mb-10 pb-10 border-b border-gray-50">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">File 1</h3>
                  <p className="text-xl font-black text-gray-900 truncate">{comparison.file1.name}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 font-bold">Pages: <span className="text-gray-900">{comparison.file1.pages}</span></p>
                    <p className="text-sm text-gray-500 font-bold">Size: <span className="text-gray-900">{comparison.file1.size}</span></p>
                  </div>
                </div>
                <div className="space-y-4 border-l pl-12 border-gray-50">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">File 2</h3>
                  <p className="text-xl font-black text-gray-900 truncate">{comparison.file2.name}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 font-bold">Pages: <span className="text-gray-900">{comparison.file2.pages}</span></p>
                    <p className="text-sm text-gray-500 font-bold">Size: <span className="text-gray-900">{comparison.file2.size}</span></p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center gap-3 px-8 py-3 rounded-full font-black text-lg
                  ${comparison.isIdentical ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}
                `}>
                  {comparison.isIdentical ? (
                    <>✓ Files are identical in size and page count.</>
                  ) : (
                    <>⚠ Page Difference: {comparison.diffPages}</>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
