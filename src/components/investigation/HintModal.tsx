"use client";
import React from "react";
import { CaseEpisode } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { X, Lock, Eye, AlertTriangle } from "lucide-react";

interface HintModalProps {
  episode: CaseEpisode;
  hintsUsed: number[];
  isOpen: boolean;
  onClose: () => void;
  onUnlockHint: (tier: number) => void;
}

export default function HintModal({
  episode,
  hintsUsed,
  isOpen,
  onClose,
  onUnlockHint,
}: HintModalProps) {
  if (!isOpen) return null;

  const tiers = [
    {
      tier: 1,
      name: "Tier 1: Street Whispers (Gentle Nudge)",
      text: episode.checkpoint.hintTier1,
      penalty: "-2 IQS Penalty",
      cost: 2,
    },
    {
      tier: 2,
      name: "Tier 2: Informant Lead (Evidence Pointer)",
      text: episode.checkpoint.hintTier2,
      penalty: "-5 IQS Penalty",
      cost: 5,
    },
    {
      tier: 3,
      name: "Tier 3: Lalbazar Dossier Analysis (Full Deduction)",
      text: episode.checkpoint.hintTier3,
      penalty: "-10 IQS Penalty",
      cost: 10,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-[#FAF4E8] text-[#1F1710] rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.85)] border-2 border-[#C99A3C] overflow-hidden flex flex-col font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#241A13] text-[#FAF4E8] px-6 py-3.5 flex items-center justify-between border-b border-[#C99A3C]/40 shrink-0">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E8C66A]" />
            <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase font-bold">
              Informant Consultation &bull; Hints
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#D9C7A6] hover:text-[#FAF4E8] hover:bg-[#3D2C20] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hints Content */}
        <div className="p-6 md:p-8 space-y-4 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
          <p className="text-xs font-mono text-[#665040] leading-relaxed">
            Calling in external intelligence diminishes your final Investigation Quality Score (IQS). Higher tier hints provide direct evidentiary links.
          </p>

          <div className="space-y-4">
            {tiers.map((t) => {
              const isUnlocked = hintsUsed.includes(t.tier);

              return (
                <div
                  key={t.tier}
                  className={`p-4 rounded-xs border-2 transition-all ${
                    isUnlocked
                      ? "bg-[#FAF4E8] border-[#2B4C3F] shadow-xs"
                      : "bg-[#F2E5D0] border-[#D4B26F]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="font-serif font-bold text-sm text-[#1F1710]">
                      {t.name}
                    </h4>
                    <span
                      className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                        isUnlocked
                          ? "bg-[#E0F2E9] text-[#2B4C3F] border border-[#2B4C3F]"
                          : "bg-[#FBE8E8] text-[#8C2D32] border border-[#8C2D32]"
                      }`}
                    >
                      {isUnlocked ? "Unlocked" : t.penalty}
                    </span>
                  </div>

                  {isUnlocked ? (
                    <p className="font-serif text-xs md:text-sm text-[#241A13] leading-relaxed italic bg-[#FAF4E8] p-3 border border-[#D4B26F]/50 rounded-xs">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  ) : (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-serif text-[#665040] italic flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#8C2D32]" />
                        Dossier sealed.
                      </span>

                      <button
                        type="button"
                        data-hint-tier={t.tier}
                        aria-label={`Reveal Hint Tier ${t.tier}`}
                        onClick={() => {
                          soundManager.playPaperSlide();
                          onUnlockHint(t.tier);
                        }}
                        className="px-3.5 py-1.5 bg-[#8C2D32] hover:bg-[#A3343A] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Reveal Hint</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#EFE3CF] border-t-2 border-[#D4B26F]/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#241A13] text-[#FAF4E8] hover:bg-[#3D2C20] rounded-xs font-serif text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            Close Informant Panel
          </button>
        </div>
      </div>
    </div>
  );
}
