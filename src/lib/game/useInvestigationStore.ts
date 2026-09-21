import { create } from "zustand";
import {
  THE_LAST_FERRY_CASE,
  getEpisodeById,
  ClueItem,
} from "@/lib/data/cases/the-last-ferry";
import {
  CaseboardPin,
  CaseboardConnection,
  InvestigationChatMessage,
} from "@/app/api/room/[roomCode]/investigation/route";
import {
  FinalAccusationResult,
  FinalAccusationSubmission,
  CheckpointValidationResult,
} from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";

export type InvestigationTab =
  | "briefing"
  | "evidence"
  | "witnesses"
  | "caseboard"
  | "timeline"
  | "chat";

interface InvestigationStore {
  // Room and Identity
  roomCode: string;
  playerId: string;
  detectiveId: string;
  detectiveName: string;
  connectionStatus: "connected" | "reconnecting" | "offline";
  isSyncing: boolean;

  // Active Episode & Progression
  currentEpisodeId: string;
  unlockedEpisodes: string[];
  checkpointStatus: Record<
    string,
    {
      passed: boolean;
      attempts: number;
      hintsUsed: number[];
      submittedNotes?: string;
      verifiedClues?: string[];
    }
  >;

  // Evidence Segregation
  myEvidenceIds: string[];
  sharedEvidenceIds: string[];

  // Interactive Caseboard & Timeline
  caseboardPins: CaseboardPin[];
  caseboardConnections: CaseboardConnection[];
  timelineOrder: string[];
  chatMessages: InvestigationChatMessage[];
  players: Record<
    string,
    {
      playerId: string;
      detectiveId: string;
      detectiveName: string;
      lastSeen: number;
      isOnline: boolean;
    }
  >;

  // Climax
  finalAccusation?: {
    submitted: boolean;
    passed: boolean;
    result?: FinalAccusationResult;
  };

  // UI Navigation & Modals
  activeTab: InvestigationTab;
  selectedClueId: string | null;
  selectedWitnessId: string | null;
  isCheckpointModalOpen: boolean;
  isHintModalOpen: boolean;
  isAccusationOpen: boolean;
  isCinematicActive: boolean;

  // Sound
  isMuted: boolean;

  // Actions
  init: (roomCode: string, playerId?: string, detectiveId?: string, detectiveName?: string) => Promise<void>;
  pollServer: () => Promise<void>;
  setActiveTab: (tab: InvestigationTab) => void;
  setSelectedClueId: (clueId: string | null) => void;
  setSelectedWitnessId: (witnessId: string | null) => void;
  setCheckpointModalOpen: (open: boolean) => void;
  setHintModalOpen: (open: boolean) => void;
  setAccusationOpen: (open: boolean) => void;
  setCinematicActive: (active: boolean) => void;
  toggleMute: () => void;

  // Game Engine Server Actions
  shareEvidence: (evidenceId: string) => Promise<void>;
  pinEvidence: (evidenceId: string, x: number, y: number, notes?: string) => Promise<void>;
  connectEvidence: (
    sourcePinId: string,
    targetPinId: string,
    sourceEvidenceId: string,
    targetEvidenceId: string,
    deductionNotes?: string
  ) => Promise<void>;
  orderTimeline: (orderedEventIds: string[]) => Promise<void>;
  sendChat: (text: string, attachedEvidenceId?: string) => Promise<void>;
  submitCheckpoint: (
    episodeNumber: number,
    selectedClueIds: string[],
    notes: string
  ) => Promise<{ success: boolean; validation?: CheckpointValidationResult } | null>;
  useHint: (episodeKey: string, tier: number) => Promise<void>;
  submitAccusation: (
    submission: FinalAccusationSubmission
  ) => Promise<{ success: boolean; result?: FinalAccusationResult } | null>;
  switchEpisode: (episodeId: string) => Promise<void>;

  // Convenience Selectors
  getMyClues: () => ClueItem[];
  getSharedClues: () => ClueItem[];
  getAllAccessibleClues: () => ClueItem[];
  getCurrentEpisode: () => ReturnType<typeof getEpisodeById>;
  calculateCurrentIQS: () => number;
}

