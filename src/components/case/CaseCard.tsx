import React, { memo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Clock, Users, Lock, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

export const CaseCard = memo(function CaseCard({
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

  const badgeVariant =
    status === "Available" ? "available" :
    status === "Solved" ? "solved" :
    status === "In Progress" ? "inProgress" :
    "locked";

  return (
    <Card
      className={cn(
        "relative gap-0 p-0 bg-charcoal border-brass/20 rounded shadow-lg overflow-hidden group flex flex-col h-full",
        isLocked ? "opacity-75 grayscale-[0.8]" : "hover:border-brass/50 transition-all duration-300"
      )}
    >
      <div className="h-40 bg-navy relative flex items-center justify-center overflow-hidden shrink-0">
        {/* Placeholder for Image */}
        <div className="absolute inset-0 bg-panel-wood opacity-50" />
        <span className="relative z-10 text-paper-muted/30 font-serif text-2xl tracking-widest uppercase select-none">
          {imageFallback}
        </span>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-20">
          <Badge variant={badgeVariant}>
            {status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5 flex flex-col flex-1 relative gap-0">
        <div className="text-[10px] font-mono text-brass-light mb-1">{code}</div>
        <h3 className="font-serif text-xl text-paper-kulfi mb-2 leading-snug">{title}</h3>
        
        {!isLocked && (
          <div className="flex items-center gap-3 text-xs text-paper-muted mb-4 font-sans">
            {minutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-brass/70 shrink-0" /> {minutes}
              </span>
            )}
            {players && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3 text-brass/70 shrink-0" /> {players}
              </span>
            )}
            {difficulty && (
              <span className="text-brass/70">• {difficulty}</span>
            )}
          </div>
        )}

        {description && !isLocked && (
          <p className="text-sm text-text-muted line-clamp-2 mb-6 flex-1 leading-relaxed">
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
      </CardContent>

      <Separator className="bg-brass/10" />

      <CardFooter className="p-4 pt-3 mt-auto">
        {isLocked ? (
          <div className="w-full text-xs text-center text-text-muted tracking-widest uppercase font-mono py-2">
            Coming Soon
          </div>
        ) : (
          <Button asChild variant="brassOutline" className="w-full">
            <Link href={href}>
              Open Case File <ChevronRight className="w-4 h-4 ml-1.5 shrink-0" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
});
