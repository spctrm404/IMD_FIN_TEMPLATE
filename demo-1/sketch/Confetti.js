class Confetti {
  constructor(pos, num, colors) {
    this.particles = [];
    for (let n = 0; n < num; n++) {
      const size = { w: 4, h: 8 };
      const randomColor = colors[Math.floor(random(colors.length))];
      const randomAngle = random(2 * Math.PI);
      const randomSpeed = random(10, 20);
      const randomDir = random(2 * Math.PI);
      const randomVel = {
        x: cos(randomDir) * randomSpeed,
        y: sin(randomDir) * randomSpeed,
      };
      const randomAngleVel = radians(random(-5, 5));
      this.particles.push(
        new Particle(
          pos,
          size,
          randomColor,
          randomAngle,
          randomVel,
          randomAngleVel
        )
      );
    }
  }

  update(gravity, friction) {
    for (let idx = this.particles.length - 1; idx >= 0; idx--) {
      this.particles[idx].update(gravity, friction);
      if (this.particles[idx].isDead()) {
        this.particles.splice(idx, 1);
      }
    }
  }

  render() {
    this.particles.forEach((aParticle) => {
      aParticle.render();
    });
  }

  isDead() {
    return this.particles.length === 0;
  }
}
