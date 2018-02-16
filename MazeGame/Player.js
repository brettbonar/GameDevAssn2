Game.Player = (function () {
  let right = new Image();
  right.src = "Assets/player-right.png";
  let left = new Image();
  left.src = "Assets/player-left.png";
  let front = new Image();
  front.src = "Assets/player-front.png";
  let back = new Image();
  back.src = "Assets/player-back.png";

  class Player extends Game.Character{
    constructor(settings) {
      super(settings, "player");
      this.right = right;
      this.front = front;
      this.left = left;
      this.back = back;
    }
  }

  return Player;
})();
