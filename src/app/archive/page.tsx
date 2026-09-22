"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Trophy, 
  User, 
  Archive as ArchiveIcon, 
  Shield, 
  Search, 
  MapPin, 
  ArrowRight, 
  Lock, 
  FolderArchive,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";

const ARCHIVED_DOCKETS = [
  {
    id: "001",
    code: "CASE 001",
    title: "The Last Ferry",
    location: "Nabadwip Ghat & Bhairavi River",
    victim: "Abir Basu (Auditor)",
    status: "Active / Solved",
    isPlayable: true,
    slug: "the-last-ferry",
    image: "/cases/case_001.png",
    summary: "Midnight crossing disappearance on MV Sonartori. 14-crore municipal tender diversion exposed. Harun Sheikh & Debashish Pal indicted.",
    disposition: "Special Branch arrest warrants executed. Accountant Basu recovered alive.",
  },
  {
    id: "002",
    code: "CASE 002",
    title: "The College Street Ledger",
    location: "Boipara, College Street",
    victim: "P. Majumdar (Bookbinder)",
    status: "Docket Pending",
    isPlayable: false,
    slug: "college-street-ledger",
    image: "/cases/case_002.png",
    summary: "Antique colonial land grant ledger stolen from locked stack 4. Suspect last sighted boarding tram #18.",
    disposition: "Pending CID Clearance after Case 001 completion.",
  },
  {
    id: "003",
    code: "CASE 003",
    title: "The Tramline Cipher",
    location: "Shyambazar Depot",
    victim: "Driver N. Dutta",
    status: "Docket Pending",
    isPlayable: false,
    slug: "tramline-cipher",
    image: "/cases/case_003.png",
    summary: "Midnight tram #18 found running on empty current loop. Encrypted wire spool taped under driver seat.",
    disposition: "Classified under Section 12.",
  },
  {
    id: "004",
    code: "CASE 004",
    title: "Shadows of Sovabazar",
    location: "North Rajbari",
    victim: "Heritage Trust",
    status: "Docket Pending",
    isPlayable: false,
    slug: "shadows-of-sovabazar",
    image: "/cases/case_004.png",
    summary: "Dynastic heirloom vanished during Durga immersion. Bloodstains lead down the private ghat steps.",
    disposition: "Pending Lalbazar assignment.",
  },
  {
    id: "005",
    code: "CASE 005",
    title: "The Chinatown Alibi",
    location: "Tiretta Bazaar",
    victim: "Shoemaker Guild",
    status: "Docket Pending",
    isPlayable: false,
    slug: "chinatown-alibi",
    image: "/cases/case_005.png",
    summary: "Burned tax receipts found in dawn alley barrel. Witness disappeared into the morning river fog.",
    disposition: "Pending Field Deployment.",
  },
  {
    id: "006",
    code: "CASE 006",
    title: "Whispers of Kumartuli",
    location: "Potters' Quarter",
    victim: "Confidential Informant",
    status: "Docket Pending",
    isPlayable: false,
    slug: "whispers-of-kumartuli",
    image: "/cases/case_006.png",
    summary: "Unregistered revolver and forged Dhaka passport found baked inside an unfinished clay deity.",
    disposition: "Docket in processing.",
  },
  {
    id: "007",
    code: "CASE 007",
    title: "The Park Street Heist",
    location: "Queen's Mansion",
    victim: "Diamond Importers",
    status: "Docket Pending",
    isPlayable: false,
    slug: "park-street-heist",
    image: "/cases/case_007.png",
    summary: "Vault bypassed without force during jazz concert. Only an imported aromatic cigar band remained.",
    disposition: "Classified under High Security.",
  },
  {
    id: "008",
    code: "CASE 008",
    title: "The Hooghly Fog Murder",
    location: "Howrah Railway Piers",
    victim: "Unknown Male",
    status: "Docket Pending",
    isPlayable: false,
    slug: "hooghly-fog-murder",
    image: "/cases/case_008.png",
    summary: "Floating iron chest recovered under Howrah cantilever piers containing unresolved 1952 case records.",
    disposition: "Vault Sealed.",
  },
];

