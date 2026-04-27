"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Minimize2, Loader2, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ originalSize: number; compressedSize: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResultInfo(null);
    } else if (selectedFile) {
      alert("Hanya file PDF yang diperbolehkan.");
    }
  };

  const compressPDF = async () => {
    if (!file) return;
    setIsCompressing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const compressedPdfDoc = await PDFDocument.create();
      const pages = await compressedPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
      pages.forEach((page) => compressedPdfDoc.addPage(page));

      // useObjectStreams: true helps in reducing file size by compressing the object streams
      const pdfBytes = await compressedPdfDoc.save({ useObjectStreams: true });
      
      const blob = new Blob([pdfBytes.buffer as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultInfo({
        originalSize: file.size,
        compressedSize: pdfBytes.length,
      });

      const link = document.createElement("a");
      link.href = url;
      link.download = "compressed_result.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error compressing PDF:", error);
      alert("Terjadi kesalahan saat mengompresi PDF.");
    } finally {
      setIsCompressing(false);
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
            Compress PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Kompresi PDF</h1>
            <p className="text-gray-600">Perkecil ukuran file PDF Anda tanpa mengurangi kualitas dokumen secara drastis.</p>
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
                  <p className="text-sm font-medium text-gray-500">Ukuran Asli: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); setResultInfo(null); }}
                    className="mt-4 text-sm font-bold text-red-500 hover:underline"
                  >
                    Ganti File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-red-50 transition-colors">
                    <FileUp className="w-10 h-10 text-gray-400 group-hover:text-red-500" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file PDF di sini</p>
                  <p className="text-sm text-gray-500 font-medium">Pemrosesan 100% lokal & aman</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {/* Result Info */}
          {resultInfo && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Berhasil Dikompresi!</h3>
                <p className="text-sm text-green-700 font-medium">
                  Ukuran berkurang dari {(resultInfo.originalSize / 1024 / 1024).toFixed(2)} MB menjadi {(resultInfo.compressedSize / 1024 / 1024).toFixed(2)} MB 
                  ({(((resultInfo.originalSize - resultInfo.compressedSize) / resultInfo.originalSize) * 100).toFixed(1)}% lebih kecil).
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={compressPDF}
              disabled={!file || isCompressing}
              className={`
                px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                ${file && !isCompressing
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isCompressing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Mengompresi...
                </>
              ) : (
                <>
                  <Minimize2 className="w-6 h-6" />
                  Kompres PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}
