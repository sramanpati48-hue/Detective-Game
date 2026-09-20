"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  Bell, 
  Settings, 
  ArrowRight, 
  Star,
  FileText, 
  SearchCode, 
  FolderLock, 
  UserCheck, 
  Compass, 
  NotebookPen 
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- ALL 8 CASES WITH HIGH-QUALITY ARTWORK & COMPLETE METADATA ---
const CASES = [
  {
    id: "001",
    code: "CASE 001",
    title: "The Last Ferry",
    location: "River Ghat",
    stars: 2,
    players: "1 Player",
    playTime: "45 - 60 mins",
    image: "/cases/case_001.png",
    briefImage: "/cases/case_brief_ferry.png",
    quote: "Some departures aren't on time.",
    description:
      "A ferry leaves every night. But someone never returns. As the river keeps its silence, you'll need to follow the clues before the next departure.",
    slug: "the-last-ferry",
  },
  {
    id: "002",
    code: "CASE 002",
    title: "Shadows in the Lanes",
    location: "Market Lanes",
    stars: 2,
    players: "2 Players",
    playTime: "60 - 75 mins",
    image: "/cases/case_002.png",
    briefImage: "/cases/case_002.png",
    quote: "Footprints vanish where shadows begin.",
    description:
      "Under the flickering gas lamps of the spice bazaar, an antique merchant vanishes into thin air. Witnesses tell conflicting tales.",
    slug: "the-last-ferry",
  },
  {
    id: "003",
    code: "CASE 003",
    title: "The Silent House",
    location: "Colonial Quarter",
    stars: 3,
    players: "1 Player",
    playTime: "50 - 60 mins",
    image: "/cases/case_003.png",
    briefImage: "/cases/case_003.png",
    quote: "The music stopped. The clock didn't.",
    description:
      "The sprawling Mukherjee manor stands locked from the inside. A gramophone plays on repeat, but no living soul responds to knocks.",
    slug: "the-last-ferry",
  },
  {
    id: "004",
    code: "CASE 004",
    title: "The Missing Ledger",
    location: "River Depot",
    stars: 2,
    players: "2 Players",
    playTime: "45 mins",
    image: "/cases/case_004.png",
    briefImage: "/cases/case_004.png",
    quote: "Ink can drown more men than water.",
    description:
      "Shipping manifests at the East River Godown have been replaced with forged duplicates. A cargo shipment went missing before dawn.",
    slug: "the-last-ferry",
  },
  {
    id: "005",
    code: "CASE 005",
    title: "Whispers on Track 7",
    location: "Railway Depot",
    stars: 2,
    players: "1 Player",
    playTime: "55 mins",
    image: "/cases/case_005.png",
    briefImage: "/cases/case_005.png",
    quote: "Steam remembers every track.",
    description:
      "The midnight Calcutta Mail rolls into Platform 7 with the engineer missing from the locomotive. Steam still hisses from the boilers.",
    slug: "the-last-ferry",
  },
  {
    id: "006",
    code: "CASE 006",
    title: "The Hand in the Crowd",
    location: "New Market",
    stars: 3,
    players: "4 Players",
    playTime: "75 - 90 mins",
    image: "/cases/case_006.png",
    briefImage: "/cases/case_006.png",
    quote: "A crowd has a thousand faces and no eyes.",
    description:
      "During the Durga Puja procession rush, a diplomatic pouch was cut clean from a British envoy's coat. A master thief lurks among thousands.",
    slug: "the-last-ferry",
  },
  {
    id: "007",
    code: "CASE 007",
    title: "The Vanishing Island",
    location: "River Islands",
    stars: 2,
    players: "2 Players",
    playTime: "60 mins",
    image: "/cases/case_007.png",
    briefImage: "/cases/case_007.png",
    quote: "What sinks at midnight rises with the dawn.",
    description:
      "A tidal sandbar temple submerges beneath the high monsoon tide every midnight. Fishermen report seeing lanterns beneath the water.",
    slug: "the-last-ferry",
  },
  {
    id: "008",
    code: "CASE 008",
    title: "A Name in the Files",
    location: "City Records",
    stars: 3,
    players: "1 Player",
    playTime: "40 mins",
    image: "/cases/case_008.png",
    briefImage: "/cases/case_008.png",
    quote: "Burned pages tell the loudest truths.",
    description:
      "A burned birth registry inside the municipal archives conceals the true lineage of the city's most influential shipping baron.",
    slug: "the-last-ferry",
  },
];

