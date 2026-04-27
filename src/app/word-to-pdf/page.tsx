"use client";

import { useState, useRef } from "react";
import { FileUp, ArrowLeft, FileText, Loader2, Printer, CheckCircle2, Eye } from "lucide-react";
import Link from "next/link";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasPreview, setHasPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && (selectedFile.name.endsWith(".docx") || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setFile(selectedFile);
      setHasPreview(false);
      if (previewRef.current) previewRef.current.innerHTML = "";
    } else if (selectedFile) {
      alert("Hanya file Word (.docx) yang diperbolehkan.");
    }
  };

  const renderPreview = async () => {
    if (!file || !previewRef.current) return;
    setIsRendering(true);

    try {
      const { renderAsync } = await import("docx-preview");
      const arrayBuffer = await file.arrayBuffer();
      
      previewRef.current.innerHTML = "";
      await renderAsync(arrayBuffer, previewRef.current, undefined, {
        className: "docx-render-view",
        inWrapper: false,
        ignoreLastRenderedPageBreak: false,
        useBase64URL: true,
      });

      setHasPreview(true);
    } catch (error) {
      console.error("Error rendering Word preview:", error);
      alert("Gagal memuat pratinjau dokumen.");
    } finally {
      setIsRendering(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      {/* CSS Khusus untuk Print Native */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4;
            margin: 20mm;
          }
          .docx-render-view {
            padding: 0 !important;
            box-shadow: none !important;
            background: transparent !important;
          }
          table {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <header className="w-full bg-white shadow-sm sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali ke Beranda</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">
            Word to PDF (Native)
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full">
          {/* Section Upload & Control - Hidden on Print */}
          <div className="print:hidden">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-4">Ubah Word ke PDF</h1>
              <p className="text-gray-600">Gunakan mesin cetak asli browser untuk hasil konversi paling akurat dan profesional.</p>
            </div>

            <div className="max-w-2xl mx-auto mb-10">
              <div className="relative group mb-8">
                <label 
                  className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-sm
                    ${isDragging ? "bg-red-50 border-red-500" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-red-400"}
                  `}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
                >
                  {file ? (
                    <div className="flex flex-col items-center p-4 text-center">
                      <div className="bg-blue-100 p-3 rounded-full mb-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                      <button 
                        onClick={(e) => { e.preventDefault(); setFile(null); setHasPreview(false); }}
                        className="mt-2 text-sm font-bold text-red-500 hover:underline"
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileUp className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="mb-1 text-lg font-bold text-gray-700">Klik atau seret file Word di sini</p>
                      <p className="text-sm text-gray-500 font-medium">Proses konversi melalui Native Print</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept=".docx" onChange={handleFileChange} />
                </label>
              </div>

              <div className="flex justify-center gap-4">
                {!hasPreview ? (
                  <button
                    onClick={renderPreview}
                    disabled={!file || isRendering}
                    className={`
                      px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                      ${file && !isRendering
                        ? "bg-gray-900 text-white hover:bg-black hover:scale-105 active:scale-95"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                  >
                    {isRendering ? <Loader2 className="w-6 h-6 animate-spin" /> : <Eye className="w-6 h-6" />}
                    Tampilkan Pratinjau
                  </button>
                ) : (
                  <button
                    onClick={handleNativePrint}
                    className="px-12 py-4 rounded-full bg-red-600 text-white font-black text-lg shadow-lg hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-red-200"
                  >
                    <Printer className="w-6 h-6" />
                    Simpan sebagai PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Area Pratinjau Dokumen */}
          <div className={`w-full flex flex-col items-center ${!hasPreview ? 'hidden print:hidden' : ''}`}>
            <div className="w-full text-center mb-6 print:hidden">
              <h2 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <CheckCircle2 className="text-green-500" />
                Pratinjau Dokumen Siap
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1 italic">
                Tips: Di jendela Print, pilih "Save as PDF" sebagai Destination.
              </p>
            </div>
            
            <div className="bg-white shadow-2xl rounded-sm border border-gray-200 p-0 overflow-auto max-w-full print:border-none print:shadow-none" id="print-area">
              <div ref={previewRef} className="docx-wrapper"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
