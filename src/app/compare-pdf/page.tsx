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
      alert("Gagal membandingkan PDF.");
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900 flex items-center gap-2">
            <Diff className="text-red-600" /> Compare PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow py-12 px-4 flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Bandingkan PDF</h1>
            <p className="text-gray-600">Bandingkan struktur dan metadata antara dua file PDF secara berdampingan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">PDF Pertama</label>
              <input type="file" accept=".pdf" onChange={(e) => setFile1(e.target.files?.[0] || null)} className="text-xs w-full" />
              {file1 && <p className="mt-4 font-bold text-red-600">{file1.name}</p>}
            </div>
            <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 text-center">
              <label className="block text-xs font-black text-gray-400 mb-4 uppercase tracking-widest">PDF Kedua</label>
              <input type="file" accept=".pdf" onChange={(e) => setFile2(e.target.files?.[0] || null)} className="text-xs w-full" />
              {file2 && <p className="mt-4 font-bold text-red-600">{file2.name}</p>}
            </div>
          </div>

          <div className="flex justify-center mb-12">
            <button onClick={handleCompare} disabled={!file1 || !file2 || isComparing} className="bg-red-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-red-700 transition-all flex items-center gap-3">
              {isComparing ? <Loader2 className="w-6 h-6 animate-spin" /> : <FileSearch className="w-6 h-6" />}
              Bandingkan Sekarang
            </button>
          </div>

          {comparison && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="grid grid-cols-2 gap-12 mb-8">
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">File 1</h3>
                  <p className="text-xl font-bold mb-2 truncate">{comparison.file1.name}</p>
                  <p className="text-gray-500 font-medium">Halaman: <span className="text-gray-900">{comparison.file1.pages}</span></p>
                  <p className="text-gray-500 font-medium">Ukuran: <span className="text-gray-900">{comparison.file1.size}</span></p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">File 2</h3>
                  <p className="text-xl font-bold mb-2 truncate">{comparison.file2.name}</p>
                  <p className="text-gray-500 font-medium">Halaman: <span className="text-gray-900">{comparison.file2.pages}</span></p>
                  <p className="text-gray-500 font-medium">Ukuran: <span className="text-gray-900">{comparison.file2.size}</span></p>
                </div>
              </div>
              <div className="border-t pt-8 text-center">
                <p className="text-lg font-bold text-gray-900">
                  {comparison.isIdentical ? "✓ Kedua file memiliki ukuran dan jumlah halaman yang identik." : `! Perbedaan halaman: ${comparison.diffPages}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
