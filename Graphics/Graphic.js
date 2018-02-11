class Graphic {
  constructor(spec) {
    _.assign(this, spec);
    _.defaults(this, {
      rotation: 0,
      scale: 1.0
    });
  }

  rotate(angle) {
    this.spec.rotation += angle;
  }
}
