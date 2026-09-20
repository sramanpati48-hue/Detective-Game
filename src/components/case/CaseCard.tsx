import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock, Users, Lock, ChevronRight } from "lucide-react";
import { BrassButton } from "@/components/ui/BrassButton";

interface CaseCardProps {
  id: string;
  code: string;
  title: string;
  status: "Available" | "Locked" | "In Progress" | "Solved";
  minutes?: string;
  players?: string;
  difficulty?: string;
  description?: string;
  imageFallback: string;
  href?: string;
}

export function CaseCard({
  code,
  title,
  status,
  minutes,
  players,
  difficulty,
  description,
  imageFallback,
  href = "#",
}: CaseCardProps) {
  const isLocked = status === "Locked";

  return (
    <div className={cn(
      "relative bg-charcoal border border-brass/20 rounded shadow-lg overflow-hidden group flex flex-col h-full",
      isLocked ? "opacity-75 grayscale-[0.8]" : "hover:border-brass/50 transition-all duration-300"
    )}>
      <div className="h-40 bg-navy relative flex items-center justify-center overflow-hidden">
        {/* Placeholder for Image */}
        <div className="absolute inset-0 bg-panel-wood opacity-50"></div>
        <span className="relative z-10 text-paper-muted/30 font-serif text-2xl tracking-widest uppercase">{imageFallback}</span>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className={cn(
            "text-[10px] font-mono tracking-widest uppercase px-2 py-1 bg-ink/80 border backdrop-blur-sm rounded-sm",
            status === "Available" ? "text-brass border-brass/50" :
            status === "Solved" ? "text-success border-success/50" :
            status === "In Progress" ? "text-amber border-amber/50" :
            "text-text-muted border-text-muted/50"
          )}>
            {status}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 relative">
        <div className="text-[10px] font-mono text-brass-light mb-1">{code}</div>
        <h3 className="font-serif text-xl text-paper-kulfi mb-2">{title}</h3>
        
        {!isLocked && (
          <div className="flex items-center gap-3 text-xs text-paper-muted mb-4 font-sans">
            {minutes && (
              <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-brass/70"/> {minutes}</span>
            )}
            {players && (
              <span className="flex items-center gap-1"><Users className="w-3 h-3 text-brass/70"/> {players}</span>
            )}
            {difficulty && (
              <span className="text-brass/70">• {difficulty}</span>
            )}
          </div>
        )}

        {description && !isLocked && (
          <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-1">
            {description}
          </p>
        )}

        {isLocked && (
          <div className="flex-1 flex items-center justify-center py-6">
            <div className="text-center">
              <Lock className="w-8 h-8 text-brass/30 mx-auto mb-2" />
              <p className="text-sm text-text-muted font-serif italic">Case file sealed.</p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-brass/10">
          {isLocked ? (
            <div className="text-xs text-center text-text-muted tracking-widest uppercase font-mono">Coming Soon</div>
          ) : (
            <Link href={href} className="block">
              <BrassButton className="w-full" variant="secondary">
                Open Case File <ChevronRight className="w-4 h-4 ml-2" />
              </BrassButton>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