const BRIEF_TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "clues", label: "Clues", icon: SearchCode },
  { id: "evidence", label: "Evidence", icon: FolderLock },
  { id: "characters", label: "Characters", icon: UserCheck },
  { id: "locations", label: "Locations", icon: Compass },
  { id: "notes", label: "Notes", icon: NotebookPen },
];

export default function CasesHub() {
  const [activeCaseId, setActiveCaseId] = useState("001");
  const [activeBriefTab, setActiveBriefTab] = useState("overview");
  const activeCase = CASES.find((c) => c.id === activeCaseId) || CASES[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0906] text-[#F8F2E7] flex flex-col overflow-hidden font-sans select-none">
      
      {/* 1. PHOTOREALISTIC ATMOSPHERIC DETECTIVE DESK ENVIRONMENT */}
      {/* Deep mahogany wood wall backdrop with vintage radial vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(45,28,17,0.92)_0%,_rgba(10,6,4,0.98)_85%)]" />

      {/* Warm Hanging Brass Lamp in top right */}
      <div 
        className="absolute top-0 right-[23%] w-[380px] h-[130px] bg-contain bg-top bg-no-repeat pointer-events-none z-10 opacity-95"
        style={{ backgroundImage: "url('/cases/top_lamp_feathered.png')" }}
      />
      
      {/* Radial Lamp Spotlight illuminating the corkboard and desk */}
      <div className="absolute top-0 right-[21%] w-[680px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(240,180,75,0.14)_0%,_rgba(180,120,40,0.04)_50%,_transparent_75%)] pointer-events-none z-10" />

      {/* Photorealistic Detective Desk Foreground at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-[105px] md:h-[120px] bg-cover bg-bottom pointer-events-none z-30 shadow-[0_-15px_35px_rgba(0,0,0,0.95)]"
        style={{ backgroundImage: "url('/cases/desk_bottom_feathered.png')" }}
      />

      {/* TOP BAR */}
      <header className="relative z-20 flex justify-between items-start px-8 pt-3 pb-1.5">
        <div className="flex flex-col">
          <Link href="/" className="group inline-flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-[#E8C66A] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold transition-colors group-hover:text-[#F2E3C6]">
              BHORER SHAHAR
            </h1>
          </Link>
          <div className="flex items-center gap-3 mt-0.5">
            <p className="font-serif text-xs tracking-[0.35em] text-[#D9C7A6] uppercase font-semibold">Case Files</p>
            <span className="text-[#A84743] opacity-60">•</span>
            <p className="text-[11px] text-[#A84743] font-mono italic opacity-90">
              Some cities never sleep. They just hide their secrets.
            </p>
          </div>
        </div>

        {/* SEARCH & CONTROLS */}
        <div className="flex flex-col items-end gap-1 pt-0.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-[#1c140e]/95 border border-[#C99A3C]/40 px-3.5 py-1.5 rounded-xs shadow-inner backdrop-blur-xs">
              <Search className="w-3.5 h-3.5 text-[#D9C7A6]/70 mr-2.5" />
              <input 
                type="text" 
                placeholder="Search cases, locations..." 
                className="bg-transparent border-none outline-none text-xs text-[#EAE1D1] placeholder:text-[#D9C7A6]/40 w-44 font-mono"
              />
            </div>
            <button className="relative p-2 text-[#D9C7A6] hover:text-[#E8C66A] transition-colors bg-[#1c140e]/95 border border-[#C99A3C]/40 rounded-xs shadow-xs cursor-pointer" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A84743] rounded-full shadow-[0_0_6px_#A84743]" />
            </button>
            <button className="p-2 text-[#D9C7A6] hover:text-[#E8C66A] transition-colors bg-[#1c140e]/95 border border-[#C99A3C]/40 rounded-xs shadow-xs cursor-pointer" aria-label="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <p className="font-serif italic text-[10px] text-[#E8C66A]/75 tracking-wider pr-1">
            Same Streets. Different Secrets.
          </p>
        </div>
      </header>

      {/* MAIN 3-COLUMN DESK INTERFACE */}
      <main className="flex-1 flex px-6 md:px-8 pb-[125px] gap-5 relative z-10 pt-1 max-w-[1900px] mx-auto w-full h-full overflow-hidden">
        
        {/* ================= COLUMN 1: SNEHANSH YADAV CLIPBOARD ================= */}
        <aside className="w-[265px] flex-shrink-0 flex flex-col h-full overflow-hidden">
          <div className="bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E5D7BF] text-[#1E1712] rounded-xs p-3.5 relative shadow-[0_20px_45px_rgba(0,0,0,0.9)] border-2 border-[#C2B092] flex flex-col h-full justify-between no-scrollbar">
            
            {/* Vintage Metal Binder Clip */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-7 bg-gradient-to-b from-[#8C7A60] via-[#5E503B] to-[#3B3020] rounded-sm shadow-md border border-[#C99A3C]/70 flex items-center justify-center z-20">
              <div className="w-14 h-1.5 bg-[#261E14] rounded-full opacity-70" />
            </div>

            <div>
              {/* Polaroid Photo Frame */}
              <div className="mt-2.5 p-2 bg-white shadow-md border border-[#D0C4AF] rounded-xs relative">
                <div className="w-full aspect-[4/4.2] relative bg-[#121820] overflow-hidden rounded-2xs">
                  <Image 
                    src="/cases/detective_snehansh.png"
                    alt="Snehansh Yadav"
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="mt-2.5">
                <h2 className="font-serif text-lg font-bold text-[#1F1710] tracking-tight leading-tight">
                  Snehansh Yadav
                </h2>
                <p className="font-mono text-[9px] text-[#6E5840] tracking-widest uppercase font-semibold mt-0.5">
                  Investigator
                </p>
              </div>

              {/* Level Progress */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="font-serif text-xs font-bold text-[#2C211B]">Level 7</span>
                <div className="flex-1 h-2 bg-[#D9CBBB] rounded-full overflow-hidden border border-[#BFA885]">
                  <div className="w-[70%] h-full bg-[#C99A3C] shadow-sm" />
                </div>
              </div>

              {/* Quote */}
              <div className="mt-2.5 py-2 px-1 border-y border-[#8A7558]/25 text-center">
                <p className="font-serif italic text-xs text-[#3A3022] leading-snug">
                  &ldquo;Questions find better places than answers.&rdquo;
                </p>
              </div>

              {/* Stats Table */}
              <div className="mt-2.5 bg-[#121820] text-[#FAF6EE] p-2.5 rounded-xs border border-[#2A3442] shadow-inner font-mono text-[11px] space-y-1.5">
                <div className="flex justify-between items-center border-b border-[#2A3442] pb-1">
                  <span className="text-[#8C9AA8]">Cases Solved</span>
                  <span className="font-bold text-[#FAF6EE]">12</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#2A3442] pb-1">
                  <span className="text-[#8C9AA8]">Ongoing</span>
                  <span className="font-bold text-[#FAF6EE]">3</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#2A3442] pb-1">
                  <span className="text-[#8C9AA8]">Badges</span>
                  <span className="font-bold text-[#FAF6EE]">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8C9AA8]">Reputation</span>
                  <span className="font-bold text-[#E8C66A]">780</span>
                </div>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-2 border-t border-[#8A7558]/20 text-center opacity-85">
              <p className="font-serif text-[10px] text-[#6E5840] italic">
                Same city. Different truths.
              </p>
            </div>

          </div>
        </aside>

        {/* ================= COLUMN 2: CORKBOARD & 8 INTERACTIVE CARDS ================= */}
        <section className="flex-1 flex flex-col h-full min-w-0">
          
          {/* FOLDER TABS */}
          <div className="flex gap-1.5 pl-3 relative z-20">
            <button className="bg-gradient-to-b from-[#FAF4E8] to-[#EFE5D0] text-[#1F1710] font-serif font-bold text-xs uppercase px-7 py-2 rounded-t-sm shadow-[0_-4px_10px_rgba(0,0,0,0.5)] border-t border-x border-[#C2B092] tracking-widest cursor-default">
              Cases
            </button>
            <Link href="/detectives">
              <button className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-sm border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer">
                Detectives
              </button>
            </Link>
            <Link href="/archive">
              <button className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-sm border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer">
                Archive
              </button>
            </Link>
            <Link href="/profile">
              <button className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-sm border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer">
                Profile
              </button>
            </Link>
          </div>

          {/* CORKBOARD BODY (Grid of 8 Cards with Red Pins and Dark Wood Frame) */}
          <div 
            className="flex-1 relative shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_20px_50px_rgba(0,0,0,0.95)] border-[6px] border-[#2C1C10] rounded-b-sm rounded-tr-sm p-3.5 overflow-hidden flex flex-col justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/cases/cork_clean_bg.png')" }}
          >
            
            {/* Metallic Corner Rivets */}
            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />

            {/* Red Investigation Thread effect / Subtle vignette */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.85)_100%)]" />

            {/* 4x2 GRID OF AUTHENTIC VINTAGE CASE CARDS */}
            <div className="grid grid-cols-4 grid-rows-2 gap-3.5 h-full w-full relative z-10">
              {CASES.map((caseItem) => {
                const isActive = caseItem.id === activeCaseId;

                return (
                  <div 
                    key={caseItem.id}
                    onClick={() => setActiveCaseId(caseItem.id)}
                    className={cn(
                      "bg-gradient-to-b from-[#FBF5EB] via-[#F4EADA] to-[#E8DBC4] text-[#1E1712] rounded-xs p-2 flex flex-col justify-between relative shadow-[0_6px_16px_rgba(0,0,0,0.7)] border transition-all duration-200 cursor-pointer group select-none",
                      isActive 
                        ? "border-[#F0D078] ring-2 ring-[#F0D078] shadow-[0_0_22px_rgba(240,208,120,0.55),0_8px_20px_rgba(0,0,0,0.8)] scale-[1.015] z-20" 
                        : "border-[#C8B696] hover:border-[#F0D078]/80 hover:shadow-[0_8px_24px_rgba(0,0,0,0.85)] hover:scale-[1.01]"
                    )}
                  >
                    {/* Red Pushpin with Specular Highlight and Cast Shadow */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#7A1F24] via-[#A84743] to-[#E55B5B] shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-[#4A1013]" />
                      <div className="w-1 h-1 rounded-full bg-white/80 absolute top-0.5 left-1" />
                    </div>

                    {/* Card Photo Container with Stamped Case Tag */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-xs border border-[#2A2016]/70 shadow-inner bg-[#0D0A08]">
                      {/* Stamped Case Tag Overlapping Photo Corner */}
                      <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-[2px] bg-[#FAF3E5] border border-[#8C6D48]/50 shadow-xs text-[#8C282C] font-mono text-[9px] font-bold tracking-wider">
                        {caseItem.code}
                      </div>

                      <Image 
                        src={caseItem.image}
                        alt={caseItem.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Title & Metadata Grouped Directly Under Photo */}
                    <div className="mt-1.5">
                      <h3 className="font-serif font-bold text-[12px] leading-tight text-[#1F1710] line-clamp-1">
                        {caseItem.title}
                      </h3>
                      
                      {/* Location & Meta Badges (Single Row) */}
                      <div className="flex items-center justify-between text-[10px] mt-1">
                        <div className="flex items-center gap-1 text-[#6E5840]">
                          <MapPin className="w-2.5 h-2.5 text-[#C99A3C] shrink-0" />
                          <span className="truncate font-medium">{caseItem.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <div className="flex text-[#C99A3C]">
                            {[...Array(3)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={cn(
                                  "w-2.5 h-2.5", 
                                  i < caseItem.stars ? "fill-[#C99A3C] text-[#C99A3C]" : "text-[#C2B092]/50"
                                )} 
                              />
                            ))}
                          </div>
                          <span className="text-[9px] font-mono text-[#FAF6EE] bg-[#221912] px-1.5 py-0.5 rounded-[3px] border border-[#443224] flex items-center gap-1">
                            <Users className="w-2 h-2 text-[#C99A3C]" />
                            {caseItem.players}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Antique Embossed Brass Plaque Open Case Button */}
                    <div className="mt-2 pt-1.5 border-t border-[#C2B092]/40">
                      <Link href={`/cases/${caseItem.slug}`} className="w-full block">
                        <button className="w-full py-1 bg-gradient-to-b from-[#BFA265] via-[#8C6C38] to-[#5C4320] hover:from-[#D4B578] hover:to-[#705228] text-[#FAF6EE] font-serif text-[10px] font-bold tracking-[0.2em] uppercase rounded-full border border-[#D4B578]/80 shadow-[0_2px_5px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] transition-all cursor-pointer">
                          Open Case
                        </button>
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= COLUMN 3: CASE BRIEF DOSSIER & VERTICAL TABS ================= */}
        <aside className="w-[380px] flex-shrink-0 flex h-full overflow-hidden gap-1.5 relative">
          
          {/* Main Case Dossier Card (Weathered Aged Tea-Stained Parchment) */}
          <div className="flex-1 bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E3D4B8] text-[#1E1712] rounded-sm p-3.5 relative shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-2 border-[#8A7558] flex flex-col h-full justify-between no-scrollbar">
            
            {/* Vintage Metal Dossier Binder Clip at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-gradient-to-b from-[#7A6342] via-[#5C4A31] to-[#3D301E] rounded-sm shadow-md border border-[#C99A3C]/70 flex items-center justify-center z-20">
              <div className="w-10 h-0.5 bg-[#261E14] rounded-full opacity-70" />
            </div>

            <div>
              {/* Header Label with Amber Indicator */}
              <div className="flex justify-between items-center mb-2 border-b border-[#A69375]/40 pb-1.5 mt-0.5">
                <span className="font-serif text-xs text-[#5C4625] tracking-[0.25em] uppercase font-bold">
                  Case Brief
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#C99A3C] shadow-[0_0_8px_#C99A3C] border border-[#8C6B28]" />
              </div>

              {/* Large Case Brief Photo (Full HD Crisp Render with Vintage Border) */}
              <div className="w-full aspect-[16/9] relative mb-2.5 overflow-hidden rounded-xs border-2 border-[#3D3124] shadow-md bg-[#0F0C08]">
                <Image 
                  src={activeCase.briefImage}
                  alt={activeCase.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              </div>

              {/* Case Code & Title */}
              <div className="mb-2">
                <div className="font-mono text-[10px] text-[#8C282C] font-bold tracking-widest uppercase">
                  {activeCase.code}
                </div>
                <h2 className="font-serif text-xl font-bold text-[#1F1710] leading-tight mt-0.5">
                  {activeCase.title}
                </h2>
              </div>

              {/* Key Meta Badges (Matching Reference Design Key-Value Rows) */}
              <div className="space-y-1.5 py-2 border-y border-[#A69375]/35 text-[11px] font-mono text-[#3E3024] mb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6B28] shrink-0" />
                  <span className="font-semibold text-[#1F1710]">{activeCase.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#6E5840]">
                    <span className="w-3.5 text-center text-xs">👥</span> Difficulty
                  </span>
                  <span className="text-[#C99A3C] font-bold text-xs tracking-wider">
                    {"★".repeat(activeCase.stars)}{"☆".repeat(3 - activeCase.stars)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#6E5840]">
                    <Users className="w-3.5 h-3.5 text-[#8C6B28] shrink-0" /> Players
                  </span>
                  <span className="font-semibold text-[#1F1710]">{activeCase.players}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-[#6E5840]">
                    <Clock className="w-3.5 h-3.5 text-[#8C6B28] shrink-0" /> Estimated Play Time
                  </span>
                  <span className="font-semibold text-[#1F1710]">{activeCase.playTime}</span>
                </div>
              </div>

              {/* Story Description (Typewriter / Detective dossier style) */}
              <p className="font-serif text-[11px] leading-relaxed text-[#2C211A]/95 italic line-clamp-3">
                &ldquo;{activeCase.description}&rdquo;
              </p>
            </div>

            {/* Bottom Actions & Attached Authentic Memo Slip */}
            <div className="pt-1.5">
              {/* Primary Call to Action Button: Rich Crimson Leather Finish */}
              <Link href={`/cases/${activeCase.slug}`}>
                <button className="w-full group flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#702428] via-[#852C32] to-[#702428] hover:from-[#852C32] hover:to-[#96333A] text-[#FAF6EE] font-serif text-xs font-bold tracking-[0.2em] uppercase py-2.5 px-4 border border-[#A23840] shadow-[0_4px_15px_rgba(112,36,40,0.5)] transition-all cursor-pointer rounded-xs">
                  <span>Start Investigation</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              {/* Authentic Weathered Paper Memo Slip with Pinned Ferry Stamp */}
              <div className="mt-2.5 relative flex justify-center">
                <div className="relative w-full max-w-[280px] h-[52px] shadow-sm transform -rotate-0.5">
                  <Image 
                    src="/cases/memo_slip_clean.png"
                    alt="Some departures aren't on time"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Vertical Navigation Tabs on the Right Edge */}
          <div className="w-[40px] flex-shrink-0 flex flex-col gap-1 py-1">
            {BRIEF_TABS.map((tab) => {
              const isSelected = activeBriefTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBriefTab(tab.id)}
                  title={tab.label}
                  className={cn(
                    "w-full py-2.5 flex flex-col items-center justify-center rounded-xs transition-all border text-[10px] font-mono uppercase tracking-tighter cursor-pointer",
                    isSelected
                      ? "bg-[#652429] text-[#FAF6EE] border-[#8D373E] shadow-sm"
                      : "bg-[#141A22] text-[#8C9AA8] border-[#222C38] hover:bg-[#1E2632] hover:text-[#E8C66A]"
                  )}
                >
                  <TabIcon className="w-3.5 h-3.5 mb-1" />
                  <span className="[writing-mode:vertical-lr] scale-90 tracking-widest text-[9px]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

        </aside>

      </main>

    </div>
  );
}
