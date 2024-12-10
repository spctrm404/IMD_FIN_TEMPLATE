class Confetti {
  constructor(x, y, speed, colours) {
    const num = 300;
    const layerNum = 3;
    this.particles = [];
    for (let n = 0; n < num; n++) {
      const randomColour = colours[Math.floor(random(colours.length))];
      const randomA = random(2 * Math.PI);
      const newParticle = new Particle(x, y, 6, 8, randomA, randomColour);

      const layer = Math.floor(n / (num / layerNum)) + 1;
      const randomSpeed = (layer / layerNum) * speed * random(0.5, 1.5);
      const randomDir = random(2 * Math.PI);
      newParticle.setVel(
        cos(randomDir) * randomSpeed,
        sin(randomDir) * randomSpeed
      );

      const randomAVel = radians(random(-5, 5));
      newParticle.setAVel(randomAVel);

      this.particles.push(newParticle);
    }
  }

  update(gravity, wind, friction) {
    for (let idx = this.particles.length - 1; idx >= 0; idx--) {
      this.particles[idx].update(gravity, wind, friction);
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
