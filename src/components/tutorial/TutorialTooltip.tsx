"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface ContextualTooltipProps {
  message: string;
  className?: string;
}

export default function TutorialTooltip({ message, className = "" }: ContextualTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={`px-2.5 py-1 bg-[#1c1917] border border-[#854d0e] text-[#fef3c7] text-[11px] font-mono rounded-xs shadow-xl flex items-center gap-1.5 whitespace-nowrap z-30 pointer-events-none ${className}`}
    >
      <span>{message}</span>
      <ArrowDown className="w-3 h-3 text-[#fef3c7]" />
    </motion.div>
  );
}
