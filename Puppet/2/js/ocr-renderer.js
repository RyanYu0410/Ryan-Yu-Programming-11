/* ================================================================
   ALPHABET INTENT DETECTOR & TEMPLATE RENDERER
   ================================================================ */

function dist(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// ----------------------------------------------------------------
// 1. INTENT DETECTOR
// ----------------------------------------------------------------
function detectIntent(pts, shoulderW, torsoH) {
  if (!pts['neck'] || !pts['pelvis'] || !pts['midSpine']) return null;

  const leftHand = pts[15];
  const rightHand = pts[16];
  const leftElbow = pts[13];
  const rightElbow = pts[14];
  const leftFoot = pts[27];
  const rightFoot = pts[28];

  // Helper flags
  const bothHandsUp = leftHand && rightHand && leftHand.y < pts['neck'].y && rightHand.y < pts['neck'].y;
  const bothHandsDown = leftHand && rightHand && leftHand.y > pts['pelvis'].y && rightHand.y > pts['pelvis'].y;
  const bothHandsSpread = leftHand && rightHand && Math.abs(leftHand.x - rightHand.x) > shoulderW * 1.5;
  const handsClasped = leftHand && rightHand && dist(leftHand, rightHand) < shoulderW * 0.8;
  const rightHandOnNeck = rightHand && dist(rightHand, pts['neck']) < shoulderW * 0.8;
  const leftHandOnNeck = leftHand && dist(leftHand, pts['neck']) < shoulderW * 0.8;
  
  const legsSpread = leftFoot && rightFoot && Math.abs(leftFoot.x - rightFoot.x) > shoulderW * 1.5;
  const legsTogether = leftFoot && rightFoot && Math.abs(leftFoot.x - rightFoot.x) < shoulderW * 0.8;
  const rightLegOut = rightFoot && rightFoot.x > pts[24].x + shoulderW * 0.5;
  const leftLegOut = leftFoot && leftFoot.x < pts[23].x - shoulderW * 0.5;

  const rightHandHighRight = rightHand && rightHand.y < pts['neck'].y && rightHand.x > pts['neck'].x + shoulderW*0.5;
  const rightHandHighLeft = rightHand && rightHand.y < pts['neck'].y && rightHand.x < pts['neck'].x - shoulderW*0.2;
  const leftHandLowRight = leftHand && leftHand.y > pts['midSpine'].y && leftHand.x > pts['midSpine'].x;
  const leftHandLowLeft = leftHand && leftHand.y > pts['midSpine'].y && leftHand.x < pts['midSpine'].x - shoulderW*0.5;

  const leftHandOnHip = leftHand && leftElbow && leftHand.y > pts['midSpine'].y && leftHand.y < pts['pelvis'].y + shoulderW * 1.5 && Math.abs(leftHand.x - pts['pelvis'].x) < shoulderW * 1.5 && leftElbow.x < pts['neck'].x - shoulderW * 0.3;
  const rightHandOnHip = rightHand && rightElbow && rightHand.y > pts['midSpine'].y && rightHand.y < pts['pelvis'].y + shoulderW * 1.5 && Math.abs(rightHand.x - pts['pelvis'].x) < shoulderW * 1.5 && rightElbow.x > pts['neck'].x + shoulderW * 0.3;

  // -- THE ALPHABET RULEBOOK --

  // A: Hands clasped above head, legs spread
  if (bothHandsUp && handsClasped && legsSpread) return 'A';

  // B: Right hand on hip, left hand on hip (both elbows out)
  if (rightHandOnHip && leftHandOnHip) return 'B';

  // C: Both arms curved to the left
  if (rightHand && leftHand && rightHand.x < pts['neck'].x && leftHand.x < pts['pelvis'].x && !bothHandsUp && !bothHandsDown) {
    if (rightHand.y < pts['midSpine'].y && leftHand.y > pts['midSpine'].y) return 'C';
  }

  // D: Right hand on hip, left arm straight down (or hidden)
  if (rightHandOnHip && (!leftHand || leftHand.y > pts['pelvis'].y)) {
    if (!legsSpread) return 'D';
  }

  // E: Right arm horizontal right, right leg horizontal right. (Hard! Fallback: Both arms horizontal right)
  // New E logic: Right arm horizontal right, left arm horizontal right (both pointing right). Left leg straight, right leg straight.
  const rightArmHorizontalRight = rightHand && rightElbow && rightHand.x > pts['neck'].x + shoulderW && rightElbow.x > pts['neck'].x && Math.abs(rightHand.y - pts['neck'].y) < shoulderW * 0.8;
  const leftArmHorizontalRight = leftHand && leftElbow && leftHand.x > pts['neck'].x && leftElbow.x > pts['neck'].x && Math.abs(leftHand.y - pts['midSpine'].y) < shoulderW * 0.8;
  
  if (rightArmHorizontalRight && leftArmHorizontalRight) return 'E';

  // F: Right arm horizontal right, left arm horizontal right lower down. Left leg lifted? 
  // Let's simplify F: Right arm horizontal right, left hand near mid spine.
  if (rightHand && leftHand && rightHand.x > pts['neck'].x + shoulderW && Math.abs(rightHand.y - pts['neck'].y) < shoulderW) {
     if (dist(leftHand, pts['midSpine']) < shoulderW) return 'F';
  }

  // O: Hands clasped above head, legs together (distinguish from A)
  if (bothHandsUp && handsClasped && !legsSpread) return 'O';

  // P: Right hand on neck, left arm down/idle, legs together
  if (rightHandOnNeck && (!leftHand || leftHand.y > pts['pelvis'].y) && !legsSpread && !rightLegOut) return 'P';

  // R: Right hand on neck, right leg kicked out
  if (rightHandOnNeck && rightLegOut) return 'R';

  // K: Left arm straight up, right arm up-right, right leg down-right
  if (leftHand && leftHand.y < pts['neck'].y && Math.abs(leftHand.x - pts['neck'].x) < shoulderW * 0.5) {
     if (rightHandHighRight && rightLegOut) return 'K';
  }

  // L: Right arm horizontal right, left arm straight down.
  if (rightHand && rightHand.x > pts['neck'].x + shoulderW && Math.abs(rightHand.y - pts['pelvis'].y) < shoulderW) {
     if (!leftHand || leftHand.y > pts['pelvis'].y) return 'L';
  }

  // T: Both arms horizontally straight out
  if (bothHandsSpread && Math.abs(leftHand.y - rightHand.y) < shoulderW * 0.8 && Math.abs(leftHand.y - pts['neck'].y) < shoulderW * 0.8) return 'T';

  // Y: Both arms up and spread (V shape), legs together
  if (bothHandsUp && bothHandsSpread && !legsSpread) return 'Y';

  // X: Both arms up and spread, legs spread
  if (bothHandsUp && bothHandsSpread && legsSpread) return 'X';

  // V: Arms up and spread, BUT hands are relatively close (distinguish from Y)
  if (bothHandsUp && !handsClasped && Math.abs(leftHand.x - rightHand.x) < shoulderW * 1.5 && Math.abs(leftHand.x - rightHand.x) > shoulderW * 0.5) return 'V';

  // U: Both arms straight up parallel
  if (bothHandsUp && !handsClasped && Math.abs(leftHand.x - rightHand.x) < shoulderW * 1.0) {
     // Check if elbows are straight
     if (leftElbow && rightElbow && leftElbow.x < pts['neck'].x && rightElbow.x > pts['neck'].x) return 'U';
  }

  // M: Wrists lower than elbows, both active
  if (leftHand && rightHand && leftElbow && rightElbow) {
     if (leftHand.y > leftElbow.y && rightHand.y > rightElbow.y && leftHand.y < pts['pelvis'].y && rightHand.y < pts['pelvis'].y) {
         if (leftHand.x < leftElbow.x && rightHand.x > rightElbow.x) return 'M';
     }
  }

  // W: Wrists higher than elbows, arms bent near ribs
  if (leftHand && rightHand && leftElbow && rightElbow && !bothHandsUp) {
     if (leftHand.y < leftElbow.y && rightHand.y < rightElbow.y) {
         if (leftElbow.y > pts['midSpine'].y && rightElbow.y > pts['midSpine'].y) return 'W';
     }
  }

  // S: Right hand high-left, left hand low-right
  if (rightHandHighLeft && leftHandLowRight) return 'S';

  // Z: Right hand high-right, left hand low-left
  if (rightHandHighRight && leftHandLowLeft) return 'Z';
  
  // I: Stand perfectly straight (fallback for tall narrow boxes)
  
  return null;
}

// ----------------------------------------------------------------
// 2. VECTOR TEMPLATE RENDERER
// ----------------------------------------------------------------
function drawTemplate(ctx, letter, scale, bw, bh, cx, cy, S) {
    ctx.strokeStyle = '#000000';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(12, CONFIG.OCR_LINE_WIDTH * 2.0); // Thick font

    const letterH = bh * scale * 0.9;
    const letterW = letterH * 0.75;
    const x = S / 2;
    const y = S / 2;
    
    ctx.beginPath();

    switch (letter) {
      case 'A':
        ctx.moveTo(x - letterW/2, y + letterH/2);
        ctx.lineTo(x, y - letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        ctx.moveTo(x - letterW*0.25, y + letterH*0.1);
        ctx.lineTo(x + letterW*0.25, y + letterH*0.1);
        break;
      case 'B':
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.lineTo(x - letterW*0.3, y + letterH/2);
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.bezierCurveTo(x + letterW*0.8, y - letterH/2, x + letterW*0.8, y, x - letterW*0.3, y);
        ctx.moveTo(x - letterW*0.3, y);
        ctx.bezierCurveTo(x + letterW*0.9, y, x + letterW*0.9, y + letterH/2, x - letterW*0.3, y + letterH/2);
        break;
      case 'C':
        ctx.arc(x, y, letterH/2, Math.PI * 0.25, Math.PI * 1.75);
        break;
      case 'D':
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.lineTo(x - letterW*0.3, y + letterH/2);
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.bezierCurveTo(x + letterW, y - letterH/2, x + letterW, y + letterH/2, x - letterW*0.3, y + letterH/2);
        break;
      case 'E':
        ctx.moveTo(x - letterW*0.2, y - letterH/2);
        ctx.lineTo(x - letterW*0.2, y + letterH/2);
        ctx.moveTo(x - letterW*0.2, y - letterH/2);
        ctx.lineTo(x + letterW*0.6, y - letterH/2);
        ctx.moveTo(x - letterW*0.2, y);
        ctx.lineTo(x + letterW*0.4, y);
        ctx.moveTo(x - letterW*0.2, y + letterH/2);
        ctx.lineTo(x + letterW*0.6, y + letterH/2);
        break;
      case 'F':
        ctx.moveTo(x - letterW*0.2, y - letterH/2);
        ctx.lineTo(x - letterW*0.2, y + letterH/2);
        ctx.moveTo(x - letterW*0.2, y - letterH/2);
        ctx.lineTo(x + letterW*0.6, y - letterH/2);
        ctx.moveTo(x - letterW*0.2, y);
        ctx.lineTo(x + letterW*0.4, y);
        break;
      case 'G':
        ctx.arc(x, y, letterH/2, Math.PI * -0.25, Math.PI * 1.75, true);
        ctx.moveTo(x, y);
        ctx.lineTo(x + letterH/2, y);
        ctx.lineTo(x + letterH/2, y + letterH/2);
        break;
      case 'H':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/2, y + letterH/2);
        ctx.moveTo(x + letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        ctx.moveTo(x - letterW/2, y);
        ctx.lineTo(x + letterW/2, y);
        break;
      case 'I':
        ctx.moveTo(x, y - letterH/2);
        ctx.lineTo(x, y + letterH/2);
        const serifW = letterW * 0.5;
        ctx.moveTo(x - serifW/2, y - letterH/2);
        ctx.lineTo(x + serifW/2, y - letterH/2);
        ctx.moveTo(x - serifW/2, y + letterH/2);
        ctx.lineTo(x + serifW/2, y + letterH/2);
        break;
      case 'J':
        ctx.moveTo(x + letterW*0.3, y - letterH/2);
        ctx.lineTo(x + letterW*0.3, y + letterH*0.2);
        ctx.arc(x, y + letterH*0.2, letterW*0.3, 0, Math.PI);
        break;
      case 'K':
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.lineTo(x - letterW*0.3, y + letterH/2);
        ctx.moveTo(x + letterW*0.5, y - letterH/2);
        ctx.lineTo(x - letterW*0.3, y + letterH*0.1);
        ctx.moveTo(x - letterW*0.1, y - letterH*0.1);
        ctx.lineTo(x + letterW*0.5, y + letterH/2);
        break;
      case 'L':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/2, y + letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        break;
      case 'M':
        ctx.lineJoin = 'miter';
        ctx.moveTo(x - letterW/2, y + letterH/2);
        ctx.lineTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x, y + letterH*0.2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        break;
      case 'N':
        ctx.lineJoin = 'miter';
        ctx.moveTo(x - letterW/2, y + letterH/2);
        ctx.lineTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        break;
      case 'O':
        ctx.ellipse(x, y, letterW/2, letterH/2, 0, 0, Math.PI * 2);
        break;
      case 'P':
        ctx.moveTo(x - letterW*0.3, y + letterH/2);
        ctx.lineTo(x - letterW*0.3, y - letterH/2);
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.bezierCurveTo(x + letterW, y - letterH/2, x + letterW, y, x - letterW*0.3, y);
        break;
      case 'Q':
        ctx.ellipse(x, y, letterW/2, letterH/2, 0, 0, Math.PI * 2);
        ctx.moveTo(x, y + letterH*0.2);
        ctx.lineTo(x + letterW*0.6, y + letterH*0.6);
        break;
      case 'R':
        ctx.moveTo(x - letterW*0.3, y + letterH/2);
        ctx.lineTo(x - letterW*0.3, y - letterH/2);
        ctx.moveTo(x - letterW*0.3, y - letterH/2);
        ctx.bezierCurveTo(x + letterW, y - letterH/2, x + letterW, y, x - letterW*0.3, y);
        ctx.moveTo(x, y);
        ctx.lineTo(x + letterW*0.5, y + letterH/2);
        break;
      case 'S':
        ctx.moveTo(x + letterW/2, y - letterH/2 + letterH*0.2);
        ctx.bezierCurveTo(x + letterW/2, y - letterH/2 - letterH*0.1, x - letterW/2, y - letterH/2, x, y);
        ctx.bezierCurveTo(x + letterW/2, y + letterH/2, x - letterW/2, y + letterH/2 + letterH*0.1, x - letterW/2, y + letterH/2 - letterH*0.2);
        break;
      case 'T':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        ctx.moveTo(x, y - letterH/2);
        ctx.lineTo(x, y + letterH/2);
        break;
      case 'U':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/2, y + letterH*0.3);
        ctx.arcTo(x - letterW/2, y + letterH/2, x, y + letterH/2, letterW/2);
        ctx.arcTo(x + letterW/2, y + letterH/2, x + letterW/2, y + letterH*0.3, letterW/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        break;
      case 'V':
        ctx.lineJoin = 'miter';
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x, y + letterH/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        break;
      case 'W':
        ctx.lineJoin = 'miter';
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/4, y + letterH/2);
        ctx.lineTo(x, y - letterH*0.2);
        ctx.lineTo(x + letterW/4, y + letterH/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        break;
      case 'X':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        ctx.moveTo(x + letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/2, y + letterH/2);
        break;
      case 'Y':
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x, y);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + letterH/2);
        break;
      case 'Z':
        ctx.lineJoin = 'miter';
        ctx.moveTo(x - letterW/2, y - letterH/2);
        ctx.lineTo(x + letterW/2, y - letterH/2);
        ctx.lineTo(x - letterW/2, y + letterH/2);
        ctx.lineTo(x + letterW/2, y + letterH/2);
        break;
      default:
        return false;
    }
    ctx.stroke();
    return true;
}

