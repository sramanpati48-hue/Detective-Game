"use client";
import React, { useState } from "react";
import { InvestigationChatMessage } from "@/app/api/room/[roomCode]/investigation/route";
import { ClueItem } from "@/lib/data/cases/the-last-ferry";
import { soundManager } from "@/lib/audio/soundManager";
import { Send, Paperclip, MessageSquare, X, FileText } from "lucide-react";

interface RoomChatPanelProps {
  messages: InvestigationChatMessage[];
  myClues: ClueItem[];
  onSendMessage: (text: string, attachedEvidenceId?: string) => void;
  onOpenClue: (clueId: string) => void;
}

export default function RoomChatPanel({
  messages,
  myClues,
  onSendMessage,
  onOpenClue,
}: RoomChatPanelProps) {
  const [inputText, setInputText] = useState("");
  const [selectedClueId, setSelectedClueId] = useState<string>("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedClueId) return;

    soundManager.playClick();
    onSendMessage(inputText.trim(), selectedClueId || undefined);
    setInputText("");
    setSelectedClueId("");
  };

  const selectedClue = myClues.find((c) => c.id === selectedClueId);

  return (
    <div className="w-full max-w-4xl mx-auto my-4 bg-[#FAF4E8] text-[#1F1710] rounded-sm border-2 border-[#D4B26F]/60 shadow-xl overflow-hidden font-serif flex flex-col h-[600px]">
      {/* Telegraph Header */}
      <div className="bg-[#241A13] text-[#FAF4E8] p-4 flex items-center justify-between border-b border-[#C99A3C]/40 shrink-0">
        <div className="flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-[#E8C66A]" />
          <h3 className="font-serif text-base font-bold text-[#FAF4E8]">
            Lalbazar Squad Telegraph & Radio Channel
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#D9C7A6]/70">
          <span className="w-2 h-2 rounded-full bg-[#3FB950] animate-pulse" />
          <span>SECURE FREQUENCY</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]">
        {messages.map((msg) => {
          const isSystem = msg.playerId === "system";

          return (
            <div
              key={msg.id}
              className={`p-3.5 rounded-xs border shadow-xs max-w-[85%] ${
                isSystem
                  ? "bg-[#F2E5D0] border-[#8C2D32]/50 text-[#3D2C20] mx-auto w-full max-w-lg text-center"
                  : "bg-[#FAF4E8] border-[#D4B26F]/60 text-[#1F1710] ml-0"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5 font-mono text-[11px]">
                <span className="font-bold text-[#8C2D32] uppercase">
                  {msg.detectiveName}
                </span>
                <span className="text-[#665040] text-[10px]">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <p className="font-serif text-sm leading-relaxed text-[#1F1710]">
                {msg.text}
              </p>

              {/* Attached Evidence Tag */}
              {msg.attachedEvidenceId && (
                <div className="mt-2.5 pt-2 border-t border-[#D4B26F]/40 flex items-center justify-between">
                  <button
                    onClick={() => onOpenClue(msg.attachedEvidenceId!)}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#241A13] hover:bg-[#3D2C20] text-[#E8C66A] rounded-xs font-mono text-xs uppercase cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Examine Exhibit #{msg.attachedEvidenceId.toUpperCase()}</span>
                  </button>
                  <span className="font-mono text-[10px] text-[#2B4C3F] font-bold uppercase">
                    &bull; Shared to Room
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Evidence Attachment Preview */}
      {selectedClue && (
        <div className="px-4 py-2 bg-[#EFE3CF] border-t border-[#D4B26F]/60 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-3.5 h-3.5 text-[#8C2D32]" />
            <span className="font-bold text-[#8C2D32]">Attach Clue:</span>
            <span className="truncate text-[#1F1710]">{selectedClue.title}</span>
          </div>
          <button
            onClick={() => setSelectedClueId("")}
            className="p-1 hover:text-[#8C2D32] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Message Input Box */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#EFE3CF] border-t-2 border-[#D4B26F]/60 flex items-center gap-2 shrink-0"
      >
        <select
          value={selectedClueId}
          onChange={(e) => setSelectedClueId(e.target.value)}
          aria-label="Attach Evidence to Chat"
          className="p-2 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710] max-w-[150px] sm:max-w-[200px] truncate"
        >
          <option value="">Attach Exhibit...</option>
          {myClues.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Transmit telegraph message to squad..."
          className="flex-1 p-2 bg-[#FAF4E8] border border-[#C99A3C] rounded-xs text-xs font-serif text-[#1F1710] placeholder:italic"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !selectedClueId}
          className="px-4 py-2 bg-[#702428] hover:bg-[#852C32] disabled:opacity-40 text-[#FAF4E8] rounded-xs font-serif text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
