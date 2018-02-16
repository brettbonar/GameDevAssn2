Game.Projectile = (function () {
  class Projectile {
    constructor(settings) {
      Object.assign(this, settings);
      this.image = new Image();
      this.image.src = "Assets/axe.png";

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
      let imgWidth = 16;
      let imgHeight = imgWidth * this.image.height / this.image.width;
      let x = this.x - imgWidth / 2;
      let y = this.y - imgHeight / 2;

      context.save();
  
      context.translate(x + imgWidth / 2, y + imgHeight / 2);
      context.rotate((this.rotation * Math.PI) / 180);
      context.translate(-(x + imgWidth / 2), -(y + imgHeight / 2));
      context.drawImage(this.image, x, y, imgWidth, imgHeight);

      context.restore();
    }
  }

  return Projectile;
})();
