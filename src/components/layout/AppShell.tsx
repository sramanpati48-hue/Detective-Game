"use client";
import React from "react";
import { usePathname } from "next/navigation";
import GameSidebar from "./GameSidebar";
import MobileGameNav from "./MobileGameNav";
import TopContextBar from "./TopContextBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Home (/), Cases (/cases), Detectives (/detectives), and Room flow (/room/*) are immersive full-screen takeovers
  const isTakeoverScreen = 
    pathname === "/" || 
    pathname === "/cases" || 
    pathname?.startsWith("/detectives") || 
    pathname?.startsWith("/room");

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col md:flex-row bg-ink selection:bg-brass/30">
      {/* Static Atmosphere Layers */}
      <div className="atmosphere-rain" />
      <div className="atmosphere-lamp" />

      {/* Desktop Sidebar */}
      {!isTakeoverScreen && <GameSidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen w-full min-w-0 z-10 relative ${!isTakeoverScreen ? "pb-20 md:pb-0 md:ml-[264px]" : ""}`}>
        {!isTakeoverScreen && <TopContextBar />}
        <div className={!isTakeoverScreen ? "flex-1 p-4 md:p-8" : "flex-1 h-full w-full min-w-0"}>
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      {!isTakeoverScreen && <MobileGameNav />}
    </div>
  );
}
