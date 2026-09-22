"use client";
import React, { useState } from "react";
import { THE_LAST_FERRY_CASE, ClueItem } from "@/lib/data/cases/the-last-ferry";
import {
  FinalAccusationResult,
  FinalAccusationSubmission,
} from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";
import { Gavel, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FinalAccusationScreenProps {
  accessibleClues: ClueItem[];
  onSubmitAccusation: (
    submission: FinalAccusationSubmission
  ) => Promise<{ success: boolean; result?: FinalAccusationResult } | null>;
  onShowCinematic: () => void;
  finalResult?: FinalAccusationResult;
}

export default function FinalAccusationScreen({
  accessibleClues,
  onSubmitAccusation,
  onShowCinematic,
  finalResult,
}: FinalAccusationScreenProps) {
  const [plannerId, setPlannerId] = useState("");
  const [accompliceId, setAccompliceId] = useState("");
  const [method, setMethod] = useState("");
  const [selectedClues, setSelectedClues] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const suspects = THE_LAST_FERRY_CASE.cast.filter((c) => c.role === "Suspect" || c.role === "Witness");

  const toggleClue = (id: string) => {
    soundManager.playClick();
    setSelectedClues((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), id];
      }
      return [...prev, id];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plannerId || !accompliceId || selectedClues.length < 2 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmissionError(null);
    soundManager.playRubberStamp(true);
    const res = await onSubmitAccusation({
      plannerId,
      accompliceId,
      methodDescription: method,
      decisiveClueIds: selectedClues,
    });
    setIsSubmitting(false);

    if (res?.result?.passed) {
      onShowCinematic();
    } else {
      soundManager.playRubberStamp(false);
      setSubmissionError(
        res?.result?.narrativeReview ||
          "Warrant request rejected by the Chief Judicial Magistrate. The evidence does not conclusively tie both named conspirators to the scene. Review the decisive exhibits."
      );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 font-serif">
      <div className="bg-[#FAF4E8] text-[#1F1710] rounded-sm border-2 border-[#8C2D32] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#591A1E] via-[#702428] to-[#3B1114] text-[#FAF4E8] p-6 border-b-2 border-[#C99A3C]/50 flex items-center justify-between">
          <div>
            <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1 font-bold">
              Episode 5 Climax &bull; Formal Warrant Request
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-[#FAF4E8]">
              Indictment of Conspirators
            </h1>
          </div>
          <Gavel className="w-10 h-10 text-[#E8C66A] opacity-90 hidden sm:block" />
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10 space-y-8 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]">
          {/* Warning Banner */}
          <div className="p-4 bg-[#F2E5D0] border-l-4 border-[#8C2D32] rounded-xs text-xs font-mono text-[#3D2C20] flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#8C2D32] shrink-0" />
            <span>
              Formal submission to Chief Judicial Magistrate, Lalbazar. Once warrants are executed, the investigation concludes. Ensure your deductive chain is unassailable.
            </span>
          </div>

          {/* Rejection Alert Banner */}
          {submissionError && (
            <div className="p-4 bg-[#F8D7DA] border-2 border-[#8C2D32] rounded-xs text-xs font-serif text-[#58151C] shadow-md flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-[#8C2D32] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#8C2D32] mb-1">
                  Warrant Application Denied by Magistrate
                </strong>
                <p className="leading-relaxed">{submissionError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mastermind & Accomplice Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mastermind */}
              <div className="p-4 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs shadow-xs">
                <label htmlFor="accusation-planner-select" className="block font-mono text-xs uppercase font-bold text-[#8C2D32] mb-2">
                  1. Identify the Mastermind / Planner:
                </label>
                <select
                  id="accusation-planner-select"
                  value={plannerId}
                  onChange={(e) => setPlannerId(e.target.value)}
                  className="w-full p-2.5 bg-[#F2E5D0] border border-[#C99A3C] text-xs font-serif text-[#1F1710] rounded-xs"
                >
                  <option value="">-- Choose Accused Mastermind --</option>
                  {suspects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.function})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-mono text-[#665040] mt-1.5">
                  The person who financed and directed the abduction.
                </p>
              </div>

              {/* Accomplice */}
              <div className="p-4 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs shadow-xs">
                <label htmlFor="accusation-accomplice-select" className="block font-mono text-xs uppercase font-bold text-[#8C2D32] mb-2">
                  2. Identify the Inside Accomplice:
                </label>
                <select
                  id="accusation-accomplice-select"
                  value={accompliceId}
                  onChange={(e) => setAccompliceId(e.target.value)}
                  className="w-full p-2.5 bg-[#F2E5D0] border border-[#C99A3C] text-xs font-serif text-[#1F1710] rounded-xs"
                >
                  <option value="">-- Choose Inside Accomplice --</option>
                  {suspects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.function})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-mono text-[#665040] mt-1.5">
                  The person with physical access aboard MV Sonartori.
                </p>
              </div>
            </div>

            {/* Modus Operandi Description */}
            <div>
              <label htmlFor="accusation-method-text" className="block font-mono text-xs uppercase font-bold text-[#594333] mb-1.5">
                3. Modus Operandi & Method:
              </label>
              <textarea
                id="accusation-method-text"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Explain how Abir Basu was extracted from Seat 14 and transferred to Strand Road warehouse..."
                rows={3}
                className="w-full p-3 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710]"
              />
            </div>

            {/* Decisive 3 Clues */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-mono text-xs uppercase font-bold text-[#594333]">
                  4. Select 3 Decisive Exhibits (Court Submissions):
                </label>
                <span className="font-mono text-xs text-[#8C2D32] font-bold">
                  {selectedClues.length} of 3 Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {accessibleClues.map((clue) => {
                  const isChecked = selectedClues.includes(clue.id);
                  return (
                    <button
                      type="button"
                      key={clue.id}
                      data-clue-id={clue.id}
                      aria-pressed={isChecked}
                      onClick={() => toggleClue(clue.id)}
                      className={`p-3 rounded-xs border cursor-pointer transition-all text-left w-full focus:outline-none focus:ring-2 focus:ring-[#8C2D32] ${
                        isChecked
                          ? "bg-[#F2E5D0] border-[#8C2D32] shadow-sm scale-102"
                          : "bg-[#FAF4E8] border-[#D4B26F]/60 hover:bg-[#F7EFE0]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[9px] uppercase font-bold text-[#8C2D32]">
                          {clue.type}
                        </span>
                        {isChecked && (
                          <CheckCircle2 className="w-4 h-4 text-[#8C2D32]" />
                        )}
                      </div>
                      <h4 className="font-serif font-bold text-xs text-[#1F1710] line-clamp-2">
                        {clue.title}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t-2 border-[#D4B26F]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-[#665040] italic">
                Execution authorized under Lalbazar Special Crimes Directive.
              </span>

              <button
                type="submit"
                disabled={!plannerId || !accompliceId || selectedClues.length < 2 || isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#702428] hover:bg-[#852C32] disabled:opacity-40 text-[#FAF4E8] font-serif font-bold text-sm uppercase tracking-wider rounded-xs shadow-xl cursor-pointer transition-all border border-[#C99A3C]"
              >
                {isSubmitting ? "Dispatching Armed Units..." : "Issue Arrest Warrants & Raid"}
              </button>
            </div>
          </form>

          {/* Re-trigger cinematic if already solved */}
          {finalResult?.passed && (
            <div className="p-4 bg-[#E0F2E9] border-2 border-[#2B4C3F] rounded-xs flex items-center justify-between text-xs font-mono text-[#19402E]">
              <span className="font-bold uppercase">Accusation Confirmed. Warrants Executed.</span>
              <button
                onClick={onShowCinematic}
                className="px-4 py-1.5 bg-[#2B4C3F] text-[#FAF4E8] rounded-xs uppercase font-serif font-bold cursor-pointer"
              >
                Replay Case Climax
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
