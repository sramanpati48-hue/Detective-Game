"use client";
import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, BookOpen, Fingerprint, Scale } from "lucide-react";
import { Detective, DetectiveRole } from "@/lib/data/detectives";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface DetectiveCardProps {
  detective: Detective;
  isSelected: boolean;
  isTaken: boolean;
  onSelect: (detective: Detective) => void;
}

export function getRoleIcon(role: DetectiveRole) {
  switch (role) {
    case "Lead Detective":
      return Search;
    case "Chronicler":
      return BookOpen;
    case "Evidence Analyst":
      return Fingerprint;
    case "Interrogator":
      return Scale;
  }
}

export const DetectiveCard = memo(function DetectiveCard({
  detective,
  isSelected,
  isTaken,
  onSelect,
}: DetectiveCardProps) {
  const RoleIcon = getRoleIcon(detective.role);

  return (
    <motion.button
      type="button"
      whileHover={!isTaken ? { y: -3, scale: 1.015 } : undefined}
      whileTap={!isTaken ? { scale: 0.985 } : undefined}
      onClick={() => {
        if (!isTaken) {
          onSelect(detective);
        }
      }}
      disabled={isTaken}
      aria-disabled={isTaken}
      aria-label={`${detective.name}, ${detective.role}. ${
        isTaken ? "Taken by another player" : isSelected ? "Currently selected" : "Available to select"
      }`}
      className={cn(
        "group relative w-full min-w-0 text-left rounded-xl p-1.5 sm:p-2 xl:p-2.5 transition-all duration-200 outline-none flex flex-col justify-between overflow-hidden shadow-lg",
        // Warm parchment/cream background
        "bg-gradient-to-b from-[#FAF5EA] via-[#F3ECE0] to-[#E9DFCF]",
        "border-[3px] border-[#2A1E14]",
        // Selected highlight
        isSelected && [
          "ring-3 ring-[#E8C66A] shadow-[0_0_25px_rgba(232,198,106,0.6),0_8px_20px_rgba(0,0,0,0.8)]",
          "border-[#8A682E] bg-gradient-to-b from-[#FFFDF8] via-[#FAF4E8] to-[#EFE4D2]"
        ],
        // Taken state
        isTaken && "opacity-55 grayscale cursor-not-allowed border-[#3D3430] bg-[#D6CDC2]"
      )}
    >
      {/* Corner metallic rivets */}
      <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#8C6D37] border border-[#24170C] pointer-events-none" />
      <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8C6D37] border border-[#24170C] pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-full bg-[#8C6D37] border border-[#24170C] pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-[#8C6D37] border border-[#24170C] pointer-events-none" />

      {/* Top Portrait Container */}
      <div className="relative w-full aspect-[3/3.3] rounded-lg overflow-hidden border border-[#3A2A1C]/40 bg-[#121820] shadow-inner mb-1.5">
        <Image
          src={detective.portrait}
          alt={detective.name}
          fill
          unoptimized
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className={cn(
            "object-cover object-top transition-transform duration-300",
            !isTaken && "group-hover:scale-105"
          )}
        />

        {/* Vintage vignette overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_55%,_rgba(18,14,10,0.5)_100%)]" />

        {/* Role Icon Badge (Top-Left of Portrait) */}
        <div className="absolute top-1.5 left-1.5 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="w-6 h-6 rounded-full bg-[#241A12]/90 border border-[#C99A3C] shadow-md flex items-center justify-center text-[#E8C66A] cursor-help"
              >
                <RoleIcon className="w-3.5 h-3.5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#1C140E] text-[#F2E3C6] border-[#C99A3C]/40 text-[10px]">
              Role: {detective.role}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Taken Badge Overlay */}
        {isTaken && (
          <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
            <Badge variant="burgundy" className="transform -rotate-6 shadow-lg px-3 py-1">
              Taken
            </Badge>
          </div>
        )}
      </div>

      {/* Detective Name & Role */}
      <div className="px-0.5 mb-1.5 min-h-[34px] flex flex-col justify-center min-w-0">
        <h3 className="font-serif text-[11.5px] sm:text-[13px] xl:text-[14.5px] font-bold text-[#1F1710] leading-tight tracking-normal line-clamp-1">
          {detective.name}
        </h3>
        <p className="font-mono text-[7.5px] sm:text-[8.5px] xl:text-[9px] uppercase font-bold text-[#7D5F3A] tracking-wider mt-0.5 truncate">
          {detective.role}
        </p>
      </div>

      {/* Button Plaque at Bottom of Card */}
      <div className="w-full min-w-0">
        {isSelected ? (
          <div className="w-full py-1 px-1 rounded-md bg-gradient-to-r from-[#A8823B] via-[#C99A3C] to-[#A8823B] text-[#1A1108] font-serif text-[9px] sm:text-[10px] xl:text-[10.5px] font-bold uppercase tracking-wider text-center shadow-[0_2px_8px_rgba(201,154,60,0.5)] border border-[#E6C687] truncate">
            SELECTED
          </div>
        ) : isTaken ? (
          <div className="w-full py-1 px-1 rounded-md bg-[#2C2320] text-[#8C7A75] font-mono text-[8.5px] sm:text-[9.5px] uppercase font-semibold tracking-wider text-center border border-[#423632] truncate">
            TAKEN
          </div>
        ) : (
          <div className="w-full py-1 px-1 rounded-md bg-gradient-to-b from-[#281C14] to-[#1A120B] group-hover:from-[#38271C] group-hover:to-[#241A12] text-[#D9C7A6] group-hover:text-[#E8C66A] font-serif text-[9px] sm:text-[10px] xl:text-[10.5px] uppercase tracking-wider text-center border border-[#C99A3C]/40 transition-colors shadow-xs truncate">
            SELECT
          </div>
        )}
      </div>
    </motion.button>
  );
});

DetectiveCard.displayName = "DetectiveCard";
