"use client";

import { Mail, MessageSquare, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F5FA] flex flex-col font-sans text-gray-800">
      <main className="flex-grow max-w-5xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Contact Us</h1>
          <p className="text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Have questions or feedback for Global PDF Tools? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Email Support</h3>
            <p className="text-gray-500 font-medium mb-4">Our team will respond to your inquiry as soon as possible.</p>
            <a href="mailto:support@phdigipro.com" className="text-red-600 font-black text-lg hover:underline">
              support@phdigipro.com
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Technical Support</h3>
            <p className="text-gray-500 font-medium mb-4">For urgent platform-related technical inquiries.</p>
            <span className="text-red-600 font-black text-lg">
              Priority Support System
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 rounded-[32px] border border-gray-100 shadow-sm text-center"
          >
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Headquarters</h3>
            <p className="text-gray-500 font-medium mb-4 italic font-bold">
              PH Digipro <br/>
              Global Operations
            </p>
          </motion.div>
        </div>

        <div className="mt-20 bg-red-600 rounded-[40px] p-12 text-white text-center shadow-xl shadow-red-200">
          <h2 className="text-3xl font-black mb-4 tracking-tight">Open for Global Partnerships</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed font-medium">
            We are always open to new ideas and strategic collaborations to advance the global digital document ecosystem.
          </p>
        </div>
      </main>
    </div>
  );
}
