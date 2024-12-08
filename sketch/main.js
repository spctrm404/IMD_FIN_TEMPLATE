const canvasContainer = document.body.querySelector('.container-canvas');

function setup() {
  createCanvas(600, 600).parent(canvasContainer);
}

function draw() {
  background('black');
  circle(mouseX, mouseY, 50);
}
