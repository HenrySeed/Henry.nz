let xPos;
let yPos;

let c = 0;

const movement = 1;
const ellipseWidth = 90;
let rainbowRaising = true;

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketchHolder");
  loop();

  colorMode(HSB);

  noStroke();
  fill(66, 245, 215);

  xPos = width / 2;
  yPos = height / 2;
}

function draw() {
  const totChange = sqrt((mouseX - xPos) ** 2 + (mouseY - yPos) ** 2);

  const xChange = (mouseX - xPos) / totChange;
  const yChange = (mouseY - yPos) / totChange;

  xPos += xChange * movement;
  yPos += yChange * movement;

  if (abs(xChange * movement) + abs(yChange * movement) > 1) {
    if (rainbowRaising) {
      if (c >= 255) rainbowRaising = false;
      else c += 0.5;
    } else {
      if (c <= 0) rainbowRaising = true;
      else c -= 0.5;
    }
  }
  fill(c, 255, 255);

  ellipse(xPos, yPos, ellipseWidth, ellipseWidth);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  xPos = windowWidth / 2;
  yPos = windowHeight / 2;
}
