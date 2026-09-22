"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Target,
  FileText,
  Users,
  Pin,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Award,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { EpisodeObjective } from "@/lib/game/episodeObjectives";
import { soundManager } from "@/lib/audio/soundManager";

interface EpisodeObjectivesDocketProps {
  objectives: EpisodeObjective[];
  completedCount: number;
  allCompleted: boolean;
  currentObjective: EpisodeObjective | null;
  onNavigateTab: (tab: "evidence" | "witnesses" | "caseboard" | "timeline") => void;
  onOpenCheckpointModal: () => void;
  onOpenClue?: (clueId: string) => void;
  activeTab?: string;
}

export default function EpisodeObjectivesDocket({
  objectives,
  completedCount,
  allCompleted,
  currentObjective,
  onNavigateTab,
  onOpenCheckpointModal,
  onOpenClue,
  activeTab = "evidence",
}: EpisodeObjectivesDocketProps) {
  const [isMinimized, setIsMinimized] = useState(activeTab === "briefing");
  const [prevCompletedCount, setPrevCompletedCount] = useState(completedCount);
  const hasAutoExpandedRef = useRef(false);

  // Automatically expand when transitioning from briefing to investigation
  useEffect(() => {
    if (activeTab && activeTab !== "briefing" && !hasAutoExpandedRef.current) {
      setIsMinimized(false);
      hasAutoExpandedRef.current = true;
    }
  }, [activeTab]);

  // Play audio when an objective is cleared
  useEffect(() => {
    if (completedCount > prevCompletedCount) {
      soundManager.playRubberStamp(true);
      setPrevCompletedCount(completedCount);
    }
  }, [completedCount, prevCompletedCount]);

  const handleActionClick = (obj: EpisodeObjective) => {
    soundManager.playClick();
    if (obj.opensModal === "checkpoint") {
      onOpenCheckpointModal();
      return;
    }

    if (obj.navTargetTab) {
      onNavigateTab(obj.navTargetTab as "evidence" | "witnesses" | "caseboard" | "timeline");
    }

    if (obj.recommendedClueId && onOpenClue && obj.navTargetTab === "evidence") {
      onOpenClue(obj.recommendedClueId);
    }
  };

  const getCategoryIcon = (category: EpisodeObjective["category"]) => {
    switch (category) {
      case "forensic":
        return FileText;
      case "witness":
        return Users;
      case "caseboard":
        return Pin;
      case "timeline":
        return Clock;
      case "checkpoint":
        return ShieldCheck;
      default:
        return Target;
    }
  };

  const totalObjectives = objectives.length;
  const progressPercent = Math.round((completedCount / totalObjectives) * 100);

  return (
    <aside
      aria-label="Investigator's Operational Objectives Docket"
      className="fixed bottom-4 left-4 z-40 pointer-events-none select-none max-w-[95vw]"
    >
      <div className="pointer-events-auto">
        <AnimatePresence mode="wait">
          {/* MINIMIZED PILL VIEW */}
          {isMinimized ? (
            <motion.button
              key="minimized-docket"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-sm bg-[#160E0A]/95 text-[#FAF4E8] border-2 border-[#C99A3C]/70 shadow-[0_15px_30px_rgba(0,0,0,0.8)] backdrop-blur-md hover:border-[#E8C66A] transition-all cursor-pointer font-serif group"
              title="Expand Investigation Objectives Docket"
            >
              <div className="w-6 h-6 rounded-full bg-[#702428] border border-[#C99A3C] flex items-center justify-center text-[#E8C66A]">
                <Target className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col items-start text-left leading-tight">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#E8C66A]">
                  Field Objectives
                </span>
                <span className="font-serif font-bold text-xs text-[#FAF4E8] flex items-center gap-1.5">
                  <span>Episode 1 Progress</span>
                  <span className="font-mono text-[10px] text-[#C99A3C]">
                    ({completedCount}/{totalObjectives})
                  </span>
                </span>
              </div>
              <ChevronUp className="w-4 h-4 text-[#C99A3C] group-hover:-translate-y-0.5 transition-transform ml-1" />
            </motion.button>
          ) : (
            /* FULL EXPANDED DOCKET VIEW */
            <motion.div
              key="expanded-docket"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="w-84 sm:w-92 bg-[#1A120D] text-[#FAF4E8] rounded-sm border-2 border-[#C99A3C]/80 shadow-[0_25px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(201,154,60,0.25)] font-serif overflow-hidden relative backdrop-blur-md"
            >
              {/* Vintage Brass Fastener / Clip at Top */}
              <div className="absolute -top-1 left-8 w-12 h-2.5 bg-gradient-to-r from-[#8C6D37] via-[#E8C66A] to-[#8C6D37] rounded-b-xs shadow-md border-x border-b border-[#24170C] z-30" />

              {/* Docket Header */}
              <div className="bg-[#241710] px-4 pt-3.5 pb-2.5 border-b border-[#C99A3C]/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#702428] border border-[#C99A3C] flex items-center justify-center text-[#E8C66A] shadow-xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#E8C66A] font-bold">
                        Lalbazar Field Docket
                      </span>
                      {allCompleted && (
                        <span className="font-mono text-[8.5px] uppercase font-bold text-[#8CE5B0] bg-[#142A1E] px-1.5 py-0.2 rounded-xs border border-[#3FB950]/50">
                          Cleared
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-extrabold text-xs text-[#FAF4E8] leading-tight">
                      Episode 1: Operational Objectives
                    </h3>
                  </div>
                </div>

                {/* Header Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded-xs text-[#D9C7A6]/70 hover:text-[#FAF4E8] hover:bg-[#3D281C] transition-colors cursor-pointer"
                    title="Minimize Docket"
                    aria-label="Minimize Docket"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Summary Bar */}
              <div className="px-4 py-2 bg-[#140E0A] border-b border-[#3D291C] flex items-center justify-between gap-3 text-xs">
                <div className="flex-1">
                  <div className="flex justify-between items-center text-[10px] font-mono text-[#D9C7A6]/80 mb-1">
                    <span>PROGRESSION</span>
                    <span className="font-bold text-[#E8C66A]">
                      {completedCount} of {totalObjectives} Completed ({progressPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#2E1E14] rounded-full overflow-hidden border border-[#523A2A]/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-gradient-to-r from-[#8C2D32] via-[#C99A3C] to-[#E8C66A]"
                    />
                  </div>
                </div>
              </div>

              {/* Objectives List */}
              <div className="p-3 sm:p-3.5 space-y-2 max-h-[360px] overflow-y-auto no-scrollbar bg-[radial-gradient(#291C12_1px,transparent_1px)] [background-size:12px_12px]">
                {objectives.map((obj) => {
                  const Icon = getCategoryIcon(obj.category);
                  const isCurrent = currentObjective?.id === obj.id;

                  return (
                    <div
                      key={obj.id}
                      className={`p-2.5 rounded-xs border transition-all ${
                        obj.isCompleted
                          ? "bg-[#140E0A]/70 border-[#3D291C] text-[#FAF4E8]/60"
                          : isCurrent
                          ? "bg-[#2A1B12] border-[#C99A3C] text-[#FAF4E8] shadow-md ring-1 ring-[#C99A3C]/40"
                          : "bg-[#1C120C]/80 border-[#3D291C] text-[#FAF4E8]/80 hover:border-[#66462E]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Checkbox Icon */}
                        <div className="mt-0.5 shrink-0">
                          {obj.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-[#8CE5B0]" />
                          ) : (
                            <Circle
                              className={`w-4 h-4 ${
                                isCurrent ? "text-[#E8C66A] animate-pulse" : "text-[#704F34]"
                              }`}
                            />
                          )}
                        </div>

                        {/* Title & Guidance */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span
                              className={`font-serif text-xs font-bold leading-tight ${
                                obj.isCompleted
                                  ? "line-through text-[#D9C7A6]/50"
                                  : isCurrent
                                  ? "text-[#E8C66A]"
                                  : "text-[#FAF4E8]"
                              }`}
                            >
                              {obj.stepNumber}. {obj.title}
                            </span>

                            {isCurrent && (
                              <span className="font-mono text-[8.5px] uppercase font-bold text-[#E8C66A] bg-[#702428] px-1.5 py-0.2 rounded-xs border border-[#C99A3C]/50 shrink-0">
                                Current
                              </span>
                            )}
                          </div>

                          <p className="font-serif text-[11px] text-[#D9C7A6]/80 leading-snug line-clamp-2">
                            {obj.instruction}
                          </p>

                          {/* Action Button & Status Counter */}
                          <div className="mt-2 pt-1.5 border-t border-[#3D291C]/60 flex items-center justify-between text-[10px] font-mono">
                            <span
                              className={`${
                                obj.isCompleted ? "text-[#8CE5B0] font-bold" : "text-[#C99A3C]"
                              }`}
                            >
                              {obj.isCompleted
                                ? "Cleared ✓"
                                : `${obj.currentCount}/${obj.targetCount} Completed`}
                            </span>

                            {!obj.isCompleted && (
                              <button
                                onClick={() => handleActionClick(obj)}
                                className="inline-flex items-center gap-1 text-[#E8C66A] hover:text-[#FFF] hover:underline cursor-pointer uppercase font-bold tracking-wider"
                              >
                                <span>{obj.actionLabel}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* All Completed Banner */}
              {allCompleted && (
                <div className="p-3 bg-[#1B291E] border-t border-[#3FB950]/50 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-serif font-bold text-[#8CE5B0]">
                    <Award className="w-4 h-4 text-[#8CE5B0]" />
                    <span>Episode 1 Orientation Objectives Fulfilled!</span>
                  </div>
                  <p className="font-serif text-[11px] text-[#D9C7A6]/80 mt-0.5">
                    Proceed to the checkpoint review to unlock Episode 2.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
