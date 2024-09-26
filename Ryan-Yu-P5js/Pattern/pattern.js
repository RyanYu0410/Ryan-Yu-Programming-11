const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const colors = ['#FF5733', '#A1FFEC80', '#FF800F80', '#FFFFFF80']; // Less variety in color
const numStars = 100;
const maxRadius = 10; 
const minRadius = 1;
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = random(-0.5, 0.5); // Less speed
    this.dy = random(-0.5, 0.5); // Less speed
}

Star.prototype.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
};

Star.prototype.update = function() {
    this.x += this.dx;
    this.y += this.dy;

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
        this.dx = -this.dx;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
        this.dy = -this.dy;
    }

    const dist = Math.hypot(mouse.x - this.x, mouse.y - this.y);
    if (dist < 100) {
        this.dx += (mouse.x - this.x) * 0.01;
        this.dy += (mouse.y - this.y) * 0.01;
    } else {
        this.dx *= 0.99; // Decrease speed outside of pointer
        this.dy *= 0.99; // Decrease speed outside of pointer
    }

    this.draw();
};

function init() {
    for (let i = 0; i < numStars; i++) {
        const radius = random(minRadius, maxRadius); // More variety in size
        const x = random(radius, canvas.width - radius);
        const y = random(radius, canvas.height - radius);
        const color = colors[Math.floor(random(0, colors.length))];
        stars.push(new Star(x, y, radius, color));
    }
}

function mergeColors(color1, color2, color3) {
    const c1 = parseInt(color1.slice(1), 16);
    const c2 = parseInt(color2.slice(1), 16);
    const c3 = parseInt(color3.slice(1), 16);

    const r = ((c1 >> 16) + (c2 >> 16) + (c3 >> 16)) / 3;
    const g = ((c1 >> 8 & 0xFF) + (c2 >> 8 & 0xFF) + (c3 >> 8 & 0xFF)) / 3;
    const b = ((c1 & 0xFF) + (c2 & 0xFF) + (c3 & 0xFF)) / 3;

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // Add trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }

    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.stroke();
    ctx.closePath();

    // Draw lines between stars and check for merging
    for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
            const dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.stroke();
                ctx.closePath();

                for (let k = j + 1; k < stars.length; k++) {
                    const dist2 = Math.hypot(stars[i].x - stars[k].x, stars[i].y - stars[k].y);
                    const dist3 = Math.hypot(stars[j].x - stars[k].x, stars[j].y - stars[k].y);
                    if (dist2 < 100 && dist3 < 100) {
                        const mergedColor = mergeColors(stars[i].color, stars[j].color, stars[k].color);
                        const mergedRadius = (stars[i].radius + stars[j].radius + stars[k].radius) / 3;
                        const mergedX = (stars[i].x + stars[j].x + stars[k].x) / 3;
                        const mergedY = (stars[i].y + stars[j].y + stars[k].y) / 3;

                        stars.splice(k, 1);
                        stars.splice(j, 1);
                        stars.splice(i, 1);

                        stars.push(new Star(mergedX, mergedY, mergedRadius, mergedColor));
                        break;
                    }
                }
            }
        }
    }

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

canvas.addEventListener('click', function(event) {
    const radius = random(minRadius, maxRadius);
    const x = random(radius, canvas.width - radius);
    const y = random(radius, canvas.height - radius);
    const color = colors[Math.floor(random(0, colors.length))];
    stars.push(new Star(x, y, radius, color));
});

init();
animate();
