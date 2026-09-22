"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Clock,
  Users,
  MapPin,
  Target,
  Play,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { THE_LAST_FERRY_CASE } from "@/lib/data/cases/the-last-ferry";

export default function TheLastFerryCasePage() {
  const router = useRouter();
  const [customRoomCode, setCustomRoomCode] = useState("");

  const handleStartSolo = () => {
    const soloRoomCode = `SOLO-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/room/${soloRoomCode}/investigation/ep1`);
  };

  const handleJoinSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (customRoomCode.trim()) {
      router.push(`/room/${customRoomCode.trim().toUpperCase()}/investigation/ep1`);
    }
  };

  const caseData = THE_LAST_FERRY_CASE;

  return (
    <div className="min-h-screen w-full bg-[#0D0906] text-[#FAF4E8] py-8 px-4 sm:px-8 relative font-serif">
      {/* Background Atmosphere Layers */}
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-25 brightness-[0.7]"
        style={{ backgroundImage: "url('/cases/the-last-ferry/scene_deck_night.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(10,7,5,0.92)_100%)]" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#D9C7A6]/70">
          <Link href="/cases" className="hover:text-[#E8C66A] transition-colors">
            Case Desk
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="text-[#E8C66A] font-bold">Case 001: The Last Ferry</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Folder (Left & Right Pages) */}
          <div className="flex-1 bg-[#FAF4E8] text-[#1F1710] shadow-[0_25px_70px_rgba(0,0,0,0.85)] rounded-sm flex flex-col md:flex-row border-2 border-[#C99A3C]/60 overflow-hidden relative">
            {/* Vertical Folder Crease */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-transparent via-black/10 to-transparent z-20 pointer-events-none" />

            {/* Left Page (Briefing & Context) */}
            <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-[#D4B26F]/60 relative bg-[#F7EFE2] bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
              <div className="mb-2 font-mono text-[#8C2D32] font-bold tracking-widest text-xs">
                OFFICIAL RECORD &bull; CASE 001
              </div>
              <h1 className="font-serif text-3xl md:text-5xl font-black mb-4 text-[#1F1710] leading-tight">
                The Last Ferry
              </h1>

              <div className="inline-block px-3 py-1 bg-[#241A13] text-[#E8C66A] font-mono text-xs uppercase tracking-widest mb-6 border border-[#C99A3C]/40">
                STATUS: ACTIVE INVESTIGATION
              </div>

              {/* Case Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6 text-xs font-sans font-medium text-[#4A3728] bg-[#EFE3CF] p-4 rounded-xs border border-[#C99A3C]/30">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#8C2D32]" />
                  <span>Difficulty: Intermediate</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8C2D32]" />
                  <span>45-60 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8C2D32]" />
                  <span>Solo / Duo / Squad</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#8C2D32]" />
                  <span>Nabadwip Ghat, Monsoon</span>
                </div>
              </div>

              {/* Case Attached Photograph */}
              <div className="w-full aspect-[16/10] relative mb-6 border-4 border-white shadow-lg transform -rotate-1 hover:rotate-0 transition-transform bg-[#120D09] overflow-hidden">
                <Image
                  src="/cases/the-last-ferry/scene_deck_night.jpg"
                  alt="MV Sonartori Ferry at Night"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover contrast-[1.1] sepia-[0.2]"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-[#E8C66A] font-mono text-[10px] tracking-wider uppercase">
                  EXHIBIT PHOTO: MV SONARTORI
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold mb-2 text-[#1F1710]">
                Case Incident Premise
              </h3>
              <p className="font-serif text-sm leading-relaxed text-[#3D2C20]">
                {caseData.premise}
              </p>
            </div>

            {/* Right Page (Victim, Suspects & Episodes) */}
            <div className="flex-1 p-6 md:p-10 relative bg-[#F7EFE2] bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
              {/* Victim Profile */}
              <h3 className="font-serif text-lg font-bold mb-3 text-[#1F1710] border-b border-[#D4B26F]/60 pb-1 flex items-center justify-between">
                <span>Victim Profile</span>
                <span className="text-xs font-mono text-[#8C2D32] uppercase">
                  MISSING PERSON
                </span>
              </h3>
              <div className="bg-[#EFE3CF] p-3.5 rounded-xs border border-[#D4B26F] mb-6 flex gap-4 items-center">
                <div className="relative w-16 h-18 rounded-xs overflow-hidden border border-[#241A13] shrink-0 bg-[#120D09]">
                  <Image
                    src={caseData.victim.avatar}
                    alt={caseData.victim.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-bold font-serif text-lg text-[#1F1710] leading-tight">
                    {caseData.victim.name}
                  </div>
                  <div className="text-xs text-[#594333] font-mono">
                    Senior Municipal Accountant &bull; 34 yrs
                  </div>
                  <p className="text-xs font-serif text-[#3D2C20] italic mt-1 line-clamp-2">
                    &ldquo;{caseData.victim.statementSnippet}&rdquo;
                  </p>
                </div>
              </div>

              {/* Persons of Interest */}
              <h3 className="font-serif text-lg font-bold mb-3 text-[#1F1710] border-b border-[#D4B26F]/60 pb-1">
                Persons of Interest on File
              </h3>
              <ul className="space-y-2 mb-6">
                {caseData.cast
                  .filter((c) => c.role !== "Victim")
                  .map((person) => (
                    <li
                      key={person.id}
                      className="flex justify-between items-center text-xs font-serif border-b border-dashed border-[#D4B26F]/60 pb-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1F1710]">{person.name}</span>
                        <span className="text-[10px] font-mono text-[#665040]">
                          ({person.function})
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-xs ${
                          person.role === "Suspect"
                            ? "bg-[#702428] text-[#FAF4E8]"
                            : person.role === "Witness"
                            ? "bg-[#2B4C3F] text-[#E0F2E9]"
                            : "bg-[#3D2C20] text-[#D9C7A6]"
                        }`}
                      >
                        {person.role}
                      </span>
                    </li>
                  ))}
              </ul>

              {/* 5 Canonical Episodes Progression */}
              <h3 className="font-serif text-lg font-bold mb-3 text-[#1F1710] border-b border-[#D4B26F]/60 pb-1">
                Investigation Chapters
              </h3>
              <div className="space-y-2.5">
                {caseData.episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="flex items-center justify-between p-2.5 bg-[#FAF4E8] rounded-xs border border-[#D4B26F]/50 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#241A13] text-[#E8C66A] font-mono text-[10px] font-bold flex items-center justify-center">
                        {ep.episodeNumber}
                      </span>
                      <div>
                        <span className="font-serif font-bold text-[#1F1710] block">
                          {ep.title}
                        </span>
                        <span className="font-serif text-[11px] text-[#665040] italic">
                          {ep.subtitle}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] text-[#8C2D32] uppercase font-bold">
                      {ep.clues.length} Exhibits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Action Panel */}
          <div className="w-full lg:w-80 flex flex-col gap-5">
            <div className="bg-[#1C140E] p-6 rounded-sm border-2 border-[#C99A3C]/40 shadow-2xl relative text-[#FAF4E8]">
              <div className="w-10 h-10 -mt-10 mx-auto rounded-full bg-[#8C2D32] text-[#FAF4E8] border-2 border-[#C99A3C] flex items-center justify-center shadow-lg font-bold font-serif">
                !
              </div>
              <h3 className="font-serif text-xl font-bold mb-4 text-center mt-2 text-[#E8C66A]">
                Begin Investigation
              </h3>

              <div className="space-y-4">
                {/* Solo Play Launcher */}
                <button
                  onClick={handleStartSolo}
                  className="w-full py-3 px-4 rounded-xs bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] font-serif font-bold text-xs uppercase tracking-widest border border-[#C99A3C] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Solo Investigation</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#3D2C20]" />
                  <span className="flex-shrink mx-2 font-mono text-[10px] text-[#D9C7A6]/50 uppercase">
                    OR MULTIPLAYER SQUAD
                  </span>
                  <div className="flex-grow border-t border-[#3D2C20]" />
                </div>

                {/* Squad Room Form */}
                <form onSubmit={handleJoinSquad} className="space-y-2">
                  <input
                    type="text"
                    value={customRoomCode}
                    onChange={(e) => setCustomRoomCode(e.target.value)}
                    placeholder="Enter Squad Room Code..."
                    className="w-full p-2.5 bg-[#120D09] border border-[#C99A3C]/40 rounded-xs text-xs font-mono text-[#FAF4E8] uppercase placeholder:normal-case placeholder:italic"
                  />
                  <button
                    type="submit"
                    disabled={!customRoomCode.trim()}
                    className="w-full py-2.5 px-4 rounded-xs bg-[#241A13] hover:bg-[#332216] disabled:opacity-40 text-[#E8C66A] font-serif text-xs uppercase tracking-wider font-bold border border-[#C99A3C]/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Enter Squad Room</span>
                  </button>
                </form>

                <Link href="/room/create" className="block text-center">
                  <span className="font-mono text-xs text-[#D9C7A6]/80 hover:text-[#E8C66A] underline">
                    Create New Room in Room Hub &rarr;
                  </span>
                </Link>
              </div>

              {/* Notes */}
              <div className="mt-6 pt-5 border-t border-[#3D2C20] text-xs font-mono text-[#D9C7A6]/70 space-y-2">
                <div className="flex items-center gap-2 text-[#E8C66A]">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="font-bold">Asymmetric Evidence Active</span>
                </div>
                <p className="font-serif text-[11px] leading-relaxed">
                  In Squad mode, clues are private to each detective until pinned to the Shared Caseboard or shared via Squad Telegraph.
                </p>
              </div>
            </div>

            {/* Case Dossier Notes Card */}
            <div className="bg-[#18110C] p-5 rounded-sm border border-[#C99A3C]/20 text-[#D9C7A6]">
              <h4 className="font-serif font-bold text-sm text-[#E8C66A] mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-[#8C2D32]" />
                Forensic Directive
              </h4>
              <p className="font-serif text-xs leading-relaxed text-[#D9C7A6]/80">
                Inspect Seat 14 with utmost scrutiny. The condition of items left behind contradicts official claims of an accidental fall into the river.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
