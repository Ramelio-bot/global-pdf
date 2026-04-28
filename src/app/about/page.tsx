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
            Global PDF Tools is a high-performance document processing suite developed by PH Digipro. We focus on providing professional-grade efficiency for experts and entrepreneurs worldwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Privacy by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              We understand the critical importance of document confidentiality. Global PDF Tools processes all files locally on your device (client-side). No files are ever uploaded to our servers.
              <span className="block mt-4 font-bold text-red-600 italic">Your privacy is our absolute priority.</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Maximum Efficiency</h3>
            <p className="text-gray-600 leading-relaxed">
              Designed for busy professionals, our tools work instantaneously without the need for registration or subscriptions. Save time with fast, reliable, and secure document processing.
            </p>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-10 text-white text-center shadow-xl shadow-red-200">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black mb-4 tracking-tight">Global Accessibility</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
            As part of our commitment to digital empowerment, PH Digipro provides this infrastructure to help individuals and businesses optimize their digital workflows globally.
          </p>
        </div>
      </main>
    </div>
  );
}
