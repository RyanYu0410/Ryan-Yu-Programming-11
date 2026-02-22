/* ================================================================
   RECORDING & TAPE MANAGEMENT
   ================================================================ */

function recAppend(letter) {
  recLetters.push(letter);
  renderRecTape();
  flashLetter(letter);
}

function recSpace()     { recLetters.push(' '); renderRecTape(); }
function recBackspace() { recLetters.pop();      renderRecTape(); }
function recClear()     { recLetters = [];       renderRecTape(); }

function recCopy() {
  const text = recLetters.join('');
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.glass-btn.primary');
    const orig = btn.innerHTML;
    btn.innerHTML = 'COPIED ✓';
    setTimeout(() => { btn.innerHTML = orig; }, 1200);
  });
}

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
    `${letters} CHAR${letters !== 1 ? 'S' : ''}` +
    (words > 1 ? ` · ${words} WORDS` : '');
}

function flashLetter(letter) {
  clearTimeout(recFlashTimer);
  const el = document.getElementById('rec-flash');
  el.textContent = letter;
  el.classList.add('flash');
  recFlashTimer = setTimeout(() => { el.classList.remove('flash'); }, 300);
}

/* ================================================================
   FINGER SELECTION & POOL MANAGEMENT
   ================================================================ */

let lastHoverTarget = null;
let hoverStartTime = 0;
let lastActionTarget = null;
let actionStartTime = 0;

function updateUIFingersAndPool(leftFinger, rightFinger) {
  const now = performance.now();
  const cLeft = document.getElementById('cursor-left');
  const cRight = document.getElementById('cursor-right');

  // 1. Update Finger Cursors
  const activeFingers = [];
  if (leftFinger) {
    cLeft.classList.add('active');
    cLeft.style.left = leftFinger.x + 'px';
    cLeft.style.top = leftFinger.y + 'px';
    activeFingers.push(leftFinger);
  } else {
    cLeft.classList.remove('active');
  }

  if (rightFinger) {
    cRight.classList.add('active');
    cRight.style.left = rightFinger.x + 'px';
    cRight.style.top = rightFinger.y + 'px';
    activeFingers.push(rightFinger);
  } else {
    cRight.classList.remove('active');
  }

  // 2. Sync Pool DOM
  const poolEl = document.getElementById('candidate-pool');
  const existingCards = Array.from(poolEl.children);
  
  // Remove missing candidates
  existingCards.forEach(card => {
    if (!ocrCandidates.includes(card.dataset.char)) {
      card.style.transform = 'scale(0) translateY(-20px)';
      card.style.opacity = '0';
      setTimeout(() => card.remove(), 300);
    }
  });

  // Add new candidates
  ocrCandidates.forEach(char => {
    if (!poolEl.querySelector(`[data-char="${char}"]`)) {
      const card = document.createElement('div');
      card.className = 'candidate-card';
      card.dataset.char = char;
      card.innerHTML = `
        <span>${char}</span>
        <svg class="progress-ring" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" stroke-dashoffset="176" stroke-dasharray="176" />
        </svg>
      `;
      poolEl.appendChild(card);
      // Trigger entrance animation
      requestAnimationFrame(() => card.classList.add('appear'));
    }
  });

  // 3. Collision Detection & Hover Logic
  // Lockout logic: disable selection if recently confirmed
  if (now < lockoutUntil) {
    lastHoverTarget = null;
    resetAllProgress();
    return;
  }

  let currentHoverTarget = null;
  const cards = poolEl.querySelectorAll('.candidate-card');

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    let isHovered = false;

    for (const f of activeFingers) {
      if (f.x > rect.left && f.x < rect.right && f.y > rect.top && f.y < rect.bottom) {
        isHovered = true;
        break;
      }
    }

    const circle = card.querySelector('circle');
    const totalLength = 176; // Match CSS stroke-dasharray

    if (isHovered) {
      card.classList.add('hovered');
      currentHoverTarget = card.dataset.char;

      if (lastHoverTarget === card.dataset.char) {
        const elapsed = now - hoverStartTime;
        let progress = Math.min(elapsed / CONFIG.HOVER_CONFIRM_MS, 1.0);
        circle.style.strokeDashoffset = totalLength - (progress * totalLength);

        if (progress >= 1.0) {
          // CONFIRMED!
          card.classList.remove('hovered');
          card.classList.add('confirmed');
          recAppend(card.dataset.char);
          lockoutUntil = now + CONFIG.LOCKOUT_MS;
          ocrCandidates = []; // Clear pool on confirm
          lastHoverTarget = null;
        }
      } else {
        lastHoverTarget = card.dataset.char;
        hoverStartTime = now;
        circle.style.strokeDashoffset = totalLength;
      }
    } else {
      card.classList.remove('hovered');
      circle.style.strokeDashoffset = totalLength;
    }
  });

  // --- Touch Targets Logic (Buttons & Spawner) ---
  let currentActionTarget = null;
  const touchTargets = document.querySelectorAll('.touch-target');
  
  touchTargets.forEach(target => {
    const rect = target.getBoundingClientRect();
    let isHovered = false;
    const pad = 15; // padding for easier touch

    for (const f of activeFingers) {
      if (f.x > rect.left - pad && f.x < rect.right + pad && f.y > rect.top - pad && f.y < rect.bottom + pad) {
        isHovered = true;
        break;
      }
    }

    const action = target.dataset.action;
    const fillBg = target.querySelector('.fill-bg');
    const circle = target.querySelector('circle');
    const totalLength = 176;

    if (isHovered) {
      target.classList.add('hovered');
      currentActionTarget = action;

      if (lastActionTarget === action) {
        const elapsed = now - actionStartTime;
        let progress = Math.min(elapsed / CONFIG.HOVER_CONFIRM_MS, 1.0);
        
        if (circle) circle.style.strokeDashoffset = totalLength - (progress * totalLength);
        if (fillBg) fillBg.style.width = (progress * 100) + '%';

        if (progress >= 1.0) {
          // Trigger Action
          if (action === 'spawn') spawnPhysicsLetter();
          else if (action === 'space') recSpace();
          else if (action === 'backspace') recBackspace();
          else if (action === 'clear') recClear();
          else if (action === 'copy') recCopy();
          
          target.classList.remove('hovered');
          target.classList.add('confirmed');
          setTimeout(() => target.classList.remove('confirmed'), 300);
          
          lockoutUntil = now + CONFIG.LOCKOUT_MS;
          lastActionTarget = null;
        }
      } else {
        lastActionTarget = action;
        actionStartTime = now;
        if (circle) circle.style.strokeDashoffset = totalLength;
        if (fillBg) fillBg.style.width = '0%';
      }
    } else {
      target.classList.remove('hovered');
      if (circle) circle.style.strokeDashoffset = totalLength;
      if (fillBg) fillBg.style.width = '0%';
    }
  });

  if (!currentHoverTarget) {
    lastHoverTarget = null;
  }
  if (!currentActionTarget) {
    lastActionTarget = null;
  }
}

