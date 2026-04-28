"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

const articles = [
  {
    title: "Kerja Keras Tapi Bisnis Tidak Berkembang? Ini yang Sebenarnya Terjadi",
    excerpt: "Temukan alasan kenapa bisnis Anda jalan di tempat meskipun sudah bekerja keras dan bagaimana solusinya.",
    link: "https://artikel.myinvoice.space/2026/04/kerja-keras-tapi-bisnis-tidak.html",
    date: "April 27, 2026"
  },
  {
    title: "Cara Menaikkan Harga ke Klien Lama Tanpa Kehilangan Mereka",
    excerpt: "Strategi jitu menaikkan rate jasa atau harga produk kepada klien setia tanpa merusak hubungan bisnis.",
    link: "https://artikel.myinvoice.space/2026/04/cara-menaikkan-harga-ke-klien-lama.html",
    date: "April 26, 2026"
  },
  {
    title: "Kenapa Banyak UMKM Indonesia Tutup di Tahun Pertama — dan Cara Menghindarinya",
    excerpt: "Pelajari kesalahan umum pemilik usaha baru dan cara membangun pondasi bisnis yang kuat agar tahan lama.",
    link: "https://artikel.myinvoice.space/2026/04/kenapa-banyak-umkm-indonesia-tutup-di.html",
    date: "April 23, 2026"
  },
  {
    title: "Sudah Kerja Keras, Klien Malah Ghosting? Ini Cara Melindungi Bisnis Kamu",
    excerpt: "Tips menghadapi klien yang tiba-tiba menghilang dan cara mengamankan pembayaran dengan invoice profesional.",
    link: "https://artikel.myinvoice.space/2026/04/sudah-kerja-keras-klien-malah-ghosting.html",
    date: "April 20, 2026"
  },
  {
    title: "Cara Menghitung Harga Jual yang Tepat agar Bisnis Tidak Jual Rugi",
    excerpt: "Panduan praktis menghitung HPP dan margin keuntungan agar harga jual Anda kompetitif namun tetap profit.",
    link: "https://artikel.myinvoice.space/2026/04/cara-menghitung-harga-jual-yang-tepat.html",
    date: "April 17, 2026"
  },
  {
    title: "5 Tanda Bisnis Kamu Sudah Butuh Invoice Digital — dan Kenapa Harus Sekarang",
    excerpt: "Kapan waktu yang tepat beralih dari catatan manual ke sistem digital untuk mengelola keuangan bisnis?",
    link: "https://artikel.myinvoice.space/2026/04/5-tanda-bisnis-kamu-sudah-butuh-invoice.html",
    date: "April 15, 2026"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <main className="flex-grow max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-widest"
          >
            Insights & Tips
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight italic">
            GLOBAL PDF <span className="text-red-600 not-italic">BLOG</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
            Temukan tips seputar manajemen dokumen, keuangan bisnis, dan strategi UMKM untuk meningkatkan produktivitas Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <motion.div
              key={article.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <BookOpen className="w-4 h-4 text-red-600" />
                {article.date}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-gray-500 mb-8 flex-grow leading-relaxed font-medium">
                {article.excerpt}
              </p>
              <Link 
                href={article.link}
                target="_blank"
                className="inline-flex items-center gap-2 text-red-600 font-black text-sm uppercase tracking-tighter group/btn"
              >
                Read More
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Butuh Tips Bisnis Lainnya?</h2>
          <p className="text-gray-500 font-medium mb-8">Kunjungi blog resmi kami untuk ratusan artikel menarik lainnya tentang UMKM dan Freelance.</p>
          <Link 
            href="https://artikel.myinvoice.space/" 
            target="_blank"
            className="inline-block px-10 py-4 bg-red-600 text-white font-black rounded-full hover:bg-red-700 transition-all shadow-xl shadow-red-100 hover:-translate-y-1"
          >
            Visit My Invoice Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