export const useInvestigationStore = create<InvestigationStore>((set, get) => ({
  roomCode: "",
  playerId: "solo-investigator",
  detectiveId: "ananya",
  detectiveName: "Inspector Ananya Roy",
  connectionStatus: "connected",
  isSyncing: false,

  currentEpisodeId: "ep1",
  unlockedEpisodes: ["ep1"],
  checkpointStatus: {
    ep1: { passed: false, attempts: 0, hintsUsed: [] },
    ep2: { passed: false, attempts: 0, hintsUsed: [] },
    ep3: { passed: false, attempts: 0, hintsUsed: [] },
    ep4: { passed: false, attempts: 0, hintsUsed: [] },
    ep5: { passed: false, attempts: 0, hintsUsed: [] },
  },

  myEvidenceIds: [],
  sharedEvidenceIds: [],
  caseboardPins: [],
  caseboardConnections: [],
  timelineOrder: [],
  chatMessages: [],
  players: {},
  finalAccusation: undefined,

  activeTab: "briefing",
  selectedClueId: null,
  selectedWitnessId: null,
  isCheckpointModalOpen: false,
  isHintModalOpen: false,
  isAccusationOpen: false,
  isCinematicActive: false,
  isMuted: false,

  init: async (roomCode, playerId, detectiveId, detectiveName) => {
    const finalPlayerId =
      playerId || (typeof window !== "undefined" && localStorage.getItem(`bhorer_player_id_${roomCode}`)) || `p_${Date.now()}`;
    const finalDetectiveId =
      detectiveId || (typeof window !== "undefined" && localStorage.getItem(`bhorer_detective_id_${roomCode}`)) || "ananya";
    const finalDetectiveName =
      detectiveName || (typeof window !== "undefined" && localStorage.getItem(`bhorer_detective_name_${roomCode}`)) || "Inspector Ananya Roy";

    if (typeof window !== "undefined") {
      localStorage.setItem(`bhorer_player_id_${roomCode}`, finalPlayerId);
      localStorage.setItem(`bhorer_detective_id_${roomCode}`, finalDetectiveId);
      localStorage.setItem(`bhorer_detective_name_${roomCode}`, finalDetectiveName);
    }

    set({
      roomCode,
      playerId: finalPlayerId,
      detectiveId: finalDetectiveId,
      detectiveName: finalDetectiveName,
      connectionStatus: "connected",
    });

    await get().pollServer();
  },

  pollServer: async () => {
    const { roomCode, playerId, detectiveId, detectiveName } = get();
    if (!roomCode) return;

    try {
      const url = `/api/room/${encodeURIComponent(roomCode)}/investigation?playerId=${encodeURIComponent(
        playerId
      )}&detectiveId=${encodeURIComponent(detectiveId)}&detectiveName=${encodeURIComponent(detectiveName)}`;

      const res = await fetch(url);
      if (!res.ok) {
        set({ connectionStatus: "reconnecting" });
        return;
      }

      const data = await res.json();
      set({
        connectionStatus: "connected",
        currentEpisodeId: data.currentEpisodeId || "ep1",
        unlockedEpisodes: data.unlockedEpisodes || ["ep1"],
        checkpointStatus: data.checkpointStatus || get().checkpointStatus,
        myEvidenceIds: data.myEvidenceIds || [],
        sharedEvidenceIds: data.sharedEvidenceIds || [],
        caseboardPins: data.caseboardPins || [],
        caseboardConnections: data.caseboardConnections || [],
        timelineOrder: data.timelineOrder || [],
        chatMessages: data.chatMessages || [],
        finalAccusation: data.finalAccusation,
        players: data.players || {},
      });
    } catch {
      set({ connectionStatus: "reconnecting" });
    }
  },

  setActiveTab: (tab) => {
    soundManager.playPaperSlide();
    set({ activeTab: tab });
  },

  setSelectedClueId: (clueId) => {
    if (clueId) soundManager.playPaperSlide();
    set({ selectedClueId: clueId });
  },

  setSelectedWitnessId: (witnessId) => {
    if (witnessId) soundManager.playPaperSlide();
    set({ selectedWitnessId: witnessId });
  },

  setCheckpointModalOpen: (open) => set({ isCheckpointModalOpen: open }),
  setHintModalOpen: (open) => set({ isHintModalOpen: open }),
  setAccusationOpen: (open) => set({ isAccusationOpen: open }),
  setCinematicActive: (active) => set({ isCinematicActive: active }),

  toggleMute: () => {
    const newMuted = soundManager.toggleMute();
    set({ isMuted: newMuted });
  },

  shareEvidence: async (evidenceId) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playBrassPin();

    // Optimistic update
    set((state) => ({
      sharedEvidenceIds: Array.from(new Set([...state.sharedEvidenceIds, evidenceId])),
    }));

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "share_evidence",
          playerId,
          detectiveName,
          payload: { evidenceId },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to share evidence:", e);
    }
  },

  pinEvidence: async (evidenceId, x, y, notes) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playBrassPin();

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "pin_evidence",
          playerId,
          detectiveName,
          payload: { evidenceId, x, y, notes },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to pin evidence:", e);
    }
  },

  connectEvidence: async (sourcePinId, targetPinId, sourceEvidenceId, targetEvidenceId, deductionNotes) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playBrassPin();

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "connect_evidence",
          playerId,
          detectiveName,
          payload: {
            sourcePinId,
            targetPinId,
            sourceEvidenceId,
            targetEvidenceId,
            deductionNotes,
          },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to connect evidence:", e);
    }
  },

  orderTimeline: async (orderedEventIds) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playPaperSlide();
    set({ timelineOrder: orderedEventIds });

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "order_timeline",
          playerId,
          detectiveName,
          payload: { orderedEventIds },
        }),
      });
    } catch (e) {
      console.error("Failed to update timeline order:", e);
    }
  },

  sendChat: async (text, attachedEvidenceId) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playClick();

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_chat",
          playerId,
          detectiveName,
          payload: { text, attachedEvidenceId },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to send chat:", e);
    }
  },

  submitCheckpoint: async (episodeNumber, selectedClueIds, notes) => {
    const { roomCode, playerId, detectiveName } = get();
    try {
      const res = await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_checkpoint",
          playerId,
          detectiveName,
          payload: { episodeNumber, selectedClueIds, notes },
        }),
      });
      const data = await res.json();
      if (data.validation) {
        soundManager.playRubberStamp(data.validation.passed);
      }
      await get().pollServer();
      return data;
    } catch (e) {
      console.error("Failed to submit checkpoint:", e);
      return null;
    }
  },

  useHint: async (episodeKey, tier) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playPaperSlide();

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "use_hint",
          playerId,
          detectiveName,
          payload: { episodeKey, tier },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to record hint usage:", e);
    }
  },

  submitAccusation: async (submission) => {
    const { roomCode, playerId, detectiveName } = get();
    try {
      const res = await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_accusation",
          playerId,
          detectiveName,
          payload: { submission },
        }),
      });
      const data = await res.json();
      if (data?.result?.passed) {
        soundManager.playVictoryFanfare();
      } else {
        soundManager.playTensionSting();
      }
      await get().pollServer();
      return data;
    } catch (e) {
      console.error("Failed to submit accusation:", e);
      return null;
    }
  },

  switchEpisode: async (episodeId) => {
    const { roomCode, playerId, detectiveName } = get();
    soundManager.playPaperSlide();
    set({ currentEpisodeId: episodeId });

    try {
      await fetch(`/api/room/${encodeURIComponent(roomCode)}/investigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "switch_episode",
          playerId,
          detectiveName,
          payload: { episodeId },
        }),
      });
      await get().pollServer();
    } catch (e) {
      console.error("Failed to switch episode:", e);
    }
  },

  getMyClues: () => {
    const { myEvidenceIds } = get();
    const allClues = THE_LAST_FERRY_CASE.episodes.flatMap((ep) => ep.clues);
    return allClues.filter((c) => myEvidenceIds.includes(c.id));
  },

  getSharedClues: () => {
    const { sharedEvidenceIds } = get();
    const allClues = THE_LAST_FERRY_CASE.episodes.flatMap((ep) => ep.clues);
    return allClues.filter((c) => sharedEvidenceIds.includes(c.id));
  },

  getAllAccessibleClues: () => {
    const { myEvidenceIds, sharedEvidenceIds } = get();
    const accessibleSet = new Set([...myEvidenceIds, ...sharedEvidenceIds]);
    const allClues = THE_LAST_FERRY_CASE.episodes.flatMap((ep) => ep.clues);
    return allClues.filter((c) => accessibleSet.has(c.id));
  },

  getCurrentEpisode: () => {
    const { currentEpisodeId } = get();
    return getEpisodeById(currentEpisodeId);
  },

  calculateCurrentIQS: () => {
    const { checkpointStatus, sharedEvidenceIds } = get();
    let score = 100;
    Object.values(checkpointStatus).forEach((chk) => {
      score -= Math.max(0, chk.attempts - 1) * 4;
      chk.hintsUsed.forEach((tier) => {
        score -= tier === 1 ? 2 : tier === 2 ? 5 : 8;
      });
    });
    score += Math.min(15, sharedEvidenceIds.length * 2);
    return Math.max(30, Math.min(100, score));
  },
}));
