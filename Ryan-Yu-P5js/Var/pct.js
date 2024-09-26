let xScale = 0.015;
let yScale = 0.02;
function setup() {
    createCanvas(400, 400);
    background(255);
}

function draw() {
    createCanvas(1200+random(100,-100), 100+random(100,-100));
    dotGrid();
    frameRate(10+random(5,-9));
}

function dotGrid() {
    background(255);
    noStroke();
    fill(0+random(mouseX/100*255,mouseY/100*-255),0+random(mouseX/100*255,mouseY/100*-255),0+random(mouseX/100*255,mouseY/100*-255));


    let gap = 8;
    let offset = mouseX;
    let offset2 = mouseY;

    for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
       
            let noiseValue = noise((x + offset) * xScale, (y + offset2) * yScale);
            let diameter = noiseValue * gap;
            rect(x, y, diameter+random(-1,1),diameter+random(-1,1));
        }
    }
}