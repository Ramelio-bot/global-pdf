import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Global PDF Tools | Free, Fast & Private Online PDF Editor",
  description: "The most comprehensive free online PDF tools. Merge, split, compress, and convert PDFs instantly and 100% securely because all processing happens directly on your device without server uploads.",
};

import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1654989373253564" crossOrigin="anonymous"></script>
      </head>
      <body className="min-h-full flex flex-col bg-[#F5F5FA]">
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-xs">GP</div>
                <span className="font-black text-xl tracking-tighter text-gray-900 italic">GLOBAL PDF</span>
              </Link>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">Home</Link>
                <Link href="/blog" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">Resources</Link>
                <Link href="/about" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">About Us</Link>
                <Link href="/privacy" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">Privacy Policy</Link>
              </nav>
              <Link href="/contact" className="hidden md:block px-5 py-2 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
                Contact Us
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>

        <footer className="w-full bg-white border-t border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="text-center md:text-left">
                <div className="font-black text-2xl tracking-tighter text-gray-900 italic flex items-center justify-center md:justify-start gap-2 mb-4">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white not-italic text-xs">GP</div>
                  GLOBAL PDF
                </div>
                <p className="text-sm font-bold text-gray-400">
                  © 2026 Global PDF Tools. <br/> 100% Private & Secure.
                </p>
              </div>
              <div className="flex justify-center gap-8">
                <Link href="/about" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">About Us</Link>
                <Link href="/privacy" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">Privacy Policy</Link>
                <Link href="/contact" className="text-sm font-bold text-gray-600 hover:text-red-600 transition-colors">Contact</Link>
              </div>
              <div className="text-center md:text-right">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest mb-2">Developed by</p>
                <p className="text-sm font-black text-gray-900 italic tracking-tighter">PH Digipro</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
