"use client";
import React, { useState, useEffect } from "react";
import { TimelineEvent, THE_LAST_FERRY_CASE } from "@/lib/data/cases/the-last-ferry";
import { checkTimelineAccuracy } from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";
import { Clock, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TimelineBoardProps {
  currentOrder: string[];
  onOrderChange: (orderedIds: string[]) => void;
  episodeNumber?: number;
}

export default function TimelineBoard({
  currentOrder,
  onOrderChange,
  episodeNumber = 1,
}: TimelineBoardProps) {
  // Collect all timeline events from case
  const allEvents: TimelineEvent[] = [];
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    if (ep.timelineEvents) allEvents.push(...ep.timelineEvents);
  });

  // Default initial order if empty: scrambled or by episode
  const initialIds =
    currentOrder.length === allEvents.length && currentOrder.length > 0
      ? currentOrder
      : allEvents.map((e) => e.id);

  const [orderedIds, setOrderedIds] = useState<string[]>(initialIds);
  const [contradictions, setContradictions] = useState<string[]>([]);
  const [isCanon, setIsCanon] = useState(false);

  const isEarlyEpisode = episodeNumber < 3;

  useEffect(() => {
    if (currentOrder.length > 0 && currentOrder.join(",") !== orderedIds.join(",")) {
      setOrderedIds(currentOrder);
    }
  }, [currentOrder, orderedIds]);

  // Re-check accuracy whenever order changes
  useEffect(() => {
    const res = checkTimelineAccuracy(orderedIds);
    setIsCanon(res.isCorrectOrder);
    setContradictions(res.contradictionsFound);
  }, [orderedIds]);

  const moveItem = (index: number, direction: "up" | "down") => {
    soundManager.playPaperSlide();
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= orderedIds.length) return;

    const copy = [...orderedIds];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;

    setOrderedIds(copy);
    onOrderChange(copy);
  };

  const handleSlotChange = (fromIndex: number, toSlot: number) => {
    soundManager.playPaperSlide();
    const targetIdx = toSlot - 1;
    if (targetIdx < 0 || targetIdx >= orderedIds.length) return;

    const copy = [...orderedIds];
    const item = copy.splice(fromIndex, 1)[0];
    copy.splice(targetIdx, 0, item);

    setOrderedIds(copy);
    onOrderChange(copy);
  };

  const eventMap = new Map(allEvents.map((e) => [e.id, e]));

  return (
    <div className="w-full max-w-5xl mx-auto my-4 flex flex-col gap-6 font-serif">
      {/* Header */}
      <div className="bg-[#241A13] text-[#FAF4E8] p-5 rounded-xs border border-[#C99A3C]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1">
            Chronological Sequence Analysis
          </div>
          <h2 className="font-serif text-2xl font-bold">Monsoon Ferry Crossing Timeline</h2>
        </div>

        <div className="flex items-center gap-2">
          {isCanon ? (
            <div className="px-3 py-1.5 bg-[#2B4C3F] text-[#E0F2E9] border border-[#2B4C3F] font-mono text-xs uppercase tracking-wider font-bold rounded-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#8CE5B0]" />
              <span>Chronology Synchronized</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 bg-[#702428] text-[#FAF4E8] border border-[#8C2D32] font-mono text-xs uppercase tracking-wider font-bold rounded-xs flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#E8C66A]" />
              <span>Sequence Unverified</span>
            </div>
          )}
        </div>
      </div>

      {/* Early Episode Advisory Banner */}
      {isEarlyEpisode && (
        <div className="p-3.5 bg-[#18110C] border border-[#C99A3C]/40 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#D9C7A6]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#E8C66A] shrink-0" />
            <span>
              <strong>Preliminary Reconstruction (Episode {episodeNumber}):</strong> Reorder the crossing events into their true chronological sequence to expose timeline gaps and alibi contradictions.
            </span>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-[#E8C66A] uppercase px-2 py-0.5 bg-[#241A13] rounded-xs border border-[#C99A3C]/30">
            Active Dossier
          </span>
        </div>
      )}

      {/* Contradiction Alert Box */}
          {contradictions.length > 0 && (
            <div className="p-4 bg-[#F5E6E6] border-l-4 border-[#8C2D32] rounded-xs text-[#521B1E] font-serif shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-wider text-[#8C2D32]">
                <AlertTriangle className="w-4 h-4" />
                <span>Forensic Contradictions Discovered ({contradictions.length})</span>
              </div>
              <ul className="space-y-1 text-xs">
                {contradictions.map((c, i) => (
                  <li key={i} className="list-disc list-inside">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

      {/* Reorderable Timeline Slots */}
      <div className="space-y-3">
        {orderedIds.map((eventId, idx) => {
          const event = eventMap.get(eventId);
          if (!event) return null;

          return (
            <div
              key={event.id}
              className="bg-[#FAF4E8] text-[#1F1710] rounded-xs p-4 border-2 border-[#D4B26F]/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-[#8C2D32]"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Slot Number & Time Badge */}
                <div className="shrink-0 flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-[#241A13] text-[#E8C66A] border border-[#C99A3C] font-mono text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-[#8C2D32] mt-1">
                    {event.timeDisplay}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-serif font-bold text-base text-[#1F1710]">
                      {event.title}
                    </h4>
                    <span className="font-mono text-[10px] text-[#665040] uppercase tracking-wider px-1.5 py-0.5 bg-[#EFE3CF] border border-[#C99A3C]/30 rounded-xs">
                      Source: {event.source}
                    </span>
                  </div>
                  <p className="font-serif text-xs text-[#4A3728] leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Slot Reorder Controls (Keyboard Accessible Dropdown + Up/Down Buttons) */}
              <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                {/* Dropdown for direct keyboard navigation */}
                <label className="text-[10px] font-mono text-[#665040] uppercase">
                  Slot:
                  <select
                    aria-label={`Position for ${event.title}`}
                    value={idx + 1}
                    onChange={(e) => handleSlotChange(idx, Number(e.target.value))}
                    className="ml-1 px-2 py-1 bg-[#FAF4E8] border border-[#C99A3C] text-xs font-mono text-[#1F1710] rounded-xs"
                  >
                    {orderedIds.map((_, slotIdx) => (
                      <option key={slotIdx + 1} value={slotIdx + 1}>
                        #{slotIdx + 1}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Up/Down buttons */}
                <button
                  onClick={() => moveItem(idx, "up")}
                  disabled={idx === 0}
                  aria-label="Move Up"
                  className="p-1.5 rounded-xs bg-[#241A13] text-[#FAF4E8] hover:bg-[#3D2C20] disabled:opacity-30 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => moveItem(idx, "down")}
                  disabled={idx === orderedIds.length - 1}
                  aria-label="Move Down"
                  className="p-1.5 rounded-xs bg-[#241A13] text-[#FAF4E8] hover:bg-[#3D2C20] disabled:opacity-30 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
