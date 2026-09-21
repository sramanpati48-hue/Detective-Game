"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Clock, 
  Search, 
  Bell, 
  Settings, 
  ArrowRight, 
  Star,
  FileText, 
  Compass, 
  Lock,
  UserPlus,
  Check,
  Shield,
  Fingerprint,
  Upload,
  RefreshCw,
  Gauge,
  Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "sonner";

const ACCOUNT_EMBLEMS = [
  {
    id: "monogram",
    label: "Monogram Seal",
    subtitle: "Embossed Brass",
    description: "Custom brass medallion stamped with your personal initials.",
  },
  {
    id: "silhouette",
    label: "Shadow Sleuth",
    subtitle: "Kolkata Noir",
    description: "Atmospheric trench & fedora silhouette in streetlamp mist.",
  },
  {
    id: "magnifier",
    label: "Brass Loupe",
    subtitle: "Surveyor's Lens",
    description: "Precision magnifying glass over antique river street grid.",
  },
  {
    id: "fingerprint",
    label: "Dactyloscopy",
    subtitle: "Latent Print",
    description: "Forensic copper powder whorl pattern on archival stock.",
  },
  {
    id: "compass",
    label: "Compass Rose",
    subtitle: "Hooghly Meridian",
    description: "Eight-point mariner's dial for navigating city alleys.",
  },
  {
    id: "stamp",
    label: "Special Branch",
    subtitle: "Archival Seal",
    description: "Official Lalbazar Department ink stamp authentication mark.",
  },
];

