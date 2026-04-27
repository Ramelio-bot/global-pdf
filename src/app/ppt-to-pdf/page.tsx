"use client";

import { useState } from "react";
import JSZip from "jszip";
import { jsPDF } from "jspdf";
import { FileUp, ArrowLeft, Presentation, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PptToPdfPage() {
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

    if (selectedFile && selectedFile.name.endsWith(".pptx")) {
      setFile(selectedFile);
      setIsDone(false);
    } else if (selectedFile) {
      alert("Hanya file PowerPoint (.pptx) yang diperbolehkan.");
    }
  };

  const convertPptToPdf = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const data = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(data);
      
      // Temukan semua file slide (ppt/slides/slideX.xml)
      const slideFiles = Object.keys(zip.files).filter(
        name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
      );
      
      // Urutkan secara numerik
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
      });

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });

      const parser = new DOMParser();

      for (let i = 0; i < slideFiles.length; i++) {
        if (i > 0) doc.addPage();
        
        const slideXml = await zip.file(slideFiles[i])?.async("text");
        if (slideXml) {
          const xmlDoc = parser.parseFromString(slideXml, "text/xml");
          // Ambil elemen teks PowerPoint <a:t>
          const textNodes = xmlDoc.getElementsByTagName("a:t");
          
          let y = 30;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(18);
          doc.text(`Slide ${i + 1}`, 15, 20);
          
          doc.setFont("helvetica", "normal");
          doc.setFontSize(12);
          
          for (let j = 0; j < textNodes.length; j++) {
            const text = textNodes[j].textContent;
            if (text && text.trim()) {
              const splitText = doc.splitTextToSize(text, 260);
              doc.text(splitText, 15, y);
              y += (splitText.length * 7);
              
              if (y > 190) {
                // Jika teks terlalu panjang untuk satu halaman PDF slide
                y = 30;
                doc.addPage();
              }
            }
          }
        }
      }

      doc.save(`${file.name.replace(".pptx", "")}.pdf`);
      setIsDone(true);
    } catch (error) {
      console.error("Error converting PPT to PDF:", error);
      alert("Terjadi kesalahan saat mengonversi file PowerPoint. Pastikan file tidak rusak.");
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
            PowerPoint to PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Ubah PPT ke PDF</h1>
            <p className="text-gray-600">Ekstrak teks dari slide PowerPoint (.pptx) dan simpan sebagai dokumen PDF yang rapi.</p>
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
                  <div className="bg-orange-100 p-4 rounded-full mb-4">
                    <Presentation className="w-10 h-10 text-orange-600" />
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
                  <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-orange-50 transition-colors">
                    <FileUp className="w-10 h-10 text-gray-400 group-hover:text-orange-500" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file PowerPoint (.pptx) di sini</p>
                  <p className="text-sm text-gray-500 font-medium">Pemrosesan lokal & privat</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".pptx" onChange={handleFileChange} />
            </label>
          </div>

          {isDone && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900">Konversi Berhasil!</h3>
                <p className="text-sm text-green-700 font-medium">Dokumen PDF Anda telah diunduh secara otomatis.</p>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={convertPptToPdf}
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
                  <Presentation className="w-6 h-6" />
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
