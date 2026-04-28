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
        <main className="flex-grow">{children}</main>
        <footer className="w-full bg-white border-t border-gray-200 py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-sm font-bold text-gray-500">
                © 2026 Global PDF Tools. 100% Private & Secure.
              </div>
              <nav className="flex items-center gap-8 text-sm font-bold text-gray-600">
                <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
                <Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link>
                <Link href="/privacy" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
