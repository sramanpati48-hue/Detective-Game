import { spawn } from 'child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TEMP_PROFILE = 'C:\\Users\\ADMIN\\AppData\\Local\\Temp\\chrome-detective-test';

async function main() {
  console.log('🚀 Launching Headless Chrome with Remote Debugging...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${TEMP_PROFILE}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'http://localhost:3000/cases/the-last-ferry'
  ]);

  await new Promise((r) => setTimeout(r, 3000));

  console.log('🔍 Querying Chrome DevTools targets...');
  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find(t => t.type === 'page');

  if (!pageTarget || !pageTarget.webSocketDebuggerUrl) {
    console.error('❌ Could not find page target with webSocketDebuggerUrl');
    chrome.kill();
    process.exit(1);
  }

  console.log('🔌 Connecting to Chrome via WebSocket:', pageTarget.webSocketDebuggerUrl);
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

  const errors = [];
  const logs = [];

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
      logs.push(`[CONSOLE ${type}] ${text}`);
      if (type === 'error') {
        errors.push(`[BROWSER CONSOLE ERROR] ${text}`);
      }
    }

    if (data.method === 'Runtime.exceptionThrown') {
      const desc = data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text;
      errors.push(`[BROWSER UNCAUGHT EXCEPTION] ${desc}`);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);
  console.log('✅ Connected! Enabling Runtime, Page, DOM...');

  await sendCommand('Runtime.enable');
  await sendCommand('Page.enable');
  await sendCommand('DOM.enable');

  console.log('\n--- TEST STEP 1: Check Current URL & Title ---');
  let evalRes = await sendCommand('Runtime.evaluate', {
    expression: '({ url: window.location.href, title: document.title, bodyText: document.body.innerText.slice(0, 200) })',
    returnByValue: true
  });
  console.log('Current Page:', evalRes.result.value);

  console.log('\n--- TEST STEP 2: Clicking Start Solo Investigation ---');
  await sendCommand('Runtime.evaluate', {
    expression: (() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const soloBtn = buttons.find(b => b.innerText.includes('Start Solo Investigation') || b.innerText.includes('Solo'));
      if (soloBtn) {
        soloBtn.click();
        return 'Clicked solo button';
      }
      return 'Solo button not found';
    })(),
    returnByValue: true
  });

  await new Promise((r) => setTimeout(r, 4000));

  evalRes = await sendCommand('Runtime.evaluate', {
    expression: '({ url: window.location.href, bodyText: document.body.innerText.slice(0, 300) })',
    returnByValue: true
  });
  console.log('After Solo Click:', evalRes.result.value);

  console.log('\n--- TEST STEP 3: Inspecting Investigation View & Tabs ---');
  const inspectElements = await sendCommand('Runtime.evaluate', {
    expression: (() => {
      const tabs = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean);
      const clues = Array.from(document.querySelectorAll('[data-tutorial-id], h2, h3')).map(e => e.innerText.trim()).filter(Boolean);
      return { tabs: tabs.slice(0, 15), sampleHeadings: clues.slice(0, 10) };
    })(),
    returnByValue: true
  });
  console.log('Detected UI elements on investigation page:', inspectElements.result.value);

  console.log('\n--- TEST STEP 4: Clicking Commence Investigation ---');
  const commenceRes = await sendCommand('Runtime.evaluate', {
    expression: (() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.innerText.includes('Commence Investigation'));
      if (btn) {
        btn.click();
        return 'Clicked Commence Investigation';
      }
      return 'Commence Investigation button not found';
    })(),
    returnByValue: true
  });
  console.log('Commence result:', commenceRes.result.value);
  await new Promise((r) => setTimeout(r, 1500));

  console.log('\n--- TEST STEP 5: Clicking on Clue Card to open Evidence Viewer Modal ---');
  const openClueRes = await sendCommand('Runtime.evaluate', {
    expression: (() => {
      const cards = Array.from(document.querySelectorAll('h3'));
      const clueCard = cards.find(h => h.innerText.includes('Crime Scene Photo') || h.innerText.includes('Initial River Police') || h.innerText.includes('Umbrella'));
      if (clueCard) {
        clueCard.parentElement.click();
        return 'Clicked clue: ' + clueCard.innerText;
      }
      return 'No clue card found with h3';
    })(),
    returnByValue: true
  });
  console.log('Open clue card result:', openClueRes.result.value);
  await new Promise((r) => setTimeout(r, 1500));

  evalRes = await sendCommand('Runtime.evaluate', {
    expression: (() => {
      const modal = document.querySelector('[aria-label=" Close Evidence\]');
 const text = document.body.innerText;
 const hasModal = !!modal || text.includes('EXHIBIT REF:') || text.includes('POLICE RECOVERY');
 const pinBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Pin to Journal') || b.innerText.includes('Move Pin'));
 return { hasModal, pinBtnText: pinBtn ? pinBtn.innerText : null };
 })(),
 returnByValue: true
 });
 console.log('Modal status after clicking clue:', evalRes.result.value);

 console.log('\n--- TEST STEP 6: Clicking Pin to Journal / Board ---');
 const pinRes = await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const pinBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Pin to Journal') || b.innerText.includes('Move Pin'));
 if (pinBtn) {
 pinBtn.click();
 return 'Clicked pin button';
 }
 return 'Pin button not found in modal';
 })(),
 returnByValue: true
 });
 console.log('Pin button result:', pinRes.result.value);
 await new Promise((r) => setTimeout(r, 2000));

 console.log('\n--- TEST STEP 7: Checking Caseboard for Pinned Cards ---');
 evalRes = await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const text = document.body.innerText;
 const isCaseboard = text.includes('Lalbazar Forensic Corkboard') || text.includes('Deduction & Evidence Map');
 const pinElements = Array.from(document.querySelectorAll('button, h4')).map(e => e.innerText.trim());
 const hasPins = pinElements.some(t => t.includes('Inspect Clue') || t.includes('Initial River Police') || t.includes('Crime Scene Photo'));
 return { isCaseboard, hasPins, pinSample: pinElements.filter(t => t.includes('Clue') || t.includes('Photo')).slice(0, 5) };
 })(),
 returnByValue: true
 });
 console.log('Caseboard status:', evalRes.result.value);

 console.log('\n--- TEST STEP 8: Testing Witnesses Tab ---');
 await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const tabs = Array.from(document.querySelectorAll('button'));
 const witnessTab = tabs.find(b => b.innerText.includes('Witnesses'));
 if (witnessTab) witnessTab.click();
 })()
 });
 await new Promise((r) => setTimeout(r, 1500));
 evalRes = await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const text = document.body.innerText;
 const hasWitnesses = text.includes('Persons of Interest') || text.includes('Recorded Statements');
 const witnesses = Array.from(document.querySelectorAll('h4')).map(h => h.innerText.trim()).slice(0, 6);
 return { hasWitnesses, witnesses };
 })(),
 returnByValue: true
 });
 console.log('Witnesses Tab status:', evalRes.result.value);

 console.log('\n--- TEST STEP 9: Testing Timeline & Links Tab ---');
 await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const tabs = Array.from(document.querySelectorAll('button'));
 const timelineTab = tabs.find(b => b.innerText.includes('Timeline'));
 if (timelineTab) timelineTab.click();
 })()
 });
 await new Promise((r) => setTimeout(r, 1500));
 evalRes = await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const text = document.body.innerText;
 const isTimeline = text.includes('Chronological Sequence Analysis') || text.includes('Timeline Intelligence Locked');
 const isConnectionMatrix = text.includes('Forensic Cross-Referencing') || text.includes('Deduction Connection Matrix');
 const isSuspectMatrix = text.includes('Criminal Intelligence & Suspect Dossier') || text.includes('Persons Under Surveillance');
 return { isTimeline, isConnectionMatrix, isSuspectMatrix };
 })(),
 returnByValue: true
 });
 console.log('Timeline & Links Tab status:', evalRes.result.value);

 console.log('\n--- TEST STEP 10: Testing Review Checkpoint Button & Modal ---');
 await sendCommand('Runtime.evaluate', {
 expression: (() => {
 const chkBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Review Checkpoint') || b.innerText.includes('Checkpoint'));
 if (chkBtn) chkBtn.click();
 })()
 });
 await new Promise((r) => setTimeout(r, 1500));
  evalRes = await sendCommand('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      const hasCheckpointModal = text.includes('Investigative Objective') || text.includes('Select Supporting Exhibits from Dossier');
      const checkboxes = document.querySelectorAll('input[type="checkbox"]').length;
      return { hasCheckpointModal, checkboxes };
    })()`,
    returnByValue: true
  });
  console.log('Checkpoint Modal status:', evalRes.result.value);

  console.log('\n==================================================');
  console.log('🚨 BROWSER ERRORS COLLECTED DURING RUN:');
  console.log(`Total Errors: ${errors.length}`);
  errors.forEach((err, i) => console.log(`  [${i+1}] ${err}`));
  console.log('==================================================');

 ws.close();
 chrome.kill();
 process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
 console.error('Fatal test error:', err);
 process.exit(1);
});