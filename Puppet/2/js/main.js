/* ================================================================
   p5.js SKETCH
   ================================================================ */
// Global video mapping props
let vProps = { x: 0, y: 0, w: 640, h: 480 };

function setup() {
  const c = createCanvas(windowWidth, windowHeight);
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function calcVideoProps() {
  if (!videoElement || !videoElement.videoWidth) return;
  const videoRatio = videoElement.videoWidth / videoElement.videoHeight;
  const canvasRatio = width / height;
  
  if (canvasRatio > videoRatio) {
    vProps.w = width;
    vProps.h = width / videoRatio;
    vProps.x = 0;
    vProps.y = (height - vProps.h) / 2;
  } else {
    vProps.h = height;
    vProps.w = height * videoRatio;
    vProps.x = (width - vProps.w) / 2;
    vProps.y = 0;
  }
}

// Convert MediaPipe normalized coordinate to screen pixel
function lmToScreen(lm) {
  // Mirrored X
  return {
    x: width - (vProps.x + lm.x * vProps.w),
    y: vProps.y + lm.y * vProps.h
  };
}

function draw() {
  myFrameCount++;
  updateFPS();

  // Draw mirrored camera feed
  if (videoElement && videoElement.readyState >= 2) {
    calcVideoProps();
    const ctx = drawingContext;
    ctx.save();
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, vProps.x, vProps.y, vProps.w, vProps.h);
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
      
      // Extract finger coordinates
      let leftFinger = null, rightFinger = null;
      const lIdx = smoothedLandmarks[19];
      const rIdx = smoothedLandmarks[20];
      if (lIdx && lIdx.visibility > CONFIG.MIN_VISIBILITY) leftFinger = lmToScreen(lIdx);
      if (rIdx && rIdx.visibility > CONFIG.MIN_VISIBILITY) rightFinger = lmToScreen(rIdx);
      
      // Update UI (Pool, Cursors, HUD)
      updateUIFingersAndPool(leftFinger, rightFinger);
    }
  }

  if (!hasPose) {
    smoothedLandmarks = null;
    ocrLetter = null;
    ocrConfidence = 0;
    updateUIFingersAndPool(null, null); // Hide cursors
  }

  updateHUD(hasPose);
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
    const pa = lmToScreen(landmarks[a]);
    const pb = lmToScreen(landmarks[b]);
    line(pa.x, pa.y, pb.x, pb.y);
  }
}

function drawLandmarkDots(landmarks) {
  noStroke();
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (lm.visibility < CONFIG.MIN_VISIBILITY) continue;
    const p = lmToScreen(lm);
    const sz = [11,12,23,24].includes(i) ? 8 : 5;
    fill(255, 255, 255, 200);
    ellipse(p.x, p.y, sz, sz);
  }
}