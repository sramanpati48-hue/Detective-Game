"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderOpen, 
  Users, 
  Archive, 
  BookOpen, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Shield, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  Coffee
} from "lucide-react";
import { DETECTIVES } from "@/lib/data/detectives";
import { DetectiveCard, getRoleIcon } from "@/components/room/DetectiveCard";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

export interface DetectiveSelectScreenProps {
  roomCode: string;
  initialTakenByOthers?: string[];
  totalSlots?: number;
  preferredDetective?: string;
}

export default function DetectiveSelectScreen({
  roomCode,
  initialTakenByOthers = [],
  totalSlots = 4,
  preferredDetective,
}: DetectiveSelectScreenProps) {
  const router = useRouter();

  // Selected detective state (default to soft preferredDetective if available, else first free)
  const [selectedDetectiveId, setSelectedDetectiveId] = useState<string>(() => {
    if (preferredDetective && !initialTakenByOthers.includes(preferredDetective)) {
      const match = DETECTIVES.find((d) => d.id === preferredDetective);
      if (match) return match.id;
    }
    const firstAvailable = DETECTIVES.find((d) => !initialTakenByOthers.includes(d.id));
    return firstAvailable ? firstAvailable.id : DETECTIVES[0].id;
  });

  // Taken by other players in room
  const [takenByOthers, setTakenByOthers] = useState<string[]>(initialTakenByOthers);
  
  // Player slot selector (1 to totalSlots)
  const [currentSlot, setCurrentSlot] = useState<number>(1);

  // Loading & submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [showTeaToast, setShowTeaToast] = useState<boolean>(false);

  const selectedDetective = DETECTIVES.find((d) => d.id === selectedDetectiveId) || DETECTIVES[0];
  const SelectedRoleIcon = getRoleIcon(selectedDetective.role);

  // Polling for multiplayer realtime sync
  const fetchRoomPlayers = useCallback(async () => {
    try {
      const res = await fetch(`/api/room/${roomCode}/characters`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.takenByOthers)) {
          setTakenByOthers(data.takenByOthers);
          // If current selection got taken by someone else, switch selection to an available character
          if (data.takenByOthers.includes(selectedDetectiveId)) {
            const nextFree = DETECTIVES.find((d) => !data.takenByOthers.includes(d.id));
            if (nextFree) {
              setSelectedDetectiveId(nextFree.id);
            }
          }
        }
      }
    } catch (e) {
      console.warn("Failed to sync room characters:", e);
    }
  }, [roomCode, selectedDetectiveId]);

  useEffect(() => {
    fetchRoomPlayers();
    const interval = setInterval(fetchRoomPlayers, 3500);
    return () => clearInterval(interval);
  }, [fetchRoomPlayers]);

  const showToast = (text: string, type: "success" | "error" = "error") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Confirm selection handler
  const handleConfirm = async () => {
    if (takenByOthers.includes(selectedDetective.id)) {
      showToast(`${selectedDetective.name} was just selected by another player. Please pick another.`, "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/room/${roomCode}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: roomCode,
          detectiveId: selectedDetective.id,
          slotNumber: currentSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to select character. Please try again.", "error");
        fetchRoomPlayers();
        setIsSubmitting(false);
        return;
      }

      showToast(`Selected ${selectedDetective.name}! Joining lobby...`, "success");
      setTimeout(() => {
        router.push(`/room/${roomCode}/lobby`);
      }, 700);
    } catch (e) {
      console.error("Submission error:", e);
      showToast("Network connection error. Please retry.", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen xl:h-screen w-full bg-[#0D0906] text-[#F8F2E7] relative flex flex-col justify-between font-sans select-none overflow-x-hidden">
      
      {/* 1. ATMOSPHERIC PHOTOREALISTIC BACKGROUND */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 brightness-[0.88] contrast-[1.05]"
        style={{ backgroundImage: "url('/cases/cases_desk_bg.jpg')" }}
      />

      {/* Warm Ambient Lamp Glow from Top-Right */}
      <div className="fixed top-0 right-[20%] w-[650px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(240,180,75,0.22)_0%,_rgba(180,120,40,0.08)_50%,_transparent_75%)] pointer-events-none z-0" />

      {/* Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(8,5,3,0.78)_100%)]" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-5 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2.5 font-serif text-xs border-2",
              toastMessage.type === "success"
                ? "bg-[#1E2E1D]/95 border-[#4CAF50] text-[#E8F5E9]"
                : "bg-[#281517]/95 border-[#C94A4A] text-[#FFEBEE]"
            )}
          >
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-[#81C784]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#E57373]" />
            )}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEAMING CHAI EASTER EGG (Bottom-Left) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={() => setShowTeaToast(true)}
            className="fixed bottom-6 left-[80px] z-30 cursor-pointer group hidden xl:flex flex-col items-center pointer-events-auto"
          >
            <div className="relative w-6 h-10 flex justify-center pointer-events-none">
              <div className="w-1 h-4 bg-gradient-to-t from-white/35 to-transparent rounded-full animate-pulse absolute" />
              <div className="w-1 h-5 bg-gradient-to-t from-white/25 to-transparent rounded-full animate-pulse absolute left-1" />
            </div>
            {showTeaToast && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-10 px-3 py-1 rounded-md bg-[#1B140E]/95 border border-[#C99A3C]/70 shadow-xl backdrop-blur-md text-[10px] font-serif text-[#F2E3C6] whitespace-nowrap z-50"
                onAnimationComplete={() => setTimeout(() => setShowTeaToast(false), 3000)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Coffee className="w-3 h-3 text-[#C99A3C] shrink-0" />
                  <em>সত্য এখনও অপেক্ষায়</em> — Truth is still waiting.
                </span>
              </motion.div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-[#1C140E] text-[#F2E3C6] border-[#C99A3C]/60 text-xs font-serif">
          Hot Kolkata Spiced Chai • Click to sip
        </TooltipContent>
      </Tooltip>

      <div className="flex-1 flex w-full relative z-10">
        
        {/* ================= LEFT NAVIGATION RAIL (Desktop only) ================= */}
        <aside className="hidden md:flex flex-col w-[80px] lg:w-[90px] xl:w-[96px] bg-[#120D09]/90 border-r border-[#C99A3C]/30 shrink-0 relative z-20 shadow-2xl py-4 items-center justify-between">
          
          {/* Logo */}
          <div className="flex flex-col items-center text-center px-1">
            <h2 className="font-serif font-black text-xs text-[#E8C66A] tracking-wider uppercase leading-tight">
              Bhorer
            </h2>
            <h2 className="font-serif font-black text-xs text-[#E8C66A] tracking-wider uppercase leading-tight">
              Shahar
            </h2>
            <span className="text-[7.5px] font-mono text-[#D9C7A6]/60 uppercase tracking-widest mt-0.5">
              Files
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-3.5 my-auto w-full px-2">
            {[
              { label: "Detectives", href: "#", icon: Users, active: true },
              { label: "Cases", href: "/cases", icon: FolderOpen, active: false },
              { label: "Archive", href: "/archive", icon: Archive, active: false },
              { label: "Journal", href: "/journal", icon: BookOpen, active: false },
              { label: "Settings", href: "/settings", icon: Settings, active: false },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all text-center group relative cursor-pointer",
                    item.active
                      ? "bg-gradient-to-b from-[#2B1B12] to-[#1D130D] text-[#E8C66A] border border-[#C99A3C]/70 shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      : "text-[#8C9AA8] hover:text-[#E8C66A] hover:bg-[#1A130D]/60"
                  )}
                >
                  <Icon className={cn("w-4 h-4 mb-1", item.active ? "text-[#E8C66A]" : "text-[#8C9AA8] group-hover:text-[#E8C66A]")} />
                  <span className="font-serif text-[9px] uppercase font-bold tracking-wider leading-none">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Pinned Note */}
          <div className="p-1 text-center border-t border-[#C99A3C]/20 w-full pt-3">
            <p className="font-serif italic text-[8.5px] text-[#D9C7A6]/60 leading-tight">
              A greater city needs bigger questions.
            </p>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* HEADER SECTION */}
          <header className="px-3 sm:px-4 md:px-6 lg:px-8 pt-3 md:pt-4 pb-2 flex items-center justify-between relative z-20">
            
            {/* Left Tagline (Desktop) */}
            <div className="hidden lg:block w-1/4">
              <p className="font-serif text-[10.5px] xl:text-[11px] uppercase tracking-[0.2em] text-[#D9C7A6]/75 font-semibold">
                Different minds. Same question.
              </p>
              <p className="text-[9.5px] text-[#A84743] font-mono uppercase tracking-widest mt-0.5">
                A more truthful city.
              </p>
            </div>

            {/* Mobile / Compact Back Link */}
            <div className="lg:hidden flex items-center">
              <Link 
                href="/cases"
                className="flex items-center gap-1 bg-[#1C140E]/90 text-[#D9C7A6] px-2.5 py-1.5 rounded border border-[#C99A3C]/40 text-[11px] font-serif uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hub</span>
              </Link>
            </div>

            {/* Center Bordered Title Plaque */}
            <div className="flex-1 max-w-md mx-auto text-center px-1">
              <div className="inline-block px-3 sm:px-6 xl:px-8 py-1.5 sm:py-2 rounded-lg bg-gradient-to-b from-[#24170E]/95 via-[#1A110A]/95 to-[#120B07]/95 border-2 border-[#C99A3C] shadow-[0_4px_20px_rgba(0,0,0,0.9),inset_0_1px_2px_rgba(255,255,255,0.2)]">
                <h1 className="font-serif font-black text-xs sm:text-base md:text-xl lg:text-2xl text-[#E8C66A] tracking-[0.15em] sm:tracking-[0.25em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  Select Your Detective
                </h1>
                <p className="font-serif italic text-[8.5px] sm:text-[10px] text-[#D9C7A6]/75 tracking-wider sm:tracking-widest mt-0.5">
                  People find what they seek.
                </p>
              </div>
            </div>

            {/* Right Controls: Back to Hub (Desktop) */}
            <div className="hidden lg:flex w-1/4 flex-col items-end">
              <Link 
                href="/cases"
                className="group flex items-center gap-1.5 bg-[#1C140E]/90 hover:bg-[#2C1D14] text-[#D9C7A6] hover:text-[#E8C66A] px-3.5 py-1.5 rounded-md border border-[#C99A3C]/40 text-xs font-serif uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Hub</span>
              </Link>
              <p className="font-serif italic text-[10px] text-[#E8C66A]/60 tracking-wider mt-1 pr-0.5">
                Same Streets. Different Truths.
              </p>
            </div>
          </header>

          {/* MAIN TWO-COLUMN WORKSPACE */}
          <main className="flex-1 px-2 sm:px-4 md:px-6 lg:px-8 py-2 flex flex-col xl:flex-row gap-3 xl:gap-5 max-w-[1920px] mx-auto w-full min-h-0">
            
            {/* ================= LEFT SECTION: 4x2 DETECTIVE CARDS GRID (~68%) ================= */}
            <section className="flex-1 flex flex-col min-w-0 w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 xl:gap-3 w-full">
                {DETECTIVES.map((detective) => (
                  <DetectiveCard
                    key={detective.id}
                    detective={detective}
                    isSelected={selectedDetective.id === detective.id}
                    isTaken={takenByOthers.includes(detective.id)}
                    onSelect={(det) => setSelectedDetectiveId(det.id)}
                  />
                ))}
              </div>
            </section>

            {/* ================= RIGHT SECTION: EXPANDED DETAIL PANEL (~32%) ================= */}
            <aside className="w-full min-w-0 max-w-full lg:w-[350px] xl:w-[400px] 2xl:w-[430px] shrink-0 flex flex-col">
              <motion.div
                key={selectedDetective.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full min-w-0 h-full bg-gradient-to-b from-[#FAF4E8] via-[#F2E8D7] to-[#E5D7C0] text-[#1F1710] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] border-4 border-[#2A1E14] p-2.5 sm:p-3.5 xl:p-4.5 relative flex flex-col justify-between overflow-hidden"
              >
                {/* Corner Metallic Screws / Rivets */}
                <div className="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C]" />
                <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C]" />
                <div className="absolute bottom-2 left-2 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C]" />
                <div className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C]" />

                {/* Top Section: Large Portrait & Pinned Polaroid */}
                <div className="relative mb-2.5 flex items-start justify-between gap-2.5 sm:gap-3">
                  
                  {/* Large Primary Detective Portrait */}
                  <div className="relative w-28 sm:w-36 xl:w-42 aspect-square rounded-xl overflow-hidden border-2 border-[#C99A3C]/70 shadow-lg bg-[#140E0A] shrink-0">
                    <Image
                      src={selectedDetective.detailPortrait || selectedDetective.portrait}
                      alt={selectedDetective.name}
                      fill
                      unoptimized
                      priority
                      className="object-cover object-top"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(18,14,10,0.45)_100%)]" />
                  </div>

                  {/* Pinned Snapshot & Slogan on Right */}
                  <div className="flex-1 flex flex-col items-end text-right min-w-0">
                    
                    {/* Small Pinned River Ghat Polaroid */}
                    <div className="relative w-20 sm:w-24 h-20 sm:h-24 p-1 bg-[#FAF6EE] shadow-md border border-[#D0C4AF] rounded transform rotate-3 mb-1.5 sm:mb-2 shrink-0">
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#A84743] border border-[#521316] z-10" />
                      <div className="w-full h-12 sm:h-15 relative overflow-hidden bg-[#121820] rounded-xs">
                        <Image
                          src="/cases/case_001.png"
                          alt="Ghat Snapshot"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <p className="font-serif italic text-[7px] sm:text-[7.5px] text-[#3D2C1E] text-center mt-0.5 sm:mt-1 leading-none">
                        Ghats & Secrets
                      </p>
                    </div>

                    {/* Secondary Quote / Memo */}
                    <p className="font-serif italic text-[10px] sm:text-[11px] text-[#702428] font-bold leading-tight">
                      &ldquo;{selectedDetective.secondaryQuote || selectedDetective.quote}&rdquo;
                    </p>
                    <p className="font-mono text-[7.5px] sm:text-[8px] uppercase tracking-widest text-[#8C6D48] mt-1 truncate">
                      GHATS &bull; MARKETS &bull; SECRETS
                    </p>
                  </div>
                </div>

                {/* Detective Identity Header */}
                <div className="pb-2 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <h2 className="font-serif text-xl sm:text-2xl xl:text-3xl font-black text-[#1F1710] tracking-wide leading-none">
                      {selectedDetective.name}
                    </h2>
                    <Badge variant="brass" className="gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-[#241A13] text-[#E8C66A] border border-[#C99A3C] shadow-sm font-mono text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider">
                      <SelectedRoleIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>
                        {selectedDetective.role}
                      </span>
                    </Badge>
                  </div>

                  {/* Core Focus Subtitle */}
                  <p className="font-mono text-[9px] sm:text-[10px] xl:text-[10.5px] text-[#702428] font-semibold tracking-wider uppercase mt-1">
                    {selectedDetective.coreFocus}
                  </p>
                </div>
                <Separator className="bg-[#8C6D48]/30 mb-2" />

                {/* Biography */}
                <p className="font-serif text-[11px] sm:text-xs xl:text-[12.5px] text-[#3A2D22] leading-relaxed mb-2.5">
                  {selectedDetective.bio}
                </p>

                {/* Two Column Specialties & Strengths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-2 border-t border-[#8C6D48]/25 mb-2.5">
                  
                  {/* Left Column: Specialties */}
                  <div>
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1710] mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-[#702428]" />
                      <span>Specialties</span>
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[9px] xl:text-[9.5px] text-[#4A3728]">
                      {selectedDetective.specialties.map((spec, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#702428] shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column: Strengths Bars */}
                  <div>
                    <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1F1710] mb-2 flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5 text-[#C99A3C]" />
                      <span>Strengths</span>
                    </h4>
                    <div className="space-y-1.5">
                      {selectedDetective.strengths.map((str, i) => (
                        <div key={i} className="flex flex-col gap-0.5">
                          <div className="flex justify-between text-[8.5px] font-mono text-[#4A3728] uppercase font-semibold">
                            <span>{str.label}</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#D4C3AC] rounded-full overflow-hidden border border-[#B3A086]">
                            <div 
                              className="h-full bg-gradient-to-r from-[#BFA265] via-[#C99A3C] to-[#8C6C38]"
                              style={{ width: `${str.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Canonical Quote Footer */}
                <div className="pt-2 border-t border-[#8C6D48]/30 text-center">
                  <p className="font-serif italic text-xs xl:text-sm text-[#702428] font-bold">
                    &ldquo;{selectedDetective.quote}&rdquo;
                  </p>
                </div>

              </motion.div>
            </aside>

          </main>

          {/* ================= FOOTER CONTROLS BAR ================= */}
          <footer className="sticky bottom-0 z-30 px-3 sm:px-4 md:px-6 lg:px-8 py-2 xl:py-2.5 bg-[#110B07]/95 border-t border-[#C99A3C]/40 backdrop-blur-md shrink-0">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Left: Player Slot Selector */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="hidden sm:inline font-mono text-[10px] xl:text-[11px] uppercase tracking-widest text-[#D9C7A6]/80 font-semibold">
                  Players in this investigation:
                </span>
                <span className="sm:hidden font-mono text-[10px] uppercase tracking-wider text-[#D9C7A6]/80 font-semibold">
                  Player Slot:
                </span>
                <div className="flex items-center gap-1 bg-[#1E140D] p-1 rounded-md border border-[#C99A3C]/40">
                  {Array.from({ length: totalSlots }).map((_, idx) => {
                    const slot = idx + 1;
                    const isActive = currentSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setCurrentSlot(slot)}
                        className={cn(
                          "flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded text-xs font-mono font-bold transition-all cursor-pointer",
                          isActive
                            ? "bg-gradient-to-r from-[#8C6D37] to-[#C99A3C] text-[#191007] shadow-sm border border-[#E6C687]"
                            : "text-[#D9C7A6]/60 hover:text-[#E8C66A] hover:bg-[#2C1D13]"
                        )}
                        title={`Player Slot ${slot}`}
                      >
                        <User className="w-3 h-3" />
                        <span>{slot}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Confirm Selection Primary Button */}
              <Button
                type="button"
                variant="burgundy"
                size="lg"
                onClick={handleConfirm}
                disabled={isSubmitting || takenByOthers.includes(selectedDetective.id)}
                className="group gap-2 px-6 py-2.5 font-serif text-xs xl:text-sm tracking-wider sm:tracking-[0.2em] shadow-xl w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <span>REGISTERING ASSIGNMENT...</span>
                ) : (
                  <>
                    <span>Confirm Selection</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#E8C66A]" />
                  </>
                )}
              </Button>

            </div>

            {/* Sub-note on desk */}
            <div className="text-center mt-1">
              <p className="font-serif italic text-[9.5px] text-[#D9C7A6]/50">
                Same city. Different people. Same questions.
              </p>
            </div>
          </footer>

        </div>

      </div>

    </div>
  );
}
