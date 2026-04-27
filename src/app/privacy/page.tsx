"use client";

import { ShieldCheck, Lock, EyeOff, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">
            Privacy Policy
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
            <Scale className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <EyeOff className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">No Data Collection</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                We explicitly state that Global PDF Tools **never views, uploads, or stores** the PDF files you process through our website. All interactions with your documents occur exclusively within your browser's memory.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Client-Side Processing</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                This website utilizes a pure client-side architecture. Your PDF files are processed on your local device (PC, Laptop, or Smartphone). No file data is sent over the internet to our servers or any third-party servers during the file manipulation process.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">No Data Trading</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                Since we do not have technical access to your data, we guarantee **100% no data is traded or shared** with advertisers, partners, or third parties. Your privacy is not just a feature, but the fundamental integrity of our service.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Global Compliance</h2>
              <p className="text-gray-600 leading-relaxed italic font-medium">
                Our technical approach automatically complies with global data protection principles such as **GDPR (General Data Protection Regulation)** and **CCPA (California Consumer Privacy Act)**. This is because we do not collect personal information or sensitive data regulated by these laws.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500 text-center font-bold">
            Last Updated: April 27, 2026
          </div>
        </div>
      </main>
    </div>
  );
}
