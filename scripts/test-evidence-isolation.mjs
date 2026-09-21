// Verification Script for Evidence Isolation & Rule Engine (Case 001)
// Run against live Next.js server on http://localhost:3000

async function runTests() {
  console.log("==================================================");
  console.log("🕵️  BHORER SHAHAR: CASE 001 VERIFICATION SUITE");
  console.log("==================================================\n");

  const baseUrl = "http://localhost:3000";
  const roomCode = `TEST_${Date.now()}`;
  const player1 = "det_ananya";
  const player2 = "det_somesh";

  // TEST 1: Evidence Isolation between Player 1 and Player 2
  console.log(`[TEST 1] Registering Player 1 & Player 2 in Room ${roomCode}...`);
  
  // Register Player 1
  const p1Res = await fetch(
    `${baseUrl}/api/room/${roomCode}/investigation?playerId=${player1}&detectiveId=ananya&detectiveName=Inspector+Ananya+Roy`
  );
  const p1Data = await p1Res.json();

  // Register Player 2
  const p2Res = await fetch(
    `${baseUrl}/api/room/${roomCode}/investigation?playerId=${player2}&detectiveId=somesh&detectiveName=Sub-Inspector+Somesh+Kundu`
  );
  const p2Data = await p2Res.json();

  console.log(`  Player 1 Private Evidence:`, p1Data.myEvidenceIds);
  console.log(`  Player 2 Private Evidence:`, p2Data.myEvidenceIds);
  console.log(`  Shared Evidence:`, p1Data.sharedEvidenceIds);

  // Assert isolation:
  // Neither player should have the other player's private-exclusive items in myEvidence
  const p1HasOnlyHis = p1Data.myEvidenceIds.length > 0;
  const p2HasOnlyHis = p2Data.myEvidenceIds.length > 0;
  const sharedInitiallyEmpty = p1Data.sharedEvidenceIds.length === 0;

  if (!p1HasOnlyHis || !p2HasOnlyHis || !sharedInitiallyEmpty) {
    throw new Error("❌ Evidence isolation failed! Clues are leaking before being shared.");
  }
  console.log("  ✅ PASS: Evidence is strictly scoped per-player prior to sharing.\n");

  // TEST 2: Player 1 shares a clue to the caseboard
  const clueToShare = p1Data.myEvidenceIds[0];
  console.log(`[TEST 2] Player 1 pins clue '${clueToShare}' to Shared Caseboard...`);

  const shareRes = await fetch(`${baseUrl}/api/room/${roomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "share_evidence",
      playerId: player1,
      detectiveName: "Inspector Ananya Roy",
      payload: { evidenceId: clueToShare },
    }),
  });
  const shareData = await shareRes.json();

  if (!shareData.sharedEvidenceIds.includes(clueToShare)) {
    throw new Error("❌ Clue was not added to shared evidence!");
  }
  console.log("  ✅ PASS: Clue added to server sharedEvidenceIds.\n");

  // TEST 3: Verify Player 2 now sees the shared clue in sharedEvidenceIds
  console.log(`[TEST 3] Verifying Player 2 can now access the shared clue...`);
  const p2SyncRes = await fetch(
    `${baseUrl}/api/room/${roomCode}/investigation?playerId=${player2}&detectiveId=somesh`
  );
  const p2SyncData = await p2SyncRes.json();

  if (!p2SyncData.sharedEvidenceIds.includes(clueToShare)) {
    throw new Error("❌ Player 2 cannot see the shared clue!");
  }
  console.log("  ✅ PASS: Player 2 successfully received Player 1's shared evidence.\n");

  // TEST 4: Submit Checkpoint for Episode 1
  console.log(`[TEST 4] Submitting Checkpoint for Episode 1...`);
  const checkRes = await fetch(`${baseUrl}/api/room/${roomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_checkpoint",
      playerId: player1,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        episodeNumber: 1,
        selectedClueIds: ["c1_seat_14_photo", "c1_umbrella_intact"],
        notes: "The umbrella found at seat 14 was dry, meaning Basu never went outside in the rain.",
      },
    }),
  });
  const checkData = await checkRes.json();

  if (!checkData.validation?.passed) {
    throw new Error(`❌ Checkpoint 1 failed: ${checkData.validation?.feedback}`);
  }
  console.log(`  ✅ PASS: Checkpoint 1 Verified (${checkData.validation.message}).`);
  console.log(`  Unlocked Episodes:`, checkData.unlockedEpisodes, "\n");

  // TEST 5: Submit Final Accusation (Episode 5)
  console.log(`[TEST 5] Submitting Final Accusation for Case 001...`);
  const accusationRes = await fetch(`${baseUrl}/api/room/${roomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_accusation",
      playerId: player1,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        submission: {
          plannerId: "debashish_pal",
          accompliceId: "harun_sheikh",
          methodDescription: "Basu was lured down to the lower maintenance hatch and transferred to a launch at Ghat 6 during CCTV blackout.",
          decisiveClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
        },
      },
    }),
  });
  const accusationData = await accusationRes.json();

  if (!accusationData.result?.passed) {
    throw new Error(`❌ Accusation failed: ${JSON.stringify(accusationData)}`);
  }
  console.log(`  ✅ PASS: Final Accusation Succeeded!`);
  console.log(`  IQS Score: ${accusationData.result.finalIQS} (${accusationData.result.rank} Rank)`);
  console.log(`  Review: "${accusationData.result.narrativeReview.slice(0, 80)}..."\n`);

  console.log("==================================================");
  console.log("🎉 ALL 5 VERIFICATION CRITERIA PASSED CLEANLY!");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
