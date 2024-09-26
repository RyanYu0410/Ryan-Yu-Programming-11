function setup() {
    createCanvas(400, 400, WEBGL);
    background(0); // Set initial background to black
}

let previousColor;

function draw() {
    translate(-width / 2, -height / 2);
    let bgColor = map(0, 0, 0, 0, 0);
    background(bgColor, 10); 

    let squareColor;
    if (mouseX < width / 2 && mouseY > height / 2) {
        squareColor = color(0, 0, 255);
    }
    else if(mouseX > width / 2 && mouseY < height / 2){
        squareColor = color(255, 255, 0);
    }
    else if(mouseY > height / 2 && mouseX > width){
        squareColor = color(255, 0, 255);
    }else{
        squareColor = color(0, 255, 255);
    }

    if (squareColor !== previousColor) {
        for (let i = 0; i < 8; i++) {
            push();
            translate(width / 2 + 100 * cos(TWO_PI * i / 8), height / 2 + 100 * sin(TWO_PI * i / 8));
            rotate(TWO_PI * i / 8);
            fill(squareColor);
            triangle(0, -20, -10, 20, 10, 20);
            pop();
        }
        previousColor = squareColor;
    }

    fill(squareColor);
    noStroke();
    let angle = frameCount * 0.05;
    push();
    translate(width / 2, height / 2);
    rotateX(angle/6);
    rotateY(angle);
    box(40);
    pop();
}