"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, Stamp, Loader2, Download, CheckCircle2, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function OverlayImagePage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [imgWidth, setImgWidth] = useState(100);
  const [isDone, setIsDone] = useState(false);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImgFile(e.target.files[0]);
    }
  };

  const processOverlay = async () => {
    if (!pdfFile || !imgFile) {
      alert("Harap pilih file PDF dan Gambar stempel/logo.");
      return;
    }
    setIsProcessing(true);

    try {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const imgBuffer = await imgFile.arrayBuffer();
      
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      let embeddedImg;
      
      if (imgFile.type === "image/png") {
        embeddedImg = await pdfDoc.embedPng(imgBuffer);
      } else {
        embeddedImg = await pdfDoc.embedJpg(imgBuffer);
      }

      const pages = pdfDoc.getPages();
      const firstPage = pages[0]; // Overlay on first page
      
      const imgDims = embeddedImg.scale(imgWidth / embeddedImg.width);

      firstPage.drawImage(embeddedImg, {
        x: posX,
        y: posY,
        width: imgDims.width,
        height: imgDims.height,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `stamped_${pdfFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error overlaying image:", error);
      alert("Terjadi kesalahan saat menambahkan gambar ke PDF.");
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
          <div className="font-black text-xl tracking-tight text-gray-900">Overlay Image / Stamp</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Tambah Stempel / Logo</h1>
            <p className="text-gray-600">Tempelkan gambar (PNG/JPG) di atas PDF Anda dan atur posisinya secara presisi.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  1. File PDF Utama
                </label>
                <input type="file" accept=".pdf" onChange={handlePdfChange} className="text-xs w-full" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
                  2. Gambar (Stamp/Logo)
                </label>
                <input type="file" accept="image/*" onChange={handleImgChange} className="text-xs w-full" />
              </div>
            </div>

            {pdfFile && imgFile && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Posisi X ({posX})</label>
                    <input type="range" min="0" max="600" value={posX} onChange={(e) => setPosX(parseInt(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Posisi Y ({posY})</label>
                    <input type="range" min="0" max="800" value={posY} onChange={(e) => setPosY(parseInt(e.target.value))} className="w-full accent-red-600" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Lebar ({imgWidth}px)</label>
                    <input type="range" min="20" max="400" value={imgWidth} onChange={(e) => setImgWidth(parseInt(e.target.value))} className="w-full accent-red-600" />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={processOverlay}
                    disabled={isProcessing}
                    className="bg-red-600 text-white px-12 py-4 rounded-full font-black text-lg shadow-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-red-200"
                  >
                    {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Stamp className="w-6 h-6" />}
                    Terapkan & Unduh
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
                <p className="text-sm text-green-700 font-medium">Gambar telah ditempelkan pada PDF Anda.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
