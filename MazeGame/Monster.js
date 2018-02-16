Game.Monster = (function () {
  class Monster extends Game.Character {
    constructor(settings) {
      super(settings, "monster");
      this.moveTime = 1000;
      this.time = 0;
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
