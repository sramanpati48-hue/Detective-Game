"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react";
import { TutorialStep } from "@/lib/tutorial/steps";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

interface TutorialTooltipProps {
  step: TutorialStep;
  currentStepIndex: number;
  totalSteps: number;
  targetRect: TargetRect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  reducedMotion: boolean;
}

export default function TutorialTooltip({
  step,
  currentStepIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
  reducedMotion,
}: TutorialTooltipProps) {
  // Compute smart tooltip coordinates to avoid viewport overflow and not obscure the target
  const getTooltipStyle = (): React.CSSProperties => {
    if (step.isCentered || !targetRect || typeof window === "undefined") {
      return {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "460px",
        width: "90vw",
        zIndex: 60,
      };
    }

    const margin = 16;
    const tooltipWidth = Math.min(380, window.innerWidth - 32);
    const tooltipEstimatedHeight = 220;

    let top = 0;
    let left = 0;

    // Determine vertical placement
    const spaceBelow = window.innerHeight - targetRect.bottom;
    const spaceAbove = targetRect.top;

    if (step.positionPreference === "top" || (spaceBelow < tooltipEstimatedHeight && spaceAbove > spaceBelow)) {
      // Place above target
      top = Math.max(margin, targetRect.top - tooltipEstimatedHeight - margin);
    } else {
      // Place below target
      top = Math.min(window.innerHeight - tooltipEstimatedHeight - margin, targetRect.bottom + margin);
    }

    // Determine horizontal centering relative to target
    const targetCenterX = targetRect.left + targetRect.width / 2;
    left = targetCenterX - tooltipWidth / 2;

    // Clamp inside viewport
    if (left < margin) left = margin;
    if (left + tooltipWidth > window.innerWidth - margin) {
      left = window.innerWidth - tooltipWidth - margin;
    }

    return {
      position: "fixed",
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      width: `${tooltipWidth}px`,
      zIndex: 60,
    };
  };

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;

  const animationProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.95, y: 6 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: -6 },
        transition: { duration: 0.25, ease: "easeOut" as const },
      };

  return (
    <motion.div
      style={getTooltipStyle()}
      {...animationProps}
      className="bg-[#FAF4E8] text-[#1F1710] rounded-sm p-5 md:p-6 border-2 border-[#C99A3C] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(201,154,60,0.25)] relative z-60 font-serif pointer-events-auto bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px] select-none"
    >
      {/* Vintage Corner Red Pushpin with Specular Highlight */}
      <div className="absolute -top-2 left-4 z-20 pointer-events-none">
        <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#7A1F24] via-[#A84743] to-[#E55B5B] shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-[#4A1013]" />
        <div className="w-1 h-1 rounded-full bg-white/80 absolute top-0.5 left-1" />
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#D4B26F]/50 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase font-extrabold tracking-widest text-[#8C2D32] px-2 py-0.5 bg-[#F2E5D0] rounded-xs border border-[#C99A3C]/40">
            {step.title}
          </span>
          {step.requiresAction === "click-target" && (
            <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase font-bold text-[#C99A3C] animate-pulse">
              <Sparkles className="w-2.5 h-2.5" /> Action Required
            </span>
          )}
        </div>

        {/* Dismiss / Skip */}
        <button
          onClick={onSkip}
          className="p-1 text-[#8C6D37] hover:text-[#702428] transition-colors rounded-xs cursor-pointer"
          title="Skip Tutorial"
          aria-label="Skip Tutorial"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Description text */}
      <p className="font-serif text-xs md:text-sm text-[#382618] leading-relaxed mb-4">
        {step.description}
      </p>

      {/* Bottom control bar: Rivet dot-stepper & Navigation CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-[#D4B26F]/40 gap-2">
        {/* Brass Rivet Dot-Stepper */}
        <div className="flex items-center gap-1.5" title={`Step ${currentStepIndex + 1} of ${totalSteps}`}>
          {Array.from({ length: totalSteps }).map((_, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all duration-200 border ${
                  isCurrent
                    ? "bg-[#C99A3C] border-[#8C6D37] scale-125 shadow-[0_0_6px_#C99A3C]"
                    : isCompleted
                    ? "bg-[#702428] border-[#4A1013]"
                    : "bg-[#D9C7A6]/50 border-[#8C6D37]/40"
                }`}
              />
            );
          })}
          <span className="ml-1 font-mono text-[9px] text-[#6E5840] tracking-wider">
            {currentStepIndex + 1}/{totalSteps}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={onPrev}
              className="px-2.5 py-1.5 rounded-xs bg-[#EFE3CF] hover:bg-[#E2D4BE] text-[#3D2C20] font-mono text-xs font-semibold flex items-center gap-1 border border-[#C99A3C]/40 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          <button
            onClick={onNext}
            className="px-4 py-1.5 rounded-xs bg-gradient-to-r from-[#702428] via-[#852C32] to-[#702428] hover:from-[#852C32] hover:to-[#96333A] text-[#FAF6EE] font-serif text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 border border-[#C99A3C] shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
          >
            <span>{step.ctaText || (isLast ? "Finish" : "Next")}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
