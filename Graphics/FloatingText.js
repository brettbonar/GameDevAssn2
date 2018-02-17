Graphics.FloatingText = (function () {
  class FloatingText extends Graphics.Text {
    constructor(spec) {
      super(spec);
      this.currentTime = 0;
      this.fillStyle = spec.fillStyle || "gold";
      this.textAlign = "center";
    }

    update(elapsedTime) {
      this.currentTime += elapsedTime;
      this.y = this.start.y + (this.end.y - this.start.y) * Math.min(this.currentTime / this.duration, 1);
      this.x = this.start.x + (this.end.x - this.start.x) * Math.min(this.currentTime / this.duration, 1);


      if (this.y === this.end.y && this.x === this.end.x) {
        this.done = true;
      }
    }

    render(context) {
      context.save();

      context.globalAlpha = Math.max((this.duration - this.currentTime) / this.duration, 0);
      super.render(context);

      context.restore();
    }
  }

  return FloatingText;
})();
