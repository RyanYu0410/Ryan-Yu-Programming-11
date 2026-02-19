/* ================================================================
   RECORDING — tape management
   ================================================================ */

// Called automatically when a new letter is confirmed
function recAppend(letter) {
  recLetters.push(letter);
  renderRecTape();
  flashLetter(letter);
}

// Manual controls (buttons + keyboard)
function recSpace()     { recLetters.push(' '); renderRecTape(); }
function recBackspace() { recLetters.pop();      renderRecTape(); }
function recClear()     { recLetters = [];       renderRecTape(); }
function recCopy() {
  const text = recLetters.join('');
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.rec-btn.action');
    const orig = btn.textContent;
    btn.textContent = 'COPIED ✓';
    setTimeout(() => { btn.textContent = orig; }, 1200);
  });
}

// Keyboard shortcuts: Backspace, Space, Escape (clear)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') { e.preventDefault(); recBackspace(); }
  if (e.key === ' ')         { e.preventDefault(); recSpace(); }
  if (e.key === 'Escape')    { recClear(); }
});

function renderRecTape() {
  const el = document.getElementById('rec-text');
  let html = '';
  for (const ch of recLetters) {
    if (ch === ' ') {
      html += '<span class="space-mark">·</span>';
    } else {
      html += ch;
    }
  }
  html += '<span class="cursor"></span>';
  el.innerHTML = html;

  const letters = recLetters.filter(c => c !== ' ').length;
  const words   = recLetters.join('').trim().split(/\s+/).filter(Boolean).length;
  document.getElementById('rec-count').textContent =
    `${letters} letter${letters !== 1 ? 's' : ''}` +
    (words > 1 ? ` · ${words} words` : '');
}

// Big letter flash overlay
function flashLetter(letter) {
  clearTimeout(recFlashTimer);
  const el = document.getElementById('rec-flash');
  el.textContent = letter;
  el.classList.add('flash');
  recFlashTimer = setTimeout(() => { el.classList.remove('flash'); }, 320);
}

/* ================================================================
   HUD
   ================================================================ */
function updateHUD(hasPose) {
  const now = performance.now();
  const inLockout = now < lockoutUntil;

  document.getElementById('fps-display').textContent = fpsDisplay + ' fps';

  // ---- Auto-record newly confirmed letters ----
  if (confirmed && confirmed !== lastConfirmed) {
    recAppend(confirmed);
  }
  lastConfirmed = confirmed;

  // ---- Auto-space when pose disappears for long enough ----
  if (hasPose) {
    lastPoseTime = now;
    spaceInjected = false;
  } else if (!spaceInjected && now - lastPoseTime > SPACE_PAUSE_MS) {
    // Only inject space if we actually have something recorded
    if (recLetters.length > 0 && recLetters[recLetters.length - 1] !== ' ') {
      recSpace();
    }
    spaceInjected = true;
  }

  // ---- REC dot: blink only while actively in lockout (fresh letter) ----
  const dot = document.getElementById('rec-dot');
  if (inLockout) {
    dot.classList.remove('idle');
  } else {
    dot.classList.add('idle');
  }

  // Real-time OCR read (shown when not confirmed)
  const liveEl = document.getElementById('live-letter');
  if (ocrLetter && !confirmed) {
    liveEl.textContent = ocrLetter;
    liveEl.classList.add('visible');
  } else {
    liveEl.classList.remove('visible');
  }

  // Big letter (confirmed)
  const bigEl = document.getElementById('big-letter');
  if (confirmed) {
    bigEl.textContent = confirmed;
    bigEl.classList.add('visible');
  } else {
    bigEl.classList.remove('visible');
  }

  // Status messages
  document.getElementById('msg-no-pose').classList.toggle('visible', !hasPose && ocrReady);
  document.getElementById('msg-loading').classList.toggle('visible', !ocrReady);
  document.getElementById('msg-scanning').classList.toggle('visible',
    hasPose && ocrReady && ocrBusy && !confirmed);

  // Bottom stats
  document.getElementById('ocr-read-val').textContent = ocrLetter || '—';
  document.getElementById('ocr-conf-val').textContent =
    ocrConfidence > 0 ? `${ocrConfidence.toFixed(0)}%` : '—';
  document.getElementById('confirmed-val').textContent = confirmed || '—';
  document.getElementById('stability-val').textContent =
    `${stabilityCount} / ${CONFIG.STABILITY_HITS}`;

  const pct = (stabilityCount / CONFIG.STABILITY_HITS) * 100;
  const bar = document.getElementById('progress-fill');
  bar.style.width = pct + '%';
  bar.classList.toggle('locked', inLockout);
}

/* ================================================================
   FPS
   ================================================================ */
function updateFPS() {
  fpsFrames++;
  const now = performance.now();
  if (now - fpsLast >= 1000) {
    fpsDisplay = fpsFrames;
    fpsFrames = 0;
    fpsLast = now;
  }
}