import { NextRequest, NextResponse } from "next/server";
import { getEpisodeById } from "@/lib/data/cases/the-last-ferry";
import {
  validateCheckpoint,
  evaluateFinalAccusation,
  validateEvidenceConnection,
  FinalAccusationResult,
} from "@/lib/game/checkpointValidator";

export interface CaseboardPin {
  id: string;
  evidenceId: string;
  x: number;
  y: number;
  notes?: string;
  sharedBy: string;
  sharedByName: string;
  sharedAt: number;
}

export interface CaseboardConnection {
  id: string;
  sourcePinId: string;
  targetPinId: string;
  sourceEvidenceId: string;
  targetEvidenceId: string;
  deductionNotes: string;
  isCanonVerified: boolean;
  createdBy: string;
}

export interface InvestigationChatMessage {
  id: string;
  playerId: string;
  detectiveName: string;
  detectiveAvatar?: string;
  text: string;
  attachedEvidenceId?: string;
  timestamp: number;
}

export interface RoomInvestigationState {
  roomCode: string;
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
  playerEvidence: Record<string, string[]>; // playerId -> clueIds[]
  sharedEvidence: string[]; // clueIds visible to everyone
  caseboardPins: CaseboardPin[];
  caseboardConnections: CaseboardConnection[];
  timelineOrder: string[]; // ordered timeline event IDs
  chatMessages: InvestigationChatMessage[];
  finalAccusation?: {
    submitted: boolean;
    passed: boolean;
    result?: FinalAccusationResult;
  };
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
  createdAt: number;
  updatedAt: number;
}

// Global server memory store to survive hot reload
declare global {
  var __bhorerInvestigationStore: Map<string, RoomInvestigationState> | undefined;
}

const investigationStore =
  globalThis.__bhorerInvestigationStore ?? new Map<string, RoomInvestigationState>();
if (process.env.NODE_ENV !== "production") {
  globalThis.__bhorerInvestigationStore = investigationStore;
}

/**
 * Initializes or retrieves room investigation state
 */
function getOrCreateRoom(roomCode: string): RoomInvestigationState {
  let state = investigationStore.get(roomCode);
  if (!state) {
    state = {
      roomCode,
      currentEpisodeId: "ep1",
      unlockedEpisodes: ["ep1"],
      checkpointStatus: {
        ep1: { passed: false, attempts: 0, hintsUsed: [] },
        ep2: { passed: false, attempts: 0, hintsUsed: [] },
        ep3: { passed: false, attempts: 0, hintsUsed: [] },
        ep4: { passed: false, attempts: 0, hintsUsed: [] },
        ep5: { passed: false, attempts: 0, hintsUsed: [] },
      },
      playerEvidence: {},
      sharedEvidence: [],
      caseboardPins: [],
      caseboardConnections: [],
      timelineOrder: [],
      chatMessages: [
        {
          id: "msg_init_01",
          playerId: "system",
          detectiveName: "Inspector S. Banerjee",
          text: "Attention detectives. We have secured Ghat No. 8 and passenger manifests for the 20:45 crossing. Share any findings to the caseboard immediately.",
          timestamp: Date.now(),
        },
      ],
      players: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    investigationStore.set(roomCode, state);
  }
  return state;
}

/**
 * Distributes clues for the current episode to players based on solo/duo/squad assignment
 */
function ensurePlayerClues(state: RoomInvestigationState, playerId: string, episodeId: string) {
  const episode = getEpisodeById(episodeId);
  if (!episode) return;

  if (!state.playerEvidence[playerId]) {
    state.playerEvidence[playerId] = [];
  }

  const existing = new Set(state.playerEvidence[playerId]);
  const isSolo =
    playerId.startsWith("solo") ||
    state.roomCode.startsWith("SOLO") ||
    Object.keys(state.players).length <= 1;

  if (isSolo) {
    episode.clues.forEach((clue) => {
      if (!existing.has(clue.id)) {
        state.playerEvidence[playerId].push(clue.id);
      }
    });
    return;
  }

  // Multiplayer / Squad Room Mode: determine player slot (0-indexed)
  const playerIds = Object.keys(state.players);
  let playerIndex = playerIds.indexOf(playerId);
  if (playerIndex < 0) playerIndex = 0;

  episode.clues.forEach((clue) => {
    if (playerIndex === 0) {
      // Player 1 (Lead Investigator): physical exhibits & crime scene photos
      if (clue.isPrivateTo === "player_1" || clue.type === "photo" || clue.type === "physical") {
        if (!existing.has(clue.id)) state.playerEvidence[playerId].push(clue.id);
      }
    } else if (playerIndex === 1) {
      // Player 2 (Analyst): documents, official memos, forensics, and audio recordings
      if (
        clue.isPrivateTo === "player_2" ||
        clue.type === "document" ||
        clue.type === "forensic" ||
        clue.type === "audio"
      ) {
        if (!existing.has(clue.id)) state.playerEvidence[playerId].push(clue.id);
      }
    } else {
      // Player 3/4: split or general
      if (playerIndex % 2 === 0 && (clue.type === "photo" || clue.type === "physical")) {
        if (!existing.has(clue.id)) state.playerEvidence[playerId].push(clue.id);
      } else if (clue.type === "document" || clue.type === "forensic" || clue.type === "audio") {
        if (!existing.has(clue.id)) state.playerEvidence[playerId].push(clue.id);
      }
    }
  });
}

// GET: Retrieve state scoped for requesting player
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  const searchParams = request.nextUrl.searchParams;
  const playerId = searchParams.get("playerId") || "solo-investigator";
  const detectiveId = searchParams.get("detectiveId") || "ananya";
  const detectiveName = searchParams.get("detectiveName") || "Detective";

  const state = getOrCreateRoom(roomCode);

  // Update player presence
  state.players[playerId] = {
    playerId,
    detectiveId,
    detectiveName,
    lastSeen: Date.now(),
    isOnline: true,
  };

  // Ensure clues are assigned
  ensurePlayerClues(state, playerId, state.currentEpisodeId);

  // Return player-scoped payload:
  // ONLY myEvidence (private to this player) + sharedEvidence (published to room)
  const myEvidenceIds = state.playerEvidence[playerId] || [];
  const sharedEvidenceIds = state.sharedEvidence;

  return NextResponse.json({
    roomCode: state.roomCode,
    currentEpisodeId: state.currentEpisodeId,
    unlockedEpisodes: state.unlockedEpisodes,
    checkpointStatus: state.checkpointStatus,
    myEvidenceIds,
    sharedEvidenceIds,
    caseboardPins: state.caseboardPins,
    caseboardConnections: state.caseboardConnections,
    timelineOrder: state.timelineOrder,
    chatMessages: state.chatMessages,
    finalAccusation: state.finalAccusation,
    players: state.players,
    updatedAt: state.updatedAt,
  });
}

