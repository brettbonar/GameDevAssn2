Game.Trap = (function () {
  let activeImg = new Image();
  activeImg.src = "Assets/trap-active.png";
  let inactiveImg = new Image();
  inactiveImg.src = "Assets/trap-inactive.png";

  class Trap {
    constructor(settings) {
      Object.assign(this, settings);
      this.active = false;
      this.activeImg = activeImg;
      this.inactiveImg = inactiveImg;
      this.currentTime = 0;
      this.duration = 2000;
      this.delay = 4000;
    }

    getAbsolutePosition(position) {
      let imgWidth = 32;
      let imgHeight = imgWidth * this.activeImg.height / this.activeImg.width;
      let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2 - 2;
      let offsety = (this.mazeSettings.cellSize - imgHeight) / 2;
      let x = position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      let y = position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;
      return {
        x: x,
        y: y
      };
    }

    update(elapsedTime) {
      this.currentTime += elapsedTime;
      if (this.active && this.currentTime >= this.duration) {
        this.currentTime -= this.duration;
        this.active = false;
        this.hit = false;
      } else if (!this.active && this.currentTime >= this.delay) {
        this.currentTime -= this.delay;
        this.active = true;
      }
    }

    render(context) {
      let img = this.active ? this.activeImg : this.inactiveImg;

      let imgWidth = 32;
      let imgHeight = imgWidth * img.height / img.width;
      let pos = this.getAbsolutePosition(this.currentCell.position);

      context.drawImage(img, pos.x, pos.y, imgWidth, imgHeight);
    }
  }

  return Trap;
})();
