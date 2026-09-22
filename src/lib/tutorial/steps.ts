// 3-Step Interactive Onboarding Field Guide for Bhorer Shahar: Case Files

export interface TutorialTask {
  id: "inspect-clue" | "pin-evidence" | "review-caseboard";
  stepNumber: number;
  label: string;
  shortLabel: string;
  description: string;
  hint: string;
}

export interface TutorialProgress {
  inspectedClue: boolean;
  pinnedEvidence: boolean;
  reviewedCaseboard: boolean;
}

export const INITIAL_TUTORIAL_PROGRESS: TutorialProgress = {
  inspectedClue: false,
  pinnedEvidence: false,
  reviewedCaseboard: false,
};

export const ONBOARDING_TASKS: TutorialTask[] = [
  {
    id: "inspect-clue",
    stepNumber: 1,
    label: "Inspect an evidence card",
    shortLabel: "Inspect evidence",
    description: "Click on any exhibit card in your forensic file to examine detailed photographs, documents, or autopsy records.",
    hint: "Click the highlighted exhibit card in your dossier",
  },
  {
    id: "pin-evidence",
    stepNumber: 2,
    label: "Pin key findings to Caseboard",
    shortLabel: "Pin to Caseboard",
    description: "Publish verified discoveries from your private inventory so your fellow investigators can inspect and link them.",
    hint: "Click 'Pin to Journal / Board' inside the evidence exhibit",
  },
  {
    id: "review-caseboard",
    stepNumber: 3,
    label: "Review team Caseboard / Timeline",
    shortLabel: "Review Caseboard",
    description: "Switch to the shared caseboard or timeline to cross-reference evidence, track movements, and link deductions.",
    hint: "Open the 'Caseboard' tab in the navigation bar",
  },
];
