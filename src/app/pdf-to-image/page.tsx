"use client";

import { useState } from "react";
import { FileUp, ArrowLeft, Image as ImageIcon, Loader2, Download, Trash2, Archive } from "lucide-react";
import Link from "next/link";
import JSZip from "jszip";

export default function PdfToImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setImages([]);
      setProgress(0);
    } else if (selectedFile) {
      alert("Hanya file PDF yang diperbolehkan.");
    }
  };

  const convertToImages = async () => {
    if (!file) return;
    setIsProcessing(true);
    setImages([]);
    setProgress(0);

    try {
      // Import secara dinamis untuk menghindari error SSR (ReferenceError: DOMMatrix is not defined)
      const pdfjsLib = await import("pdfjs-dist");
      
      // Set worker menggunakan CDN yang sesuai dengan versi pdfjs-dist
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const imageList: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({ 
            canvasContext: context, 
            viewport,
            canvas: canvas 
          }).promise;
          
          imageList.push(canvas.toDataURL("image/jpeg", 0.9));
        }
        setProgress(Math.round((i / numPages) * 100));
      }

      setImages(imageList);
    } catch (error) {
      console.error("Error converting PDF to images:", error);
      alert("Terjadi kesalahan saat mengonversi PDF ke gambar. Pastikan file tidak rusak.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `page_${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAsZip = async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    
    images.forEach((url, index) => {
      const base64Data = url.split(",")[1];
      zip.file(`halaman_${index + 1}.jpg`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    const zipUrl = URL.createObjectURL(content);
    
    const link = document.createElement("a");
    link.href = zipUrl;
    link.download = "pdf_images.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
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
            PDF to Image
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4">Ubah PDF ke Gambar</h1>
            <p className="text-gray-600">Ekstrak setiap halaman PDF menjadi gambar JPG berkualitas tinggi dalam sekejap.</p>
          </div>

          {!images.length ? (
            <div className="max-w-2xl mx-auto w-full">
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
                      <div className="bg-red-100 p-4 rounded-full mb-4">
                        <ImageIcon className="w-10 h-10 text-red-600" />
                      </div>
                      <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                      <button 
                        onClick={(e) => { e.preventDefault(); setFile(null); }}
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
                      <p className="mb-2 text-lg font-bold text-gray-700">Klik atau seret file PDF di sini</p>
                    </div>
                  )}
                  <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={convertToImages}
                  disabled={!file || isProcessing}
                  className={`
                    px-12 py-4 rounded-full font-black text-lg shadow-lg transition-all flex items-center gap-3
                    ${file && !isProcessing
                      ? "bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 shadow-red-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                  `}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Memproses ({progress}%)
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6" />
                      Konversi ke Gambar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Hasil Konversi</h2>
                  <p className="text-sm text-gray-500 font-medium">{images.length} Halaman berhasil dikonversi</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={downloadAllAsZip}
                    className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                  >
                    <Archive className="w-5 h-5" />
                    Download All as ZIP
                  </button>
                  <button
                    onClick={() => { setImages([]); setFile(null); }}
                    className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                  >
                    <Trash2 className="w-5 h-5" />
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((url, index) => (
                  <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all">
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-50">
                      <img src={url} alt={`Halaman ${index + 1}`} className="w-full h-full object-contain p-2" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                    </div>
                    <div className="p-4 flex items-center justify-between border-t border-gray-50">
                      <span className="font-bold text-sm text-gray-700">Halaman {index + 1}</span>
                      <button
                        onClick={() => downloadImage(url, index)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Download JPG"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
