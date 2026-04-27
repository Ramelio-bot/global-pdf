"use client";

import { ShieldCheck, Zap, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">
            About Us
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Our Mission</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Global PDF Tools exists to democratize access to premium document productivity tools. We believe that managing PDF files shouldn't be expensive, slow, or compromise your privacy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Privacy by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              This is our technical advantage. Unlike other services that upload your files to cloud servers, Global PDF Tools processes your files using your device's RAM through Javascript and WebAssembly technology.
              <span className="block mt-4 font-bold text-red-600 italic">The result? 0% of your data ever leaves your device.</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Instant Speed</h3>
            <p className="text-gray-600 leading-relaxed">
              Because there are no upload or download processes to external servers, file processing happens instantaneously. The speed of our tools is only limited by the processing power of the device you are using.
            </p>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-10 text-white text-center shadow-xl shadow-red-200">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black mb-4 tracking-tight">100% Free & Unlimited</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
            No subscriptions, no file size limits, and no account registration required. We provide an infrastructure that runs entirely on the client-side to deliver the most efficient PDF solution in the world.
          </p>
        </div>
      </main>
    </div>
  );
}
