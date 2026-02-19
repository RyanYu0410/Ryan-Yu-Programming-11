/* ================================================================
   p5.js SKETCH
   ================================================================ */
function setup() {
  const c = createCanvas(CONFIG.CAM_W, CONFIG.CAM_H);
  c.parent('app-container');
  pixelDensity(1);

  videoElement = document.createElement('video');
  videoElement.setAttribute('playsinline', '');
  videoElement.style.display = 'none';
  document.body.appendChild(videoElement);

  // Off-screen canvas for OCR
  ocrCanvas = document.createElement('canvas');
  ocrCanvas.width = CONFIG.OCR_CANVAS_SIZE;
  ocrCanvas.height = CONFIG.OCR_CANVAS_SIZE;
  ocrCtx = ocrCanvas.getContext('2d');

  initPose();
  initOCR();
}

function draw() {
  myFrameCount++;
  updateFPS();

  // Draw mirrored camera feed
  if (videoElement && videoElement.readyState >= 2) {
    const ctx = drawingContext;
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, width, height);
    ctx.restore();
  } else {
    background(30);
    fill(180); noStroke(); textAlign(CENTER, CENTER); textSize(18);
    text('Starting camera…', width / 2, height / 2);
    return;
  }

  // Process pose
  let hasPose = false;
  if (latestResults && latestResults.poseLandmarks) {
    const lm = validatePose(latestResults.poseLandmarks);
    if (lm) {
      hasPose = true;
      smoothedLandmarks = applyEMA(smoothedLandmarks, lm, CONFIG.EMA_ALPHA);
      drawSkeletonOverlay(smoothedLandmarks);
      drawLandmarkDots(smoothedLandmarks);
      maybeRunOCR(smoothedLandmarks);
      handleFingerSelection(smoothedLandmarks);
    }
  }

  if (!hasPose) {
    smoothedLandmarks = null;
    ocrLetter = null;
    ocrConfidence = 0;
    stableCandidate = null;
    stabilityCount = 0;
  }

  updateHUD(hasPose);
}

/* ================================================================
   FINGER SELECTION MENU
   ================================================================ */
function handleFingerSelection(landmarks) {
  const now = performance.now();
  if (now < lockoutUntil || ocrCandidates.length <= 1) {
    hoverLetter = null;
    hoverProgress = 0;
    return;
  }

  const boxW = 80;
  const boxH = 80;
  const gap = 20;
  const totalW = ocrCandidates.length * boxW + (ocrCandidates.length - 1) * gap;
  const startX = width / 2 - totalW / 2;
  const by = height * 0.15; // Top of screen

  let currentlyHovering = null;

  // 19 = left index, 20 = right index (mirrored)
  const leftIndex = landmarks[19];
  const rightIndex = landmarks[20];
  const fingers = [];
  if (leftIndex && leftIndex.visibility > CONFIG.MIN_VISIBILITY) {
    fingers.push({ x: width - leftIndex.x * width, y: leftIndex.y * height });
  }
  if (rightIndex && rightIndex.visibility > CONFIG.MIN_VISIBILITY) {
    fingers.push({ x: width - rightIndex.x * width, y: rightIndex.y * height });
  }

  textAlign(CENTER, CENTER);
  for (let i = 0; i < ocrCandidates.length; i++) {
    const ch = ocrCandidates[i];
    const bx = startX + i * (boxW + gap);

    // Check collision
    let isHover = false;
    for (const f of fingers) {
      if (f.x > bx && f.x < bx + boxW && f.y > by && f.y < by + boxH) {
        isHover = true;
        break;
      }
    }

    if (isHover) {
      currentlyHovering = ch;
    }

    // Draw box
    if (hoverLetter === ch) {
      fill(99, 202, 255, 220); // Highlight color
    } else {
      fill(0, 0, 0, 150);
    }
    stroke(255, 255, 255, 100);
    strokeWeight(2);
    rect(bx, by, boxW, boxH, 12);

    // Draw text
    fill(255);
    noStroke();
    textSize(40);
    text(ch, bx + boxW/2, by + boxH/2 + 5);

    // Draw progress ring
    if (hoverLetter === ch && hoverProgress > 0) {
      noFill();
      stroke(255, 255, 255, 220);
      strokeWeight(5);
      const angle = (hoverProgress / 100) * TWO_PI;
      arc(bx + boxW/2, by + boxH/2, boxW - 10, boxH - 10, -PI/2, -PI/2 + angle);
    }
  }

  // Update hover state
  if (currentlyHovering) {
    if (hoverLetter === currentlyHovering) {
      hoverProgress += 4; // Takes 25 frames (~0.5s-0.8s depending on framerate)
      if (hoverProgress >= 100) {
        confirmed = currentlyHovering;
        lockoutUntil = performance.now() + CONFIG.LOCKOUT_MS;
        hoverLetter = null;
        hoverProgress = 0;
        ocrCandidates = []; // Clear menu on confirm
      }
    } else {
      hoverLetter = currentlyHovering;
      hoverProgress = 0;
    }
  } else {
    hoverLetter = null;
    hoverProgress = 0;
  }
}

/* ================================================================
   p5.js DRAWING HELPERS (Main Canvas)
   ================================================================ */
const POSE_CONNECTIONS = [
  [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body
  [11, 23], [12, 24], [23, 24], // Torso
  [23, 25], [25, 27], [24, 26], [26, 28] // Lower body
];

function drawSkeletonOverlay(landmarks) {
  stroke(99, 202, 255, 160);
  strokeWeight(3);
  for (const [a, b] of POSE_CONNECTIONS) {
    if (landmarks[a].visibility < CONFIG.MIN_VISIBILITY ||
        landmarks[b].visibility < CONFIG.MIN_VISIBILITY) continue;
    const pa = { x: width - landmarks[a].x * width, y: landmarks[a].y * height };
    const pb = { x: width - landmarks[b].x * width, y: landmarks[b].y * height };
    line(pa.x, pa.y, pb.x, pb.y);
  }
}

function drawLandmarkDots(landmarks) {
  noStroke();
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (lm.visibility < CONFIG.MIN_VISIBILITY) continue;
    const p = { x: width - lm.x * width, y: lm.y * height };
    const sz = [11,12,23,24].includes(i) ? 8 : 5;
    fill(255, 255, 255, 200);
    ellipse(p.x, p.y, sz, sz);
  }
}