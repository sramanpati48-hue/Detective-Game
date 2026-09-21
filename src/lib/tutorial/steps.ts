export interface TutorialStep {
  id: string;
  stepNumber: number;
  totalSteps?: number;
  targetTutorialId?: string; // matches data-tutorial-id attribute
  targetSecondaryIds?: string[]; // e.g. for step 5 cycle through tabs
  title: string;
  description: string;
  ctaText?: string;
  requiresAction?: "click-target" | "none";
  positionPreference?: "bottom" | "top" | "left" | "right" | "center";
  isMultiplayerOnly?: boolean;
  isCentered?: boolean;
}

export const FIRST_TIME_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "welcome",
    stepNumber: 1,
    title: "WELCOME TO LALBAZAR",
    description:
      "Every case in Bhorer Shahar follows a true story. Your job is not to guess — it's to prove it. Let's walk through your first investigation.",
    ctaText: "Begin Walkthrough",
    isCentered: true,
    positionPreference: "center",
  },
  {
    id: "episode-structure",
    stepNumber: 2,
    targetTutorialId: "tutorial-episode-selector",
    title: "EPISODE PROGRESSION",
    description:
      "Every case unfolds across five episodes. You can explore freely within an episode, but the story always moves forward in order.",
    ctaText: "Next",
    positionPreference: "bottom",
  },
  {
    id: "evidence-viewer",
    stepNumber: 3,
    targetTutorialId: "tutorial-first-clue",
    title: "FORENSIC EXHIBITS",
    description:
      "Click on evidence to examine it closely. Photos, documents, and objects all hide details worth noting.",
    ctaText: "Next",
    requiresAction: "click-target",
    positionPreference: "bottom",
  },
  {
    id: "adding-to-journal",
    stepNumber: 4,
    targetTutorialId: "tutorial-add-to-journal",
    title: "PINNING TO CASEBOARD",
    description:
      "Found something important? Add it to your case journal so you don't lose track of it.",
    ctaText: "Next",
    requiresAction: "click-target",
    positionPreference: "top",
  },
  {
    id: "shared-caseboard",
    stepNumber: 5,
    targetTutorialId: "tutorial-caseboard-tab",
    targetSecondaryIds: [
      "tutorial-caseboard-facts",
      "tutorial-caseboard-suspects",
      "tutorial-caseboard-timeline",
      "tutorial-caseboard-connections",
      "tutorial-caseboard-theories",
    ],
    title: "THE SHARED CASEBOARD",
    description:
      "This is your team's shared caseboard. Everything you and your partners note down lives here — facts, suspects, timelines, and theories.",
    ctaText: "Next",
    positionPreference: "bottom",
  },
  {
    id: "squad-chat",
    stepNumber: 6,
    targetTutorialId: "tutorial-chat-tab",
    title: "TELEGRAPH & COORDINATION",
    description:
      "Some evidence is only visible to you. Share what you find and discuss theories with your team through chat — you'll need each other to see the full picture.",
    ctaText: "Next",
    isMultiplayerOnly: true,
    positionPreference: "bottom",
  },
  {
    id: "checkpoints",
    stepNumber: 7,
    targetTutorialId: "tutorial-checkpoint-btn",
    title: "EPISODE CHECKPOINTS",
    description:
      "At key moments, you'll be asked to submit a checkpoint theory. Don't worry about being wrong — checkpoints guide you, they don't fail you.",
    ctaText: "Next",
    positionPreference: "bottom",
  },
  {
    id: "hints-informants",
    stepNumber: 8,
    targetTutorialId: "tutorial-hint-btn",
    title: "INFORMANT CONSULTATION",
    description:
      "Stuck? Hints are here to help, but using them lowers your final Investigation Quality Score. Use them wisely.",
    ctaText: "Next",
    positionPreference: "bottom",
  },
  {
    id: "final-message",
    stepNumber: 9,
    title: "FOLLOW THE TRUTH",
    description:
      "That's everything you need to begin. Trust the evidence, talk to your team, and follow the truth wherever it leads.",
    ctaText: "Start Investigating",
    isCentered: true,
    positionPreference: "center",
  },
];
