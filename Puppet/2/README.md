# Puppet OCR (Glassmorphism & Physics Edition)

Puppet OCR is a highly interactive, browser-based creative coding experiment that turns your body into a keyboard. By using your webcam, the application tracks your body pose in real-time, interprets your movements into alphabet letters, and allows you to type out words in a completely hands-free, gesture-controlled environment.

## 🌟 Key Features

### 1. Pose Recognition & Intent Detection
- **Intelligent Tracking**: Uses Google's **MediaPipe Pose** to map 33 key body landmarks in real-time.
- **Rule-Based Typographic Rendering**: Analyzes relative limb positions, angles, and distances (normalized by shoulder width) to detect specific alphabet poses (e.g., Arms up like a 'Y', hands on hips like a 'B').
- **Vector Templates**: Once an intent is recognized, it draws a perfect, high-contrast vector template of that letter on a hidden canvas, ensuring maximum accuracy for the downstream OCR engine (Tesseract.js).

### 2. Immersive Physics-Based Spawner 🎲
- **Particle Letters**: A massive touch-trigger spawner on the left side of the screen shoots out randomized alphabet letters into the air.
- **Realistic Physics**: Floating letters feature gravity, air damping, wall-bouncing, and mutual collisions. They behave like physical objects in a zero-gravity ball pit.
- **Mid-Air Catching**: Move your hands (tracked via MediaPipe) to swat, push, or "catch" the falling letters. Catching a letter instantly adds it to your typing console with a burst of celebratory confetti.
- **Auto-Cleanup**: Uncaught letters fade out and disappear after 8 seconds to keep the screen clean.

### 3. Touchless "Glassmorphism" UI
- **Hover-to-Select**: Every button on the screen—from the spawner to the Space/Delete/Clear keys—is triggered via "hover dwell". Hold your hand over a button for 5 seconds to fill its progress ring and trigger the action.
- **Aesthetic Design**: Features a modern, full-screen UI with frosted glass effects, subtle blurs, and neon color accents.
- **Easter Egg Greeting**: Hover over the typing console to trigger a cyberpunk-style decoding animation that greets you with "HI! [YOUR NAME]" accompanied by a shower of confetti.

## 🛠 Tech Stack

- **Vanilla HTML/CSS/JS**: No bundlers, purely browser-native code.
- **p5.js**: Handles the main canvas loop, UI overlay drawing, coordinate mapping, and physics simulations.
- **MediaPipe Pose (CDN)**: Provides the machine learning model for robust, real-time body tracking.
- **Tesseract.js (CDN)**: The OCR engine running in a web worker to "read" the generated stick-figure/vector poses.

## 🎮 How to Play

1. **Allow Camera Access**: Open `index.html` in your browser and allow webcam permissions.
2. **Step Back**: Make sure your upper body (at least from the waist up) is visible in the camera frame.
3. **Spawn Letters**: Wave your hand over the 🎲 icon on the left to spray letters into the air.
4. **Catch & Type**: Swat the falling bubbles with your hands to add them to your text.
5. **Pose to Type**: Try making the shape of a letter with your body (e.g., 'T' with arms outstretched, 'Y' with arms up like YMCA).
6. **Edit**: Use the right-side control panel (Space, Delete, Clear) by hovering your hand over the icons.

---
*Created as an exploration into Natural User Interfaces (NUI) and creative computer vision.*