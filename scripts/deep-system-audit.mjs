import fs from 'fs';
import path from 'path';

async function runDeepAudit() {
  console.log("==================================================");
  console.log("🔍 DEEP SYSTEM AUDIT: LOGIC, UI ASSETS & STATE");
  console.log("==================================================");

  const findings = [];
  const projectRoot = process.cwd();

  // --- CHECK 1: Asset Existence ---
  console.log("\n[1] Checking all referenced images in public/ folder...");
  const publicDir = path.join(projectRoot, 'public');

  const caseFilePath = path.join(projectRoot, 'src', 'lib', 'data', 'cases', 'the-last-ferry.ts');
  const caseFileContent = fs.readFileSync(caseFilePath, 'utf8');

  // Extract all strings ending in .jpg, .png, .webp, .svg, .mp3
  const assetRegex = /['"](\/(?:cases|audio)[^'"]+\.(?:jpg|png|webp|svg|mp3))['"]/g;
  let match;
  const referencedAssets = new Set();
  while ((match = assetRegex.exec(caseFileContent)) !== null) {
    referencedAssets.add(match[1]);
  }

  // Also check cases/page.tsx
  const casesPagePath = path.join(projectRoot, 'src', 'app', 'cases', 'page.tsx');
  const casesPageContent = fs.readFileSync(casesPagePath, 'utf8');
  while ((match = assetRegex.exec(casesPageContent)) !== null) {
    referencedAssets.add(match[1]);
  }

  // Also check investigation components
  const invCompDir = path.join(projectRoot, 'src', 'components', 'investigation');
  const invFiles = fs.readdirSync(invCompDir);
  for (const f of invFiles) {
    if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(path.join(invCompDir, f), 'utf8');
      while ((match = assetRegex.exec(content)) !== null) {
        referencedAssets.add(match[1]);
      }
    }
  }

  let missingAssets = 0;
  for (const assetPath of referencedAssets) {
    const diskPath = path.join(publicDir, assetPath.replace(/^\//, '').replace(/\//g, path.sep));
    if (!fs.existsSync(diskPath)) {
      findings.push({
        type: "MISSING_ASSET",
        severity: "HIGH",
        detail: `Referenced asset not found on disk: ${assetPath}`,
      });
      console.log(`  ❌ MISSING: ${assetPath}`);
      missingAssets++;
    }
  }
  if (missingAssets === 0) {
    console.log(`  ✅ All ${referencedAssets.size} referenced assets exist on disk!`);
  }

  // --- CHECK 2: Case Data & Checkpoint Logic Consistency ---
  console.log("\n[2] Checking Canonical Case Data & Checkpoint Cross-References...");
  const { THE_LAST_FERRY_CASE } = await import('../src/lib/data/cases/the-last-ferry.ts');
  const { validateCheckpoint, validateEvidenceConnection, checkTimelineAccuracy, evaluateFinalAccusation } = await import('../src/lib/game/checkpointValidator.ts');

  // Collect all clue IDs across all episodes
  const allCluesMap = new Map();
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    ep.clues.forEach((c) => {
      allCluesMap.set(c.id, { ...c, episodeNumber: ep.episodeNumber });
    });
  });
  console.log(`  Total canonical clues across 5 episodes: ${allCluesMap.size}`);

  // Check each episode checkpoint's expectedClueIds
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    const cp = ep.checkpoint;
    cp.expectedClueIds.forEach((clueId) => {
      if (!allCluesMap.has(clueId)) {
        findings.push({
          type: "INVALID_CHECKPOINT_CLUE",
          severity: "CRITICAL",
          detail: `Episode ${ep.episodeNumber} checkpoint '${cp.id}' expects non-existent clue ID '${clueId}'`,
        });
        console.log(`  ❌ Episode ${ep.episodeNumber} expects non-existent clue '${clueId}'`);
      } else {
        const clueEp = allCluesMap.get(clueId).episodeNumber;
        if (clueEp > ep.episodeNumber) {
          findings.push({
            type: "FUTURE_CLUE_DEPENDENCY",
            severity: "CRITICAL",
            detail: `Episode ${ep.episodeNumber} checkpoint requires clue '${clueId}' which is only introduced in Episode ${clueEp}!`,
          });
          console.log(`  ❌ Episode ${ep.episodeNumber} requires future clue '${clueId}' from Episode ${clueEp}!`);
        }
      }
    });

    // Test Checkpoint Validation for this episode
    const validationResult = validateCheckpoint(ep.episodeNumber, cp.expectedClueIds, "Validating canonical deduction");
    if (!validationResult.passed) {
      findings.push({
        type: "CHECKPOINT_VALIDATION_FAILURE",
        severity: "CRITICAL",
        detail: `Episode ${ep.episodeNumber} checkpoint fails even with expected clue IDs: ${validationResult.feedback}`,
      });
      console.log(`  ❌ Episode ${ep.episodeNumber} validation failed with expected clues: ${validationResult.feedback}`);
    } else {
      console.log(`  ✅ Episode ${ep.episodeNumber} Checkpoint passed with canonical clues.`);
    }
  });

  // Check Solution decisive clues
  THE_LAST_FERRY_CASE.solution.decisiveClues.forEach((clueId) => {
    if (!allCluesMap.has(clueId)) {
      findings.push({
        type: "INVALID_SOLUTION_CLUE",
        severity: "CRITICAL",
        detail: `Final solution decisive clue '${clueId}' does not exist in clues dictionary!`,
      });
      console.log(`  ❌ Solution decisive clue '${clueId}' does not exist!`);
    }
  });

  // Check connection pairs
  console.log("\n[3] Checking Forensic Connection Pairs...");
  let connectionErrors = 0;
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    if (ep.connectionPairs) {
      ep.connectionPairs.forEach((pair) => {
        if (!allCluesMap.has(pair.sourceId)) {
          findings.push({
            type: "INVALID_CONNECTION_SOURCE",
            severity: "HIGH",
            detail: `Connection pair in Ep ${ep.episodeNumber} references non-existent sourceId '${pair.sourceId}'`,
          });
          connectionErrors++;
        }
        if (!allCluesMap.has(pair.targetId)) {
          findings.push({
            type: "INVALID_CONNECTION_TARGET",
            severity: "HIGH",
            detail: `Connection pair in Ep ${ep.episodeNumber} references non-existent targetId '${pair.targetId}'`,
          });
          connectionErrors++;
        }

        const testForward = validateEvidenceConnection(pair.sourceId, pair.targetId);
        const testReverse = validateEvidenceConnection(pair.targetId, pair.sourceId);
        if (!testForward.isValid || !testReverse.isValid) {
          findings.push({
            type: "CONNECTION_VALIDATION_FAILURE",
            severity: "HIGH",
            detail: `Pair '${pair.sourceId}' <-> '${pair.targetId}' failed validation!`,
          });
          connectionErrors++;
        }
      });
    }
  });
  if (connectionErrors === 0) {
    console.log("  ✅ All connection pairs validate bilaterally and reference valid clues.");
  }

  // Check Timeline Events & Accuracy
  console.log("\n[4] Checking Timeline Events & Accuracy Validation...");
  const allTimelineEvents = [];
  THE_LAST_FERRY_CASE.episodes.forEach((ep) => {
    if (ep.timelineEvents) allTimelineEvents.push(...ep.timelineEvents);
  });
  console.log(`  Total timeline events: ${allTimelineEvents.length}`);
  const sortedCanonicalIds = [...allTimelineEvents].sort((a, b) => a.canonOrder - b.canonOrder).map(e => e.id);
  const timelineAccuracyCheck = checkTimelineAccuracy(sortedCanonicalIds);
  if (!timelineAccuracyCheck.isCorrectOrder) {
    findings.push({
      type: "TIMELINE_ORDER_ERROR",
      severity: "CRITICAL",
      detail: `Canonical timeline order was marked incorrect by checkTimelineAccuracy! Contradictions: ${timelineAccuracyCheck.contradictionsFound.join("; ")}`,
    });
    console.log("  ❌ Canonical timeline order rejected!", timelineAccuracyCheck.contradictionsFound);
  } else {
    console.log(`  ✅ Canonical timeline accurately recognized (${timelineAccuracyCheck.correctCount} events aligned).`);
  }

  // Check Final Accusation Logic permutations
  console.log("\n[5] Checking Final Accusation Permutations & Scoring...");
  const mockCleanState = {
    totalHintsUsed: 0,
    hintsUsedByTier: [],
    failedAttempts: 0,
    sharedCount: 0,
    isSoloRoom: true,
  };

  const perfectAccusation = evaluateFinalAccusation(
    {
      plannerId: "debashish-pal",
      accompliceId: "harun-sheikh",
      methodDescription: "Debashish Pal conspired with mechanic Harun Sheikh to disable the CCTV and unseal Hatch 4B.",
      decisiveClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
    },
    mockCleanState
  );

  console.log(`  Clean solo accusation score: ${perfectAccusation.finalIQS} (Rank: ${perfectAccusation.rank}), Passed: ${perfectAccusation.passed}`);
  if (!perfectAccusation.passed || perfectAccusation.finalIQS < 95) {
    findings.push({
      type: "ACCUSATION_SCORE_MISMATCH",
      severity: "HIGH",
      detail: `Clean solo accusation got score ${perfectAccusation.finalIQS} instead of >= 95!`,
    });
  }

  // Test hints penalty in accusation
  const hintState = {
    totalHintsUsed: 3,
    hintsUsedByTier: [1, 2, 3], // -2 + -5 + -10 = -17
    failedAttempts: 1, // -3
    sharedCount: 0,
    isSoloRoom: true, // +15
  };
  // Base: 100 - 17 - 3 + 15 = 95
  const hintedAccusation = evaluateFinalAccusation(
    {
      plannerId: "debashish-pal",
      accompliceId: "harun-sheikh",
      methodDescription: "Debashish Pal conspired with mechanic Harun Sheikh to disable the CCTV and unseal Hatch 4B.",
      decisiveClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
    },
    hintState
  );
  console.log(`  Hinted accusation score (T1+T2+T3 hints + 1 retry): ${hintedAccusation.finalIQS} (Rank: ${hintedAccusation.rank}), Passed: ${hintedAccusation.passed}`);
  if (hintedAccusation.finalIQS !== 95) {
    findings.push({
      type: "HINT_PENALTY_MISCALCULATION",
      severity: "MEDIUM",
      detail: `Expected 95 with T1(-2)+T2(-5)+T3(-10) + 1 retry(-3) + solo(+15), got ${hintedAccusation.finalIQS}`,
    });
  }

  // Test wrong planner
  const wrongPlannerAccusation = evaluateFinalAccusation(
    {
      plannerId: "captain-prakash-nair",
      accompliceId: "harun-sheikh",
      methodDescription: "Captain did it.",
      decisiveClueIds: ["c2_broken_hatch_seal", "c3_cctv_log", "c4_torn_ledger_pages"],
    },
    mockCleanState
  );
  if (wrongPlannerAccusation.passed) {
    findings.push({
      type: "FALSE_POSITIVE_ACCUSATION",
      severity: "CRITICAL",
      detail: "Accusation passed despite wrong planner!",
    });
  } else {
    console.log("  ✅ Accusation correctly rejected wrong planner.");
  }

  // --- CHECK 6: Suspect and Cast IDs across components ---
  console.log("\n[6] Checking Suspect & Cast IDs consistency across UI components...");
  const castIds = new Set(THE_LAST_FERRY_CASE.cast.map(c => c.id));
  console.log("  Canonical cast IDs:", Array.from(castIds));

  // Check SuspectMatrix.tsx
  const suspectMatrixPath = path.join(projectRoot, 'src', 'components', 'investigation', 'SuspectMatrix.tsx');
  const suspectMatrixContent = fs.readFileSync(suspectMatrixPath, 'utf8');
  for (const cid of castIds) {
    if (!suspectMatrixContent.includes(`"${cid}"`)) {
      findings.push({
        type: "SUSPECT_MATRIX_MISSING_ID",
        severity: "MEDIUM",
        detail: `SuspectMatrix does not explicitly map tag for cast member '${cid}'`,
      });
      console.log(`  ⚠️ SuspectMatrix missing explicit tag for '${cid}'`);
    }
  }

  // Check WitnessInterviewScreen.tsx
  const witnessScreenPath = path.join(projectRoot, 'src', 'components', 'investigation', 'WitnessInterviewScreen.tsx');
  const witnessScreenContent = fs.readFileSync(witnessScreenPath, 'utf8');
  if (witnessScreenContent.includes('activeWitness.id === "rina_basu"') && !witnessScreenContent.includes('"rina-basu"')) {
    findings.push({
      type: "WITNESS_ID_UNDERSCORE",
      severity: "HIGH",
      detail: "WitnessInterviewScreen checks rina_basu with underscore instead of canonical hyphen!",
    });
  }

  // --- SUMMARY ---
  console.log("\n==================================================");
  console.log(`AUDIT FINISHED. Total Findings: ${findings.length}`);
  console.log(JSON.stringify(findings, null, 2));
  console.log("==================================================");
}

runDeepAudit().catch(console.error);
