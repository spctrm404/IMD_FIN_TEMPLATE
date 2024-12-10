class Wind {
  constructor(
    speed = 0.1,
    scale = 1000,
    frequency = 1,
    amplitude = 1,
    octaves = 4
  ) {
    this.speed = speed;
    this.scale = scale;
    this.frequency = frequency;
    this.amplitude = amplitude;
    this.octaves = octaves;
  }

  getValue(x, y) {
    let value = 0;
    let aFrequency = this.frequency;
    let anAmplitude = this.amplitude;
    for (let i = 0; i < this.octaves; i++) {
      value += Math.abs(
        noise((x / this.scale) * aFrequency, (y / this.scale) * aFrequency) *
          anAmplitude
      );
      aFrequency *= 2;
      anAmplitude *= 0.5;
    }
    return value;
  }

  getVector(x, y) {
    const value = this.getValue(x, y);
    const vector = createVector(1, 0);
    vector.rotate(2 * Math.PI * value);
    vector.mult(this.speed);
    return vector;
  }
}
