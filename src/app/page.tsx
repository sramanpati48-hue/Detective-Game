"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight, X, Film, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import TotalLiveBackground from "@/components/effects/TotalLiveBackground";
import { soundManager } from "@/lib/audio/soundManager";

const TRANSLATIONS = [
  {
    lang: "Bengali",
    code: "বাংলা",
    script: "সত্য এখনও অপেক্ষায়",
    sub: "Satya ekhono opekkhay • Truth still waits",
  },
  {
    lang: "Hindi",
    code: "हिन्दी",
    script: "सच अभी भी प्रतीक्षारत है",
    sub: "Sach abhi bhi prateeksharat hai • Truth still waits",
  },
  {
    lang: "Tamil",
    code: "தமிழ்",
    script: "உண்மை இன்னும் காத்திருக்கிறது",
    sub: "Unmai innum kaathirukkiradhu • Truth still waits",
  },
  {
    lang: "Telugu",
    code: "తెలుగు",
    script: "నిజం ఇంకా వేచి ఉంది",
    sub: "Nijam inka vechi undi • Truth still waits",
  },
  {
    lang: "Marathi",
    code: "मराठी",
    script: "सत्य अजूनही वाट पाहत आहे",
    sub: "Satya ajunhi vaat pahat aahe • Truth still waits",
  },
  {
    lang: "English",
    code: "ENG",
    script: "TRUTH STILL WAITS",
    sub: "Every clue leaves a trace in the city of dawn",
  },
];