// ----------------------------------------------------------------
// MAIN RENDER FUNCTION
// ----------------------------------------------------------------
function renderPoseForOCR(lms) {
  const S   = CONFIG.OCR_CANVAS_SIZE;
  const PAD = CONFIG.OCR_PADDING;

  const pts = {};
  const ids = [11,12,13,14,15,16,23,24,25,26,27,28];
  for (const i of ids) {
    if (lms[i] && lms[i].visibility >= CONFIG.MIN_VISIBILITY) {
      pts[i] = { x: 1.0 - lms[i].x, y: lms[i].y };
    }
  }
  if (!pts[11] || !pts[12]) return false;

  pts['neck'] = { x: (pts[11].x + pts[12].x) / 2, y: (pts[11].y + pts[12].y) / 2 };
  if (pts[23] && pts[24]) {
    pts['pelvis'] = { x: (pts[23].x + pts[24].x) / 2, y: (pts[23].y + pts[24].y) / 2 };
    pts['midSpine'] = { x: (pts['neck'].x + pts['pelvis'].x) / 2, y: (pts['neck'].y + pts['pelvis'].y) / 2 };
  }

  const shoulderWidth = Math.abs(pts[11].x - pts[12].x) || 0.1;
  const torsoHeight = pts['pelvis'] ? Math.abs(pts['pelvis'].y - pts['neck'].y) : shoulderWidth * 2;

  // Bounding box
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of Object.values(pts)) {
    if (!p) continue;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const usable = S - 2 * PAD;
  let bw = maxX - minX || 0.001;
  const bh = maxY - minY || 0.001;
  
  if (bw / bh < 0.45) bw = bh * 0.45; 
  const scale = Math.min(usable / bw, usable / bh);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;

  // 1. Detect Explicit Letter Intent
  const intent = detectIntent(pts, shoulderWidth, torsoHeight);

  // 2. Clear canvas
  ocrCtx.fillStyle = '#ffffff';
  ocrCtx.fillRect(0, 0, S, S);

  // 3. Draw Template OR Fallback
  if (intent && drawTemplate(ocrCtx, intent, scale, bw, bh, cx, cy, S)) {
      // Template drawn successfully
  } else {
      // Fallback: Geometric Skeleton Drawing
      ocrCtx.strokeStyle = '#000000';
      ocrCtx.lineWidth = Math.max(8, CONFIG.OCR_LINE_WIDTH * 1.5);
      ocrCtx.lineCap = 'round';
      ocrCtx.lineJoin = 'round';

      function toC(p) {
        if (!p) return null;
        return { x: S / 2 + (p.x - cx) * scale, y: S / 2 + (p.y - cy) * scale };
      }

      function drawLine(p1, p2) {
        if (!p1 || !p2) return;
        const c1 = toC(p1), c2 = toC(p2);
        if (!c1 || !c2) return;
        ocrCtx.beginPath();
        ocrCtx.moveTo(c1.x, c1.y);
        ocrCtx.lineTo(c2.x, c2.y);
        ocrCtx.stroke();
      }

      if (pts['neck'] && pts['pelvis']) drawLine(pts['neck'], pts['pelvis']);
      
      // Basic arms
      drawLine(pts['neck'], pts[13]); drawLine(pts[13], pts[15]);
      drawLine(pts['neck'], pts[14]); drawLine(pts[14], pts[16]);
      
      // Basic legs
      if (CONFIG.DRAW_LEGS && pts['pelvis']) {
        drawLine(pts['pelvis'], pts[25]); drawLine(pts[25], pts[27]);
        drawLine(pts['pelvis'], pts[26]); drawLine(pts[26], pts[28]);
      }

      // Serif Injection for "I" (fallback only)
      if ((maxX - minX) / (maxY - minY) < 0.38) {
        const serifW = (maxY - minY) * 0.25;
        drawLine({x: cx - serifW/2, y: minY}, {x: cx + serifW/2, y: minY});
        drawLine({x: cx - serifW/2, y: maxY}, {x: cx + serifW/2, y: maxY});
      }
  }

  const pCtx = document.getElementById('ocr-preview').getContext('2d');
  pCtx.clearRect(0, 0, S, S);
  pCtx.drawImage(ocrCanvas, 0, 0, S, S);

  return true;
}