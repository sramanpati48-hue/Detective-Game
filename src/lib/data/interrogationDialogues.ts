import { DialogueLine, CastMember } from "@/lib/data/cases/the-last-ferry";

export interface InterrogationOption {
  id: string;
  label: string;
  category: "forensic" | "timeline" | "alibi" | "confrontation" | "behavior" | "motive";
  badgeText: string;
  detectiveSpeech: string;
  witnessResponse: {
    speaker: string;
    speakerRole: string;
    text: string;
    highlightablePhrase?: string;
  };
}

export interface WitnessInterrogationTree {
  witnessId: string;
  openingStatement: DialogueLine;
  options: InterrogationOption[];
  customResponseKeywords: Array<{
    keywords: string[];
    response: string;
    highlightablePhrase?: string;
  }>;
  defaultCustomResponse: string;
}

export const WITNESS_INTERROGATION_TREES: Record<string, WitnessInterrogationTree> = {
  "captain-prakash-nair": {
    witnessId: "captain-prakash-nair",
    openingStatement: {
      speaker: "Captain Prakash Nair",
      speakerRole: "Ferry Master",
      text: "It was blowing force 6 out there. Water coming over the starboard gunwales. If a passenger slipped, there's no sound over the diesel engine.",
    },
    options: [
      {
        id: "cap-opt-1",
        label: "Question the neatly placed belongings on Seat 14",
        category: "forensic",
        badgeText: "Forensic Contradiction",
        detectiveSpeech: "Captain, would an accidental slip leave personal belongings neatly aligned in the center of the bench?",
        witnessResponse: {
          speaker: "Captain Prakash Nair",
          speakerRole: "Ferry Master",
          text: "Look... passengers do strange things when panic hits. But Seat 14 is sheltered by the upper canopy. You don't just 'fall' from there without climbing the waist-high teak railing.",
          highlightablePhrase: "sheltered by the upper canopy",
        },
      },
      {
        id: "cap-opt-2",
        label: "Confront about the 17-minute crossing delay",
        category: "timeline",
        badgeText: "Logbook Discrepancy",
        detectiveSpeech: "The crossing from Ghat No. 6 normally takes 28 minutes. Your log shows 45 minutes. What caused the 17-minute delay off the shoals?",
        witnessResponse: {
          speaker: "Captain Prakash Nair",
          speakerRole: "Ferry Master",
          text: "The squall was vicious near the shoals. I had to throttle down to two knots to keep the rudder from snagging alluvial silt. But... truth be told, I saw a low-profile motorboat idling without navigation lamps off our port quarter.",
          highlightablePhrase: "idling motorboat without navigation lamps",
        },
      },
      {
        id: "cap-opt-3",
        label: "Inquire about Abir Basu's demeanor at boarding",
        category: "behavior",
        badgeText: "Passenger Demeanor",
        detectiveSpeech: "Did you observe Abir Basu's demeanor when he boarded at Ghat No. 6?",
        witnessResponse: {
          speaker: "Captain Prakash Nair",
          speakerRole: "Ferry Master",
          text: "He boarded four minutes before cast-off at 10:11 PM. Didn't look at the river once—held a heavy cardboard folder under his mackintosh like it was made of gold. Kept glancing back at the tea stalls.",
          highlightablePhrase: "held a heavy cardboard folder under his mackintosh",
        },
      },
      {
        id: "cap-opt-4",
        label: "Press on the bone-dry umbrella found under Seat 14",
        category: "confrontation",
        badgeText: "Exhibit Confrontation",
        detectiveSpeech: "We recovered Abir's folding umbrella from beneath Seat 14. Folded, bone-dry, and tucked securely. Could an accidental fall have occurred in a gale without soaking that umbrella?",
        witnessResponse: {
          speaker: "Captain Prakash Nair",
          speakerRole: "Ferry Master",
          text: "Bone-dry? If driving rain was sheeting over the upper deck, that umbrella was placed under Seat 14 after the squall had already died down. Someone set that scene.",
          highlightablePhrase: "placed under Seat 14 after the squall had already died down",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["umbrella", "dry", "rain", "seat 14", "bench"],
        response: "Like I said, the upper deck was wet from driving spray. A dry umbrella under Seat 14 means it never met the river wind until after the weather broke.",
        highlightablePhrase: "never met the river wind",
      },
      {
        keywords: ["boat", "motorboat", "engine", "shoal", "sandbar", "speed"],
        response: "That idling launch off our port side had a muffled exhaust. It matched the shape of the contractor launches from Bagbazar boatyard.",
        highlightablePhrase: "contractor launches from Bagbazar",
      },
      {
        keywords: ["harun", "mechanic", "hatch", "engine room"],
        response: "Harun was supposed to be in the auxiliary bay. But around 10:25 PM, I felt a vibration on the lower hull that wasn't our main propeller.",
        highlightablePhrase: "vibration on the lower hull",
      },
    ],
    defaultCustomResponse: "Detective, I've captained these Bhairavi ferries for twenty-six years. The river takes men in the monsoon, but it doesn't fold their umbrellas first. Check the lower decks.",
  },

  "inspector-banerjee": {
    witnessId: "inspector-banerjee",
    openingStatement: {
      speaker: "Inspector S. Banerjee",
      speakerRole: "Lalbazar CID",
      text: "The local river police wanted this stamped closed by dawn. They say it's monsoon carelessness. Tell me why I shouldn't sign the accident closure, Detective.",
    },
    options: [
      {
        id: "ban-opt-1",
        label: "Present evidence of scene staging on Seat 14",
        category: "forensic",
        badgeText: "Staged Crime Scene",
        detectiveSpeech: "Look at the umbrella and the glasses case. They weren't displaced by wind or water. They were staged.",
        witnessResponse: {
          speaker: "Inspector S. Banerjee",
          speakerRole: "Lalbazar CID",
          text: "Staged? That implies premeditation. If he didn't drown from the deck, how did he leave this vessel mid-river?",
          highlightablePhrase: "how did he leave this vessel mid-river",
        },
      },
      {
        id: "ban-opt-2",
        label: "Investigate pressure to close the police report early",
        category: "alibi",
        badgeText: "Police Interference",
        detectiveSpeech: "Who pressured Sub-Inspector Roy to classify the incident as accidental drowning within two hours of arrival?",
        witnessResponse: {
          speaker: "Inspector S. Banerjee",
          speakerRole: "Lalbazar CID",
          text: "Roy received a call at 11:30 PM from the Municipal Port Commissioner's office. They wanted the berth cleared for morning coal barges. Roy took the path of least resistance.",
          highlightablePhrase: "call at 11:30 PM from the Municipal Port Commissioner",
        },
      },
      {
        id: "ban-opt-3",
        label: "Examine Abir Basu's municipal fraud audit",
        category: "motive",
        badgeText: "Audit Investigation",
        detectiveSpeech: "Abir Basu's sister claims he uncovered massive financial irregularities in municipal wharf tenders. Did CID have an open inquiry?",
        witnessResponse: {
          speaker: "Inspector S. Banerjee",
          speakerRole: "Lalbazar CID",
          text: "We received an anonymous tip-off two weeks ago alleging fictitious dredging contracts awarded to Debashish Pal. Abir Basu had duplicate cash vouchers in his possession.",
          highlightablePhrase: "fictitious dredging contracts awarded to Debashish Pal",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["pal", "debashish", "contractor", "bribe"],
        response: "Debashish Pal has connections across the Calcutta Municipal Corporation. If you're going after him, make sure your forensic links are airtight.",
        highlightablePhrase: "connections across the Calcutta Municipal Corporation",
      },
      {
        keywords: ["hatch", "harun", "transfer", "boat"],
        response: "If Hatch 4B was breached from the inside, that turns a missing person file into an organized kidnapping conspiracy.",
        highlightablePhrase: "organized kidnapping conspiracy",
      },
    ],
    defaultCustomResponse: "I need physical links, Detective. The Commissioner wants a signed verdict before noon. Show me the contradictions on the caseboard.",
  },

  "harun-sheikh": {
    witnessId: "harun-sheikh",
    openingStatement: {
      speaker: "Harun Sheikh",
      speakerRole: "Ferry Mechanic",
      text: "I was down in the lower auxiliary engine bay changing fuel filters until we tied up at terminus. I didn't see anyone go overboard.",
    },
    options: [
      {
        id: "har-opt-1",
        label: "Confront regarding the clipped seal on Hatch 4B",
        category: "confrontation",
        badgeText: "Hatch 4B Tampering",
        detectiveSpeech: "Harun, the lead seal on Hatch 4B was cut from the inside. Who keeps the keys to that service corridor?",
        witnessResponse: {
          speaker: "Harun Sheikh",
          speakerRole: "Mechanic",
          text: "Keys stay on the wooden shadow-board in the workshop locker. Anyone crew or passenger could have swiped them while I was oiling bearings... maybe.",
          highlightablePhrase: "Keys stay on the wooden shadow-board",
        },
      },
      {
        id: "har-opt-2",
        label: "Match size 9 industrial boot prints near the hatch sill",
        category: "forensic",
        badgeText: "Footwear Match",
        detectiveSpeech: "We found size 9 industrial boot prints with an outer heel scrape right in front of the waterline hatch sill.",
        witnessResponse: {
          speaker: "Harun Sheikh",
          speakerRole: "Mechanic",
          text: "I wear size 9 Bata boots. So do half the dock hands between Nabadwip and Bagbazar. That doesn't mean I opened that hatch for anyone.",
          highlightablePhrase: "That doesn't mean I opened that hatch for anyone",
        },
      },
      {
        id: "har-opt-3",
        label: "Interrogate on foreign braided nylon rope fibres",
        category: "timeline",
        badgeText: "Secondary Vessel",
        detectiveSpeech: "Foreign braided nylon rope fibres—blue, maritime grade—were caught on the hatch dogs. What vessel pulled alongside?",
        witnessResponse: {
          speaker: "Harun Sheikh",
          speakerRole: "Mechanic",
          text: "I... I heard a twin-carburetor hum through the hull plates around 10:25 PM. Shook the bilge. But I kept my head down! If Pal found out I talked, I'd end up in the Hooghly mud.",
          highlightablePhrase: "twin-carburetor hum through the hull plates",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["pal", "debashish", "money", "paid", "bribe"],
        response: "I didn't take no bribe from Pal directly! A man in a rain slicker gave me fifty rupees to leave the corridor locker unlocked for ten minutes.",
        highlightablePhrase: "fifty rupees to leave the corridor locker unlocked",
      },
      {
        keywords: ["abir", "accountant", "alive", "kill"],
        response: "He was alive when they took him through the hatch! Two men bundled him into the launch. He was struggling, but they covered his face.",
        highlightablePhrase: "bundled him into the launch",
      },
    ],
    defaultCustomResponse: "I'm just a grease-hand, Detective. I fix cylinder heads and pump dirty bilges. Don't pin Pal's dirty business on me.",
  },

  "rina-basu": {
    witnessId: "rina-basu",
    openingStatement: {
      speaker: "Rina Basu",
      speakerRole: "Victim's Sister",
      text: "Dada called me at 9:15 PM from a public telephone stall. He said if he didn't reach Howrah by midnight, it wasn't an accident. Please... you must find him.",
    },
    options: [
      {
        id: "rin-opt-1",
        label: "Question Abir's severe hydrophobia",
        category: "behavior",
        badgeText: "Hydrophobia Alibi",
        detectiveSpeech: "Did Abir ever sit on the open upper deck during a stormy monsoon night?",
        witnessResponse: {
          speaker: "Rina Basu",
          speakerRole: "Victim's Sister",
          text: "Never! Dada was terrified of deep water since a childhood river accident. He couldn't even stand near the railing without panic. He would never choose an exposed bench like Seat 14 in a storm.",
          highlightablePhrase: "terrified of deep water since a childhood river accident",
        },
      },
      {
        id: "rin-opt-2",
        label: "Ask about the municipal embankment audit findings",
        category: "motive",
        badgeText: "Duplicate Records",
        detectiveSpeech: "What did Abir tell you about the documents in his buff cardboard folder?",
        witnessResponse: {
          speaker: "Rina Basu",
          speakerRole: "Victim's Sister",
          text: "He said he had audited the dredging accounts for the North Embankment. He discovered over four lakh rupees diverted to ghost firms. He said Debashish Pal threatened him outside the tea stall.",
          highlightablePhrase: "Debashish Pal threatened him outside the tea stall",
        },
      },
      {
        id: "rin-opt-3",
        label: "Inquire about Abir's contingency instructions",
        category: "timeline",
        badgeText: "Emergency Protocol",
        detectiveSpeech: "What instructions did Abir give you in case he failed to return?",
        witnessResponse: {
          speaker: "Rina Basu",
          speakerRole: "Victim's Sister",
          text: "He hid the duplicate carbon vouchers inside our grandfather's dictionary in the study. He told me: 'Give it only to Inspector Banerjee at Lalbazar, no local constable.'",
          highlightablePhrase: "Give it only to Inspector Banerjee at Lalbazar",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["audio", "call", "voicemail", "recording", "phone"],
        response: "Listen to the tape recording in the player above. You can hear the diesel horns and the rain hammering the phone box booth.",
        highlightablePhrase: "hear the diesel horns and the rain",
      },
    ],
    defaultCustomResponse: "Dada was the most honest accountant in Kolkata. He wouldn't leave his umbrella or slip like a drunkard. He was hunted.",
  },

  "debashish-pal": {
    witnessId: "debashish-pal",
    openingStatement: {
      speaker: "Debashish Pal",
      speakerRole: "Contractor / Suspect",
      text: "Basu was an overzealous accountant who saw fraud in every balance sheet. I haven't set foot near Ghat No. 6 in six weeks.",
    },
    options: [
      {
        id: "pal-opt-1",
        label: "Confront regarding the public dispute with Abir",
        category: "confrontation",
        badgeText: "Public Dispute",
        detectiveSpeech: "Three witnesses saw you arguing fiercely with Abir Basu outside the Municipal Embankment Office yesterday afternoon.",
        witnessResponse: {
          speaker: "Debashish Pal",
          speakerRole: "Contractor / Suspect",
          text: "A heated professional conversation! He threatened to delay my payment certificates on the Eastern Embankment. I told him to stick to book-keeping and stay out of civic engineering.",
          highlightablePhrase: "threatened to delay my payment certificates",
        },
      },
      {
        id: "pal-opt-2",
        label: "Scrutinize alibi between 10:00 PM and 11:30 PM",
        category: "alibi",
        badgeText: "Alibi Verification",
        detectiveSpeech: "Where were you between 10:00 PM and 11:30 PM last night during the river squall?",
        witnessResponse: {
          speaker: "Debashish Pal",
          speakerRole: "Contractor / Suspect",
          text: "At the Calcutta Club having dinner with the Municipal Executive Engineer until eleven. Check their guest log if you dare insult me further.",
          highlightablePhrase: "dinner with the Municipal Executive Engineer",
        },
      },
      {
        id: "pal-opt-3",
        label: "Inquire about the 28-foot mahogany speed launch",
        category: "forensic",
        badgeText: "Launch Discrepancy",
        detectiveSpeech: "Your company operates a 28-foot mahogany speed launch registered at Bagbazar. Where was it docked last night?",
        witnessResponse: {
          speaker: "Debashish Pal",
          speakerRole: "Contractor / Suspect",
          text: "In the repair yard having its twin carburetors cleaned. My mechanic had the keys. What my maintenance staff do off-duty is their business, not mine.",
          highlightablePhrase: "twin carburetors cleaned",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["harun", "hatch", "bribe", "launch"],
        response: "Harun is a dock mechanic, not my associate. If he was running illicit passenger ferries on my launch, he will answer for it in court.",
        highlightablePhrase: "illicit passenger ferries on my launch",
      },
    ],
    defaultCustomResponse: "Be very careful, Detective. In Kolkata, contracts are built on steel and reputation. Slander my firm without evidence and Lalbazar will face a civil suit.",
  },

  "tuli-ghosh": {
    witnessId: "tuli-ghosh",
    openingStatement: {
      speaker: "Tuli Ghosh",
      speakerRole: "Investigative Journalist",
      text: "Abir Basu came to my press desk two evenings ago with grease-pencil notes on municipal river tenders. He knew he was being watched.",
    },
    options: [
      {
        id: "tul-opt-1",
        label: "Review the evidence Abir shared with the press",
        category: "motive",
        badgeText: "Press Dossier",
        detectiveSpeech: "What proof did Abir share with the press before boarding the ferry?",
        witnessResponse: {
          speaker: "Tuli Ghosh",
          speakerRole: "Investigative Journalist",
          text: "He showed me carbon receipts proving municipal advance cheques were cashed at a private bullion shop on Strand Road. Pal was liquidating assets before the audit deadline.",
          highlightablePhrase: "cashed at a private bullion shop on Strand Road",
        },
      },
      {
        id: "tul-opt-2",
        label: "Investigate the vehicle that trailed Abir",
        category: "timeline",
        badgeText: "Surveillance Vehicle",
        detectiveSpeech: "Did anyone follow Abir when he left the newspaper office?",
        witnessResponse: {
          speaker: "Tuli Ghosh",
          speakerRole: "Investigative Journalist",
          text: "A black Morris Ten sedan with tinted glass was parked across from our press entrance on Bowbazar Street. When Abir hailed a rickshaw for Ghat No. 6, that Morris followed.",
          highlightablePhrase: "black Morris Ten sedan with tinted glass",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["morris", "car", "license", "plate"],
        response: "The Morris Ten had an official municipal parking sticker on the windshield: 'CMC-WORKS-1941'. That car belonged to Pal's liaison office.",
        highlightablePhrase: "CMC-WORKS-1941",
      },
    ],
    defaultCustomResponse: "This isn't an accidental river tragedy, Detective. It's the biggest municipal kickback scandal since the Howrah Bridge piers were laid.",
  },

  "abir-basu": {
    witnessId: "abir-basu",
    openingStatement: {
      speaker: "Abir Basu (Posthumous Forensic File)",
      speakerRole: "Victim Profile",
      text: "Last entry in recovered audit journal: 'The discrepancy is no ledger error. If the crossing is compromised, the second key is with Rina.'",
    },
    options: [
      {
        id: "abi-opt-1",
        label: "Examine forensic handwriting pressure on the ticket",
        category: "forensic",
        badgeText: "Handwriting Analysis",
        detectiveSpeech: "Analyze Abir's handwriting on the recovered ticket envelope.",
        witnessResponse: {
          speaker: "Forensic Document Examiner",
          speakerRole: "Lalbazar CID Laboratory",
          text: "Rapid, hurried strokes with high pen pressure. The ink smudges at 10:11 PM indicate severe tremor or haste while entering the turnstile.",
          highlightablePhrase: "severe tremor or haste while entering the turnstile",
        },
      },
      {
        id: "abi-opt-2",
        label: "Reconstruct boarding trajectory from Ghat No. 6",
        category: "timeline",
        badgeText: "Boarding Trajectory",
        detectiveSpeech: "Review the boarding timeline: 10:11 PM ticket punch to 10:15 PM cast-off.",
        witnessResponse: {
          speaker: "Forensic Reconstruction",
          speakerRole: "Investigative Analysis",
          text: "With only 4 minutes to navigate the wooden ramp in a downpour, Abir went straight up the external companionway to the upper deck without pausing at the lower cabin.",
          highlightablePhrase: "straight up the external companionway to the upper deck",
        },
      },
    ],
    customResponseKeywords: [
      {
        keywords: ["fear", "umbrella", "watch"],
        response: "Abir's personal effects—the dry umbrella and watch—show zero saltwater corrosion, proving they never touched river spray.",
        highlightablePhrase: "zero saltwater corrosion",
      },
    ],
    defaultCustomResponse: "Abir Basu's forensic files confirm a man acting under extreme duress, carrying decisive evidence of municipal malfeasance.",
  },
};

/**
 * Returns the interrogation tree for a witness, dynamically generating one from existing dialogueScripts if needed.
 */
export function getWitnessInterrogationTree(
  witnessId: string,
  fallbackDialogues?: DialogueLine[],
  defaultWitness?: CastMember
): WitnessInterrogationTree {
  if (WITNESS_INTERROGATION_TREES[witnessId]) {
    return WITNESS_INTERROGATION_TREES[witnessId];
  }

  // If a custom or fallback witness exists in dialogueScripts:
  if (fallbackDialogues && fallbackDialogues.length >= 2) {
    const opening = fallbackDialogues[0];
    const detectiveLine = fallbackDialogues[1]?.speaker === "Detective" ? fallbackDialogues[1] : null;
    const responseLine = fallbackDialogues[2] || fallbackDialogues[1];

    const generatedOptions: InterrogationOption[] = [];
    if (detectiveLine) {
      generatedOptions.push({
        id: `gen-opt-1-${witnessId}`,
        label: detectiveLine.text.slice(0, 65) + "...",
        category: "forensic",
        badgeText: "Investigative Query",
        detectiveSpeech: detectiveLine.text,
        witnessResponse: {
          speaker: responseLine.speaker,
          speakerRole: responseLine.speakerRole,
          text: responseLine.text,
          highlightablePhrase: responseLine.highlightablePhrase,
        },
      });
    }

    return {
      witnessId,
      openingStatement: opening,
      options: generatedOptions,
      customResponseKeywords: [],
      defaultCustomResponse: `Statement on official record for ${defaultWitness?.name || witnessId}. Review timeline and exhibits for corroborating evidence.`,
    };
  }

  // Minimal fallback
  return {
    witnessId,
    openingStatement: {
      speaker: defaultWitness?.name || "Person of Interest",
      speakerRole: defaultWitness?.role || "Witness",
      text: defaultWitness?.statementSnippet || "I have provided my deposition to the Lalbazar field officers.",
    },
    options: [],
    customResponseKeywords: [],
    defaultCustomResponse: "I have stated all that I recall about the crossing, Detective.",
  };
}

/**
 * Generates an in-character response when the detective enters a custom query.
 */
export function generateWitnessResponse(
  witnessId: string,
  customQuery: string,
  witnessName: string,
  witnessRole: string
): { text: string; highlightablePhrase?: string } {
  const tree = WITNESS_INTERROGATION_TREES[witnessId];
  const queryLower = customQuery.toLowerCase();

  if (tree && tree.customResponseKeywords.length > 0) {
    for (const item of tree.customResponseKeywords) {
      if (item.keywords.some((kw) => queryLower.includes(kw))) {
        return {
          text: item.response,
          highlightablePhrase: item.highlightablePhrase,
        };
      }
    }
    return { text: tree.defaultCustomResponse };
  }

  return {
    text: `Detective, regarding "${customQuery.slice(0, 40)}"... I can only swear to what I witnessed on the river that night. Examine the caseboard and logbooks.`,
  };
}
