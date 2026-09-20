"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FolderOpen, Users, Archive, Settings } from "lucide-react";

export default function GameSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Hub", href: "/", icon: Home },
    { name: "Cases", href: "/cases", icon: FolderOpen },
    { name: "Detectives", href: "/detectives", icon: Users },
    { name: "Archive", href: "/archive", icon: Archive },
    { name: "Profile", href: "/profile", icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[264px] fixed inset-y-0 left-0 bg-panel-wood border-r border-brass/20 z-20 shadow-2xl">
      <div className="p-6 border-b border-brass/10 flex flex-col items-center">
        <h1 className="font-serif text-2xl text-brass text-center leading-tight tracking-wide">
          BHORER SHAHAR
        </h1>
        <p className="text-[10px] text-paper-muted uppercase tracking-widest mt-1 opacity-70">
          Case Files
        </p>
      </div>

      <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "text-brass bg-charcoal/50 border border-brass/30 shadow-inner" 
                  : "text-text-muted hover:text-paper-kulfi hover:bg-charcoal/30"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-thread" />
              )}
              <Icon className={cn("w-4 h-4", isActive ? "text-brass" : "text-text-muted group-hover:text-paper-kulfi")} />
              <span className="font-medium tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-brass/10 mt-auto">
        <div className="bg-charcoal/40 p-4 rounded border border-brass/5">
          <p className="font-serif text-paper-muted text-sm italic text-center">
            &quot;Some cities never sleep. They just hide their secrets.&quot;
          </p>
        </div>
      </div>
    </aside>
  );
}
