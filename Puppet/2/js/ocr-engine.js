/* ================================================================
   TESSERACT.JS OCR INIT
   ================================================================ */
async function initOCR() {
  try {
    ocrWorker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') return;
      },
    });
    await ocrWorker.setParameters({
      tessedit_char_whitelist: CONFIG.OCR_WHITELIST,
      tessedit_pageseg_mode: '10',   // PSM SINGLE_CHAR
    });
    ocrReady = true;
    console.log('Tesseract OCR ready');
  } catch (err) {
    console.error('Tesseract init failed:', err);
  }
}

/* ================================================================
   OCR TRIGGER — throttled, non-overlapping
   ================================================================ */
function maybeRunOCR(lms) {
  if (!ocrReady || ocrBusy) return;

  const now = performance.now();
  if (now - lastOCRTime < CONFIG.OCR_INTERVAL_MS) return;

  // Render body to OCR canvas
  const ok = renderPoseForOCR(lms);
  if (!ok) return;

  lastOCRTime = now;
  ocrBusy = true;
  
  // Anti-hang protection: Tesseract sometimes freezes inside WASM on perfectly ambiguous geometric shapes.
  // We set a 2-second timeout to forcefully unblock the scan loop if it hangs.
  const hangTimer = setTimeout(() => {
    ocrBusy = false;
    console.warn('OCR Scan hung for 2s — forcing timeout to recover.');
  }, 2000);

  // Run recognition asynchronously
  ocrWorker.recognize(ocrCanvas).then((result) => {
    clearTimeout(hangTimer);
    if (!ocrBusy) return; // Means the timeout already fired, ignore this late result.
    
    ocrBusy = false;

    // Walk every recognized symbol and keep the single A-Z character
    // with the highest confidence score — ignores noise, spaces, punctuation
    let bestChar = null;
    let bestConf = -1;
    let cands = [];

    // 1. Add currentIntent from pose rules if available (Highest priority)
    if (window.currentIntent && !cands.includes(window.currentIntent)) {
      cands.push(window.currentIntent);
    }

    const symbols = result.data.symbols || [];
    for (const sym of symbols) {
      const ch = (sym.text || '').trim().toUpperCase();
      if (/^[A-Z]$/.test(ch)) {
        if (sym.confidence > bestConf) {
          bestConf = sym.confidence;
          bestChar = ch;
        }
        if (!cands.includes(ch)) cands.push(ch);
      }
    }

    // Fallback: if symbol data is empty, parse the raw text string
    const raw = result.data.text.trim().toUpperCase();
    if (!bestChar) {
      const match = raw.match(/[A-Z]/);
      if (match) {
        bestChar = match[0];
        bestConf = result.data.confidence;
      }
    }

    for (let i = 0; i < raw.length; i++) {
       const ch = raw[i];
       if (/^[A-Z]$/.test(ch) && !cands.includes(ch)) cands.push(ch);
    }

    ocrRawText = bestChar || '';
    ocrConfidence = bestConf > 0 ? bestConf : 0;

    // Use currentIntent if available, otherwise bestChar from OCR
    const primaryLetter = window.currentIntent || (bestChar && bestConf >= CONFIG.OCR_CONFIDENCE_MIN ? bestChar : null);

    if (primaryLetter) {
      ocrLetter = primaryLetter;
    } else {
      ocrLetter = null;
    }

    // Set global candidates for finger selection menu (max 3 choices)
    // Only show menu if there's ambiguity (more than 1 choice) or OCR disagrees with intent
    if (cands.length > 1) {
      ocrCandidates = cands.slice(0, 4); // Show up to 4 choices
    } else {
      ocrCandidates = [];
    }

    // --- Stability gate ---
    const gateNow = performance.now();
    if (gateNow < lockoutUntil) {
      stabilityCount = CONFIG.STABILITY_HITS;
      return;
    }

    if (ocrLetter && ocrLetter === stableCandidate) {
      stabilityCount = Math.min(stabilityCount + 1, CONFIG.STABILITY_HITS);
    } else {
      stableCandidate = ocrLetter;
      stabilityCount = ocrLetter ? 1 : 0;
    }

    if (stabilityCount >= CONFIG.STABILITY_HITS && stableCandidate) {
      confirmed = stableCandidate;
      lockoutUntil = gateNow + CONFIG.LOCKOUT_MS;
    }
  }).catch((err) => {
    ocrBusy = false;
    console.error('OCR error:', err);
  });
}