function resetAllProgress() {
  const cards = document.querySelectorAll('.candidate-card circle');
  cards.forEach(c => c.style.strokeDashoffset = 176);
}

/* ================================================================
   HUD MESSAGES & FPS
   ================================================================ */

function updateHUD(hasPose) {
  const now = performance.now();

  document.getElementById('fps-display').textContent = fpsDisplay + ' FPS';

  // Dot logic
  const dot = document.getElementById('rec-dot');
  if (now < lockoutUntil) {
    dot.classList.remove('idle');
  } else {
    dot.classList.add('idle');
  }

  // Auto-space logic
  if (hasPose) {
    lastPoseTime = now;
    spaceInjected = false;
  } else if (!spaceInjected && now - lastPoseTime > SPACE_PAUSE_MS) {
    if (recLetters.length > 0 && recLetters[recLetters.length - 1] !== ' ') {
      recSpace();
    }
    spaceInjected = true;
  }

  // Status messages
  document.getElementById('msg-no-pose').classList.toggle('visible', !hasPose && ocrReady);
  document.getElementById('msg-loading').classList.toggle('visible', !ocrReady);
  document.getElementById('msg-scanning').classList.toggle('visible', hasPose && ocrReady && ocrBusy && now >= lockoutUntil);
}

function updateFPS() {
  fpsFrames++;
  const now = performance.now();
  if (now - fpsLast >= 1000) {
    fpsDisplay = fpsFrames;
    fpsFrames = 0;
    fpsLast = now;
  }
}