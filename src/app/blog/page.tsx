"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";

const articles = [
  {
    title: "Why Most Small Businesses Fail in Their First Year — and How to Avoid It",
    excerpt: "Learn about common pitfalls for new entrepreneurs and how to build a solid foundation for long-term business success.",
    link: "https://artikel.myinvoice.space/",
    date: "April 23, 2026"
  },
  {
    title: "How to Increase Your Rates Without Losing Long-Term Clients",
    excerpt: "Proven strategies for raising your service rates or product prices with loyal clients without damaging the business relationship.",
    link: "https://artikel.myinvoice.space/",
    date: "April 26, 2026"
  },
  {
    title: "Is Your Business Stagnating Despite Hard Work? Here's Why",
    excerpt: "Discover why your business might be plateauing despite your best efforts and how to break through to the next level.",
    link: "https://artikel.myinvoice.space/",
    date: "April 27, 2026"
  },
  {
    title: "Client Ghosting You? How to Protect Your Professional Business",
    excerpt: "Tips on handling clients who suddenly disappear and how to secure payments with professional documentation.",
    link: "https://artikel.myinvoice.space/",
    date: "April 20, 2026"
  },
  {
    title: "Practical Guide to Calculating the Right Selling Price for Profit",
    excerpt: "A step-by-step guide to calculating COGS and profit margins so your prices are competitive yet profitable.",
    link: "https://artikel.myinvoice.space/",
    date: "April 17, 2026"
  },
  {
    title: "5 Signs Your Business Needs Digital Document Management Now",
    excerpt: "When is the right time to transition from manual record-keeping to a digital system for your business documents?",
    link: "https://artikel.myinvoice.space/",
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
            Insights & Resources
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight italic">
            GLOBAL PDF <span className="text-red-600 not-italic">RESOURCES</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-3xl mx-auto">
            Discover expert tips on document management, business productivity, and digital workflows to scale your professional operations.
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
                Read Article
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center bg-white rounded-[40px] p-12 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">Need More Professional Insights?</h2>
          <p className="text-gray-500 font-medium mb-8">Visit our official resources hub for more articles on business efficiency and professional growth.</p>
          <Link 
            href="https://artikel.myinvoice.space/" 
            target="_blank"
            className="inline-block px-10 py-4 bg-red-600 text-white font-black rounded-full hover:bg-red-700 transition-all shadow-xl shadow-red-100 hover:-translate-y-1"
          >
            Visit Knowledge Base
          </Link>
        </div>
      </main>
    </div>
  );
}
