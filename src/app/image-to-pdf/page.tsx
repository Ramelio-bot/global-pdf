"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { FileUp, ArrowLeft, X, ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ImageToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFiles: File[] = [];
    if ("files" in e.target && e.target.files) {
      selectedFiles = Array.from(e.target.files);
    } else if ("dataTransfer" in e && e.dataTransfer.files) {
      selectedFiles = Array.from(e.dataTransfer.files);
    }

    const validImages = selectedFiles.filter(file => 
      file.type === "image/jpeg" || file.type === "image/png"
    );

    if (validImages.length > 0) {
      setImages(prev => [...prev, ...validImages]);
      const newPreviews = validImages.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previews[index]);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setIsConverting(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imageFile of images) {
        const imageBytes = await imageFile.arrayBuffer();
        let embeddedImage;

        if (imageFile.type === "image/jpeg" || imageFile.type === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imageFile.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          continue;
        }

        const { width, height } = embeddedImage.scale(1);
        const page = pdfDoc.addPage([width, height]);
        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: width,
          height: height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "converted_images.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      alert("An error occurred while converting images to PDF.");
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
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">
            Image to PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Convert Images to PDF</h1>
            <p className="text-gray-600">Instantly convert your JPG and PNG images into high-quality PDF documents.</p>
          </div>

          <div className="relative group mb-10">
            <label 
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-sm group-hover:shadow-md
                ${isDragging ? "bg-red-50 border-red-500" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-red-400"}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="bg-red-50 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <FileUp className="w-10 h-10 text-red-600" />
                </div>
                <p className="mb-2 text-lg font-bold text-gray-700 tracking-tight">Click to upload images or drag here</p>
                <p className="text-sm text-gray-500 font-medium italic">Only JPG, JPEG, and PNG are allowed</p>
              </div>
              <input type="file" className="hidden" multiple accept="image/jpeg,image/png" onChange={handleFileChange} />
            </label>
          </div>

          {previews.length > 0 && (
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight font-bold">Image Previews ({images.length})</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {previews.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-all">
                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(index)}
                      className="absolute top-1.5 right-1.5 bg-white/90 hover:bg-red-600 hover:text-white text-gray-600 p-1.5 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {(images[index].size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={convertToPdf}
              disabled={images.length === 0 || isConverting}
              className={`
                px-10 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                ${images.length > 0 && !isConverting
                  ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"}
              `}
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ImageIcon className="w-6 h-6" />
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
