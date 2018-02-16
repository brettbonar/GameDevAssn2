Game.Player = (function () {
  const DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
  };

  class Player {
    constructor(settings) {
      Object.assign(this, settings);
      var loaded = false;
      this.playerRight = new Image();
      this.playerRight.src = "Assets/player-right.png";
      this.playerLeft = new Image();
      this.playerLeft.src = "Assets/player-left.png";
      this.playerFront = new Image();
      this.playerFront.src = "Assets/player-front.png";
      this.playerBack = new Image();
      this.playerBack.src = "Assets/player-back.png";
      this.direction = DIRECTION.RIGHT;
    }

    render(context) {
      let img;
      if (this.direction === DIRECTION.UP) {
        img = this.playerBack;
      } else if (this.direction === DIRECTION.DOWN) {
        img = this.playerFront;
      } else if (this.direction === DIRECTION.LEFT) {
        img = this.playerLeft;
      } else if (this.direction === DIRECTION.RIGHT) {
        img = this.playerRight;
      }
      
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

    static get DIRECTION() { return DIRECTION; }
  }

  return Player;
})();
