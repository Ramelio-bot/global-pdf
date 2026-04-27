"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, X, FileText, Loader2 } from "lucide-react";
import Link from "next/link";

export default function MergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes.buffer as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged_result.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("An error occurred while merging PDFs.");
    } finally {
      setIsMerging(false);
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
          <div className="font-black text-xl tracking-tight text-gray-900">
            Merge PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Merge PDF Files</h1>
            <p className="text-gray-600">Select multiple PDF files and merge them into a single document in seconds.</p>
          </div>

          {/* Upload Box */}
          <div className="relative group">
            <label 
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-sm group-hover:shadow-md
                ${isDragging ? "bg-red-50 border-red-500" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-red-400"}
              `}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) {
                  const droppedFiles = Array.from(e.dataTransfer.files).filter(
                    (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
                  );
                  setFiles((prev) => [...prev, ...droppedFiles]);
                }
              }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="bg-red-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <FileUp className="w-10 h-10 text-red-600" />
                </div>
                <p className="mb-2 text-lg font-bold text-gray-700 tracking-tight">Click to upload or drag files here</p>
                <p className="text-sm text-gray-500 font-medium italic">Only PDF files are allowed</p>
              </div>
              <input
                type="file"
                className="hidden"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mt-8 space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Selected Files ({files.length})</h2>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 group hover:border-red-100 transition-all">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-semibold text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 font-bold">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-10 flex justify-center">
            <button
              onClick={mergePDFs}
              disabled={files.length < 2 || isMerging}
              className={`
                px-10 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                ${files.length >= 2 && !isMerging
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                "Merge PDF"
              )}
            </button>
          </div>
          
          {files.length === 1 && (
            <p className="text-center mt-4 text-sm font-bold text-amber-600 animate-pulse">
              Select at least one more file to merge.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
