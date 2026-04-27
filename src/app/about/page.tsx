import { ShieldCheck, Zap, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali ke Beranda</span>
          </Link>
          <div className="font-black text-xl tracking-tight text-gray-900">
            About Us
          </div>
          <div className="w-24"></div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Visi Kami</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            Global PDF Tools hadir untuk mendemokratisasi akses terhadap alat produktivitas dokumen premium. Kami percaya bahwa mengelola file PDF tidak seharusnya berbayar, lambat, atau membahayakan privasi Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy by Design</h3>
            <p className="text-gray-600 leading-relaxed">
              Inilah keunggulan teknis kami. Tidak seperti layanan lain yang mengunggah file Anda ke server cloud, Global PDF Tools memproses file Anda menggunakan RAM perangkat Anda melalui teknologi Javascript dan WebAssembly. 
              <span className="block mt-4 font-bold text-red-600">Hasilnya? 0% data Anda meninggalkan perangkat Anda.</span>
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Kecepatan Instan</h3>
            <p className="text-gray-600 leading-relaxed">
              Karena tidak ada proses unggah (*upload*) dan unduh (*download*) ke server eksternal, pemrosesan file terjadi seketika. Kecepatan alat kami hanya dibatasi oleh kekuatan prosesor perangkat yang Anda gunakan.
            </p>
          </div>
        </div>

        <div className="bg-red-600 rounded-3xl p-10 text-white text-center shadow-xl shadow-red-200">
          <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black mb-4">100% Gratis & Tanpa Batasan</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
            Tanpa langganan, tanpa batasan ukuran file, dan tanpa perlu mendaftar akun. Kami menyediakan infrastruktur yang sepenuhnya berjalan di sisi klien (client-side) untuk memberikan solusi PDF paling efisien di dunia.
          </p>
        </div>
      </main>
    </div>
  );
}
