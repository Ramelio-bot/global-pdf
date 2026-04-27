"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, FileDown, Loader2, FileText, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setStartPage(1);
        setEndPage(count);
      } catch (error) {
        console.error("Error reading PDF:", error);
        alert("Failed to read PDF file.");
      }
    } else if (selectedFile) {
      alert("Only PDF files are allowed.");
    }
  };

  const splitPDF = async () => {
    if (!file || totalPages === 0) return;
    
    // Validation
    if (startPage < 1 || endPage > totalPages || startPage > endPage) {
      alert(`Invalid page range. Please enter between 1 and ${totalPages}.`);
      return;
    }

    setIsSplitting(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const splitPdfDoc = await PDFDocument.create();

      // pdf-lib uses 0-based indexing for pages
      const pageIndices = [];
      for (let i = startPage - 1; i < endPage; i++) {
        pageIndices.push(i);
      }

      const pages = await splitPdfDoc.copyPages(pdfDoc, pageIndices);
      pages.forEach((page) => splitPdfDoc.addPage(page));

      const pdfBytes = await splitPdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `split_${startPage}_to_${endPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("An error occurred while splitting the PDF.");
    } finally {
      setIsSplitting(false);
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
            Split PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Split PDF File</h1>
            <p className="text-gray-600">Extract a specific range of pages from your PDF document quickly.</p>
          </div>

          {/* Upload Box */}
          <div className="relative group mb-8">
            <label 
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-sm
                ${isDragging ? "bg-red-50 border-red-500" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-red-400"}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
            >
              {file ? (
                <div className="flex flex-col items-center p-4 text-center animate-in zoom-in-95 transition-all">
                  <div className="bg-red-100 p-4 rounded-full mb-4 shadow-inner">
                    <FileText className="w-10 h-10 text-red-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Total Pages: {totalPages}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); setTotalPages(0); }}
                    className="mt-4 text-sm font-bold text-red-500 hover:underline"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 transition-all group-hover:scale-105 duration-300">
                  <div className="bg-gray-100 p-4 rounded-full mb-4 shadow-inner">
                    <FileUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700 tracking-tight">Click or drag PDF file here</p>
                  <p className="text-sm text-gray-500 font-medium italic">Privacy guaranteed with local processing</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {/* Range Selection */}
          {file && (
            <div className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">Define Page Range</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Start Page</label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={startPage}
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">End Page</label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={endPage}
                    onChange={(e) => setEndPage(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all font-bold"
                  />
                </div>
              </div>
              <p className="mt-6 text-sm text-gray-500 font-bold text-center italic">
                Extracting pages {startPage} to {endPage} from a total of {totalPages} pages.
              </p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={splitPDF}
              disabled={!file || isSplitting}
              className={`
                px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                ${file && !isSplitting
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isSplitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Splitting...
                </>
              ) : (
                <>
                  <FileDown className="w-6 h-6" />
                  Split PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
