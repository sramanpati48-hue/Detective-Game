"use client";
import React, { useState } from "react";
import Image from "next/image";
import { soundManager } from "@/lib/audio/soundManager";
import { ArrowRight, ArrowLeft, Sparkles, X } from "lucide-react";

interface RevealCinematicProps {
  onComplete: () => void;
}

export default function RevealCinematic({ onComplete }: RevealCinematicProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const stages = [
    {
      title: "ACT I: The Monsoon Deception",
      time: "22:15 HRS &bull; NABADWIP GHAT NO. 6",
      image: "/cases/the-last-ferry/scene_deck_night.jpg",
      text: "As MV Sonartori set out into the torrential Bhairavi squall, accountant Abir Basu sat tensely in Seat 14 clutching his briefcase. He knew the numbers in the municipal wharf ledger were fabricated by Debashish Pal. But he did not know that his telephone call at 20:55 was monitored.",
    },
    {
      title: "ACT II: The Inside Sabotage",
      time: "22:26 HRS &bull; LOWER ENGINE DECK",
      image: "/cases/the-last-ferry/scene_maintenance_hatch.jpg",
      text: "Deckhand Harun Sheikh used his duplicate wrench to snap the wire seal on the lower maintenance hatch. Claiming an emergency leak in the lower engine hold, Harun lured Basu away from the passenger saloon. Basu's dry umbrella remained upright beside Seat 14—the silent proof that he never stepped outside into the rain.",
    },
    {
      title: "ACT III: The Mid-River Intercept",
      time: "22:31 HRS &bull; MID-RIVER INTERCEPT",
      image: "/cases/the-last-ferry/scene_ghat_6.jpg",
      text: "While the ferry was docking at Nimtala Ghat, an unlit wooden dinghy emerged from the lower hatch water-level exit. At Ghat No. 6, where the municipal CCTV camera was deliberately disabled, Harun transferred the bound accountant into a covered black Ambassador.",
    },
    {
      title: "ACT IV: The Strand Road Raid",
      time: "04:30 HRS &bull; STRAND ROAD WAREHOUSE",
      image: "/cases/the-last-ferry/scene_warehouse_dawn.jpg",
      text: "Armed Special Branch detectives breached Debashish Pal's Strand Road warehouse before dawn. Abir Basu was recovered unharmed. Inside Pal's personal safe, detectives seized the missing duplicate municipal ledger—sealing the case against the corrupt dredging syndicate.",
    },
  ];

  const handleNext = () => {
    soundManager.playPaperSlide();
    if (currentStep < stages.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      soundManager.playVictoryFanfare();
      onComplete();
    }
  };

  const handlePrev = () => {
    soundManager.playPaperSlide();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stage = stages[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 font-serif">
      <div className="relative w-full max-w-4xl bg-[#FAF4E8] text-[#1F1710] rounded-sm border-2 border-[#C99A3C] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col">
        {/* Top Progress Ribbon */}
        <div className="bg-[#241A13] text-[#FAF4E8] px-6 py-3 flex items-center justify-between border-b border-[#C99A3C]/40">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E8C66A]">
            <Sparkles className="w-4 h-4 text-[#E8C66A]" />
            <span className="uppercase tracking-widest font-bold">
              THE TRUTH UNMASKED &bull; SCENE {currentStep + 1} OF 4
            </span>
          </div>

          <button
            onClick={onComplete}
            className="text-xs font-mono text-[#D9C7A6] hover:text-[#FAF4E8] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <span>Skip Cinematic</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cinematic Stage Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Illustration */}
          <div className="md:col-span-6 relative aspect-[4/3] rounded-xs overflow-hidden border-2 border-[#26170D] shadow-xl bg-[#0D0906]">
            <Image
              src={stage.image}
              alt={stage.title}
              fill
              className="object-cover contrast-[1.1] sepia-[0.2]"
              priority
            />
          </div>

          {/* Narrative Transcript */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-[#8C2D32] tracking-widest uppercase mb-1">
                {stage.time}
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-black text-[#1F1710] mb-4">
                {stage.title}
              </h2>
              <div className="h-[2px] bg-gradient-to-r from-[#8C2D32] via-[#C99A3C] to-transparent mb-5 opacity-70" />
              <p className="font-serif text-base md:text-lg text-[#2B1F17] leading-relaxed">
                {stage.text}
              </p>
            </div>

            {/* Stepper Controls */}
            <div className="mt-8 pt-4 border-t border-[#D4B26F]/60 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 bg-[#241A13] hover:bg-[#3D2C20] disabled:opacity-30 text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center gap-2">
                {stages.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === currentStep
                        ? "bg-[#8C2D32] scale-125"
                        : i < currentStep
                        ? "bg-[#2B4C3F]"
                        : "bg-[#D4B26F]/50"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>{currentStep === stages.length - 1 ? "View Results" : "Next Scene"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
