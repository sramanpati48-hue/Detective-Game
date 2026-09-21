import { THE_LAST_FERRY_CASE, TimelineEvent } from "@/lib/data/cases/the-last-ferry";

export interface CheckpointValidationResult {
  passed: boolean;
  scoreDelta: number;
  message: string;
  feedback: string;
  missingClueHints?: string[];
}

export interface FinalAccusationSubmission {
  plannerId: string;
  accompliceId: string;
  methodDescription: string;
  decisiveClueIds: string[];
}

export interface FinalAccusationResult {
  passed: boolean;
  rank: "A+" | "A" | "B" | "C" | "D";
  finalIQS: number;
  breakdown: {
    baseScore: number;
    plannerCorrect: boolean;
    accompliceCorrect: boolean;
    decisiveCluesMatched: number;
    totalHintsUsed: number;
    failedAttempts: number;
    collaborationBonus: number;
  };
  narrativeReview: string;
}

/**
 * Validates checkpoint progress for Episodes 1 through 5
 */
export function validateCheckpoint(
  episodeNumber: number,
  selectedClueIds: string[],
  playerNotes: string
): CheckpointValidationResult {
  const episode = THE_LAST_FERRY_CASE.episodes.find((ep) => ep.episodeNumber === episodeNumber);
  if (!episode) {
    return {
      passed: false,
      scoreDelta: -5,
      message: "Episode not found",
      feedback: "Invalid episode data.",
    };
  }

  const expectedClues = episode.checkpoint.expectedClueIds;
  const expectedKeywords = episode.checkpoint.expectedKeywords;

  // Check how many expected clues were provided
  const matchedClues = expectedClues.filter((id) => selectedClueIds.includes(id));
  const hasRequiredClues = matchedClues.length >= Math.ceil(expectedClues.length * 0.5); // at least 50% or matching core clue

  // Check keyword relevance in notes
  const notesLower = playerNotes.toLowerCase();
  const matchedKeywords = expectedKeywords.filter((kw) => notesLower.includes(kw.toLowerCase()));
  const hasKeywordRelevance = matchedKeywords.length >= 1 || playerNotes.trim().length > 25;

  if (hasRequiredClues || (selectedClueIds.length > 0 && hasKeywordRelevance)) {
    return {
      passed: true,
      scoreDelta: 25,
      message: "EVIDENCE VERIFIED",
      feedback: episode.checkpoint.successExplanation,
    };
  }

  // Failed attempt: produce helpful non-spoiler feedback
  let feedback = "The submitted theory lacks decisive corroboration. Cross-reference physical findings with witness logs.";
  if (selectedClueIds.length === 0) {
    feedback = "You must select at least one supporting piece of evidence from your case file.";
  } else if (episodeNumber === 1) {
    feedback = "Examine the physical items recovered from Seat 14. Does the condition of the umbrella match a monsoon storm?";
  } else if (episodeNumber === 2) {
    feedback = "Look closely at the maintenance hatch and the deck log. Was the hatch really secured during transit?";
  } else if (episodeNumber === 3) {
    feedback = "Compare Harun Sheikh's whereabouts with the CCTV gap at Ghat No. 6.";
  } else if (episodeNumber === 4) {
    feedback = "Identify the financial records that give Debashish Pal a motive to silence the accountant.";
  }

  return {
    passed: false,
    scoreDelta: -5,
    message: "DEFICIENT EVIDENCE",
    feedback,
  };
}

/**
 * Validates whether two clues form a canonical deduction connection
 */
export function validateEvidenceConnection(
  sourceId: string,
  targetId: string
): { isValid: boolean; reason?: string } {
  for (const ep of THE_LAST_FERRY_CASE.episodes) {
    if (ep.connectionPairs) {
      const match = ep.connectionPairs.find(
        (p) =>
          (p.sourceId === sourceId && p.targetId === targetId) ||
          (p.sourceId === targetId && p.targetId === sourceId)
      );
      if (match) {
        return { isValid: true, reason: match.reason };
      }
    }
  }

  // Default logical connections based on tags
  return {
    isValid: false,
    reason: "No direct forensic or narrative link establishes a deduction between these two items yet.",
  };
}

