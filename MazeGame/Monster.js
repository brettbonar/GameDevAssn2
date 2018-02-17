Game.Monster = (function () {
  let right = new Image();
  right.src = "Assets/monster-right.png";
  let left = new Image();
  left.src = "Assets/monster-left.png";
  let front = new Image();
  front.src = "Assets/monster-front.png";
  let back = new Image();
  back.src = "Assets/monster-back.png";
  let exclamation = new Image();
  exclamation.src = "Assets/exclamation.png";

  class Monster extends Game.Character {
    constructor(settings) {
      super(settings, "monster");
      this.moveTime = 1000;
      this.time = 0;
      this.right = right;
      this.front = front;
      this.left = left;
      this.back = back;
      this.chasing = false;
    }

    render(context) {
      super.render(context);

      // Show exclamation mark
      if (this.chasing) {
        let pos = this.getAbsolutePosition(this.currentCell.position);
        pos.y -= 35;
        pos.x += 10;

        let imgWidth = 6;
        let imgHeight = 24;

        context.drawImage(exclamation, pos.x, pos.y, imgWidth, imgHeight);
      }
    }

    playerInSight(playerCell) {
      let next = this.currentCell.neighbors[this.direction];
      while (next.connected) {
        if (next.cell === playerCell) {
          return true;
        }
        next = next.cell.neighbors[this.direction];
      }
      return false;
    }

    move(playerCell) {
      if (!this.chasing) {
        this.moveTime = 1000;
        let neighbors = Object.values(this.currentCell.neighbors).filter((neighbor) => neighbor.connected);
        let nextIndex = Math.floor(Math.random() * neighbors.length);
        let direction = neighbors[nextIndex].location;
        super.move(direction);

        if (this.playerInSight(playerCell)) {
          this.chasing = true;
          this.moveTime = 500;
        }
      } else {
        super.move(this.direction);
        if (!this.playerInSight(playerCell)) {
          this.chasing = false;
        }
      }
    }

    update(elapsedTime, playerCell) {
      this.time += elapsedTime;
      if (this.time >= this.moveTime) {
        this.time -= this.moveTime;
        this.move(playerCell);
      }
    }
  }

  return Monster;
})();
