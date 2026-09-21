"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { DETECTIVES } from "@/lib/data/detectives";
import { cn } from "@/lib/utils";

interface DetectiveSidebarRosterProps {
  activeDetectiveId: string;
}

export default function DetectiveSidebarRoster({ activeDetectiveId }: DetectiveSidebarRosterProps) {
  return (
    <aside className="w-full lg:w-[220px] xl:w-[240px] shrink-0 flex flex-col gap-2.5 p-2.5 rounded-xl bg-[#100A06]/90 backdrop-blur-md border border-[#3E2B1B]/80 shadow-2xl">
      {/* Back to Detectives Link */}
      <Link
        href="/detectives"
        className="group inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-widest text-[#D9C7A6]/80 hover:text-[#E8C66A] transition-colors py-1 px-1.5 rounded-md hover:bg-[#20140D]"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-[#C99A3C] group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">BACK TO DETECTIVES</span>
      </Link>

      {/* Roster List of 8 Detectives */}
      <div className="flex flex-col gap-1.5">
        {DETECTIVES.map((d) => {
          const isActive = d.id === activeDetectiveId;
          const portraitSrc = d.rosterPortrait || d.heroPortrait || d.portrait;

          return (
            <Link
              key={d.id}
              href={`/detectives/${d.id}`}
              className={cn(
                "group relative flex items-center gap-2.5 p-2 rounded-lg border transition-all duration-200 outline-none select-none",
                isActive
                  ? "bg-[#23170E] border-[#C99A3C] shadow-[0_4px_16px_rgba(201,154,60,0.25)] ring-1 ring-[#C99A3C]/40"
                  : "bg-[#140D08]/85 border-[#3E2B1B]/60 hover:bg-[#1D120B] hover:border-[#8C6D37]/70 text-[#FAF4E8]/80 hover:text-[#FAF4E8]"
              )}
            >
              {/* Thumbnail Portrait */}
              <div
                className={cn(
                  "relative w-9 h-9 rounded-md overflow-hidden shrink-0 border",
                  isActive
                    ? "border-[#E8C66A] ring-1 ring-[#C99A3C]"
                    : "border-[#4A3522] group-hover:border-[#C99A3C]/60"
                )}
              >
                <Image
                  src={portraitSrc}
                  alt={d.name}
                  fill
                  sizes="36px"
                  className="object-cover object-top filter brightness-[0.95] contrast-[1.05]"
                />
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <h4
                  className={cn(
                    "font-serif font-bold text-xs truncate leading-tight transition-colors",
                    isActive
                      ? "text-[#FAF4E8]"
                      : "text-[#E6D7C3] group-hover:text-[#FAF4E8]"
                  )}
                >
                  {d.name}
                </h4>
                <p
                  className={cn(
                    "font-mono text-[9px] uppercase tracking-wider truncate leading-tight mt-0.5",
                    isActive
                      ? "text-[#C99A3C] font-semibold"
                      : "text-[#A89274] group-hover:text-[#C99A3C]/80"
                  )}
                >
                  {d.role}
                </p>
              </div>

              {/* Active Indicator Pip */}
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#E8C66A] shadow-[0_0_6px_#E8C66A] shrink-0 mr-1" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Atmospheric Sidebar Note Quote */}
      <div className="mt-4 p-3 rounded-lg border border-[#C99A3C]/20 bg-[#140D08]/70 backdrop-blur-xs">
        <p className="font-serif italic text-[12px] text-[#C99A3C]/80 leading-relaxed text-center">
          &ldquo;Different minds. A sharper Kolkata.&rdquo;
        </p>
      </div>
    </aside>
  );
}
