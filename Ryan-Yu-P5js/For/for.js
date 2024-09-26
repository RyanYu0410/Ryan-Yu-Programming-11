function setup() {
    createCanvas(400, 400);
    noFill();
}

function draw() {
    background(200);
    for (let i = 40; i < width; i += 40) {
        for (let j = 40; j < height; j += 40) {
            noStroke();
            ellipse(i, j, 30, 30);
            let r = random(1, 7);
            if (i / 40 == Math.round(r)) {
                fill(255, 255, 0, 100);
            } else {
                fill(1, 1, 1, 50);
            }
        }
    }
}