"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Trophy, User, Archive, Shield } from "lucide-react";
import { DETECTIVES, DetectiveRole } from "@/lib/data/detectives";
import DetectiveRosterCard from "@/components/detectives/DetectiveRosterCard";
import { cn } from "@/lib/utils";

type FilterRole = "All" | DetectiveRole;

const FILTER_TABS: { label: string; value: FilterRole }[] = [
  { label: "All Personnel (8)", value: "All" },
  { label: "Lead Detectives (2)", value: "Lead Detective" },
  { label: "Chroniclers (2)", value: "Chronicler" },
  { label: "Evidence Analysts (2)", value: "Evidence Analyst" },
  { label: "Interrogators (2)", value: "Interrogator" },
];

export default function DetectivesPage() {
  const [selectedRole, setSelectedRole] = useState<FilterRole>("All");

  const filteredDetectives = selectedRole === "All"
    ? DETECTIVES
    : DETECTIVES.filter((d) => d.role === selectedRole);

  return (
    <div className="relative min-h-screen w-full bg-[#0D0805] text-[#FAF6EE] flex flex-col justify-between overflow-x-hidden">
      
      {/* ================= 1970s KOLKATA DETECTIVE DESK BACKGROUND ================= */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-top z-0 filter brightness-[0.98] contrast-[1.05]"
        style={{ backgroundImage: "url('/detectives/detectives_desk_bg.jpg')" }}
      />
      {/* Delicate vignette that keeps the left lamp, drawers, and right props bright & visible */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,6,4,0.15)_0%,_rgba(10,6,4,0.35)_70%,_rgba(8,5,3,0.75)_100%)]" />

      {/* ================= TOP GLOBAL NAVIGATION BAR (IMAGE 1) ================= */}
      <header className="relative z-30 w-full border-b border-[#C99A3C]/35 bg-[#0F0A06]/92 backdrop-blur-md px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        
        {/* Left: Platform Logo Branding */}
        <Link href="/" className="flex flex-col items-start select-none group">
          <span className="font-serif font-black text-base sm:text-lg text-[#E8C66A] tracking-[0.16em] uppercase leading-tight group-hover:text-[#F3D78E] transition-colors">
            BHORER SHAHAR
          </span>
          <span className="font-mono text-[8.5px] uppercase tracking-[0.25em] text-[#C99A3C]/80 font-bold -mt-0.5">
            — CASE FILES —
          </span>
        </Link>

        {/* Center: Main App Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 bg-[#170E08]/85 p-1 rounded-lg border border-[#C99A3C]/30 shadow-inner">
          <Link href="/cases">
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-semibold text-[#D9C7A6]/70 hover:text-[#E8C66A] hover:bg-[#2A1D13] transition-all cursor-pointer">
              <Trophy className="w-3.5 h-3.5 text-[#C99A3C]" />
              <span>Cases</span>
            </button>
          </Link>

          {/* Active Detectives Tab with light parchment style */}
          <button className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-bold bg-[#FAF4E8] text-[#1A120B] shadow-md border border-[#E6C687] cursor-default">
            <User className="w-3.5 h-3.5 text-[#1A120B]" />
            <span>Detectives</span>
          </button>

          <Link href="/cases">
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-semibold text-[#D9C7A6]/70 hover:text-[#E8C66A] hover:bg-[#2A1D13] transition-all cursor-pointer">
              <Archive className="w-3.5 h-3.5 text-[#C99A3C]" />
              <span>Archive</span>
            </button>
          </Link>

          <Link href="/cases">
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-semibold text-[#D9C7A6]/70 hover:text-[#E8C66A] hover:bg-[#2A1D13] transition-all cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-[#C99A3C]" />
              <span>Profile</span>
            </button>
          </Link>
        </nav>

        {/* Right: Department Bureau Identifier */}
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-xs text-[#C99A3C]/90 tracking-wider hidden md:inline">
            Lalbazar Criminal Investigation Bureau
          </span>
          <div className="px-2.5 py-1 rounded-xs bg-[#180E07] border border-[#C99A3C]/60 text-[9.5px] font-mono font-bold text-[#E8C66A] uppercase tracking-widest shadow-xs">
            PERSONNEL ARCHIVE
          </div>
        </div>
      </header>

      {/* ================= BACK TO CASES DESK SUB-BAR ================= */}
      <div className="w-full max-w-[1120px] mx-auto px-4 sm:px-6 pt-4 relative z-20">
        <Link 
          href="/cases"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#D9C7A6]/80 hover:text-[#E8C66A] transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-[#C99A3C]" />
          <span className="uppercase tracking-widest font-semibold text-[11px]">BACK TO CASES DESK</span>
        </Link>
      </div>

      {/* ================= MAIN DOSSIER ROSTER CONTENT ================= */}
      <main className="relative z-10 w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-5 flex-1 flex flex-col">
        
        {/* HERO TITLE SECTION (IMAGE 1) */}
        <div className="mb-7 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#8C6D37]/35 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C99A3C] shadow-[0_0_8px_#C99A3C]" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#C99A3C] font-bold">
                Archival Character Roster
              </span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#FAF6EE] tracking-tight leading-tight">
              THE PERSONNEL FILES
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-[#D9C7A6]/90 mt-1">
              Eight minds. One city. Countless truths.
            </p>
          </div>

          <p className="text-xs sm:text-sm font-serif text-[#C2AE8B] max-w-md leading-relaxed">
            Every case in Kolkata demands a different temperament. Select an investigator to examine their background dossier, field methodology, and authentic case notes.
          </p>
        </div>

        {/* ROLE FILTER TABS (IMAGE 1) */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 text-[#C99A3C] mr-1 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-mono text-[10.5px] uppercase tracking-widest font-bold">Filter:</span>
          </div>

          {FILTER_TABS.map((tab) => {
            const isSelected = selectedRole === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => setSelectedRole(tab.value)}
                className={cn(
                  "px-3.5 sm:px-4 py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-150 cursor-pointer shrink-0 border",
                  isSelected
                    ? "bg-[#8C282C] text-[#FAF6EE] border-[#C99A3C]/80 shadow-[0_2px_10px_rgba(140,40,44,0.5)] font-bold"
                    : "bg-[#160E08]/85 text-[#D9C7A6]/70 border-[#3E2C1B] hover:bg-[#25170E] hover:text-[#E8C66A]"
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 4-COLUMN RESPONSIVE POSTER GRID (IMAGE 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 w-full">
          {filteredDetectives.map((detective, index) => (
            <div key={detective.id} className="w-full">
              <DetectiveRosterCard detective={detective} priority={index < 4} />
            </div>
          ))}
        </div>

      </main>

      {/* FOOTER DESK ACCENT */}
      <footer className="relative z-10 w-full border-t border-[#8C6D37]/30 py-6 px-4 text-center mt-12 bg-[#0A0704]/85">
        <div className="max-w-[1120px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#8C6D48]">
          <span>BHORER SHAHAR: CASE FILES • LALBAZAR PERSONNEL REGISTRY</span>
          <span className="italic font-serif text-[#C99A3C]">&ldquo;সত্য এখনও অপেক্ষায়&rdquo; — Truth Still Awaits</span>
        </div>
      </footer>

    </div>
  );
}

