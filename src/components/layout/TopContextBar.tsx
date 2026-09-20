"use client";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";

export default function TopContextBar() {
  const pathname = usePathname();
  
  // Basic breadcrumb logic for MVP
  const paths = pathname?.split("/").filter(Boolean) || [];
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-ink/80 backdrop-blur-md border-b border-brass/10">
      <div className="flex items-center gap-2 text-sm text-paper-muted">
        {paths.length === 0 ? (
          <span className="font-serif text-brass tracking-wider">Welcome to Nabadwip Nagar</span>
        ) : (
          <div className="flex items-center gap-2 font-mono uppercase text-xs tracking-widest">
            <span className="opacity-50">LOCATION //</span>
            <span className="text-brass">{paths.join(" / ").replace(/-/g, " ")}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="text-text-muted hover:text-brass transition-colors" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>
        <button className="text-text-muted hover:text-brass transition-colors relative" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-thread rounded-full border border-ink"></span>
        </button>
      </div>
    </header>
  );
}
