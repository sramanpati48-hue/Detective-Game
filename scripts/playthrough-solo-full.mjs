import { spawn } from 'child_process';
import os from 'os';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = path.join(os.tmpdir(), `chrome-detective-solo-full-${Date.now()}`);

async function runFullPlaythrough() {
  console.log('===============================================================');
  console.log('🕵️  STARTING COMPLETE END-TO-END SOLO PLAYTHROUGH AUDIT (EP1-EP5)');
  console.log('===============================================================\n');

  const abnormalities = [];
  const consoleErrors = [];
  const consoleWarnings = [];

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9231',
    `--user-data-dir=${TEMP_PROFILE}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1440,900',
    'http://localhost:3000/cases/the-last-ferry'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  const targetsRes = await fetch('http://localhost:9231/json/list');
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

  // --- STEP 1: Launch Solo Game ---
  console.log('[STEP 1] Launching Solo Game from /cases/the-last-ferry...');
  await wait(2000);
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('start solo'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  const initUrl = await evaluate('window.location.href');
  console.log('  Room URL:', initUrl);
  if (!initUrl.includes('/room/')) {
    abnormalities.push(`Solo button failed to navigate to room route: ${initUrl}`);
  }

  // --- STEP 2: Episode 1 Checkpoint ---
  console.log('\n[STEP 2] Episode 1: Solving Checkpoint 1 ("The Empty Seat")...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('checkpoint'));
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
  })()`);
  await wait(1000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (btn) btn.click();
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

  const ep2Url = await evaluate('window.location.href');
  console.log('  Episode 2 Loaded. URL:', ep2Url);
  if (!ep2Url.includes('ep2')) {
    abnormalities.push(`Transition to Episode 2 failed. URL remains: ${ep2Url}`);
  }

  // --- STEP 3: Episode 2 Checkpoint ---
  console.log('\n[STEP 3] Episode 2: Solving Checkpoint 2 ("Rain on the Deck")...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('checkpoint'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('Hatch Seal') || text.includes('Rope') || text.includes('Nylon')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'Waterline Hatch 4B seal was forcibly snapped from outside and tied with nylon motorboat rope for transfer.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
  })()`);
  await wait(1000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (btn) btn.click();
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

  const ep3Url = await evaluate('window.location.href');
  console.log('  Episode 3 Loaded. URL:', ep3Url);
  if (!ep3Url.includes('ep3')) {
    abnormalities.push(`Transition to Episode 3 failed. URL remains: ${ep3Url}`);
  }

  // --- STEP 4: Episode 3 Checkpoint ---
  console.log('\n[STEP 4] Episode 3: Solving Checkpoint 3 ("The Voices at Ghat No. 6")...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('checkpoint'));
    if (btn) btn.click();
  })()`);
  await wait(1500);

  await evaluate(`(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="checkbox"]'));
    inputs.forEach(inp => {
      const text = inp.closest('label')?.textContent || '';
      if (text.includes('CCTV') || text.includes('Logbook') || text.includes('Distress Voice')) {
        if (!inp.checked) inp.click();
      }
    });
    const ta = document.querySelector('textarea');
    if (ta) {
      ta.value = 'The 11-minute CCTV blackout (10:26-10:37 PM) at Ghat No. 6 masked the motorboat intercept and transfer.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }
  })()`);
  await wait(1000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (btn) btn.click();
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

  const ep4Url = await evaluate('window.location.href');
  console.log('  Episode 4 Loaded. URL:', ep4Url);
  if (!ep4Url.includes('ep4')) {
    abnormalities.push(`Transition to Episode 4 failed. URL remains: ${ep4Url}`);
  }

  // --- STEP 5: Episode 4 Checkpoint ---
  console.log('\n[STEP 5] Episode 4: Solving Checkpoint 4 ("The Missing Ledger")...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('checkpoint'));
    if (btn) btn.click();
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
  })()`);
  await wait(1000);

  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Submit to Lalbazar'));
    if (btn) btn.click();
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

  const ep5Url = await evaluate('window.location.href');
  console.log('  Episode 5 Loaded. URL:', ep5Url);
  if (!ep5Url.includes('ep5')) {
    abnormalities.push(`Transition to Episode 5 failed. URL remains: ${ep5Url}`);
  }

  // --- STEP 6: Episode 5 Climax Accusation ---
  console.log('\n[STEP 6] Episode 5: Submitting Final Accusation ("Before Dawn")...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.toLowerCase().includes('accusation'));
    if (btn) btn.click();
  })()`);
  await wait(2500);

  const accusationOpen = await evaluate(`(() => {
    const text = document.body.innerText;
    return text.includes('Indictment of Conspirators') || text.includes('Mastermind / Planner');
  })()`);
  console.log('  Accusation Modal Open:', accusationOpen);

  if (!accusationOpen) {
    abnormalities.push('Accusation modal failed to open upon clicking Accusation button in Episode 5');
  }

  // Fill in Accusation Form correctly inside <form>
  console.log('  Selecting Planner: Debashish Pal, Accomplice: Harun Sheikh, and Decisive Exhibits...');
  const formFillResult = await evaluate(`(() => {
    const form = document.querySelector('form');
    if (!form) return { error: 'No form found' };

    const selects = Array.from(form.querySelectorAll('select'));
    if (selects.length >= 2) {
      selects[0].value = 'debashish-pal';
      selects[0].dispatchEvent(new Event('change', { bubbles: true }));

      selects[1].value = 'harun-sheikh';
      selects[1].dispatchEvent(new Event('change', { bubbles: true }));
    }

    const ta = form.querySelector('textarea');
    if (ta) {
      ta.value = 'Debashish Pal orchestrated the abduction of Abir Basu via lower maintenance hatch 4B during the 11-minute CCTV blackout to suppress the dredging tender fraud evidence.';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Click 3 decisive exhibits inside form precisely by finding h4 titles
    const targetKeywords = ['Hatch Seal', 'CCTV', 'Carbon Page'];
    const clickedClues = [];
    const h4s = Array.from(form.querySelectorAll('h4'));
    h4s.forEach(h => {
      const t = h.textContent || '';
      if (targetKeywords.some(kw => t.includes(kw))) {
        const card = h.closest('.cursor-pointer');
        if (card) {
          card.click();
          clickedClues.push(t.trim());
        }
      }
    });

    const submitBtn = form.querySelector('button[type="submit"]');

    return {
      plannerVal: selects[0]?.value,
      accompliceVal: selects[1]?.value,
      clickedClues,
      submitBtnFound: !!submitBtn,
      submitBtnDisabled: submitBtn?.disabled,
      submitBtnText: submitBtn?.textContent?.trim()
    };
  })()`);
  console.log('  Form fill result:', formFillResult);
  await wait(1500);

  // Click Issue Arrest Warrants & Raid
  const submitClickResult = await evaluate(`(() => {
    const form = document.querySelector('form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    if (submitBtn && !submitBtn.disabled) {
      submitBtn.click();
      return { clicked: true };
    }
    return { clicked: false, disabled: submitBtn?.disabled };
  })()`);
  console.log('  Submit Button Click:', submitClickResult);
  await wait(4000);

  // --- STEP 7: Reveal Cinematic ---
  console.log('\n[STEP 7] Checking Cinematic Reveal...');
  const cinematicState = await evaluate(`(() => {
    const text = document.body.innerText;
    return {
      hasCinematic: text.includes('THE TRUTH UNMASKED') || text.includes('Monsoon Deception'),
      hasSkip: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip Cinematic'))
    };
  })()`);
  console.log('  Cinematic State:', cinematicState);

  if (!cinematicState.hasCinematic) {
    abnormalities.push('Reveal Cinematic did not trigger after successful final accusation.');
  }

  // Skip Cinematic to reach Results Screen
  console.log('  Advancing through / Skipping Cinematic to reach Results Screen...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Skip Cinematic'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  // --- STEP 8: Results Screen ---
  console.log('\n[STEP 8] Checking Final Case Debriefing (Results Screen)...');
  const resultsState = await evaluate(`(() => {
    try {
      const text = document.body.innerText || '';
      const hasVerdict = text.includes('OFFICIAL VERDICT: CASE CLOSED');
      const hasResultsHeader = text.includes('Final Case Debriefing');
      const hasScore100 = text.includes('/ 100');
      const hasReturnBtn = !!Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Return to Lalbazar Desk'));
      const hasReviewBtn = !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Review Case Dossier'));
      
      return {
        hasResultsHeader,
        hasVerdict,
        hasScore100,
        hasReturnBtn,
        hasReviewBtn,
        preview: text.slice(0, 350)
      };
    } catch(err) {
      return { error: err.message };
    }
  })()`);
  console.log('  Results Screen State:', resultsState);

  if (!resultsState || !resultsState.hasResultsHeader || !resultsState.hasVerdict) {
    abnormalities.push('Results screen missing official closure verdict or final case debriefing header.');
  }

  // --- STEP 9: Return to Lalbazar Desk ---
  console.log('\n[STEP 9] Clicking "Return to Lalbazar Desk"...');
  await evaluate(`(() => {
    const btn = Array.from(document.querySelectorAll('button, a')).find(b => b.textContent.includes('Return to Lalbazar Desk'));
    if (btn) btn.click();
  })()`);
  await wait(3000);

  const finalUrl = await evaluate('window.location.href');
  console.log('  Final Destination URL:', finalUrl);
  if (!finalUrl.endsWith('/cases')) {
    abnormalities.push(`Return to Desk navigated to ${finalUrl} instead of /cases`);
  }

  console.log('\n===============================================================');
  console.log('🏁 FULL SOLO PLAYTHROUGH COMPLETED!');
  console.log(`  Console Errors: ${consoleErrors.length}`);
  console.log(`  Console Warnings: ${consoleWarnings.length}`);
  console.log(`  Detected Abnormalities: ${abnormalities.length}`);
  console.log('===============================================================');

  if (consoleErrors.length > 0) {
    console.log('\n🚨 Console Errors:');
    consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
  }

  if (consoleWarnings.length > 0) {
    console.log('\n⚠️ Console Warnings:');
    consoleWarnings.forEach((w, i) => console.log(`  [${i+1}] ${w}`));
  }

  if (abnormalities.length > 0) {
    console.log('\n❌ Gameplay Abnormalities Identified:');
    abnormalities.forEach((a, i) => console.log(`  [${i+1}] ${a}`));
  } else {
    console.log('\n🎉 Flawless Run: Zero gameplay-breaking abnormalities detected!');
  }

  ws.close();
  chrome.kill();
}

runFullPlaythrough().catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
