import Sketch from "react-p5";
import p5Types from "p5"; //Import this for typechecking and intellisense
import dottedCircle from "../res/dottedCircle.svg";
import { useState } from "react";

const leafPalettes: {
    seed: () => number;
    values: (leafColor: number, height: number) => [number, number, number];
}[] = [
    // cherry blossom
    {
        seed: () => Math.random() * 10,
        values: (leafColor: number, height: number) => [
            leafColor,
            height * 10 + 40,
            80 * height + 20,
        ],
    },
    // Autumn
    {
        seed: () => Math.random() * 65,
        values: (leafColor: number, height: number) => [
            leafColor,
            height * 30 + 50,
            100 * height,
        ],
    },
    // Green
    {
        seed: () => Math.random() * 50 + 80,
        values: (leafColor: number, height: number) => [
            leafColor,
            height * 30 + 50,
            100 * height,
        ],
    },
];

let trees: Tree[] = [];
let palette = leafPalettes[Math.floor(Math.random() * leafPalettes.length)];

class Branch {
    angle: number;
    level: number;
    length: number;
    rootY: number;
    leafColor: number;
    kids: Branch[];

    public constructor(
        angle: number,
        level: number,
        length: number,
        rootY: number
    ) {
        this.angle = angle;
        this.level = level;
        this.length = length;
        this.rootY = rootY;
        this.leafColor = palette.seed();

        this.kids = [];

        const angleCalc = () => (Math.random() * Math.PI) / 5 + 0.1;

        if (level < 4) {
            this.kids.push(
                new Branch(
                    angleCalc(),
                    level + 1,
                    length * (Math.random() + 0.45),
                    rootY
                )
            );
            this.kids.push(
                new Branch(
                    -angleCalc(),
                    level + 1,
                    length * (Math.random() + 0.45),
                    rootY
                )
            );
        }
    }

    public draw(p5: p5Types, animPercent: number) {
        const strokeWeight =
            (10 - this.level) * 0.9 * ((this.rootY + 200) / p5.height);
        const lineLength = this.length * animPercent;

        const height = this.rootY / p5.height;
        p5.fill(...palette.values(this.leafColor, height));

        p5.strokeWeight(strokeWeight * 1.5);
        p5.push();
        if (this.kids.length === 0) {
            // draw a leaf
            p5.strokeWeight(0);
            p5.ellipse(0, 0, 20 * strokeWeight);
            p5.strokeWeight(strokeWeight);
        } else {
            // draw the next branch
            p5.rotate(this.angle);
            p5.line(0, 0, 0, -lineLength);
            p5.translate(0, -lineLength);
        }

        for (const branch of this.kids) {
            branch.draw(p5, animPercent);
        }
        p5.pop();
    }
}

class Tree {
    origin: { x: number; y: number };
    animPercent: number;
    trunk: Branch;
    created: number;

    public constructor(p5: p5Types, x: number, y: number) {
        this.origin = { x: x, y: y };
        this.animPercent = 0;
        this.created = Date.now();

        const height = this.origin.y / p5.height;
        this.trunk = new Branch(0, 1, height * 60 + 20, y);
    }

    public draw(p5: p5Types) {
        const height = this.origin.y / p5.height;

        p5.stroke(35, 63, height * 60);

        p5.push();
        p5.translate(this.origin.x, this.origin.y);

        this.trunk.draw(p5, this.animPercent);
        p5.pop();
        if (this.animPercent < 1) {
            this.animPercent += 0.2;
        }
    }
}

function Woods() {
    const [showCircle, setShowCircle] = useState(true);

    function updateListeners(p5: p5Types) {
        const resizeListener = () => {
            // only re-render if the width has changed or the height has changed more than 100px
            if (
                p5.width !== p5.windowWidth ||
                Math.abs(p5.height - p5.windowHeight) > 50
            ) {
                p5.resizeCanvas(p5.windowWidth, p5.windowHeight * 0.9);
            }
        };

        window.addEventListener("resize", resizeListener);
        window.addEventListener("orientationchange", resizeListener);

        return () => {
            window.removeEventListener("resize", resizeListener);
            window.removeEventListener("orientationchange", resizeListener);
        };
    }

    function mouseClicked(p5: p5Types) {
        setShowCircle(false);
        const tree = new Tree(p5, p5.mouseX, p5.mouseY);
        trees.push(tree);

        // if there are more than 40, delete the earliest
        if (trees.length > 40) {
            let earliest = 0;
            for (const [i, tree] of trees.entries()) {
                if (tree.created < trees[earliest].created) {
                    earliest = i;
                }
            }
            trees.splice(earliest, 1);
        }

        trees.sort((a, b) => a.origin.y - b.origin.y);
        p5.loop();
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        updateListeners(p5);

        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.9).parent(
            canvasParentRef
        );
        p5.colorMode("hsb");
        p5.strokeCap("square");
        p5.noLoop();

        p5.clear();
    };

    const draw = (p5: p5Types) => {
        p5.clear();

        let doneDrawing = true;
        for (const tree of trees) {
            if (tree.animPercent !== 1) {
                doneDrawing = false;
            }
            tree.draw(p5);
        }

        if (doneDrawing) {
            p5.noLoop();
        }
    };

    return (
        <div style={{ width: "100%" }}>
            {showCircle && (
                <>
                    <img
                        alt="DottedCircle"
                        src={dottedCircle}
                        style={{
                            position: "absolute",
                            top: "60vh",
                            left: "calc(50vw - 100px)",
                            display: "block",
                            width: "200px",
                        }}
                    />
                    <h3
                        style={{
                            position: "absolute",
                            top: "calc(60vh + 40px)",
                            width: "100%",
                            textAlign: "center",
                        }}
                    >
                        Wouldn't it be nice if we had a tree here?
                    </h3>
                </>
            )}
            <Sketch setup={setup} draw={draw} mouseClicked={mouseClicked} />
        </div>
    );
}

export default Woods;
