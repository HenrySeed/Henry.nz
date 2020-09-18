// checks for when to draw
let canvasActive = false;

class Blob {
    x;
    y;
    diam;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.diam = 30;
    }

    draw() {
        ellipse(this.x, this.y, this.diam);
    }

    update() {}
}

function getRandInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    xPos = windowWidth / 2;
    yPos = windowHeight / 2;
    circles = [];
    clear();
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("sketchHolder");
    loop();

    colorMode(HSB, 100);
    noStroke();

    document.body.addEventListener("mouseleave", function (event) {
        canvasActive = false;
    });
    document.body.addEventListener("mouseenter", function (event) {
        canvasActive = true;
    });
}

function draw() {
    if (!canvasActive) {
        //
    } else {
        //
    }

    clear();
    ellipse(width / 2, height / 2, 40, 40);
}
