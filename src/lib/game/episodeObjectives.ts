// Goal-Based Objective System for Bhorer Shahar: Case Files
// Designed specifically for Episode 1 to accustom players to the core investigative loop:
// 1. Forensic Examination -> 2. Witness Interrogation -> 3. Caseboard Organization -> 4. Timeline Reconstruction -> 5. Checkpoint Clearance

export interface EpisodeObjective {
  id: string;
  stepNumber: number;
  title: string;
  shortLabel: string;
  category: "forensic" | "witness" | "caseboard" | "timeline" | "checkpoint";
  description: string;
  instruction: string;
  actionLabel: string;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
  navTargetTab?: "briefing" | "evidence" | "witnesses" | "caseboard" | "timeline" | "chat";
  opensModal?: "checkpoint" | "hint";
  recommendedClueId?: string;
  recommendedWitnessId?: string;
}

export const EPISODE_1_OBJECTIVES_DEFINITION = [
  {
    id: "ep1-obj-forensics",
    stepNumber: 1,
    title: "Examine Crime Scene Exhibits",
    shortLabel: "Examine Exhibits",
    category: "forensic" as const,
    description: "Inspect the physical exhibits left on Seat 14. Look for details that contradict the official police accidental drowning claim.",
    instruction: "Open and examine at least 2 exhibit cards in your Forensic File (e.g. the dry umbrella or crime scene photo).",
    actionLabel: "View Evidence Dossier",
    targetCount: 2,
    navTargetTab: "evidence" as const,
    recommendedClueId: "c1_seat_14_photo",
  },
  {
    id: "ep1-obj-witnesses",
    stepNumber: 2,
    title: "Interrogate River Ferry Witnesses",
    shortLabel: "Interrogate Witnesses",
    category: "witness" as const,
    description: "Cross-examine Captain Prakash Nair and Inspector Banerjee to uncover inconsistencies in their recollections of the crossing.",
    instruction: "Switch to the Witnesses tab and review witness statements on record to detect testimony flaws.",
    actionLabel: "Interview Witnesses",
    targetCount: 1,
    navTargetTab: "witnesses" as const,
    recommendedWitnessId: "captain-prakash-nair",
  },
  {
    id: "ep1-obj-caseboard",
    stepNumber: 3,
    title: "Pin Key Evidence to the Caseboard",
    shortLabel: "Pin to Caseboard",
    category: "caseboard" as const,
    description: "Organize your deductions on the shared corkboard. Publishing key findings ensures your team can link facts and string red yarn connections.",
    instruction: "Pin an exhibit from your dossier and open the Caseboard to review team deductions.",
    actionLabel: "Open Caseboard",
    targetCount: 1,
    navTargetTab: "caseboard" as const,
  },
  {
    id: "ep1-obj-timeline",
    stepNumber: 4,
    title: "Reconstruct Timeline & Connections",
    shortLabel: "Review Timeline",
    category: "timeline" as const,
    description: "Establish the exact chronology of events around the 10:15 PM departure from Ghat No. 6 to isolate impossible travel times.",
    instruction: "Review the Timeline & Links tab to cross-examine timestamps and inspect suspect alibis.",
    actionLabel: "Inspect Timeline",
    targetCount: 1,
    navTargetTab: "timeline" as const,
  },
  {
    id: "ep1-obj-checkpoint",
    stepNumber: 5,
    title: "Deconstruct the Accident Theory",
    shortLabel: "Clear Checkpoint 1",
    category: "checkpoint" as const,
    description: "Submit your forensic consensus to Lalbazar CID: prove that Seat 14 was staged and that Abir Basu could not have fallen accidentally.",
    instruction: "Click 'Review Checkpoint', cite the decisive contradictory exhibits (dry umbrella, hydrophobia, staged bench), and advance to Episode 2.",
    actionLabel: "Submit Checkpoint",
    targetCount: 1,
    opensModal: "checkpoint" as const,
  },
];

export interface ObjectiveTrackingState {
  inspectedClueIds: string[];
  reviewedWitnessIds: string[];
  pinnedClueCount: number;
  visitedCaseboard: boolean;
  reviewedTimeline: boolean;
  checkpointPassed: boolean;
}

