"use client";

import { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, PenTool, Loader2, Download, CheckCircle2, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const sigCanvas = useRef<SignatureCanvas>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setIsDone(false);
    }
  };

  const clearCanvas = () => {
    sigCanvas.current?.clear();
  };

  const processSign = async () => {
    if (!file || sigCanvas.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const lastPage = pages[pages.length - 1];

      // Convert signature canvas to image
      const sigImageBase64 = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
      if (sigImageBase64) {
        const sigImage = await pdfDoc.embedPng(sigImageBase64);
        const { width, height } = lastPage.getSize();
        
        // Draw signature at bottom right (default position)
        lastPage.drawImage(sigImage, {
          x: width - 150 - 50,
          y: 50,
          width: 150,
          height: 75,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `signed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setIsDone(true);
    } catch (error) {
      console.error("Error signing PDF:", error);
      alert("An error occurred while signing the PDF.");
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
          <div className="font-black text-xl tracking-tight text-gray-900">Sign PDF</div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Sign PDF Document</h1>
            <p className="text-gray-600">Apply your digital signature directly to the last page of your PDF document.</p>
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
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest">
                      2. Draw Your Signature
                    </label>
                    <button 
                      onClick={clearCanvas}
                      className="flex items-center gap-2 text-xs font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-full transition-all border border-transparent hover:border-red-100"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  </div>
                  <div className="border-4 border-dashed border-gray-100 rounded-3xl bg-gray-50 overflow-hidden shadow-inner hover:border-red-100 transition-colors group">
                    <SignatureCanvas 
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        className: "signature-canvas w-full h-72 cursor-crosshair"
                      }}
                    />
                  </div>
                  <p className="mt-4 text-xs text-gray-500 font-bold italic text-center">Your signature is processed locally and never stored on our servers.</p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={processSign}
                    disabled={isProcessing}
                    className="bg-red-600 text-white px-14 py-5 rounded-full font-black text-lg shadow-xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 shadow-red-200"
                  >
                    {isProcessing ? <Loader2 className="w-7 h-7 animate-spin" /> : <PenTool className="w-7 h-7" />}
                    Sign & Download
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
                <p className="text-sm text-green-700 font-bold">The document has been successfully signed and downloaded.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
