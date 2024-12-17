class MatterShape {
  constructor(body) {
    this.body = body;
    const [convexHull, ...parts] = this.body.parts;
    this.uniqueEdges = MatterShape.extractUniqueEdges(convexHull, parts);
    console.log('this.uniqueEdges', this.uniqueEdges);
  }

  renderHull() {
    for (let idx = 0; idx < this.uniqueEdges.length; idx++) {
      // const begin = this.uniqueEdges[idx].begin;
      // const end = this.uniqueEdges[idx].end;
      const { begin, end } = this.uniqueEdges[idx];
      stroke(255, 0, 0);
      line(begin.x, begin.y, end.x, end.y);
    }
  }

  rederParts() {
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    beginShape();
    this.shape.forEach((aPath) => {
      aPath.forEach((aPoint) => {
        vertex(aPoint[0], aPoint[1]);
      });
    });
    endShape(CLOSE);
    pop();
  }

  static arePointsEqual(pointA, pointB) {
    return pointA.x === pointB.x && pointA.y === pointB.y;
  }

  static areEdgesEqual(edgeA, edgeB) {
    return (
      (MatterShape.arePointsEqual(edgeA.begin, edgeB.begin) &&
        MatterShape.arePointsEqual(edgeA.end, edgeB.end)) ||
      (MatterShape.arePointsEqual(edgeA.begin, edgeB.end) &&
        MatterShape.arePointsEqual(edgeA.end, edgeB.begin))
    );
  }

  static extractUniqueEdges(convexHull, parts) {
    const uniqueEdges = [];
    parts.forEach((aPart) => {
      for (let pointIdx = 0; pointIdx < aPart.vertices.length; pointIdx++) {
        const current = aPart.vertices[pointIdx];
        const next = aPart.vertices[(pointIdx + 1) % aPart.vertices.length];
        const newEdge = { begin: current, end: next };
        let areEqual = false;
        for (let edgeIdx = 0; edgeIdx < uniqueEdges.length; edgeIdx++) {
          areEqual = MatterShape.areEdgesEqual(uniqueEdges[edgeIdx], newEdge);
          if (areEqual) {
            uniqueEdges.splice(edgeIdx, 1);
            break;
          }
        }
        if (!areEqual) uniqueEdges.push(newEdge);
      }
    });
    return uniqueEdges;
  }
}
