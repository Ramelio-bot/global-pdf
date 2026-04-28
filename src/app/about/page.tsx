"use client";

import { ShieldCheck, Zap, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">About Global PDF Tools</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Global PDF Tools adalah bagian dari ekosistem digital kami (PH Digipro & Ramelio Agro Global) yang fokus pada efisiensi dokumen bagi profesional dan pengusaha di Indonesia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Privacy by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Kami memahami pentingnya kerahasiaan dokumen bisnis Anda. Global PDF Tools memproses semua file secara lokal di perangkat Anda (client-side). Tidak ada file yang diunggah ke server kami.
              <span className="block mt-4 font-bold text-red-600 italic">Privasi Anda adalah prioritas utama kami.</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Efisiensi Maksimal</h3>
            <p className="text-gray-600 leading-relaxed">
              Didesain untuk profesional yang sibuk, alat kami bekerja secara instan tanpa perlu registrasi atau langganan. Hemat waktu Anda dengan pemrosesan dokumen yang cepat dan andal.
            </p>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-10 text-white text-center shadow-xl shadow-red-200">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black mb-4 tracking-tight">Mendukung UMKM Indonesia</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
            Sebagai bagian dari komitmen kami melalui Ramelio Agro Global dan PH Digipro, kami menyediakan infrastruktur ini secara gratis untuk membantu digitalisasi UMKM dan freelancer di seluruh Indonesia.
          </p>
        </div>
      </main>
    </div>
  );
}
