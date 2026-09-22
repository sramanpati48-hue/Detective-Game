"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ClueItem } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { X, Pin, Share2, Tag, FileText, Check, ShieldAlert, ArrowDown, Play, Pause, Volume2 } from "lucide-react";

interface EvidenceViewerModalProps {
  clue: ClueItem | null;
  onClose: () => void;
  onShare: (clueId: string) => void;
  onPin: (clueId: string) => void;
  onAttachToChat: (clueId: string) => void;
  isShared: boolean;
  isPinned: boolean;
  highlightPin?: boolean;
}

export default function EvidenceViewerModal({
  clue,
  onClose,
  onShare,
  onPin,
  onAttachToChat,
  isShared,
  isPinned,
  highlightPin = false,
}: EvidenceViewerModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (stopFn) stopFn();
    };
  }, [stopFn]);

  if (!clue) return null;

  const toggleVoiceNote = () => {
    if (isPlayingAudio) {
      if (stopFn) stopFn();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const voiceText = clue.details || clue.summary;
      const player = soundManager.playVoiceNote(
        voiceText,
        () => {
          setIsPlayingAudio(false);
          setAudioProgress(100);
        },
        (pct) => {
          setAudioProgress(pct);
        }
      );
      setStopFn(() => player.stop);
    }
  };

  const handleShare = () => {
    soundManager.playBrassPin();
    onShare(clue.id);
  };

  const handlePin = () => {
    soundManager.playBrassPin();
    onPin(clue.id);
  };

  const handleChat = () => {
    soundManager.playClick();
    onAttachToChat(clue.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF4E8] text-[#1F1710] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.8)] border-2 border-[#C99A3C] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dossier Header */}
        <div className="bg-[#241A13] text-[#FAF4E8] px-6 py-3.5 flex items-center justify-between border-b border-[#C99A3C]/40">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8C2D32] animate-pulse" />
            <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase">
              EXHIBIT REF: {clue.id.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#D9C7A6] hover:text-[#FAF4E8] hover:bg-[#3D2C20] transition-colors cursor-pointer"
            aria-label="Close Evidence"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 font-serif bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-[#D4B26F]/50 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-[#702428] text-[#FAF4E8] font-mono text-[10px] uppercase tracking-wider rounded-xs">
                  {clue.type}
                </span>
                {isShared ? (
                  <span className="px-2 py-0.5 bg-[#2B4C3F] text-[#E0F2E9] font-mono text-[10px] uppercase tracking-wider rounded-xs flex items-center gap-1">
                    <Check className="w-3 h-3" /> Shared with Room
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-[#4A382A] text-[#E8C66A] font-mono text-[10px] uppercase tracking-wider rounded-xs flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Confidential to You
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#1F1710] leading-tight">
                {clue.title}
              </h2>
            </div>

            {/* Official Lalbazar Stamp */}
            <div className="shrink-0 border-2 border-[#8C2D32]/70 text-[#8C2D32] font-mono text-[11px] font-bold px-3 py-1.5 uppercase tracking-widest text-center rotate-[-3deg] select-none bg-[#FAF4E8]/60">
              POLICE RECOVERY
              <br />
              <span className="text-[9px] font-normal">LALBAZAR SD</span>
            </div>
          </div>

          {/* Clue Photo if available */}
          {clue.image && (
            <div className="relative w-full aspect-[16/9] rounded-xs overflow-hidden border-2 border-[#332216] shadow-md bg-[#110D0A]">
              <Image
                src={clue.image}
                alt={clue.title}
                fill
                className="object-cover contrast-[1.05]"
              />
            </div>
          )}

          {/* Audio Player for Audio Exhibits (e.g. Rina's Distress Voice Memo) */}
          {clue.type === "audio" && (
            <div className="p-4 bg-[#241A13] text-[#FAF4E8] rounded-xs border-2 border-[#C99A3C]/60 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#E8C66A] animate-pulse" />
                  <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase font-bold">
                    RECOVERED AUDIO TAPE &bull; EVIDENCE WIRE
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#D9C7A6]">
                  {isPlayingAudio ? "TRANSMITTING..." : "00:24 / 00:24"}
                </span>
              </div>

              {/* Waveform Visualization */}
              <div className="flex items-center gap-1 h-8 px-2 bg-[#120D09] rounded-xs border border-[#3D2C20]">
                {Array.from({ length: 32 }).map((_, i) => {
                  const barProgress = (i / 32) * 100;
                  const isActive = barProgress <= audioProgress;
                  const baseHeight = ((i * 7) % 20) + 6;
                  const currentHeight = isPlayingAudio
                    ? Math.max(5, baseHeight + Math.sin(Date.now() / 200 + i) * 8)
                    : baseHeight;
                  return (
                    <div
                      key={i}
                      style={{ height: `${currentHeight}px` }}
                      className={`flex-1 rounded-xs transition-all duration-100 ${
                        isActive
                          ? "bg-gradient-to-t from-[#8C2D32] to-[#E8C66A]"
                          : "bg-[#3D2C20]/80"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={toggleVoiceNote}
                className="w-full py-2 bg-[#8C2D32] hover:bg-[#A3343A] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlayingAudio ? "Pause Audio Memo" : "Play Voice Memo Recording"}</span>
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-[#F2E5D0] rounded-xs border-l-4 border-[#C99A3C] shadow-xs">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#702428] font-bold mb-1">
              Initial Forensic Note
            </h4>
            <p className="text-sm md:text-base font-serif text-[#2B1F17] leading-relaxed">
              {clue.summary}
            </p>
          </div>

          {/* Full Details */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#594333] font-bold mb-2">
              Recovered Examination & Transcription
            </h4>
            <p className="text-sm md:text-base font-serif text-[#1F1710] leading-relaxed whitespace-pre-line bg-[#FAF4E8] p-4 border border-[#D4B26F]/60 rounded-xs">
              {clue.details}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {clue.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EBE0CD] text-[#4A3728] text-xs font-mono rounded-xs border border-[#C99A3C]/30"
              >
                <Tag className="w-3 h-3 text-[#8C2D32]" />
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 md:px-8 bg-[#EFE3CF] border-t-2 border-[#D4B26F]/60 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleChat}
            className="px-4 py-2 bg-[#2D1F17] text-[#FAF4E8] hover:bg-[#422E22] rounded-xs font-serif text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors border border-[#C99A3C]/40"
          >
            <FileText className="w-3.5 h-3.5 text-[#E8C66A]" />
            <span>Discuss in Squad Chat</span>
          </button>

          <div className="flex items-center gap-3">
            {!isShared && (
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors border border-[#C99A3C]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Room</span>
              </button>
            )}
            <div className="relative">
              {highlightPin && !isPinned && (
                <div className="absolute -top-11 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 px-2.5 py-1 bg-[#1c1917] border border-[#854d0e] text-[#fef3c7] text-[11px] font-mono rounded-xs shadow-xl flex items-center gap-1.5 whitespace-nowrap animate-bounce z-30 pointer-events-none">
                  <span>Pins this fact to your team&apos;s caseboard</span>
                  <ArrowDown className="w-3 h-3 text-[#fef3c7]" />
                </div>
              )}
              <button
                data-tutorial-id="tutorial-add-to-journal"
                onClick={handlePin}
                className={`px-4 py-2 bg-[#C99A3C] hover:bg-[#D4A94B] text-[#1F1710] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all ${
                  highlightPin && !isPinned
                    ? "ring-2 ring-[#C99A3C] ring-offset-2 ring-offset-[#EFE3CF] shadow-[0_0_15px_rgba(201,154,60,0.6)]"
                    : ""
                }`}
              >
                <Pin className="w-3.5 h-3.5" />
                <span>{isPinned ? "Move Pin on Board" : "Pin to Journal / Board"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
