(function () {
  class Graphic {
    constructor(spec) {
      Object.assign(this, spec);
      if (!this.hasOwnProperty(rotation)) {
        this.rotation = 0;
      }
      if (!this.hasOwnProperty(scale)) {
        this.scale = 1.0;
      }
    }

    rotate(angle) {
      this.spec.rotation += angle;
    }
  }

  Game.Graphic = Graphic;
})();
