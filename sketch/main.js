const container = document.body.querySelector('.container-canvas');

function setup() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  createCanvas(containerW, containerH).parent(container);
}

function reset() {}

function drawing() {
  background('black');
  circle(mouseX, mouseY, 50);
}

function draw() {
  drawing();
}

function windowResized() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  resizeCanvas(containerW, containerH);
  drawing();
}
