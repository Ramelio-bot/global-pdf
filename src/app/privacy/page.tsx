import { ShieldCheck, Lock, EyeOff, Scale, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Kembali ke Beranda</span>
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
            <h1 className="text-3xl font-black text-gray-900">Kebijakan Privasi</h1>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <EyeOff className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">No Data Collection</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Kami secara tegas menyatakan bahwa Global PDF Tools **tidak pernah melihat, mengunggah, atau menyimpan** file PDF yang Anda proses melalui website kami. Seluruh interaksi dengan dokumen Anda terjadi secara eksklusif di dalam memori browser Anda.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">Client-Side Processing</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Website ini menggunakan arsitektur *client-side* murni. File PDF Anda diproses di perangkat lokal Anda (PC, Laptop, atau Smartphone). Tidak ada data file yang dikirimkan melalui internet ke server kami maupun server pihak ketiga mana pun selama proses manipulasi file berlangsung.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">No Data Trading</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Karena kami tidak memiliki akses teknis ke data Anda, kami menjamin **100% tidak ada data yang diperdagangkan atau dibagikan** kepada pengiklan, mitra, atau pihak ketiga. Privasi Anda bukan sekadar fitur, melainkan integritas dasar layanan kami.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kepatuhan Global</h2>
              <p className="text-gray-600 leading-relaxed italic">
                Pendekatan teknis kami secara otomatis mematuhi prinsip perlindungan data global seperti **GDPR (General Data Protection Regulation)** dan **CCPA (California Consumer Privacy Act)**. Hal ini dikarenakan kami tidak mengumpulkan informasi pribadi atau data sensitif yang diatur dalam regulasi tersebut.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 text-sm text-gray-500 text-center">
            Terakhir Diperbarui: 27 April 2026
          </div>
        </div>
      </main>
    </div>
  );
}
