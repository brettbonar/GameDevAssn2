Game.Player = (function () {
  class Player extends Game.Character{
    constructor(settings) {
      super(settings, "player");
    }
  }

  return Player;
})();
