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