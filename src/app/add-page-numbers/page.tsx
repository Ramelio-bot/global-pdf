"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { FileUp, ArrowLeft, Hash, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AddPageNumbersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [position, setPosition] = useState("bottom-center");
  const [isDone, setIsDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const processPageNumbers = async () => {
    if (!file) return;
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();

      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + 1} / ${pages.length}`;
        const fontSize = 10;
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        
        let x = width / 2 - textWidth / 2;
        let y = 20;

        if (position === "bottom-right") {
          x = width - textWidth - 30;
        } else if (position === "top-center") {
          y = height - 30;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `numbered_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error adding page numbers:", error);
      alert("An error occurred while adding page numbers.");
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
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">Add Page Numbers</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Add PDF Page Numbers</h1>
            <p className="text-gray-600">Automatically add page numbers to your PDF document with customizable positioning.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-4 text-center uppercase tracking-widest">
                1. Select PDF File
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-4 file:px-8 file:rounded-full file:border-0 file:text-sm file:font-black file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all cursor-pointer shadow-sm"
              />
            </div>

            {file && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="mb-12">
                  <label className="block text-sm font-bold text-gray-700 mb-6 uppercase tracking-widest text-center">
                    2. Choose Number Position
                  </label>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { id: "bottom-center", label: "Bottom Center" },
                      { id: "bottom-right", label: "Bottom Right" },
                      { id: "top-center", label: "Top Center" },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => setPosition(pos.id)}
                        className={`py-5 px-3 rounded-2xl font-black text-sm transition-all border-2
                          ${position === pos.id ? "bg-red-600 text-white border-red-600 shadow-xl scale-105" : "bg-gray-50 text-gray-600 border-gray-100 hover:border-red-200 hover:shadow-md"}
                        `}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={processPageNumbers}
                    disabled={isProcessing}
                    className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-red-200"
                  >
                    {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <Hash className="w-7 h-7" />}
                    Add Numbers & Download
                  </button>
                </div>
              </div>
            )}
          </div>

          {isDone && (
            <div className="bg-green-50 border border-green-100 p-8 rounded-2xl flex items-center gap-5 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
              <div className="bg-green-500 text-white p-3 rounded-full shadow-lg">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 tracking-tight text-lg">Success!</h3>
                <p className="text-sm text-green-700 font-bold">Page numbers have been successfully added to your document.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
