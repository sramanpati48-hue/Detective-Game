"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { ClueItem } from "@/lib/data/cases/the-last-ferry";
import { CaseboardPin, CaseboardConnection } from "@/app/api/room/[roomCode]/investigation/route";
import { soundManager } from "@/lib/audio/soundManager";
import { Link2, Plus, Info } from "lucide-react";

interface SharedCaseboardProps {
  pins: CaseboardPin[];
  connections: CaseboardConnection[];
  availableClues: ClueItem[];
  onPinEvidence: (evidenceId: string, x: number, y: number, notes?: string) => void;
  onConnectPins: (
    sourcePinId: string,
    targetPinId: string,
    sourceClueId: string,
    targetClueId: string,
    notes?: string
  ) => void;
  onOpenClue: (clueId: string) => void;
}

export default function SharedCaseboard({
  pins,
  connections,
  availableClues,
  onPinEvidence,
  onConnectPins,
  onOpenClue,
}: SharedCaseboardProps) {
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [connectionNote, setConnectionNote] = useState("");
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [selectedClueToPin, setSelectedClueToPin] = useState<string>("");

  const boardRef = useRef<HTMLDivElement>(null);

  // Map clueId to ClueItem
  const clueMap = new Map(availableClues.map((c) => [c.id, c]));

  const handlePinClick = (pin: CaseboardPin) => {
    soundManager.playBrassPin();
    if (!selectedPinId) {
      setSelectedPinId(pin.id);
    } else if (selectedPinId === pin.id) {
      setSelectedPinId(null);
    } else {
      // Connect selectedPinId with this pin
      const sourcePin = pins.find((p) => p.id === selectedPinId);
      const targetPin = pin;
      if (sourcePin && targetPin) {
        onConnectPins(
          sourcePin.id,
          targetPin.id,
          sourcePin.evidenceId,
          targetPin.evidenceId,
          connectionNote || "Direct forensic deduction"
        );
        soundManager.playRubberStamp(true);
        setSelectedPinId(null);
        setConnectionNote("");
      }
    }
  };

  const handleAddPinSubmit = () => {
    if (!selectedClueToPin) return;
    soundManager.playBrassPin();

    // Pick dynamic default position based on existing pins count
    const count = pins.length;
    const col = count % 3;
    const row = Math.floor(count / 3);
    const x = 80 + col * 260;
    const y = 80 + row * 220;

    onPinEvidence(selectedClueToPin, x, y);
    setIsAddingPin(false);
    setSelectedClueToPin("");
  };

  // Keyboard accessibility: Connect via dropdown
  const [kbSourcePinId, setKbSourcePinId] = useState<string>("");
  const [kbTargetPinId, setKbTargetPinId] = useState<string>("");

  const handleKeyboardConnect = () => {
    if (!kbSourcePinId || !kbTargetPinId || kbSourcePinId === kbTargetPinId) return;
    const sourcePin = pins.find((p) => p.id === kbSourcePinId);
    const targetPin = pins.find((p) => p.id === kbTargetPinId);
    if (sourcePin && targetPin) {
      onConnectPins(
        sourcePin.id,
        targetPin.id,
        sourcePin.evidenceId,
        targetPin.evidenceId,
        "Connected via evidence review"
      );
      soundManager.playRubberStamp(true);
      setKbSourcePinId("");
      setKbTargetPinId("");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 flex flex-col gap-4 font-serif">
      {/* Board Controls Toolbar */}
      <div className="bg-[#241A13] text-[#FAF4E8] p-4 rounded-xs border border-[#C99A3C]/40 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#E8C66A] shadow-[0_0_8px_#E8C66A]" />
          <h3 className="font-serif text-lg font-bold text-[#FAF4E8]">
            Shared Caseboard & Red String Deductions
          </h3>
          <span className="font-mono text-xs text-[#D9C7A6]/70 uppercase tracking-widest hidden sm:inline">
            ({pins.length} Pinned &bull; {connections.length} Links)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              setIsAddingPin(!isAddingPin);
            }}
            className="px-3 py-1.5 bg-[#8C2D32] hover:bg-[#A3343A] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Pin Evidence</span>
          </button>
        </div>
      </div>

      {/* Add Pin Drawer */}
      {isAddingPin && (
        <div className="p-4 bg-[#FAF4E8] text-[#1F1710] rounded-xs border-2 border-[#C99A3C] shadow-md flex flex-wrap items-center gap-3 animate-in slide-in-from-top-2">
          <span className="font-mono text-xs font-bold text-[#8C2D32] uppercase">
            Select Clue to Pin:
          </span>
          <select
            value={selectedClueToPin}
            onChange={(e) => setSelectedClueToPin(e.target.value)}
            className="flex-1 min-w-[240px] px-3 py-1.5 bg-[#F2E5D0] border border-[#C99A3C] text-xs font-serif text-[#1F1710] rounded-xs"
          >
            <option value="">-- Choose Discovered Evidence --</option>
            {availableClues.map((clue) => (
              <option key={clue.id} value={clue.id}>
                {clue.title} ({clue.type.toUpperCase()})
              </option>
            ))}
          </select>
          <button
            onClick={handleAddPinSubmit}
            disabled={!selectedClueToPin}
            className="px-4 py-1.5 bg-[#2B4C3F] disabled:opacity-50 text-[#FAF4E8] rounded-xs font-serif text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Confirm Pin
          </button>
        </div>
      )}

      {/* Keyboard Accessible Linker (Accessibility Refinement #4) */}
      <div className="p-3 bg-[#1A120D] text-[#D9C7A6] rounded-xs border border-[#3D2C20] flex flex-wrap items-center gap-3 text-xs font-mono">
        <span className="text-[#E8C66A] font-bold uppercase flex items-center gap-1">
          <Link2 className="w-3.5 h-3.5" /> Keyboard Linker:
        </span>
        <select
          value={kbSourcePinId}
          onChange={(e) => setKbSourcePinId(e.target.value)}
          aria-label="Source Evidence Pin"
          className="bg-[#241A13] border border-[#C99A3C]/40 text-[#FAF4E8] px-2 py-1 rounded-xs"
        >
          <option value="">Select Pin A</option>
          {pins.map((p) => (
            <option key={p.id} value={p.id}>
              {clueMap.get(p.evidenceId)?.title || p.evidenceId}
            </option>
          ))}
        </select>
        <span className="text-[#E8C66A]">&rarr;</span>
        <select
          value={kbTargetPinId}
          onChange={(e) => setKbTargetPinId(e.target.value)}
          aria-label="Target Evidence Pin"
          className="bg-[#241A13] border border-[#C99A3C]/40 text-[#FAF4E8] px-2 py-1 rounded-xs"
        >
          <option value="">Select Pin B</option>
          {pins.map((p) => (
            <option key={p.id} value={p.id}>
              {clueMap.get(p.evidenceId)?.title || p.evidenceId}
            </option>
          ))}
        </select>
        <button
          onClick={handleKeyboardConnect}
          disabled={!kbSourcePinId || !kbTargetPinId || kbSourcePinId === kbTargetPinId}
          className="px-3 py-1 bg-[#8C2D32] hover:bg-[#A3343A] text-[#FAF4E8] rounded-xs uppercase tracking-wider disabled:opacity-40 cursor-pointer font-serif"
        >
          Link with Red String
        </button>
      </div>

      {/* Main Corkboard Area */}
      <div
        ref={boardRef}
        className="relative w-full min-h-[580px] bg-[#3B291A] border-8 border-[#26170D] rounded-sm shadow-[inset_0_0_80px_rgba(0,0,0,0.8)] overflow-hidden p-6 select-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(201, 154, 60, 0.08) 0%, transparent 60%),
            url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="cork"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0.45 0 0 0 0.18  0 0.35 0 0 0.12  0 0 0.25 0 0.08  0 0 0 1 0"/></filter><rect width="100%" height="100%" filter="url(%23cork)" opacity="0.3"/></svg>')
          `,
        }}
      >
        {/* SVG Thread Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <filter id="stringShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>
          {connections.map((conn) => {
            const p1 = pins.find((p) => p.id === conn.sourcePinId);
            const p2 = pins.find((p) => p.id === conn.targetPinId);
            if (!p1 || !p2) return null;

            // Pin center offsets
            const x1 = p1.x + 110;
            const y1 = p1.y + 20;
            const x2 = p2.x + 110;
            const y2 = p2.y + 20;

            return (
              <g key={conn.id}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#A8282E"
                  strokeWidth="2.5"
                  strokeDasharray={conn.isCanonVerified ? "none" : "6,4"}
                  filter="url(#stringShadow)"
                />
              </g>
            );
          })}
        </svg>

        {/* Empty Board Hint */}
        {pins.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#D9C7A6]/60 p-6 text-center">
            <Info className="w-10 h-10 mb-3 text-[#C99A3C]/70" />
            <p className="font-serif text-lg font-bold text-[#E8C66A]">
              The Caseboard is Blank
            </p>
            <p className="font-serif text-sm max-w-md mt-1">
              Investigate the episode clues, then click &ldquo;Pin Evidence&rdquo; to place findings on this shared board. Connect two pins to link corroborating deductions.
            </p>
          </div>
        )}

        {/* Pinned Cards */}
        {pins.map((pin, idx) => {
          const clue = clueMap.get(pin.evidenceId);
          const isSelected = selectedPinId === pin.id;

          return (
            <div
              key={pin.id}
              onClick={() => handlePinClick(pin)}
              style={{
                left: `${pin.x}px`,
                top: `${pin.y}px`,
                transform: `rotate(${(idx % 5) - 2}deg)`,
              }}
              className={`absolute z-20 w-60 bg-[#FAF4E8] text-[#1F1710] p-3 rounded-xs shadow-[0_12px_24px_rgba(0,0,0,0.6)] border transition-all cursor-pointer group ${
                isSelected
                  ? "ring-4 ring-[#8C2D32] border-[#8C2D32] scale-105"
                  : "border-[#C99A3C]/60 hover:scale-102 hover:shadow-[0_16px_32px_rgba(0,0,0,0.8)]"
              }`}
            >
              {/* Brass Pin Head */}
              <div className="absolute -top-3 left-1/2 -ml-3 w-6 h-6 rounded-full bg-gradient-to-tr from-[#946A1B] via-[#E8C66A] to-[#FFEB99] border border-[#54380B] shadow-[0_3px_6px_rgba(0,0,0,0.8)] flex items-center justify-center z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3D2C20]" />
              </div>

              {/* Pin Author Badge */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#665040] mb-1.5 pt-1">
                <span className="uppercase text-[#8C2D32] font-bold">
                  {clue?.type || "EVIDENCE"}
                </span>
                <span className="truncate max-w-[110px]">by {pin.sharedByName}</span>
              </div>

              {/* Thumbnail if available */}
              {clue?.image && (
                <div className="relative w-full h-24 mb-2 rounded-xs overflow-hidden border border-[#2D2117] bg-[#120D09]">
                  <Image
                    src={clue.image}
                    alt={clue.title}
                    fill
                    className="object-cover contrast-[1.05]"
                  />
                </div>
              )}

              {/* Title & Excerpt */}
              <h4 className="font-serif font-bold text-xs text-[#1F1710] leading-snug line-clamp-2 mb-1">
                {clue?.title || pin.evidenceId}
              </h4>
              <p className="font-serif text-[11px] text-[#4A3728] line-clamp-2 leading-relaxed">
                {pin.notes || clue?.summary}
              </p>

              {/* Card Action footer */}
              <div className="mt-2 pt-1.5 border-t border-[#D4B26F]/40 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenClue(pin.evidenceId);
                  }}
                  className="text-[10px] font-mono text-[#8C2D32] hover:underline uppercase"
                >
                  Examine Dossier
                </button>
                {isSelected && (
                  <span className="text-[10px] font-mono text-[#8C2D32] font-bold animate-pulse">
                    Click 2nd Pin to Link
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
