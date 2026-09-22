"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, X, ChevronDown, ChevronUp, Compass, Award } from "lucide-react";
import { ONBOARDING_TASKS, TutorialProgress } from "@/lib/tutorial/steps";
import { setTutorialCompleted } from "@/lib/user/account";
import { soundManager } from "@/lib/audio/soundManager";

interface TutorialOverlayProps {
  isOpen: boolean;
  progress: TutorialProgress;
  onClose: () => void;
  onComplete?: () => void;
}

export default function TutorialOverlay({
  isOpen,
  progress,
  onClose,
  onComplete,
}: TutorialOverlayProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isCompletedState, setIsCompletedState] = useState(false);

  // Check how many tasks are done
  const completedCount =
    (progress.inspectedClue ? 1 : 0) +
    (progress.pinnedEvidence ? 1 : 0) +
    (progress.reviewedCaseboard ? 1 : 0);

  const allCompleted = completedCount === 3;

  // Auto-dismiss after 3 seconds upon completing all 3 tasks
  useEffect(() => {
    if (allCompleted && !isCompletedState) {
      setIsCompletedState(true);
      soundManager.playRubberStamp(true);
      setTutorialCompleted(true);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [allCompleted, isCompletedState, onComplete, onClose]);

  const handleDismiss = () => {
    soundManager.playClick();
    setTutorialCompleted(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-label="Investigator's Field Guide Onboarding"
      className="fixed bottom-6 left-6 z-40 pointer-events-none select-none"
    >
      <AnimatePresence mode="wait">
        {/* Completion Banner */}
        {isCompletedState ? (
          <motion.div
            key="tutorial-completed"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-auto w-80 bg-[#1c1917] border-2 border-[#854d0e] text-[#fef3c7] rounded-sm p-4 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_15px_rgba(133,77,14,0.3)] font-serif relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#854d0e]/30 border border-[#854d0e] flex items-center justify-center shrink-0 text-[#fef3c7]">
                <Award className="w-5 h-5 text-[#fef3c7]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[10px] text-[#fef3c7]/70 uppercase tracking-widest block">
                  Lalbazar Division
                </span>
                <h4 className="font-serif font-bold text-sm text-[#fef3c7] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#8CE5B0]" />
                  Orientation Complete
                </h4>
                <p className="font-serif text-xs text-[#fef3c7]/80 mt-0.5">
                  Field manual registered. Proceed with the investigation.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Active Taskbar Card */
          <motion.div
            key="tutorial-taskbar"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto w-84 max-w-[calc(100vw-3rem)] bg-[#1c1917] border-2 border-[#854d0e] text-[#fef3c7] rounded-sm shadow-[0_20px_45px_rgba(0,0,0,0.85),0_0_20px_rgba(133,77,14,0.25)] font-serif overflow-hidden relative"
          >
            {/* Top Bar with Brass Accents */}
            <div className="bg-[#141210] px-4 py-2.5 flex items-center justify-between border-b border-[#854d0e]/50">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#fef3c7] animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-[#fef3c7] uppercase">
                  Field Guide
                </span>
                <span className="font-mono text-[10px] px-1.5 py-0.2 bg-[#854d0e]/40 text-[#fef3c7] rounded-xs border border-[#854d0e]/60 font-semibold">
                  {completedCount}/3
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Minimize / Expand Toggle */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 text-[#fef3c7]/70 hover:text-[#fef3c7] hover:bg-[#854d0e]/30 rounded-xs transition-colors cursor-pointer"
                  title={isMinimized ? "Expand Field Guide" : "Minimize Field Guide"}
                  aria-label={isMinimized ? "Expand Field Guide" : "Minimize Field Guide"}
                >
                  {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {/* Dismiss Button */}
                <button
                  onClick={handleDismiss}
                  className="p-1 text-[#fef3c7]/70 hover:text-[#fef3c7] hover:bg-[#854d0e]/30 rounded-xs transition-colors cursor-pointer"
                  title="Dismiss Field Guide"
                  aria-label="Dismiss Field Guide"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Checklist Content (shown when expanded) */}
            {!isMinimized && (
              <div className="p-4 space-y-3 bg-[radial-gradient(#292218_1px,transparent_1px)] [background-size:12px_12px]">
                <div className="space-y-2">
                  {ONBOARDING_TASKS.map((task) => {
                    const isDone =
                      (task.id === "inspect-clue" && progress.inspectedClue) ||
                      (task.id === "pin-evidence" && progress.pinnedEvidence) ||
                      (task.id === "review-caseboard" && progress.reviewedCaseboard);

                    const isCurrent =
                      (!isDone && task.id === "inspect-clue" && !progress.inspectedClue) ||
                      (!isDone && task.id === "pin-evidence" && progress.inspectedClue && !progress.pinnedEvidence) ||
                      (!isDone && task.id === "review-caseboard" && progress.pinnedEvidence && !progress.reviewedCaseboard);

                    return (
                      <div
                        key={task.id}
                        className={`p-2.5 rounded-xs border transition-all ${
                          isDone
                            ? "bg-[#141210]/60 border-[#854d0e]/30 text-[#fef3c7]/60"
                            : isCurrent
                            ? "bg-[#292218] border-[#854d0e] text-[#fef3c7] shadow-sm ring-1 ring-[#854d0e]/50"
                            : "bg-[#141210]/30 border-[#854d0e]/20 text-[#fef3c7]/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-[#8CE5B0] shrink-0" />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 ${isCurrent ? "text-[#fef3c7]" : "text-[#854d0e]/50"}`} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-serif ${
                                  isDone
                                    ? "line-through opacity-70"
                                    : isCurrent
                                    ? "font-bold text-[#fef3c7]"
                                    : "font-medium"
                                }`}
                              >
                                {task.stepNumber}. {task.label}
                              </span>
                              {isCurrent && (
                                <span className="font-mono text-[9px] uppercase tracking-wider text-[#fef3c7] font-bold px-1.5 py-0.2 bg-[#854d0e]/30 border border-[#854d0e]/60 rounded-xs">
                                  Current
                                </span>
                              )}
                            </div>
                            {isCurrent && (
                              <p className="font-serif text-[11px] text-[#fef3c7]/80 mt-1 leading-snug">
                                {task.hint}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-[#854d0e]/30 flex items-center justify-between text-[10px] font-mono text-[#fef3c7]/60">
                  <span>Interactive Onboarding</span>
                  <button
                    onClick={handleDismiss}
                    className="hover:text-[#fef3c7] underline cursor-pointer"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
