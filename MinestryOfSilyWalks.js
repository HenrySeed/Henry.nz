let xPos;
let yPos;

const movement = 2;
let snakeLength = 100;
const ellipseWidth = 90;

let canvasActive = false;
let mousehasntMoved = true;
let ogMousePos;

const randColorOffset = getRandInt(0, 100);

let randWalkTimer = 0;
let randWalkTarget;

// array of [x, y, color]
let circles = [];

function getRandInt(min, max) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}

function getRandomCoord(startX, startY) {
    let directions = [];
    // 10% of the smaller of the two sides height or width
    const padding = min(windowWidth, windowHeight) / 5;

    // only add directions if we are'nt too close to that edge
    if (startX < windowWidth - padding && startY < windowHeight - padding)
        directions.push([1, 1]);
    if (startX < windowWidth - padding && startY > padding)
        directions.push([1, -1]);
    if (startX > padding && startY < windowHeight - padding)
        directions.push([-1, 1]);
    if (startX > padding && startY > padding) directions.push([-1, -1]);

    // randomly remove directions we dont want, ie: if we are south, dont keep going south as often
    let newDirections = [];
    if (directions.length > 2) {
        const areNorth = startY < windowHeight / 2;
        const areSouth = startY > windowHeight / 2;
        const areEast = startX > windowWidth / 2;
        const areWest = startX < windowWidth / 2;

        let skipped = 0;
        for (const possD of shuffle(directions)) {
            let skipThis = false;
            if (areNorth && possD[1] === -1 && getRandInt(0, 3) === 0) {
                skipThis = true;
            }
            if (areSouth && possD[1] === 1 && getRandInt(0, 3) === 0) {
                skipThis = true;
            }
            if (areEast && possD[0] === 1 && getRandInt(0, 3) === 0) {
                skipThis = true;
            }
            if (areWest && possD[0] === -1 && getRandInt(0, 3) === 0) {
                skipThis = true;
            }
            if (!skipThis || skipped >= 2) {
                newDirections.push(possD);
            } else {
                skipped++;
            }
        }
    } else {
        newDirections = directions;
    }

    const direction = newDirections[getRandInt(0, newDirections.length)];

    const travelX = getRandInt(padding / 2, padding) * direction[0];
    const travelY = getRandInt(padding / 2, padding) * direction[1];

    return [startX + travelX, startY + travelY];
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("sketchHolder");
    loop();

    colorMode(HSB, 100);
    noStroke();
    fill(66, 245, 215);

    xPos = width / 2;
    yPos = height / 2;
    ogMousePos = [mouseX, mouseY];

    document.body.addEventListener("mouseleave", function (event) {
        canvasActive = false;
    });
    document.body.addEventListener("mouseenter", function (event) {
        canvasActive = true;
    });

    fill(getColor(), 100, 100);
    ellipse(xPos, yPos, ellipseWidth, ellipseWidth);
}

function getColor() {
    // get normalised x, y
    const normalX = xPos / windowWidth;
    const normalY = yPos / windowHeight;
    return (normalY * 90 + normalX * 10 + randColorOffset) % 100;
}

function getNewCoords(targetX, targetY, speed) {
    // calculate the new circle position
    const toChange = sqrt((targetX - xPos) ** 2 + (targetY - yPos) ** 2);
    const xChange = (targetX - xPos) / toChange;
    const yChange = (targetY - yPos) / toChange;
    return [xPos + xChange * movement, yPos + yChange * speed];
}

function addCircle(x, y) {
    circles.push([x, y, getColor()]);
    // limit the snakle to the snakeLength
    if (circles.length > snakeLength) {
        circles = circles.slice(circles.length - snakeLength);
    }
}

function draw() {
    if (!canvasActive) {
        if (
            randWalkTimer > 0 &&
            xPos !== randWalkTarget[0] &&
            yPos !== randWalkTarget[1]
        ) {
            [xPos, yPos] = getNewCoords(
                randWalkTarget[0],
                randWalkTarget[1],
                movement / 5
            );
            snakeLength = 300;
            addCircle(xPos, yPos);
            randWalkTimer -= 1;
        } else {
            // gen a new target
            randWalkTarget = getRandomCoord(xPos, yPos);
            randWalkTimer = 200;
        }
    } else {
        if (mousehasntMoved) {
            if (
                JSON.stringify([mouseX, mouseY]) !== JSON.stringify(ogMousePos)
            ) {
                mousehasntMoved = false;
            }
        }
        if (mousehasntMoved) {
            return;
        }
    }

    if (!mousehasntMoved && canvasActive) {
        snakeLength = 100;
        [xPos, yPos] = getNewCoords(mouseX, mouseY, movement);
        addCircle(xPos, yPos);
    }

    clear();
    for (const circle of circles) {
        fill(circle[2], 100, 100);
        ellipse(circle[0], circle[1], ellipseWidth, ellipseWidth);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    xPos = windowWidth / 2;
    yPos = windowHeight / 2;
    circles = [];
    clear();
}
