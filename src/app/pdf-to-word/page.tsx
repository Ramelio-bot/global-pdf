"use client";

import { useState } from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FileUp, ArrowLeft, FileText, Loader2, Download, CheckCircle2, FileType } from "lucide-react";
import Link from "next/link";

export default function PdfToWordPage() {
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

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setIsDone(false);
    } else if (selectedFile) {
      alert("Hanya file PDF yang diperbolehkan.");
    }
  };

  const convertPdfToWord = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      // Dynamic import to avoid SSR issues
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const paragraphs: Paragraph[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Ekstrak teks dan gabungkan menjadi satu string per halaman
        const textItems = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: textItems,
                font: "Arial",
                size: 24, // 12pt
              }),
            ],
          })
        );
        
        // Tambahkan paragraf kosong sebagai pemisah halaman (sederhana)
        paragraphs.push(new Paragraph({ children: [] }));
      }

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${file.name.replace(".pdf", "")}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error converting PDF to Word:", error);
      alert("Terjadi kesalahan saat mengonversi PDF ke Word. Pastikan file tidak rusak.");
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
            PDF to Word
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Ubah PDF ke Word</h1>
            <p className="text-gray-600">Ekstrak teks dari PDF Anda dan simpan kembali sebagai dokumen Word (.docx) yang dapat diedit.</p>
          </div>

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
                    <FileType className="w-10 h-10 text-blue-600" />
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
                  <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-blue-50 transition-colors">
                    <FileUp className="w-10 h-10 text-gray-400 group-hover:text-blue-500" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file PDF di sini</p>
                  <p className="text-sm text-gray-500 font-medium">Pemrosesan lokal & privat</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
            </label>
          </div>

          {isDone && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Konversi Berhasil!</h3>
                <p className="text-sm text-green-700 font-medium">Dokumen Word Anda telah diunduh secara otomatis.</p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={convertPdfToWord}
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
                  Convert to Word
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
