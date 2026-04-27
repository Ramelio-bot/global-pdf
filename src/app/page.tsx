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
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* Luxury Hero Section */}
      <section className="relative py-28 px-4 overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b0000] via-[#4a0000] to-[#121212] z-0"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(220,38,38,0.2)_0%,transparent_70%)] z-0"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-red-200 text-xs font-bold uppercase tracking-[0.3em]"
          >
            Privacy First
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-none"
          >
            Luxury Experience <br/> <span className="text-red-500">Document Mastery.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-12 font-medium max-w-2xl mx-auto"
          >
            The world's most powerful client-side PDF suite. 100% Secure, Private, and High-Performance Document Processing.
          </motion.p>
          
          {/* Glassmorphism Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-red-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl overflow-hidden">
              <Search className="absolute left-6 text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                placeholder="Find a professional tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-transparent text-white placeholder-gray-400 text-xl font-medium outline-none"
              />
            </div>
          </div>
        </div>

        {/* Decorative Red Line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
      </section>

      {/* Professional Mega Menu Grid */}
      <main className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-20">
          {filteredCategories.map((cat, idx) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.25em]">
                  {cat.name}
                </h3>
              </div>
              
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <Link 
                    key={item.title}
                    href={item.href}
                    className="group flex items-center gap-4 p-4 rounded-[24px] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="bg-gray-50 p-2.5 rounded-xl text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-inner">
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
            <p className="text-xl font-bold text-gray-400">Tool "{searchQuery}" not found.</p>
          </div>
        )}
      </main>

      {/* Global Luxury Footer */}
      <footer className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="font-black text-3xl tracking-tighter text-gray-900 mb-6 italic flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white not-italic text-sm">GP</div>
            GLOBAL PDF
          </div>
          <p className="text-gray-500 font-bold text-base mb-2">
            © 2026 Global PDF Tools. 100% Private & Secure.
          </p>
          <p className="text-gray-400 text-sm font-medium">100% Private & Secure Documents Processing.</p>
          
          <div className="flex justify-center gap-8 mt-10">
            <Link href="/about" className="text-gray-400 hover:text-red-600 font-bold transition-colors">About Us</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-red-600 font-bold transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
