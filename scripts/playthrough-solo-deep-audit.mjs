import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = path.join(os.tmpdir(), `chrome-detective-deep-audit-${Date.now()}`);

async function runDeepAudit() {
  console.log('========================================================================');
  console.log('🕵️‍♂️ STARTING IN-DEPTH SOLO PLAYER WALKTHROUGH & INTERACTION AUDIT');
  console.log('========================================================================\n');

  const abnormalities = [];
  const consoleErrors = [];
  const consoleWarnings = [];
  const featureChecks = {};

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9240',
    `--user-data-dir=${TEMP_PROFILE}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://localhost:3000/cases/the-last-ferry'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  const targetsRes = await fetch('http://localhost:9240/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');

  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    chrome.kill();
    throw new Error('Could not find Chrome page target');
  }

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let msgId = 1;
  const pending = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
      return;
    }

    if (data.method === 'Runtime.consoleAPICalled') {
      const type = data.params.type;
      const text = data.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (type === 'error') {
        consoleErrors.push(text);
      } else if (type === 'warning') {
        consoleWarnings.push(text);
      }
    }

    if (data.method === 'Runtime.exceptionThrown') {
      const desc = data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text;
      consoleErrors.push(`[UNCAUGHT] ${desc}`);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);
  await sendCommand('Runtime.enable');
  await sendCommand('Page.enable');
  await sendCommand('DOM.enable');

  async function evaluate(fnString) {
    const res = await sendCommand('Runtime.evaluate', {
      expression: fnString,
      returnByValue: true
    });
    if (res?.exceptionDetails) {
      console.error('  [EVAL EXCEPTION]:', res.exceptionDetails.text, res.exceptionDetails.exception?.description);
    }
    return res?.result?.value;
  }

  async function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // --- STAGE 1: Case Detail & Solo Room Launch ---
  console.log('[STAGE 1] Case Overview & Solo Room Creation...');
  await wait(2000);
  const casePageCheck = await evaluate(`(() => {
    const h1 = document.querySelector('h1')?.textContent || '';
    const hasSoloBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('start solo'));
    return { title: h1, hasSoloBtn };
  })()`);
  console.log('  Case Page:', casePageCheck);
  featureChecks['Case Details Page'] = casePageCheck.hasSoloBtn ? 'PASS' : 'FAIL';

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('start solo'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  const roomUrl = await evaluate('window.location.href');
  console.log('  Joined Room URL:', roomUrl);
  if (!roomUrl.includes('/room/SOLO-')) {
    abnormalities.push(`Solo room creation failed to produce SOLO- room: ${roomUrl}`);
  }

  // --- STAGE 2: Interactive Orientation & Onboarding Tasks ---
  console.log('\n[STAGE 2] Orientation Tutorial & Field Guide Interaction...');
  const tutorialOpen = await evaluate(`(() => {
    const aside = document.querySelector('aside[aria-label="Investigator\\'s Field Guide Onboarding"]');
    return !!aside;
  })()`);
  console.log('  Tutorial Overlay Visible:', tutorialOpen);
  featureChecks['Onboarding Tutorial Prompt'] = tutorialOpen ? 'PASS' : 'FAIL';

  // Task 1: Inspect an evidence card
  console.log('  Task 1: Inspecting Crime Scene Photo (Seat 14)...');
  await evaluate(`(() => {
    // Navigate to Evidence Tab
    const evTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('evidence'));
    if (evTab) evTab.click();
  })()`);
  await wait(1500);

  const openedClue = await evaluate(`(() => {
    const clueCard = document.querySelector('[data-clue-id="c1_seat_14_photo"]') || Array.from(document.querySelectorAll('[role="button"], h3, h4')).find(h => h.textContent.includes('Seat 14'));
    if (clueCard) {
      clueCard.click();
      return true;
    }
    return false;
  })()`);
  await wait(2000);

  const evidenceModalState = await evaluate(`(() => {
    const modalText = document.body.innerText;
    const hasDetails = modalText.includes('Seat 14') || modalText.includes('EXHIBIT DOSSIER') || modalText.includes('Crime Scene Photo');
    const pinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pin to Board'));
    return { hasDetails, hasPinBtn: !!pinBtn };
  })()`);
  console.log('  Evidence Viewer Modal Opened:', evidenceModalState);
  featureChecks['Evidence Viewer Modal'] = evidenceModalState.hasDetails ? 'PASS' : 'FAIL';

  // Task 2: Pin evidence to caseboard from modal
  console.log('  Task 2: Pinning exhibit to Shared Caseboard...');
  await evaluate(`(() => {
    const pinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Pin to Board'));
    if (pinBtn) pinBtn.click();
    // Close modal if still open
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '✕');
    if (closeBtn) closeBtn.click();
  })()`);
  await wait(2000);

  // Task 3: Review Caseboard Tab
  console.log('  Task 3: Checking Shared Caseboard tab & pins...');
  const caseboardState = await evaluate(`(() => {
    const text = document.body.innerText;
    const hasPins = text.includes('Pinned Exhibits') || text.includes('Seat 14') || text.includes('CASEBOARD');
    return { hasPins, activeTab: text.includes('CASEBOARD') };
  })()`);
  console.log('  Caseboard State:', caseboardState);
  featureChecks['Caseboard Pinning'] = caseboardState.hasPins ? 'PASS' : 'FAIL';

  // --- STAGE 3: Audio Toggle & Telegraph Chat ---
  console.log('\n[STAGE 3] Squad Telegraph & Audio Toggles...');
  // Test Telegraph Chat
  await evaluate(`(() => {
    const chatTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Telegraph'));
    if (chatTab) chatTab.click();
  })()`);
  await wait(1000);

  const sentMessage = await evaluate(`(() => {
    const input = document.querySelector('input[placeholder*="memo"], input[type="text"]');
    if (input) {
      input.value = 'Lalbazar Unit: Verified dry umbrella under Seat 14 contradicts accident theory.';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      const form = input.closest('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        return true;
      }
    }
    return false;
  })()`);
  await wait(1500);
  console.log('  Telegraph Message Sent:', sentMessage);
  featureChecks['Squad Telegraph Message'] = sentMessage ? 'PASS' : 'FAIL';

  // Test Audio Toggle
  console.log('  Testing Noir Soundscape Audio Toggle...');
  const audioToggle = await evaluate(`(() => {
    const btn = document.querySelector('button[title*="Soundscape"]');
    if (btn) {
      btn.click(); // mute
      const mutedTitle = btn.getAttribute('title');
      btn.click(); // unmute
      return { found: true, title: mutedTitle };
    }
    return { found: false };
  })()`);
  console.log('  Audio Toggle Result:', audioToggle);
  featureChecks['Audio Toggle Button'] = audioToggle.found ? 'PASS' : 'FAIL';

  // --- STAGE 4: Informant Hint Tier Unlock ---
  console.log('\n[STAGE 4] Informant Clue Request (Tier 1 Hint)...');
  await evaluate(`(() => {
    const hintBtn = document.querySelector('button[data-tutorial-id="tutorial-hint-btn"]');
    if (hintBtn) hintBtn.click();
  })()`);
  await wait(1500);

  const hintModalState = await evaluate(`(() => {
    const text = document.body.innerText;
    const hasHints = text.includes('Informant') || text.includes('Tier 1');
    const unlockBtn = document.querySelector('button[data-hint-tier="1"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reveal Hint'));
    if (unlockBtn) unlockBtn.click();
    return { hasHints, unlocked: !!unlockBtn };
  })()`);
  await wait(1500);

  // Close hint modal
  await evaluate(`(() => {
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '✕' || b.textContent.includes('Close'));
    if (closeBtn) closeBtn.click();
  })()`);
  await wait(1000);
  console.log('  Hint Modal Tier 1 Unlocked:', hintModalState);
  featureChecks['Informant Hint Tier 1'] = hintModalState.unlocked ? 'PASS' : 'FAIL';

  // --- STAGE 5: Episode 1 Checkpoint ---
  console.log('\n[STAGE 5] Solving Episode 1 Checkpoint...');
  await evaluate(`(() => {
    const btn = document.querySelector('button[data-tutorial-id="tutorial-checkpoint-btn"]');
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('Seat 14') || text.includes('Umbrella')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'The dry umbrella beneath Seat 14 directly contradicts violent storm surge drowning; Abir had hydrophobia and the scene was staged.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const sub = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (sub) sub.click();
  })()`);
  await wait(3000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advance to Next Episode'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Next Episode Dossier'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  // --- STAGE 6: Episode 2 (Witness Interrogation & Checkpoint) ---
  console.log('\n[STAGE 6] Episode 2: Interrogating Harun Sheikh & Waterline Hatch...');
  // Check Witness Tab in Episode 2
  await evaluate(`(() => {
    const witTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Witnesses'));
    if (witTab) witTab.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const harunBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Harun'));
    if (harunBtn) harunBtn.click();
  })()`);
  await wait(1500);

  const witnessInterview = await evaluate(`(() => {
    const text = document.body.innerText;
    return {
      dialogueLoaded: text.toLowerCase().includes('harun sheikh') && text.toLowerCase().includes('mechanic')
    };
  })()`);
  console.log('  Harun Sheikh Interrogation:', witnessInterview);
  featureChecks['Witness Dialogue Interrogation'] = witnessInterview.dialogueLoaded ? 'PASS' : 'FAIL';

  // Solve Checkpoint 2
  await evaluate(`(() => {
    const chk = document.querySelector('button[data-tutorial-id="tutorial-checkpoint-btn"]');
    if (chk) chk.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('Hatch Seal') || text.includes('Strands') || text.includes('Nylon')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'Waterline Hatch 4B seal was forcibly snapped from outside and tied with nylon motorboat rope for transfer.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const sub = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (sub) sub.click();
  })()`);
  await wait(3000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advance to Next Episode'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Next Episode Dossier'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  // --- STAGE 7: Episode 3 (Timeline & CCTV Blackout) ---
  console.log('\n[STAGE 7] Episode 3: Timeline Analysis & Solving Checkpoint 3...');
  // Inspect Timeline Tab
  await evaluate(`(() => {
    const timeTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Timeline'));
    if (timeTab) timeTab.click();
  })()`);
  await wait(1500);

  const timelineState = await evaluate(`(() => {
    const text = document.body.innerText;
    return {
      hasTimeline: text.includes('10:05 PM') || text.includes('10:15 PM') || text.includes('CCTV Camera 3'),
      hasMatrix: text.includes('Suspect Matrix') || text.includes('Debashish Pal')
    };
  })()`);
  console.log('  Timeline & Suspect Matrix View:', timelineState);
  featureChecks['Timeline & Suspect Matrix'] = timelineState.hasTimeline ? 'PASS' : 'FAIL';

  // Solve Checkpoint 3
  await evaluate(`(() => {
    const chk = document.querySelector('button[data-tutorial-id="tutorial-checkpoint-btn"]');
    if (chk) chk.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('CCTV') || text.includes('Distress') || text.includes('Logbook')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'The 11-minute CCTV blackout (10:26-10:37 PM) at Ghat No. 6 masked the motorboat intercept and transfer.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const sub = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (sub) sub.click();
  })()`);
  await wait(3000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advance to Next Episode'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Next Episode Dossier'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  // --- STAGE 8: Episode 4 (Missing Ledger & Checkpoint 4) ---
  console.log('\n[STAGE 8] Episode 4: Tender Fraud Link & Solving Checkpoint 4...');
  await evaluate(`(() => {
    const chk = document.querySelector('button[data-tutorial-id="tutorial-checkpoint-btn"]');
    if (chk) chk.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('Carbon Page') || text.includes('Key Register') || text.includes('Work Order')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'Debashish Pal used embezzled dredging tender funds to bribe Harun Sheikh to check out Key 4B.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const sub = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (sub) sub.click();
  })()`);
  await wait(3000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Advance to Next Episode'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Next Episode Dossier'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  // --- STAGE 9: Episode 5 (Climax Accusation via Accessible Buttons) ---
  console.log('\n[STAGE 9] Episode 5: Accessible Accusation Indictment...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('accusation'));
    if (btn) btn.click();
  })()`);
  await wait(2500);

  const accState = await evaluate(`(() => {
    const form = document.querySelector('form');
    if (!form) return { error: 'No form' };

    const plannerSelect = document.getElementById('accusation-planner-select');
    const accompliceSelect = document.getElementById('accusation-accomplice-select');
    const methodText = document.getElementById('accusation-method-text');

    if (plannerSelect) {
      plannerSelect.value = 'debashish-pal';
      plannerSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (accompliceSelect) {
      accompliceSelect.value = 'harun-sheikh';
      accompliceSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (methodText) {
      methodText.value = 'Debashish Pal orchestrated the abduction of Abir Basu via lower maintenance hatch 4B during the 11-minute CCTV blackout to suppress the dredging tender fraud evidence.';
      methodText.dispatchEvent(new Event('input', { bubbles: true }));
      methodText.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Click decisive buttons using newly added data-clue-id and button semantics
    const clueButtons = Array.from(form.querySelectorAll('button[data-clue-id]'));
    const targetKeywords = ['Hatch Seal', 'CCTV', 'Carbon Page'];
    const clickedTitles = [];

    clueButtons.forEach(btn => {
      const text = btn.textContent || '';
      if (targetKeywords.some(kw => text.includes(kw))) {
        btn.click();
        clickedTitles.push(text.trim());
      }
    });

    const submitBtn = form.querySelector('button[type="submit"]');

    return {
      hasPlannerId: !!plannerSelect?.value,
      hasAccompliceId: !!accompliceSelect?.value,
      buttonsFound: clueButtons.length,
      clickedTitles,
      submitFound: !!submitBtn,
      submitDisabled: submitBtn?.disabled
    };
  })()`);
  console.log('  Accusation Modal State:', accState);
  featureChecks['Accessible Clue Buttons in Accusation'] = (accState.buttonsFound >= 3 && accState.clickedTitles.length === 3) ? 'PASS' : 'FAIL';

  await wait(1500);

  // Submit Warrants
  console.log('  Executing Warrant Raid & Issuing Arrests...');
  await evaluate(`(() => {
    const form = document.querySelector('form');
    const sub = form?.querySelector('button[type="submit"]');
    if (sub && !sub.disabled) sub.click();
  })()`);
  await wait(4000);

  // --- STAGE 10: 4-Act Cinematic Stepper Progression ---
  console.log('\n[STAGE 10] Cinematic 4-Act Stepper Experience...');
  const act1Check = await evaluate(`(() => {
    const text = document.body.innerText;
    return text.includes('THE TRUTH UNMASKED') && text.includes('ACT I');
  })()`);
  console.log('  Act I Rendered:', act1Check);

  // Click Next Scene through Acts
  await evaluate(`(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next Scene'));
    if (nextBtn) nextBtn.click();
  })()`);
  await wait(1500);

  const act2Check = await evaluate(`(() => {
    const text = document.body.innerText;
    return text.includes('ACT II');
  })()`);
  console.log('  Act II Rendered:', act2Check);

  // Finish remaining scenes
  await evaluate(`(() => {
    const nextBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next Scene') || b.textContent.includes('View Results'));
    if (nextBtn) nextBtn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const viewResultsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Next Scene') || b.textContent.includes('View Results'));
    if (viewResultsBtn) viewResultsBtn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const viewResultsBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Results') || b.textContent.includes('Skip Cinematic'));
    if (viewResultsBtn) viewResultsBtn.click();
  })()`);
  await wait(3000);

  featureChecks['Cinematic Stepper Navigation'] = (act1Check && act2Check) ? 'PASS' : 'FAIL';

  // --- STAGE 11: Results Screen Debriefing & Final Score ---
  console.log('\n[STAGE 11] Case Debriefing (Results Screen)...');
  const finalDebriefing = await evaluate(`(() => {
    const text = document.body.innerText || '';
    const hasVerdict = text.includes('OFFICIAL VERDICT: CASE CLOSED');
    const hasCommendation = text.toLowerCase().includes('magistrate') || text.toLowerCase().includes('debashish pal');
    const hasScoringMatrix = text.toLowerCase().includes('scoring matrix') || text.toLowerCase().includes('investigation quality score');
    const hasScore100 = text.includes('/ 100');
    const returnBtn = !!Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Return to Lalbazar Desk'));
    return {
      hasVerdict,
      hasCommendation,
      hasScoringMatrix,
      hasScore100,
      hasReturnBtn: returnBtn
    };
  })()`);
  console.log('  Final Debriefing State:', finalDebriefing);
  featureChecks['Official Verdict & Case Closure'] = finalDebriefing.hasVerdict ? 'PASS' : 'FAIL';
  featureChecks['Scoring Matrix Breakdown'] = finalDebriefing.hasScoringMatrix ? 'PASS' : 'FAIL';

  // Return to Desk
  console.log('  Returning to Lalbazar Desk (/cases)...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Return to Lalbazar Desk'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  const finalUrl = await evaluate('window.location.href');
  console.log('  Final Destination URL:', finalUrl);
  featureChecks['Return to Lalbazar Desk (/cases)'] = finalUrl.endsWith('/cases') ? 'PASS' : 'FAIL';

  console.log('\n========================================================================');
  console.log('🏁 IN-DEPTH SOLO PLAYER AUDIT COMPLETE');
  console.log('========================================================================');
  console.log('📊 Feature Verification Matrix:');
  Object.entries(featureChecks).forEach(([feature, status]) => {
    console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${feature.padEnd(42)}: ${status}`);
  });

  console.log(`\n  Total Console Errors   : ${consoleErrors.length}`);
  console.log(`  Total Console Warnings : ${consoleWarnings.length}`);
  console.log(`  Identified Abnormalities: ${abnormalities.length}`);

  if (consoleErrors.length > 0) {
    console.log('\n🚨 Console Errors:');
    consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
  }

  if (consoleWarnings.length > 0) {
    console.log('\n⚠️ Console Warnings:');
    consoleWarnings.forEach((w, i) => console.log(`  [${i+1}] ${w}`));
  }

  if (abnormalities.length > 0) {
    console.log('\n❌ Abnormalities Logged:');
    abnormalities.forEach((a, i) => console.log(`  [${i+1}] ${a}`));
  }

  ws.close();
  chrome.kill();
}

runDeepAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
