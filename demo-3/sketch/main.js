// 종횡비를 고정하고 싶을 경우: 아래 두 변수를 0이 아닌 원하는 종, 횡 비율값으로 설정.
// 종횡비를 고정하고 싶지 않을 경우: 아래 두 변수 중 어느 하나라도 0으로 설정.
const aspectW = 0;
const aspectH = 0;
// html에서 클래스명이 container-canvas인 첫 엘리먼트: 컨테이너 가져오기.
const container = document.body.querySelector('.container-canvas');
// 필요에 따라 이하에 변수 생성.

let handPose;
let video;
const videoW = 640;
const videoH = 480;
let hands = [];

const {
  Engine,
  Body,
  Bodies,
  Composite,
  Composites,
  Mouse,
  MouseConstraint,
  Vector,
} = Matter;

let engine, world;
let stack;
let walls;
const wallThickness = 500;
let canvas;
let mouse, mouseConstraint;
let handBody;

function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function videoScale() {
  return width / height > videoW / videoH ? width / videoW : height / videoH;
}

function preload() {
  handPose = ml5.handPose({
    maxHands: 6,
    flipped: true,
  });
}

function setup() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  if (aspectW === 0 || aspectH === 0) {
    canvas = createCanvas(containerW, containerH);
    canvas.parent(container);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else if (containerW / containerH > aspectW / aspectH) {
    canvas = createCanvas((containerH * aspectW) / aspectH, containerH);
    canvas.parent(container);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else {
    canvas = createCanvas(containerW, (containerW * aspectH) / aspectW);
    canvas.parent(container);
  }
  init();
  // createCanvas를 제외한 나머지 구문을 여기 혹은 init()에 작성.
  video = createCapture(VIDEO, { flipped: true });
  video.size(videoW, videoH);
  video.hide();
  // start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  engine = Engine.create();
  world = engine.world;
  stack = Composites.pyramid(
    width * 0.5 - 40 * 15 * 0.5,
    height - 10 * 40,
    15,
    10,
    0,
    0,
    function (x, y) {
      return Bodies.rectangle(x, y, 40, 40);
    }
  );
  Composite.add(world, [stack]);
  walls = [
    Bodies.rectangle(width * 0.5, -0.5 * wallThickness, 10000, wallThickness, {
      isStatic: true,
    }),
    Bodies.rectangle(
      width + 0.5 * wallThickness,
      height * 0.5,
      wallThickness,
      10000,
      { isStatic: true }
    ),
    Bodies.rectangle(
      width * 0.5,
      height + 0.5 * wallThickness,
      10000,
      wallThickness,
      { isStatic: true }
    ),
    Bodies.rectangle(-0.5 * wallThickness, height * 0.5, wallThickness, 10000, {
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
  console.log(stack);
  console.log(walls);

  handBody = Bodies.circle(-10000, -10000, 30);
  Composite.add(world, handBody);
  console.log(handBody);
}

// windowResized()에서 setup()에 준하는 구문을 실행해야할 경우를 대비해 init이라는 명칭의 함수를 만들어 둠.
function init() {}

function draw() {
  Engine.update(engine);
  let currentVideoScale = 0;
  const currentVideoZero = { x: 0, y: 0 };
  if (video) {
    currentVideoScale = videoScale();
    currentVideoZero.x = (width - video.width * videoScale()) * 0.5;
    currentVideoZero.y = (height - video.height * videoScale()) * 0.5;
  }
  background(0);
  image(
    video,
    currentVideoZero.x,
    currentVideoZero.y,
    video.width * currentVideoScale,
    video.height * currentVideoScale
  );
  if (hands.length > 0) {
    Body.setPosition(
      handBody,
      Vector.create(
        currentVideoZero.x + hands[0].keypoints[8].x * currentVideoScale,
        currentVideoZero.y + hands[0].keypoints[8].y * currentVideoScale
      )
    );
  }
  // else {
  //   Body.setPosition(handBody, Vector.create(-10000, -10000));
  // }
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(
        currentVideoZero.x + keypoint.x * currentVideoScale,
        currentVideoZero.y + keypoint.y * currentVideoScale,
        10
      );
    }
  }

  noFill();
  stroke(255);
  stack.bodies.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
  walls.forEach((aBody) => {
    beginShape();
    aBody.vertices.forEach((aVertex) => {
      vertex(aVertex.x, aVertex.y);
    });
    endShape(CLOSE);
  });
  stroke(255, 0, 0);
  beginShape();
  handBody.vertices.forEach((aVertex) => {
    vertex(aVertex.x, aVertex.y);
  });
  endShape(CLOSE);
}

function windowResized() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스 크기를 조정.
  if (aspectW === 0 || aspectH === 0) {
    resizeCanvas(containerW, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else if (containerW / containerH > aspectW / aspectH) {
    resizeCanvas((containerH * aspectW) / aspectH, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else {
    resizeCanvas(containerW, (containerW * aspectH) / aspectW);
  }
  // 위 과정을 통해 캔버스 크기가 조정된 경우, 다시 처음부터 그려야할 수도 있다.
  // 이런 경우 setup()의 일부 구문을 init()에 작성해서 여기서 실행하는게 편리하다.
  init();
  Body.setPosition(walls[0], Vector.create(width * 0.5, -0.5 * wallThickness));
  Body.setPosition(
    walls[1],
    Vector.create(width + 0.5 * wallThickness, height * 0.5)
  );
  Body.setPosition(
    walls[2],
    Vector.create(width * 0.5, height + 0.5 * wallThickness)
  );
  Body.setPosition(walls[3], Vector.create(-0.5 * wallThickness, height * 0.5));
}
