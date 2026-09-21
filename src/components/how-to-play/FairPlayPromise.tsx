"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, CheckCircle2, Award, Stamp } from "lucide-react";
import { soundManager } from "@/lib/audio/soundManager";

export default function FairPlayPromise() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  useEffect(() => {
    if (isInView || isStamped) {
      if (!hasPlayedSound) {
        soundManager.playRubberStamp(true);
        setHasPlayedSound(true);
      }
      setIsStamped(true);
    }
  }, [isInView, isStamped, hasPlayedSound]);

  // Fallback timer so seal displays even in headless renders or if observer fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStamped(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative max-w-4xl mx-auto my-12 p-8 md:p-12 rounded-sm border-2 border-[#C99A3C]/80 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#FAF4E8] text-[#1F1710] overflow-hidden select-none font-serif bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]"
    >
      {/* Decorative Ornate Corner Borders */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#8C2D32]" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#8C2D32]" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#8C2D32]" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#8C2D32]" />

      {/* Archival Department Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <Shield className="w-96 h-96 text-[#8C2D32]" />
      </div>

      {/* Header Stamp */}
      <div className="text-center relative z-10 border-b-2 border-[#D4B26F]/60 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs bg-[#702428] text-[#FAF4E8] font-mono text-[10px] tracking-[0.25em] uppercase font-bold mb-3 shadow-sm">
          <Award className="w-3.5 h-3.5 text-[#E8C66A]" />
          Lalbazar Investigation Bureau &bull; Directive 1947/C
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-[#1F1710] tracking-wide mb-1.5">
          THE FAIR PLAY COVENANT
        </h2>
        <p className="font-serif italic text-sm md:text-base text-[#6E4F34]">
          A solemn guarantee from the Department of Special Inquiries to all investigators.
        </p>
      </div>

      {/* The 3 Core Tenets */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Tenet 1 */}
        <div className="bg-[#F3ECE0]/80 p-5 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-8 h-8 rounded-full bg-[#8C2D32] text-[#FAF4E8] flex items-center justify-center font-mono font-bold text-xs mb-3 shadow-xs">
              I
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F1710] mb-2 uppercase tracking-wide">
              The Mystery is Always Solvable
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#3E2F23] leading-relaxed">
              Every culprit, accomplice, and decisive motive is identifiable strictly from evidence present in the files.
              No deus ex machina, no retroactive coincidences, and no hidden clues revealed only at the end.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#D4B26F]/40 font-mono text-[10px] uppercase tracking-wider text-[#8C2D32] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C2D32]" />
            Deductive Integrity
          </div>
        </div>

        {/* Tenet 2 */}
        <div className="bg-[#F3ECE0]/80 p-5 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-8 h-8 rounded-full bg-[#8C2D32] text-[#FAF4E8] flex items-center justify-center font-mono font-bold text-xs mb-3 shadow-xs">
              II
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F1710] mb-2 uppercase tracking-wide">
              All Players Possess the Truth
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#3E2F23] leading-relaxed">
              No crucial clue is lost or withheld from your squad. If you divide and conquer across Kolkata&apos;s docks
              and alleys, 100% of the forensic pieces needed to prove guilt are held between your collective hands.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#D4B26F]/40 font-mono text-[10px] uppercase tracking-wider text-[#8C2D32] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C2D32]" />
            Complete Information
          </div>
        </div>

        {/* Tenet 3 */}
        <div className="bg-[#F3ECE0]/80 p-5 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between shadow-xs">
          <div>
            <div className="w-8 h-8 rounded-full bg-[#8C2D32] text-[#FAF4E8] flex items-center justify-center font-mono font-bold text-xs mb-3 shadow-xs">
              III
            </div>
            <h3 className="font-serif font-bold text-base text-[#1F1710] mb-2 uppercase tracking-wide">
              We Do Not Trap You
            </h3>
            <p className="font-serif text-xs md:text-sm text-[#3E2F23] leading-relaxed">
              Checkpoints are designed to mentor and recalibrate, not block your journey. If your deduction stumbles,
              the department provides constructive forensic guidance so your squad always pushes ahead toward the truth.
            </p>
          </div>
          <div className="mt-4 pt-2 border-t border-[#D4B26F]/40 font-mono text-[10px] uppercase tracking-wider text-[#8C2D32] font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C2D32]" />
            Constructive Guidance
          </div>
        </div>
      </div>

      {/* Signatures & Animated Wax Seal */}
      <div className="relative z-10 pt-6 border-t-2 border-[#D4B26F]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="font-serif italic text-base text-[#1F1710] tracking-wide font-bold">
            P. C. Lahiri, Superintendent of Police
          </div>
          <p className="font-mono text-[11px] text-[#6E4F34] uppercase tracking-wider">
            Special Branch &bull; Lalbazar Headquarters &bull; Calcutta
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-[#8C2D32] bg-[#F2E5D0] px-2 py-0.5 rounded-xs border border-[#C99A3C]/40">
            <Stamp className="w-3 h-3" />
            REGISTRY DOCKET #48-LAL-SP
          </div>
        </div>

        {/* Animated Crimson Wax Seal */}
        <motion.div
          initial={{ scale: 1.35, rotate: -15, opacity: 0.9 }}
          animate={{ scale: 1, rotate: -5, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#8C2D32] via-[#702428] to-[#4D161A] p-2 shadow-[0_10px_25px_rgba(112,36,40,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] border-2 border-[#A83838] flex flex-col items-center justify-center text-center select-none shrink-0 cursor-default"
        >
          {/* Inner embossed brass-tinted ring */}
          <div className="w-full h-full rounded-full border border-dashed border-[#E8C66A]/60 flex flex-col items-center justify-center p-1">
            <Shield className="w-6 h-6 text-[#E8C66A] drop-shadow-sm mb-0.5" />
            <span className="font-mono text-[7px] text-[#FAF4E8] tracking-widest font-black uppercase">
              LALBAZAR
            </span>
            <span className="font-mono text-[6px] text-[#E8C66A] tracking-[0.2em] uppercase font-bold">
              VERIFIED
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
