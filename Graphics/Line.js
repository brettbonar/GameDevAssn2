class Line extends Graphic {
  constructor(spec) {
    super(spec);
  }

  draw(context) {
    context.save();
    context.translate(this.center.x, this.center.y);
    context.rotate(this.rotation);
    context.translate(-this.center.x, -this.center.y);

    context.beginPath();

    this.lines.forEach(function (line) {
      context.moveTo(line[0].point.x, line[0].point.y);
      line.forEach(function (point) {
        // TODO: problem with doing first point twice?
        context.lineTo(point.x, point.y);
      })
    });

    context.closePath();

    context.fillStyle = this.fillStyle;
    context.fill();
    context.strokeStyle = this.strokeStyle;
    context.stroke();

    context.restore();
  }
}
