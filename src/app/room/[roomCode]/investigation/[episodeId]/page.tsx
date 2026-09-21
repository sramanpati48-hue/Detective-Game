"use client";
import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useInvestigationStore,
  InvestigationTab,
} from "@/lib/game/useInvestigationStore";
import {
  THE_LAST_FERRY_CASE,
  getEpisodeByNumber,
} from "@/lib/data/cases/the-last-ferry";
import { FinalAccusationSubmission } from "@/lib/game/checkpointValidator";
import { soundManager } from "@/lib/audio/soundManager";

// 14 Investigation Components
import EpisodeBriefingScreen from "@/components/investigation/EpisodeBriefingScreen";
import EvidenceViewerModal from "@/components/investigation/EvidenceViewerModal";
import WitnessInterviewScreen from "@/components/investigation/WitnessInterviewScreen";
import SharedCaseboard from "@/components/investigation/SharedCaseboard";
import SuspectMatrix from "@/components/investigation/SuspectMatrix";
import TimelineBoard from "@/components/investigation/TimelineBoard";
import ConnectionGraphBoard from "@/components/investigation/ConnectionGraphBoard";
import RoomChatPanel from "@/components/investigation/RoomChatPanel";
import CheckpointModal from "@/components/investigation/CheckpointModal";
import HintModal from "@/components/investigation/HintModal";
import FinalAccusationScreen from "@/components/investigation/FinalAccusationScreen";
import RevealCinematic from "@/components/investigation/RevealCinematic";
import ResultsScreen from "@/components/investigation/ResultsScreen";
import EpisodeUnlockTransition from "@/components/investigation/EpisodeUnlockTransition";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay";

import {
  Folder,
  FileText,
  Users,
  Pin,
  Clock,
  Radio,
  HelpCircle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Gavel,
  Wifi,
  WifiOff,
  BookOpen,
} from "lucide-react";

