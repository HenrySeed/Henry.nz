import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import { useEffect } from "react";

let xPos: number;
let yPos: number;

// control panel for snake
const movement = 1.5;
let snakeLength = 100;
const ellipseWidth = 90;
const randColorOffset = getRandInt(0, 100);

// checks for when to draw
let canvasActive = false;
let ogMousePos: [number, number];

// auto mode
let randWalkTimer = 0;
let randWalkTarget: [number, number];
let lastDirection: [number, number];

// array of [x, y, color]
let circles: [number, number, number][] = [];

function getRandInt(min: number, max: number) {
    return min + Math.floor(Math.random() * Math.floor(max - min));
}

function Snake() {
    function updateListeners(p5: p5Types) {
        const resizeListener = () => {
            p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
            xPos = p5.windowWidth / 2;
            yPos = p5.windowHeight / 2;
            circles = [];
            p5.clear();
        };
        const mouseMoveListener = () => {
            if (p5.mouseY > p5.windowHeight * 0.8) {
                canvasActive = false;
            } else {
                canvasActive = true;
            }
        };
        const mouseLeaveListener = () => {
            canvasActive = false;
        };
        const mouseEnterListener = () => {
            canvasActive = true;
        };
        document.body.addEventListener("mouseleave", mouseLeaveListener);
        document.body.addEventListener("mouseenter", mouseEnterListener);
        document.addEventListener("mousemove", mouseMoveListener);
        window.addEventListener("resize", resizeListener);

        return () => {
            window.removeEventListener("mouseleave", mouseLeaveListener);
            window.removeEventListener("mouseenter", mouseEnterListener);
            window.removeEventListener("mousemove", mouseMoveListener);
            window.removeEventListener("resize", resizeListener);
        };
    }

    function getRandomCoord(
        p5: p5Types,
        startX: number,
        startY: number
    ): [number, number] {
        let directions: [number, number][] = [];
        // 10% of the smaller of the two sides height or width
        const padding = p5.min(p5.windowWidth, p5.windowHeight) / 5;

        // only add directions if we are'nt too close to that edge
        if (
            startX < p5.windowWidth - padding &&
            startY < p5.windowHeight - padding
        )
            directions.push([1, 1]);
        if (startX < p5.windowWidth - padding && startY > padding)
            directions.push([1, -1]);
        if (startX > padding && startY < p5.windowHeight - padding)
            directions.push([-1, 1]);
        if (startX > padding && startY > padding) directions.push([-1, -1]);

        // randomly remove directions we dont want, ie: if we are south, dont keep going south as often
        let newDirections: [number, number][] = [];
        if (directions.length > 2) {
            const areNorth = startY < p5.windowHeight / 2;
            const areSouth = startY > p5.windowHeight / 2;
            const areEast = startX > p5.windowWidth / 2;
            const areWest = startX < p5.windowWidth / 2;

            let skipped = 0;
            for (const possD of p5.shuffle(directions)) {
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

        // if there are more than 1 direction, stop it going back on itself
        if (newDirections.length > 1 && lastDirection !== undefined) {
            const doublBack = [lastDirection[0] * -1, lastDirection[1] * -1];
            newDirections = newDirections.filter(
                (val) => JSON.stringify(val) !== JSON.stringify(doublBack)
            );
        }

        const direction = newDirections[getRandInt(0, newDirections.length)];
        lastDirection = direction;

        const travelX = getRandInt(padding / 2, padding) * direction[0];
        const travelY = getRandInt(padding / 2, padding) * direction[1];

        return [startX + travelX, startY + travelY];
    }

    function getColor(p5: p5Types) {
        // get normalised x, y
        const normalX = xPos / p5.windowWidth;
        const normalY = yPos / p5.windowHeight;
        return (normalY * 90 + normalX * 10 + randColorOffset) % 100;
    }

    function getNewCoords(
        p5: p5Types,
        targetX: number,
        targetY: number,
        speed: number
    ) {
        // calculate the new circle position
        const toChange = p5.sqrt((targetX - xPos) ** 2 + (targetY - yPos) ** 2);
        const xChange = (targetX - xPos) / toChange;
        const yChange = (targetY - yPos) / toChange;
        return [xPos + xChange * movement, yPos + yChange * speed];
    }

    function addCircle(p5: p5Types, x: number, y: number) {
        circles.push([x, y, getColor(p5)]);
        // limit the snakle to the snakeLength
        if (circles.length > snakeLength) {
            circles = circles.slice(circles.length - snakeLength);
        }
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        updateListeners(p5);
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(
            canvasParentRef
        );
        p5.loop();

        p5.colorMode(p5.HSB, 100);
        p5.noStroke();
        p5.fill(66, 245, 215);

        xPos = p5.width / 2;
        yPos = p5.height / 2;
        ogMousePos = [p5.mouseX, p5.mouseY];

        p5.fill(getColor(p5), 100, 100);
        p5.ellipse(xPos, yPos, ellipseWidth, ellipseWidth);
    };

    const draw = (p5: p5Types) => {
        const { mouseX, mouseY } = p5;
        if (!canvasActive) {
            // Auto mode
            if (
                randWalkTimer > 0 &&
                Math.round(xPos) !== Math.round(randWalkTarget[0]) &&
                Math.round(yPos) !== Math.round(randWalkTarget[1])
            ) {
                [xPos, yPos] = getNewCoords(
                    p5,
                    randWalkTarget[0],
                    randWalkTarget[1],
                    movement / 3
                );
                addCircle(p5, xPos, yPos);
                randWalkTimer -= 1;
            } else {
                // gen a new target
                randWalkTarget = getRandomCoord(p5, xPos, yPos);
                randWalkTimer = 400;
            }
        } else {
            // Manual mode
            const mousehasMoved =
                JSON.stringify([Math.round(mouseX), Math.round(mouseY)]) !==
                JSON.stringify([
                    Math.round(ogMousePos[0]),
                    Math.round(ogMousePos[1]),
                ]);
            if (mousehasMoved) {
                snakeLength = 100;
                [xPos, yPos] = getNewCoords(p5, mouseX, mouseY, movement);
                addCircle(p5, xPos, yPos);
            }
        }

        p5.clear();
        for (const [index, circle] of circles.entries()) {
            const width = (circles.length - index) / 2.5;
            p5.fill(circle[2], 100, 100);
            p5.ellipse(
                circle[0],
                circle[1],
                ellipseWidth - width,
                ellipseWidth - width
            );
        }
    };

    return <Sketch setup={setup} draw={draw} />;
}

export default Snake;
