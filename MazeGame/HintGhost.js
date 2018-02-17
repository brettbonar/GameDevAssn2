Game.HintGhost = (function () {
  Graphics.ImageCache.put("player-ghost-right", "Assets/player-ghost-right.png");
  Graphics.ImageCache.put("player-ghost-left", "Assets/player-ghost-left.png");
  Graphics.ImageCache.put("player-ghost-front", "Assets/player-ghost-front.png");
  Graphics.ImageCache.put("player-ghost-back", "Assets/player-ghost-back.png");

  class HintGhost extends Game.Character {
    constructor(settings) {
      super(settings, "player-ghost");
      this.right = Graphics.ImageCache.get("player-ghost-right");
      this.left = Graphics.ImageCache.get("player-ghost-left");
      this.front = Graphics.ImageCache.get("player-ghost-front");
      this.back = Graphics.ImageCache.get("player-ghost-back");

      this.length = this.directions.length - 1;
      this.duration = 1000;
      this.currentTime = 0;
      this.globalTime = 0;
      this.direction = this.directions.shift().action;
      this.target = this.directions.shift();
      this.targetPosition = this.getAbsolutePosition(this.target.cell.position);
      this.startPosition = this.getAbsolutePosition(this.position);
      this.position = this.getAbsolutePosition(this.position);
    }

    update(elapsedTime) {
      this.currentTime += elapsedTime;
      this.globalTime += elapsedTime;
      this.position.y = this.startPosition.y + (this.targetPosition.y - this.startPosition.y) * Math.min(this.currentTime / this.duration, 1);
      this.position.x = this.startPosition.x + (this.targetPosition.x - this.startPosition.x) * Math.min(this.currentTime / this.duration, 1);

      if (this.currentTime >= 2000) {
        this.done = true;
      }
      
      if (this.directions.length > 0 && this.position.y === this.targetPosition.y && this.position.x === this.targetPosition.x) {
        this.direction = this.target.action;
        this.target = this.directions.shift();
        this.targetPosition = this.getAbsolutePosition(this.target.cell.position);
        this.startPosition = Object.assign({}, this.position);
        this.currentTime = 0;
      }
    }

    render(context) {
      context.save();

      context.globalAlpha = Math.max((this.duration * this.length - this.globalTime) / (this.duration * this.length), 0);
      
      let img;
      if (this.direction === Game.DIRECTION.UP) {
        img = this.back;
      } else if (this.direction === Game.DIRECTION.DOWN) {
        img = this.front;
      } else if (this.direction === Game.DIRECTION.LEFT) {
        img = this.left;
      } else if (this.direction === Game.DIRECTION.RIGHT) {
        img = this.right;
      }
      
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * img.height / img.width;

      context.drawImage(img, this.position.x, this.position.y, imgWidth, imgHeight);

      context.restore();
    }

    // render() {
    //   let img;
    //   if (this.direction === Game.DIRECTION.UP) {
    //     img = this.back;
    //   } else if (this.direction === Game.DIRECTION.DOWN) {
    //     img = this.front;
    //   } else if (this.direction === Game.DIRECTION.LEFT) {
    //     img = this.left;
    //   } else if (this.direction === Game.DIRECTION.RIGHT) {
    //     img = this.right;
    //   }
      
    //   let imgWidth = this.mazeSettings.cellSize / 2;
    //   let imgHeight = imgWidth * img.height / img.width;
    //   let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
    //   let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
    //   let x = this.currentCell.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
    //   let y = this.currentCell.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

    //   this.context.drawImage(img, x, y, imgWidth, imgHeight);
    // }

    // update(elapsedTime) {
    //   this.currentTime += elapsedTime;
    //   if (!this.done && this.currentTime >= this.moveTime) {
    //     if (this.directions.length === 0) {
    //       this.done = true;
    //       this.canvasGroup.removeChild(this.canvas);
    //     } else {
    //       this.currentTime -= this.moveTime;
    //       super.move(this.directions.shift().action);
    //     }
    //   }
    // }
  }

  return HintGhost;
})();
