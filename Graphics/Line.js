(function () {
  class Line extends Game.Graphic {
    constructor(spec) {
      super(spec);
    }

    static drawLine(context, line) {
      context.moveTo(line[0].x, line[0].y);
      line.forEach(function (point) {
        // TODO: problem with doing first point twice?
        context.lineTo(point.x, point.y);
      });
    }

    static draw(context, params) {
      context.save();
      // context.translate(params.center.x, params.center.y);
      // context.rotate(params.rotation);
      // context.translate(-params.center.x, -params.center.y);

      context.beginPath();

      if (params.lines) {
        params.lines.forEach(function (line) {
          Line.drawLine(context, line);
        });
      } else if (params.line) {
        Line.drawLine(context, params.line);
      }

      context.closePath();

      context.fillStyle = params.fillStyle;
      context.fill();
      context.strokeStyle = params.strokeStyle;
      context.stroke();

      context.restore();
    }

    render(context) {
      Line.drawLine(context, this);
    }
  }

  Game.Line = Line;
})();