export default function Home() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TRANSLATIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const current = TRANSLATIONS[activeIdx];

  return (
    <div className="fixed inset-0 z-50 bg-[#0f1115] text-[#F8F2E7] font-sans overflow-hidden select-none">
      
      {/* TOTAL LIVE CINEMATIC BACKGROUND */}
      <TotalLiveBackground />



      {/* MAIN CONTENT (Left Aligned as in Image 1) */}
      <main className="absolute inset-y-0 left-0 z-30 flex flex-col justify-center px-16 md:px-24 max-w-4xl">
        
        <div className="pl-16 md:pl-20">
          <h1 className="font-serif text-6xl md:text-[6rem] leading-[0.85] text-[#EAE1D1] drop-shadow-[0_5px_15px_rgba(0,0,0,0.9)]">
            BHORER<br/>SHAHAR
          </h1>
          
          <div className="flex items-center gap-4 mt-8 mb-10 w-72 drop-shadow-md">
            <div className="h-px bg-[#E8C66A]/70 flex-1"></div>
            <span className="font-mono text-[#E8C66A] text-sm tracking-[0.4em] uppercase font-bold">Case Files</span>
            <div className="h-px bg-[#E8C66A]/70 flex-1"></div>
          </div>

          {/* QUOTE + ANIMATED TRANSLATIONS BOX */}
          <div className="border-l-2 border-[#A84743] pl-5 mb-10 max-w-lg">
            <p className="font-mono text-[#EAE1D1] text-sm md:text-base leading-relaxed tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-medium">
              Some cities never sleep.<br/>
              They just hide their secrets<br/>
              better.
            </p>
            
            {/* Animated translation cycler */}
            <div className="mt-5 pt-4 border-t border-[#A84743]/30 min-h-[64px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{ duration: 0.55, ease: "easeInOut" }}
                  className="flex flex-col gap-1"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-[#E8C66A] text-xl md:text-2xl tracking-widest drop-shadow-[0_2px_10px_rgba(232,198,106,0.35)]">
                      {current.script}
                    </span>
                    <span className="text-[9px] font-mono tracking-widest px-2 py-0.5 rounded-sm border border-[#C99A3C]/40 text-[#E8C66A]/90 bg-black/50 backdrop-blur-xs">
                      {current.lang}
                    </span>
                  </div>
                  <p className="font-sans text-[#D9C7A6]/75 text-[11px] tracking-[0.18em] uppercase">
                    {current.sub}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Language Navigation / Progress Dots */}
              <div className="flex items-center gap-2 mt-3.5">
                {TRANSLATIONS.map((t, idx) => (
                  <button
                    key={t.code}
                    onClick={() => setActiveIdx(idx)}
                    className={cn(
                      "h-1 rounded-full transition-all duration-500 cursor-pointer",
                      idx === activeIdx 
                        ? "w-8 bg-[#E8C66A] shadow-[0_0_10px_rgba(232,198,106,0.8)]" 
                        : "w-2 bg-[#D9C7A6]/30 hover:bg-[#D9C7A6]/60"
                    )}
                    aria-label={`Switch to ${t.lang}`}
                    title={t.lang}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <Link href="/cases">
              <button className="group flex items-center gap-3 bg-[#752a32]/90 hover:bg-[#8e292b] text-[#EAE1D1] font-serif text-sm tracking-[0.2em] uppercase px-8 py-4 border border-[#A84743] shadow-[0_0_20px_rgba(168,71,67,0.6)] backdrop-blur-sm transition-all cursor-pointer">
                Enter The Archive
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            
            <button 
              onClick={() => {
                soundManager.playTensionSting();
                setShowTrailer(true);
              }}
              className="group flex items-center gap-3 text-[#EAE1D1] hover:text-[#E8C66A] font-serif text-sm tracking-[0.2em] uppercase transition-colors drop-shadow-md cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full border-2 border-[#D9C7A6]/50 group-hover:border-[#E8C66A] flex items-center justify-center bg-black/40 backdrop-blur-md transition-colors">
                <Play className="w-4 h-4 ml-1 fill-current" />
              </div>
              Watch Trailer
            </button>
          </div>
        </div>

      </main>

      {/* ATMOSPHERIC NOIR TRAILER / CINEMATIC TEASER MODAL */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-serif"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-3xl bg-[#140E0A] text-[#FAF4E8] rounded-sm border-2 border-[#C99A3C] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col"
            >
              {/* Header Ribbon */}
              <div className="bg-[#241A13] px-6 py-3 border-b border-[#C99A3C]/40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-[#E8C66A]">
                  <Film className="w-4 h-4 text-[#E8C66A]" />
                  <span className="uppercase tracking-widest font-bold">
                    OFFICIAL TEASER &bull; BHORER SHAHAR: CASE FILES
                  </span>
                </div>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="p-1 rounded text-[#D9C7A6] hover:text-[#FAF4E8] transition-colors cursor-pointer"
                  aria-label="Close Teaser"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cinematic Visual Frame */}
              <div className="relative w-full aspect-[16/9] bg-[#0A0705] overflow-hidden border-b border-[#C99A3C]/30">
                <Image
                  src="/cases/the-last-ferry/scene_deck_night.jpg"
                  alt="The Last Ferry Night Deck"
                  fill
                  className="object-cover contrast-[1.15] brightness-[0.85]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-transparent to-black/40" />

                {/* Ambient audio badge */}
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1 rounded-xs bg-[#1A120D]/90 border border-[#C99A3C]/40 text-xs font-mono text-[#E8C66A]">
                  <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                  <span className="tracking-wider uppercase text-[10px]">
                    Kolkata Monsoon Soundscape &bull; Bhairavi Channel
                  </span>
                </div>
              </div>

              {/* Monologue & Pitch Text */}
              <div className="p-6 md:p-8 space-y-4">
                <div className="space-y-2">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#8C2D32] font-bold">
                    Case 001: The Last Ferry &bull; Bengal CID 1974
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#FAF4E8]">
                    A Midnight Crossing. A Staged Accidental Drowning.
                  </h3>
                </div>

                <p className="font-serif text-sm md:text-base text-[#D9C7A6]/90 leading-relaxed italic border-l-2 border-[#C99A3C] pl-4">
                  &ldquo;October 1974. Heavy storm over Nabadwip Ghat. The 10:15 ferry MV Sonartori casts off into the squall. When the vessel docks, chartered accountant Abir Basu has vanished. His dry umbrella stands upright under Seat 14. An 11-minute CCTV blackout shields the lower hatch. Step into the shoes of Lalbazar detectives to crack the syndicate.&rdquo;
                </p>

                {/* Footer Buttons */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#3D2C20]">
                  <span className="font-mono text-xs text-[#E8C66A]/70">
                    Solo &bull; Duo &bull; 4-Player Co-op
                  </span>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => setShowTrailer(false)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-[#241A13] hover:bg-[#332216] text-[#D9C7A6] rounded-xs font-serif text-xs uppercase tracking-wider transition-colors cursor-pointer border border-[#4A382A]"
                    >
                      Dismiss
                    </button>

                    <Link href="/cases/the-last-ferry" className="flex-1 sm:flex-none">
                      <button className="w-full px-6 py-2.5 bg-[#752a32] hover:bg-[#8e292b] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold shadow-lg flex items-center justify-center gap-2 border border-[#A84743] cursor-pointer transition-all">
                        <span>Launch Investigation</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embedded CSS for Live Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes subtle-drift {
          0% { transform: scale(1); }
          50% { transform: scale(1.015) translate(-0.3%, -0.3%); }
          100% { transform: scale(1); }
        }
        .animate-subtle-drift {
          animation: subtle-drift 24s ease-in-out infinite;
          will-change: transform;
        }
      `}} />
    </div>
  );
}