/**
 * Checks timeline order against canonical chronology
 */
export function checkTimelineAccuracy(orderedEventIds: string[]): {
  isCorrectOrder: boolean;
  contradictionsFound: string[];
  correctCount: number;
} {
  const allTimelineEvents: TimelineEvent[] = [];
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    if (ep.timelineEvents) {
      allTimelineEvents.push(...ep.timelineEvents);
    }
  });

  let correctCount = 0;
  const contradictionsFound: string[] = [];

  orderedEventIds.forEach((id, idx) => {
    const event = allTimelineEvents.find((e) => e.id === id);
    if (event) {
      if (event.canonOrder === idx + 1) {
        correctCount++;
      }
      if (event.isContradiction && event.contradictionReason) {
        contradictionsFound.push(`${event.timeDisplay}: ${event.contradictionReason}`);
      }
    }
  });

  return {
    isCorrectOrder: correctCount === orderedEventIds.length && orderedEventIds.length > 0,
    contradictionsFound,
    correctCount,
  };
}

/**
 * Evaluates the Episode 5 Final Accusation
 */
export function evaluateFinalAccusation(
  submission: FinalAccusationSubmission,
  state: {
    totalHintsUsed: number;
    failedAttempts: number;
    sharedCount: number;
  }
): FinalAccusationResult {
  const { solution } = THE_LAST_FERRY_CASE;

  const normalize = (s: string) => (s ? s.toLowerCase().replace(/_/g, "-").trim() : "");
  const plannerCorrect = normalize(submission.plannerId) === normalize(solution.plannerId);
  const accompliceCorrect = normalize(submission.accompliceId) === normalize(solution.accompliceId);

  const normalizedSolutionClues = solution.decisiveClues.map(normalize);
  const decisiveCluesMatched = submission.decisiveClueIds.filter((id) =>
    normalizedSolutionClues.includes(normalize(id))
  ).length;

  const passed = plannerCorrect && accompliceCorrect && decisiveCluesMatched >= 2;

  // IQS Calculation
  let baseScore = 100;
  if (!plannerCorrect) baseScore -= 30;
  if (!accompliceCorrect) baseScore -= 20;
  baseScore -= (3 - decisiveCluesMatched) * 10;
  baseScore -= state.totalHintsUsed * 5;
  baseScore -= state.failedAttempts * 3;

  const collaborationBonus = Math.min(15, state.sharedCount * 3);
  const finalIQS = Math.max(20, Math.min(100, baseScore + collaborationBonus));

  let rank: "A+" | "A" | "B" | "C" | "D" = "C";
  if (finalIQS >= 92) rank = "A+";
  else if (finalIQS >= 80) rank = "A";
  else if (finalIQS >= 65) rank = "B";
  else if (finalIQS >= 50) rank = "C";
  else rank = "D";

  let narrativeReview = "";
  if (passed) {
    narrativeReview = `Magnificent deduction, Detective. You unmasked Debashish Pal as the mastermind of the 14-crore municipal diversion scheme and proved that Harun Sheikh deliberately facilitated Abir Basu's abduction through the lower maintenance hatch. The Lalbazar Special Branch raided the Strand Road warehouse before dawn, securing Basu alive along with the complete unburned ledger.`;
  } else if (plannerCorrect && !accompliceCorrect) {
    narrativeReview = `You correctly identified Debashish Pal as the corrupt financier behind the plot, but failed to nail his inside accomplice on the ferry deck. Harun Sheikh destroyed the ferry maintenance logbook before being apprehended.`;
  } else {
    narrativeReview = `Your indictment failed to convince the presiding magistrate. Without establishing the direct chain between the maintenance hatch, the CCTV blackout, and the ledger fraud, the defense secured bail and the conspirators evacuated the warehouse.`;
  }

  return {
    passed,
    rank,
    finalIQS,
    breakdown: {
      baseScore,
      plannerCorrect,
      accompliceCorrect,
      decisiveCluesMatched,
      totalHintsUsed: state.totalHintsUsed,
      failedAttempts: state.failedAttempts,
      collaborationBonus,
    },
    narrativeReview,
  };
}
