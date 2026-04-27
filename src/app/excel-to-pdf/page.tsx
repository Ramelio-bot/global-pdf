"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FileUp, ArrowLeft, FileSpreadsheet, Loader2, Download, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ExcelToPdfPage() {
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

    if (selectedFile && (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls"))) {
      setFile(selectedFile);
      setIsDone(false);
    } else if (selectedFile) {
      alert("Only Excel files (.xlsx, .xls) are allowed.");
    }
  };

  const convertExcelToPdf = async () => {
    if (!file) return;
    setIsConverting(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert sheet to JSON (array of arrays) for autoTable
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        alert("The Excel file is empty or unreadable.");
        setIsConverting(false);
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape", // Landscape is better for wide spreadsheets
        unit: "mm",
        format: "a4"
      });

      const header = jsonData[0] as string[];
      const body = jsonData.slice(1);

      autoTable(doc, {
        head: [header],
        body: body as any[][],
        theme: "grid",
        margin: { top: 15, right: 15, bottom: 15, left: 15 },
        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [220, 38, 38], // Brand Red (DC2626)
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251], // Gray 50
        },
        columnStyles: {
          0: { cellWidth: "auto" }
        }
      });

      doc.save(`${file.name.replace(/\.[^/.]+$/, "")}.pdf`);
      setIsDone(true);
    } catch (error) {
      console.error("Error converting Excel to PDF:", error);
      alert("An error occurred while converting the Excel file. Please ensure the file is not corrupted.");
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
            Excel to PDF
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Convert Excel to PDF</h1>
            <p className="text-gray-600">Instantly convert your Spreadsheets (.xlsx, .xls) into clean and professional PDF tables.</p>
          </div>

          {/* Upload Box */}
          <div className="relative group mb-8">
            <label 
              className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all cursor-pointer shadow-sm
                ${isDragging ? "bg-red-50 border-red-500" : "bg-white border-gray-300 hover:bg-gray-50 hover:border-red-400 shadow-inner"}
              `}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange(e); }}
            >
              {file ? (
                <div className="flex flex-col items-center p-4 text-center animate-in zoom-in-95">
                  <div className="bg-green-100 p-4 rounded-full mb-4 shadow-inner">
                    <FileSpreadsheet className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 mb-1 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm font-bold text-gray-500 italic">{(file.size / 1024).toFixed(1)} KB</p>
                  <button 
                    onClick={(e) => { e.preventDefault(); setFile(null); setIsDone(false); }}
                    className="mt-4 text-sm font-bold text-red-500 hover:underline"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-105 transition-all duration-300">
                  <div className="bg-gray-100 p-4 rounded-full mb-4 group-hover:bg-green-50 transition-colors shadow-inner">
                    <FileUp className="w-10 h-10 text-gray-400 group-hover:text-green-500 transition-colors" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-gray-700 tracking-tight">Click or drag Excel file (.xlsx, .xls) here</p>
                  <p className="text-sm text-gray-500 font-medium italic">Your data is safe, processed 100% locally</p>
                </div>
              )}
              <input type="file" className="hidden" accept=".xlsx,.xls" onChange={handleFileChange} />
            </label>
          </div>

          {isDone && (
            <div className="mb-8 bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-green-900 tracking-tight">Conversion Successful!</h3>
                <p className="text-sm text-green-700 font-bold">Your PDF table has been downloaded automatically.</p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={convertExcelToPdf}
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
                  Converting...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-6 h-6" />
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