export default function ArchivePage() {
  const [filter, setFilter] = useState<"all" | "active" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDockets = ARCHIVED_DOCKETS.filter((d) => {
    if (filter === "active" && !d.isPlayable) return false;
    if (filter === "pending" && d.isPlayable) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.victim.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="relative min-h-screen w-full bg-[#0D0805] text-[#FAF6EE] flex flex-col justify-between font-serif select-none overflow-x-hidden">
      {/* 1970s Noir Archival Background */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-top z-0 filter brightness-[0.9] contrast-[1.05]"
        style={{ backgroundImage: "url('/cases/cases_desk_bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,6,4,0.3)_0%,_rgba(10,6,4,0.6)_70%,_rgba(8,5,3,0.92)_100%)]" />

      {/* Header */}
      <header className="relative z-30 w-full border-b border-[#C99A3C]/35 bg-[#0F0A06]/92 backdrop-blur-md px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
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

          <Link href="/detectives">
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-semibold text-[#D9C7A6]/70 hover:text-[#E8C66A] hover:bg-[#2A1D13] transition-all cursor-pointer">
              <User className="w-3.5 h-3.5 text-[#C99A3C]" />
              <span>Detectives</span>
            </button>
          </Link>

          {/* Active Archive Tab */}
          <button className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-bold bg-[#FAF4E8] text-[#1A120B] shadow-md border border-[#E6C687] cursor-default">
            <ArchiveIcon className="w-3.5 h-3.5 text-[#1A120B]" />
            <span>Archive</span>
          </button>

          <Link href="/cases">
            <button className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-semibold text-[#D9C7A6]/70 hover:text-[#E8C66A] hover:bg-[#2A1D13] transition-all cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-[#C99A3C]" />
              <span>Profile</span>
            </button>
          </Link>
        </nav>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-xs text-[#C99A3C]/90 tracking-wider hidden md:inline">
            Lalbazar Central Records Vault
          </span>
          <Link
            href="/how-to-play"
            className="p-1.5 text-[#D9C7A6] hover:text-[#E8C66A] transition-colors bg-[#180E07] border border-[#C99A3C]/60 rounded-xs shadow-xs flex items-center justify-center cursor-pointer"
            aria-label="Field Manual"
            title="Field Manual"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#E8C66A]" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6">
        {/* Banner */}
        <div className="bg-[#241A13] text-[#FAF4E8] p-6 rounded-sm border-2 border-[#C99A3C]/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1 flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-[#E8C66A]" />
              <span>Lalbazar Criminal Archives & Vault</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#FAF4E8]">
              Closed Case Dockets & Evidence Archives
            </h1>
            <p className="font-serif text-xs text-[#D9C7A6]/75 mt-1">
              Historical records, solved dockets, and confidential municipal dossiers on file.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#C99A3C] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search archival records..."
              className="w-full pl-9 pr-3 py-2 bg-[#140E0A] border border-[#C99A3C]/40 rounded-xs font-mono text-xs text-[#FAF4E8] placeholder:italic placeholder:text-[#D9C7A6]/40 focus:outline-none focus:border-[#E8C66A]"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#FAF4E8] text-[#1F1710] font-bold border border-[#C99A3C]"
                : "bg-[#1C140E] text-[#D9C7A6] hover:bg-[#2A1D13] border border-[#3D2C20]"
            }`}
          >
            All Dockets ({ARCHIVED_DOCKETS.length})
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3.5 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filter === "active"
                ? "bg-[#FAF4E8] text-[#1F1710] font-bold border border-[#C99A3C]"
                : "bg-[#1C140E] text-[#D9C7A6] hover:bg-[#2A1D13] border border-[#3D2C20]"
            }`}
          >
            Active / Solved (1)
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1.5 rounded-xs font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
              filter === "pending"
                ? "bg-[#FAF4E8] text-[#1F1710] font-bold border border-[#C99A3C]"
                : "bg-[#1C140E] text-[#D9C7A6] hover:bg-[#2A1D13] border border-[#3D2C20]"
            }`}
          >
            Classified / Docket Pending (7)
          </button>
        </div>

        {/* Grid of Archived Dockets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDockets.map((docket) => (
            <motion.div
              key={docket.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-[#FAF4E8] text-[#1F1710] rounded-sm p-4 border-2 border-[#D4B26F]/60 shadow-xl flex flex-col justify-between relative bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:12px_12px]"
            >
              <div>
                {/* Photo container */}
                <div className="relative w-full aspect-[16/10] rounded-xs overflow-hidden border border-[#241A13] mb-3 bg-[#110D0A]">
                  <Image
                    src={docket.image}
                    alt={docket.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#1F1710]/90 text-[#E8C66A] font-mono text-[9px] uppercase font-bold rounded-xs border border-[#C99A3C]/40">
                    {docket.code}
                  </div>
                  <div className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-xs font-mono text-[9px] uppercase font-bold border shadow-xs"
                    style={{
                      backgroundColor: docket.isPlayable ? "#2B4C3F" : "#702428",
                      color: "#FAF4E8",
                      borderColor: docket.isPlayable ? "#8CE5B0" : "#A3343A",
                    }}
                  >
                    {docket.status}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-[#1F1710] leading-snug">
                  {docket.title}
                </h3>
                
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#665040] mt-1 mb-2">
                  <MapPin className="w-3 h-3 text-[#8C2D32]" />
                  <span className="truncate">{docket.location}</span>
                </div>

                <p className="font-serif text-xs text-[#3D2C20] leading-relaxed line-clamp-3 mb-2">
                  {docket.summary}
                </p>

                <div className="p-2 bg-[#EFE3CF] border border-[#C99A3C]/30 rounded-xs text-[11px] font-serif text-[#4A3728] italic">
                  &ldquo;{docket.disposition}&rdquo;
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-2 border-t border-[#D4B26F]/40">
                {docket.isPlayable ? (
                  <Link href={`/cases/${docket.slug}`} className="w-full block">
                    <button className="w-full py-2 bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors border border-[#A3343A]">
                      <span>Open Case Docket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                ) : (
                  <div className="w-full py-2 bg-[#E0D5C1] text-[#7A6A58] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 border border-[#C2B092] select-none">
                    <Lock className="w-3 h-3 text-[#7A6A58]" />
                    <span>Docket Locked</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs font-serif italic text-[#D9C7A6]/50 border-t border-[#3D2C20]">
        Bhorer Shahar: Case Files &bull; Calcutta Police Archives 1974
      </footer>
    </div>
  );
}
