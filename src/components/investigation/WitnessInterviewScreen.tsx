"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CastMember, DialogueLine, THE_LAST_FERRY_CASE } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { Play, Pause, Volume2, MessageSquare, AlertCircle, FileCheck2 } from "lucide-react";

interface WitnessInterviewScreenProps {
  witnesses: CastMember[];
  dialogues: Record<string, DialogueLine[]>;
  selectedWitnessId: string | null;
  onSelectWitness: (witnessId: string) => void;
  onTagDialogue?: (phrase: string) => void;
  highlightWitnessId?: string;
}

export default function WitnessInterviewScreen({
  witnesses,
  dialogues,
  selectedWitnessId,
  onSelectWitness,
  onTagDialogue,
  highlightWitnessId,
}: WitnessInterviewScreenProps) {
  const activeWitness =
    witnesses.find((w) => w.id === selectedWitnessId) || witnesses[0] || THE_LAST_FERRY_CASE.cast[0];

  const activeDialogues = dialogues[activeWitness.id] || [
    {
      speaker: activeWitness.name,
      speakerRole: activeWitness.role,
      text: activeWitness.statementSnippet,
    },
  ];

  // Voice Note Audio Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);
  const [highlightedPhrases, setHighlightedPhrases] = useState<string[]>([]);

  // Stop audio if witness changes
  useEffect(() => {
    if (stopFn) {
      stopFn();
      setIsPlayingAudio(false);
      setAudioProgress(0);
    }
  }, [activeWitness.id]);

  const toggleVoiceNote = () => {
    if (isPlayingAudio) {
      if (stopFn) stopFn();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const voiceText =
        activeWitness.id === "rina-basu" || activeWitness.id === "rina_basu"
          ? "Abir called me at 9:15... He said he found an unauthorized diversion in the wharf development account... He said 'If I don't reach Nimtala by ten, give the second duplicate copy to Inspector Banerjee.' Then the line went dead... please find my brother."
          : activeWitness.statementSnippet;

      const player = soundManager.playVoiceNote(
        voiceText,
        () => {
          setIsPlayingAudio(false);
          setAudioProgress(100);
        },
        (pct) => {
          setAudioProgress(pct);
        }
      );
      setStopFn(() => player.stop);
    }
  };

  const handlePhraseClick = (phrase: string) => {
    soundManager.playClick();
    if (!highlightedPhrases.includes(phrase)) {
      setHighlightedPhrases([...highlightedPhrases, phrase]);
      onTagDialogue?.(phrase);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-4 grid grid-cols-1 lg:grid-cols-12 gap-6 font-serif">
      {/* Left Column: Witness Selector Tabs */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        <div className="bg-[#241A13] p-4 rounded-xs border border-[#C99A3C]/40 text-[#FAF4E8]">
          <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1">
            Recorded Statements
          </div>
          <h3 className="font-serif text-xl font-bold">Persons of Interest</h3>
        </div>

        <div className="space-y-2.5">
          {witnesses.map((witness) => {
            const isSelected = witness.id === activeWitness.id;
            const isGoalWitness = highlightWitnessId && witness.id === highlightWitnessId;
            return (
              <button
                key={witness.id}
                onClick={() => {
                  soundManager.playPaperSlide();
                  onSelectWitness(witness.id);
                }}
                className={`w-full text-left p-3 rounded-xs border transition-all flex items-center gap-3 cursor-pointer ${
                  isSelected
                    ? "bg-[#FAF4E8] text-[#1F1710] border-[#8C2D32] shadow-md -translate-r-1"
                    : isGoalWitness
                    ? "bg-[#281810] text-[#FAF4E8] border-2 border-[#E8C66A] shadow-[0_0_15px_rgba(232,198,106,0.4)] ring-1 ring-[#E8C66A]/60 animate-pulse"
                    : "bg-[#18110C]/80 text-[#D9C7A6] border-[#3D2C20] hover:bg-[#251A13]"
                }`}
              >
                <div className="relative w-12 h-12 rounded-xs overflow-hidden border border-[#C99A3C]/40 shrink-0 bg-[#0D0906]">
                  <Image
                    src={witness.avatar}
                    alt={witness.name}
                    fill
                    sizes="48px"
                    className="object-cover sepia-[0.2]"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm truncate font-serif">{witness.name}</h4>
                    <div className="flex items-center gap-1.5">
                      {isGoalWitness && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider bg-[#702428] text-[#FAF4E8] border border-[#E8C66A] font-bold">
                          Goal Target
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-xs uppercase tracking-wider ${
                          witness.role === "Suspect"
                            ? "bg-[#702428] text-[#FAF4E8]"
                            : witness.role === "Witness"
                            ? "bg-[#2B4C3F] text-[#E0F2E9]"
                            : "bg-[#3D2C20] text-[#D9C7A6]"
                        }`}
                      >
                        {witness.role}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs opacity-75 truncate font-sans">{witness.function}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Interrogation Record & Audio Player */}
      <div className="lg:col-span-8 bg-[#FAF4E8] text-[#1F1710] rounded-sm p-6 md:p-8 border-2 border-[#D4B26F]/60 shadow-xl flex flex-col justify-between relative bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]">
        <div>
          {/* Witness Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-[#D4B26F]/50 pb-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-xs overflow-hidden border-2 border-[#241A13] shadow-md shrink-0 bg-[#120D09]">
                <Image
                  src={activeWitness.avatar}
                  alt={activeWitness.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#8C2D32] uppercase tracking-widest">
                    OFFICIAL DEPOSITION &bull; LALBAZAR
                  </span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-extrabold text-[#1F1710]">
                  {activeWitness.name}
                </h2>
                <p className="font-sans text-xs text-[#594333] font-medium">
                  {activeWitness.function} &bull; Bio: {activeWitness.bio}
                </p>
              </div>
            </div>

            <div className="shrink-0 border border-[#8C2D32] px-3 py-1 bg-[#F2E5D0] text-[#8C2D32] font-mono text-xs uppercase font-bold text-center rotate-1">
              RECORD REF: INT-{activeWitness.id.toUpperCase()}
            </div>
          </div>

          {/* Special Voice Note Waveform Audio Player (Available for Rina Basu or general audio evidence) */}
          {(activeWitness.id === "rina-basu" || activeWitness.id === "rina_basu" || activeWitness.voiceNoteAudio) && (
            <div className="mb-6 p-4 bg-[#241A13] text-[#FAF4E8] rounded-xs border-2 border-[#C99A3C]/60 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[#E8C66A] animate-pulse" />
                  <span className="font-mono text-xs tracking-widest text-[#E8C66A] uppercase font-bold">
                    EXHIBIT AUD-01: RECOVERED PHONE CALL / CASSETTE
                  </span>
                </div>
                <span className="font-mono text-[11px] text-[#D9C7A6]">
                  {isPlayingAudio ? "TRANSMITTING..." : "00:24 / 00:24"}
                </span>
              </div>

              {/* Waveform Visualization Bars */}
              <div className="flex items-center gap-1 h-9 px-2 bg-[#120D09] rounded-xs border border-[#3D2C20] mb-3">
                {Array.from({ length: 36 }).map((_, i) => {
                  const barProgress = (i / 36) * 100;
                  const isActive = barProgress <= audioProgress;
                  // Dynamic height based on index pattern
                  const baseHeight = ((i * 7) % 24) + 8;
                  const currentHeight = isPlayingAudio ? Math.max(6, (baseHeight + (Math.sin(Date.now() / 200 + i) * 10))) : baseHeight;

                  return (
                    <div
                      key={i}
                      style={{ height: `${currentHeight}px` }}
                      className={`flex-1 rounded-xs transition-all duration-100 ${
                        isActive
                          ? "bg-gradient-to-t from-[#8C2D32] to-[#E8C66A]"
                          : "bg-[#3D2C20]/80"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={toggleVoiceNote}
                  className="px-4 py-2 bg-[#8C2D32] hover:bg-[#A3343A] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlayingAudio ? "Pause Recording" : "Play Voicemail Recording"}</span>
                </button>

                <p className="text-[11px] font-mono text-[#D9C7A6]/80 italic">
                  Urgent voicemail received from Abir Basu at 20:55 hrs
                </p>
              </div>
            </div>
          )}

          {/* Interrogation Dialogue Transcript */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#702428] font-bold flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              Deposition Transcript & Contradiction Analysis
            </h4>

            <div className="space-y-3.5">
              {activeDialogues.map((line, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xs border border-[#D4B26F]/60 bg-[#FAF4E8] shadow-xs relative"
                >
                  <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                    <span className="font-bold text-[#702428] uppercase">{line.speaker}:</span>
                    <span className="text-[10px] text-[#665040] italic">[{line.speakerRole}]</span>
                  </div>

                  <p className="font-serif text-sm md:text-base text-[#1F1710] leading-relaxed">
                    &ldquo;{line.text}&rdquo;
                  </p>

                  {/* Highlightable Key Phrase for deductions */}
                  {line.highlightablePhrase && (
                    <div className="mt-2.5 pt-2 border-t border-[#D4B26F]/40 flex items-center justify-between">
                      <button
                        onClick={() => handlePhraseClick(line.highlightablePhrase!)}
                        className={`text-xs font-mono px-2 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                          highlightedPhrases.includes(line.highlightablePhrase)
                            ? "bg-[#2B4C3F] text-[#E0F2E9] border border-[#2B4C3F]"
                            : "bg-[#EFE3CF] text-[#702428] hover:bg-[#E2D2B8] border border-[#C99A3C]/40"
                        }`}
                      >
                        <FileCheck2 className="w-3 h-3" />
                        <span>
                          {highlightedPhrases.includes(line.highlightablePhrase)
                            ? "Tagged to Case Notes"
                            : `Tag Statement: "${line.highlightablePhrase}"`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="mt-6 pt-4 border-t border-[#D4B26F]/40 flex items-center justify-between text-xs font-mono text-[#665040]">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#8C2D32]" />
            <span>Cross-reference statements with ticket timestamps and maintenance records.</span>
          </div>
          <span className="italic">Witness sworn under oath</span>
        </div>
      </div>
    </div>
  );
}
