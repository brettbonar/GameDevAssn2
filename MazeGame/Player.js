Game.Player = (function () {
  class Player {
    constructor(settings) {
      Object.assign(this, settings);
      var loaded = false;
      this.playerRight = new Image();
      this.playerRight.src = "Assets/player-right.png";
      this.playerLeft = new Image();
      this.playerLeft.src = "Assets/player-left.png";
    }

    render(context) {
      let img = this.orientation === -1 ? this.playerLeft : this.playerRight;
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * img.height / img.width;
      let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
      let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
      let x = this.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = this.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

      context.drawImage(img, x, y, imgWidth, imgHeight);
      // Game.Circle.draw(context, {
      //   x: this.position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
      //   y: this.position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y,
      //   r: this.mazeSettings.cellSize / 4
      // });
    }
  }

  return Player;
})();
