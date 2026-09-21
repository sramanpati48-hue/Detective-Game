"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCheck, Target, ArrowRight } from "lucide-react";
import { Detective } from "@/lib/data/detectives";
import { getRoleTheme } from "./DetectiveRosterCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DetectiveProfileHeroProps {
  detective: Detective;
}

export default function DetectiveProfileHero({ detective }: DetectiveProfileHeroProps) {
  const theme = getRoleTheme(detective.role);
  const RoleIcon = theme.icon;
  const portraitSrc = detective.rosterPortrait || detective.heroPortrait || detective.portrait;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#8C6D37]/60 bg-[#120B07]">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* ================= LEFT: POLAROID DOSSIER PHOTO & MANILA BACKING ================= */}
        <div className="lg:col-span-5 p-4 sm:p-6 lg:p-7 flex items-center justify-center relative bg-[#18100A]/95 border-b lg:border-b-0 lg:border-r border-[#8C6D37]/40">
          
          {/* Manila File Folder Backing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative w-full max-w-[340px] sm:max-w-[380px] bg-gradient-to-br from-[#FAF5EC] via-[#EFE6D2] to-[#E3D6BC] p-3 sm:p-4 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.7)] border border-[#C2AE8B] flex flex-col justify-between"
          >
            {/* Metallic Brass Paperclip holding Polaroid on top-left */}
            <div className="absolute -top-3 left-6 z-30 pointer-events-none drop-shadow-md">
              <svg className="w-6 h-14" viewBox="0 0 20 40" fill="none">
                <path
                  d="M6 10V33C6 36.3 8.7 39 12 39C15.3 39 18 36.3 18 33V7C18 4.2 15.8 2 13 2C10.2 2 8 4.2 8 7V32C8 33.7 9.3 35 11 35C12.7 35 14 33.7 14 32V11"
                  stroke="url(#hero-clip-grad)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient id="hero-clip-grad" x1="6" y1="2" x2="18" y2="39" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F7E2A3" />
                    <stop offset="0.3" stopColor="#D4AF37" />
                    <stop offset="0.7" stopColor="#8C6D38" />
                    <stop offset="1" stopColor="#EAD29A" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Vertical Left Margin Stamped Label */}
            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] rotate-180 font-mono text-[7.5px] uppercase tracking-[0.28em] text-[#8C6D48] select-none font-bold opacity-80 pointer-events-none">
              PERSONNEL ARCHIVE • LALBAZAR CID
            </div>

            {/* The Polaroid Photo Container */}
            <div className="relative ml-3 bg-[#FAF7F0] p-2 sm:p-2.5 rounded-lg shadow-md border border-[#D9CAB3]">
              
              {/* Image Frame */}
              <div className="relative w-full aspect-[3/3.8] rounded-xs overflow-hidden bg-[#18110B] border border-[#7A6348]/40 shadow-inner">
                <Image
                  src={portraitSrc}
                  alt={detective.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover object-top filter contrast-[1.04] brightness-[0.97]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140E0A]/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Polaroid Bottom Chin with Cursive Quote and Circular Red Stamp */}
              <div className="relative pt-3 pb-2 px-1 flex items-center justify-between min-h-[58px]">
                {/* Handwritten Cursive Ink Quote */}
                <p className="font-serif italic text-xs sm:text-[13px] text-[#241A12] font-semibold leading-tight max-w-[180px] drop-shadow-2xs">
                  &ldquo;{detective.quote}&rdquo;
                </p>

                {/* Circular Red Rubber Stamp: CONFIDENTIAL LCIB */}
                <div className="absolute -bottom-2 -right-2 transform rotate-[-12deg] pointer-events-none select-none z-20">
                  <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full border-2 border-dashed border-[#A83238]/90 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full rounded-full border-2 border-[#A83238] flex flex-col items-center justify-center text-[#A83238] font-mono font-black uppercase text-center bg-[#FAF4E8]/10">
                      <span className="text-[6.5px] sm:text-[7px] tracking-[0.2em] border-b border-[#A83238]/60 pb-0.5">CONFIDENTIAL</span>
                      <span className="text-[11px] sm:text-[12px] tracking-widest my-0.5 font-extrabold">LCIB</span>
                      <span className="text-[6px] tracking-wider text-[#A83238]/85">20-03-1970</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom File Number Badge on Manila Backing */}
            <div className="mt-3 ml-3 flex items-center justify-between font-mono text-[9px] text-[#6E5434]">
              <span className="px-2 py-0.5 bg-[#EAE0CD] border border-[#C9B799] rounded-xs font-bold tracking-wider uppercase">
                FILE NO. {detective.fileNo}
              </span>
              <span className="text-[#8C6D48] tracking-widest uppercase">
                LCIB ARCHIVE
              </span>
            </div>

          </motion.div>
        </div>

        {/* ================= RIGHT: MANILA PERSONNEL FILE SHEET ================= */}
        <div className="lg:col-span-7 p-5 sm:p-7 lg:p-8 flex flex-col justify-between relative bg-gradient-to-br from-[#FAF5EC] via-[#F4ECE0] to-[#EADFCB] text-[#1E1712]">
          
          <div>
            {/* Top Dossier Header Line */}
            <div className="flex items-center justify-between border-b border-[#D5C6AC] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#8C282C] shadow-xs" />
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#8C282C] tracking-[0.2em] uppercase">
                  CONFIDENTIAL PERSONNEL FILE
                </span>
              </div>
              <span className="font-mono text-[9.5px] sm:text-[10.5px] text-[#7A6348] font-bold tracking-widest uppercase">
                DOSSIER ID: {detective.dossierId}
              </span>
            </div>

            {/* Character Name */}
            <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-[44px] text-[#18110B] tracking-tight leading-none mt-1">
              {detective.name}
            </h1>

            {/* Badges Row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="bg-[#6B1E22] text-[#FAF4E8] border-[#8C282C] px-3 py-1 rounded-full font-serif text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-xs"
              >
                <RoleIcon className="w-3 h-3 text-[#E8C66A]" />
                <span>{detective.role}</span>
              </Badge>

              <Badge
                variant="outline"
                className="bg-[#EDE2CD] text-[#423120] border-[#C9B799] px-3 py-1 rounded-full font-mono text-[10.5px] font-bold tracking-tight shadow-2xs"
              >
                Age {detective.age}
              </Badge>

              <Badge
                variant="outline"
                className="bg-[#EDE2CD] text-[#423120] border-[#C9B799] px-3 py-1 rounded-full font-mono text-[10.5px] font-bold tracking-tight shadow-2xs"
              >
                {detective.formerOccupation}
              </Badge>
            </div>

            {/* Official Investigator Creed Quote Box */}
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#F2E8D7]/85 border border-[#D5C6AC] shadow-xs relative">
              <span className="text-[#8C282C] font-serif text-2xl leading-none select-none block -mb-1">&ldquo;</span>
              <p className="font-serif italic font-medium text-sm sm:text-base text-[#241A12] leading-snug pl-2">
                {detective.quote}
              </p>
              <div className="text-right mt-1">
                <span className="font-mono text-[8.5px] sm:text-[9px] text-[#7A6348] tracking-widest uppercase font-bold">
                  — OFFICIAL INVESTIGATOR CREED
                </span>
              </div>
            </div>

            {/* Bio Summary Paragraph */}
            <p className="mt-3.5 text-xs sm:text-[13.5px] text-[#3A2C20] font-serif leading-relaxed">
              {detective.bio}
            </p>

            {/* Two-Column Lower Metadata Section */}
            <div className="mt-4 pt-3.5 border-t border-[#D5C6AC] grid grid-cols-1 sm:grid-cols-12 gap-4">
              
              {/* Left Column: Core Tactical Focus */}
              <div className="sm:col-span-6 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[#8C282C] font-mono text-[10px] font-bold uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-[#8C282C] shrink-0" />
                  <span>CORE TACTICAL FOCUS</span>
                </div>
                <p className="font-serif text-xs sm:text-[13px] text-[#241A12] font-semibold leading-snug">
                  {detective.coreFocus}
                </p>
                <div className="pt-2">
                  <span className="font-mono text-[9px] text-[#7A6348] px-2 py-0.5 bg-[#EAE0CD] border border-[#C9B799] rounded-xs font-bold tracking-widest uppercase inline-block">
                    FILE NO. {detective.fileNo}
                  </span>
                </div>
              </div>

              {/* Right Column: Credentials Table */}
              <div className="sm:col-span-6 border-t sm:border-t-0 sm:border-l border-[#D5C6AC] pt-3 sm:pt-0 sm:pl-4">
                <div className="space-y-1.5 font-mono text-[10px] sm:text-[10.5px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#7A6348] uppercase tracking-wider">DEPARTMENT</span>
                    <span className="font-bold text-[#1E1712]">{detective.department}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#7A6348] uppercase tracking-wider">STATUS</span>
                    <span className="font-bold text-[#1E1712] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                      {detective.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#7A6348] uppercase tracking-wider">CLEARANCE LEVEL</span>
                    <span className="font-bold text-[#1E1712]">{detective.clearanceLevel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#7A6348] uppercase tracking-wider">BASE CITY</span>
                    <span className="font-bold text-[#1E1712]">{detective.baseCity}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Action Button: Enter Room */}
          <div className="mt-5 pt-3 border-t border-[#D5C6AC] flex items-center justify-end">
            <Button
              asChild
              className="bg-[#6B1E22] hover:bg-[#85252A] text-[#FAF4E8] border border-[#A83238] shadow-[0_4px_14px_rgba(107,30,34,0.35)] px-5 py-2.5 rounded-lg font-serif font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
            >
              <Link href={`/room/create?preferredDetective=${detective.id}`}>
                <UserCheck className="w-4 h-4 text-[#E8C66A] mr-1.5" />
                <span>ENTER ROOM WITH {detective.name.split(" ")[0].toUpperCase()}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>

        </div>

      </div>

    </div>
  );
}
