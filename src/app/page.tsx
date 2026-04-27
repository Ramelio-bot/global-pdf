import { FileUp, FileDown, Minimize2, Image as ImageIcon, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs and images into a single PDF document effortlessly.",
      icon: <FileUp className="w-12 h-12 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300" />,
      href: "/merge",
    },
    {
      title: "Split PDF",
      description: "Extract pages from your PDF or save each page as a separate PDF.",
      icon: <FileDown className="w-12 h-12 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300" />,
      href: "/split-pdf",
    },
    {
      title: "Compress PDF",
      description: "Reduce file size while optimizing for maximal PDF quality.",
      icon: <Minimize2 className="w-12 h-12 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300" />,
      href: "/compress-pdf",
    },
    {
      title: "Image to PDF",
      description: "Convert JPG, PNG, or TIFF images into PDF documents easily.",
      icon: <ImageIcon className="w-12 h-12 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300" />,
      href: "/image-to-pdf",
    },
    {
      title: "PDF Security",
      description: "Add passwords and set permissions to protect your PDF documents.",
      icon: <Shield className="w-12 h-12 text-red-500 mb-5 group-hover:scale-110 transition-transform duration-300" />,
      href: "/pdf-security",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      {/* Header */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-red-600 text-white p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <FileUp className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900">
              Global PDF Tools
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/merge" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">MERGE PDF</Link>
            <Link href="/split-pdf" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">SPLIT PDF</Link>
            <Link href="/compress-pdf" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">COMPRESS PDF</Link>
            <Link href="#" className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors">ALL PDF TOOLS</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            Setiap Alat yang Anda Butuhkan untuk <span className="text-red-600">Mengelola PDF</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            100% Gratis, Cepat, dan Mengutamakan Privasi. Semua pemrosesan dilakukan secara lokal di perangkat Anda tanpa perlu mengunggah ke server.
          </p>
        </section>

        {/* Tools Grid Section */}
        <section className="max-w-6xl w-full mx-auto pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-center">
            {tools.map((tool, index) => (
              <Link 
                key={index} 
                href={tool.href}
                className="group bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center cursor-pointer"
              >
                {tool.icon}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">{tool.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

    </div>
  );
}
