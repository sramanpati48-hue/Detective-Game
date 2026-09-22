"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Search,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import FieldManualTabs from "@/components/how-to-play/FieldManualTabs";
import FairPlayPromise from "@/components/how-to-play/FairPlayPromise";

export default function HowToPlayPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/cases");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0D0805] text-[#FAF6EE] flex flex-col justify-between overflow-x-hidden print:bg-white print:text-black">
      {/* 1940s Kolkata Detective Desk Background */}
      <div
        className="fixed inset-0 pointer-events-none bg-cover bg-top z-0 filter brightness-[0.92] contrast-[1.08] print:hidden"
        style={{ backgroundImage: "url('/cases/cases_desk_bg.jpg')" }}
      />

      {/* Atmospheric Vignette and Overhead Desk Lamp Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_rgba(240,180,75,0.12)_0%,_rgba(10,6,4,0.65)_70%,_rgba(8,5,3,0.92)_100%)] print:hidden" />

      {/* Top Header Navigation */}
      <header className="relative z-20 w-full border-b border-[#C99A3C]/35 bg-[#0F0A06]/92 backdrop-blur-md px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-xl print:hidden">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#1F1710] hover:bg-[#2D1F17] text-[#D9C7A6] hover:text-[#E8C66A] border border-[#C99A3C]/40 text-xs font-mono transition-colors cursor-pointer"
            title="Return to previous desk"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E8C66A]" />
            <span>Return</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg sm:text-xl text-[#E8C66A] tracking-wider uppercase">
                THE FIELD MANUAL
              </span>
              <span className="px-2 py-0.5 rounded-xs bg-[#702428] text-[#FAF4E8] font-mono text-[9px] uppercase font-bold tracking-widest border border-[#C99A3C]/40">
                Official Edition
              </span>
            </div>
            <p className="font-mono text-[10px] text-[#C99A3C]/80 uppercase tracking-widest -mt-0.5">
              Lalbazar Special Division &bull; Standard Operating Procedures
            </p>
          </div>
        </div>

        {/* Right: Search & Print Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Filter Input */}
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-[#C99A3C] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search manual (e.g. scoring, hints)..."
              className="bg-[#180E07]/90 border border-[#C99A3C]/40 text-[#FAF4E8] placeholder:text-[#8C6D48] text-xs font-mono rounded-xs pl-8 pr-3 py-1.5 w-48 sm:w-64 focus:outline-none focus:border-[#E8C66A] shadow-inner"
            />
          </div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#1F1710] hover:bg-[#2D1F17] text-[#D9C7A6] hover:text-[#E8C66A] border border-[#C99A3C]/40 text-xs font-mono transition-colors cursor-pointer"
            title="Print a physical copy of this manual"
          >
            <Printer className="w-3.5 h-3.5 text-[#C99A3C]" />
            <span className="hidden sm:inline">Print Manual</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 md:px-8 py-8 max-w-6xl mx-auto w-full print:p-0 print:m-0">
        {/* Hero Header on Desk */}
        <div className="text-center max-w-2xl mx-auto mb-8 print:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#1F1710]/90 border border-[#C99A3C]/50 text-[#E8C66A] font-mono text-xs uppercase tracking-widest mb-2 shadow-md">
            <BookOpen className="w-3.5 h-3.5" />
            Confidential Department Reference
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#FAF4E8] tracking-tight drop-shadow-md">
            Investigator&apos;s Field Manual
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-[#D9C7A6]/80 mt-2">
            A comprehensive guide to evidence analysis, cross-disciplinary squad cooperation,
            and cracking cases across the streets of Calcutta.
          </p>
        </div>

        {/* Tabbed Booklet Component */}
        <FieldManualTabs searchQuery={searchQuery} />

        {/* Lalbazar Fair Play Covenant Certificate */}
        <FairPlayPromise />

        {/* Ready to Investigate CTA Section */}
        <div className="relative my-12 p-8 rounded-sm bg-[#160E0A]/90 border border-[#C99A3C]/40 text-center max-w-3xl mx-auto shadow-2xl backdrop-blur-md print:hidden">
          <h3 className="font-serif text-2xl font-bold text-[#E8C66A] mb-2">
            Ready to Open Your First Case File?
          </h3>
          <p className="font-serif text-sm text-[#D9C7A6]/80 max-w-xl mx-auto mb-6 leading-relaxed">
            The night mist has settled over the Hooghly. Case 001: The Last Ferry is awaiting your inspection
            at the Lalbazar records registry.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/cases"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xs bg-gradient-to-r from-[#8C2D32] to-[#B0383F] hover:from-[#A1343A] hover:to-[#C24047] text-[#FAF4E8] font-serif text-xs uppercase font-extrabold tracking-widest border border-[#E8C66A] shadow-lg transition-transform hover:scale-105"
            >
              <span>Enter Cases Hub</span>
              <ChevronRight className="w-4 h-4 text-[#E8C66A]" />
            </Link>
          </div>
        </div>
      </main>

      {/* Noir Footer */}
      <footer className="relative z-10 py-4 px-8 text-center text-xs font-serif italic text-[#D9C7A6]/50 border-t border-[#3D2C20] bg-[#120D09]/90 print:hidden">
        Bhorer Shahar: Case Files &bull; Special Division, Lalbazar &bull; Department of Public Inquiries &bull; Calcutta
      </footer>

      {/* Print-specific style block */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header,
          footer,
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
