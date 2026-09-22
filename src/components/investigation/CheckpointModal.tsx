"use client";
import React, { useState } from "react";
import { CaseEpisode, ClueItem } from "@/lib/data/cases/the-last-ferry";
import { CheckpointValidationResult } from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";
import { X, CheckCircle2, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

interface CheckpointModalProps {
  episode: CaseEpisode;
  accessibleClues: ClueItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (selectedClueIds: string[], notes: string) => Promise<CheckpointValidationResult | null>;
  onProceedNext: () => void;
  onOpenHints: () => void;
  isCompleted: boolean;
}

export default function CheckpointModal({
  episode,
  accessibleClues,
  isOpen,
  onClose,
  onSubmit,
  onProceedNext,
  onOpenHints,
  isCompleted,
}: CheckpointModalProps) {
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CheckpointValidationResult | null>(
    isCompleted
      ? {
          passed: true,
          scoreDelta: 25,
          message: "EVIDENCE VERIFIED",
          feedback: episode.checkpoint.successExplanation,
        }
      : null
  );

  if (!isOpen) return null;

  const toggleClue = (id: string) => {
    soundManager.playClick();
    setSelectedClueIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const res = await onSubmit(selectedClueIds, notes);
    setIsSubmitting(false);

    if (res) {
      setResult(res);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#FAF4E8] text-[#1F1710] rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-2 border-[#C99A3C] overflow-hidden flex flex-col max-h-[90vh] font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#241A13] text-[#FAF4E8] px-6 py-3.5 flex items-center justify-between border-b border-[#C99A3C]/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#E8C66A]" />
            <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase font-bold">
              {episode.checkpoint.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-[#D9C7A6] hover:text-[#FAF4E8] hover:bg-[#3D2C20] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
          {/* Prompt */}
          <div className="p-4 bg-[#F2E5D0] rounded-xs border-l-4 border-[#8C2D32]">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#8C2D32] font-bold mb-1">
              Investigative Objective
            </h3>
            <p className="font-serif text-base text-[#1F1710] leading-relaxed font-semibold">
              {episode.checkpoint.prompt}
            </p>
          </div>

          {/* Validation Result Stamp Animation */}
          {result && (
            <div
              className={`p-5 rounded-xs border-2 text-center transition-all animate-in zoom-in-95 duration-200 relative overflow-hidden ${
                result.passed
                  ? "bg-[#E0F2E9] border-[#2B4C3F] text-[#19402E]"
                  : "bg-[#FBE8E8] border-[#8C2D32] text-[#6E1C20]"
              }`}
            >
              {/* Rubber Stamp Graphic */}
              <div
                className={`inline-block border-4 px-6 py-2 rounded-xs font-mono font-black text-xl uppercase tracking-widest mb-3 rotate-[-4deg] select-none ${
                  result.passed
                    ? "border-[#2B4C3F] text-[#2B4C3F] shadow-[0_0_12px_rgba(43,76,63,0.3)]"
                    : "border-[#8C2D32] text-[#8C2D32] shadow-[0_0_12px_rgba(140,45,50,0.3)]"
                }`}
              >
                {result.message}
              </div>

              <p className="font-serif text-sm leading-relaxed max-w-lg mx-auto">
                {result.feedback}
              </p>
            </div>
          )}

          {/* Submission Form (hidden if already passed) */}
          {(!result || !result.passed) && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Clue Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase font-bold text-[#594333]">
                    Select Supporting Exhibits from Dossier:
                  </label>
                  <span className="text-[11px] font-mono text-[#8C2D32]">
                    ({selectedClueIds.length} Selected)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-2 bg-[#FAF4E8] border border-[#D4B26F]/60 rounded-xs">
                  {accessibleClues.map((clue) => {
                    const isChecked = selectedClueIds.includes(clue.id);
                    return (
                      <label
                        key={clue.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xs border cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-[#F2E5D0] border-[#8C2D32] text-[#1F1710]"
                            : "bg-[#FAF4E8] border-[#D4B26F]/40 text-[#4A3728] hover:bg-[#F7EFE0]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleClue(clue.id)}
                          className="mt-0.5 accent-[#8C2D32]"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-serif font-bold truncate">{clue.title}</p>
                          <span className="text-[10px] font-mono text-[#665040] uppercase">
                            {clue.type}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Theory Notes */}
              <div>
                <label className="block font-mono text-xs uppercase font-bold text-[#594333] mb-1">
                  Detective&apos;s Formal Deductive Reasoning:
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Summarize your deduction regarding Abir Basu and the evidence collected..."
                  rows={3}
                  className="w-full p-3 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710] placeholder:italic"
                />
              </div>

              {/* Submit & Hint Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onOpenHints}
                  className="px-3 py-1.5 text-xs font-mono text-[#702428] hover:text-[#8C2D32] flex items-center gap-1.5 cursor-pointer underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Consult Informant (Hints)</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedClueIds.length === 0}
                  className="px-6 py-2.5 bg-[#702428] hover:bg-[#852C32] disabled:opacity-40 text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit to Lalbazar Division"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {result?.passed && (
          <div className="p-4 bg-[#EFE3CF] border-t-2 border-[#D4B26F]/60 flex items-center justify-between shrink-0">
            <div className="font-mono text-xs text-[#2B4C3F] font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Checkpoint Cleared. Case File Advanced.</span>
            </div>

            <button
              onClick={() => {
                soundManager.playRubberStamp(true);
                onProceedNext();
              }}
              className="px-6 py-2.5 bg-[#2B4C3F] hover:bg-[#386151] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <span>Advance to Next Episode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
