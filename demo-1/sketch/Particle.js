class Particle {
  constructor(x, y, w, h, a, colour) {
    this.pos = createVector(x, y);
    this.size = createVector(w, h);
    this.colour = colour;
    this.a = a;
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.aVel = 0;
  }

  setVel(x, y) {
    this.vel.set(x, y);
  }

  setAVel(aVel) {
    this.aVel = aVel;
  }

  update(gravity, wind, friction) {
    const windVector = wind.getVector(this.pos.x, this.pos.y);
    this.acc.add(windVector);
    this.acc.add(gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(1 - friction);

    this.a += this.aVel;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.a);
    noStroke();
    fill(this.colour);
    rect(this.size.x * -0.5, this.size.y * -0.5, this.size.x, this.size.y);
    pop();
  }

  isDead() {
    return this.pos.y > height + 50;
  }
}
