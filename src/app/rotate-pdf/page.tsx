"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { FileUp, ArrowLeft, RotateCw, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState(90);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processRotate = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotation) % 360));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rotated_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error rotating PDF:", error);
      alert("Terjadi kesalahan saat memutar PDF.");
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
          <div className="font-black text-xl tracking-tight text-gray-900">Rotate PDF</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Putar Halaman PDF</h1>
            <p className="text-gray-600">Putar semua halaman dalam dokumen PDF Anda secara permanen.</p>
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
                <label className="block text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-wider">
                  2. Pilih Sudut Rotasi
                </label>
                <div className="grid grid-cols-3 gap-4 mb-10">
                  {[90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setRotation(deg)}
                      className={`py-4 rounded-2xl font-black text-lg transition-all border-2
                        ${rotation === deg ? "bg-red-600 text-white border-red-600 shadow-md scale-105" : "bg-white text-gray-600 border-gray-100 hover:border-red-200"}
                      `}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={processRotate}
                    disabled={isProcessing}
                    className="bg-red-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-red-200"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <RotateCw className="w-6 h-6" />}
                    Putar & Unduh PDF
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
                <p className="text-sm text-green-700 font-medium">PDF yang diputar telah diunduh secara otomatis.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
