import Link from "next/link";
import { ChevronRight, Clock, Users, MapPin, Target, CheckCircle2, Lock } from "lucide-react";
import { BrassButton } from "@/components/ui/BrassButton";

export default function TheLastFerryCase() {
  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-8 font-mono tracking-widest uppercase">
        <Link href="/cases" className="hover:text-brass transition-colors">Case Desk</Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-brass">Case 001</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Folder (Left & Right Pages) */}
        <div className="flex-1 bg-[#FDFBF7] text-[#2C211B] shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-sm flex flex-col md:flex-row border border-[#D9C7A6]/50 overflow-hidden relative">
          
          {/* Vertical Folder Crease */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-transparent via-black/10 to-transparent z-10 pointer-events-none"></div>

          {/* Left Page (Briefing & Context) */}
          <div className="flex-1 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D9C7A6] relative bg-[#f5efe6]">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23noise)\"/></svg>')" }}></div>
            
            <div className="mb-2 font-mono text-[#A84743] font-bold tracking-widest text-sm">CASE 001</div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-[#101720]">The Last Ferry</h1>
            
            <div className="inline-block px-3 py-1 bg-[#2C211B] text-[#F2E3C6] font-mono text-xs uppercase tracking-widest mb-8 border border-[#C99A3C]/30">
              Status: Available
            </div>

            <div className="flex flex-wrap gap-6 mb-8 text-sm font-sans font-medium text-[#4A3B32]">
              <div className="flex items-center gap-2"><Target className="w-4 h-4 text-[#C99A3C]" /> Intermediate</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-[#C99A3C]" /> 45-60 minutes</div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#C99A3C]" /> 1-4 players</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#C99A3C]" /> Nabadwip Nagar, late monsoon</div>
            </div>

            <div className="w-full aspect-[4/3] bg-[#172233] mb-8 relative border-4 border-white shadow-md flex items-center justify-center transform -rotate-1 hover:rotate-0 transition-transform">
              <span className="text-white/20 font-serif text-2xl">FERRY AT NIGHT (ATTACHED PHOTO)</span>
              <div className="absolute top-2 left-1/2 -ml-3 w-6 h-6 bg-transparent border-t-8 border-gray-400 rounded-t-full shadow-sm z-20"></div>
            </div>

            <h3 className="font-serif text-2xl mb-3 text-[#101720]">Premise</h3>
            <p className="font-sans leading-relaxed text-[#4A3B32] mb-6">
              During the final monsoon ferry crossing, accountant Abir Basu vanishes without a trace. The authorities suspect an accidental fall into the Bhairavi River. But the math doesn&apos;t add up, and neither do the statements of the other passengers.
            </p>
          </div>

          {/* Right Page (Details & Progression) */}
          <div className="flex-1 p-8 md:p-12 relative bg-[#f5efe6]">
             {/* Paper texture overlay */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100%\" filter=\"url(%23noise)\"/></svg>')" }}></div>
             
             <h3 className="font-serif text-xl mb-4 text-[#101720] border-b border-[#D9C7A6] pb-2">Victim Profile</h3>
             <div className="bg-[#EAE1D1] p-4 rounded-sm border border-[#D9C7A6] mb-8 flex gap-4 items-center">
               <div className="w-16 h-16 bg-[#2C211B] flex-shrink-0 flex items-center justify-center text-[#F2E3C6] font-serif text-xs text-center border border-[#101720]">PHOTO</div>
               <div>
                 <div className="font-bold font-serif text-lg text-[#101720]">Abir Basu</div>
                 <div className="text-sm text-[#4A3B32] font-mono">Accountant • Missing</div>
               </div>
             </div>

             <h3 className="font-serif text-xl mb-4 text-[#101720] border-b border-[#D9C7A6] pb-2">Persons of Interest</h3>
             <ul className="space-y-3 mb-8">
               <li className="flex justify-between items-center text-sm font-sans border-b border-dashed border-[#D9C7A6] pb-2">
                 <span className="font-bold text-[#2C211B]">Rina Basu</span>
                 <span className="text-[#557B7C] italic">Wife</span>
               </li>
               <li className="flex justify-between items-center text-sm font-sans border-b border-dashed border-[#D9C7A6] pb-2">
                 <span className="font-bold text-[#2C211B]">Debashish Pal</span>
                 <span className="text-[#557B7C] italic">Business Partner</span>
               </li>
               <li className="flex justify-between items-center text-sm font-sans border-b border-dashed border-[#D9C7A6] pb-2">
                 <span className="font-bold text-[#2C211B]">Harun Sheikh</span>
                 <span className="text-[#557B7C] italic">Deckhand</span>
               </li>
               <li className="flex justify-between items-center text-sm font-sans border-b border-dashed border-[#D9C7A6] pb-2">
                 <span className="font-bold text-[#2C211B]">Tuli Ghosh</span>
                 <span className="text-[#557B7C] italic">Ticket Inspector</span>
               </li>
             </ul>

             <h3 className="font-serif text-xl mb-4 text-[#101720] border-b border-[#D9C7A6] pb-2">Episodes</h3>
             <div className="space-y-4">
               <div className="flex gap-3 opacity-100">
                 <CheckCircle2 className="w-5 h-5 text-[#557B7C] mt-0.5" />
                 <div>
                   <div className="font-bold font-sans text-sm text-[#2C211B]">1. The Empty Seat</div>
                 </div>
               </div>
               <div className="flex gap-3 opacity-50">
                 <Lock className="w-5 h-5 text-[#A84743] mt-0.5" />
                 <div>
                   <div className="font-bold font-sans text-sm text-[#2C211B]">2. Rain on the Deck</div>
                 </div>
               </div>
               <div className="flex gap-3 opacity-50">
                 <Lock className="w-5 h-5 text-[#A84743] mt-0.5" />
                 <div>
                   <div className="font-bold font-sans text-sm text-[#2C211B]">3. The Voices at Ghat No. 6</div>
                 </div>
               </div>
               <div className="flex gap-3 opacity-50">
                 <Lock className="w-5 h-5 text-[#A84743] mt-0.5" />
                 <div>
                   <div className="font-bold font-sans text-sm text-[#2C211B]">4. The Missing Ledger</div>
                 </div>
               </div>
               <div className="flex gap-3 opacity-50">
                 <Lock className="w-5 h-5 text-[#A84743] mt-0.5" />
                 <div>
                   <div className="font-bold font-sans text-sm text-[#2C211B]">5. The Final Truth</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Side Action Panel */}
        <div className="w-full lg:w-72 flex flex-col gap-4">
          <div className="bg-panel-wood p-6 rounded-sm border border-brass/20 shadow-xl relative">
             <div className="absolute -top-3 left-1/2 -ml-4 bg-brass text-ink w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 font-bold font-serif">!</div>
             <h3 className="text-paper-kulfi font-serif text-xl mb-6 text-center mt-2">Active Investigation</h3>
             
             <div className="space-y-3">
               <Link href="/room" className="block">
                 <BrassButton className="w-full" size="lg">Start Investigation</BrassButton>
               </Link>
               <Link href="/room" className="block">
                 <BrassButton className="w-full" variant="secondary">Create Room</BrassButton>
               </Link>
             </div>

             <div className="mt-8 pt-6 border-t border-brass/10">
               <div className="flex justify-between items-center text-sm font-mono mb-2 text-paper-muted">
                 <span>Progress</span>
                 <span className="text-brass">0/5</span>
               </div>
               <div className="w-full bg-ink h-2 rounded-full overflow-hidden border border-brass/20">
                 <div className="w-0 h-full bg-brass"></div>
               </div>
             </div>
          </div>

          <div className="bg-charcoal/50 p-6 rounded-sm border border-brass/10">
            <h4 className="font-serif text-paper-muted mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brass" /> Case Notes
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              This case requires careful examination of timelines. Ensure your team cross-references the ferry schedule with witness statements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
