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

const concavePolygon = (nGon, rad) => {
  if (nGon < 3) return;
  const vertices = [];
  for (let n = -1; n < nGon; n++) {
    const x = n === -1 ? 0 : Math.cos(((2 * Math.PI) / nGon) * n) * rad;
    const y = n === -1 ? 0 : Math.sin(((2 * Math.PI) / nGon) * n) * rad;
    vertices.push({ x: x, y: y });
  }
  return vertices;
};

const starPolygon = (nGon, outerRad, innerRad) => {
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
};

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
  Svg,
  Vector,
  Vertices,
} = Matter;
let engine, world;
let runner;
const thickness = 500;
let walls;
let mouse, mouseConstraint;

let stack;
let matterShapes = [];
const svgPaths = [
  './svg/iconmonstr-puzzle-icon.svg',
  './svg/iconmonstr-check-mark-8-icon.svg',
  './svg/iconmonstr-direction-4-icon.svg',
  './svg/iconmonstr-paperclip-2-icon.svg',
  './svg/iconmonstr-user-icon.svg',
  // './svg/svg.svg',
];

const select = (root, selector) => {
  return Array.prototype.slice.call(root.querySelectorAll(selector));
};

const loadSvg = async (url) => {
  const response = await fetch(url);
  const raw = await response.text();
  return new window.DOMParser().parseFromString(raw, 'image/svg+xml');
};

const init = () => {
  Common.setDecomp(decomp);
  engine = Engine.create();
  world = engine.world;

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
  console.log('walls', walls);
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
    // const randomConcave = concavePolygon(4, radius);
    const randomConcave = starPolygon(5, radius, innerRadius);
    return Bodies.fromVertices(x, y, randomConcave);
  });
  console.log('stack', stack);
  Composite.add(world, stack);

  matterShapes.push(new MatterShape(stack.bodies[0]));

  svgPaths.forEach((aSvgPath, svgPathIdx) => {
    loadSvg(aSvgPath).then((root) => {
      const vertices = select(root, 'path').map((aPath) => {
        return Vertices.scale(Svg.pathToVertices(aPath, 15), 0.5, 0.5);
      });
      const body = Bodies.fromVertices(
        200 + svgPathIdx * 200,
        200 + svgPathIdx * 0,
        vertices,
        {
          render: {
            lineWidth: 1,
          },
        },
        true
      );
      Composite.add(world, body);

      // matterShapes.push(new MatterShape(body));
    });
  });

  runner = Runner.create();
  Runner.run(runner, engine);
};

const resize = () => {
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
};

function draw() {
  background('white');

  noFill();
  stroke('black');
  stack.bodies.forEach((aBody) => {
    aBody.parts.forEach((aPart, idx) => {
      if (idx !== 0) {
        beginShape();
        aPart.vertices.forEach((aVertex) => {
          vertex(aVertex.x, aVertex.y);
        });
        endShape(CLOSE);
      }
    });
  });

  stroke('red');
  matterShapes.forEach((aMatterShape) => {
    aMatterShape.renderHull();
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
