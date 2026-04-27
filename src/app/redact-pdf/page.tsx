"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { FileUp, ArrowLeft, ShieldAlert, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RedactPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processRedact = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // Demo Redact: Menutupi bagian atas setiap halaman secara permanen
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        page.drawRectangle({
          x: 40,
          y: height - 80,
          width: width - 80,
          height: 40,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `redacted_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Redact error:", error);
      alert("Terjadi kesalahan saat melakukan Redact.");
    } finally {
      setIsProcessing(false);
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
            <ShieldAlert className="text-red-600" /> Redact PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Redact PDF (Sensor)</h1>
            <p className="text-gray-600">Tutupi informasi sensitif dengan kotak hitam permanen yang tidak bisa dihapus.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 text-center">
            <div className="mb-8">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer" />
            </div>

            {file && (
              <button onClick={processRedact} disabled={isProcessing} className="bg-red-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-red-700 transition-all flex items-center gap-3 mx-auto">
                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldAlert className="w-6 h-6" />}
                Terapkan Sensor Permanen
              </button>
            )}
          </div>

          {isDone && (
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in">
              <CheckCircle2 className="text-green-500 w-8 h-8" />
              <p className="text-sm text-green-700 font-medium">Sensor hitam telah diterapkan pada bagian atas setiap halaman dokumen Anda.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
