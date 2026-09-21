"use client";
import React, { useState } from "react";
import { ClueItem } from "@/lib/data/cases/the-last-ferry";
import { validateEvidenceConnection } from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";
import { Network, Sparkles, AlertCircle, CheckCircle2, Link2 } from "lucide-react";

interface ConnectionGraphBoardProps {
  accessibleClues: ClueItem[];
  onAddConnection: (sourceId: string, targetId: string, deductionNotes: string) => void;
}

export default function ConnectionGraphBoard({
  accessibleClues,
  onAddConnection,
}: ConnectionGraphBoardProps) {
  const [sourceClueId, setSourceClueId] = useState("");
  const [targetClueId, setTargetClueId] = useState("");
  const [deductionNotes, setDeductionNotes] = useState("");
  const [feedback, setFeedback] = useState<{ isValid: boolean; message: string } | null>(null);

  // Collect discovered canonical connections from completed checks
  const [establishedLinks, setEstablishedLinks] = useState<
    Array<{ sourceId: string; targetId: string; reason: string }>
  >([]);

  const clueMap = new Map(accessibleClues.map((c) => [c.id, c]));

  const handleTestLink = () => {
    if (!sourceClueId || !targetClueId || sourceClueId === targetClueId) {
      setFeedback({ isValid: false, message: "Select two distinct pieces of evidence to test." });
      return;
    }

    const validation = validateEvidenceConnection(sourceClueId, targetClueId);
    if (validation.isValid) {
      soundManager.playRubberStamp(true);
      const newLink = {
        sourceId: sourceClueId,
        targetId: targetClueId,
        reason: validation.reason || deductionNotes || "Valid forensic deduction.",
      };
      setEstablishedLinks((prev) => [...prev, newLink]);
      onAddConnection(sourceClueId, targetClueId, newLink.reason);
      setFeedback({ isValid: true, message: `Deduction confirmed! ${newLink.reason}` });
      setSourceClueId("");
      setTargetClueId("");
      setDeductionNotes("");
    } else {
      soundManager.playTensionSting();
      setFeedback({
        isValid: false,
        message: validation.reason || "These two items do not form a decisive deduction pair.",
      });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-4 flex flex-col gap-6 font-serif">
      {/* Header */}
      <div className="bg-[#241A13] text-[#FAF4E8] p-5 rounded-xs border border-[#C99A3C]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1">
            Forensic Cross-Referencing
          </div>
          <h2 className="font-serif text-2xl font-bold">Deduction Connection Matrix</h2>
        </div>

        <div className="text-xs font-mono text-[#D9C7A6]/80 flex items-center gap-2">
          <Network className="w-4 h-4 text-[#E8C66A]" />
          <span>{establishedLinks.length} Established Deductions</span>
        </div>
      </div>

      {/* Deduction Linker Workbench (Keyboard Accessible Form) */}
      <div className="bg-[#FAF4E8] text-[#1F1710] p-6 rounded-xs border-2 border-[#D4B26F]/60 shadow-lg flex flex-col gap-4">
        <h3 className="font-mono text-xs uppercase font-bold text-[#8C2D32] tracking-wider flex items-center gap-1.5">
          <Link2 className="w-4 h-4" /> Synthesize Evidence Connection
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#594333] uppercase mb-1">
              Primary Evidence Node:
            </label>
            <select
              value={sourceClueId}
              onChange={(e) => setSourceClueId(e.target.value)}
              aria-label="Primary Evidence Node"
              className="w-full p-2 bg-[#F2E5D0] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710]"
            >
              <option value="">-- Choose First Exhibit --</option>
              {accessibleClues.map((clue) => (
                <option key={clue.id} value={clue.id}>
                  {clue.title} [{clue.type.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#594333] uppercase mb-1">
              Corroborating Evidence Node:
            </label>
            <select
              value={targetClueId}
              onChange={(e) => setTargetClueId(e.target.value)}
              aria-label="Corroborating Evidence Node"
              className="w-full p-2 bg-[#F2E5D0] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710]"
            >
              <option value="">-- Choose Second Exhibit --</option>
              {accessibleClues.map((clue) => (
                <option key={clue.id} value={clue.id}>
                  {clue.title} [{clue.type.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-[#594333] uppercase mb-1">
            Investigator&apos;s Hypothesis / Synthesis Notes:
          </label>
          <input
            type="text"
            value={deductionNotes}
            onChange={(e) => setDeductionNotes(e.target.value)}
            placeholder="e.g. Broken hatch seal aligns with deckhand inspection log timing..."
            className="w-full p-2.5 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710] placeholder:italic"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] font-mono text-[#665040]">
            Valid pairs unlock crucial case breakthroughs and boost IQS score.
          </span>
          <button
            onClick={handleTestLink}
            disabled={!sourceClueId || !targetClueId}
            className="px-5 py-2 bg-[#702428] hover:bg-[#852C32] disabled:opacity-40 text-[#FAF4E8] rounded-xs font-serif text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E8C66A]" />
            <span>Test Deduction Link</span>
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3 rounded-xs text-xs font-mono flex items-start gap-2 border ${
              feedback.isValid
                ? "bg-[#E0F2E9] border-[#2B4C3F] text-[#19402E]"
                : "bg-[#FBE8E8] border-[#8C2D32] text-[#6E1C20]"
            }`}
          >
            {feedback.isValid ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2B4C3F]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#8C2D32]" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Verified Deduction Registry */}
      <div className="space-y-3">
        <h4 className="font-mono text-xs uppercase tracking-widest text-[#E8C66A] font-bold">
          Verified Deduction Record
        </h4>

        {establishedLinks.length === 0 ? (
          <div className="p-8 text-center bg-[#1A120D] text-[#D9C7A6]/70 rounded-xs border border-[#3D2C20]">
            <p className="font-serif text-sm">No cross-referenced deductions established yet.</p>
            <p className="font-serif text-xs opacity-75 mt-1">
              Select two exhibits above to test your hypothesis.
            </p>
          </div>
        ) : (
          establishedLinks.map((link, idx) => {
            const clue1 = clueMap.get(link.sourceId);
            const clue2 = clueMap.get(link.targetId);

            return (
              <div
                key={idx}
                className="bg-[#FAF4E8] text-[#1F1710] p-4 rounded-xs border-2 border-[#2B4C3F] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2B4C3F] text-[#FAF4E8] flex items-center justify-center font-mono text-xs font-bold shrink-0">
                    &radic;
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-serif font-bold text-[#1F1710]">
                      <span className="text-[#8C2D32]">{clue1?.title || link.sourceId}</span>
                      <span className="text-[#C99A3C]">&harr;</span>
                      <span className="text-[#8C2D32]">{clue2?.title || link.targetId}</span>
                    </div>
                    <p className="font-serif text-xs text-[#3D2C20] mt-0.5 leading-relaxed">
                      {link.reason}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[10px] text-[#2B4C3F] uppercase font-bold px-2 py-1 bg-[#E0F2E9] rounded-xs border border-[#2B4C3F]">
                  CANONICAL LINK
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
