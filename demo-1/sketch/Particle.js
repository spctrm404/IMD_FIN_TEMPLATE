class Particle {
  constructor(pos, size, col, angle, vel, angleVel) {
    this.pos = { x: pos.x, y: pos.y };
    this.size = { w: size.w, h: size.h };
    this.col = col;
    this.angle = angle;
    this.vel = { x: vel.x, y: vel.y };
    this.acc = { x: 0, y: 0 };
    this.angleVel = angleVel;
  }

  update(gravity, friction) {
    this.acc.x += gravity.x;
    this.acc.y += gravity.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    this.acc.x = 0;
    this.acc.y = 0;

    this.vel.x *= friction;
    this.vel.y *= friction;

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

  isDead() {
    return this.pos.y > height + 50;
  }
}
