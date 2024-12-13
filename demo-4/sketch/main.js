const aspectW = 4;
const aspectH = 3;
const container = document.body.querySelector('.container-canvas');

function setup() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  if (aspectW === 0 || aspectH === 0) {
    canvas = createCanvas(containerW, containerH);
    canvas.parent(container);
  } else if (containerW / containerH > aspectW / aspectH) {
    canvas = createCanvas((containerH * aspectW) / aspectH, containerH);
    canvas.parent(container);
  } else {
    canvas = createCanvas(containerW, (containerW * aspectH) / aspectW);
    canvas.parent(container);
  }

  init();
}

function concavePolygon(nGon, rad) {
  if (nGon < 3) return;
  const vertices = [];
  for (let n = -1; n < nGon; n++) {
    const x = n === -1 ? 0 : Math.cos(((2 * Math.PI) / nGon) * n) * rad;
    const y = n === -1 ? 0 : Math.sin(((2 * Math.PI) / nGon) * n) * rad;
    vertices.push({ x: x, y: y });
  }
  return vertices;
}

function starPolygon(nGon, outerRad, innerRad) {
  if (nGon < 3) return;
  const vertices = [];
  for (let n = 0; n < nGon * 2; n++) {
    let x, y;
    if (n % 2 === 0) {
      x = Math.cos((Math.PI / nGon) * n) * outerRad;
      y = Math.sin((Math.PI / nGon) * n) * outerRad;
    } else {
      x = Math.cos((Math.PI / nGon) * n) * innerRad;
      y = Math.sin((Math.PI / nGon) * n) * innerRad;
    }
    vertices.push({ x: x, y: y });
  }
  return vertices;
}

let canvas;
const {
  Body,
  Bodies,
  Common,
  Composite,
  Composites,
  Engine,
  Mouse,
  MouseConstraint,
  Runner,
  Vector,
} = Matter;
let engine, world;
let runner;
let stack;
const thickness = 500;
let walls;
let mouse, mouseConstraint;

function init() {
  Common.setDecomp(decomp);
  engine = Engine.create();
  world = engine.world;

  runner = Runner.create();
  Runner.run(runner, engine);

  const radius = 50,
    innerRadius = 30,
    columns = 4,
    rows = 4,
    columnGap = 4,
    rowGap = 4;
  const x =
    width * 0.5 - (columns - 1) * radius - (columns - 1) * 0.5 * columnGap;
  const y = height * 0.5 - (rows - 1) * radius - (rows - 1) * 0.5 * rowGap;
  stack = Composites.stack(x, y, columns, rows, columnGap, rowGap, (x, y) => {
    // return Bodies.circle(x, y, radius);
    // const randomConcave = concavePolygon(Math.floor(random(3, 6 + 1)), radius);
    // const randomConcave = concavePolygon(4, radius);
    // return Bodies.fromVertices(x, y, randomConcave);
    const star = starPolygon(5, radius, innerRadius);
    return Bodies.fromVertices(x, y, star);
  });
  Composite.add(world, stack);
  console.log(stack);

  walls = [
    Bodies.rectangle(width * 0.5, 0 - thickness * 0.5, 10000, thickness, {
      isStatic: true,
    }),
    Bodies.rectangle(width + thickness * 0.5, height * 0.5, thickness, 10000, {
      isStatic: true,
    }),
    Bodies.rectangle(width * 0.5, height + thickness * 0.5, 10000, thickness, {
      isStatic: true,
    }),
    Bodies.rectangle(0 - thickness * 0.5, height * 0.5, thickness, 10000, {
      isStatic: true,
    }),
  ];
  Composite.add(world, walls);

  mouse = Mouse.create(canvas.elt);
  mouse.pixelRatio = pixelDensity();
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });
  Composite.add(world, mouseConstraint);
}

function resize() {
  Body.setPosition(walls[0], Vector.create(width * 0.5, 0 - thickness * 0.5));
  Body.setPosition(
    walls[1],
    Vector.create(width + thickness * 0.5, height * 0.5)
  );
  Body.setPosition(
    walls[2],
    Vector.create(width * 0.5, height + thickness * 0.5)
  );
  Body.setPosition(walls[3], Vector.create(0 - thickness * 0.5, height * 0.5));
}

function draw() {
  background('white');

  noFill();
  stroke('black');

  stack.bodies.forEach((aBody) => {
    aBody.parts.forEach((aPart, idx) => {
      fill((255 * idx) / (aBody.parts.length - 1), 0, 255, 64);
      if (idx !== 0) {
        beginShape();
        aPart.vertices.forEach((aVertex) => {
          vertex(aVertex.x, aVertex.y);
        });
        endShape(CLOSE);
      }
    });
  });
}

function windowResized() {
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  if (aspectW === 0 || aspectH === 0) {
    resizeCanvas(containerW, containerH);
  } else if (containerW / containerH > aspectW / aspectH) {
    resizeCanvas((containerH * aspectW) / aspectH, containerH);
  } else {
    resizeCanvas(containerW, (containerW * aspectH) / aspectW);
  }

  resize();
}
