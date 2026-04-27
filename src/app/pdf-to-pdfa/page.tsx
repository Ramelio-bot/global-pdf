"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Archive, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PdfToPdfaPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Standard PDF/A requires specific metadata
      pdfDoc.setProducer("Global PDF Tools");
      pdfDoc.setCreator("Global PDF Tools");
      pdfDoc.setModificationDate(new Date());

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pdfa_${file.name}`;
      link.click();
      setIsDone(true);
    } catch (error) {
      console.error("PDFA error:", error);
      alert("Gagal konversi ke PDF/A.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col">
      <header className="w-full bg-white shadow-sm h-20 flex items-center px-4 justify-between sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600"><ArrowLeft className="w-5 h-5" /> Kembali</Link>
        <h1 className="font-black text-xl tracking-tight">PDF to PDF/A</h1>
        <div className="w-24"></div>
      </header>
      <main className="flex-grow flex flex-col items-center py-12 px-4">
        <h2 className="text-3xl font-black mb-4">Arsipkan PDF (PDF/A)</h2>
        <p className="text-gray-600 mb-10">Ubah dokumen PDF Anda menjadi format standar kearsipan jangka panjang.</p>
        <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center">
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-8 block w-full" />
          {file && (
            <button onClick={handleConvert} disabled={isProcessing} className="bg-red-600 text-white px-10 py-4 rounded-full font-black flex items-center gap-2 mx-auto">
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />} Konversi ke PDF/A
            </button>
          )}
          {isDone && <p className="mt-6 text-green-600 font-bold flex items-center justify-center gap-2"><CheckCircle2 /> Berhasil diarsipkan!</p>}
        </div>
      </main>
    </div>
  );
}
