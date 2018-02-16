Game.Character = (function () {
  const DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
  };

  class Character {
    constructor(settings) {
      Object.assign(this, settings);
      this.monsterRight = new Image();
      this.monsterRight.src = "Assets/monster-right.png";
      this.monsterLeft = new Image();
      this.monsterLeft.src = "Assets/monster-left.png";
      this.monsterFront = new Image();
      this.monsterFront.src = "Assets/monster-front.png";
      this.monsterBack = new Image();
      this.monsterBack.src = "Assets/monster-back.png";
      this.direction = DIRECTION.RIGHT;

      this.moveTime = 1000;
      this.time = 0;
    }

    getBoundingBox() {
      
    }

    move() {
      let neighbors = Object.values(this.currentCell.neighbors).filter((neighbor) => neighbor.connected);
      let nextIndex = Math.floor(Math.random() * neighbors.length);
      let nextCell = neighbors[nextIndex].cell;
      let direction = neighbors[nextIndex].location;
      this.currentCell = nextCell;
      switch (direction) {
        case "up":
          this.direction = DIRECTION.UP;
          break;
        case "down":
          this.direction = DIRECTION.DOWN;
          break;
        case "left":
          this.direction = DIRECTION.LEFT;
          break;
        case "right":
          this.direction = DIRECTION.RIGHT;
          break;
      }
    }

    update(elapsedTime) {
      this.time += elapsedTime;
      if (this.time >= this.moveTime) {
        this.time -= this.moveTime;
        this.move();
      }
    }

    render(context) {
      let img;
      if (this.direction === DIRECTION.UP) {
        img = this.monsterBack;
      } else if (this.direction === DIRECTION.DOWN) {
        img = this.monsterFront;
      } else if (this.direction === DIRECTION.LEFT) {
        img = this.monsterLeft;
      } else if (this.direction === DIRECTION.RIGHT) {
        img = this.monsterRight;
      }
      
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * img.height / img.width;
      let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
      let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
      let x = this.currentCell.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = this.currentCell.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

      context.drawImage(img, x, y, imgWidth, imgHeight);
      // Game.Circle.draw(context, {
      //   x: this.position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
      //   y: this.position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y,
      //   r: this.mazeSettings.cellSize / 4
      // });
    }

    static get DIRECTION() { return DIRECTION; }
  }

  return Character;
})();
