# 🌧️ Bhorer Shahar: Case Files (ভোরের শহর)
### *Case 001: The Last Ferry (MV Sonartori Crossing)*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5.25-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1.0-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.7.0-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Turbopack](https://img.shields.io/badge/Turbopack-Enabled-brightgreen)](https://nextjs.org/docs/app/api-reference/turbopack)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **"In the monsoon rain of 1990s Calcutta, every ripple on the Hooghly carries a secret... and some passengers never reach the opposite shore."**

**Bhorer Shahar: Case Files** is an atmospheric, detective deduction game set in 1990s Calcutta. Step into the shoes of Lalbazar detectives investigating high-stakes mysteries across the city's rain-soaked ghats, vintage tram corridors, and forgotten municipal archives.

---

## 📜 The Mystery: Case 001 — *The Last Ferry*

On a torrential monsoon evening, the **MV Sonartori** makes its final 20:45 crossing from Babughat to Howrah. Mid-river, amidst the blinding downpour and engine roar, **Abir Basu**—a senior municipal auditor carrying explosive tender fraud disclosures—vanishes from **Seat 14**.

All that remains is an untouched folding umbrella, a locked briefcase with a severed strap, and signs of forced entry into the lower waterline bilge hatch.

Detectives must comb through forensic exhibits, cross-examine suspicious passengers and crew, string together deductions on the shared caseboard, and issue arrest warrants before dawn breaks over the river.

---

## ✨ Key Features & Gameplay Mechanics

### 🕵️‍♂️ Solo & Squad Multiplayer Investigation
- **Solo Detective Mode:** Tackle the full investigation at your own deliberate pace with dedicated solo room instances.
- **Multiplayer Squad Rooms:** Collaborate in real-time with fellow detectives using 4-character room codes (`SOLO-XXXX` / `SQUAD-XXXX`).
- **Telegraph Dispatch System:** Send real-time dispatched telegraph notes to squad members across stations.

### 🔍 Interactive Witness Interrogation & Cross-Examination
- **Dynamic Branching Testimony:** Interrogate key persons of interest including **Harun Sheikh** (Ferry Pilot), **Rina Sen** (Archive Clerk), **Debashish Pal** (Tender Contractor), and **Dr. Ashok Mitra** (Coroner).
- **Selectable Inquiries & Custom Leads:** Probe suspects with pre-set cross-examination angles or dispatch custom inquiries into the field.
- **Reactive Suspect States:** Suspect alibis shift dynamically as incriminating exhibits and contradicting logs are discovered.

### 📌 Interactive Shared Caseboard & Red-String Deduction
- **Corkboard Evidence Mapping:** Drag, organize, and inspect crime scene photographs, ledger fragments, autopsy transcripts, and DVR logs.
- **Red-String Deduction Connections:** Link related evidence nodes on the corkboard to establish motive, opportunity, and means.
- **Canon Verification:** Valid connections confirm deductive hypotheses and award IQS score bonuses.

### 🗂️ 5-Episode Narrative Campaign Progression
1. **Episode 1 — *The Empty Seat*:** Initial crime scene examination, Seat 14 perimeter security, and passenger manifest triage.
2. **Episode 2 — *Rain on the Deck*:** Lower deck inspection, waterline bilge hatch seals, and engine room access logs.
3. **Episode 3 — *The Voices at Ghat No. 6*:** Port CCTV DVR recoveries, encrypted micro-cassette voicemails, and dockworker testimonies.
4. **Episode 4 — *The Missing Ledger*:** Carbon paper reconstruction of the Municipal Dredging Tender fraud and financial kickback chains.
5. **Episode 5 — *Before Dawn (Climax Indictment)*:** High-stakes final accusation accusing the Mastermind and Accomplice with decisive evidentiary proof, triggering the magistrate raid cinematic.

### ⚖️ Investigation Quality Score (IQS) Scoring Matrix
- Real-time performance tracking evaluating:
  - **Deductive Precision:** Identifying true culprits and decisive murder weapon/method.
  - **Evidence Thoroughness:** Uncovering hidden physical and documentary evidence.
  - **Informant Penalty:** Deductions incurred when consulting paid street informants.
  - **Procedural Rank:** From **Rank C** up to **Rank A+ / Master Investigator (100/100)**.

### 🎶 Authentic 1990s Noir Soundscape
- Dynamic ambient soundscapes powered by **Howler.js**: continuous monsoon downpours, river waves slapping against timber hulls, typewriter keys, and retro rotary telephone chimes.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 15.5.25](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling & Design** | [Tailwind CSS 3.7](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Audio Engine** | [Howler.js](https://howlerjs.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.18.0 or newer recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sramanpati48-hue/Detective-Game.git
   cd Detective-Game
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Launch the development server with Turbopack:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the desk board and begin investigating.

---

## 🧪 Verification & Automated Playthrough Audit

The repository includes comprehensive automated headless playthrough scripts testing end-to-end game completion:

```bash
# Run the complete 14-stage solo playthrough & accessibility audit
node scripts/playthrough-solo-deep-audit.mjs

# Run full fast-path regression test
node scripts/playthrough-solo-full.mjs
```

These scripts verify:
- Complete episode 1 through 5 progression
- Clue persistence across all unlocked episodes
- Full accessible keyboard navigation and ARIA attributes
- Evidence modal inspection, caseboard pinning, and hint unlocks
- Accurate magistrate verdict and 100/100 IQS calculation

---

## 📁 Project Directory Structure

```text
├── public/                 # Static assets, vintage photos, soundscapes & maps
├── scripts/                # Automated headless audit & simulation suites
├── src/
│   ├── app/                # Next.js 15 App Router pages & API routes
│   │   ├── api/            # Room creation, sync & investigation endpoints
│   │   ├── cases/          # Case briefing docket & archive screens
│   │   ├── room/           # Live investigation room & episode layouts
│   │   └── page.tsx        # Title screen & Lalbazar detective desk
│   ├── components/         # Modular React UI components
│   │   ├── investigation/  # Caseboard, interrogation, clues, modals & debrief
│   │   ├── tutorial/       # Field guide & interactive onboarding walkthrough
│   │   └── ui/             # Radix & Tailwind design primitives
│   └── lib/                # Domain logic, case datasets & validators
│       ├── data/           # Case 001 clues, dialogue trees & timelines
│       ├── game/           # Checkpoint validators, IQS scoring & objectives
│       └── audio/          # Noir soundscape controller
└── package.json            # Project manifest & scripts
```

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

*“Lalbazar never sleeps until the truth surfaces.”*
