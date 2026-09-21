"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Target, 
  FileEdit, 
  FolderClock, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Briefcase, 
  Award, 
  Eye, 
  Compass,
  Bookmark
} from "lucide-react";
import { Detective } from "@/lib/data/detectives";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DetectiveTabsProps {
  detective: Detective;
}

type TabType = "biography" | "methodology" | "field-notes" | "case-history";

const TAB_CONFIG: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "biography", label: "BIOGRAPHY", icon: BookOpen },
  { id: "methodology", label: "METHODOLOGY", icon: Target },
  { id: "field-notes", label: "FIELD NOTES", icon: FileEdit },
  { id: "case-history", label: "CASE HISTORY", icon: FolderClock },
];

export default function DetectiveTabs({ detective }: DetectiveTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("biography");

  return (
    <Tabs 
      value={activeTab} 
      onValueChange={(v) => setActiveTab(v as TabType)}
      className="w-full mt-3 gap-0"
    >
      {/* TAB BAR (Dark Leather/Brass Tabs with Gold Outline) */}
      <TabsList 
        aria-label="Detective Dossier Tabs"
        className="w-full h-auto justify-start bg-transparent p-0 gap-2 overflow-x-auto no-scrollbar mb-2"
      >
        {TAB_CONFIG.map((tab) => {
          const isSelected = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                "relative flex items-center gap-2 px-4 sm:px-5 py-2 rounded-lg font-serif text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer outline-none select-none",
                isSelected
                  ? "bg-[#23170E] text-[#FAF4E8] border-2 border-[#C99A3C] shadow-[0_0_14px_rgba(201,154,60,0.35)] ring-1 ring-[#C99A3C]/40"
                  : "bg-[#140D08]/90 text-[#D9C7A6]/70 hover:bg-[#1E140C] hover:text-[#E8C66A] border border-[#3E2C1B]/70 shadow-sm"
              )}
            >
              <Icon className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-[#E8C66A]" : "text-[#8C6D37]")} />
              <span>{tab.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* TAB PANELS CONTAINER (Aged Manila Dossier Sheet) */}
      <div className="rounded-xl border-2 border-[#8C6D37]/50 p-5 sm:p-7 bg-gradient-to-b from-[#FAF5EC] via-[#F4EADC] to-[#EAE0CD] text-[#1E1712] shadow-[0_15px_40px_rgba(0,0,0,0.7)] min-h-[300px]">
        <AnimatePresence mode="wait">

          {/* ================= 1. BIOGRAPHY TAB ================= */}
          {activeTab === "biography" && (
            <TabsContent
              value="biography"
              forceMount
              asChild
            >
              <motion.div
                key="biography"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Left Column: Official Background Dossier Narrative (~65%) */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                  <div className="flex items-center justify-between border-b border-[#D5C6AC] pb-2">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-[#8C282C] shrink-0" />
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#4A3728] uppercase tracking-wider">
                        OFFICIAL BACKGROUND DOSSIER
                      </h3>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A6348] font-bold">
                      ARCHIVE ENTRY • LCIB
                    </span>
                  </div>

                  {/* Drop Cap Narrative Paragraphs */}
                  <div className="text-[#251A12] leading-relaxed font-serif text-sm sm:text-base space-y-3.5">
                    <p className="first-letter:float-left first-letter:text-5xl first-letter:pr-3 first-letter:font-black first-letter:text-[#8C282C] first-letter:font-serif first-letter:leading-none">
                      {detective.backstory}
                    </p>
                  </div>
                </div>

                {/* Right Column: AT A GLANCE Metrics Card (~35%) */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="p-4 sm:p-5 rounded-xl bg-[#F2E8D7]/90 border border-[#D5C6AC] shadow-xs space-y-3">
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#7A6348] border-b border-[#D5C6AC] pb-2">
                      AT A GLANCE
                    </h4>

                    <div className="space-y-2.5 font-mono text-[11px]">
                      {/* Years of Experience */}
                      <div className="flex items-start gap-2.5">
                        <Clock className="w-3.5 h-3.5 text-[#8C282C] shrink-0 mt-0.5" />
                        <div className="flex-1 flex items-baseline justify-between gap-2">
                          <span className="text-[#6E5434]">Years of Experience</span>
                          <span className="font-bold text-[#1E1712]">{detective.atAGlance.yearsExperience}</span>
                        </div>
                      </div>

                      {/* Cases Handled */}
                      <div className="flex items-start gap-2.5">
                        <Briefcase className="w-3.5 h-3.5 text-[#8C282C] shrink-0 mt-0.5" />
                        <div className="flex-1 flex items-baseline justify-between gap-2">
                          <span className="text-[#6E5434]">Cases Handled</span>
                          <span className="font-bold text-[#1E1712]">{detective.atAGlance.casesHandled}</span>
                        </div>
                      </div>

                      {/* Success Rate */}
                      <div className="flex items-start gap-2.5">
                        <Award className="w-3.5 h-3.5 text-[#8C282C] shrink-0 mt-0.5" />
                        <div className="flex-1 flex items-baseline justify-between gap-2">
                          <span className="text-[#6E5434]">Success Rate</span>
                          <span className="font-bold text-[#1E1712]">{detective.atAGlance.successRate}</span>
                        </div>
                      </div>

                      {/* Known For */}
                      <div className="flex items-start gap-2.5">
                        <Eye className="w-3.5 h-3.5 text-[#8C282C] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-[#6E5434] block">Known For</span>
                          <span className="font-serif font-bold text-xs text-[#1E1712] leading-tight block mt-0.5">
                            {detective.atAGlance.knownFor}
                          </span>
                        </div>
                      </div>

                      {/* Approach */}
                      <div className="flex items-start gap-2.5 pt-1 border-t border-[#D5C6AC]/70">
                        <Compass className="w-3.5 h-3.5 text-[#8C282C] shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-[#6E5434] block">Approach</span>
                          <span className="font-serif font-bold text-xs text-[#8C282C] leading-tight block mt-0.5">
                            {detective.atAGlance.approach}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            </TabsContent>
          )}

          {/* ================= 2. METHODOLOGY TAB ================= */}
          {activeTab === "methodology" && (
            <TabsContent
              value="methodology"
              forceMount
              asChild
            >
              <motion.div
                key="methodology"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#D5C6AC] pb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#8C282C] shrink-0" />
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#4A3728] uppercase tracking-wider">
                      INVESTIGATIVE METHODOLOGY & TACTICAL STRENGTHS
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A6348] font-bold">
                    TACTICAL RATINGS
                  </span>
                </div>

                {/* Specialties Badges */}
                <div>
                  <h4 className="font-mono text-[10.5px] font-bold uppercase text-[#7A6348] tracking-wider mb-2.5">
                    PRIMARY FIELD SPECIALTIES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {detective.specialties.map((spec, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="px-3 py-1 rounded-lg bg-[#FAF5EB] border-[#C9B799] text-[#2A1E14] font-serif text-xs font-semibold shadow-2xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8C282C] shrink-0" />
                        <span>{spec}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cognitive & Field Strengths Bars */}
                <div>
                  <h4 className="font-mono text-[10.5px] font-bold uppercase text-[#7A6348] tracking-wider mb-3">
                    COGNITIVE & FIELD ATTRIBUTES
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {detective.strengths.map((st, i) => (
                      <div key={i} className="p-3 rounded-lg bg-[#FAF5EB] border border-[#C9B799] shadow-2xs">
                        <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                          <span className="font-serif font-bold text-[#1E1712] text-xs sm:text-sm">{st.label}</span>
                          <span className="font-bold text-[#8C282C]">{st.value}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#E0D2BC] overflow-hidden p-[1px] border border-[#C9B799]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${st.value}%` }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-[#96733B] via-[#C99A3C] to-[#E8C66A]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* ================= 3. FIELD NOTES TAB ================= */}
          {activeTab === "field-notes" && (
            <TabsContent
              value="field-notes"
              forceMount
              asChild
            >
              <motion.div
                key="field-notes"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 max-w-3xl"
              >
                <div className="flex items-center justify-between border-b border-[#D5C6AC] pb-2">
                  <div className="flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-[#8C282C] shrink-0" />
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#4A3728] uppercase tracking-wider">
                      HANDWRITTEN FIELD JOURNAL EXCERPT
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A6348] font-bold">
                    CONFIDENTIAL LOG
                  </span>
                </div>

                {/* Weathered Lined Notebook Memo */}
                <div className="relative p-6 sm:p-7 rounded-xl bg-[#FFFDF7] border-2 border-[#D1C2A5] shadow-md overflow-hidden">
                  <div className="absolute inset-0 opacity-25 pointer-events-none bg-[linear-gradient(#C9B799_1px,transparent_1px)] [background-size:100%_28px] mt-8" />
                  <div className="absolute top-0 bottom-0 left-10 w-[1px] bg-[#A84743]/35 pointer-events-none" />

                  <div className="pl-6 space-y-4 relative z-10">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#7A6348] border-b border-[#E0D2BC] pb-1">
                      <span>CASEBOOK LOG • ENTRY #{detective.fileNo}</span>
                      <span>KOLKATA • MIDNIGHT SHIFT</span>
                    </div>

                    <p className="font-serif italic text-base sm:text-lg text-[#1E1712] leading-relaxed">
                      &ldquo;{detective.fieldNoteQuote}&rdquo;
                    </p>

                    <div className="pt-3 flex items-end justify-between border-t border-[#E0D2BC]">
                      <div className="font-mono text-[9px] text-[#7A6348]">
                        <span className="text-[#8C282C] font-bold">RESTRICTED DOSSIER • DO NOT CIRCULATE</span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-[#3A2418] italic block">
                          — {detective.name}
                        </span>
                        <span className="font-mono text-[8.5px] text-[#7A6348] uppercase tracking-widest">
                          {detective.role}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* ================= 4. CASE HISTORY TAB ================= */}
          {activeTab === "case-history" && (
            <TabsContent
              value="case-history"
              forceMount
              asChild
            >
              <motion.div
                key="case-history"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-[#D5C6AC] pb-2">
                  <div className="flex items-center gap-2">
                    <FolderClock className="w-4 h-4 text-[#8C282C] shrink-0" />
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#4A3728] uppercase tracking-wider">
                      INVESTIGATION SERVICE DOCKET
                    </h3>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#7A6348] font-bold">
                    SERVICE RECORDS
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#FAF4E8] border border-[#C99A3C]/70 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#6B1E22] text-[#FAF4E8] font-mono text-[9.5px]">
                          CASE 001
                        </Badge>
                        <span className="font-serif font-bold text-sm text-[#1E1712]">
                          The Last Ferry
                        </span>
                      </div>
                      <p className="text-xs text-[#524130] font-serif italic">
                        River Ghat mystery at Bhairavi Ghat. Status: Active Investigation Docket.
                      </p>
                    </div>
                    <Badge className="bg-[#EAE0CD] text-[#523C1A] border border-[#C99A3C]/50 font-mono text-[9.5px] uppercase font-bold">
                      Assigned Investigator
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EFE6D2]/60 border border-[#D5C6AC] opacity-80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#4A3824] text-[#E0D2BC] font-mono text-[9px]">
                          CASE 002
                        </Badge>
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#4A3824]">
                          The College Street Ledger
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E5434] font-serif italic">
                        Antiquarian book district embezzlement. Case file under municipal sealing.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#7A6348] font-bold uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Sealed Docket</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#EFE6D2]/60 border border-[#D5C6AC] opacity-80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-[#4A3824] text-[#E0D2BC] font-mono text-[9px]">
                          CASE 003
                        </Badge>
                        <span className="font-serif font-bold text-xs sm:text-sm text-[#4A3824]">
                          Midnight at the Great Eastern
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6E5434] font-serif italic">
                        Colonial hotel ballroom poisoning. Archived awaiting forensic lead review.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#7A6348] font-bold uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Sealed Docket</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          )}

        </AnimatePresence>
      </div>

    </Tabs>
  );
}
