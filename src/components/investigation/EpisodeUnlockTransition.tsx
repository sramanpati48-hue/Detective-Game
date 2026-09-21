"use client";
import React from "react";
import { CaseEpisode } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { ArrowRight, FolderOpen } from "lucide-react";

interface EpisodeUnlockTransitionProps {
  completedEpisode: CaseEpisode;
  nextEpisodeTitle: string;
  onContinue: () => void;
}

export default function EpisodeUnlockTransition({
  completedEpisode,
  nextEpisodeTitle,
  onContinue,
}: EpisodeUnlockTransitionProps) {
  const handleContinue = () => {
    soundManager.playPaperSlide();
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-serif">
      <div className="relative w-full max-w-xl bg-[#FAF4E8] text-[#1F1710] rounded-sm border-2 border-[#C99A3C] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden p-8 text-center bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
        {/* Animated Stamp / Badge */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#241A13] text-[#E8C66A] border-2 border-[#C99A3C] flex items-center justify-center shadow-lg">
          <FolderOpen className="w-8 h-8" />
        </div>

        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#8C2D32] block mb-2">
          Episode {completedEpisode.episodeNumber} Complete &bull; Dossier Advanced
        </span>

        <h2 className="font-serif text-3xl font-black text-[#1F1710] mb-4">
          {completedEpisode.title} Cleared
        </h2>

        <div className="p-4 bg-[#F2E5D0] border-l-4 border-[#8C2D32] rounded-xs text-sm text-[#2B1F17] leading-relaxed italic mb-6">
          &ldquo;{completedEpisode.cliffhanger.teaserText}&rdquo;
        </div>

        <div className="mb-6 font-mono text-xs text-[#594333]">
          Next Investigation File:
          <span className="block font-serif text-base font-bold text-[#8C2D32] mt-1">
            {nextEpisodeTitle}
          </span>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-3 bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] font-serif font-bold text-xs uppercase tracking-widest rounded-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02] border border-[#C99A3C]"
        >
          <span>Open Next Episode Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
