(function () {
  class Image extends Game.Graphic {
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
      
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * this.img.height / this.img.width;
      let offsetx = (this.mazeSettings.cellSize - imgWidth) / 3;
      let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
      let x = this.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = this.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;
      context.drawImage(this.img, x, y, imgWidth, imgHeight);

      context.restore();
    }

    render(context) {
      Line.drawLine(context, this);
    }
  }

  Game.Image = Image;
})();
