Game.HintGhost = (function () {
  class HintGhost extends Game.Character {
    constructor(settings) {
      super(settings, "player-ghost");
      this.moveTime = 1000;
      this.time = 0;
    }

    move() {
      super.move(this.directions.shift().action);
    }

    update(elapsedTime) {
      this.time += elapsedTime;
      if (!done && this.time >= this.moveTime) {
        this.time -= this.moveTime;
        super.move(this.directions.shift().action);
        if (this.directions.length === 0) {
          this.done = true;
        }
      }
    }
  }

  return HintGhost;
})();
