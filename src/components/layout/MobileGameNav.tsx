"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FolderOpen, Users, Archive, Settings } from "lucide-react";

export default function MobileGameNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Hub", href: "/", icon: Home },
    { name: "Cases", href: "/cases", icon: FolderOpen },
    { name: "Detectives", href: "/detectives", icon: Users },
    { name: "Archive", href: "/archive", icon: Archive },
    { name: "Profile", href: "/profile", icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-panel-wood border-t border-brass/20 z-50 flex justify-around items-center p-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center p-2 min-w-[60px] rounded relative transition-colors",
              isActive ? "text-brass" : "text-text-muted"
            )}
          >
            {isActive && <div className="absolute top-0 w-8 h-[2px] bg-red-thread rounded-full shadow-[0_0_8px_rgba(168,71,67,0.8)]" />}
            <Icon className="w-5 h-5 mb-1 mt-1" />
            <span className="text-[10px] uppercase tracking-wider font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
