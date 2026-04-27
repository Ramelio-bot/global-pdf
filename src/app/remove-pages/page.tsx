"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Trash2, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RemovePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pagesToRemove, setPagesToRemove] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processRemove = async () => {
    if (!file || !pagesToRemove) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Parse pages (e.g. "1, 3, 5-7")
      const totalPages = pdfDoc.getPageCount();
      const removeIndices = new Set<number>();
      
      const parts = pagesToRemove.split(",").map(p => p.trim());
      parts.forEach(part => {
        if (part.includes("-")) {
          const [start, end] = part.split("-").map(n => parseInt(n));
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= totalPages) removeIndices.add(i - 1);
            }
          }
        } else {
          const num = parseInt(part);
          if (!isNaN(num) && num >= 1 && num <= totalPages) {
            removeIndices.add(num - 1);
          }
        }
      });

      // Sort indices descending to remove without affecting previous indices
      const sortedIndices = Array.from(removeIndices).sort((a, b) => b - a);
      
      if (sortedIndices.length >= totalPages) {
        alert("Anda tidak bisa menghapus semua halaman.");
        setIsProcessing(false);
        return;
      }

      sortedIndices.forEach(index => {
        pdfDoc.removePage(index);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `modified_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error removing pages:", error);
      alert("Terjadi kesalahan saat menghapus halaman. Pastikan format nomor halaman benar.");
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
            <span className="font-semibold">Kembali ke Beranda</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">Remove Pages</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Hapus Halaman PDF</h1>
            <p className="text-gray-600">Pilih dan hapus halaman yang tidak diinginkan dari dokumen PDF Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wider">
                1. Pilih File PDF
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer"
              />
            </div>

            {file && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                    2. Masukkan Nomor Halaman yang Dihapus
                  </label>
                  <input
                    type="text"
                    value={pagesToRemove}
                    onChange={(e) => setPagesToRemove(e.target.value)}
                    placeholder="Contoh: 1, 3, 5-7"
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all font-bold text-lg"
                  />
                  <p className="mt-2 text-xs text-gray-500 font-medium italic">Gunakan koma untuk angka terpisah dan tanda hubung untuk rentang halaman.</p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={processRemove}
                    disabled={isProcessing || !pagesToRemove}
                    className={`
                      px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                      ${!isProcessing && pagesToRemove ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Trash2 className="w-6 h-6" />}
                    Hapus Halaman & Unduh
                  </button>
                </div>
              </div>
            )}
          </div>

          {isDone && (
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Berhasil!</h3>
                <p className="text-sm text-green-700 font-medium">Halaman telah dihapus dan PDF baru telah diunduh.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
