"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CastMember, DialogueLine, THE_LAST_FERRY_CASE } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import {
  Play,
  Pause,
  Volume2,
  MessageSquare,
  AlertCircle,
  FileCheck2,
  Send,
  RotateCcw,
  CheckCircle2,
  PenTool,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  getWitnessInterrogationTree,
  generateWitnessResponse,
  InterrogationOption,
} from "@/lib/data/interrogationDialogues";

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

  const tree = getWitnessInterrogationTree(
    activeWitness.id,
    dialogues[activeWitness.id],
    activeWitness
  );

  // Dynamic interrogation transcripts & asked options per witness
  const [transcripts, setTranscripts] = useState<Record<string, DialogueLine[]>>({});
  const [askedOptions, setAskedOptions] = useState<Record<string, string[]>>({});
  const [customInput, setCustomInput] = useState("");
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Current running transcript for active witness (defaults to witness's opening statement)
  const currentLines = transcripts[activeWitness.id] || [tree.openingStatement];
  const currentAskedOptionIds = askedOptions[activeWitness.id] || [];

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

  const handleSelectOption = (opt: InterrogationOption) => {
    soundManager.playPaperSlide();

    const detectiveLine: DialogueLine = {
      speaker: "Detective",
      speakerRole: "Investigator",
      text: opt.detectiveSpeech,
    };

    const witnessLine: DialogueLine = {
      speaker: opt.witnessResponse.speaker,
      speakerRole: opt.witnessResponse.speakerRole,
      text: opt.witnessResponse.text,
      highlightablePhrase: opt.witnessResponse.highlightablePhrase,
    };

    setTranscripts((prev) => {
      const existing = prev[activeWitness.id] || [tree.openingStatement];
      return {
        ...prev,
        [activeWitness.id]: [...existing, detectiveLine, witnessLine],
      };
    });

    setAskedOptions((prev) => {
      const existing = prev[activeWitness.id] || [];
      return {
        ...prev,
        [activeWitness.id]: existing.includes(opt.id) ? existing : [...existing, opt.id],
      };
    });

    onTagDialogue?.(`Questioned ${activeWitness.name}: "${opt.label}"`);

    setTimeout(() => {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const handleCustomSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = customInput.trim();
    if (!query) return;

    soundManager.playClick();
    setCustomInput("");

    const detectiveLine: DialogueLine = {
      speaker: "Detective",
      speakerRole: "Investigator",
      text: query,
    };

    const response = generateWitnessResponse(
      activeWitness.id,
      query,
      activeWitness.name,
      activeWitness.role
    );

    const witnessLine: DialogueLine = {
      speaker: activeWitness.name,
      speakerRole: activeWitness.role,
      text: response.text,
      highlightablePhrase: response.highlightablePhrase,
    };

    setTranscripts((prev) => {
      const existing = prev[activeWitness.id] || [tree.openingStatement];
      return {
        ...prev,
        [activeWitness.id]: [...existing, detectiveLine, witnessLine],
      };
    });

    onTagDialogue?.(`Interrogated: "${query}"`);

    setTimeout(() => {
      transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  const handleResetDeposition = () => {
    soundManager.playPaperSlide();
    setTranscripts((prev) => ({
      ...prev,
      [activeWitness.id]: [tree.openingStatement],
    }));
    setAskedOptions((prev) => ({
      ...prev,
      [activeWitness.id]: [],
    }));
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

      {/* Right Column: Interrogation Record & Interactive Dialogue Console */}
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
                  const baseHeight = ((i * 7) % 24) + 8;
                  const currentHeight = isPlayingAudio ? Math.max(6, baseHeight + Math.sin(Date.now() / 200 + i) * 10) : baseHeight;

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
            <div className="flex items-center justify-between border-b border-[#D4B26F]/40 pb-2">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[#702428] font-bold flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Deposition Transcript & Contradiction Analysis
              </h4>
              <span className="font-mono text-[10px] text-[#665040] uppercase">
                {currentLines.length} Recorded Statements
              </span>
            </div>

            <div className="space-y-3.5">
              {currentLines.map((line, idx) => {
                const isDetective = line.speaker === "Detective" || line.speakerRole === "Investigator";

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xs shadow-xs relative transition-all border ${
                      isDetective
                        ? "bg-[#F3EBDB] border-[#8C2D32]/50 border-l-4 border-l-[#8C2D32]"
                        : "bg-[#FAF4E8] border-[#D4B26F]/60 border-l-4 border-l-[#C99A3C]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                      <span className={`font-bold uppercase ${isDetective ? "text-[#8C2D32]" : "text-[#702428]"}`}>
                        {line.speaker}:
                      </span>
                      <span className="text-[10px] text-[#665040] italic">[{line.speakerRole}]</span>
                    </div>

                    <p
                      className={`font-serif text-sm md:text-base leading-relaxed ${
                        isDetective ? "text-[#2B1B10] italic font-medium" : "text-[#1F1710]"
                      }`}
                    >
                      &ldquo;{line.text}&rdquo;
                    </p>

                    {/* Highlightable Key Phrase for deductions */}
                    {line.highlightablePhrase && (
                      <div className="mt-2.5 pt-2 border-t border-[#D4B26F]/40 flex items-center justify-between">
                        <button
                          onClick={() => handlePhraseClick(line.highlightablePhrase!)}
                          className={`text-xs font-mono px-2.5 py-1 rounded-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ${
                            highlightedPhrases.includes(line.highlightablePhrase)
                              ? "bg-[#2B4C3F] text-[#E0F2E9] border border-[#2B4C3F]"
                              : "bg-[#EFE3CF] text-[#702428] hover:bg-[#E2D2B8] border border-[#C99A3C]/60 font-bold"
                          }`}
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>
                            {highlightedPhrases.includes(line.highlightablePhrase)
                              ? "Tagged to Case Notes ✓"
                              : `Tag Statement: "${line.highlightablePhrase}"`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={transcriptEndRef} />
            </div>
          </div>

          {/* INTERACTIVE INTERROGATION DIALOGUE BOX */}
          <div className="mt-8 p-5 bg-[#201610] text-[#FAF4E8] rounded-xs border-2 border-[#C99A3C]/80 shadow-2xl space-y-4 font-serif">
            {/* Console Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C99A3C]/40 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#702428] border border-[#E8C66A] flex items-center justify-center text-[#E8C66A] shrink-0 shadow-xs">
                  <PenTool className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-mono text-xs uppercase tracking-widest text-[#E8C66A] font-bold">
                    Interrogation Console &bull; Select Line of Inquiry
                  </h4>
                  <p className="text-[11px] font-serif text-[#D9C7A6]/75">
                    Click a dialogue option below to cross-examine {activeWitness.name}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-[#C99A3C] bg-[#120D09] px-2.5 py-1 rounded-xs border border-[#3D2C20]">
                  Explored: {currentAskedOptionIds.length} / {tree.options.length}
                </span>
                {currentAskedOptionIds.length > 0 && (
                  <button
                    onClick={handleResetDeposition}
                    className="text-[11px] font-mono text-[#D9C7A6]/70 hover:text-[#FAF4E8] flex items-center gap-1 hover:underline cursor-pointer"
                    title="Restart interrogation from opening statement"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Selectable Dialogue Options Grid */}
            {tree.options.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5">
                {tree.options.map((opt) => {
                  const isAsked = currentAskedOptionIds.includes(opt.id);

                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectOption(opt);
                        }
                      }}
                      className={`p-3.5 rounded-xs border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group select-none ${
                        isAsked
                          ? "bg-[#160E0A]/90 border-[#3D2C20] opacity-80 hover:opacity-100 hover:border-[#C99A3C]/60"
                          : "bg-[#2A1D15] hover:bg-[#36251B] border-[#C99A3C]/70 hover:border-[#E8C66A] shadow-md hover:shadow-xl hover:scale-[1.005]"
                      }`}
                    >
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[9px] uppercase px-1.5 py-0.2 rounded-xs font-bold tracking-wider ${
                              isAsked
                                ? "bg-[#241A13] text-[#8C745E] border border-[#3D2C20]"
                                : "bg-[#702428] text-[#FAF4E8] border border-[#E8C66A]"
                            }`}
                          >
                            {opt.badgeText}
                          </span>
                          {isAsked && (
                            <span className="font-mono text-[9px] text-[#8CE5B0] flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Asked & Recorded
                            </span>
                          )}
                        </div>
                        <p className="font-serif text-xs md:text-sm text-[#FAF4E8] font-medium leading-snug group-hover:text-[#FFF]">
                          &ldquo;{opt.detectiveSpeech}&rdquo;
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        <span
                          className={`px-3 py-1.5 rounded-xs font-mono text-[10px] uppercase font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                            isAsked
                              ? "bg-[#241A13] text-[#D9C7A6]/70 border border-[#3D2C20] group-hover:text-[#FAF4E8] group-hover:border-[#E8C66A]"
                              : "bg-[#702428] group-hover:bg-[#8C2D32] text-[#FAF4E8] border border-[#E8C66A] group-hover:scale-102"
                          }`}
                        >
                          <span>{isAsked ? "Re-Ask Question" : "Enter Dialogue"}</span>
                          <ArrowRight className="w-3 h-3 text-[#E8C66A]" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-[#160E0A] rounded-xs border border-[#3D2C20] text-center text-xs text-[#D9C7A6]/70">
                <HelpCircle className="w-5 h-5 mx-auto mb-1 text-[#C99A3C]/80" />
                <span>No pre-recorded interrogation branches for this person. Enter a custom query below.</span>
              </div>
            )}

            {/* Typewriter Custom Query Bar */}
            <form
              onSubmit={handleCustomSubmit}
              className="pt-2 border-t border-[#3D2C20] flex items-center gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Or type custom line of inquiry / press on specific evidence..."
                className="flex-1 px-3.5 py-2 bg-[#120D09] border border-[#C99A3C]/40 focus:border-[#E8C66A] rounded-xs font-serif text-xs text-[#FAF4E8] placeholder:text-[#8C745E] focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="px-4 py-2 bg-[#702428] hover:bg-[#8C2D32] disabled:opacity-40 text-[#FAF4E8] border border-[#E8C66A] rounded-xs font-mono text-[11px] uppercase font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shrink-0"
              >
                <span>Ask Witness</span>
                <Send className="w-3 h-3 text-[#E8C66A]" />
              </button>
            </form>
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
