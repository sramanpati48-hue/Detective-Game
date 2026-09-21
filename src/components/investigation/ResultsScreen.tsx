"use client";
import React from "react";
import Link from "next/link";
import { FinalAccusationResult } from "@/lib/game/checkpointValidator";
import { CheckCircle2, FileText, ChevronRight } from "lucide-react";

interface ResultsScreenProps {
  result: FinalAccusationResult;
  roomCode: string;
  detectiveName: string;
  onReviewDossier: () => void;
}

export default function ResultsScreen({
  result,
  roomCode,
  detectiveName,
  onReviewDossier,
}: ResultsScreenProps) {
  const { rank, finalIQS, breakdown, narrativeReview } = result;

  return (
    <div className="w-full max-w-4xl mx-auto my-8 font-serif">
      <div className="bg-[#FAF4E8] text-[#1F1710] rounded-sm border-2 border-[#C99A3C] shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Certificate / Dossier Header */}
        <div className="bg-[#241A13] text-[#FAF4E8] p-8 border-b-2 border-[#C99A3C]/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1 font-bold">
              Lalbazar Special Crimes Division &bull; Case File #001
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-[#FAF4E8]">
              Final Case Debriefing
            </h1>
            <p className="font-mono text-xs text-[#D9C7A6]/80 mt-1">
              Room #{roomCode} &bull; Lead Investigator: {detectiveName}
            </p>
          </div>

          {/* Large Rank Badge */}
          <div className="shrink-0 flex flex-col items-center bg-[#FAF4E8] text-[#1F1710] p-4 rounded-xs border-2 border-[#C99A3C] shadow-lg self-center">
            <span className="font-mono text-[10px] uppercase font-bold text-[#8C2D32]">
              IQS Rank
            </span>
            <span className="font-serif text-5xl font-black text-[#8C2D32] leading-none my-1">
              {rank}
            </span>
            <span className="font-mono text-xs font-bold text-[#2B4C3F]">
              {finalIQS} / 100
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-8 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Official Police Seal of Closure */}
          <div className="p-5 bg-[#E0F2E9] border-2 border-[#2B4C3F] rounded-xs flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-[#2B4C3F] text-[#FAF4E8] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#2B4C3F]">
                OFFICIAL VERDICT: CASE CLOSED
              </h3>
              <p className="font-serif text-sm md:text-base text-[#19402E] font-semibold mt-0.5">
                Abir Basu safely recovered. Arrest warrants executed on Debashish Pal and Harun Sheikh.
              </p>
            </div>
          </div>

          {/* Narrative Summary */}
          <div>
            <h4 className="font-mono text-xs uppercase font-bold text-[#8C2D32] tracking-wider mb-2">
              Magistrate&apos;s Judicial Review & Commendation
            </h4>
            <div className="p-5 bg-[#FAF4E8] border border-[#D4B26F]/60 rounded-xs shadow-xs text-sm md:text-base text-[#2B1F17] leading-relaxed italic">
              &ldquo;{narrativeReview}&rdquo;
            </div>
          </div>

          {/* Detailed Score Breakdown */}
          <div>
            <h4 className="font-mono text-xs uppercase font-bold text-[#594333] tracking-wider mb-3">
              Investigation Quality Score (IQS) Scoring Matrix
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
              <div className="p-3 bg-[#F2E5D0] border border-[#C99A3C]/50 rounded-xs">
                <span className="text-[#665040] block text-[10px] uppercase">Mastermind:</span>
                <span className="font-bold text-[#2B4C3F]">
                  {breakdown.plannerCorrect ? "+30 Pts (Correct)" : "0 Pts (Failed)"}
                </span>
              </div>

              <div className="p-3 bg-[#F2E5D0] border border-[#C99A3C]/50 rounded-xs">
                <span className="text-[#665040] block text-[10px] uppercase">Accomplice:</span>
                <span className="font-bold text-[#2B4C3F]">
                  {breakdown.accompliceCorrect ? "+20 Pts (Correct)" : "0 Pts (Failed)"}
                </span>
              </div>

              <div className="p-3 bg-[#F2E5D0] border border-[#C99A3C]/50 rounded-xs">
                <span className="text-[#665040] block text-[10px] uppercase">Decisive Clues:</span>
                <span className="font-bold text-[#2B4C3F]">
                  +{breakdown.decisiveCluesMatched * 10} Pts ({breakdown.decisiveCluesMatched}/3)
                </span>
              </div>

              <div className="p-3 bg-[#F2E5D0] border border-[#C99A3C]/50 rounded-xs">
                <span className="text-[#665040] block text-[10px] uppercase">Collaboration:</span>
                <span className="font-bold text-[#2B4C3F]">
                  +{breakdown.collaborationBonus} Pts Bonus
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t-2 border-[#D4B26F]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onReviewDossier}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#FAF4E8] hover:bg-[#F2E5D0] border border-[#C99A3C] text-[#1F1710] font-serif text-xs uppercase tracking-wider font-bold rounded-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-[#8C2D32]" />
              <span>Review Case Dossier</span>
            </button>

            <Link href="/cases" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-3 bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] font-serif font-bold text-xs uppercase tracking-wider rounded-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all border border-[#C99A3C]">
                <span>Return to Lalbazar Desk</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
