"use client";

import { ShieldCheck, Lock, EyeOff, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
            <Scale className="w-10 h-10 text-red-600" />
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Client-Side Processing (Private)</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                We explicitly state that Global PDF Tools **never views, uploads, or stores** the PDF files you process through our website. All interactions with your documents occur exclusively within your browser's memory using Javascript and WebAssembly technology. Your files never leave your device.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Google AdSense & Cookies</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                Global PDF Tools uses Google AdSense to display advertisements. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg font-medium mt-4">
                Users may opt out of personalized advertising by visiting <Link href="https://www.google.com/settings/ads" className="text-red-600 hover:underline">Ads Settings</Link>.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <EyeOff className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">User Security First</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg font-medium">
                User security and data privacy are our top priorities. Since we do not have technical access to your file data, we cannot trade, share, or lose your documents. We do not require account registration, ensuring your identity remains anonymous while using our tools.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Compliance & Contact</h2>
              <p className="text-gray-600 leading-relaxed italic font-medium">
                Our approach is designed to be inherently compliant with **GDPR** and **CCPA** by not collecting or storing personal data. If you have questions regarding our privacy practices, please contact us at <span className="text-red-600 font-bold">support@phdigipro.com</span>.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500 text-center font-bold">
            Last Updated: April 28, 2026
          </div>
        </div>
      </main>
    </div>
  );
}
