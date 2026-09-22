"use client";
import React from "react";
import Image from "next/image";
import { CaseEpisode } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { Clock, MapPin, Target, Shield, ArrowRight, Volume2, VolumeX } from "lucide-react";
import { EPISODE_1_OBJECTIVES_DEFINITION } from "@/lib/game/episodeObjectives";

interface EpisodeBriefingScreenProps {
  episode: CaseEpisode;
  onProceed: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export default function EpisodeBriefingScreen({
  episode,
  onProceed,
  isMuted,
  onToggleMute,
}: EpisodeBriefingScreenProps) {
  const handleProceed = () => {
    soundManager.playRubberStamp(true);
    onProceed();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-4 bg-[#FAF4E8] text-[#1D1713] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.6)] border-2 border-[#D4B26F]/60 overflow-hidden font-serif">
      {/* Folder Header Tab */}
      <div className="bg-[#241A13] text-[#FAF4E8] px-6 py-3 flex items-center justify-between border-b-2 border-[#C99A3C]/40">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase px-2 py-0.5 bg-[#3B2B20] border border-[#C99A3C]/50 rounded-xs">
            EPISODE {episode.episodeNumber} OF 5
          </span>
          <span className="font-serif text-sm md:text-base font-bold text-[#FAF4E8]">
            FILE #{episode.id.toUpperCase()} &bull; THE LAST FERRY
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-1.5 rounded-sm bg-[#1A120D] text-[#E8C66A] hover:bg-[#332216] transition-colors border border-[#C99A3C]/30 text-xs flex items-center gap-1.5 font-mono cursor-pointer"
          title="Toggle Noir Sound"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isMuted ? "MUTED" : "AUDIO ON"}</span>
        </button>
      </div>

      {/* Main Folder Interior */}
      <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 relative bg-[radial-gradient(#EBDDC3_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Left Column: Location Photograph & Stats */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="relative group bg-[#1A130E] p-3 pb-8 rounded-xs shadow-xl border border-[#4A382A]/50 transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* Paper clip */}
            <div className="absolute -top-3 left-10 w-4 h-9 border-2 border-[#8A7558] rounded-full z-20 pointer-events-none bg-[#C99A3C]/20 shadow-xs" />
            
            <div className="relative w-full aspect-[4/3] overflow-hidden border border-[#2D2117]">
              <Image
                src={episode.locationIllustration}
                alt={episode.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover sepia-[0.3] contrast-[1.1] brightness-[0.9]"
                priority
              />
            </div>
            <div className="mt-3 text-center">
              <span className="font-mono text-[11px] text-[#E8C66A] uppercase tracking-widest">
                SCENE LOG: {episode.subtitle}
              </span>
            </div>
          </div>

          {/* Episode Quick Stats */}
          <div className="bg-[#EFE3CF] p-4 rounded-xs border border-[#C99A3C]/40 space-y-2.5 text-xs font-sans">
            <div className="flex items-center gap-2 text-[#3D2C20]">
              <Clock className="w-4 h-4 text-[#8C2D32]" />
              <span className="font-mono font-bold">Est. Duration:</span> {episode.durationEstimate}
            </div>
            <div className="flex items-center gap-2 text-[#3D2C20]">
              <MapPin className="w-4 h-4 text-[#8C2D32]" />
              <span className="font-mono font-bold">Location:</span>{" "}
              {episode.episodeNumber === 1
                ? "Nabadwip Ghat No. 6 & MV Sonartori"
                : episode.episodeNumber === 2
                ? "MV Sonartori • Lower Machinery Hold"
                : episode.episodeNumber === 3
                ? "Lalbazar CID • Interrogation Wing"
                : episode.episodeNumber === 4
                ? "Port Trust Archive & Wharf Records"
                : "Strand Road Warehouse • Eastern Embankment"}
            </div>
            <div className="flex items-center gap-2 text-[#3D2C20]">
              <Target className="w-4 h-4 text-[#8C2D32]" />
              <span className="font-mono font-bold">Objective:</span> {episode.checkpoint.title}
            </div>
          </div>

          {/* Clues & Witnesses Summary */}
          <div className="bg-[#FAF4E8] p-3.5 rounded-xs border border-[#D4B26F]/60 text-xs font-mono">
            <div className="text-[#8C2D32] font-bold uppercase tracking-wider mb-2">
              Dossier Contents:
            </div>
            <div className="flex justify-between py-1 border-b border-[#D4B26F]/30">
              <span className="text-[#594333]">Evidence Clues Attached:</span>
              <span className="font-bold text-[#1D1713]">{episode.clues.length} Items</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#594333]">Witnesses on Record:</span>
              <span className="font-bold text-[#1D1713]">{episode.witnesses.length} Persons</span>
            </div>
          </div>
        </div>

        {/* Right Column: Briefing Dispatch */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[#8C2D32] font-mono text-xs uppercase tracking-widest font-bold">
                Lalbazar Special Division &bull; Case Incident
              </span>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-[#1A130E] leading-tight mb-2">
              {episode.title}
            </h1>
            <p className="font-serif italic text-base text-[#6B5342] mb-6">
              &ldquo;{episode.subtitle}&rdquo;
            </p>

            <div className="h-[2px] bg-gradient-to-r from-[#C99A3C] via-[#8C2D32] to-transparent mb-6 opacity-70" />

            <div className="space-y-4 text-sm md:text-base text-[#2E231B] leading-relaxed font-serif">
              <div className="p-3.5 bg-[#F2E5D0] border-l-4 border-[#8C2D32] italic font-semibold">
                {episode.briefingHeadline}
              </div>

              {episode.briefingText.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Episode 1 Goal-Based Objectives Orientation Card */}
            {episode.episodeNumber === 1 && (
              <div className="mt-6 p-4 md:p-5 bg-[#F4E8D3] rounded-xs border-2 border-[#C99A3C]/70 shadow-inner space-y-3 font-serif">
                <div className="flex items-center justify-between border-b border-[#D4B26F]/60 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8C2D32]" />
                    <span className="font-mono text-xs uppercase tracking-widest text-[#8C2D32] font-bold">
                      Orientation Protocol &bull; 5 Operational Objectives
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#594333] uppercase font-bold bg-[#E8DAC2] px-2 py-0.5 rounded-xs border border-[#C99A3C]/40">
                    Mandatory for Episode 1
                  </span>
                </div>

                <p className="text-xs text-[#4A3728] leading-relaxed">
                  To master the Lalbazar CID investigation routine, complete the following five progressive milestones during this chapter:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {EPISODE_1_OBJECTIVES_DEFINITION.map((obj) => (
                    <div
                      key={obj.id}
                      className="p-2.5 bg-[#FAF4E8] rounded-xs border border-[#D4B26F] shadow-xs flex items-start gap-2.5"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#8C2D32] text-[#FAF4E8] font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {obj.stepNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-serif text-xs font-bold text-[#1A130E] truncate">
                            {obj.title}
                          </span>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[#8C2D32] bg-[#F2E5D0] px-1 rounded-xs shrink-0">
                            {obj.category}
                          </span>
                        </div>
                        <p className="font-serif text-[11px] text-[#594333] leading-snug mt-0.5 line-clamp-2">
                          {obj.instruction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#D4B26F]/40 flex items-center gap-2 text-[11px] font-mono text-[#665040]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C99A3C] shrink-0" />
                  <span>
                    Your Field Docket HUD will automatically track these objectives in the lower-left corner as you inspect exhibits, interrogate witnesses, pin leads, and review the timeline.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-6 border-t-2 border-[#D4B26F]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#665040]">
              <Shield className="w-4 h-4 text-[#8C2D32]" />
              <span>Evidence locked to investigator inventory until shared.</span>
            </div>

            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-7 py-3 rounded-xs bg-[#702428] text-[#FAF4E8] hover:bg-[#852C32] font-serif font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg border border-[#C99A3C] hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <span>Commence Investigation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
