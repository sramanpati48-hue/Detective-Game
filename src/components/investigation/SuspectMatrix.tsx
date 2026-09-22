"use client";
import React, { useState } from "react";
import Image from "next/image";
import { THE_LAST_FERRY_CASE } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { ShieldAlert, MessageSquare } from "lucide-react";

interface SuspectMatrixProps {
  onInterviewSuspect: (suspectId: string) => void;
}

export default function SuspectMatrix({ onInterviewSuspect }: SuspectMatrixProps) {
  // Local state for investigator deduction tags
  const [suspectTags, setSuspectTags] = useState<Record<string, string>>({
    "debashish-pal": "Prime Suspect",
    "harun-sheikh": "Alibi Questioned",
    "rina-basu": "Corroborated Witness",
    "tuli-ghosh": "Neutral Observer",
    "captain-prakash-nair": "Neutral Observer",
    "abir-basu": "Victim / Missing",
    "inspector-banerjee": "CID Investigator",
  });

  const handleTagChange = (id: string, tag: string) => {
    soundManager.playClick();
    setSuspectTags((prev) => ({ ...prev, [id]: tag }));
  };

  const cast = THE_LAST_FERRY_CASE.cast;

  return (
    <div className="w-full max-w-6xl mx-auto my-4 flex flex-col gap-6 font-serif">
      {/* Header */}
      <div className="bg-[#241A13] text-[#FAF4E8] p-5 rounded-xs border border-[#C99A3C]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1">
            Criminal Intelligence & Suspect Dossier
          </div>
          <h2 className="font-serif text-2xl font-bold">Persons Under Surveillance</h2>
        </div>
        <div className="text-xs font-mono text-[#D9C7A6]/80 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#8C2D32]" />
          <span>Case 001: The Last Ferry &bull; Lalbazar SD</span>
        </div>
      </div>

      {/* Grid of Suspect Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cast.map((person) => {
          const currentTag = suspectTags[person.id] || "Under Review";

          return (
            <div
              key={person.id}
              className="bg-[#FAF4E8] text-[#1F1710] rounded-sm p-5 border-2 border-[#D4B26F]/60 shadow-lg flex flex-col justify-between relative bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px] hover:border-[#8C2D32] transition-colors"
            >
              <div>
                {/* Photo & Role */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-20 h-24 rounded-xs overflow-hidden border-2 border-[#241A13] shadow-md shrink-0 bg-[#120D09]">
                    <Image
                      src={person.avatar}
                      alt={person.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] uppercase font-bold text-[#8C2D32] tracking-wider block mb-1">
                      {person.role}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-[#1F1710] leading-snug truncate">
                      {person.name}
                    </h3>
                    <p className="font-sans text-xs text-[#594333] font-medium leading-tight mt-0.5">
                      {person.function}
                    </p>
                  </div>
                </div>

                {/* Statement Snippet */}
                <div className="p-3 bg-[#F2E5D0] rounded-xs border-l-4 border-[#C99A3C] text-xs font-serif italic text-[#3B2B20] leading-relaxed mb-4">
                  &ldquo;{person.statementSnippet}&rdquo;
                </div>

                {/* Bio Details */}
                <p className="font-serif text-xs text-[#4A3728] leading-relaxed mb-4">
                  {person.bio}
                </p>
              </div>

              {/* Status Classification & Actions */}
              <div className="pt-4 border-t border-[#D4B26F]/50 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-[#665040] uppercase font-bold">
                    Status:
                  </span>
                  <select
                    value={currentTag}
                    onChange={(e) => handleTagChange(person.id, e.target.value)}
                    className="text-xs font-mono px-2 py-1 bg-[#FAF4E8] border border-[#C99A3C] text-[#1F1710] rounded-xs"
                  >
                    <option value="Prime Suspect">Prime Suspect</option>
                    <option value="Alibi Questioned">Alibi Questioned</option>
                    <option value="Corroborated Witness">Corroborated Witness</option>
                    <option value="Neutral Observer">Neutral Observer</option>
                    <option value="Exonerated">Exonerated</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    soundManager.playPaperSlide();
                    onInterviewSuspect(person.id);
                  }}
                  className="w-full py-2 bg-[#2D1F17] hover:bg-[#422E22] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#E8C66A]" />
                  <span>Review Deposition</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