export function getEpisodeObjectives(
  episodeNumber: number,
  tracking: ObjectiveTrackingState
): {
  objectives: EpisodeObjective[];
  completedCount: number;
  allCompleted: boolean;
  currentObjective: EpisodeObjective | null;
  activeStepNumber: number;
} {
  if (episodeNumber === 1) {
    // 1. Strict Sequential Progression Validation: Step N requires Step N-1 to be completed!
    // Step 1: Forensics (Inspect at least 2 exhibits)
    const step1Done = tracking.inspectedClueIds.length >= 2;

    // Step 2: Witnesses (requires Step 1 done AND at least 1 witness interrogated)
    const step2Done = step1Done && tracking.reviewedWitnessIds.length >= 1;

    // Step 3: Caseboard (requires Step 2 done AND evidence pinned + caseboard visited)
    const step3Done = step2Done && (tracking.pinnedClueCount >= 1 && tracking.visitedCaseboard);

    // Step 4: Timeline (requires Step 3 done AND timeline reviewed)
    const step4Done = step3Done && tracking.reviewedTimeline;

    // Step 5: Checkpoint (requires Step 4 done AND checkpoint submitted & passed)
    const step5Done = step4Done && tracking.checkpointPassed;

    // 2. Identify active step number (1 through 5, or 6 when all are cleared)
    let activeStepNumber = 1;
    if (step1Done) activeStepNumber = 2;
    if (step2Done) activeStepNumber = 3;
    if (step3Done) activeStepNumber = 4;
    if (step4Done) activeStepNumber = 5;
    if (step5Done) activeStepNumber = 6;

    const completedMap: Record<number, boolean> = {
      1: step1Done,
      2: step2Done,
      3: step3Done,
      4: step4Done,
      5: step5Done,
    };

    const objectives: EpisodeObjective[] = EPISODE_1_OBJECTIVES_DEFINITION.map((def) => {
      const stepNum = def.stepNumber;
      const isCompleted = completedMap[stepNum] || false;
      const isCurrent = activeStepNumber === stepNum;
      const isLocked = stepNum > activeStepNumber;

      let currentCount = 0;
      if (isCompleted) {
        currentCount = def.targetCount;
      } else if (isCurrent) {
        if (stepNum === 1) {
          currentCount = Math.min(tracking.inspectedClueIds.length, def.targetCount);
        } else if (stepNum === 2) {
          currentCount = Math.min(tracking.reviewedWitnessIds.length, def.targetCount);
        } else if (stepNum === 3) {
          currentCount = tracking.pinnedClueCount >= 1 && tracking.visitedCaseboard ? 1 : 0;
        } else if (stepNum === 4) {
          currentCount = tracking.reviewedTimeline ? 1 : 0;
        } else if (stepNum === 5) {
          currentCount = tracking.checkpointPassed ? 1 : 0;
        }
      } else {
        // Locked steps show 0
        currentCount = 0;
      }

      return {
        ...def,
        currentCount,
        isCompleted,
        isCurrent,
        isLocked,
      };
    });

    const completedCount = objectives.filter((o) => o.isCompleted).length;
    const allCompleted = completedCount === objectives.length;
    const currentObjective = objectives.find((o) => o.isCurrent) || null;

    return { objectives, completedCount, allCompleted, currentObjective, activeStepNumber };
  }

  // Fallback for subsequent episodes (Episodes 2 - 5)
  const defaultDefs = [
    {
      id: `ep${episodeNumber}-obj-clues`,
      stepNumber: 1,
      title: "Analyze Chapter Forensic Exhibits",
      shortLabel: "Analyze Exhibits",
      category: "forensic" as const,
      description: "Examine newly unlocked chapter evidence to uncover concealed leads.",
      instruction: "Inspect the evidence exhibits unlocked for this episode.",
      actionLabel: "View Evidence",
      targetCount: 2,
      navTargetTab: "evidence" as const,
    },
    {
      id: `ep${episodeNumber}-obj-caseboard`,
      stepNumber: 2,
      title: "Update Caseboard Connections",
      shortLabel: "Update Caseboard",
      category: "caseboard" as const,
      description: "Link new clues on the shared caseboard to construct emerging suspect theories.",
      instruction: "Pin or connect evidence on the communal caseboard.",
      actionLabel: "Open Caseboard",
      targetCount: 1,
      navTargetTab: "caseboard" as const,
    },
    {
      id: `ep${episodeNumber}-obj-checkpoint`,
      stepNumber: 3,
      title: "Submit Chapter Checkpoint",
      shortLabel: "Submit Checkpoint",
      category: "checkpoint" as const,
      description: "Present your hypothesis to clear this chapter and unlock the next narrative layer.",
      instruction: "Complete and submit the chapter checkpoint review.",
      actionLabel: "Review Checkpoint",
      targetCount: 1,
      opensModal: "checkpoint" as const,
    },
  ];

  const step1Done = tracking.inspectedClueIds.length >= 2;
  const step2Done = step1Done && tracking.pinnedClueCount >= 1;
  const step3Done = step2Done && tracking.checkpointPassed;

  let activeStepNumber = 1;
  if (step1Done) activeStepNumber = 2;
  if (step2Done) activeStepNumber = 3;
  if (step3Done) activeStepNumber = 4;

  const completedMap: Record<number, boolean> = {
    1: step1Done,
    2: step2Done,
    3: step3Done,
  };

  const defaultObjectives: EpisodeObjective[] = defaultDefs.map((def) => {
    const stepNum = def.stepNumber;
    const isCompleted = completedMap[stepNum] || false;
    const isCurrent = activeStepNumber === stepNum;
    const isLocked = stepNum > activeStepNumber;

    let currentCount = 0;
    if (isCompleted) {
      currentCount = def.targetCount;
    } else if (isCurrent) {
      if (stepNum === 1) currentCount = Math.min(tracking.inspectedClueIds.length, def.targetCount);
      else if (stepNum === 2) currentCount = Math.min(tracking.pinnedClueCount, def.targetCount);
      else if (stepNum === 3) currentCount = tracking.checkpointPassed ? 1 : 0;
    }

    return {
      ...def,
      currentCount,
      isCompleted,
      isCurrent,
      isLocked,
    };
  });

  const completedCount = defaultObjectives.filter((o) => o.isCompleted).length;
  const allCompleted = completedCount === defaultObjectives.length;
  const currentObjective = defaultObjectives.find((o) => o.isCurrent) || null;

  return { objectives: defaultObjectives, completedCount, allCompleted, currentObjective, activeStepNumber };
}
