export interface CastMember {
  id: string;
  name: string;
  role: "Victim" | "Witness" | "Suspect" | "Investigator";
  function: string;
  avatar: string;
  bio: string;
  voiceNoteAudio?: string;
  statementSnippet: string;
}

export interface ClueItem {
  id: string;
  title: string;
  type: "document" | "photo" | "forensic" | "audio" | "physical";
  summary: string;
  details: string;
  image?: string;
  audioUrl?: string;
  tags: string[];
  isPrivateTo?: "solo" | "player_1" | "player_2" | "lead" | "analyst" | "chronicler" | "interrogator";
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  timeDisplay: string;
  title: string;
  source: string;
  description: string;
  isContradiction?: boolean;
  contradictionReason?: string;
  canonOrder: number; // 1-indexed true order
}

export interface ConnectionPair {
  sourceId: string;
  targetId: string;
  reason: string;
}

export interface DialogueLine {
  speaker: string;
  speakerRole: string;
  text: string;
  audioHighlight?: boolean;
  highlightablePhrase?: string;
}

export interface EpisodeCheckpoint {
  id: string;
  title: string;
  prompt: string;
  expectedClueIds: string[];
  expectedKeywords: string[];
  hintTier1: string; // gentle nudge
  hintTier2: string; // evidence pointer
  hintTier3: string; // partial explanation
  successExplanation: string;
}

export interface CaseEpisode {
  episodeNumber: number;
  id: string;
  title: string;
  subtitle: string;
  durationEstimate: string;
  locationIllustration: string;
  briefingHeadline: string;
  briefingText: string[];
  clues: ClueItem[];
  witnesses: CastMember[];
  dialogueScripts: Record<string, DialogueLine[]>;
  timelineEvents?: TimelineEvent[];
  connectionPairs?: ConnectionPair[];
  checkpoint: EpisodeCheckpoint;
  cliffhanger: {
    teaserText: string;
    nextEpisodeTitle: string;
    audioStingName: string;
  };
}

export interface CanonicalCase {
  id: string;
  code: string;
  title: string;
  setting: string;
  premise: string;
  victim: CastMember;
  cast: CastMember[];
  solution: {
    planner: string;
    plannerId: string;
    accomplice: string;
    accompliceId: string;
    method: string;
    decisiveClues: string[];
    motiveSummary: string;
  };
  episodes: CaseEpisode[];
}

