let xPos;
let yPos;

let c;

const movement = 1;
const ellipseWidth = 90;

let canvasActive = true;

let mousehasntMoved = true;
let ogMousePos;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketchHolder");
  loop();

  colorMode(HSB, 255);

  noStroke();
  fill(66, 245, 215);

  c = random(0, 255);

  xPos = width / 2;
  yPos = height / 2;

  ogMousePos = [mouseX, mouseY];
  console.log(ogMousePos);

  document.body.addEventListener("mouseleave", function(event) {
    canvasActive = false;
  });
  document.body.addEventListener("mouseenter", function(event) {
    canvasActive = true;
  });

  fill(c, 255, 255);
  ellipse(xPos, yPos, ellipseWidth, ellipseWidth);
}

function draw() {
  if (!canvasActive) {
    return;
  }
  if (mousehasntMoved) {
    if (JSON.stringify([mouseX, mouseY]) !== JSON.stringify(ogMousePos)) {
      mousehasntMoved = false;
    }
  }
  if (mousehasntMoved) {
    return;
  }
  const totChange = sqrt((mouseX - xPos) ** 2 + (mouseY - yPos) ** 2);

  const xChange = (mouseX - xPos) / totChange;
  const yChange = (mouseY - yPos) / totChange;

  xPos += xChange * movement;
  yPos += yChange * movement;

  if (abs(mouseX - xPos) + abs(mouseY - yPos) > 1) {
    if (c >= 255) c = 0;
    else c += 0.5;
  }
  fill(c, 255, 255);

  ellipse(xPos, yPos, ellipseWidth, ellipseWidth);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  xPos = windowWidth / 2;
  yPos = windowHeight / 2;
  clear();
}
