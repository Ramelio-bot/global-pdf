"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Shield, ShieldCheck, ShieldAlert, Loader2, Lock, Unlock } from "lucide-react";
import Link from "next/link";

export default function PdfSecurityPage() {
  const [activeTab, setActiveTab] = useState<"protect" | "unlock">("protect");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("Hanya file PDF yang diperbolehkan.");
    }
  };

  const handleProtect = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      
      // Protect the PDF with userPassword
      const protectedPdfBytes = await pdfDoc.save({ userPassword: password } as any);
      
      downloadPdf(protectedPdfBytes, `protected_${file.name}`);
    } catch (error) {
      console.error("Error protecting PDF:", error);
      alert("Terjadi kesalahan saat mengunci PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlock = async () => {
    if (!file || !password) return;
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      // Load PDF with the provided password
      const pdfDoc = await PDFDocument.load(fileBytes, { password } as any);
      
      // Save without password to unlock it
      const unlockedPdfBytes = await pdfDoc.save();
      
      downloadPdf(unlockedPdfBytes, `unlocked_${file.name}`);
    } catch (error) {
      console.error("Error unlocking PDF:", error);
      alert("Gagal membuka PDF. Pastikan password yang Anda masukkan benar.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes.buffer as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
            PDF Security
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Keamanan PDF</h1>
            <p className="text-gray-600">Lindungi dokumen Anda dengan kata sandi atau buka kunci PDF yang terproteksi.</p>
          </div>

          {/* Tabs */}
          <div className="flex p-1 bg-gray-200 rounded-xl mb-10">
            <button
              onClick={() => { setActiveTab("protect"); setFile(null); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all ${
                activeTab === "protect" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="w-5 h-5" />
              Protect PDF
            </button>
            <button
              onClick={() => { setActiveTab("unlock"); setFile(null); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all ${
                activeTab === "unlock" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Unlock className="w-5 h-5" />
              Unlock PDF
            </button>
          </div>

          {/* Action Box */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
              <label 
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer
                  ${isDragging ? "bg-red-50 border-red-500" : "bg-gray-50 border-gray-300 hover:bg-white hover:border-red-400"}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
              >
                {file ? (
                  <div className="flex flex-col items-center p-4">
                    <ShieldCheck className="w-12 h-12 text-green-500 mb-2" />
                    <span className="text-sm font-bold text-gray-700 text-center truncate max-w-xs">{file.name}</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="mt-2 text-xs font-bold text-red-500 hover:underline"
                    >
                      Ganti File
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center pt-5 pb-6">
                    <FileUp className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm font-bold text-gray-500">Klik atau seret file PDF di sini</p>
                  </div>
                )}
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {activeTab === "protect" ? "Masukkan Password Baru" : "Masukkan Password PDF Saat Ini"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-4 flex items-center">
                  {activeTab === "protect" ? (
                    <Lock className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Unlock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
              {activeTab === "protect" && (
                <p className="mt-2 text-xs text-gray-500 italic">
                  *Penting: Simpan password Anda dengan baik. Kami tidak menyimpan password Anda.
                </p>
              )}
            </div>

            <button
              onClick={activeTab === "protect" ? handleProtect : handleUnlock}
              disabled={!file || !password || isProcessing}
              className={`
                w-full py-4 rounded-xl font-black text-lg shadow-lg transition-all flex items-center justify-center gap-3
                ${file && password && !isProcessing
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Memproses...
                </>
              ) : activeTab === "protect" ? (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  Lindungi PDF
                </>
              ) : (
                <>
                  <ShieldAlert className="w-6 h-6" />
                  Buka Kunci PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-gray-500">
          Semua proses enkripsi dan dekripsi dilakukan secara lokal di perangkat Anda.
        </div>
      </footer>
    </div>
  );
}