function getInitials(name: string): string {
  if (!name || !name.trim()) return "SY";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AccountEmblemView({
  type,
  displayName = "Snehansh Yadav",
  customPhoto = null,
  className = "",
}: {
  type: string;
  displayName?: string;
  customPhoto?: string | null;
  className?: string;
}) {
  const initials = getInitials(displayName);

  // Custom photo upload
  if (type === "custom" && customPhoto) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden bg-[#140E0A] flex items-center justify-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customPhoto}
          alt={displayName}
          className="w-full h-full object-cover object-top sepia-[0.35] contrast-[1.1] brightness-[0.95]"
        />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_45%,_rgba(20,14,10,0.65)_100%)]" />
        <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-[#1F1710]/90 border border-[#C99A3C]/50 text-[7px] font-mono text-[#E8C66A] tracking-wider uppercase font-semibold">
          Registry Photo
        </div>
      </div>
    );
  }

  // Monogram Seal (Embossed brass medallion with player's initials)
  if (type === "monogram") {
    return (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-[#2B1B10] via-[#1A110A] to-[#0E0906] text-[#FAF6EE] select-none", className)}>
        <div className="absolute inset-1.5 rounded-full border border-[#96733B]/40 opacity-70" />
        <div className="absolute inset-2.5 rounded-full border border-dashed border-[#C99A3C]/35 opacity-60" />
        
        <div className="relative w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-[#E6C687] via-[#B88C43] to-[#6A4B1A] p-[2.5px] shadow-[0_4px_14px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#22160C] via-[#2D1F13] to-[#170E08] border border-[#C99A3C]/60 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <span className="font-mono text-[6.5px] xl:text-[7px] text-[#C99A3C]/80 tracking-[0.2em] uppercase font-bold absolute top-1">
              LALBAZAR
            </span>
            <span className="font-serif font-black text-xl xl:text-2xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2D4] via-[#E8C66A] to-[#A87B2E] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] tracking-wider">
              {initials}
            </span>
            <span className="font-mono text-[6px] xl:text-[6.5px] text-[#A88648] tracking-widest uppercase font-semibold absolute bottom-1">
              BUREAU 1974
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Shadow Sleuth Silhouette
  if (type === "silhouette") {
    return (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1E140D] via-[#120B07] to-[#080503] overflow-hidden select-none", className)}>
        <div className="absolute top-1 w-28 h-28 rounded-full bg-[radial-gradient(circle,_rgba(240,180,75,0.35)_0%,_rgba(180,120,40,0.1)_50%,_transparent_75%)] pointer-events-none" />
        <svg viewBox="0 0 100 100" className="w-20 h-20 xl:w-24 xl:h-24 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] z-10" fill="none">
          <path d="M15 48 C25 46, 75 46, 85 48 C88 48.5, 87 51, 80 51 C65 51, 35 51, 20 51 C13 51, 12 48.5, 15 48 Z" fill="#0A0604" />
          <path d="M30 48 C32 30, 42 22, 50 22 C58 22, 68 30, 70 48 Z" fill="#0D0805" />
          <path d="M30 43 C40 41, 60 41, 70 43 L70 47 C60 45, 40 45, 30 47 Z" fill="#8A2B2B" opacity="0.85" />
          <path d="M22 92 C24 70, 36 62, 50 62 C64 62, 76 70, 78 92 Z" fill="#0A0604" />
          <path d="M38 62 L50 78 L62 62 Z" fill="#C99A3C" opacity="0.4" />
          <path d="M46 78 L50 88 L54 78 Z" fill="#8A2B2B" opacity="0.8" />
        </svg>
        <span className="font-serif italic text-[8.5px] text-[#C99A3C]/75 tracking-widest z-10 -mt-0.5">
          SHADOW SLEUTH
        </span>
      </div>
    );
  }

  // Surveyor's Magnifier
  if (type === "magnifier") {
    return (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#24170E] via-[#160E08] to-[#0A0604] overflow-hidden select-none", className)}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C99A3C_1px,transparent_1px)] [background-size:10px_10px]" />
        <div className="relative w-15 h-15 xl:w-18 xl:h-18 rounded-full bg-gradient-to-br from-[#D9B46A] via-[#9E7333] to-[#5C3F18] p-[2.5px] shadow-[0_4px_16px_rgba(0,0,0,0.85)] flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#18110B]/90 border border-[#C99A3C]/40 flex items-center justify-center relative overflow-hidden backdrop-blur-xs">
            <Search className="w-7 h-7 text-[#E8C66A] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
            <div className="absolute top-1 left-2 w-5 h-2 rounded-full bg-white/20 -rotate-45 pointer-events-none" />
          </div>
        </div>
        <span className="font-mono text-[8px] text-[#D9C7A6]/80 tracking-widest uppercase mt-1">
          BRASS LOUPE
        </span>
      </div>
    );
  }

  // Forensic Fingerprint Pattern
  if (type === "fingerprint") {
    return (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#22160E] via-[#160E09] to-[#0B0704] select-none", className)}>
        <div className="relative p-2 rounded-xl border border-[#C99A3C]/30 bg-[#140D08]/90 shadow-inner flex flex-col items-center">
          <Fingerprint className="w-9 h-9 xl:w-11 xl:h-11 text-[#D4A559] stroke-[1.4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" />
          <span className="font-mono text-[7px] text-[#A68352] tracking-widest uppercase mt-0.5 font-bold">
            LATENT #074
          </span>
        </div>
        <span className="font-serif italic text-[8px] text-[#C99A3C]/70 tracking-wider mt-0.5">
          DACTYLOSCOPY
        </span>
      </div>
    );
  }

  // Kolkata Compass Rose
  if (type === "compass") {
    return (
      <div className={cn("relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#25180F] via-[#180F0A] to-[#0C0805] select-none", className)}>
        <div className="relative w-15 h-15 xl:w-18 xl:h-18 rounded-full border border-[#C99A3C]/50 bg-[#140D08]/80 flex items-center justify-center shadow-lg">
          <div className="absolute -top-1 font-mono text-[6.5px] font-bold text-[#E8C66A]">N</div>
          <div className="absolute -bottom-1 font-mono text-[6.5px] font-bold text-[#A87B2E]">S</div>
          <div className="absolute -left-1 font-mono text-[6.5px] font-bold text-[#A87B2E]">W</div>
          <div className="absolute -right-1 font-mono text-[6.5px] font-bold text-[#A87B2E]">E</div>
          <Compass className="w-8 h-8 text-[#E8C66A] stroke-[1.6]" />
        </div>
        <span className="font-mono text-[8px] text-[#D9C7A6]/80 tracking-widest uppercase mt-1">
          HOOGHLY DIAL
        </span>
      </div>
    );
  }

  // Archival Special Branch Rubber Stamp
  return (
    <div className={cn("relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#24150F] via-[#170E0A] to-[#0C0705] p-2 select-none", className)}>
      <div className="w-15 h-15 xl:w-17 xl:h-17 rounded-full border-2 border-dashed border-[#A83838] bg-[#1B0C0A]/60 flex flex-col items-center justify-center transform -rotate-6 shadow-md">
        <Shield className="w-4 h-4 text-[#C94A4A] mb-0.5" />
        <span className="font-mono font-bold text-[6.5px] text-[#E07A7A] tracking-wider uppercase">
          SPECIAL
        </span>
        <span className="font-mono font-black text-[7.5px] text-[#FAF6EE] tracking-widest uppercase">
          BRANCH
        </span>
      </div>
      <span className="font-serif italic text-[8px] text-[#D98282] tracking-wider mt-1">
        REGISTRY SEAL
      </span>
    </div>
  );
}

// --- SINGLE CASE INITIAL LAUNCH (ADDITIONAL CASES WILL BE ADDED LATER) ---
const CASES = [
  {
    id: "001",
    code: "CASE 001",
    title: "The Last Ferry",
    location: "River Ghat",
    stars: 2,
    players: "1 Player",
    playTime: "45 - 60 mins",
    image: "/cases/case_001.png",
    briefImage: "/cases/case_brief_ferry.png",
    quote: "Some departures aren't on time.",
    description:
      "A ferry leaves every night. But someone never returns. As the river keeps its silence, you'll need to follow the clues before the next departure.",
    slug: "the-last-ferry",
    isPlayable: true,
  },
];

const BRIEF_TABS = [
  { id: "overview", label: "Overview", icon: FileText },
];

export default function CasesHub() {
  const [activeCaseId, setActiveCaseId] = useState("001");
  const [activeBriefTab, setActiveBriefTab] = useState("overview");
  const [lockedToast, setLockedToast] = useState<string | null>(null);
  const [showTeaToast, setShowTeaToast] = useState(false);

  // Dynamic Investigator Permanent Platform Account State
  const [userProfile, setUserProfile] = useState({
    name: "Snehansh Yadav",
    badgeId: "ID #409",
    rankTitle: "Registered Investigator",
    motto: "Questions find better places than answers.",
    emblemType: "monogram",
    customPhoto: null as string | null,
    level: 7,
    casesSolved: 12,
    ongoing: 3,
    badges: 5,
    reputation: 780,
    mostPlayedDetective: "Arjun Mukherjee",
  });

  const [showCreateProfileModal, setShowCreateProfileModal] = useState(false);
  const [newProfileForm, setNewProfileForm] = useState({
    name: "Snehansh Yadav",
    badgeId: "ID #409",
    motto: "Questions find better places than answers.",
    emblemType: "monogram",
    customPhoto: null as string | null,
  });

  const generateRandomBadgeId = () => `ID #${Math.floor(100 + Math.random() * 900)}`;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewProfileForm((prev) => ({
          ...prev,
          emblemType: "custom",
          customPhoto: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Restore saved account profile on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bhorer_investigator_account") || localStorage.getItem("bhorer_detective_profile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setUserProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          badgeId: parsed.badgeId || parsed.idBadge || prev.badgeId,
          motto: parsed.motto || parsed.quote || prev.motto,
          emblemType: parsed.emblemType || (parsed.image?.startsWith("data:") ? "custom" : "monogram"),
          customPhoto: parsed.customPhoto || (parsed.image?.startsWith("data:") ? parsed.image : null),
          rankTitle: parsed.rankTitle || "Registered Investigator",
          level: parsed.level ?? prev.level,
          casesSolved: parsed.casesSolved ?? prev.casesSolved,
          ongoing: parsed.ongoing ?? prev.ongoing,
          badges: parsed.badges ?? prev.badges,
          reputation: parsed.reputation ?? prev.reputation,
          mostPlayedDetective: parsed.mostPlayedDetective || "Arjun Mukherjee",
        }));
      }
    } catch (e) {
      console.error("Failed to load investigator account:", e);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileForm.name.trim()) return;

    const updated = {
      ...userProfile,
      name: newProfileForm.name.trim(),
      badgeId: newProfileForm.badgeId.trim() || "ID #409",
      motto: newProfileForm.motto.trim() || "Questions find better places than answers.",
      emblemType: newProfileForm.emblemType,
      customPhoto: newProfileForm.customPhoto,
      rankTitle: "Registered Investigator",
    };
    setUserProfile(updated);
    try {
      localStorage.setItem("bhorer_investigator_account", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save investigator account:", e);
    }
    setShowCreateProfileModal(false);
    toast.success("Investigator Dossier Registered", {
      description: `${updated.name} on duty • ${updated.badgeId}`,
      icon: <Shield className="w-4 h-4 text-[#C99A3C]" />
    });
    setLockedToast(`✓ Investigator Dossier Registered: ${updated.name} on duty.`);
    setTimeout(() => setLockedToast(null), 3500);
  };

  const activeCase = CASES.find((c) => c.id === activeCaseId) || CASES[0];

  const handleCaseSelect = (caseItem: (typeof CASES)[0]) => {
    setActiveCaseId(caseItem.id);
    if (!caseItem.isPlayable) {
      setLockedToast(`${caseItem.title} is locked. Complete Case 001 to unlock.`);
      setTimeout(() => setLockedToast(null), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0906] text-[#F8F2E7] flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* 1. PHOTOREALISTIC ATMOSPHERIC DETECTIVE DESK ENVIRONMENT */}
      {/* Crisp Background Fitted Exactly to Window Bounds */}
      <div 
        className="absolute inset-0 bg-[length:100%_100%] bg-no-repeat pointer-events-none z-0 brightness-[0.94] contrast-[1.05]"
        style={{ backgroundImage: "url('/cases/cases_desk_bg.jpg')" }}
      />
      
      {/* Warm Ambient Spotlight from the top lamp */}
      <div className="absolute top-0 right-[22%] w-[680px] h-[520px] bg-[radial-gradient(ellipse_at_top,_rgba(240,180,75,0.18)_0%,_rgba(180,120,40,0.06)_50%,_transparent_75%)] pointer-events-none z-0 animate-lamp-glow" />
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_58%,_rgba(10,6,4,0.72)_100%)]" />

      {/* STEAMING CHAI EASTER EGG OVERLAY (Bottom Right Foreground) */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            onClick={() => {
              setShowTeaToast(true);
              toast("Kolkata Spiced Chai", {
                description: "সত্য এখনও অপেক্ষায় — Truth is still waiting.",
                icon: <Coffee className="w-4 h-4 text-[#C99A3C]" />
              });
            }}
            className="absolute bottom-5 right-[24%] z-30 cursor-pointer group flex flex-col items-center pointer-events-auto"
          >
            <div className="relative w-6 h-12 flex justify-center pointer-events-none">
              <div className="w-1 h-5 bg-gradient-to-t from-white/35 to-transparent rounded-full animate-steam-1 absolute" />
              <div className="w-1 h-6 bg-gradient-to-t from-white/30 to-transparent rounded-full animate-steam-2 absolute left-1" />
              <div className="w-1 h-4 bg-gradient-to-t from-white/25 to-transparent rounded-full animate-steam-3 absolute right-1" />
            </div>
            {showTeaToast && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-12 px-3 py-1.5 rounded-md bg-[#1B140E]/95 border border-[#C99A3C]/70 shadow-xl backdrop-blur-md text-[11px] font-serif text-[#F2E3C6] whitespace-nowrap z-50"
                onAnimationComplete={() => setTimeout(() => setShowTeaToast(false), 3000)}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-[#C99A3C] shrink-0" />
                  <em>সত্য এখনও অপেক্ষায়</em> — Truth is still waiting.
                </span>
              </motion.div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#1C140E] text-[#F2E3C6] border-[#C99A3C]/60 text-xs font-serif">
          Hot Kolkata Spiced Chai • Click to sip
        </TooltipContent>
      </Tooltip>

      {/* LOCKED CASE NOTIFICATION TOAST */}
      <AnimatePresence>
        {lockedToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-[#241712]/95 border-2 border-[#A84743] text-[#FAF6EE] shadow-2xl backdrop-blur-md flex items-center gap-2.5 font-serif text-xs"
          >
            <Lock className="w-4 h-4 text-[#E55B5B]" />
            <span>{lockedToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP HEADER */}
      <header className="relative z-20 flex justify-between items-start px-6 lg:px-8 pt-2.5 pb-0.5 shrink-0">
        <div className="flex flex-col">
          <Link href="/" className="group inline-flex items-center gap-3">
            <h1 className="font-serif text-3xl md:text-4xl text-[#E8C66A] tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] font-bold transition-colors group-hover:text-[#F2E3C6]">
              BHORER SHAHAR
            </h1>
          </Link>
          <div className="flex items-center gap-2.5 mt-0.5">
            <p className="font-serif text-xs tracking-[0.35em] text-[#D9C7A6] uppercase font-semibold">Case Files</p>
            <span className="text-[#A84743] opacity-60">•</span>
            <p className="text-[11px] text-[#A84743] font-mono italic opacity-90 drop-shadow-sm">
              Some cities never sleep. They just hide their secrets.
            </p>
          </div>
        </div>

        {/* SEARCH & CONTROLS */}
        <div className="flex flex-col items-end gap-1 pt-0.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-[#1c140e]/95 border border-[#C99A3C]/40 px-3.5 py-1.5 rounded-md shadow-inner backdrop-blur-xs">
              <Search className="w-3.5 h-3.5 text-[#D9C7A6]/70 mr-2.5" />
              <input 
                type="text" 
                placeholder="Search cases, locations..." 
                className="bg-transparent border-none outline-none text-xs text-[#EAE1D1] placeholder:text-[#D9C7A6]/40 w-44 font-mono"
              />
            </div>

            {/* CREATE PROFILE OPTION IN THE TOP */}
            {/* CREATE INVESTIGATOR ACCOUNT OPTION IN THE TOP */}
            <button 
              onClick={() => {
                setNewProfileForm({
                  name: userProfile.name,
                  badgeId: userProfile.badgeId,
                  motto: userProfile.motto,
                  emblemType: userProfile.emblemType,
                  customPhoto: userProfile.customPhoto,
                });
                setShowCreateProfileModal(true);
              }}
              className="group flex items-center gap-1.5 bg-gradient-to-r from-[#702428] via-[#852C32] to-[#702428] hover:from-[#852C32] hover:to-[#96333A] text-[#FAF6EE] px-3.5 py-1.5 rounded-md border border-[#C99A3C]/70 shadow-[0_2px_8px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] font-serif text-xs font-bold tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
              title="Register or update your permanent investigator account"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#E8C66A] group-hover:scale-110 transition-transform" />
              <span>Create Account</span>
            </button>

            <button className="relative p-2 text-[#D9C7A6] hover:text-[#E8C66A] transition-colors bg-[#1c140e]/95 border border-[#C99A3C]/40 rounded-md shadow-xs cursor-pointer" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#A84743] rounded-full shadow-[0_0_6px_#A84743]" />
            </button>
            <button className="p-2 text-[#D9C7A6] hover:text-[#E8C66A] transition-colors bg-[#1c140e]/95 border border-[#C99A3C]/40 rounded-md shadow-xs cursor-pointer" aria-label="Settings">
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <p className="font-serif italic text-[10px] text-[#E8C66A]/75 tracking-wider pr-1">
            Same Streets. New Secrets.
          </p>
        </div>
      </header>

      {/* MAIN 3-COLUMN DESK INTERFACE (Anchored with room at bottom so desk props & chai are fully visible) */}
      <main className="h-[calc(100vh-210px)] min-h-[460px] max-h-[620px] flex px-4 md:px-6 lg:px-8 gap-3.5 lg:gap-4.5 relative z-10 pt-1 max-w-[1900px] mx-auto w-full">
        
        {/* ================= COLUMN 1: INVESTIGATOR CLIPBOARD DOSSIER ================= */}
        <aside className="w-[230px] lg:w-[245px] xl:w-[260px] flex-shrink-0 flex flex-col pt-3.5">
          <motion.div 
            initial={false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E5D7BF] text-[#1E1712] rounded-xl p-2.5 xl:p-3 relative shadow-[0_20px_45px_rgba(0,0,0,0.9)] border-2 border-[#C2B092] flex flex-col gap-2 overflow-visible"
          >
            {/* Vintage Metal Binder Clamp */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
              <div className="w-12 h-3.5 border-2 border-[#9C7A4A] rounded-t-full bg-gradient-to-b from-[#FAF4E8]/20 to-transparent shadow-xs mb-[-2px]" />
              <div className="w-20 h-4.5 bg-gradient-to-b from-[#B89352] via-[#7D5F30] to-[#423118] rounded-xs shadow-[0_3px_8px_rgba(0,0,0,0.7)] border border-[#D4B578]/80 flex items-center justify-between px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#241A0E] border border-[#523C1E] shadow-inner" />
                <div className="h-1 w-11 bg-[#1F150B]/80 rounded-full" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#241A0E] border border-[#523C1E] shadow-inner" />
              </div>
            </div>

            {/* Polaroid Photo Frame (Account Emblem or Uploaded Photograph) */}
            <div 
              onClick={() => {
                setNewProfileForm({
                  name: userProfile.name,
                  badgeId: userProfile.badgeId,
                  motto: userProfile.motto,
                  emblemType: userProfile.emblemType,
                  customPhoto: userProfile.customPhoto,
                });
                setShowCreateProfileModal(true);
              }}
              className="p-1 bg-[#FFFDF9] shadow-[0_3px_10px_rgba(0,0,0,0.22)] border border-[#D0C4AF] rounded-lg relative group shrink-0 cursor-pointer"
              title="Click to edit account dossier"
            >
              <div className="w-full aspect-[4/3.8] max-h-[145px] xl:max-h-[160px] relative bg-[#121820] overflow-hidden rounded-md border border-[#3A2C1E]/20">
                <AccountEmblemView
                  type={userProfile.emblemType}
                  displayName={userProfile.name}
                  customPhoto={userProfile.customPhoto}
                />
              </div>
            </div>

            {/* Name & Title */}
            <div className="px-0.5">
              <h2 className="font-serif text-base lg:text-lg font-bold text-[#1F1710] tracking-normal leading-tight">
                {userProfile.name}
              </h2>
              <div className="flex items-center justify-between mt-0.5">
                <p className="font-mono text-[8.5px] xl:text-[9px] text-[#6E5840] tracking-widest uppercase font-bold">
                  {userProfile.rankTitle}
                </p>
                <span className="font-mono text-[8px] text-[#8C6D48] tracking-wider font-semibold">
                  {userProfile.badgeId}
                </span>
              </div>
            </div>

            {/* Level Progress */}
            <div className="flex items-center gap-2 px-0.5">
              <span className="font-serif text-xs font-bold text-[#2C211B] shrink-0">Level {userProfile.level}</span>
              <div className="flex-1 h-1.5 bg-[#D9CBBB] rounded-full overflow-hidden border border-[#BFA885]">
                <div className="w-[70%] h-full bg-gradient-to-r from-[#BFA265] via-[#C99A3C] to-[#8C6C38] shadow-xs" />
              </div>
            </div>

            {/* Quote / Motto */}
            <div className="py-1 px-1 border-y border-[#8A7558]/25 text-center">
              <p className="font-serif italic text-[10.5px] xl:text-[11px] text-[#3A3022] leading-snug">
                &ldquo;{userProfile.motto}&rdquo;
              </p>
            </div>

            {/* Stats Table */}
            <div className="bg-[#121820] text-[#FAF6EE] p-2.5 rounded-lg border border-[#2A3442] shadow-inner font-mono text-[10px] space-y-1.5">
              <div className="flex justify-between items-center border-b border-[#2A3442] pb-0.5">
                <span className="text-[#8C9AA8]">Cases Solved</span>
                <span className="font-bold text-[#FAF6EE]">{userProfile.casesSolved}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A3442] pb-0.5">
                <span className="text-[#8C9AA8]">Ongoing</span>
                <span className="font-bold text-[#FAF6EE]">{userProfile.ongoing}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A3442] pb-0.5">
                <span className="text-[#8C9AA8]">Badges</span>
                <span className="font-bold text-[#FAF6EE]">{userProfile.badges}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#2A3442] pb-0.5">
                <span className="text-[#8C9AA8]">Reputation</span>
                <span className="font-bold text-[#E8C66A]">{userProfile.reputation}</span>
              </div>
              {/* Aggregate Most Played Detective Stat Line */}
              <div className="flex justify-between items-center pt-0.5 text-[9px]">
                <span className="text-[#A88C68] italic">Most Used Detective</span>
                <span className="font-serif font-bold text-[#FAF6EE] text-[9.5px]">{userProfile.mostPlayedDetective}</span>
              </div>
            </div>

            {/* Bottom Note */}
            <div className="pt-1 border-t border-[#8A7558]/20 text-center opacity-85 shrink-0">
              <p className="font-serif text-[10px] text-[#6E5840] italic">
                Detective chosen per case lobby
              </p>
            </div>
          </motion.div>
        </aside>

        {/* ================= COLUMN 2: CORKBOARD & 4x2 CASE GRID ================= */}
        <section className="flex-1 flex flex-col h-full min-h-0 min-w-0 relative">
          
          {/* FOLDER TABS */}
          <div className="flex gap-1.5 pl-3 relative z-20 shrink-0">
            <button className="bg-gradient-to-b from-[#FAF4E8] to-[#EFE5D0] text-[#1F1710] font-serif font-bold text-xs uppercase px-7 py-2 rounded-t-md shadow-[0_-4px_10px_rgba(0,0,0,0.5)] border-t border-x border-[#C2B092] tracking-widest cursor-default">
              Cases
            </button>
            <Link href="/detectives">
              <button className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-md border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer">
                Detectives
              </button>
            </Link>
            <Link href="/archive">
              <button className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-md border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer">
                Archive
              </button>
            </Link>
            <button 
              onClick={() => {
                setNewProfileForm({
                  name: userProfile.name,
                  badgeId: userProfile.badgeId,
                  motto: userProfile.motto,
                  emblemType: userProfile.emblemType,
                  customPhoto: userProfile.customPhoto,
                });
                setShowCreateProfileModal(true);
              }}
              className="bg-[#241A13]/90 hover:bg-[#33241B] text-[#D9C7A6]/70 hover:text-[#E8C66A] font-serif text-xs uppercase px-6 py-2 rounded-t-md border-t border-x border-[#4A382A]/70 tracking-widest transition-colors cursor-pointer"
            >
              Profile
            </button>
          </div>

          {/* CORKBOARD BODY (Grid of 8 Cards with Red Pins and Dark Wood Frame) */}
          <div 
            className="flex-1 min-h-0 relative shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_20px_50px_rgba(0,0,0,0.95)] border-[5px] xl:border-[6px] border-[#2C1C10] rounded-2xl p-2.5 xl:p-3 overflow-hidden flex flex-col justify-center bg-cover bg-center"
            style={{ backgroundImage: "url('/cases/cork_clean_bg.png')" }}
          >
            {/* Metallic Corner Rivets */}
            <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />
            <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs" />

            {/* Pinned Paper Tag on Right Corner ("A City of Layers") */}
            <div className="absolute -top-1 right-6 z-30 pointer-events-none transform rotate-3">
              <div className="bg-[#FAF4E6] text-[#63482E] font-serif italic text-[9px] px-2 py-1 rounded-[2px] shadow-md border border-[#C2B092] flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A84743] border border-[#521316]" />
                <span>A City of Layers</span>
              </div>
            </div>

            {/* Red Investigation Thread effect / Subtle vignette */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.85)_100%)]" />

            {/* 4x2 GRID OF AUTHENTIC VINTAGE CASE CARDS (All 8 Cards Matching Mock) */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 xl:gap-2.5 h-full w-full relative z-10 min-h-0">
              {CASES.map((caseItem) => {
                const isActive = caseItem.id === activeCaseId;

                return (
                  <motion.div 
                    key={caseItem.id}
                    whileHover={{ y: -3, scale: 1.015 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={() => handleCaseSelect(caseItem)}
                    className={cn(
                      "bg-gradient-to-b from-[#FAF5EC] via-[#F4EADC] to-[#E9DEC7] text-[#1E1712] rounded-xl p-2 xl:p-2.5 flex flex-col justify-between relative shadow-[0_6px_16px_rgba(0,0,0,0.7)] border transition-all duration-200 cursor-pointer group select-none min-h-0",
                      isActive 
                        ? "border-[#E5C158] ring-2 ring-[#E5C158] shadow-[0_0_22px_rgba(229,193,88,0.5),0_6px_18px_rgba(0,0,0,0.8)] scale-[1.01] z-20" 
                        : "border-[#C8B696] hover:border-[#E5C158]/80 hover:shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
                    )}
                  >
                    {/* Red Pushpin with Specular Highlight and Cast Shadow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-[#7A1F24] via-[#A84743] to-[#E55B5B] shadow-[0_2px_4px_rgba(0,0,0,0.8)] border border-[#4A1013]" />
                      <div className="w-1 h-1 rounded-full bg-white/80 absolute top-0.5 left-1" />
                    </div>

                    {/* Card Photo Container with Stamped Case Tag & Player Badge */}
                    <div className="relative w-full aspect-[16/9.5] max-h-[82px] lg:max-h-[90px] xl:max-h-[105px] overflow-hidden rounded-lg border border-[#3A2C1E]/40 shadow-inner bg-[#0D0A08] shrink-0">
                      <div className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-md bg-[#FAF4E8]/95 backdrop-blur-xs border border-[#8C6D48]/50 shadow-xs text-[#8C282C] font-mono text-[8.5px] font-bold tracking-wider">
                        {caseItem.code}
                      </div>

                      <div className="absolute top-1 right-1 z-10 px-1.5 py-0.5 rounded-md bg-[#18130E]/85 backdrop-blur-xs border border-[#C99A3C]/40 text-[#FAF6EE] font-mono text-[8.5px] font-medium flex items-center gap-1 shadow-xs">
                        <Users className="w-2.5 h-2.5 text-[#E8C66A]" />
                        <span>{caseItem.players}</span>
                      </div>

                      <Image 
                        src={caseItem.image}
                        alt={caseItem.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Title & Location / Stars */}
                    <div className="mt-1 px-0.5 min-w-0">
                      <h3 className="font-serif font-bold text-xs xl:text-[13px] leading-tight text-[#1F1710] truncate">
                        {caseItem.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-[10px] mt-0.5 text-[#6E5840]">
                        <div className="flex items-center gap-1 min-w-0">
                          <MapPin className="w-2.5 h-2.5 text-[#C99A3C] shrink-0" />
                          <span className="truncate font-medium">{caseItem.location}</span>
                        </div>
                        <div className="flex items-center text-[#C99A3C] shrink-0 gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={cn(
                                "w-2.5 h-2.5", 
                                i < caseItem.stars ? "fill-[#C99A3C] text-[#C99A3C]" : "text-[#C2B092]/40"
                              )} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Antique Embossed Brass Plaque Open Case Button */}
                    <div className="mt-1.5 pt-1 border-t border-[#C2B092]/35">
                      {caseItem.isPlayable ? (
                        <Link href={`/cases/${caseItem.slug}`} className="w-full block">
                          <button className="w-full py-1 bg-gradient-to-b from-[#BFA265] via-[#8C6C38] to-[#5C4320] hover:from-[#D4B578] hover:to-[#705228] text-[#FAF6EE] font-serif text-[9.5px] xl:text-[10px] font-bold tracking-[0.18em] uppercase rounded-lg border border-[#D4B578]/80 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] transition-all cursor-pointer active:scale-[0.98]">
                            Open Case
                          </button>
                        </Link>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCaseSelect(caseItem);
                          }}
                          className="w-full py-1 bg-gradient-to-b from-[#94784E] via-[#6B522E] to-[#45331B] text-[#FAF6EE]/80 font-serif text-[9.5px] xl:text-[10px] font-bold tracking-[0.18em] uppercase rounded-lg border border-[#94784E]/50 shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-all cursor-pointer hover:text-[#FAF6EE]"
                        >
                          Open Case
                        </button>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= COLUMN 3: CASE BRIEF DOSSIER & INTERACTIVE TABS ================= */}
        <aside className="w-[335px] lg:w-[365px] xl:w-[400px] flex-shrink-0 flex h-full min-h-0 gap-1.5 relative pt-3">
          
          {/* Main Case Dossier Card (Weathered Aged Tea-Stained Parchment) */}
          <div className="flex-1 bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E3D4B8] text-[#1E1712] rounded-xl p-3 relative shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-2 border-[#8A7558] flex flex-col h-full justify-between min-h-0 overflow-visible">
            
            {/* Vintage Metal Dossier Binder Clip at top */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
              <div className="w-10 h-3 border-2 border-[#9C7A4A] rounded-t-full bg-gradient-to-b from-[#FAF4E8]/20 to-transparent shadow-xs mb-[-2px]" />
              <div className="w-16 h-4 bg-gradient-to-b from-[#7A6342] via-[#5C4A31] to-[#3D301E] rounded-xs shadow-md border border-[#C99A3C]/70 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-[#261E14] rounded-full opacity-70" />
              </div>
            </div>

            {/* DYNAMIC TABBED CONTENT CONTAINER (Slide/Fade Animated) */}
            <div className="overflow-y-auto no-scrollbar flex-1 min-h-0 pr-0.5 flex flex-col justify-between">
              
              <AnimatePresence mode="wait">
                {/* 1. OVERVIEW TAB */}
                {activeBriefTab === "overview" && (
                  <motion.div 
                    key={`overview-${activeCase.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {/* Header Label with Amber Indicator */}
                    <div className="flex justify-between items-center mb-1 border-b border-[#A69375]/40 pb-1 mt-0.5 shrink-0">
                      <span className="font-serif text-xs text-[#5C4625] tracking-[0.25em] uppercase font-bold">
                        Case Brief
                      </span>
                      <span className="w-2 h-2 rounded-full bg-[#C99A3C] shadow-[0_0_8px_#C99A3C] border border-[#8C6B28]" />
                    </div>

                    {/* Large Case Brief Photo */}
                    <div className="w-full aspect-[16/8.5] max-h-[120px] xl:max-h-[140px] relative mb-1.5 overflow-hidden rounded-lg border-2 border-[#3D3124] shadow-md bg-[#0F0C08] shrink-0">
                      <Image 
                        src={activeCase.briefImage}
                        alt={activeCase.title}
                        fill
                        unoptimized
                        className="object-cover rounded-md"
                        priority
                      />
                    </div>

                    {/* Case Code & Title */}
                    <div className="mb-1 shrink-0">
                      <div className="font-mono text-[9.5px] text-[#8C282C] font-bold tracking-widest uppercase">
                        {activeCase.code}
                      </div>
                      <h2 className="font-serif text-base xl:text-lg font-bold text-[#1F1710] leading-tight mt-0.5 truncate">
                        {activeCase.title}
                      </h2>
                    </div>

                    {/* Key Meta Badges */}
                    <div className="space-y-0.5 py-1 border-y border-[#A69375]/35 text-[9.5px] xl:text-[10px] font-mono text-[#3E3024] mb-1 shrink-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#8C6B28] shrink-0" />
                        <span className="font-semibold text-[#1F1710] truncate">{activeCase.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-[#6E5840]">
                          <Gauge className="w-3 h-3 text-[#8C6B28] shrink-0" /> Difficulty
                        </span>
                        <span className="text-[#C99A3C] font-bold text-xs tracking-wider">
                          {"★".repeat(activeCase.stars)}{"☆".repeat(3 - activeCase.stars)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-[#6E5840]">
                          <Users className="w-3 h-3 text-[#8C6B28] shrink-0" /> Players
                        </span>
                        <span className="font-semibold text-[#1F1710]">{activeCase.players}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-[#6E5840]">
                          <Clock className="w-3 h-3 text-[#8C6B28] shrink-0" /> Play Time
                        </span>
                        <span className="font-semibold text-[#1F1710]">{activeCase.playTime}</span>
                      </div>
                    </div>

                    {/* Story Description */}
                    <p className="font-serif text-[10.5px] xl:text-[11px] leading-relaxed text-[#2C211A]/95 italic mt-1">
                      &ldquo;{activeCase.description}&rdquo;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Bottom Actions (Cleanly anchored, no memo slip) */}
            <div className="pt-2 shrink-0 border-t border-[#A69375]/35 mt-1">
              {activeCase.isPlayable ? (
                <Link href={`/cases/${activeCase.slug}`} className="w-full block">
                  <motion.button 
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-[#702428] via-[#852C32] to-[#702428] hover:from-[#852C32] hover:to-[#96333A] text-[#FAF6EE] font-serif text-[11px] xl:text-xs font-bold tracking-[0.2em] uppercase py-2.5 px-3.5 border border-[#A23840] shadow-[0_4px_15px_rgba(112,36,40,0.5)] transition-all cursor-pointer rounded-lg"
                  >
                    <span>Start Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              ) : (
                <button 
                  onClick={() => {
                    setLockedToast(`${activeCase.title} is locked. Complete Case 001 first.`);
                    setTimeout(() => setLockedToast(null), 3500);
                  }}
                  className="w-full group flex items-center justify-center gap-2 bg-[#3A2426] text-[#D9C7A6]/60 font-serif text-[11px] xl:text-xs font-bold tracking-[0.2em] uppercase py-2.5 px-3.5 border border-[#523336] shadow-sm rounded-lg cursor-pointer hover:text-[#FAF6EE]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#A84743]" />
                  <span>Case Locked</span>
                </button>
              )}
            </div>

          </div>

          {/* Vertical Navigation Tabs on the Right Edge (Horizontal labels with icon, matching reference) */}
          <div className="w-[76px] lg:w-[82px] xl:w-[88px] flex-shrink-0 flex flex-col gap-1 py-0.5">
            {BRIEF_TABS.map((tab) => {
              const isSelected = activeBriefTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveBriefTab(tab.id)}
                  title={tab.label}
                  className={cn(
                    "w-full py-2 px-1 flex flex-col items-center justify-center rounded-md transition-all border text-[9px] xl:text-[9.5px] font-mono uppercase tracking-wider cursor-pointer shadow-xs",
                    isSelected
                      ? "bg-[#652429] text-[#FAF6EE] border-[#8D373E] shadow-sm ring-1 ring-[#C99A3C]/40"
                      : "bg-[#141A22]/90 text-[#8C9AA8] border-[#222C38] hover:bg-[#1E2632] hover:text-[#E8C66A]"
                  )}
                >
                  <TabIcon className={cn("w-3.5 h-3.5 mb-0.5", isSelected ? "text-[#E8C66A]" : "text-[#8C9AA8]")} />
                  <span className="font-semibold text-center leading-tight">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

        </aside>

      </main>

      {/* BOTTOM DESK SPACER TO GUARANTEE PROPS & CHAI CUP ARE NEVER COVERED */}
      <div className="h-[140px] lg:h-[160px] xl:h-[180px] w-full pointer-events-none shrink-0" />

      {/* ================= CREATE INVESTIGATOR ACCOUNT MODAL (SHADCN DIALOG) ================= */}
      <Dialog open={showCreateProfileModal} onOpenChange={setShowCreateProfileModal}>
        <DialogContent 
          showCloseButton={true}
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#FAF4E8] via-[#EFE5D0] to-[#E5D7BF] text-[#1F1710] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] border-4 border-[#C2B092] p-5 lg:p-6"
        >
          {/* Vintage Corner Brackets & Screws */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs pointer-events-none" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#8C6D37] border border-[#24170C] shadow-xs pointer-events-none" />

          {/* Red Stamp Badge */}
          <div className="absolute top-4 right-14 pointer-events-none transform -rotate-6 select-none opacity-85 z-20">
            <Badge variant="burgundy">
              CLASSIFIED DOSSIER
            </Badge>
          </div>

          {/* Header */}
          <DialogHeader className="text-left flex-row items-center gap-3 border-b-2 border-[#8C6D48]/30 pb-3">
            <div className="w-10 h-10 rounded-lg bg-[#241A13] border border-[#C99A3C] flex items-center justify-center text-[#E8C66A] shadow-md shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-serif font-bold text-xl text-[#1F1710] tracking-wide">
                Create Investigator Account
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] text-[#6E5840] tracking-wider uppercase font-semibold">
                Lalbazar Special Branch &bull; Permanent Personnel Registry
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Form */}
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            
            {/* 1. CHOOSE YOUR ACCOUNT EMBLEM */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="font-serif font-bold text-xs uppercase tracking-wider text-[#3A2C1E]">
                    1. Choose Your Account Emblem
                  </Label>
                  <p className="text-[10px] font-mono text-[#6E5840]">
                    Permanent platform insignia (or upload your personal registry photograph)
                  </p>
                </div>
                {/* Upload Custom ID Photo Button */}
                <label className="cursor-pointer flex items-center gap-1.5 text-[11px] font-serif font-bold text-[#852C32] hover:text-[#96333A] bg-[#852C32]/10 hover:bg-[#852C32]/20 px-2.5 py-1 rounded-md border border-[#852C32]/40 transition-all shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoUpload} 
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {ACCOUNT_EMBLEMS.map((emblem) => {
                  const isSelected = newProfileForm.emblemType === emblem.id;
                  return (
                    <div
                      key={emblem.id}
                      onClick={() => {
                        setNewProfileForm((prev) => ({
                          ...prev,
                          emblemType: emblem.id,
                        }));
                      }}
                      className={cn(
                        "cursor-pointer rounded-xl p-1.5 transition-all flex flex-col items-center text-center relative border-2 bg-[#FFFDF9]",
                        isSelected
                          ? "border-[#852C32] ring-2 ring-[#852C32]/40 shadow-lg scale-[1.02]"
                          : "border-[#D0C4AF] hover:border-[#8C6D48]/60 hover:shadow-md opacity-85 hover:opacity-100"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 z-20 w-4.5 h-4.5 rounded-full bg-[#852C32] text-white flex items-center justify-center shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="w-full aspect-square relative rounded-lg overflow-hidden mb-1 bg-[#121820] border border-[#24170C]/20 shadow-inner">
                        <AccountEmblemView
                          type={emblem.id}
                          displayName={newProfileForm.name}
                          customPhoto={newProfileForm.customPhoto}
                        />
                      </div>
                      <span className="font-serif font-bold text-[11px] text-[#1F1710] leading-tight truncate w-full">
                        {emblem.label}
                      </span>
                      <span className="font-mono text-[8px] text-[#6E5840] uppercase tracking-wider font-semibold">
                        {emblem.subtitle}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Uploaded Registry Photo Pill if active */}
              {newProfileForm.customPhoto && (
                <div className="mt-2 p-2 rounded-lg bg-[#FAF4E8] border border-[#C99A3C]/40 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-md overflow-hidden relative border border-[#BFA885] shadow-xs">
                      <AccountEmblemView type="custom" customPhoto={newProfileForm.customPhoto} />
                    </div>
                    <div>
                      <p className="font-serif font-bold text-xs text-[#1F1710]">Uploaded Registry Photograph</p>
                      <p className="font-mono text-[9px] text-[#6E5840]">Custom aged portrait ready for dossier</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={newProfileForm.emblemType === "custom" ? "burgundy" : "outline"}
                    size="sm"
                    onClick={() => setNewProfileForm((prev) => ({ ...prev, emblemType: "custom" }))}
                    className="text-[10px] font-mono uppercase tracking-wider"
                  >
                    {newProfileForm.emblemType === "custom" ? "Selected ✓" : "Use Photo"}
                  </Button>
                </div>
              )}
            </div>

            {/* 2. ACCOUNT DETAILS */}
            <div className="flex flex-col gap-3">
              <div>
                <Label className="font-serif font-bold text-xs uppercase tracking-wider text-[#3A2C1E]">
                  2. Account Details
                </Label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <Label htmlFor="callsign" className="font-serif font-semibold text-xs text-[#3A2C1E] mb-1 block">
                    Display Name / Call-Sign
                  </Label>
                  <Input
                    id="callsign"
                    type="text"
                    required
                    value={newProfileForm.name}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, name: e.target.value })}
                    className="w-full bg-[#FAF4E8] border-[#BFA885] text-[#1F1710] font-serif font-bold text-sm focus-visible:ring-[#852C32] shadow-inner"
                    placeholder="e.g. Snehansh Yadav"
                  />
                  <span className="font-mono text-[8.5px] text-[#6E5840] mt-0.5 block">
                    Monogram updates automatically with your initials
                  </span>
                </div>

                <div>
                  <Label htmlFor="badgeid" className="font-serif font-semibold text-xs text-[#3A2C1E] mb-1 flex items-center justify-between">
                    <span>Service ID (Badge #)</span>
                    <button
                      type="button"
                      onClick={() => setNewProfileForm({ ...newProfileForm, badgeId: generateRandomBadgeId() })}
                      className="text-[9.5px] font-mono text-[#852C32] hover:text-[#A23840] flex items-center gap-1 cursor-pointer font-semibold"
                      title="Generate new badge number"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Randomize</span>
                    </button>
                  </Label>
                  <Input
                    id="badgeid"
                    type="text"
                    value={newProfileForm.badgeId}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, badgeId: e.target.value })}
                    className="w-full bg-[#FAF4E8] border-[#BFA885] text-[#1F1710] font-mono text-sm focus-visible:ring-[#852C32] shadow-inner"
                    placeholder="e.g. ID #409"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="motto" className="font-serif font-semibold text-xs text-[#3A2C1E] mb-1 block">
                    Personal Motto / Investigator&apos;s Creed (Optional)
                  </Label>
                  <Input
                    id="motto"
                    type="text"
                    value={newProfileForm.motto}
                    onChange={(e) => setNewProfileForm({ ...newProfileForm, motto: e.target.value })}
                    className="w-full bg-[#FAF4E8] border-[#BFA885] text-[#1F1710] font-serif italic text-xs focus-visible:ring-[#852C32] shadow-inner"
                    placeholder="e.g. Questions find better places than answers."
                  />
                </div>
              </div>

              {/* LOBBY DETECTIVE SELECTION NOTE BANNER */}
              <div className="p-2.5 rounded-lg bg-[#FAF4E8] border border-[#BFA885] flex items-start gap-2.5 shadow-inner">
                <div className="w-5 h-5 rounded-full bg-[#852C32]/10 text-[#852C32] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-3 h-3" />
                </div>
                <div className="text-[10px] text-[#4A382A] leading-relaxed">
                  <strong className="font-serif text-[#1F1710]">Per-Case Detective Selection:</strong> The eight playable detectives (<em>Arjun Mukherjee, Ananya Sen, Meera Iyer, Ritwik Dutta, Nandini Rao, Kabir Mehta, Sana Qureshi, Ayaan Khan</em>) and their specialized departmental traits are selected fresh per investigation inside the multiplayer room lobby.
                </div>
              </div>
            </div>

            <Separator className="bg-[#8C6D48]/30" />

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <p className="font-mono text-[9px] text-[#6E5840]">
                Permanent Dossier &bull; Lalbazar Archive
              </p>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateProfileModal(false)}
                  className="font-serif text-xs font-semibold uppercase tracking-wider text-[#423118]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="burgundy"
                  className="gap-2 px-5 py-2.5 font-serif text-xs font-bold uppercase tracking-widest shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-[#E8C66A]" />
                  <span>Stamp &amp; Create Dossier</span>
                </Button>
              </div>
            </div>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}


