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
  let leftFinger = null, rightFinger = null;

  if (latestResults && latestResults.poseLandmarks) {
    const lm = validatePose(latestResults.poseLandmarks);
    if (lm) {
      hasPose = true;
      smoothedLandmarks = applyEMA(smoothedLandmarks, lm, CONFIG.EMA_ALPHA);
      drawSkeletonOverlay(smoothedLandmarks);
      drawLandmarkDots(smoothedLandmarks);
      maybeRunOCR(smoothedLandmarks);
      
      // Extract finger coordinates
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

  updateAndDrawPhysics(leftFinger, rightFinger);
  updateHUD(hasPose);
}

/* ================================================================
   PHYSICS LETTERS
   ================================================================ */
let physicsLetters = [];

function spawnPhysicsLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const char = letters[Math.floor(Math.random() * letters.length)];
  const spawnerBtn = document.querySelector('.spawner-btn');
  let startX = 64;
  let startY = height / 2;
  
  if (spawnerBtn) {
    const spawnerRect = spawnerBtn.getBoundingClientRect();
    startX = spawnerRect.right;
    startY = spawnerRect.top + spawnerRect.height / 2;
  }
  
  physicsLetters.push({
    char: char,
    x: startX + 20,
    y: startY,
    vx: Math.random() * 15 + 10, // spray out fast to the right
    vy: Math.random() * -20 - 5, // spray up
    radius: 35,
    collected: false,
    alpha: 255
  });
}

function updateAndDrawPhysics(leftFinger, rightFinger) {
  for (let i = physicsLetters.length - 1; i >= 0; i--) {
    let p = physicsLetters[i];
    
    if (!p.collected) {
      p.vy += 0.6; // Gravity
      p.x += p.vx;
      p.y += p.vy;
      
      // Air damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Floor bounce
      if (p.y > height - p.radius - 120) { // bounce above console
        p.y = height - p.radius - 120;
        p.vy *= -0.6;
        p.vx *= 0.8;
      }

      // Side wall bounce
      if (p.x > width - p.radius) {
        p.x = width - p.radius;
        p.vx *= -0.8;
      } else if (p.x < p.radius) {
        p.x = p.radius;
        p.vx *= -0.8;
      }

      // Hand collision
      let hitFinger = null;
      if (leftFinger && dist(p.x, p.y, leftFinger.x, leftFinger.y) < p.radius + 30) {
        hitFinger = leftFinger;
      } else if (rightFinger && dist(p.x, p.y, rightFinger.x, rightFinger.y) < p.radius + 30) {
        hitFinger = rightFinger;
      }

      if (hitFinger) {
        p.vy = -12; // Bounce up
        p.vx = (p.x - hitFinger.x) * 0.15; // Push away
        
        // Add to candidate pool instead of directly to text
        if (!ocrCandidates.includes(p.char)) {
          ocrCandidates.push(p.char);
        }
        while (ocrCandidates.length > CONFIG.POOL_MAX_SIZE) {
          ocrCandidates.shift();
        }
        
        p.collected = true; // Mark to fade out
      }
    }

    // Draw
    push();
    translate(p.x, p.y);
    if (p.collected) {
      p.alpha -= 15;
      if (p.alpha <= 0) {
        physicsLetters.splice(i, 1);
        pop();
        continue;
      }
      fill(255, 255, 255, p.alpha * 0.2);
      stroke(255, p.alpha);
    } else {
      fill(255, 255, 255, 30); // Glass look
      stroke(255, 200);
    }
    
    strokeWeight(2);
    ellipse(0, 0, p.radius * 2);
    
    if (p.collected) fill(255, p.alpha);
    else fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont('Inter');
    textStyle(BOLD);
    textSize(p.radius * 1.2);
    text(p.char, 0, -2);
    pop();
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