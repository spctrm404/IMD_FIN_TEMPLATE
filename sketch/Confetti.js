class Confetti {
  constructor(pos, force, num) {
    this.particles = [];
    for (let n = 0; n < num; n++) {
      this.particles.push(new Particle(pos, { w: 4, h: 8 }));
    }
  }

  update(gravity) {
    this.acc.x += gravity.x;
    this.acc.y += gravity.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.acc.x = 0;
    this.acc.y = 0;

    this.angle += this.angleVel;
  }

  render() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    noStroke();
    fill(this.col);
    rect(this.size.w * -0.5, this.size.h * -0.5, this.size.w, this.size.h);
    pop();
  }
}
