"use client";

import React, { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, BookOpen, Fingerprint, Scale } from "lucide-react";
import { Detective, DetectiveRole } from "@/lib/data/detectives";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function getRoleTheme(role: DetectiveRole) {
  switch (role) {
    case "Lead Detective":
      return {
        icon: Search,
        badgeBg: "bg-[#701E24]",
        badgeBorder: "border-[#C99A3C]/80",
        badgeText: "text-[#FAF4E8]",
      };
    case "Chronicler":
      return {
        icon: BookOpen,
        badgeBg: "bg-[#183654]",
        badgeBorder: "border-[#C99A3C]/80",
        badgeText: "text-[#FAF4E8]",
      };
    case "Evidence Analyst":
      return {
        icon: Fingerprint,
        badgeBg: "bg-[#11382F]",
        badgeBorder: "border-[#C99A3C]/80",
        badgeText: "text-[#FAF4E8]",
      };
    case "Interrogator":
      return {
        icon: Scale,
        badgeBg: "bg-[#4A1D36]",
        badgeBorder: "border-[#C99A3C]/80",
        badgeText: "text-[#FAF4E8]",
      };
  }
}

interface DetectiveRosterCardProps {
  detective: Detective;
  priority?: boolean;
}

export const DetectiveRosterCard = memo(function DetectiveRosterCard({
  detective,
  priority = false,
}: DetectiveRosterCardProps) {
  const theme = getRoleTheme(detective.role);
  const RoleIcon = theme.icon;
  const portraitSrc = detective.rosterPortrait || detective.heroPortrait || detective.portrait;
  const tagText = detective.docketTag ? `LALBAZAR • ${detective.docketTag}` : `LALBAZAR • #${detective.id.toUpperCase().slice(0, 6)}`;
  const quoteText = detective.cardQuote || detective.quote;

  return (
    <Link
      href={`/detectives/${detective.id}`}
      aria-label={`View dossier for ${detective.name}, ${detective.role}`}
      className="group relative block w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#E8C66A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#101720]"
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className={cn(
          "relative w-full rounded-xl overflow-hidden select-none flex flex-col justify-between",
          "border border-[#C99A3C]/60 group-hover:border-[#E8C66A]",
          "bg-[#100A06] shadow-[0_12px_32px_rgba(0,0,0,0.85)] group-hover:shadow-[0_18px_40px_rgba(201,154,60,0.2),0_12px_32px_rgba(0,0,0,0.95)]",
          "transition-all duration-300"
        )}
      >
        {/* ================= VINTAGE BRASS PAPERCLIP ================= */}
        <div className="absolute -top-3 left-3 z-30 pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
          <svg width="18" height="36" viewBox="0 0 18 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 8V27C5 29.7614 7.23858 32 10 32C12.7614 32 15 29.7614 15 27V5.5C15 3.567 13.433 2 11.5 2C9.567 2 8 3.567 8 5.5V26C8 27.1046 8.89543 28 10 28C11.1046 28 12 27.1046 12 26V9"
              stroke="url(#brass-clip-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="brass-clip-grad" x1="5" y1="2" x2="15" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5D77F" />
                <stop offset="0.35" stopColor="#C99A3C" />
                <stop offset="0.75" stopColor="#8C6C28" />
                <stop offset="1" stopColor="#EAD29A" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Top-Right Corner Brass Stud Accent */}
        <div className="absolute top-2 right-2 z-20 w-1.5 h-1.5 rounded-full bg-[#C99A3C]/80 border border-[#523C1A] shadow-xs pointer-events-none" />

        {/* ================= TOP CARD HEADER (TAG & ROLE BADGE) ================= */}
        <div className="relative z-20 p-2.5 pt-2 flex items-center justify-between gap-2">
          {/* Left Docket Tag */}
          <div className="ml-4 px-2 py-0.5 rounded-xs bg-[#140E0A]/90 border border-[#C99A3C]/50 shadow-sm backdrop-blur-xs shrink-0 whitespace-nowrap">
            <span className="font-mono font-bold text-[8.5px] uppercase tracking-wider text-[#E8C66A]">
              {tagText}
            </span>
          </div>

          {/* Right Role Badge */}
          <Badge
            variant="outline"
            className={cn(
              "px-2 py-0.5 rounded-xs border shadow-sm flex items-center gap-1 shrink-0 whitespace-nowrap",
              theme.badgeBg,
              theme.badgeBorder,
              theme.badgeText
            )}
          >
            <RoleIcon className="w-2.5 h-2.5 text-[#E8C66A]" />
            <span className="font-mono text-[8.5px] font-bold tracking-wider uppercase">
              {detective.role}
            </span>
          </Badge>
        </div>

        {/* ================= CHARACTER ARTWORK DISPLAY ================= */}
        <div className="relative w-full aspect-[3/3.8] overflow-hidden bg-[#18110B]">
          <Image
            src={portraitSrc}
            alt={detective.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover object-top filter brightness-[0.96] contrast-[1.04] group-hover:scale-104 transition-transform duration-500 ease-out"
          />

          {/* Smooth bottom dark fade for quote readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0E0905]/95 via-[#0E0905]/50 to-transparent pointer-events-none" />

          {/* Floating Cursive Handwritten Quote over Portrait */}
          <div className="absolute bottom-2 left-3 right-3 z-15 pointer-events-none">
            <p className="font-serif italic text-xs sm:text-[13px] text-[#F5E6CC] font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-snug">
              &ldquo;{quoteText}&rdquo;
            </p>
          </div>
        </div>

        {/* ================= LIGHT PARCHMENT DOSSIER PLAQUE ================= */}
        <div className="relative z-20 w-full bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E3D4BC] border-t border-[#8C6D48]/40 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-b-xl select-none">
          {/* Brass screw rivets in bottom corners */}
          <div className="absolute bottom-2.5 left-2 w-1.5 h-1.5 rounded-full bg-[#3D2C1E] border border-[#7D5F3A] shadow-inner pointer-events-none" />
          <div className="absolute bottom-2.5 right-2 w-1.5 h-1.5 rounded-full bg-[#3D2C1E] border border-[#7D5F3A] shadow-inner pointer-events-none" />

          {/* Character Name */}
          <h3 className="font-serif font-black text-base sm:text-lg lg:text-xl text-[#1A120B] tracking-wide leading-tight group-hover:text-[#8C282C] transition-colors truncate">
            {detective.name}
          </h3>

          {/* Age & Former Occupation */}
          <div className="mt-0.5 flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-mono text-[#4A3728] tracking-tight">
            <span className="font-bold text-[#1A120B] shrink-0">Age {detective.age}</span>
            <span className="text-[#8C6D48] font-bold shrink-0">|</span>
            <span className="truncate">{detective.formerOccupation}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
});

DetectiveRosterCard.displayName = "DetectiveRosterCard";

export default DetectiveRosterCard;
