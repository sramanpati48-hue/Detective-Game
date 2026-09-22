"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Users,
  Search,
  FileText,
  Pin,
  Radio,
  Clock,
  ShieldCheck,
  HelpCircle,
  Award,
  Layers,
  Zap,
  BookmarkCheck,
  AlertCircle,
  Share2,
} from "lucide-react";
import { soundManager } from "@/lib/audio/soundManager";

interface FieldManualTabsProps {
  searchQuery?: string;
}

export default function FieldManualTabs({ searchQuery = "" }: FieldManualTabsProps = {}) {
  const [activeTab, setActiveTab] = useState<
    "getting-started" | "detective-roles" | "investigation-loop" | "team-cooperation" | "scoring-system"
  >("getting-started");

  React.useEffect(() => {
    if (!searchQuery) return;
    const q = searchQuery.toLowerCase();
    if (q.includes("score") || q.includes("iqs") || q.includes("point") || q.includes("hint") || q.includes("rank")) {
      setActiveTab("scoring-system");
    } else if (q.includes("team") || q.includes("coop") || q.includes("squad") || q.includes("share") || q.includes("telegraph")) {
      setActiveTab("team-cooperation");
    } else if (q.includes("evidence") || q.includes("clue") || q.includes("caseboard") || q.includes("pin") || q.includes("timeline")) {
      setActiveTab("investigation-loop");
    } else if (q.includes("detective") || q.includes("role") || q.includes("character") || q.includes("ananya") || q.includes("kabir")) {
      setActiveTab("detective-roles");
    } else if (q.includes("start") || q.includes("begin") || q.includes("mode") || q.includes("solo") || q.includes("episode")) {
      setActiveTab("getting-started");
    }
  }, [searchQuery]);

  const handleTabChange = (
    tab: "getting-started" | "detective-roles" | "investigation-loop" | "team-cooperation" | "scoring-system"
  ) => {
    soundManager.playPaperSlide();
    setActiveTab(tab);
  };

  const tabs = [
    {
      id: "getting-started" as const,
      label: "1. Getting Started",
      sublabel: "Player Modes & Episodes",
      icon: Compass,
    },
    {
      id: "detective-roles" as const,
      label: "2. Choosing Your Detective",
      sublabel: "Archetypes & Synergy",
      icon: Users,
    },
    {
      id: "investigation-loop" as const,
      label: "3. Investigating a Case",
      sublabel: "Evidence & Caseboards",
      icon: Search,
    },
    {
      id: "team-cooperation" as const,
      label: "4. Working With Your Team",
      sublabel: "Asymmetry & Telegraph",
      icon: Radio,
    },
    {
      id: "scoring-system" as const,
      label: "5. Checkpoints & Scoring",
      sublabel: "IQS Formula & Ranks",
      icon: Award,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto my-6 font-serif">
      {/* Weathered Manila Dossier Container */}
      <div className="relative bg-[#FAF4E8] text-[#1F1710] rounded-t-lg rounded-b-sm border-2 border-[#D4B26F] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-4 sm:p-8 md:p-12 overflow-hidden bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Top Brass Staples / Dossier Fasteners Effect */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#4A3222] flex items-center justify-around px-12 border-b border-[#2D1B11]">
          <div className="w-12 h-1.5 bg-gradient-to-r from-[#A67C2E] via-[#E8C66A] to-[#A67C2E] rounded-full shadow-inner" />
          <div className="w-12 h-1.5 bg-gradient-to-r from-[#A67C2E] via-[#E8C66A] to-[#A67C2E] rounded-full shadow-inner" />
          <div className="w-12 h-1.5 bg-gradient-to-r from-[#A67C2E] via-[#E8C66A] to-[#A67C2E] rounded-full shadow-inner" />
          <div className="w-12 h-1.5 bg-gradient-to-r from-[#A67C2E] via-[#E8C66A] to-[#A67C2E] rounded-full shadow-inner" />
        </div>

        {/* Index Card Weathered Tabs Bar */}
        <div className="mt-4 pt-2 border-b-2 border-[#D4B26F]/60 flex items-end gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-3 sm:px-5 py-2.5 sm:py-3 rounded-t-md font-serif text-left transition-all shrink-0 cursor-pointer border-t border-x ${
                  isActive
                    ? "bg-[#FAF4E8] border-[#D4B26F] text-[#8C2D32] -mb-[2px] z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.06)]"
                    : "bg-[#EDE2CD] border-[#D4B26F]/60 text-[#5C4533] hover:bg-[#F2E7D3]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                      isActive ? "text-[#8C2D32]" : "text-[#8C6D48]"
                    }`}
                  />
                  <div>
                    <div className="font-serif font-bold text-xs sm:text-sm tracking-wide leading-tight">
                      {tab.label}
                    </div>
                    <div className="font-mono text-[9px] sm:text-[10px] uppercase text-[#7A614D] tracking-wider hidden md:block">
                      {tab.sublabel}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#8C2D32] rounded-t-sm" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="pt-8 min-h-[580px]">
          <AnimatePresence mode="wait">
            {/* TAB 1: GETTING STARTED */}
            {activeTab === "getting-started" && (
              <motion.div
                key="getting-started"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Chapter Title */}
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8C2D32] font-bold">
                    Chapter 01 &bull; Operational Protocol
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1710] tracking-tight mt-1">
                    Solo, Duo & Squad Investigations
                  </h2>
                  <p className="font-serif text-sm sm:text-base text-[#523E2E] mt-1 leading-relaxed">
                    Bhorer Shahar: Case Files adapts dynamically whether you are working as a solitary gumshoe
                    or coordinating a full Lalbazar investigative squad.
                  </p>
                </div>

                {/* Player Counts Visual Diagram */}
                <div className="bg-[#F2E8D5] p-5 sm:p-7 rounded-sm border border-[#D4B26F]/80 shadow-xs space-y-6">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#8C2D32]" />
                    Clue Distribution Across Squad Formations
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Solo */}
                    <div className="bg-[#FAF4E8] p-4 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold uppercase text-[#8C2D32] bg-[#F3ECE0] px-2 py-0.5 rounded-xs border border-[#C99A3C]/30">
                            1 Player &bull; Solitary
                          </span>
                          <Users className="w-4 h-4 text-[#8C6D48]" />
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mb-1">
                          The Lone Wolf
                        </h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          100% of all recovered evidence is deposited directly into your personal inventory. You conduct
                          all witness interviews, connect every clue on the caseboard, and make the solitary final accusation.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#D4B26F]/40 font-mono text-[10px] text-[#2B4C3F] font-bold">
                        &bull; Full Information Access
                      </div>
                    </div>

                    {/* Duo */}
                    <div className="bg-[#FAF4E8] p-4 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold uppercase text-[#8C2D32] bg-[#F3ECE0] px-2 py-0.5 rounded-xs border border-[#C99A3C]/30">
                            2 Players &bull; Partners
                          </span>
                          <div className="flex -space-x-1">
                            <Users className="w-4 h-4 text-[#8C6D48]" />
                          </div>
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mb-1">
                          50 / 50 Forensic Split
                        </h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          Clues are split evenly between partners. Neither detective sees the complete picture alone.
                          You must compare private exhibits, verbally debate alibis, and share key documents to the room.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#D4B26F]/40 font-mono text-[10px] text-[#8C2D32] font-bold">
                        &bull; Information Asymmetry Active
                      </div>
                    </div>

                    {/* Squad */}
                    <div className="bg-[#FAF4E8] p-4 rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold uppercase text-[#8C2D32] bg-[#F3ECE0] px-2 py-0.5 rounded-xs border border-[#C99A3C]/30">
                            3-4 Players &bull; Squad
                          </span>
                          <Users className="w-4 h-4 text-[#8C2D32]" />
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mb-1">
                          Role Specialization
                        </h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          Evidence routes directly to the investigator whose chosen archetype matches the clue type:
                          forensic reports to the Purist, witness words to the Street Inquirer, and confidential logs to the Insider.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#D4B26F]/40 font-mono text-[10px] text-[#A67C2E] font-bold">
                        &bull; Specialized Clue Routing
                      </div>
                    </div>
                  </div>
                </div>

                {/* The 5-Episode Case Architecture */}
                <div className="space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#8C2D32]" />
                    The 5-Episode Case Architecture
                  </h3>
                  <p className="font-serif text-xs sm:text-sm text-[#523E2E] leading-relaxed">
                    Every case file is serialized into five distinct narrative chapters. You cannot skip ahead to the climax,
                    as each chapter establishes forensic prerequisites and uncovers deeper syndicate layers:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                    {[
                      { ep: "EP 01", title: "The Discovery", desc: "The crime scene, recovered body, and initial physical exhibits." },
                      { ep: "EP 02", title: "The Depositions", desc: "Interrogating witnesses, dock hands, and tracking contradictory alibis." },
                      { ep: "EP 03", title: "The Ledger", desc: "Unearthing financial ledgers, hidden motives, and smuggling manifests." },
                      { ep: "EP 04", title: "The Syndicate", desc: "Connecting street operators to higher conspirators across Calcutta." },
                      { ep: "EP 05", title: "The Climax", desc: "Final Accusation: unmasking the primary culprit, accomplice, and decisive proof." },
                    ].map((step, idx) => (
                      <div
                        key={step.ep}
                        className="p-3 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40 text-center flex flex-col justify-between"
                      >
                        <div>
                          <div className="font-mono text-[11px] font-black text-[#8C2D32]">{step.ep}</div>
                          <div className="font-serif font-bold text-xs text-[#1F1710] my-1">{step.title}</div>
                          <p className="font-serif text-[11px] text-[#6E4F34] leading-snug">{step.desc}</p>
                        </div>
                        <div className="mt-2 text-[10px] font-mono text-[#A67C2E] font-semibold">
                          Stage {idx + 1} of 5
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Session Persistence & Room Codes */}
                <div className="bg-[#FAF4E8] p-5 rounded-xs border-2 border-dashed border-[#C99A3C]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-sm text-[#1F1710] uppercase tracking-wide flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-[#2B4C3F]" />
                      Session Persistence & Resumption
                    </h4>
                    <p className="font-serif text-xs text-[#523E2E] leading-relaxed max-w-2xl">
                      Investigations are permanently synced via your unique Room Code (e.g. <code>FERRY-892</code>).
                      You can close your browser, switch devices, or take a break — your shared caseboard pins, timeline orders,
                      and chat logs will be waiting exactly as you left them.
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-[#1F1710] text-[#E8C66A] rounded-xs font-mono text-xs tracking-widest shrink-0 border border-[#C99A3C]/50">
                    CLOUD SYNC ACTIVE
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: CHOOSING YOUR DETECTIVE */}
            {activeTab === "detective-roles" && (
              <motion.div
                key="detective-roles"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8C2D32] font-bold">
                    Chapter 02 &bull; Personnel Roster
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1710] tracking-tight mt-1">
                    The Four Detective Archetypes
                  </h2>
                  <p className="font-serif text-sm sm:text-base text-[#523E2E] mt-1 leading-relaxed">
                    Every investigator in Bhorer Shahar possesses a distinct forensic lens. In multiplayer rooms,
                    your role determines which category of evidence routes to your private dossier.
                  </p>
                </div>

                {/* 4 Archetype Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role 1 */}
                  <div className="bg-[#F2E8D5] p-6 rounded-sm border-2 border-[#D4B26F]/80 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase font-bold text-[#8C2D32] px-2 py-0.5 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                          Byomkesh Archetype
                        </span>
                        <span className="font-mono text-[10px] text-[#6E4F34] uppercase">Role #1</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#1F1710] mb-1">
                        The Analytical Purist
                      </h3>
                      <p className="font-serif italic text-xs text-[#8C2D32] mb-3">
                        &quot;Chemicals do not lie. Men lie constantly.&quot;
                      </p>
                      <div className="space-y-2 text-xs font-serif text-[#3E2F23]">
                        <p>
                          <strong>Forensic Focus:</strong> Official autopsy protocols, chemical poison signatures,
                          ballistics trajectory, microscopically examined physical fibres, and coroner records.
                        </p>
                        <p>
                          <strong>Specialty Privilege:</strong> Receives laboratory certificates and autopsy reports
                          directly without needing informant unlocking.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#D4B26F]/60 font-mono text-[10px] uppercase text-[#7A614D]">
                      Exemplar: Debraj Ghosh / Ananya Sen
                    </div>
                  </div>

                  {/* Role 2 */}
                  <div className="bg-[#F2E8D5] p-6 rounded-sm border-2 border-[#D4B26F]/80 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase font-bold text-[#8C2D32] px-2 py-0.5 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                          Feluda Archetype
                        </span>
                        <span className="font-mono text-[10px] text-[#6E4F34] uppercase">Role #2</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#1F1710] mb-1">
                        The Street Inquirer
                      </h3>
                      <p className="font-serif italic text-xs text-[#8C2D32] mb-3">
                        &quot;Listen to the alleys before you listen to the judge.&quot;
                      </p>
                      <div className="space-y-2 text-xs font-serif text-[#3E2F23]">
                        <p>
                          <strong>Forensic Focus:</strong> Witness depositions, dock worker rumors, chai stall whispers,
                          steamer timetables, railway ticket counter logs, and behavioral inconsistencies.
                        </p>
                        <p>
                          <strong>Specialty Privilege:</strong> Detects hesitation in witness interview scripts and receives
                          exclusive street informant whisper notes.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#D4B26F]/60 font-mono text-[10px] uppercase text-[#7A614D]">
                      Exemplar: Vikram Oberoi / Kabir Bose
                    </div>
                  </div>

                  {/* Role 3 */}
                  <div className="bg-[#F2E8D5] p-6 rounded-sm border-2 border-[#D4B26F]/80 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase font-bold text-[#8C2D32] px-2 py-0.5 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                          Kiriti Roy Archetype
                        </span>
                        <span className="font-mono text-[10px] text-[#6E4F34] uppercase">Role #3</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#1F1710] mb-1">
                        The Occult & Esoteric Scholar
                      </h3>
                      <p className="font-serif italic text-xs text-[#8C2D32] mb-3">
                        &quot;Every secret society writes its crimes in classical script.&quot;
                      </p>
                      <div className="space-y-2 text-xs font-serif text-[#3E2F23]">
                        <p>
                          <strong>Forensic Focus:</strong> Ancient merchant treaties, cipher manuscripts, botanical poisons,
                          esoteric engravings on brass tokens, and ancestral zamindari lineages.
                        </p>
                        <p>
                          <strong>Specialty Privilege:</strong> Can decipher encrypted letters, secret marks, and old
                          Bengali shorthand without penalty.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#D4B26F]/60 font-mono text-[10px] uppercase text-[#7A614D]">
                      Exemplar: Ishaan Roy (Chronicler)
                    </div>
                  </div>

                  {/* Role 4 */}
                  <div className="bg-[#F2E8D5] p-6 rounded-sm border-2 border-[#D4B26F]/80 flex flex-col justify-between shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs uppercase font-bold text-[#8C2D32] px-2 py-0.5 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                          Special Branch Archetype
                        </span>
                        <span className="font-mono text-[10px] text-[#6E4F34] uppercase">Role #4</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-[#1F1710] mb-1">
                        The Bureau Insider
                      </h3>
                      <p className="font-serif italic text-xs text-[#8C2D32] mb-3">
                        &quot;Power leaves a paper trail. You just have to know which drawer is locked.&quot;
                      </p>
                      <div className="space-y-2 text-xs font-serif text-[#3E2F23]">
                        <p>
                          <strong>Forensic Focus:</strong> Police dispatch records, intercepted telegraph transmissions,
                          colonial customs manifests, Lalbazar internal memos, and river port clearance stamps.
                        </p>
                        <p>
                          <strong>Specialty Privilege:</strong> Receives classified police archives and port authority
                          logs before any other squad member.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-3 border-t border-[#D4B26F]/60 font-mono text-[10px] uppercase text-[#7A614D]">
                      Exemplar: Sourav Ganguly (Evidence Analyst)
                    </div>
                  </div>
                </div>

                {/* Role Synergy Callout */}
                <div className="bg-[#FAF4E8] p-5 rounded-xs border-l-4 border-[#8C2D32] space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#1F1710] uppercase tracking-wide flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#8C2D32]" />
                    Tactical Synergy: Cross-Disciplinary Synthesis
                  </h4>
                  <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                    The greatest breakthroughs occur when two archetypes compare notes. For example, an intercepted telegraph
                    from the <strong>Bureau Insider</strong> mentioning &quot;Special Cargo 04&quot; combined with the{" "}
                    <strong>Analytical Purist&apos;s</strong> chemical toxicology report identifies the smuggled poison bottle immediately.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 3: INVESTIGATING A CASE */}
            {activeTab === "investigation-loop" && (
              <motion.div
                key="investigation-loop"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8C2D32] font-bold">
                    Chapter 03 &bull; Methodology
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1710] tracking-tight mt-1">
                    The 5-Step Investigation Loop
                  </h2>
                  <p className="font-serif text-sm sm:text-base text-[#523E2E] mt-1 leading-relaxed">
                    True detectives do not guess. Follow this disciplined five-step investigative loop throughout
                    every episode to crack even the tightest alibis.
                  </p>
                </div>

                {/* 5 Step Loop */}
                <div className="space-y-3">
                  {[
                    {
                      num: "01",
                      title: "Examine Evidence Dossier",
                      desc: "Open high-resolution exhibits. Read the case officer summary, inspect stamps, examine photo backgrounds, and verify dates on documents.",
                      icon: FileText,
                    },
                    {
                      num: "02",
                      title: "Interview Witnesses & Suspects",
                      desc: "Read official depositions. Watch for contradictory timelines, sudden shifts in tone, or claims of whereabouts that clash with physical evidence.",
                      icon: Users,
                    },
                    {
                      num: "03",
                      title: "Pin Crucial Finds to the Shared Caseboard",
                      desc: "Pin pivotal exhibits to the corkboard. Add handwritten notes detailing your working hypothesis so your squad can review them.",
                      icon: Pin,
                    },
                    {
                      num: "04",
                      title: "Reconstruct the Chronological Timeline",
                      desc: "Sort events on the Timeline Board from morning to midnight. Notice where travel times between river ghats become physically impossible.",
                      icon: Clock,
                    },
                    {
                      num: "05",
                      title: "Submit the Episode Checkpoint",
                      desc: "When you believe you understand the episode's central mystery, review the checkpoint questions with your team and submit your consensus.",
                      icon: ShieldCheck,
                    },
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.num}
                        className="bg-[#F2E8D5] p-4 sm:p-5 rounded-xs border border-[#D4B26F]/80 flex items-start gap-4 shadow-xs"
                      >
                        <div className="w-10 h-10 rounded-full bg-[#8C2D32] text-[#FAF4E8] flex items-center justify-center font-mono font-bold text-sm shrink-0 shadow-xs">
                          {step.num}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-base text-[#1F1710] flex items-center gap-2">
                            <Icon className="w-4 h-4 text-[#8C2D32]" />
                            {step.title}
                          </h3>
                          <p className="font-serif text-xs sm:text-sm text-[#523E2E] mt-1 leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Evidence Types Breakdown */}
                <div className="bg-[#FAF4E8] p-6 rounded-sm border-2 border-[#D4B26F]/80 space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider">
                    Recovered Evidence Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#8C2D32] mb-1 uppercase">Documents</div>
                      <p className="text-[#523E2E]">Autopsy sheets, ticket stubs, bank statements, forged signatures.</p>
                    </div>
                    <div className="p-3 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#8C2D32] mb-1 uppercase">Photographs</div>
                      <p className="text-[#523E2E]">Ghat surveillance, crime scene footprints, suspect meetings in shadows.</p>
                    </div>
                    <div className="p-3 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#8C2D32] mb-1 uppercase">Physical Objects</div>
                      <p className="text-[#523E2E]">Pocket watches frozen at death time, poison vials, brass tokens.</p>
                    </div>
                    <div className="p-3 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#8C2D32] mb-1 uppercase">Telegrams</div>
                      <p className="text-[#523E2E]">Intercepted Morse wires, encoded police logs, harbour clearances.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 4: WORKING WITH YOUR TEAM */}
            {activeTab === "team-cooperation" && (
              <motion.div
                key="team-cooperation"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8C2D32] font-bold">
                    Chapter 04 &bull; Squad Operations
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1710] tracking-tight mt-1">
                    Information Asymmetry & Coordination
                  </h2>
                  <p className="font-serif text-sm sm:text-base text-[#523E2E] mt-1 leading-relaxed">
                    In multiplayer Bhorer Shahar, no detective has total visibility. Your partners hold the other half
                    of the truth. Master the art of cooperative communication.
                  </p>
                </div>

                {/* Core Concept: Asymmetry Warning */}
                <div className="bg-[#FAF4E8] p-6 rounded-sm border-2 border-[#8C2D32] shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-[#8C2D32] font-mono text-xs font-bold uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    Essential Principle: Why Your Screens Differ
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#1F1710]">
                    Your Partner Does Not See What You See
                  </h3>
                  <p className="font-serif text-xs sm:text-sm text-[#3E2F23] leading-relaxed">
                    When you enter an investigation in multiplayer, private clues are deliberately routed to individual detectives.
                    If you discover a torn ticket stub in your dossier, assume your teammates <strong>cannot see it</strong> until you
                    either read it aloud, discuss it over voice or Squad Telegraph, or click <strong>&quot;Share with Room&quot;</strong>.
                  </p>
                </div>

                {/* Squad Telegraph Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#F2E8D5] p-5 rounded-xs border border-[#D4B26F]/80 space-y-2">
                    <h4 className="font-serif font-bold text-base text-[#1F1710] flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#8C2D32]" />
                      The Squad Telegraph (Live Chat)
                    </h4>
                    <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                      Use the built-in telegraph terminal to post deductions, tag witness statements, and ping colleagues.
                      Any message sent here is instantly delivered to all active investigators in your room.
                    </p>
                  </div>

                  <div className="bg-[#F2E8D5] p-5 rounded-xs border border-[#D4B26F]/80 space-y-2">
                    <h4 className="font-serif font-bold text-base text-[#1F1710] flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#8C2D32]" />
                      Pinning & Sharing Private Clues
                    </h4>
                    <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                      Click any clue in your inventory to open the Full Exhibit. From there, select &quot;Share with Room&quot;
                      to make it accessible on everyone&apos;s Evidence Grid and pin it directly to the communal Caseboard.
                    </p>
                  </div>
                </div>

                {/* Cooperative Etiquette */}
                <div className="bg-[#FAF4E8] p-5 rounded-xs border border-[#C99A3C]/50 space-y-3">
                  <h4 className="font-serif font-bold text-sm text-[#1F1710] uppercase tracking-wide">
                    Lalbazar Field Etiquette for Investigators
                  </h4>
                  <ul className="space-y-2 text-xs font-serif text-[#4A3728]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#8C2D32] font-bold">&bull;</span>
                      <span><strong>Never hoard contradictory evidence:</strong> If an exhibit disproves your partner&apos;s theory, reveal it immediately. Good investigators celebrate being wrong early.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8C2D32] font-bold">&bull;</span>
                      <span><strong>Read depositions aloud:</strong> Hearing witness statements spoken aloud helps uncover hidden double meanings and emotional tension.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#8C2D32] font-bold">&bull;</span>
                      <span><strong>Synthesize before submitting checkpoints:</strong> Never submit an episode checkpoint without consulting your squad in the telegraph.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* TAB 5: CHECKPOINTS, HINTS & SCORING */}
            {activeTab === "scoring-system" && (
              <motion.div
                key="scoring-system"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8C2D32] font-bold">
                    Chapter 05 &bull; Evaluation & IQS
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1F1710] tracking-tight mt-1">
                    Checkpoints, Informants & Final Scoring
                  </h2>
                  <p className="font-serif text-sm sm:text-base text-[#523E2E] mt-1 leading-relaxed">
                    Your performance is graded by the Lalbazar Special Branch using the Investigation Quality Score (IQS).
                    Understand how checkpoints, hints, and decisive clues determine your final officer rank.
                  </p>
                </div>

                {/* Episode Checkpoints Breakdown */}
                <div className="bg-[#F2E8D5] p-5 rounded-xs border border-[#D4B26F]/80 space-y-3">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2B4C3F]" />
                    How Episode Checkpoints Work
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif text-[#3E2F23]">
                    <div className="p-3 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#2B4C3F] mb-1 uppercase">Passing (+25 Score)</div>
                      <p>Answering the checkpoint questions accurately on the first attempt rewards your squad with +25 points toward your final standing.</p>
                    </div>
                    <div className="p-3 bg-[#FAF4E8] rounded-xs border border-[#C99A3C]/40">
                      <div className="font-mono font-bold text-[#8C2D32] mb-1 uppercase">Guidance On Failure (-5 Score)</div>
                      <p>If your deduction is flawed, you receive constructive narrative guidance from Lalbazar and a modest -5 delta. You are never trapped or game-overed.</p>
                    </div>
                  </div>
                </div>

                {/* Informant Hints 3 Tiers */}
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#8C2D32]" />
                    Informant Whispers (The Three Hint Tiers)
                  </h3>
                  <p className="font-serif text-xs text-[#523E2E]">
                    When genuinely stuck, you can consult street informants. Each tier reveals deeper forensic intelligence at the cost of your final score:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase text-[#8C2D32] bg-[#FAF4E8] px-2 py-0.5 rounded-xs border border-[#C99A3C]/40">
                          Tier 1 &bull; Nudge
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mt-2 mb-1">A Subtle Hint</h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          Directs your attention to a specific exhibit, document line, or witness statement without giving the deduction away.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#D4B26F]/40 font-mono text-xs font-bold text-[#8C2D32]">
                        Penalty: -2 IQS
                      </div>
                    </div>

                    <div className="p-4 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase text-[#8C2D32] bg-[#FAF4E8] px-2 py-0.5 rounded-xs border border-[#C99A3C]/40">
                          Tier 2 &bull; Lead
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mt-2 mb-1">A Direct Lead</h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          Reveals the connection between two specific pieces of evidence or points out the exact lie in an alibi.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#D4B26F]/40 font-mono text-xs font-bold text-[#8C2D32]">
                        Penalty: -5 IQS
                      </div>
                    </div>

                    <div className="p-4 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold uppercase text-[#8C2D32] bg-[#FAF4E8] px-2 py-0.5 rounded-xs border border-[#C99A3C]/40">
                          Tier 3 &bull; Reveal
                        </span>
                        <h4 className="font-serif font-bold text-base text-[#1F1710] mt-2 mb-1">Full Breakthrough</h4>
                        <p className="font-serif text-xs text-[#523E2E] leading-relaxed">
                          Lalbazar intelligence explains the complete deductive step directly. Use only when truly halted.
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#D4B26F]/40 font-mono text-xs font-bold text-[#8C2D32]">
                        Penalty: -10 IQS
                      </div>
                    </div>
                  </div>
                </div>

                {/* Final Accusation & IQS Formula */}
                <div className="bg-[#FAF4E8] p-6 rounded-sm border-2 border-[#D4B26F]/80 space-y-4">
                  <h3 className="font-serif font-bold text-lg text-[#1F1710] uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#8C2D32]" />
                    Final Accusation & IQS Formula
                  </h3>
                  <div className="bg-[#F2E8D5] p-4 rounded-xs border border-[#C99A3C]/50 font-mono text-xs text-[#1F1710] space-y-1">
                    <div className="font-bold text-[#8C2D32] uppercase mb-1">IQS Scoring Calculation:</div>
                    <div className="flex justify-between"><span>Base Detective Clearance:</span><span className="font-bold">100 Pts</span></div>
                    <div className="flex justify-between text-[#8C2D32]"><span>Primary Culprit (Mastermind) Wrong:</span><span>-30 Pts</span></div>
                    <div className="flex justify-between text-[#8C2D32]"><span>Accomplice (Accessory) Wrong:</span><span>-20 Pts</span></div>
                    <div className="flex justify-between text-[#8C2D32]"><span>Decisive Clues Missing (3 Required):</span><span>-10 Pts each</span></div>
                    <div className="flex justify-between text-[#8C2D32]"><span>Informant Whispers Unlocked:</span><span>-2 / -5 / -10 Pts</span></div>
                    <div className="flex justify-between text-[#8C2D32]"><span>Checkpoint Retry Deductions:</span><span>-3 Pts each</span></div>
                    <div className="flex justify-between text-[#2B4C3F]"><span>Collaboration Bonus (Sharing Clues):</span><span>+3 Pts each (up to +15)</span></div>
                  </div>

                  {/* Officer Ranks */}
                  <div className="pt-2">
                    <h4 className="font-mono text-xs font-bold uppercase text-[#8C2D32] mb-2">
                      Official Department Ranks
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono text-xs">
                      <div className="p-2 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                        <div className="font-bold text-[#2B4C3F] text-base">A+</div>
                        <div className="text-[10px] text-[#523E2E]">&ge; 92 IQS</div>
                        <div className="text-[9px] text-[#8C2D32] uppercase font-bold">Master Sleuth</div>
                      </div>
                      <div className="p-2 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                        <div className="font-bold text-[#2B4C3F] text-base">A</div>
                        <div className="text-[10px] text-[#523E2E]">80 - 91 IQS</div>
                        <div className="text-[9px] text-[#8C2D32] uppercase font-bold">Senior Detective</div>
                      </div>
                      <div className="p-2 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                        <div className="font-bold text-[#C99A3C] text-base">B</div>
                        <div className="text-[10px] text-[#523E2E]">65 - 79 IQS</div>
                        <div className="text-[9px] text-[#8C2D32] uppercase font-bold">Field Inspector</div>
                      </div>
                      <div className="p-2 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                        <div className="font-bold text-[#7A614D] text-base">C</div>
                        <div className="text-[10px] text-[#523E2E]">50 - 64 IQS</div>
                        <div className="text-[9px] text-[#8C2D32] uppercase font-bold">Sub-Inspector</div>
                      </div>
                      <div className="p-2 bg-[#F4ECDE] rounded-xs border border-[#C99A3C]/40">
                        <div className="font-bold text-[#8C2D32] text-base">D</div>
                        <div className="text-[10px] text-[#523E2E]">&lt; 50 IQS</div>
                        <div className="text-[9px] text-[#8C2D32] uppercase font-bold">Patrol Cadet</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
