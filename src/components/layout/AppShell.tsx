"use client";
import React from "react";
import { usePathname } from "next/navigation";
import GameSidebar from "./GameSidebar";
import MobileGameNav from "./MobileGameNav";
import TopContextBar from "./TopContextBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // The original design for Home (/) and Cases (/cases) are full-screen takeovers
  const isTakeoverScreen = pathname === "/" || pathname === "/cases";

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-ink selection:bg-brass/30">
      {/* Static Atmosphere Layers */}
      <div className="atmosphere-rain" />
      <div className="atmosphere-lamp" />

      {/* Desktop Sidebar */}
      {!isTakeoverScreen && <GameSidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen z-10 relative ${!isTakeoverScreen ? "pb-20 md:pb-0 md:ml-[264px]" : ""}`}>
        {!isTakeoverScreen && <TopContextBar />}
        <div className={!isTakeoverScreen ? "flex-1 p-4 md:p-8" : "flex-1 h-full"}>
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      {!isTakeoverScreen && <MobileGameNav />}
    </div>
  );
}
