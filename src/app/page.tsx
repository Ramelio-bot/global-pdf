"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileUp, FileDown, Minimize2, Image as ImageIcon, Shield, 
  FileText, FileSpreadsheet, Presentation, FileType,
  RotateCw, Trash2, Type, Hash, PenTool, Palette, Stamp, Crop,
  Search, ShieldAlert, Archive, Diff, Sparkles, Languages, FileSearch, BrainCircuit
} from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      name: "Organize",
      items: [
        { title: "Merge PDF", icon: <FileUp />, href: "/merge" },
        { title: "Split PDF", icon: <FileDown />, href: "/split-pdf" },
        { title: "Remove Pages", icon: <Trash2 />, href: "/remove-pages" },
        { title: "Rotate PDF", icon: <RotateCw />, href: "/rotate-pdf" },
      ]
    },
    {
      name: "Optimize",
      items: [
        { title: "Compress PDF", icon: <Minimize2 />, href: "/compress-pdf" },
        { title: "PDF to PDF/A", icon: <Archive />, href: "/pdf-to-pdfa" },
      ]
    },
    {
      name: "Convert to PDF",
      items: [
        { title: "Word to PDF", icon: <FileText />, href: "/word-to-pdf" },
        { title: "Excel to PDF", icon: <FileSpreadsheet />, href: "/excel-to-pdf" },
        { title: "PowerPoint to PDF", icon: <Presentation />, href: "/ppt-to-pdf" },
        { title: "Image to PDF", icon: <ImageIcon />, href: "/image-to-pdf" },
      ]
    },
    {
      name: "Convert from PDF",
      items: [
        { title: "PDF to Word", icon: <FileType />, href: "/pdf-to-word" },
        { title: "PDF to Image", icon: <ImageIcon />, href: "/pdf-to-image" },
      ]
    },
    {
      name: "Edit PDF",
      items: [
        { title: "Watermark", icon: <Type />, href: "/add-watermark" },
        { title: "Page Numbers", icon: <Hash />, href: "/add-page-numbers" },
        { title: "Sign PDF", icon: <PenTool />, href: "/sign-pdf" },
        { title: "Grayscale", icon: <Palette />, href: "/pdf-to-grayscale" },
        { title: "Overlay Image", icon: <Stamp />, href: "/overlay-image" },
        { title: "Crop PDF", icon: <Crop />, href: "/crop-pdf" },
        { title: "Redact (Sensor)", icon: <ShieldAlert />, href: "/redact-pdf" },
      ]
    },
    {
      name: "Security",
      items: [
        { title: "Protect PDF", icon: <Shield />, href: "/pdf-security" },
        { title: "Unlock PDF", icon: <Shield />, href: "/pdf-security" },
      ]
    },
    {
      name: "Intelligence",
      items: [
        { title: "OCR PDF", icon: <Languages />, href: "/ocr-pdf" },
        { title: "Compare PDF", icon: <FileSearch />, href: "/compare-pdf" },
        { title: "AI Summarizer", icon: <BrainCircuit />, href: "/ai-summarizer" },
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="bg-[#F5F5FA] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Semua Alat PDF dalam Satu Atap
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-10 font-medium"
          >
            Solusi PDF premium, 100% Gratis, Cepat, dan Mengutamakan Privasi.
          </motion.p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input 
              type="text" 
              placeholder="Cari fitur PDF... (misal: Merge, OCR, AI)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-6 rounded-2xl border-none shadow-xl focus:ring-2 focus:ring-red-500 text-lg font-medium outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Mega Menu / Categories Grid */}
      <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
          {filteredCategories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 pb-4 border-b border-gray-100">
                {cat.name}
              </h3>
              <div className="space-y-4">
                {cat.items.map((item) => (
                  <Link 
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 p-3 rounded-xl hover:bg-red-50 transition-all duration-300"
                  >
                    <div className="bg-white shadow-sm border border-gray-100 p-2.5 rounded-lg text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      {item.icon}
                    </div>
                    <span className="font-bold text-gray-700 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl font-bold text-gray-400">Fitur "{searchQuery}" tidak ditemukan.</p>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-gray-50 py-12 mt-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-black text-2xl tracking-tighter text-red-600 mb-4 italic">GLOBAL PDF</div>
          <p className="text-gray-500 font-medium text-sm">© 2024 Global PDF Tools. 100% Privacy-First documents processing.</p>
        </div>
      </footer>
    </div>
  );
}
