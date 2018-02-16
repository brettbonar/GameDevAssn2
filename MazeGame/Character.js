Game.Character = (function () {
  class Character {
    constructor(settings, type) {
      Object.assign(this, settings);
      this.type = type;
      this.direction = this.direction || Game.DIRECTION.RIGHT;
    }

    getAbsolutePosition(position) {
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * this.front.height / this.front.width;
      let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
      let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
      let x = position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;
      return {
        x: x,
        y: y
      };
    }

    getBoundingBox() {
      let width = this.mazeSettings.cellSize / 2;
      let height = width;

      let offsetx = (this.mazeSettings.cellSize - width) / 2;
      let offsety = (this.mazeSettings.cellSize - height) / 4;
      let x = this.currentCell.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = this.currentCell.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

      let ul = { x: x, y: y };
      let ur = { x: x + width, y: y };
      let lr = { x: x + width, y: y + height };
      let ll = { x: x, y: y + height };

      return [[ul, ur], [ur, lr], [lr, ll], [ll, ul]];      
    }

    render(context) {
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
      let pos = this.getAbsolutePosition(this.currentCell.position);

      context.drawImage(img, pos.x, pos.y, imgWidth, imgHeight);
      // Game.Circle.draw(context, {
      //   x: this.position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
      //   y: this.position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y,
      //   r: this.mazeSettings.cellSize / 4
      // });
    }

    move(direction) {
      this.currentCell = this.currentCell.neighbors[direction].cell;
      switch (direction) {
        case "up":
          this.direction = Game.DIRECTION.UP;
          break;
        case "down":
          this.direction = Game.DIRECTION.DOWN;
          break;
        case "left":
          this.direction = Game.DIRECTION.LEFT;
          break;
        case "right":
          this.direction = Game.DIRECTION.RIGHT;
          break;
      }
    }
  }

  return Character;
})();
