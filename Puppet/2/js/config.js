/* ================================================================
   TUNABLES & GLOBALS
   ================================================================ */
const CONFIG = {
  // MediaPipe
  MODEL_COMPLEXITY: 0,        // 0 = lite/fast (less lag), 1 = full (more accurate but heavy)
  MIN_DETECTION_CONFIDENCE: 0.5,
  MIN_TRACKING_CONFIDENCE: 0.5,
  INFER_EVERY_N_FRAMES: 3,    // Send frame to MediaPipe every N frames (higher = less lag)

  // EMA landmark smoothing
  EMA_ALPHA: 0.4,
  MIN_VISIBILITY: 0.4,

  // OCR
  OCR_INTERVAL_MS: 800,       // ms between Tesseract calls (higher = less lag)
  OCR_CONFIDENCE_MIN: 25,     // ignore results below this confidence (0-100)
  OCR_CANVAS_SIZE: 160,       // px — resolution of canvas sent to Tesseract (smaller = less lag)
  OCR_LINE_WIDTH: 5,          // stroke thickness on OCR canvas
  OCR_PADDING: 28,            // px padding inside OCR canvas
  OCR_WHITELIST: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',

  // Stability gate
  STABILITY_HITS: 3,          // consecutive OCR reads of same letter to confirm
  LOCKOUT_MS: 1200,           // hold confirmed letter this long

  // Include legs in the OCR drawing (helps X, Y, K, etc.)
  DRAW_LEGS: true,

  // Canvas
  CAM_W: 640,
  CAM_H: 480,
};

// Global State
let mpPose, mpCamera;
let latestResults = null;
let smoothedLandmarks = null;
let myFrameCount = 0;
let lastInferFrame = -999;
let videoElement;

// OCR state
let ocrWorker = null;
let ocrReady = false;
let ocrBusy = false;
let lastOCRTime = 0;
let ocrLetter = null;          // latest single-char result
let ocrConfidence = 0;         // 0-100
let ocrRawText = '';

// Stability
let stableCandidate = null;
let stabilityCount = 0;
let confirmed = null;
let lockoutUntil = 0;
let lastConfirmed = null;        // track changes to trigger recording

// Recording tape
let recLetters = [];             // array of characters ('A'-'Z' or ' ')
let recFlashTimer = null;

// Space injection: if no pose for SPACE_PAUSE_MS, auto-insert a space
const SPACE_PAUSE_MS = 2500;
let lastPoseTime = performance.now();
let spaceInjected = false;

// FPS
let fpsFrames = 0, fpsLast = performance.now(), fpsDisplay = 0;

// Off-screen OCR canvas
let ocrCanvas, ocrCtx;