export default function InvestigationPage({
  params,
}: {
  params: Promise<{ roomCode: string; episodeId: string }>;
}) {
  const { roomCode, episodeId } = use(params);
  const router = useRouter();

  const store = useInvestigationStore();
  const currentEp = store.getCurrentEpisode() || THE_LAST_FERRY_CASE.episodes[0];
  const accessibleClues = store.getAllAccessibleClues();
  const myClues = store.getMyClues();
  const currentCheckpointStatus = store.checkpointStatus[currentEp.id] || {
    passed: false,
    attempts: 0,
    hintsUsed: [],
  };
  const selectedClue = accessibleClues.find((c) => c.id === store.selectedClueId) || null;
  const currentIQS = store.calculateCurrentIQS();

  const [transitionNextTitle, setTransitionNextTitle] = useState<string | null>(null);
  
  // Tutorial State: Always trigger each time user starts an investigation
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [hasStartedInvestigationSession, setHasStartedInvestigationSession] = useState(false);

  // Initialize Store with roomCode
  useEffect(() => {
    store.init(roomCode);
    soundManager.startRain();

    const interval = setInterval(() => {
      store.pollServer();
    }, 3000);

    return () => {
      clearInterval(interval);
      soundManager.stopRain();
    };
  }, [roomCode]);

  // Sync route episodeId with store currentEpisodeId if unlocked
  useEffect(() => {
    if (episodeId && episodeId !== store.currentEpisodeId && store.unlockedEpisodes.includes(episodeId)) {
      store.switchEpisode(episodeId);
    }
  }, [episodeId]);

  // Launch tutorial sequence automatically whenever the user starts investigation (when briefing closes or if starting in investigation)
  useEffect(() => {
    if (!hasStartedInvestigationSession && store.activeTab !== "briefing") {
      setIsTutorialActive(true);
      setHasStartedInvestigationSession(true);
    }
  }, [hasStartedInvestigationSession, store.activeTab]);

  const handleCheckpointSubmit = async (selectedClueIds: string[], notes: string) => {
    const res = await store.submitCheckpoint(currentEp.episodeNumber, selectedClueIds, notes);
    return res?.validation || null;
  };

  const handleProceedNextEpisode = () => {
    store.setCheckpointModalOpen(false);
    const nextEpNumber = currentEp.episodeNumber + 1;
    const nextEp = getEpisodeByNumber(nextEpNumber);

    if (nextEp) {
      setTransitionNextTitle(nextEp.title);
    } else {
      // Reached conclusion!
      store.setAccusationOpen(true);
    }
  };

  const handleContinueAfterTransition = () => {
    const nextEpNumber = currentEp.episodeNumber + 1;
    const nextEp = getEpisodeByNumber(nextEpNumber);
    setTransitionNextTitle(null);

    if (nextEp) {
      router.push(`/room/${roomCode}/investigation/${nextEp.id}`);
    }
  };

  const handleAccusationSubmit = async (submission: FinalAccusationSubmission) => {
    const res = await store.submitAccusation(submission);
    return res;
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0906] text-[#FAF4E8] flex flex-col justify-between font-sans selection:bg-[#8C2D32]/40 relative">
      {/* Background Atmosphere Layers */}
      <div
        className="fixed inset-0 bg-cover bg-center pointer-events-none z-0 opacity-20 brightness-[0.6]"
        style={{ backgroundImage: "url('/cases/the-last-ferry/scene_deck_night.jpg')" }}
      />
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(10,7,5,0.92)_100%)]" />

      {/* Top Header & Investigation Context Bar */}
      <header className="relative z-30 bg-[#140E0A]/95 border-b-2 border-[#C99A3C]/40 backdrop-blur-md px-4 sm:px-8 py-3 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Case & Identity Branding */}
          <div className="flex items-center gap-4">
            <Link
              href="/cases/the-last-ferry"
              className="font-serif text-lg font-bold text-[#E8C66A] hover:text-[#FFF] transition-colors flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#8C2D32]" />
              <span>THE LAST FERRY</span>
            </Link>

            <span className="text-[#665040] hidden sm:inline">&bull;</span>

            {/* Episode Selector Pill */}
            <div
              data-tutorial-id="tutorial-episode-selector"
              className="flex items-center gap-1 bg-[#1F1710] px-3 py-1 rounded-xs border border-[#C99A3C]/30 text-xs font-mono"
            >
              <span className="text-[#D9C7A6]/70">EPISODE:</span>
              <select
                value={currentEp.id}
                onChange={(e) => {
                  const targetId = e.target.value;
                  router.push(`/room/${roomCode}/investigation/${targetId}`);
                }}
                className="bg-transparent text-[#E8C66A] font-bold outline-none cursor-pointer"
              >
                {THE_LAST_FERRY_CASE.episodes.map((ep) => {
                  const isUnlocked = store.unlockedEpisodes.includes(ep.id);
                  return (
                    <option
                      key={ep.id}
                      value={ep.id}
                      disabled={!isUnlocked}
                      className="bg-[#1F1710] text-[#FAF4E8]"
                    >
                      Ep {ep.episodeNumber}: {ep.title} {!isUnlocked ? "(Locked)" : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Reconnection Status Indicator (Refinement #3) */}
            <div className="flex items-center gap-1.5 text-xs font-mono">
              {store.connectionStatus === "connected" ? (
                <span className="flex items-center gap-1 text-[#3FB950]" title="Server Synchronized">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline text-[10px]">SYNCED</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#F85149] animate-pulse" title="Reconnecting...">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="text-[10px]">RECONNECTING...</span>
                </span>
              )}
            </div>
          </div>

          {/* Center-Right: Action Modals, Tutorial Replay, Field Manual & Audio */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Live IQS Indicator */}
            <div className="flex items-center gap-2 px-3 py-1 bg-[#241A13] border border-[#C99A3C]/40 rounded-xs font-mono text-xs">
              <span className="text-[#D9C7A6]/70">IQS:</span>
              <span className="font-bold text-[#E8C66A]">{currentIQS}</span>
              <span className="text-[10px] text-[#3FB950] font-bold">
                {currentIQS >= 90 ? "A+" : currentIQS >= 80 ? "A" : currentIQS >= 65 ? "B" : "C"}
              </span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={store.toggleMute}
              className="p-1.5 rounded-xs bg-[#1F1710] text-[#E8C66A] hover:bg-[#2D1F17] transition-colors border border-[#C99A3C]/30 text-xs font-mono cursor-pointer"
              title="Toggle Noir Soundscape"
            >
              {store.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Permanent 'How to Play' Field Manual Link */}
            <Link
              href="/how-to-play"
              target="_blank"
              className="p-1.5 rounded-xs bg-[#1F1710] text-[#E8C66A] hover:bg-[#2D1F17] hover:text-[#FFF] transition-colors border border-[#C99A3C]/30 text-xs font-mono cursor-pointer flex items-center gap-1"
              title="The Field Manual (How to Play)"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-bold">Manual</span>
            </Link>

            {/* Replay Tutorial Button */}
            <button
              onClick={() => {
                setIsTutorialActive(true);
                store.setActiveTab("evidence");
              }}
              className="p-1.5 rounded-xs bg-[#1F1710] text-[#D9C7A6] hover:text-[#E8C66A] hover:bg-[#2D1F17] transition-colors border border-[#C99A3C]/30 text-xs font-mono cursor-pointer flex items-center gap-1"
              title="Replay Field Tutorial"
            >
              <BookOpen className="w-4 h-4 text-[#C99A3C]" />
              <span className="hidden xl:inline text-[10px] uppercase tracking-wider font-bold">Tutorial</span>
            </button>

            {/* Hint Button */}
            <button
              data-tutorial-id="tutorial-hint-btn"
              onClick={() => store.setHintModalOpen(true)}
              className="px-3 py-1.5 bg-[#241A13] hover:bg-[#332216] text-[#E8C66A] rounded-xs font-serif text-xs uppercase tracking-wider flex items-center gap-1.5 border border-[#C99A3C]/40 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Informant</span>
            </button>

            {/* Episode Checkpoint Button */}
            <button
              data-tutorial-id="tutorial-checkpoint-btn"
              onClick={() => store.setCheckpointModalOpen(true)}
              className={`px-4 py-1.5 rounded-xs font-serif text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 border shadow-md cursor-pointer transition-all ${
                currentCheckpointStatus.passed
                  ? "bg-[#2B4C3F] text-[#FAF4E8] border-[#3FB950]"
                  : "bg-[#702428] hover:bg-[#852C32] text-[#FAF4E8] border-[#C99A3C] animate-pulse"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{currentCheckpointStatus.passed ? "Checkpoint Cleared" : "Review Checkpoint"}</span>
            </button>

            {/* Climax Button if Episode 5 */}
            {currentEp.episodeNumber === 5 && (
              <button
                onClick={() => store.setAccusationOpen(true)}
                className="px-4 py-1.5 bg-gradient-to-r from-[#8C2D32] to-[#B0383F] text-[#FAF4E8] rounded-xs font-serif text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5 border border-[#E8C66A] shadow-lg cursor-pointer hover:scale-105 transition-transform"
              >
                <Gavel className="w-3.5 h-3.5 text-[#E8C66A]" />
                <span>Accusation</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-[#3D2C20] flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "briefing", label: "Briefing", icon: Folder },
            { id: "evidence", label: `Evidence (${accessibleClues.length})`, icon: FileText },
            { id: "witnesses", label: `Witnesses (${currentEp.witnesses.length})`, icon: Users },
            { id: "caseboard", label: "Caseboard", icon: Pin },
            { id: "timeline", label: "Timeline & Links", icon: Clock },
            { id: "chat", label: "Squad Telegraph", icon: Radio },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = store.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                data-tutorial-id={
                  tab.id === "caseboard"
                    ? "tutorial-caseboard-tab"
                    : tab.id === "chat"
                    ? "tutorial-chat-tab"
                    : undefined
                }
                onClick={() => store.setActiveTab(tab.id as InvestigationTab)}
                className={`px-3.5 py-1.5 rounded-xs font-serif text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FAF4E8] text-[#1F1710] font-bold border border-[#C99A3C] shadow-md"
                    : "bg-[#18110C] text-[#D9C7A6] hover:bg-[#261A13] border border-[#3D2C20]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#8C2D32]" : "text-[#C99A3C]"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Screen Viewport */}
      <main className="relative z-10 flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* TAB 1: BRIEFING */}
        {store.activeTab === "briefing" && (
          <EpisodeBriefingScreen
            episode={currentEp}
            onProceed={() => {
              store.setActiveTab("evidence");
              setIsTutorialActive(true);
              setHasStartedInvestigationSession(true);
            }}
            isMuted={store.isMuted}
            onToggleMute={store.toggleMute}
          />
        )}

        {/* TAB 2: EVIDENCE EXHIBITS */}
        {store.activeTab === "evidence" && (
          <div className="w-full max-w-6xl mx-auto space-y-6 font-serif">
            {/* Clues Filter & Description */}
            <div className="bg-[#241A13] text-[#FAF4E8] p-5 rounded-xs border border-[#C99A3C]/40 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-mono text-xs text-[#E8C66A] uppercase tracking-widest mb-1">
                  Recovered Exhibits & Evidence Dossier
                </div>
                <h2 className="font-serif text-2xl font-bold">Forensic File: {currentEp.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[#D9C7A6]/70">
                  {myClues.length} in Your Inventory &bull; {store.sharedEvidenceIds.length} Shared
                </span>
              </div>
            </div>

            {/* Clue Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accessibleClues.map((clue, idx) => {
                const isShared = store.sharedEvidenceIds.includes(clue.id);
                const isPinned = store.caseboardPins.some((p) => p.evidenceId === clue.id);

                return (
                  <div
                    key={clue.id}
                    data-tutorial-id={idx === 0 ? "tutorial-first-clue" : undefined}
                    onClick={() => store.setSelectedClueId(clue.id)}
                    className="bg-[#FAF4E8] text-[#1F1710] rounded-sm p-5 border-2 border-[#D4B26F]/60 shadow-lg flex flex-col justify-between cursor-pointer transition-all hover:border-[#8C2D32] hover:scale-[1.01] relative bg-[radial-gradient(#E8DAC2_1px,transparent_1px)] [background-size:14px_14px]"
                  >
                    <div>
                      {/* Clue Image */}
                      {clue.image && (
                        <div className="relative w-full aspect-[16/10] rounded-xs overflow-hidden border border-[#241A13] mb-3 bg-[#110D0A]">
                          <Image
                            src={clue.image}
                            alt={clue.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-mono text-[10px] uppercase font-bold text-[#8C2D32] px-1.5 py-0.5 bg-[#F2E5D0] rounded-xs border border-[#C99A3C]/40">
                          {clue.type}
                        </span>
                        {isShared ? (
                          <span className="font-mono text-[9px] uppercase font-bold text-[#2B4C3F]">
                            Shared with Room
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] uppercase font-bold text-[#8C2D32]">
                            Private to You
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#1F1710] leading-snug mb-2">
                        {clue.title}
                      </h3>
                      <p className="font-serif text-xs text-[#4A3728] leading-relaxed line-clamp-3">
                        {clue.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#D4B26F]/50 flex items-center justify-between text-xs font-mono text-[#8C2D32]">
                      <span className="underline">Inspect Full Exhibit &rarr;</span>
                      {isPinned && <span className="text-[#C99A3C] font-bold">&bull; On Board</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: WITNESS DEPOSITIONS */}
        {store.activeTab === "witnesses" && (
          <WitnessInterviewScreen
            witnesses={currentEp.witnesses}
            dialogues={currentEp.dialogueScripts}
            selectedWitnessId={store.selectedWitnessId}
            onSelectWitness={store.setSelectedWitnessId}
            onTagDialogue={(phrase) => {
              store.sendChat(`Statement noted: "${phrase}"`);
            }}
          />
        )}

        {/* TAB 4: CASEBOARD */}
        {store.activeTab === "caseboard" && (
          <SharedCaseboard
            pins={store.caseboardPins}
            connections={store.caseboardConnections}
            availableClues={accessibleClues}
            onPinEvidence={store.pinEvidence}
            onConnectPins={store.connectEvidence}
            onOpenClue={store.setSelectedClueId}
          />
        )}

        {/* TAB 5: TIMELINE & DEDUCTIONS */}
        {store.activeTab === "timeline" && (
          <div className="space-y-8">
            <TimelineBoard
              currentOrder={store.timelineOrder}
              onOrderChange={store.orderTimeline}
            />
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C99A3C]/40 to-transparent my-8" />
            <ConnectionGraphBoard
              accessibleClues={accessibleClues}
              onAddConnection={(sourceId, targetId, notes) => {
                store.connectEvidence(sourceId, targetId, sourceId, targetId, notes);
              }}
            />
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C99A3C]/40 to-transparent my-8" />
            <SuspectMatrix
              onInterviewSuspect={(suspectId) => {
                store.setSelectedWitnessId(suspectId);
                store.setActiveTab("witnesses");
              }}
            />
          </div>
        )}

        {/* TAB 6: SQUAD TELEGRAPH */}
        {store.activeTab === "chat" && (
          <RoomChatPanel
            messages={store.chatMessages}
            myClues={myClues}
            onSendMessage={store.sendChat}
            onOpenClue={store.setSelectedClueId}
          />
        )}
      </main>

      {/* MODAL 1: Evidence Viewer */}
      {store.selectedClueId && (
        <EvidenceViewerModal
          clue={selectedClue}
          onClose={() => store.setSelectedClueId(null)}
          onShare={(clueId) => store.shareEvidence(clueId)}
          onPin={(clueId) => {
            store.pinEvidence(clueId, 100, 100);
            store.setSelectedClueId(null);
            store.setActiveTab("caseboard");
          }}
          onAttachToChat={() => {
            store.setSelectedClueId(null);
            store.setActiveTab("chat");
          }}
          isShared={store.sharedEvidenceIds.includes(store.selectedClueId)}
          isPinned={store.caseboardPins.some((p) => p.evidenceId === store.selectedClueId)}
        />
      )}

      {/* MODAL 2: Checkpoint Review */}
      {store.isCheckpointModalOpen && (
        <CheckpointModal
          episode={currentEp}
          accessibleClues={accessibleClues}
          isOpen={store.isCheckpointModalOpen}
          onClose={() => store.setCheckpointModalOpen(false)}
          onSubmit={handleCheckpointSubmit}
          onProceedNext={handleProceedNextEpisode}
          onOpenHints={() => {
            store.setCheckpointModalOpen(false);
            store.setHintModalOpen(true);
          }}
          isCompleted={currentCheckpointStatus.passed}
        />
      )}

      {/* MODAL 3: Hints */}
      {store.isHintModalOpen && (
        <HintModal
          episode={currentEp}
          hintsUsed={currentCheckpointStatus.hintsUsed}
          isOpen={store.isHintModalOpen}
          onClose={() => store.setHintModalOpen(false)}
          onUnlockHint={(tier) => store.useHint(currentEp.id, tier)}
        />
      )}

      {/* MODAL 4: Final Accusation */}
      {store.isAccusationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl my-auto">
            <button
              onClick={() => store.setAccusationOpen(false)}
              className="absolute top-4 right-4 z-50 text-white hover:text-[#E8C66A] p-2"
            >
              ✕
            </button>
            <FinalAccusationScreen
              accessibleClues={accessibleClues}
              onSubmitAccusation={handleAccusationSubmit}
              onShowCinematic={() => {
                store.setAccusationOpen(false);
                store.setCinematicActive(true);
              }}
              finalResult={store.finalAccusation?.result}
            />
          </div>
        </div>
      )}

      {/* MODAL 5: Reveal Cinematic */}
      {store.isCinematicActive && (
        <RevealCinematic
          onComplete={() => {
            store.setCinematicActive(false);
          }}
        />
      )}

      {/* MODAL 6: Results Screen (If final accusation passed and not viewing cinematic) */}
      {store.finalAccusation?.passed && store.finalAccusation.result && !store.isCinematicActive && !store.isAccusationOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <ResultsScreen
            result={store.finalAccusation.result}
            roomCode={roomCode}
            detectiveName={store.detectiveName}
            onReviewDossier={() => {
              store.switchEpisode("ep1");
              store.setActiveTab("evidence");
            }}
          />
        </div>
      )}

      {/* TRANSITION: Episode Unlock Cliffhanger */}
      {transitionNextTitle && (
        <EpisodeUnlockTransition
          completedEpisode={currentEp}
          nextEpisodeTitle={transitionNextTitle}
          onContinue={handleContinueAfterTransition}
        />
      )}

      {/* Interactive First-Time Tutorial Overlay */}
      <TutorialOverlay
        isOpen={isTutorialActive}
        isSoloMode={false}
        onClose={() => setIsTutorialActive(false)}
        onComplete={() => {
          setIsTutorialActive(false);
        }}
        isEvidenceModalOpen={Boolean(store.selectedClueId)}
        hasPinnedEvidence={store.caseboardPins.length > 0}
        currentActiveTab={store.activeTab}
        onNavigateTab={(tab) => store.setActiveTab(tab as InvestigationTab)}
        onOpenFirstClue={() => {
          if (accessibleClues.length > 0) {
            store.setSelectedClueId(accessibleClues[0].id);
          }
        }}
      />

      {/* Noir Footer */}
      <footer className="relative z-10 py-3 px-8 text-center text-[11px] font-serif italic text-[#D9C7A6]/50 border-t border-[#3D2C20] bg-[#120D09]/80">
        Bhorer Shahar: Case Files &bull; Special Division, Lalbazar &bull; Case 001: The Last Ferry
      </footer>
    </div>
  );
}
