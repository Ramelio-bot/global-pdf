"use client";

import { useState } from "react";
import mammoth from "mammoth";
import { FileUp, ArrowLeft, FileText, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && (selectedFile.name.endsWith(".docx") || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(selectedFile);
      setIsDone(false);
    } else if (selectedFile) {
      alert("Hanya file Word (.docx) yang diperbolehkan.");
    }
  };

  const convertWordToPdf = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      // 1. Convert Word to HTML using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;

      // 2. Prepare a hidden element to render HTML
      // We use a temporary container to style the output better for the PDF
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = "-10000px";
      container.style.left = "-10000px";
      container.style.width = "800px"; // Simulating A4 width roughly
      
      const contentElement = document.createElement("div");
      contentElement.innerHTML = htmlContent;
      contentElement.style.padding = "60px";
      contentElement.style.fontFamily = "Arial, sans-serif";
      contentElement.style.backgroundColor = "white";
      contentElement.style.color = "black";
      contentElement.style.lineHeight = "1.6";
      
      // Basic styling for converted elements
      contentElement.querySelectorAll("img").forEach(img => {
        img.style.maxWidth = "100%";
        img.style.height = "auto";
      });

      container.appendChild(contentElement);
      document.body.appendChild(container);

      // 3. Convert HTML to PDF using html2pdf.js
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin: 0,
        filename: `${file.name.replace(".docx", "")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().from(contentElement).set(opt as any).save();
      
      // Cleanup
      document.body.removeChild(container);
      setIsDone(true);
    } catch (error) {
      console.error("Error converting Word to PDF:", error);
      alert("Terjadi kesalahan saat mengonversi file Word. Pastikan file tidak diproteksi password.");
    } finally {
      setIsConverting(false);
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
            Word to PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Ubah Word ke PDF</h1>
            <p className="text-gray-600">Ubah dokumen Word (.docx) Anda menjadi file PDF profesional secara instan di browser Anda.</p>
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
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <FileText className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm font-medium text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); setIsDone(false); }}
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
                  <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file Word (.docx) di sini</p>
                  <p className="text-sm text-gray-500 font-medium">Privasi terjamin dengan pemrosesan murni lokal</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
            </label>
          </div>

          {isDone && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Konversi Berhasil!</h3>
                <p className="text-sm text-green-700 font-medium">File PDF Anda telah diunduh secara otomatis.</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={convertWordToPdf}
              disabled={!file || isConverting}
              className={`
                px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                ${file && !isConverting
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Mengonversi...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Convert to PDF
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
