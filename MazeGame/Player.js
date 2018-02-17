Game.Player = (function () {
  Graphics.ImageCache.put("player-right", "Assets/player-right.png");
  Graphics.ImageCache.put("player-left", "Assets/player-left.png");
  Graphics.ImageCache.put("player-front", "Assets/player-front.png");
  Graphics.ImageCache.put("player-back", "Assets/player-back.png");

  class Player extends Game.Character{
    constructor(settings) {
      super(settings);
      this.right = Graphics.ImageCache.get("player-right");
      this.front = Graphics.ImageCache.get("player-front");
      this.left = Graphics.ImageCache.get("player-left");
      this.back = Graphics.ImageCache.get("player-back");
    }
  }

  return Player;
})();
