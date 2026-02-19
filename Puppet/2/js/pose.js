/* ================================================================
   MEDIAPIPE POSE
   ================================================================ */
let isInferring = false;
function initPose() {
  mpPose = new Pose({
    locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
  });
  mpPose.setOptions({
    modelComplexity: CONFIG.MODEL_COMPLEXITY,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: CONFIG.MIN_DETECTION_CONFIDENCE,
    minTrackingConfidence: CONFIG.MIN_TRACKING_CONFIDENCE,
  });
  mpPose.onResults((r) => { 
    latestResults = r; 
    isInferring = false;
  });

  mpCamera = new Camera(videoElement, {
    onFrame: async () => {
      if (isInferring) return;
      if (myFrameCount - lastInferFrame >= CONFIG.INFER_EVERY_N_FRAMES) {
        lastInferFrame = myFrameCount;
        isInferring = true;
        try {
          await mpPose.send({ image: videoElement });
        } catch (e) {
          console.error("Pose inference error:", e);
          isInferring = false;
        }
      }
    },
    width: CONFIG.CAM_W,
    height: CONFIG.CAM_H,
  });
  mpCamera.start();
}

function validatePose(landmarks) {
  if (!landmarks || landmarks.length === 0) return null;
  const keys = [11, 12, 13, 14, 15, 16];
  let v = 0;
  for (const i of keys) {
    if (landmarks[i] && landmarks[i].visibility >= CONFIG.MIN_VISIBILITY) v++;
  }
  return v >= 4 ? landmarks : null;
}

/* ================================================================
   EMA SMOOTHING
   ================================================================ */
function applyEMA(prev, curr, alpha) {
  if (!prev || prev.length !== curr.length) {
    return curr.map(p => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility }));
  }
  return curr.map((p, i) => ({
    x: prev[i].x * (1 - alpha) + p.x * alpha,
    y: prev[i].y * (1 - alpha) + p.y * alpha,
    z: prev[i].z * (1 - alpha) + p.z * alpha,
    visibility: p.visibility,
  }));
}