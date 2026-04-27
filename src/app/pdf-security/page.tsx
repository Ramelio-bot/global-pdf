"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { encryptPDF } from "@pdfsmaller/pdf-encrypt-lite";
import { FileUp, ArrowLeft, ShieldCheck, ShieldAlert, Loader2, Lock, Unlock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function PdfSecurityPage() {
  const [activeTab, setActiveTab] = useState<"protect" | "unlock">("protect");
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let selectedFile: File | null = null;
    if ("files" in e.target && e.target.files && e.target.files.length > 0) {
      selectedFile = e.target.files[0];
    } else if ("dataTransfer" in e && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectedFile = e.dataTransfer.files[0];
    }

    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      alert("Only PDF files are allowed.");
    }
  };

  const handleProtect = async () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }
    setIsProcessing(true);

    try {
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      
      // Perform real client-side encryption
      // This uses the Standard Security Handler (RC4 128-bit) compatible with all PDF readers
      const encryptedPdfBytes = await encryptPDF(fileBytes, password, password);
      
      downloadPdf(encryptedPdfBytes, `locked_${file.name}`);
    } catch (error) {
      console.error("Encryption Error:", error);
      alert("Critical: Encryption failed. Document was not protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnlock = async () => {
    if (!file || !password) {
      alert("Please select a file and enter a password.");
      return;
    }
    setIsProcessing(true);

    try {
      const fileBytes = await file.arrayBuffer();
      // pdf-lib supports loading encrypted files if the password is provided
      const pdfDoc = await PDFDocument.load(fileBytes, { 
        password,
        ignoreEncryption: false 
      });
      
      const unlockedPdfBytes = await pdfDoc.save();
      downloadPdf(unlockedPdfBytes, `unlocked_${file.name}`);
    } catch (error) {
      console.error("Decryption Error:", error);
      alert("Access Denied: Incorrect password or document is not encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPdf = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold uppercase tracking-tight">Security Terminal</span>
          </Link>
          <div className="font-black text-xl tracking-tighter text-gray-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-600" /> PROTECT PRO
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-16 px-4">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase">Document Lockdown</h1>
            <p className="text-gray-500 font-medium">Deploying military-grade client-side encryption for your sensitive documents.</p>
          </div>

          <div className="flex p-1.5 bg-gray-200/50 backdrop-blur-sm rounded-2xl mb-10 border border-gray-200">
            <button
              onClick={() => { setActiveTab("protect"); setFile(null); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-black transition-all ${
                activeTab === "protect" ? "bg-white text-red-600 shadow-xl" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="w-5 h-5" /> ENCRYPT
            </button>
            <button
              onClick={() => { setActiveTab("unlock"); setFile(null); setPassword(""); }}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-black transition-all ${
                activeTab === "unlock" ? "bg-white text-red-600 shadow-xl" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Unlock className="w-5 h-5" /> DECRYPT
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-gray-100 animate-in fade-in slide-in-from-bottom-6">
            <div className="mb-10">
              <label 
                className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-3xl transition-all cursor-pointer
                  ${isDragging ? "bg-red-50 border-red-500" : "bg-gray-50 border-gray-200 hover:bg-white hover:border-red-400"}
                `}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
              >
                {file ? (
                  <div className="flex flex-col items-center p-6 text-center animate-in zoom-in-95">
                    <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                      <ShieldCheck className="w-8 h-8 text-red-600" />
                    </div>
                    <span className="text-lg font-black text-gray-900 mb-1 truncate max-w-xs">{file.name}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">{(file.size / 1024).toFixed(1)} KB Ready</span>
                    <button 
                      onClick={(e) => { e.preventDefault(); setFile(null); }}
                      className="mt-4 text-sm font-black text-red-500 hover:underline"
                    >
                      CLEAR
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-red-50 transition-colors">
                      <FileUp className="w-7 h-7 text-gray-400 group-hover:text-red-500" />
                    </div>
                    <p className="text-sm font-black text-gray-400 tracking-widest uppercase">Target Document</p>
                  </div>
                )}
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>

            <div className="mb-10">
              <label className="block text-xs font-black text-gray-400 mb-3 uppercase tracking-[0.2em]">
                {activeTab === "protect" ? "Set Access Code" : "Authentication Required"}
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-500 transition-all font-mono font-bold text-xl tracking-widest bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-6 flex items-center text-gray-400 hover:text-red-600"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
              {activeTab === "protect" && (
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                  Local processing: Your password never leaves this machine.
                </div>
              )}
            </div>

            <button
              onClick={activeTab === "protect" ? handleProtect : handleUnlock}
              disabled={!file || !password || isProcessing}
              className={`
                w-full py-6 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4
                ${file && password && !isProcessing
                  ? "bg-gray-900 text-white hover:bg-black hover:-translate-y-1 active:translate-y-0 shadow-gray-200"
                  : "bg-gray-100 text-gray-300 cursor-not-allowed shadow-none"}
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  PROCESSING...
                </>
              ) : activeTab === "protect" ? (
                <>
                  <Lock className="w-6 h-6 text-red-500" />
                  INITIATE LOCKDOWN
                </>
              ) : (
                <>
                  <Unlock className="w-6 h-6 text-green-500" />
                  BYPASS ENCRYPTION
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
