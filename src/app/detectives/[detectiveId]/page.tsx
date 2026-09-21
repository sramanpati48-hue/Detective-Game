import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  Trophy, 
  User, 
  Archive, 
  Shield, 
  Search, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { DETECTIVES, getDetectiveById, getAdjacentDetectives } from "@/lib/data/detectives";
import DetectiveProfileHero from "@/components/detectives/DetectiveProfileHero";
import DetectiveTabs from "@/components/detectives/DetectiveTabs";
import DetectiveSidebarRoster from "@/components/detectives/DetectiveSidebarRoster";

interface DetectivePageProps {
  params: Promise<{
    detectiveId: string;
  }>;
}

// Generate static params for all 8 canonical detectives
export async function generateStaticParams() {
  return DETECTIVES.map((d) => ({
    detectiveId: d.id,
  }));
}

// Dynamic SEO and Social Share Metadata
export async function generateMetadata({ params }: DetectivePageProps): Promise<Metadata> {
  const { detectiveId } = await params;
  const detective = getDetectiveById(detectiveId);

  if (!detective) {
    return {
      title: "Detective Not Found | Bhorer Shahar: Case Files",
      description: "Archival dossier could not be located in Lalbazar records.",
    };
  }

  const shortDesc = detective.backstory.slice(0, 155) + "...";

  return {
    title: `${detective.name} — ${detective.role} | Bhorer Shahar: Case Files`,
    description: shortDesc,
    openGraph: {
      title: `${detective.name} (${detective.role}) — Bhorer Shahar`,
      description: shortDesc,
      images: [
        {
          url: detective.rosterPortrait || detective.heroPortrait,
          width: 800,
          height: 1100,
          alt: `${detective.name} — ${detective.role}`,
        },
      ],
    },
  };
}

export default async function DetectiveProfilePage({ params }: DetectivePageProps) {
  const { detectiveId } = await params;
  const detective = getDetectiveById(detectiveId);

  if (!detective) {
    notFound();
  }

  const { prev, next } = getAdjacentDetectives(detective.id);

  return (
    <div className="relative min-h-screen w-full bg-[#0D0805] text-[#FAF6EE] flex flex-col justify-between overflow-x-hidden">
      
      {/* ================= 1970s KOLKATA DETECTIVE DOSSIER DESK BACKGROUND ================= */}
      <div 
        className="fixed inset-0 pointer-events-none bg-cover bg-top z-0 filter brightness-[0.98] contrast-[1.05]"
        style={{ backgroundImage: "url('/detectives/detective_dossier_desk_bg.jpg')" }}
      />
      {/* Delicate vignette that keeps the desk lamp, drawers, and scattered props visible */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_rgba(10,6,4,0.2)_0%,_rgba(10,6,4,0.45)_70%,_rgba(8,5,3,0.85)_100%)]" />

      {/* ================= TOP GLOBAL NAVIGATION BAR ================= */}
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
          <Link href="/detectives">
            <button className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-md font-mono text-[11px] uppercase tracking-wider font-bold bg-[#FAF4E8] text-[#1A120B] shadow-md border border-[#E6C687] cursor-pointer">
              <User className="w-3.5 h-3.5 text-[#1A120B]" />
              <span>Detectives</span>
            </button>
          </Link>

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

        {/* Right: Quote + Search + User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="font-serif italic text-xs text-[#C99A3C]/90 tracking-wider hidden xl:inline">
            Kolkata. Same streets. Different truths.
          </span>

          {/* Search Input */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-3.5 h-3.5 text-[#C99A3C] absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search detectives..."
              readOnly
              className="bg-[#180E07]/90 border border-[#C99A3C]/40 text-[#FAF4E8] placeholder:text-[#8C6D48] text-xs font-mono rounded-md pl-8 pr-3 py-1.5 w-40 lg:w-48 focus:outline-none focus:border-[#E8C66A] shadow-inner"
            />
          </div>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#C99A3C]/30">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#C99A3C]/70 shadow-xs">
              <Image
                src="/detectives/vikram-oberoi-noir.jpg"
                alt="User Avatar"
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="font-serif text-xs font-bold text-[#FAF4E8]">Snehansh</span>
              <span className="font-mono text-[9px] text-[#C99A3C] mt-0.5">Level 7</span>
            </div>
            <Settings className="w-3.5 h-3.5 text-[#C99A3C]/80 hover:text-[#E8C66A] cursor-pointer ml-1 transition-colors" />
          </div>
        </div>
      </header>

      {/* ================= MAIN TWO-COLUMN DOSSIER VIEW ================= */}
      <main className="relative z-10 w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 flex flex-col lg:flex-row gap-5">
        
        {/* LEFT COLUMN: Roster Sidebar Quick-Switcher */}
        <DetectiveSidebarRoster activeDetectiveId={detective.id} />

        {/* RIGHT COLUMN: The Confidential Personnel File Board */}
        <section className="flex-1 flex flex-col gap-3.5 min-w-0 p-3 sm:p-4.5 rounded-2xl border-2 border-[#8C6D37]/75 bg-[#0E0805]/85 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative">
          
          {/* Brass Corner Studs */}
          <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#523C1A] shadow-xs pointer-events-none" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#523C1A] shadow-xs pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#523C1A] shadow-xs pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37] border border-[#523C1A] shadow-xs pointer-events-none" />

          {/* Main Hero Dossier Card */}
          <DetectiveProfileHero detective={detective} />

          {/* Archival Tabs Section */}
          <DetectiveTabs detective={detective} />

          {/* Bottom Cycling Navigation (Previous / Next Detective) */}
          <nav 
            aria-label="Detective cycling navigation"
            className="mt-4 pt-4 border-t border-[#8C6D37]/35 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <Link
              href={`/detectives/${prev.id}`}
              className="group p-3 rounded-xl border border-[#8C6D37]/40 bg-[#160F0A]/90 hover:bg-[#22160E] hover:border-[#E8C66A] transition-all duration-200 flex items-center gap-3 shadow-md outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#24170E] border border-[#C99A3C]/50 flex items-center justify-center text-[#FAF6EE] group-hover:bg-[#8C282C] transition-colors shrink-0">
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#8C6D37] block font-semibold">
                  ← Previous File
                </span>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FAF6EE] group-hover:text-[#E8C66A] truncate">
                  {prev.name}
                </h4>
              </div>
            </Link>

            <Link
              href={`/detectives/${next.id}`}
              className="group p-3 rounded-xl border border-[#8C6D37]/40 bg-[#160F0A]/90 hover:bg-[#22160E] hover:border-[#E8C66A] transition-all duration-200 flex items-center justify-end text-right gap-3 shadow-md outline-none"
            >
              <div className="min-w-0">
                <span className="font-mono text-[8.5px] uppercase tracking-widest text-[#8C6D37] block font-semibold">
                  Next File →
                </span>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-[#FAF6EE] group-hover:text-[#E8C66A] truncate">
                  {next.name}
                </h4>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#24170E] border border-[#C99A3C]/50 flex items-center justify-center text-[#FAF6EE] group-hover:bg-[#8C282C] transition-colors shrink-0">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </nav>

        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 w-full border-t border-[#8C6D37]/30 py-4 px-4 text-center mt-6 bg-[#0A0704]/90">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-[#8C6D48]">
          <span>LALBAZAR CONFIDENTIAL PERSONNEL ARCHIVE • SECTION 144</span>
          <span className="text-[#C99A3C]/80 italic font-serif">
            &ldquo;সত্য এখনও অপেক্ষায়&rdquo; — Truth Still Awaits
          </span>
        </div>
      </footer>

    </div>
  );
}
