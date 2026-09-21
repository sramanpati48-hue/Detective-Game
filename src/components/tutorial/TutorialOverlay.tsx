"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { TutorialStep, FIRST_TIME_TUTORIAL_STEPS } from "@/lib/tutorial/steps";
import TutorialTooltip from "@/components/tutorial/TutorialTooltip";
import { setTutorialCompleted } from "@/lib/user/account";
import { soundManager } from "@/lib/audio/soundManager";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

interface TutorialOverlayProps {
  isOpen: boolean;
  isSoloMode?: boolean;
  onClose: () => void;
  onComplete?: () => void;
  // Hooks from parent investigation state to auto-advance on real actions
  isEvidenceModalOpen?: boolean;
  hasPinnedEvidence?: boolean;
  currentActiveTab?: string;
  onNavigateTab?: (tab: string) => void;
  onOpenFirstClue?: () => void;
}

export default function TutorialOverlay({
  isOpen,
  isSoloMode = false,
  onClose,
  onComplete,
  isEvidenceModalOpen = false,
  hasPinnedEvidence = false,
  currentActiveTab,
  onNavigateTab,
  onOpenFirstClue,
}: TutorialOverlayProps) {
  // Filter steps based on solo vs multiplayer
  const activeSteps = FIRST_TIME_TUTORIAL_STEPS.filter(
    (step) => !(isSoloMode && step.isMultiplayerOnly)
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  const currentStep = activeSteps[currentStepIndex] || activeSteps[0];
  const stepTargetIdRef = useRef<string | undefined>(currentStep.targetTutorialId);
  stepTargetIdRef.current = currentStep.targetTutorialId;

  // Reset to Step 1 whenever opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setCycleIndex(0);
    }
  }, [isOpen]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);
      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Locate and measure target element bounding box
  const updateTargetRect = useCallback(() => {
    if (typeof window === "undefined") return;

    if (currentStep.isCentered || !currentStep.targetTutorialId) {
      setTargetRect(null);
      return;
    }

    // Support cycling sub-targets (e.g. Step 5 caseboard tabs)
    let targetSelector = `[data-tutorial-id="${currentStep.targetTutorialId}"]`;
    if (currentStep.targetSecondaryIds && currentStep.targetSecondaryIds.length > 0) {
      const subId = currentStep.targetSecondaryIds[cycleIndex % currentStep.targetSecondaryIds.length];
      const subElem = document.querySelector(`[data-tutorial-id="${subId}"]`);
      if (subElem) {
        targetSelector = `[data-tutorial-id="${subId}"]`;
      }
    }

    const elem = document.querySelector(targetSelector);
    if (elem) {
      const rect = elem.getBoundingClientRect();
      setTargetRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
      });
    } else {
      setTargetRect(null);
    }
  }, [currentStep, cycleIndex]);

  // Update rect on step change, resize, scroll
  useEffect(() => {
    updateTargetRect();
    const handleResize = () => updateTargetRect();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    const timer = setTimeout(updateTargetRect, 80);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
      clearTimeout(timer);
    };
  }, [currentStepIndex, updateTargetRect]);

  // Step 5: Cycle sub-targets every 1 second
  useEffect(() => {
    if (currentStep.targetSecondaryIds && currentStep.targetSecondaryIds.length > 0) {
      const interval = setInterval(() => {
        setCycleIndex((prev) => prev + 1);
      }, 1100);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Auto-advance step 3 when evidence modal opens
  useEffect(() => {
    if (currentStep.id === "evidence-viewer" && isEvidenceModalOpen) {
      soundManager.playClick();
      setCurrentStepIndex((prev) => Math.min(prev + 1, activeSteps.length - 1));
    }
  }, [isEvidenceModalOpen, currentStep.id, activeSteps.length]);

  // Auto-advance step 4 when evidence is pinned / added to journal
  useEffect(() => {
    if (currentStep.id === "adding-to-journal" && hasPinnedEvidence) {
      soundManager.playRubberStamp(true);
      setCurrentStepIndex((prev) => Math.min(prev + 1, activeSteps.length - 1));
    }
  }, [hasPinnedEvidence, currentStep.id, activeSteps.length]);

  const handleNext = () => {
    soundManager.playClick();

    // If on Step 3 and user clicks Next, trigger opening the first clue if not open
    if (currentStep.id === "evidence-viewer" && !isEvidenceModalOpen && onOpenFirstClue) {
      onOpenFirstClue();
      return;
    }

    if (currentStepIndex < activeSteps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);

      // Auto-navigate tabs if needed for context
      const nextStep = activeSteps[nextIndex];
      if (nextStep.id === "shared-caseboard" && onNavigateTab) {
        onNavigateTab("caseboard");
      } else if (nextStep.id === "squad-chat" && onNavigateTab) {
        onNavigateTab("chat");
      }
    } else {
      // Completed tutorial
      soundManager.playRubberStamp(true);
      setTutorialCompleted(true);
      if (onComplete) onComplete();
      onClose();
    }
  };

  const handlePrev = () => {
    soundManager.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    soundManager.playClick();
    setTutorialCompleted(true);
    onClose();
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const pad = 8;

  return (
    <aside aria-label="Tutorial Walkthrough" className="fixed inset-0 z-50 overflow-hidden pointer-events-none select-none">
      {/* 1. SVG Cutout Dimming Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="tutorial-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - pad}
                y={targetRect.top - pad}
                width={targetRect.width + pad * 2}
                height={targetRect.height + pad * 2}
                rx="6"
                ry="6"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dark Dim Backdrop with SVG Mask (Clicks pass through the hole) */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(8, 5, 3, 0.72)"
          mask="url(#tutorial-spotlight-mask)"
          onClick={handleNext}
          className="cursor-pointer"
        />
      </svg>

      {/* 2. Top-Right Subtle "Skip Tutorial" Button */}
      <div className="fixed top-4 right-5 z-60 pointer-events-auto flex items-center gap-2">
        <button
          onClick={handleSkip}
          className="px-3.5 py-1.5 rounded-xs bg-[#1C130D]/90 hover:bg-[#2B1C13] text-[#D9C7A6]/80 hover:text-[#E8C66A] font-serif text-xs uppercase tracking-wider border border-[#C99A3C]/40 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs"
        >
          <X className="w-3.5 h-3.5" />
          <span>Skip Tutorial</span>
        </button>
      </div>

      {/* 3. Glowing Brass Spotlight Ring around Target */}
      <AnimatePresence mode="wait">
        {targetRect && (
          <motion.div
            key={`spotlight-${currentStep.id}-${cycleIndex}`}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: `${targetRect.top - pad}px`,
              left: `${targetRect.left - pad}px`,
              width: `${targetRect.width + pad * 2}px`,
              height: `${targetRect.height + pad * 2}px`,
            }}
            className="pointer-events-none z-50 rounded-xs border-2 border-[#E8C66A] shadow-[0_0_20px_rgba(232,198,106,0.65),inset_0_0_15px_rgba(232,198,106,0.2)]"
          >
            {/* Subtle Pulsing Beacon in corner if not reduced motion */}
            {!reducedMotion && (
              <motion.div
                animate={{ scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 rounded-xs border border-[#F3E3C6] pointer-events-none"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Tooltip Card */}
      <AnimatePresence mode="wait">
        <TutorialTooltip
          key={`tooltip-${currentStep.id}`}
          step={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={activeSteps.length}
          targetRect={targetRect}
          onNext={handleNext}
          onPrev={handlePrev}
          onSkip={handleSkip}
          reducedMotion={reducedMotion}
        />
      </AnimatePresence>
    </aside>
  );
}
