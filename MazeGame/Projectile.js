Game.Projectile = (function () {
  Graphics.ImageCache.put("axe", "Assets/axe.png");

  class Projectile {
    constructor(settings) {
      Object.assign(this, settings);

      // Milliseconds per cell
      this.speed = 200;
      this.rotation = 0;
      this.rotateSpeed = 100;
      this.previousTime = 0;
      this.last = {
        x: settings.x,
        y: settings.y
      };
    }

    update(elapsedTime) {
      this.last.x = this.x;
      this.last.y = this.y;
      let dir = 1;
      if (this.direction === Game.DIRECTION.UP) {
        this.y -= this.mazeSettings.cellSize * (elapsedTime / this.speed);
        dir = -1;
      } else if (this.direction === Game.DIRECTION.DOWN) {
        this.y += this.mazeSettings.cellSize * (elapsedTime / this.speed);
      } else if (this.direction === Game.DIRECTION.LEFT) {
        this.x -= this.mazeSettings.cellSize * (elapsedTime / this.speed);
        dir = -1;    
      } else if (this.direction === Game.DIRECTION.RIGHT) {
        this.x += this.mazeSettings.cellSize * (elapsedTime / this.speed);          
      }

      this.rotation += elapsedTime * dir;
    }

    render(context) {
      let image = Graphics.ImageCache.get("axe");

      let imgWidth = 16;
      let imgHeight = imgWidth * image.height / image.width;
      let x = this.x - imgWidth / 2;
      let y = this.y - imgHeight / 2;

      Graphics.Image.draw(context, {
        width: imgWidth,
        height: imgHeight,
        x: x,
        y: y,
        rotation: this.rotation,
        image: Graphics.ImageCache.get("axe")
      })
    }
  }

  return Projectile;
})();
