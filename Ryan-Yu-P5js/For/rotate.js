let rotX = 0;
let rotY = 0;

function setup() {
    createCanvas(400, 400, WEBGL);
    noFill();
}

function draw() {
    background(200);
    rotateX(rotX);
    rotateY(rotY);
    rotateZ(frameCount * 0.1);

    for (let i = 0; i < TWO_PI; i += 0.05) {
        for (let j = 0; j < 200; j += 50) {
            let x = cos(i) * j;
            let y = sin(i) * j;
            line(0, 0, x, y);
        }
    }
}

function mouseDragged() {
    rotX += (mouseY - pmouseY) * 0.01;
    rotY += (mouseX - pmouseX) * 0.01;
}