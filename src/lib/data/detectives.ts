export type DetectiveRole = 
  | "Lead Detective" 
  | "Chronicler" 
  | "Evidence Analyst" 
  | "Interrogator";

export interface DetectiveStrength {
  label: string;
  value: number; // 0 to 100
}

export interface DetectiveAtAGlance {
  yearsExperience: string;
  casesHandled: string;
  successRate: string;
  knownFor: string;
  approach: string;
}

export interface Detective {
  id: string;
  name: string;
  role: DetectiveRole;
  gender: "female" | "male";
  coreFocus: string;
  portrait: string;
  detailPortrait: string;
  heroPortrait: string;
  rosterPortrait?: string;
  docketTag?: string;
  cardQuote?: string;
  fileNo: string;
  dossierId: string;
  department: string;
  status: string;
  clearanceLevel: string;
  baseCity: string;
  atAGlance: DetectiveAtAGlance;
  age: number;
  formerOccupation: string;
  bio: string;
  backstory: string;
  quote: string;
  secondaryQuote?: string;
  fieldNoteQuote: string;
  specialties: string[];
  strengths: DetectiveStrength[];
}

export const DETECTIVES: Detective[] = [
  // 1. LEAD DETECTIVE — Female
  {
    id: "ananya-sen",
    name: "Ananya Sen",
    role: "Lead Detective",
    gender: "female",
    age: 32,
    formerOccupation: "Former Crime Reporter",
    coreFocus: "Command, Deduction, Big-Picture Truth",
    portrait: "/detectives/ananya_sen.png",
    detailPortrait: "/detectives/ananya_sen_detail.png",
    heroPortrait: "/detectives/ananya-sen-hero.png",
    rosterPortrait: "/detectives/ananya-sen-noir.jpg",
    docketTag: "#ANANYA",
    cardQuote: "The city listens.",
    fileNo: "LCIB-014",
    dossierId: "#ANANYA-SEN",
    department: "Lalbazar Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "6+",
      casesHandled: "84+",
      successRate: "91%",
      knownFor: "Pattern analysis, syndicate networks, urban lore",
      approach: "Intuitive. Relentless. Pattern-first."
    },
    bio: "Ananya sees what others miss. With a sharp mind and a sharper instinct, she connects people, places, and patterns across the labyrinthine alleys of Kolkata. For her, every case is not just a crime — it's a story waiting to be understood.",
    backstory: "Ananya spent six years as a crime correspondent for a Kolkata daily before she realized she was more interested in solving the stories than reporting them. After exposing a corrupt housing syndicate that got her newspaper sued into silence, she left journalism and became an independent investigator. She works cases the police consider \"closed\" and the papers consider \"old news.\" Her methodology is pattern-first: she believes every city leaves a fingerprint in its routines, and criminals are just people who broke their own patterns once.",
    quote: "The city speaks. You just have to listen.",
    secondaryQuote: "Truth always leaves a trace.",
    fieldNoteQuote: "Case 14: The widow kept saying 'he never travelled.' His ticket stubs said otherwise. Note to self — grief makes people protective, not honest.",
    specialties: [
      "Crime Pattern Analysis",
      "Field Investigation",
      "People Profiling",
      "Urban Networks"
    ],
    strengths: [
      { label: "Observation", value: 92 },
      { label: "Intuition", value: 88 },
      { label: "Leadership", value: 78 },
      { label: "Empathy", value: 82 }
    ]
  },

  // 2. LEAD DETECTIVE — Male
  {
    id: "vikram-oberoi",
    name: "Vikram Oberoi",
    role: "Lead Detective",
    gender: "male",
    age: 36,
    formerOccupation: "Former Insurance Fraud Investigator",
    coreFocus: "Command, Deduction, Big-Picture Truth",
    portrait: "/detectives/vikram_oberoi.png",
    detailPortrait: "/detectives/vikram_oberoi_detail.png",
    heroPortrait: "/detectives/vikram-oberoi-hero.png",
    rosterPortrait: "/detectives/vikram-oberoi-noir.jpg",
    docketTag: "#VIKRAM",
    cardQuote: "Every story has a motive.",
    fileNo: "LCIB-027",
    dossierId: "#VIKRAM-OBEROI",
    department: "Lalbazar Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "10+",
      casesHandled: "120+",
      successRate: "87%",
      knownFor: "Fraud, financial trails, human behaviour",
      approach: "Calm. Methodical. Relentless."
    },
    bio: "A seasoned veteran of Lalbazar's Special Branch. Calm, calculating, and relentlessly principled, Vikram approaches mysteries like grand tactical chess matches where every motive and alibi must withstand rigorous cross-examination.",
    backstory: "Vikram spent a decade proving that \"accidents\" were rarely accidents, working for one of the country's largest insurance firms before he got tired of protecting corporate payouts instead of people. He left to open his own practice. Methodical to a fault, he treats every case like an audit — timelines, receipts, alibis, cross-checked twice. Colleagues call him cold; clients call him thorough. He rarely raises his voice, which unsettles suspects more than shouting ever could.",
    quote: "Truth lives in the in-between.",
    secondaryQuote: "A quieter mind sees a larger picture.",
    fieldNoteQuote: "Third policy this year with a suspiciously convenient fire. Insurers taught me one thing: nobody burns down something they still owe money on.",
    specialties: [
      "Command & Strategy",
      "Motive Deconstruction",
      "Forensic Correlation",
      "High-Stakes Interrogation"
    ],
    strengths: [
      { label: "Observation", value: 94 },
      { label: "Logic & Deduction", value: 95 },
      { label: "Leadership", value: 90 },
      { label: "Composure", value: 88 }
    ]
  },

  // 3. CHRONICLER / PARTNER — Female
  {
    id: "meher-ahluwalia",
    name: "Meher Ahluwalia",
    role: "Chronicler",
    gender: "female",
    age: 28,
    formerOccupation: "Former Archivist, City Records Office",
    coreFocus: "Research, Historical Records, Human Perspectives",
    portrait: "/detectives/meher_ahluwalia.png",
    detailPortrait: "/detectives/meher_ahluwalia_detail.png",
    heroPortrait: "/detectives/meher-ahluwalia-hero.png",
    rosterPortrait: "/detectives/meher-ahluwalia-noir.jpg",
    docketTag: "#MEHER",
    cardQuote: "Facts outlive fear.",
    fileNo: "LCIB-033",
    dossierId: "#MEHER-AHLUWALIA",
    department: "Lalbazar Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 2",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "4+",
      casesHandled: "65+",
      successRate: "89%",
      knownFor: "Municipal deeds, paper trails, witness empathy",
      approach: "Meticulous. Archival. Compassionate."
    },
    bio: "A gifted archivist and chronicler who treats the city's living memory as an open case file. Meher listens deeply to the human collateral of crime, piecing together forgotten municipal deeds, personal journals, and unspoken witness hesitations.",
    backstory: "Meher catalogued property disputes and forgotten court cases for four years before a routine records request accidentally uncovered evidence in a decade-old missing-person case. She's been chasing paper trails as a chronicler ever since. She doesn't interrogate suspects or dust for prints — she finds the letter, the ledger, the newspaper clipping that nobody thought to check. Her notebooks are legendary in the agency; she's never once needed to redo a timeline.",
    quote: "Memory is just evidence that hasn't been organized yet.",
    secondaryQuote: "Someone has to write it down.",
    fieldNoteQuote: "Found the 1998 property deed misfiled under the wrong ward number. Someone wanted it lost. I found it anyway.",
    specialties: [
      "Archival Research",
      "Witness Empathy",
      "Timeline Reconstruction",
      "Document Verification"
    ],
    strengths: [
      { label: "Research", value: 95 },
      { label: "Empathy", value: 92 },
      { label: "Perception", value: 84 },
      { label: "Attention to Detail", value: 90 }
    ]
  },

  // 4. CHRONICLER / PARTNER — Male
  {
    id: "rono-dutta",
    name: "Rono Dutta",
    role: "Chronicler",
    gender: "male",
    age: 29,
    formerOccupation: "Former Court Stenographer",
    coreFocus: "Research, Historical Records, Human Perspectives",
    portrait: "/detectives/rono_dutta.png",
    detailPortrait: "/detectives/rono_dutta_detail.png",
    heroPortrait: "/detectives/rono-dutta-hero.png",
    rosterPortrait: "/detectives/rono-dutta-noir.jpg",
    docketTag: "#RONO-D",
    cardQuote: "Details complete the truth.",
    fileNo: "LCIB-041",
    dossierId: "#RONO-DUTTA",
    department: "Lalbazar Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 2",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "5+",
      casesHandled: "72+",
      successRate: "88%",
      knownFor: "Court testimony breakdown, street informants, rapid scribing",
      approach: "Perceptive. Inquisitive. Detail-driven."
    },
    bio: "Ever-curious and relentlessly loyal, Rono bridges the gap between field officers and dusty library stacks. With a pencil tucked behind his ear and an ink-stained notebook in hand, he uncovers hidden connections in old newspaper archives and river logs.",
    backstory: "Rono spent years transcribing testimony in local courts, developing an ear for the small inconsistencies people don't notice they're saying out loud. He left the courtroom to chronicle field investigations directly, believing that written records — not memory — are the only reliable witness. His notebooks are full of half-finished sentences, corrected timelines, and margin notes that later crack open entire cases.",
    quote: "Ink doesn't lie. People do.",
    secondaryQuote: "Same City. Different Stories.",
    fieldNoteQuote: "The witness paused for exactly four seconds before answering 'no.' I've learned four seconds is never nothing.",
    specialties: [
      "Newspaper Archive Search",
      "Street Lore & Informants",
      "Rapid Field Scribing",
      "Cross-Reference Mapping"
    ],
    strengths: [
      { label: "Curiosity", value: 96 },
      { label: "Resourcefulness", value: 88 },
      { label: "Lateral Thinking", value: 86 },
      { label: "Loyalty & Support", value: 92 }
    ]
  },

  // 5. EVIDENCE ANALYST — Female
  {
    id: "priya-kapoor",
    name: "Priya Kapoor",
    role: "Evidence Analyst",
    gender: "female",
    age: 26,
    formerOccupation: "Former Forensic Lab Technician",
    coreFocus: "Forensics, Ballistics, Fingerprints, Crime Scene Trace",
    portrait: "/detectives/priya_kapoor.png",
    detailPortrait: "/detectives/priya_kapoor_detail.png",
    heroPortrait: "/detectives/priya-kapoor-hero.png",
    rosterPortrait: "/detectives/priya-kapoor-noir.jpg",
    docketTag: "#PRIYA",
    cardQuote: "Objects remember.",
    fileNo: "LCIB-058",
    dossierId: "#PRIYA-KAPOOR",
    department: "Forensics Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "5+",
      casesHandled: "95+",
      successRate: "94%",
      knownFor: "Fingerprints, chemical trace, crime scene photogrammetry",
      approach: "Surgical. Objective. Evidence-first."
    },
    bio: "A methodical forensic scientist who turns minuscule crime scene whispers into incontrovertible proof. From latent fingerprint whorls on river dock pilings to chemical residue on smashed lenses, Priya reconstructs the physical truth.",
    backstory: "Priya trained in a government forensic lab before frustration with bureaucratic case backlogs pushed her toward independent field work. She treats a crime scene the way a surgeon treats an operating table — nothing is touched without purpose, nothing is dismissed as coincidence. Her specialty is trace evidence: fibers, soil, residue — the things everyone else walks past.",
    quote: "Objects remember what people try to forget.",
    secondaryQuote: "Evidence doesn't lie. People do.",
    fieldNoteQuote: "The fiber didn't match anyone in the house. It matched the gardener who 'never went inside.' Objects don't get invited to lie.",
    specialties: [
      "Dactyloscopy (Fingerprints)",
      "Crime Scene Photogrammetry",
      "Chemical Residue Analysis",
      "Ballistics Trajectory"
    ],
    strengths: [
      { label: "Forensic Analysis", value: 95 },
      { label: "Precision & Focus", value: 94 },
      { label: "Observation", value: 89 },
      { label: "Methodology", value: 91 }
    ]
  },

  // 6. EVIDENCE ANALYST — Male
  {
    id: "dev-malhotra",
    name: "Dev Malhotra",
    role: "Evidence Analyst",
    gender: "male",
    age: 29,
    formerOccupation: "Former Digital Forensics Consultant",
    coreFocus: "Forensics, Ballistics, Fingerprints, Crime Scene Trace",
    portrait: "/detectives/dev_malhotra.png",
    detailPortrait: "/detectives/dev_malhotra_detail.png",
    heroPortrait: "/detectives/dev-malhotra-hero.png",
    rosterPortrait: "/detectives/dev-malhotra-noir.jpg",
    docketTag: "#DEV-M",
    cardQuote: "Details build truth.",
    fileNo: "LCIB-062",
    dossierId: "#DEV-MALHOTRA",
    department: "Forensics Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "6+",
      casesHandled: "88+",
      successRate: "93%",
      knownFor: "Ballistics, forged documents, chain of custody",
      approach: "Rigorous. Analytical. Scientific."
    },
    bio: "Dev believes that science is the only true witness that cannot be coerced or intimidated. Armed with an analytical microscope and field reagents, he isolates blood splatter physics, firearm striations, and forged paperwork seals.",
    backstory: "Dev cut his teeth investigating cybercrime and financial fraud before realizing physical crime scenes needed the same rigor digital ones did. He treats every case as a chain of custody problem: who touched what, when, and why. Precise almost to the point of tedium, Dev is the reason the agency has never lost a piece of evidence in court.",
    quote: "Show me the residue, not the story.",
    secondaryQuote: "Details Build Truth.",
    fieldNoteQuote: "Metadata says the photo was taken at 11:47 PM. His alibi says he was asleep by 10. Phones don't sleep.",
    specialties: [
      "Ballistics & Firearm Marks",
      "Forensic Biochemistry",
      "Toolmark Examination",
      "Chain-of-Custody Rigor"
    ],
    strengths: [
      { label: "Scientific Rigor", value: 96 },
      { label: "Objectivity", value: 93 },
      { label: "Observation", value: 91 },
      { label: "Preservation", value: 89 }
    ]
  },

  // 7. INTERROGATOR — Female
  {
    id: "zara-ahmed",
    name: "Zara Ahmed",
    role: "Interrogator",
    gender: "female",
    age: 29,
    formerOccupation: "Former Corporate Negotiator",
    coreFocus: "Psychological Profiling, Negotiation, Leverage & Alibis",
    portrait: "/detectives/zara_ahmed.png",
    detailPortrait: "/detectives/zara_ahmed_detail.png",
    heroPortrait: "/detectives/zara-ahmed-hero.png",
    rosterPortrait: "/detectives/zara-ahmed-noir.jpg",
    docketTag: "#ZARA",
    cardQuote: "Everyone tells the truth.",
    fileNo: "LCIB-079",
    dossierId: "#ZARA-AHMED",
    department: "Interrogation Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "7+",
      casesHandled: "110+",
      successRate: "90%",
      knownFor: "Micro-expressions, deception detection, strategic patience",
      approach: "Quiet. Disarming. Inescapable."
    },
    bio: "An instinctual people reader who dissects micro-expressions, speech hesitation, and shifting body language in the interrogation room. Zara never raises her voice — she simply tightens the logic until truth becomes the suspect's only escape.",
    backstory: "Zara spent years negotiating high-stakes mergers before discovering she was better at reading people who were lying to protect themselves than executives lying to protect profits. She doesn't interrogate with pressure — she interrogates with patience, letting silence do the work most detectives waste on shouting. Suspects often leave her room convinced they've won, only to realize later exactly what they gave away.",
    quote: "Everyone tells the truth. Eventually.",
    secondaryQuote: "A more human kind of justice.",
    fieldNoteQuote: "He apologized before I asked a single question. Innocent people rarely rehearse remorse.",
    specialties: [
      "Behavioral Profiling",
      "Statement Breakdown",
      "Deception Detection",
      "High-Pressure Interviewing"
    ],
    strengths: [
      { label: "Psychological Insight", value: 95 },
      { label: "Intuition", value: 93 },
      { label: "Composure", value: 88 },
      { label: "Persuasion", value: 91 }
    ]
  },

  // 8. INTERROGATOR — Male
  {
    id: "farhan-ali-khan",
    name: "Farhan Ali Khan",
    role: "Interrogator",
    gender: "male",
    age: 31,
    formerOccupation: "Former Hospitality Manager",
    coreFocus: "Psychological Profiling, Negotiation, Leverage & Alibis",
    portrait: "/detectives/farhan_ali_khan.png",
    detailPortrait: "/detectives/farhan_ali_khan_detail.png",
    heroPortrait: "/detectives/farhan-ali-khan-hero.png",
    rosterPortrait: "/detectives/farhan-ali-khan-noir.jpg",
    docketTag: "#FARHAN",
    cardQuote: "Silence is an admission.",
    fileNo: "LCIB-085",
    dossierId: "#FARHAN-ALI-KHAN",
    department: "Interrogation Unit",
    status: "Active Investigator",
    clearanceLevel: "Level 3",
    baseCity: "Kolkata",
    atAGlance: {
      yearsExperience: "8+",
      casesHandled: "105+",
      successRate: "89%",
      knownFor: "Underworld leverage, hospitality psychology, crisis negotiation",
      approach: "Charming. Calculating. Decisive."
    },
    bio: "A master negotiator and strategist who understands power dynamics, leverage, and the vulnerabilities of Kolkata's high-society and underworld figures alike. Farhan builds trust over black coffee, then turns contradictions into confessions.",
    backstory: "Farhan ran the guest-relations floor of a five-star hotel for years, developing an instinct for reading discomfort behind a polite smile. He left hospitality after realizing the skill translated far better to interrogation rooms than to complaint desks. Charming, disarming, and quick to build false comfort, Farhan's gift is making people feel safe enough to say something they shouldn't.",
    quote: "People lie with words. Never with silence.",
    secondaryQuote: "Details Create Leverage.",
    fieldNoteQuote: "Offered him tea before the questions started. By the second cup, he'd already told me more than his lawyer would like.",
    specialties: [
      "Leverage & Bargaining",
      "Hostage & Crisis Negotiation",
      "Underworld Interrogation",
      "Motive Exploitation"
    ],
    strengths: [
      { label: "Negotiation", value: 96 },
      { label: "Charisma & Influence", value: 92 },
      { label: "Tactical Thinking", value: 90 },
      { label: "Discretion", value: 89 }
    ]
  }
];

export function getDetectiveById(id: string): Detective | undefined {
  return DETECTIVES.find((d) => d.id === id);
}

export function getAdjacentDetectives(currentId: string): { prev: Detective; next: Detective } {
  const index = DETECTIVES.findIndex((d) => d.id === currentId);
  const safeIndex = index === -1 ? 0 : index;
  const prevIndex = (safeIndex - 1 + DETECTIVES.length) % DETECTIVES.length;
  const nextIndex = (safeIndex + 1) % DETECTIVES.length;
  return {
    prev: DETECTIVES[prevIndex],
    next: DETECTIVES[nextIndex],
  };
}