export const THE_LAST_FERRY_CASE: CanonicalCase = {
  id: "the-last-ferry",
  code: "CASE 001",
  title: "The Last Ferry",
  setting: "Nabadwip Nagar, a fictional eastern Indian river-port city, during late monsoon.",
  premise: "Abir Basu, a chartered accountant preparing to expose fraudulent redevelopment payments, boards the 10:15 p.m. last ferry carrying a document folder. He never disembarks. Police call it an accident. It wasn't.",
  victim: {
    id: "abir-basu",
    name: "Abir Basu",
    role: "Victim",
    function: "Chartered accountant, uncovered redevelopment fraud",
    avatar: "/cases/the-last-ferry/abir-basu.jpg",
    bio: "Senior auditor for municipal infrastructure loans. Meticulous, quiet, and increasingly fearful in the week preceding his disappearance.",
    statementSnippet: "Last seen at Ghat No. 6 ticket stall holding a buff-colored cardboard folder."
  },
  cast: [
    {
      id: "abir-basu",
      name: "Abir Basu",
      role: "Victim",
      function: "Chartered accountant, uncovered redevelopment fraud",
      avatar: "/cases/the-last-ferry/abir-basu.jpg",
      bio: "Senior auditor who discovered double-billing in municipal river embankment projects.",
      statementSnippet: "Boarded Seat 14 on upper deck at 10:12 PM."
    },
    {
      id: "rina-basu",
      name: "Rina Basu",
      role: "Witness",
      function: "Abir's sister; holds distress voice-note recorded right before departure",
      avatar: "/cases/the-last-ferry/rina-basu.jpg",
      bio: "High school literature teacher who received Abir's terrified voice memo.",
      statementSnippet: "Dada told me to keep the copy of the ledger safe. He said if he didn't reach Howrah by midnight, it wasn't an accident."
    },
    {
      id: "debashish-pal",
      name: "Debashish Pal",
      role: "Suspect",
      function: "Real-estate contractor; financial motive, public argument with Abir",
      avatar: "/cases/the-last-ferry/debashish-pal.jpg",
      bio: "Prominent municipal contractor whose dredging and wharf tenders were under audit.",
      statementSnippet: "Basu was seeing ghosts in every ledger balance. I haven't been near the ferry ghat in six weeks."
    },
    {
      id: "harun-sheikh",
      name: "Harun Sheikh",
      role: "Suspect",
      function: "Ferry mechanic; knows the unauthorized maintenance-hatch route",
      avatar: "/cases/the-last-ferry/harun-sheikh.jpg",
      bio: "Engine mechanic on MV Sonartori with access to lower waterline maintenance hatches.",
      statementSnippet: "I was in the lower auxiliary engine bay changing oil filters until we tied up. I didn't see anyone go overboard."
    },
    {
      id: "tuli-ghosh",
      name: "Tuli Ghosh",
      role: "Witness",
      function: "Investigative journalist; possesses photo of torn payment register",
      avatar: "/cases/the-last-ferry/tuli-ghosh.jpg",
      bio: "Crime reporter who met Abir Basu two nights before his crossing.",
      statementSnippet: "Abir had three carbon receipts proving payments went to an offshore shell firm registered under Pal Construction."
    },
    {
      id: "captain-prakash-nair",
      name: "Captain Prakash Nair",
      role: "Witness",
      function: "Ferry captain; incomplete timeline out of fear",
      avatar: "/cases/the-last-ferry/captain-prakash-nair.jpg",
      bio: "Veteran river master who steered the 10:15 crossing through severe squalls.",
      statementSnippet: "The storm was heavy off the sandbar. I had to cut engine revs for twelve minutes to prevent grounding."
    },
    {
      id: "inspector-banerjee",
      name: "Inspector S. Banerjee",
      role: "Investigator",
      function: "Lalbazar CID liaison NPC; provides official briefings and field updates",
      avatar: "/cases/the-last-ferry/inspector-banerjee.jpg",
      bio: "Investigating officer assigned to review the river police accidental drowning docket.",
      statementSnippet: "Official police report says accidental slip in monsoon swell. I need your unit to verify if that holds."
    }
  ],
  solution: {
    planner: "Debashish Pal",
    plannerId: "debashish-pal",
    accomplice: "Harun Sheikh",
    accompliceId: "harun-sheikh",
    method: "During an 11-minute CCTV blackout and storm diversion, Harun unlocked the lower maintenance hatch; Abir was dragged into an idling motorboat while his umbrella and phone were planted on Seat 14 to fake an accidental fall.",
    decisiveClues: [
      "c2_broken_hatch_seal",
      "c2_wet_rope_fibres",
      "c2_boot_print",
      "c3_cctv_log",
      "c4_service_key_register",
      "c4_torn_ledger_pages"
    ],
    motiveSummary: "Debashish Pal faced imminent criminal prosecution after Abir Basu audited fraudulent municipal redevelopment invoices."
  },
  episodes: [
    // EPISODE 1
    {
      episodeNumber: 1,
      id: "ep1-empty-seat",
      title: "The Empty Seat",
      subtitle: "Reject the accident theory",
      durationEstimate: "8–10 mins",
      locationIllustration: "/cases/the-last-ferry/scene_deck_night.jpg",
      briefingHeadline: "10:15 P.M. • MV SONARTORI • GHAT NO. 6",
      briefingText: [
        "On the final monsoon crossing across the Bhairavi River, chartered accountant Abir Basu took Seat 14 on the upper deck.",
        "Forty-five minutes later, when the ferry bumped against the wooden bollards at the terminus, Seat 14 was vacant. His leather folder, cash wallet, and identity papers were gone.",
        "Police claim he lost his footing in the squall and slipped into the dark currents. But look closely at what was left behind on the wooden slats.",
        "Your first task is to examine the evidence and prove why the official accident theory does not hold."
      ],
      clues: [
        {
          id: "c1_police_report",
          title: "Initial River Police Memo #104",
          type: "document",
          summary: "Local outpost memo classifying incident as accidental drowning due to monsoon wash.",
          details: "Signed by Sub-Inspector N. Roy. States: 'Passenger on Seat 14 presumed to have slipped over starboard safety railing during high river swell between 10:20 and 10:40 PM. River current swift; body not recovered.'",
          tags: ["Police", "Official Record", "Accident Claim"]
        },
        {
          id: "c1_seat_14_photo",
          title: "Crime Scene Photo: Seat 14",
          type: "photo",
          image: "/cases/the-last-ferry/scene_seat_14.jpg",
          summary: "Photograph of the wooden bench on upper deck where Abir Basu was seated.",
          details: "Shows a neat black umbrella resting upright under the bench, dry on the handle. A silver wristwatch and glasses case sit undisturbed on the center of the wooden seat.",
          tags: ["Physical", "Crime Scene", "Upper Deck"]
        },
        {
          id: "c1_umbrella_intact",
          title: "Abir's Black Folding Umbrella",
          type: "physical",
          summary: "Recovered from under Seat 14. Folded and bone-dry beneath the canopy.",
          details: "If a violent river surge swept a grown man over the railing, a light folding umbrella placed under the seat would have rolled across the sloped wet deck or been washed overboard. It was found securely tucked against the floorboard bolt.",
          tags: ["Physical", "Forensic", "Contradiction"]
        },
        {
          id: "c1_ticket_timestamp",
          title: "Boarding Ticket #8491",
          type: "document",
          summary: "Passenger ferry ticket punched at Ghat No. 6 terminal at 10:11 PM.",
          details: "Fare: ₹12. Issued to A. Basu. Indicates he boarded just 4 minutes prior to scheduled cast-off, leaving no time to linger or loiter at the dock.",
          tags: ["Timing", "Ticket", "Boarding"]
        },
        {
          id: "c1_abir_profile",
          title: "Personnel Ledger: Abir Basu",
          type: "document",
          summary: "Official employment file establishing Abir's cautious demeanor and non-swimmer status.",
          details: "Noted by family: Abir had severe hydrophobia (fear of water) and never sat near open railings. He invariably sat in interior covered rows, making an accidental railing lean highly improbable.",
          tags: ["Victim", "Behavioral"]
        }
      ],
      witnesses: [
        {
          id: "captain-prakash-nair",
          name: "Captain Prakash Nair",
          role: "Witness",
          function: "Ferry Captain",
          avatar: "/cases/the-last-ferry/captain-prakash-nair.jpg",
          bio: "Commander of MV Sonartori for eleven years.",
          statementSnippet: "The wind was howling. Any fool leaning out to watch the spray could have pitched over."
        },
        {
          id: "inspector-banerjee",
          name: "Inspector S. Banerjee",
          role: "Investigator",
          function: "Lalbazar CID liaison",
          avatar: "/cases/the-last-ferry/inspector-banerjee.jpg",
          bio: "Wants an objective forensic assessment before signing off on the accident docket.",
          statementSnippet: "Tell me why I shouldn't sign the accident closure, Detective."
        }
      ],
      dialogueScripts: {
        "captain-prakash-nair": [
          { speaker: "Captain Prakash Nair", speakerRole: "Ferry Master", text: "It was blowing force 6 out there. Water coming over the starboard gunwales. If a passenger slipped, there's no sound over the diesel engine." },
          { speaker: "Detective", speakerRole: "Investigator", text: "Captain, would an accidental slip leave personal belongings neatly aligned in the center of the bench?" },
          { speaker: "Captain Prakash Nair", speakerRole: "Ferry Master", text: "Look... passengers do strange things when panic hits. But Seat 14 is sheltered by the upper canopy. You don't just 'fall' from there without climbing the waist-high teak railing.", highlightablePhrase: "sheltered by the upper canopy" }
        ],
        "inspector-banerjee": [
          { speaker: "Inspector S. Banerjee", speakerRole: "Lalbazar CID", text: "The local river police wanted this stamped closed by dawn. They say it's monsoon carelessness." },
          { speaker: "Detective", speakerRole: "Investigator", text: "Look at the umbrella and the glasses case. They weren't displaced by wind or water. They were staged." },
          { speaker: "Inspector S. Banerjee", speakerRole: "Lalbazar CID", text: "Staged? That implies premeditation. If he didn't drown from the deck, how did he leave this vessel mid-river?", highlightablePhrase: "how did he leave this vessel mid-river" }
        ]
      },
      checkpoint: {
        id: "chk-ep1",
        title: "Checkpoint 1: Deconstruct the Accident Theory",
        prompt: "Demonstrate why Abir Basu's disappearance could not have been an accidental fall into the river.",
        expectedClueIds: ["c1_seat_14_photo", "c1_umbrella_intact", "c1_abir_profile"],
        expectedKeywords: ["umbrella", "staged", "railing", "hydrophobia", "belongings", "dry"],
        hintTier1: "Examine the physical condition and placement of items left behind on Seat 14.",
        hintTier2: "Cross-reference the dry umbrella and untouched glasses case with the claim of a violent storm swell.",
        hintTier3: "An accidental fall in high winds would scatter loose items across the wet deck; the neatly placed dry umbrella and glasses prove the scene was staged.",
        successExplanation: "Accident hypothesis debunked. The sheltered placement of the dry umbrella, untouched personal effects, and Abir's known hydrophobia prove Seat 14 was staged to fake an accidental drowning."
      },
      cliffhanger: {
        teaserText: "If Abir didn't pitch over the railing... someone opened a door below.",
        nextEpisodeTitle: "Episode 2: Rain on the Deck",
        audioStingName: "ferry_horn"
      }
    },

    // EPISODE 2
    {
      episodeNumber: 2,
      id: "ep2-rain-on-deck",
      title: "Rain on the Deck",
      subtitle: "Find the physical access route",
      durationEstimate: "10–12 mins",
      locationIllustration: "/cases/the-last-ferry/scene_maintenance_hatch.jpg",
      briefingHeadline: "LOWER DECK • ENGINE ACCESS CORRIDOR",
      briefingText: [
        "If Abir Basu did not fall from the passenger deck, he was removed from the vessel.",
        "The forward passenger gangway was locked until docking. That leaves only the lower maintenance corridors, which run beneath the car deck directly to the waterline.",
        "Down here, the smell of diesel oil masks fresh footsteps. Inspect the service doors and find how a man was smuggled off a moving ferry."
      ],
      clues: [
        {
          id: "c2_broken_hatch_seal",
          title: "Tampered Lead Wire Hatch Seal #4B",
          type: "forensic",
          summary: "Emergency waterline service hatch seal cut with diagonal wire nippers.",
          details: "The stern service hatch connects the lower machinery space directly to an exterior boarding step at water level. The lead inspection seal was snipped cleanly from the inside.",
          tags: ["Hatch", "Tampered", "Access Route"]
        },
        {
          id: "c2_wet_rope_fibres",
          title: "Braided Nylon-Hemp Strands",
          type: "forensic",
          summary: "Snagged strands of modern braided mooring line found on the hatch latch.",
          details: "The ferry uses thick 3-strand coir and sisal lines. These blue-flecked nylon strands belong to a high-speed private motor launch.",
          tags: ["Trace", "Rope", "Hired Boat"]
        },
        {
          id: "c2_boot_print",
          title: "Oil-Resistant Work Boot Tread",
          type: "forensic",
          summary: "Fresh partial print stamped in greasy sludge near the hatch opening.",
          details: "Pattern matches 'Bata Industrial Grip', size 9, with distinct wear on the outer right heel.",
          tags: ["Footwear", "Mechanic", "Trace"]
        },
        {
          id: "c2_red_clay_smear",
          title: "Red Clay Alluvial Smear",
          type: "physical",
          summary: "Drying smear of sticky red alluvial silt on the hatch coaming.",
          details: "Red clay is not found at Ghat No. 6 (which is stone and concrete); it is characteristic of the abandoned brick-kiln wharves near the Eastern Embankment.",
          tags: ["Soil", "Location", "Destination"]
        },
        {
          id: "c2_engine_corridor_photo",
          title: "Lower Deck Machinery Corridor",
          type: "photo",
          image: "/cases/the-last-ferry/scene_maintenance_hatch.jpg",
          summary: "Narrow service tunnel connecting passenger stairwell to the waterline hatch.",
          details: "Only crew members with master service keys have authorized access to this passage.",
          tags: ["Corridor", "Crew Access"]
        }
      ],
      witnesses: [
        {
          id: "harun-sheikh",
          name: "Harun Sheikh",
          role: "Suspect",
          function: "Ferry mechanic",
          avatar: "/cases/the-last-ferry/harun-sheikh.jpg",
          bio: "Assigned to the lower engine deck during the crossing.",
          statementSnippet: "That hatch seal was intact when we left Ghat No. 6. I don't know who clipped it."
        }
      ],
      dialogueScripts: {
        "harun-sheikh": [
          { speaker: "Detective", speakerRole: "Investigator", text: "Harun, the lead seal on Hatch 4B was cut from the inside. Who keeps the keys to that tunnel?" },
          { speaker: "Harun Sheikh", speakerRole: "Mechanic", text: "Keys stay in the engine workshop locker. Anyone could have picked them up... maybe." },
          { speaker: "Detective", speakerRole: "Investigator", text: "We found size 9 industrial boot prints with an outer heel scrape right in front of the hatch sill." },
          { speaker: "Harun Sheikh", speakerRole: "Mechanic", text: "I wear size 9s. So do half the dock hands in Nabadwip. That doesn't mean I opened that hatch for anyone.", highlightablePhrase: "That doesn't mean I opened that hatch for anyone" }
        ]
      },
      checkpoint: {
        id: "chk-ep2",
        title: "Checkpoint 2: Identify the Waterline Transfer Route",
        prompt: "Identify the physical route and method used to extract Abir Basu from the vessel.",
        expectedClueIds: ["c2_broken_hatch_seal", "c2_wet_rope_fibres", "c2_boot_print"],
        expectedKeywords: ["hatch", "4b", "seal", "rope", "motorboat", "boat", "waterline"],
        hintTier1: "Which lower-deck entry point had its security seal tampered with?",
        hintTier2: "Look at the severed lead seal on Hatch 4B and the foreign rope fibres caught on the latch.",
        hintTier3: "Hatch 4B was unlocked from the inside; blue nylon rope fibres prove a secondary craft pulled alongside the waterline step to take Abir.",
        successExplanation: "Physical route confirmed. Hatch 4B was severed from the interior, allowing an unauthorized vessel tied with braided nylon rope to pull alongside and extract Abir at the waterline."
      },
      cliffhanger: {
        teaserText: "A boat pulled alongside in the dark... but when did the cameras go blind?",
        nextEpisodeTitle: "Episode 3: The Voices at Ghat No. 6",
        audioStingName: "tension_drone"
      }
    },

    // EPISODE 3
    {
      episodeNumber: 3,
      id: "ep3-voices-ghat-6",
      title: "The Voices at Ghat No. 6",
      subtitle: "Build the timeline, find testimony contradictions",
      durationEstimate: "10–12 mins",
      locationIllustration: "/cases/the-last-ferry/scene_ghat_6.jpg",
      briefingHeadline: "INTERROGATION ROOM • LALBAZAR CID",
      briefingText: [
        "A covert mid-river boat-to-boat transfer requires precise timing and distraction.",
        "The vessel was equipped with CCTV surveillance, yet the security monitoring logs show an unexplained gap during the height of the storm.",
        "Meanwhile, Abir's sister Rina has brought forward an urgent voice message recorded minutes before boarding.",
        "Construct the exact chronology of the crossing to expose who created the blind spot."
      ],
      clues: [
        {
          id: "c3_cctv_log",
          title: "CCTV Master DVR Log: Camera 3 (Aft Deck)",
          type: "document",
          summary: "Log showing Camera 3 dropped offline between 10:26 PM and 10:37 PM.",
          details: "Camera 3 covers the rear stairs and lower hatch approach. System log indicates: '10:26:14 — Signal Lost (Circuit Interrupted); 10:37:02 — Signal Restored (Manual Reset)'. An 11-minute blind window.",
          tags: ["CCTV", "Timing", "Blackout"]
        },
        {
          id: "c3_rina_voicenote",
          title: "Abir's Distress Voice Memo (9:48 PM)",
          type: "audio",
          summary: "Audio recording received by Rina Basu from Abir at 9:48 PM.",
          details: "Abir's trembling voice: 'Rina... Debashish's men followed me from the bank. If anything happens on the river, the ledger copies are filed under section 12 in the locker. Don't trust the port police.'",
          audioUrl: "/audio/rina_voice_memo.mp3",
          tags: ["Audio", "Fear", "Threat"]
        },
        {
          id: "c3_ferry_log",
          title: "Captain's Official River Logbook",
          type: "document",
          summary: "Entries made by Captain Prakash Nair during the crossing.",
          details: "Log records departure at 10:15 PM, arrival at 10:45 PM. The log omits the emergency speed drop at 10:26 PM, claiming 'clear sailing at 10 knots throughout.'",
          tags: ["Logbook", "Contradiction", "Captain"]
        }
      ],
      witnesses: [
        {
          id: "rina-basu",
          name: "Rina Basu",
          role: "Witness",
          function: "Abir's sister",
          avatar: "/cases/the-last-ferry/rina-basu.jpg",
          bio: "Brought Abir's final communication to CID.",
          statementSnippet: "Listen to his breathing. He knew they were waiting for him."
        },
        {
          id: "tuli-ghosh",
          name: "Tuli Ghosh",
          role: "Witness",
          function: "Investigative Journalist",
          avatar: "/cases/the-last-ferry/tuli-ghosh.jpg",
          bio: "Tracking municipal tender fraud in Nabadwip Nagar.",
          statementSnippet: "Debashish Pal met with a ferry crewman behind the tea stall around 9:15 PM."
        }
      ],
      dialogueScripts: {
        "rina-basu": [
          { speaker: "Rina Basu", speakerRole: "Witness / Sister", text: "Abir wasn't suicidal. He was terrified. He sent me this recording forty minutes before the ferry left.", audioHighlight: true },
          { speaker: "Detective", speakerRole: "Investigator", text: "Did he mention any names specifically on the phone?" },
          { speaker: "Rina Basu", speakerRole: "Witness / Sister", text: "He said Debashish Pal told him he would 'never live to present the audit to the tribunal.'", highlightablePhrase: "never live to present the audit" }
        ],
        "tuli-ghosh": [
          { speaker: "Tuli Ghosh", speakerRole: "Journalist", text: "I was staking out Ghat No. 6 for a story on port smuggling. At 9:20 PM, I saw Debashish Pal's black Ambassador car parked near the warehouse jetty." },
          { speaker: "Detective", speakerRole: "Investigator", text: "Did anyone approach the car?" },
          { speaker: "Tuli Ghosh", speakerRole: "Journalist", text: "A mechanic in grease-stained blue overalls came out of the ferry office and leaned into the passenger window for two minutes.", highlightablePhrase: "mechanic in grease-stained blue overalls" }
        ]
      },
      timelineEvents: [
        {
          id: "t_1005",
          timestamp: "22:05",
          timeDisplay: "10:05 PM",
          title: "Abir Arrives at Ghat No. 6",
          source: "Witness: Ticket vendor",
          description: "Abir Basu arrives carrying a heavy cardboard folder, constantly checking behind him.",
          canonOrder: 1
        },
        {
          id: "t_1012",
          timestamp: "22:12",
          timeDisplay: "10:12 PM",
          title: "Abir Boards Ferry to Seat 14",
          source: "Ticket stamp #8491",
          description: "Abir takes a seat under the covered section of the upper deck.",
          canonOrder: 2
        },
        {
          id: "t_1015",
          timestamp: "22:15",
          timeDisplay: "10:15 PM",
          title: "MV Sonartori Casts Off",
          source: "Port Master Log",
          description: "Ferry departs on scheduled run across Bhairavi River.",
          canonOrder: 3
        },
        {
          id: "t_1022",
          timestamp: "22:22",
          timeDisplay: "10:22 PM",
          title: "Squall Hits Mid-River Channel",
          source: "Deckhand statement",
          description: "Heavy rain begins; passengers move toward central indoor shelter.",
          canonOrder: 4
        },
        {
          id: "t_1026",
          timestamp: "22:26",
          timeDisplay: "10:26 PM",
          title: "CCTV Camera 3 Drops Offline",
          source: "DVR System Log",
          description: "Camera 3 power circuit tripped manually from the engine control fuse panel.",
          canonOrder: 5
        },
        {
          id: "t_1031",
          timestamp: "22:31",
          timeDisplay: "10:31 PM",
          title: "Motorboat Intercepts Ferry Waterline",
          source: "Forensic: Nylon fibres & Hatch 4B",
          description: "Unregistered motor launch pulls alongside rear service step during speed lull.",
          canonOrder: 6
        },
        {
          id: "t_1037",
          timestamp: "22:37",
          timeDisplay: "10:37 PM",
          title: "CCTV Camera 3 Power Restored",
          source: "DVR System Log",
          description: "Signal returns; aft deck empty; Seat 14 staged with umbrella.",
          canonOrder: 7
        },
        {
          id: "t_1045",
          timestamp: "22:45",
          timeDisplay: "10:45 PM",
          title: "Ferry Docks; Seat 14 Found Deserted",
          source: "Terminal Report",
          description: "Disembarkation finishes; ticket inspector notes missing passenger.",
          canonOrder: 8
        }
      ],
      checkpoint: {
        id: "chk-ep3",
        title: "Checkpoint 3: Reconstruct the 11-Minute Blind Spot",
        prompt: "Prove when the abduction took place and how the perpetrators concealed their actions.",
        expectedClueIds: ["c3_cctv_log", "c3_ferry_log", "c3_rina_voicenote"],
        expectedKeywords: ["cctv", "11", "gap", "10:26", "10:37", "blackout", "blind"],
        hintTier1: "Compare the CCTV DVR timestamps with the Captain's river log.",
        hintTier2: "Look at the exact duration when Camera 3 was powered down from the engine room.",
        hintTier3: "The 11-minute window between 10:26 PM and 10:37 PM coincided with the engine slowdown, providing total cover for the transfer.",
        successExplanation: "Timeline locked. Between 10:26 PM and 10:37 PM, the camera was disconnected from the engine room fuse box, creating the 11-minute blackout during which Abir was abducted."
      },
      cliffhanger: {
        teaserText: "The blackout gave them time... but the paper trail leads straight to the contractor.",
        nextEpisodeTitle: "Episode 4: The Missing Ledger",
        audioStingName: "rising_tension"
      }
    },

    // EPISODE 4
    {
      episodeNumber: 4,
      id: "ep4-missing-ledger",
      title: "The Missing Ledger",
      subtitle: "Connect motive, means, opportunity, method",
      durationEstimate: "10–12 mins",
      locationIllustration: "/cases/the-last-ferry/scene_maintenance_hatch.jpg",
      briefingHeadline: "PORT TRUST ARCHIVE & FINANCIAL RECORDS",
      briefingText: [
        "We have the method and the timeline. Now we must establish the criminal conspiracy connecting the mastermind to the mechanic.",
        "Debashish Pal claimed he hadn't visited the ferry ghat in weeks. Yet port registers and forensic records tell a different story.",
        "Draw the conclusive links between the forged accounts, the checkout of the maintenance key, and the syndicate's financial exposure."
      ],
      clues: [
        {
          id: "c4_torn_ledger_pages",
          title: "Recovered Carbon Page: Municipal Dredging Tender",
          type: "document",
          summary: "Torn carbon copy recovered from Abir Basu's desk draft.",
          details: "Reveals ₹42,00,000 paid to 'Pal Marine Engineering' for river desilting that was never performed. Abir had red-flagged this voucher for audit review on Monday morning.",
          tags: ["Ledger", "Motive", "Fraud"]
        },
        {
          id: "c4_service_key_register",
          title: "Ferry Machinery Service Key Register",
          type: "document",
          summary: "Signed logbook showing checkout of Hatch Key 4B on the night of the crossing.",
          details: "Key 4B was checked out at 9:30 PM by H. Sheikh and not returned until 11:15 PM.",
          tags: ["Key", "Harun", "Means"]
        },
        {
          id: "c4_tailor_receipt",
          title: "Debashish Pal's Custom Tailor Slip",
          type: "document",
          summary: "Receipt found in Pal's office for replacement of antique brass coat button.",
          details: "Matching brass anchor button was recovered on the ferry service stairwell floorboards.",
          tags: ["Debashish", "Physical", "Presence"]
        },
        {
          id: "c4_work_order",
          title: "Emergency Wharf Repair Work Order",
          type: "document",
          summary: "Emergency permit granting Pal Construction boats river access after 10 PM.",
          details: "Authorizes motor launch 'Barsha' to operate in the navigation channel without navigation lights during storm repair.",
          tags: ["Launch", "Permit", "Opportunity"]
        }
      ],
      witnesses: [
        {
          id: "debashish-pal",
          name: "Debashish Pal",
          role: "Suspect",
          function: "Real-estate contractor",
          avatar: "/cases/the-last-ferry/debashish-pal.jpg",
          bio: "Under interrogation at Lalbazar headquarters.",
          statementSnippet: "My company handles thousands of municipal projects. A missing accountant has nothing to do with me."
        }
      ],
      dialogueScripts: {
        "debashish-pal": [
          { speaker: "Detective", speakerRole: "Investigator", text: "Mr. Pal, we found your custom brass anchor button on the lower service stairwell of the ferry." },
          { speaker: "Debashish Pal", speakerRole: "Contractor", text: "I lost that button at the Kolkata Club last week. Someone must have planted it." },
          { speaker: "Detective", speakerRole: "Investigator", text: "And the emergency night permit for your launch 'Barsha' to navigate the channel without lights?" },
          { speaker: "Debashish Pal", speakerRole: "Contractor", text: "That was routine silt observation! You have no proof of anything more!", highlightablePhrase: "routine silt observation" }
        ]
      },
      connectionPairs: [
        {
          sourceId: "c4_torn_ledger_pages",
          targetId: "c4_work_order",
          reason: "Motive: Abir uncovered the ₹42 lakh fraudulent dredging contract operated by Pal Construction."
        },
        {
          sourceId: "c4_service_key_register",
          targetId: "c2_broken_hatch_seal",
          reason: "Means: Harun Sheikh checked out Key 4B to access and sever the waterline hatch."
        },
        {
          sourceId: "c3_cctv_log",
          targetId: "c2_wet_rope_fibres",
          reason: "Method: During the 11-minute CCTV blackout, Pal's boat tied to the hatch using nylon lines."
        }
      ],
      checkpoint: {
        id: "chk-ep4",
        title: "Checkpoint 4: Connect Motive, Means, and Opportunity",
        prompt: "Establish the complete chain of collusion between Debashish Pal and Harun Sheikh.",
        expectedClueIds: ["c4_torn_ledger_pages", "c4_service_key_register", "c4_work_order"],
        expectedKeywords: ["pal", "harun", "collusion", "ledger", "key", "contract", "fraud"],
        hintTier1: "Link Pal's financial motive with Harun's physical access keys.",
        hintTier2: "Connect the audit ledger pages showing fraud to the emergency boat permit issued to Pal's firm.",
        hintTier3: "Debashish paid Harun to unlock Hatch 4B; Pal's boat 'Barsha' intercepted the ferry during the CCTV blackout to seize Abir and the incriminating ledger.",
        successExplanation: "Conspiracy fully established. Debashish Pal contracted Harun Sheikh to unlock Hatch 4B and disable the camera while Pal's launch completed the abduction."
      },
      cliffhanger: {
        teaserText: "Dawn approaches over the eastern marshes. Time to break the silence.",
        nextEpisodeTitle: "Episode 5: Before Dawn",
        audioStingName: "dramatic_chord"
      }
    },

    // EPISODE 5
    {
      episodeNumber: 5,
      id: "ep5-before-dawn",
      title: "Before Dawn",
      subtitle: "Final accusation and reveal",
      durationEstimate: "7–10 mins",
      locationIllustration: "/cases/the-last-ferry/scene_warehouse_dawn.jpg",
      briefingHeadline: "ABANDONED WAREHOUSE • EASTERN EMBANKMENT",
      briefingText: [
        "Police raid units have cordoned off the abandoned brick-kiln warehouse by the river bank.",
        "The red clay on the hatch, the nylon rope fibres, and the audit ledger trail converge here.",
        "Assemble the final indictment against the conspirators before the magistrate signs the arrest warrants."
      ],
      clues: [],
      witnesses: [
        {
          id: "inspector-banerjee",
          name: "Inspector S. Banerjee",
          role: "Investigator",
          function: "Lalbazar CID",
          avatar: "/cases/the-last-ferry/inspector-banerjee.jpg",
          bio: "Standing by with armed warrant squad.",
          statementSnippet: "Give me the names and the evidence. We move on your word."
        }
      ],
      dialogueScripts: {
        "inspector-banerjee": [
          { speaker: "Inspector S. Banerjee", speakerRole: "Lalbazar CID", text: "The team is in position at the Eastern Embankment warehouse. Before we breach, I need the full charge sheet confirmed." },
          { speaker: "Detective", speakerRole: "Investigator", text: "The evidence is watertight, Inspector. The accident theory was a deliberate fabrication." }
        ]
      },
      checkpoint: {
        id: "chk-ep5",
        title: "Checkpoint 5: The Final Accusation",
        prompt: "Submit the formal charges against the conspirators responsible for Abir Basu's abduction.",
        expectedClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
        expectedKeywords: ["debashish", "harun", "fraud", "hatch", "abduction"],
        hintTier1: "Review who planned the crime and who provided physical access inside the vessel.",
        hintTier2: "Debashish Pal provided the motive and transport; Harun Sheikh provided the keys and camera blackout.",
        hintTier3: "Accuse Debashish Pal as the mastermind and Harun Sheikh as the accomplice.",
        successExplanation: "Accusation confirmed by magistrate. Armed units breach the warehouse, recovering Abir Basu and securing the complete municipal audit ledger."
      },
      cliffhanger: {
        teaserText: "Case 001 Closed. Truth stands in the dawn light of Lalbazar.",
        nextEpisodeTitle: "Results & Dossier Archive",
        audioStingName: "victory_fanfare"
      }
    }
  ]
};

export function getEpisodeById(episodeId: string): CaseEpisode | undefined {
  return THE_LAST_FERRY_CASE.episodes.find(
    (ep) =>
      ep.id === episodeId ||
      ep.id.startsWith(episodeId) ||
      `ep${ep.episodeNumber}` === episodeId
  );
}

export function getEpisodeByNumber(num: number): CaseEpisode | undefined {
  return THE_LAST_FERRY_CASE.episodes.find((ep) => ep.episodeNumber === num);
}
