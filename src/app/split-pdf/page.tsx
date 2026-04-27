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
        alert("Gagal membaca file PDF.");
      }
    } else if (selectedFile) {
      alert("Hanya file PDF yang diperbolehkan.");
    }
  };

  const splitPDF = async () => {
    if (!file || totalPages === 0) return;
    
    // Validation
    if (startPage < 1 || endPage > totalPages || startPage > endPage) {
      alert(`Rentang halaman tidak valid. Masukkan antara 1 sampai ${totalPages}.`);
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
      link.download = `splitted_${startPage}_to_${endPage}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error splitting PDF:", error);
      alert("Terjadi kesalahan saat memisahkan PDF.");
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
            <span className="font-semibold">Kembali ke Beranda</span>
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
            <h1 className="text-3xl font-black text-gray-900 mb-4">Pisahkan PDF</h1>
            <p className="text-gray-600">Ambil rentang halaman tertentu dari dokumen PDF Anda dengan cepat.</p>
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
                <div className="flex flex-col items-center p-4 text-center">
                  <div className="bg-red-100 p-4 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-red-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Total Halaman: {totalPages}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); setTotalPages(0); }}
                    className="mt-4 text-sm font-bold text-red-500 hover:underline"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <FileUp className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file PDF di sini</p>
                  <p className="text-sm text-gray-500 font-medium">Privasi terjamin dengan pemrosesan lokal</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {/* Range Selection */}
          {file && (
            <div className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tentukan Rentang Halaman</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Halaman Mulai</label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={startPage}
                    onChange={(e) => setStartPage(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Halaman Selesai</label>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={endPage}
                    onChange={(e) => setEndPage(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500 italic text-center">
                Mengekstrak halaman {startPage} sampai {endPage} dari total {totalPages} halaman.
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
                  Memisahkan...
                </>
              ) : (
                <>
                  <FileDown className="w-6 h-6" />
                  Pisahkan PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-gray-500">
          Global PDF Tools: Cepat, Gratis, dan 100% Aman.
        </div>
      </footer>
    </div>
  );
}