// POST: Actions on Room Investigation State
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  try {
    const body = await request.json();
    const { action, playerId = "solo-investigator", detectiveName = "Detective", payload } = body;

    const state = getOrCreateRoom(roomCode);
    state.updatedAt = Date.now();

    // Update presence
    if (state.players[playerId]) {
      state.players[playerId].lastSeen = Date.now();
      state.players[playerId].isOnline = true;
    }

    switch (action) {
      // 1. Share Evidence to room
      case "share_evidence": {
        const { evidenceId } = payload;
        if (evidenceId && !state.sharedEvidence.includes(evidenceId)) {
          state.sharedEvidence.push(evidenceId);

          // Add broadcast message
          state.chatMessages.push({
            id: `msg_share_${Date.now()}`,
            playerId,
            detectiveName,
            text: `Pinned new discovery to the shared caseboard.`,
            attachedEvidenceId: evidenceId,
            timestamp: Date.now(),
          });
        }
        break;
      }

      // 2. Add or update pin on caseboard
      case "pin_evidence": {
        const { evidenceId, x, y, notes } = payload;
        if (evidenceId) {
          if (!state.sharedEvidence.includes(evidenceId)) {
            state.sharedEvidence.push(evidenceId);
          }

          const existingIndex = state.caseboardPins.findIndex((p) => p.evidenceId === evidenceId);
          if (existingIndex >= 0) {
            state.caseboardPins[existingIndex].x = x;
            state.caseboardPins[existingIndex].y = y;
            if (notes !== undefined) state.caseboardPins[existingIndex].notes = notes;
          } else {
            state.caseboardPins.push({
              id: `pin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
              evidenceId,
              x,
              y,
              notes,
              sharedBy: playerId,
              sharedByName: detectiveName,
              sharedAt: Date.now(),
            });
          }
        }
        break;
      }

      // 2b. Remove pin from caseboard
      case "unpin_evidence": {
        const { evidenceId } = payload;
        if (evidenceId) {
          state.caseboardPins = state.caseboardPins.filter((p) => p.evidenceId !== evidenceId);
          state.caseboardConnections = state.caseboardConnections.filter(
            (c) => c.sourceEvidenceId !== evidenceId && c.targetEvidenceId !== evidenceId
          );
        }
        break;
      }

      // 2c. Remove connection line
      case "delete_connection": {
        const { connectionId } = payload;
        if (connectionId) {
          state.caseboardConnections = state.caseboardConnections.filter((c) => c.id !== connectionId);
        }
        break;
      }

      // 3. Connect two clues on caseboard
      case "connect_evidence": {
        const { sourcePinId, targetPinId, sourceEvidenceId, targetEvidenceId, deductionNotes } = payload;
        const validation = validateEvidenceConnection(sourceEvidenceId, targetEvidenceId);

        const connection: CaseboardConnection = {
          id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          sourcePinId,
          targetPinId,
          sourceEvidenceId,
          targetEvidenceId,
          deductionNotes: deductionNotes || validation.reason || "Connected deduction",
          isCanonVerified: validation.isValid,
          createdBy: detectiveName,
        };

        state.caseboardConnections.push(connection);
        break;
      }

      // 4. Update Timeline ordering
      case "order_timeline": {
        const { orderedEventIds } = payload;
        if (Array.isArray(orderedEventIds)) {
          state.timelineOrder = orderedEventIds;
        }
        break;
      }

      // 5. Send Chat Message
      case "send_chat": {
        const { text, attachedEvidenceId } = payload;
        if (text || attachedEvidenceId) {
          if (attachedEvidenceId && !state.sharedEvidence.includes(attachedEvidenceId)) {
            state.sharedEvidence.push(attachedEvidenceId);
          }
          state.chatMessages.push({
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            playerId,
            detectiveName,
            text: text || "Refer to attached case document.",
            attachedEvidenceId,
            timestamp: Date.now(),
          });
        }
        break;
      }

      // 6. Submit Episode Checkpoint
      case "submit_checkpoint": {
        const { episodeNumber, selectedClueIds = [], notes = "" } = payload;
        const episodeKey = `ep${episodeNumber}`;
        const currentCheck = state.checkpointStatus[episodeKey] || { passed: false, attempts: 0, hintsUsed: [] };
        
        currentCheck.attempts += 1;
        const result = validateCheckpoint(episodeNumber, selectedClueIds, notes);

        if (result.passed) {
          currentCheck.passed = true;
          currentCheck.submittedNotes = notes;
          currentCheck.verifiedClues = selectedClueIds;

          // Unlock next episode
          const nextEpKey = `ep${episodeNumber + 1}`;
          if (episodeNumber < 5 && !state.unlockedEpisodes.includes(nextEpKey)) {
            state.unlockedEpisodes.push(nextEpKey);
            state.currentEpisodeId = nextEpKey;
            // Distribute clues for new episode
            Object.keys(state.players).forEach((pId) => {
              ensurePlayerClues(state, pId, nextEpKey);
            });
          }
        }

        state.checkpointStatus[episodeKey] = currentCheck;

        return NextResponse.json({
          success: true,
          validation: result,
          checkpointStatus: state.checkpointStatus,
          currentEpisodeId: state.currentEpisodeId,
          unlockedEpisodes: state.unlockedEpisodes,
        });
      }

      // 7. Request Hint
      case "use_hint": {
        const { episodeKey, tier } = payload;
        const currentCheck = state.checkpointStatus[episodeKey];
        if (currentCheck && !currentCheck.hintsUsed.includes(tier)) {
          currentCheck.hintsUsed.push(tier);
        }
        break;
      }

      // 8. Submit Final Accusation
      case "submit_accusation": {
        const { submission } = payload;
        const totalHints = Object.values(state.checkpointStatus).reduce(
          (acc, c) => acc + c.hintsUsed.length,
          0
        );
        const allHintsUsed: number[] = Object.values(state.checkpointStatus).flatMap((c) => c.hintsUsed);
        const totalAttempts = Object.values(state.checkpointStatus).reduce(
          (acc, c) => acc + Math.max(0, c.attempts - 1),
          0
        );
        const isSoloRoom =
          Object.keys(state.players).length <= 1 ||
          state.roomCode.startsWith("SOLO") ||
          playerId.startsWith("solo");

        const result = evaluateFinalAccusation(submission, {
          totalHintsUsed: totalHints,
          hintsUsedByTier: allHintsUsed,
          failedAttempts: totalAttempts,
          sharedCount: state.sharedEvidence.length,
          isSoloRoom,
        });

        state.finalAccusation = {
          submitted: true,
          passed: result.passed,
          result,
        };

        return NextResponse.json({
          success: true,
          result,
          finalAccusation: state.finalAccusation,
        });
      }

      // 9. Reconnect player
      case "reconnect_player": {
        const { detectiveId } = payload;
        state.players[playerId] = {
          playerId,
          detectiveId: detectiveId || "ananya",
          detectiveName,
          lastSeen: Date.now(),
          isOnline: true,
        };
        break;
      }

      // 10. Switch current active episode
      case "switch_episode": {
        const { episodeId } = payload;
        const targetEp = getEpisodeById(episodeId);
        const isUnlocked =
          targetEp &&
          state.unlockedEpisodes.some((unlocked) => {
            const ep = getEpisodeById(unlocked);
            return ep?.episodeNumber === targetEp.episodeNumber;
          });

        if (targetEp && isUnlocked) {
          const epKey = `ep${targetEp.episodeNumber}`;
          state.currentEpisodeId = epKey;
          Object.keys(state.players).forEach((pId) => {
            ensurePlayerClues(state, pId, epKey);
          });
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      roomCode: state.roomCode,
      currentEpisodeId: state.currentEpisodeId,
      unlockedEpisodes: state.unlockedEpisodes,
      checkpointStatus: state.checkpointStatus,
      sharedEvidenceIds: state.sharedEvidence,
      caseboardPins: state.caseboardPins,
      caseboardConnections: state.caseboardConnections,
      timelineOrder: state.timelineOrder,
      chatMessages: state.chatMessages,
      players: state.players,
      updatedAt: state.updatedAt,
    });
  } catch (e) {
    console.error("Investigation route error:", e);
    return NextResponse.json({ error: "Failed to update investigation state" }, { status: 500 });
  }
}
