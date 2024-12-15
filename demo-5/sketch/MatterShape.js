class MatterShape {
  constructor(body) {
    this.body = body;
    let [, ...parts] = this.body.parts.map(({ vertices }) =>
      vertices.map(({ x, y }) => [x, y])
    );
    this.shape = MatterShape.restoreConcave(parts).regions;
    console.log('PolyBool', this.shape);
    this.shape.forEach((aPath) => {
      aPath.forEach((aPoint) => {
        aPoint[0] = aPoint[0] - this.body.position.x;
        aPoint[1] = aPoint[1] - this.body.position.y;
      });
    });
    console.log('MatterShape', this.shape);
  }

  render() {
    push();
    translate(this.body.position.x, this.body.position.y);
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
    const [first, ...rest] = parts;
    const firstPolygon = {
      regions: [first],
      inverted: false,
    };
    let segments = PolyBool.segments(firstPolygon);
    if (!rest) return PolyBool.polygon(segments);
    for (let idx = 0; idx < rest.length; idx++) {
      const aRestPolygon = {
        regions: [rest[idx]],
        inverted: false,
      };
      const aRest = PolyBool.segments(aRestPolygon);
      const combine = PolyBool.combine(segments, aRest);
      segments = PolyBool.selectUnion(combine);
    }
    return PolyBool.polygon(segments);
  }

  // static restoreConcave(parts) {
  //   const [part0, ...rest] = parts;
  //   if (!rest) return part0;
  //   const polyA = {
  //     regions: [part0],
  //     inverted: false,
  //   };
  //   const polyB = {
  //     regions: rest,
  //     inverted: false,
  //   };
  //   return PolyBool.union(polyA, polyB);
  // }
}
