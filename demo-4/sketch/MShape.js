class MShape {
  constructor(body) {
    const { angle, anglePrev, position, positionPrev, parts: _parts } = body;
    this.body = body;
    this.angle = angle;
    this.anglePrev = anglePrev;
    this.position = position;
    this.positionPrev = positionPrev;

    let [convexHull, ...parts] = _parts.map(({ vertices }) =>
      vertices.map(({ x, y }) => [x, y])
    );
    console.log('convexHull', convexHull);
    console.log('parts', parts);
    this.shape = MShape.restoreConcave(parts).regions;
    this.shape.forEach((aPath) => {
      aPath.forEach((aPoint) => {
        aPoint[0] = aPoint[0] - this.position.x;
        aPoint[1] = aPoint[1] - this.position.y;
      });
    });
    console.log(this.shape);
  }

  render() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.body.parts[0].angle);
    beginShape();
    this.shape.forEach((aPath) => {
      aPath.forEach((aPoint) => {
        vertex(aPoint[0], aPoint[1]);
      });
    });
    endShape(CLOSE);
    pop();
  }

  static restoreConcave(parts) {
    const [part0, ...rest] = parts;
    if (!rest) return part0;
    const polyA = {
      regions: [part0],
      inverted: false,
    };
    const polyB = {
      regions: rest,
      inverted: false,
    };
    return PolyBool.union(polyA, polyB);
  }
}
