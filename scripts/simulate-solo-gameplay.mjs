// Comprehensive Single-Player Simulation and Problem Detection Script
// Tests all APIs and flows for a single player in Bhorer Shahar: Case Files

const baseUrl = "http://localhost:3000";

async function runSoloAudit() {
  console.log("==================================================");
  console.log("🕵️  SINGLE-PLAYER COMPREHENSIVE PLAYTHROUGH AUDIT");
  console.log("==================================================\n");

  const issuesFound = [];

  // 1. Audit Room Creation Flow
  console.log("1. Testing Room Creation Flow...");
  // Test A: Direct Solo Room (SOLO-1234)
  const soloRoomCode = `SOLO-${Math.floor(1000 + Math.random() * 9000)}`;
  const soloPlayerId = "solo-investigator";
  
  const soloInitRes = await fetch(
    `${baseUrl}/api/room/${soloRoomCode}/investigation?playerId=${soloPlayerId}&detectiveId=ananya&detectiveName=Inspector+Ananya+Roy`
  );
  const soloInitData = await soloInitRes.json();
  console.log(`  SOLO Room (${soloRoomCode}) Evidence count:`, soloInitData.myEvidenceIds.length);
  if (soloInitData.myEvidenceIds.length < 5) {
    issuesFound.push({
      category: "Evidence Distribution",
      severity: "High",
      issue: `SOLO Room only got ${soloInitData.myEvidenceIds.length} clues instead of all 5 Ep1 clues.`,
    });
  }

  // Test B: Room created via /room/create (e.g. ROOM-842) where player is alone
  const regularRoomCode = `ROOM-${Math.floor(100 + Math.random() * 900)}`;
  const regularPlayerId = `p_${Date.now()}`;
  
  const regularInitRes = await fetch(
    `${baseUrl}/api/room/${regularRoomCode}/investigation?playerId=${regularPlayerId}&detectiveId=ananya&detectiveName=Inspector+Ananya+Roy`
  );
  const regularInitData = await regularInitRes.json();
  console.log(`  Regular Room (${regularRoomCode}) Evidence count for solo player:`, regularInitData.myEvidenceIds.length);
  console.log(`  Evidence IDs in regular room:`, regularInitData.myEvidenceIds);
  if (regularInitData.myEvidenceIds.length < 5) {
    issuesFound.push({
      category: "Evidence Isolation / Solo Lockout",
      severity: "Critical",
      issue: `A lone player in a regular room code (${regularRoomCode}) only gets ${regularInitData.myEvidenceIds.length}/5 clues. They are locked out of Player 2's documents (like c1_abir_profile) needed for Checkpoint 1!`,
    });
  }

  // 2. Audit Episode 1 Checkpoint
  console.log("\n2. Testing Episode 1 Checkpoint Validation...");
  const ep1CheckRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_checkpoint",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        episodeNumber: 1,
        selectedClueIds: ["c1_seat_14_photo", "c1_umbrella_intact", "c1_abir_profile"],
        notes: "The dry umbrella placed under seat 14 proves the scene was staged; Abir's hydrophobia contradicts an accidental lean.",
      },
    }),
  });
  const ep1CheckData = await ep1CheckRes.json();
  console.log("  Episode 1 Checkpoint result:", ep1CheckData.validation?.passed ? "PASSED" : "FAILED");
  if (!ep1CheckData.validation?.passed) {
    issuesFound.push({
      category: "Checkpoint Validation",
      severity: "High",
      issue: `Episode 1 Checkpoint failed: ${ep1CheckData.validation?.feedback}`,
    });
  }

  // 3. Switch to Episode 2 & Clue Distribution
  console.log("\n3. Testing Episode 2 Progression & Clues...");
  const ep2SyncRes = await fetch(
    `${baseUrl}/api/room/${soloRoomCode}/investigation?playerId=${soloPlayerId}&detectiveId=ananya&detectiveName=Inspector+Ananya+Roy`
  );
  const ep2SyncData = await ep2SyncRes.json();
  console.log("  Current episode on server:", ep2SyncData.currentEpisodeId);
  console.log("  Player Evidence after Ep1 pass:", ep2SyncData.myEvidenceIds);

  // 4. Test Episode 2 Checkpoint
  console.log("\n4. Testing Episode 2 Checkpoint...");
  const ep2CheckRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_checkpoint",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        episodeNumber: 2,
        selectedClueIds: ["c2_broken_hatch_seal", "c2_wet_rope_fibres", "c2_boot_print"],
        notes: "Hatch 4B lead seal was severed from the inside and foreign nylon motorboat rope fibres were caught on the latch.",
      },
    }),
  });
  const ep2CheckData = await ep2CheckRes.json();
  console.log("  Episode 2 Checkpoint result:", ep2CheckData.validation?.passed ? "PASSED" : "FAILED");

  // 5. Test Timeline Reordering API
  console.log("\n5. Testing Timeline Ordering API...");
  const timelineRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "order_timeline",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        orderedEventIds: ["t_1005", "t_1012", "t_1015", "t_1022", "t_1026", "t_1031", "t_1037", "t_1045"],
      },
    }),
  });
  const timelineData = await timelineRes.json();
  console.log("  Timeline stored count:", timelineData.timelineOrder?.length);

  // 6. Test Evidence Connection API
  console.log("\n6. Testing Evidence Connection Graph API...");
  const connRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "connect_evidence",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        sourcePinId: "pin_1",
        targetPinId: "pin_2",
        sourceEvidenceId: "c4_torn_ledger_pages",
        targetEvidenceId: "c4_work_order",
        deductionNotes: "Motive connection",
      },
    }),
  });
  const connData = await connRes.json();
  console.log("  Connection count:", connData.caseboardConnections?.length);

  // 7. Test Episode 3 Checkpoint
  console.log("\n7. Testing Episode 3 Checkpoint...");
  const ep3CheckRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_checkpoint",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        episodeNumber: 3,
        selectedClueIds: ["c3_cctv_log", "c3_ferry_log", "c3_rina_voicenote"],
        notes: "Camera 3 was manually disconnected from the engine room between 10:26 and 10:37 creating an 11-minute blackout.",
      },
    }),
  });
  const ep3CheckData = await ep3CheckRes.json();
  console.log("  Episode 3 Checkpoint result:", ep3CheckData.validation?.passed ? "PASSED" : "FAILED");

  // 8. Test Episode 4 Checkpoint
  console.log("\n8. Testing Episode 4 Checkpoint...");
  const ep4CheckRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_checkpoint",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        episodeNumber: 4,
        selectedClueIds: ["c4_torn_ledger_pages", "c4_service_key_register", "c4_work_order"],
        notes: "Debashish Pal paid Harun to unlock Hatch 4B; Pal's motor launch used the work order to intercept the ferry in the blackout.",
      },
    }),
  });
  const ep4CheckData = await ep4CheckRes.json();
  console.log("  Episode 4 Checkpoint result:", ep4CheckData.validation?.passed ? "PASSED" : "FAILED");

  // 9. Test Final Accusation Submission
  console.log("\n9. Testing Episode 5 Final Accusation...");
  const accusationRes = await fetch(`${baseUrl}/api/room/${soloRoomCode}/investigation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "submit_accusation",
      playerId: soloPlayerId,
      detectiveName: "Inspector Ananya Roy",
      payload: {
        submission: {
          plannerId: "debashish-pal",
          accompliceId: "harun-sheikh",
          methodDescription: "Debashish Pal contracted ferry mechanic Harun Sheikh to disable the CCTV camera and unseal lower Hatch 4B to abduct Abir Basu and seize the incriminating audit ledger.",
          decisiveClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
        },
      },
    }),
  });
  const accusationData = await accusationRes.json();
  console.log("  Accusation result:", accusationData.finalAccusation?.result?.passed ? "PASSED" : "FAILED");
  console.log("  Accusation IQS Score:", accusationData.finalAccusation?.result?.finalIQS, "Rank:", accusationData.finalAccusation?.result?.rank);

  console.log("\n==================================================");
  console.log("SUMMARY OF BACKEND ISSUES DETECTED:");
  console.log(JSON.stringify(issuesFound, null, 2));
  console.log("==================================================");
}

runSoloAudit().catch(console.error);
