let words = [];
let fonts = ['Jacquarda Bastarda 9', 'Pacifico', "Playwrite CU", "Scope One"];
let currentFont;
let lastFontChangeTime = 0;
let mouseIsPressedFlag = false;
let fontChangeEnabled = false;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    currentFont = random(fonts);
}

function draw() {
    background(220);
    if (fontChangeEnabled && millis() - lastFontChangeTime > 1000) {
        let currentFontIndex = fonts.indexOf(currentFont);
        currentFont = fonts[(currentFontIndex + 1) % fonts.length];
        lastFontChangeTime = millis();
    }
    textFont(currentFont);
    for (let i = 0; i < words.length; i++) {
        textSize(20);
        fill(0);
        if (mouseIsPressedFlag) {
            text(words[i].char, words[i].x, words[i].y); 
        } else {
            text(words[floor(random(words.length))].char, words[i].x, words[i].y);
        }
    }
}

function mousePressed() {
    mouseIsPressedFlag = false;
}

function mouseReleased() {
    mouseIsPressedFlag = true;
}

function keyPressed() {
    words.push({ char: key, x: mouseX, y: mouseY });
    if (key.toLowerCase() === 'enter') {
        fontChangeEnabled = !fontChangeEnabled;
    } 
}