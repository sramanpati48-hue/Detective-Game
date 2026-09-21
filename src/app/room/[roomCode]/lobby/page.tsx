import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Play } from "lucide-react";

export default async function RoomLobbyPage({
  params,
}: {
  params: Promise<{ roomCode: string }>;
}) {
  const { roomCode } = await params;

  return (
    <div className="min-h-screen w-full bg-[#0D0906] text-[#F8F2E7] relative flex flex-col justify-between font-sans">
      <div 
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 brightness-[0.85]"
        style={{ backgroundImage: "url('/cases/cases_desk_bg.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_50%,_rgba(8,5,3,0.85)_100%)]" />

      {/* Header */}
      <header className="relative z-10 px-8 py-5 flex items-center justify-between border-b border-[#C99A3C]/30 bg-[#120D09]/80 backdrop-blur-md">
        <div>
          <h1 className="font-serif text-2xl text-[#E8C66A] tracking-wider font-bold">
            BHORER SHAHAR
          </h1>
          <p className="font-mono text-xs text-[#D9C7A6]/70 uppercase tracking-widest">
            Investigation Room: <span className="text-[#E8C66A] font-bold">#{roomCode}</span>
          </p>
        </div>
        <Link 
          href={`/room/${roomCode}/characters`}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#1C140E] border border-[#C99A3C]/40 text-xs font-serif uppercase tracking-wider text-[#D9C7A6] hover:text-[#E8C66A]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Detective</span>
        </Link>
      </header>

      {/* Main Lobby Brief */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-gradient-to-b from-[#FAF4E8] via-[#F2E8D7] to-[#E5D7C0] text-[#1F1710] rounded-2xl p-7 border-4 border-[#2A1E14] shadow-2xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#241A13] border-2 border-[#C99A3C] flex items-center justify-center text-[#E8C66A] shadow-lg">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-black text-[#1F1710]">
            Investigation Room Ready
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest text-[#702428] font-bold">
            Code: #{roomCode} &bull; Assignment Registered
          </p>
          <p className="font-serif text-sm text-[#4A3728] leading-relaxed">
            Your detective persona has been locked in for this case. Waiting for squad mates or proceed to embark onto the case board.
          </p>
          <div className="flex gap-3 mt-2 w-full">
            <Link href={`/room/${roomCode}/investigation/ep1`} className="flex-1">
              <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-[#702428] to-[#852C32] text-[#FAF4E8] font-serif font-bold text-xs uppercase tracking-widest border border-[#C99A3C] shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-all">
                <Play className="w-3.5 h-3.5" />
                <span>Enter Case Board</span>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-3 text-center text-[10px] font-serif italic text-[#D9C7A6]/50">
        Same Streets. Different Truths.
      </footer>
    </div>
  );
}
