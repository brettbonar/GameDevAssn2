Game.Monster = (function () {
  let right = new Image();
  right.src = "Assets/monster-right.png";
  let left = new Image();
  left.src = "Assets/monster-left.png";
  let front = new Image();
  front.src = "Assets/monster-front.png";
  let back = new Image();
  back.src = "Assets/monster-back.png";

  class Monster extends Game.Character {
    constructor(settings) {
      super(settings, "monster");
      this.moveTime = 1000;
      this.time = 0;
      this.right = right;
      this.front = front;
      this.left = left;
      this.back = back;
    }

    move() {
      let neighbors = Object.values(this.currentCell.neighbors).filter((neighbor) => neighbor.connected);
      let nextIndex = Math.floor(Math.random() * neighbors.length);
      let direction = neighbors[nextIndex].location;
      super.move(direction);
    }

    update(elapsedTime) {
      this.time += elapsedTime;
      if (this.time >= this.moveTime) {
        this.time -= this.moveTime;
        this.move();
      }
    }
  }

  return Monster;
})();
