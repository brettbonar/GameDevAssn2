Game.Cell = (function () {
  Graphics.ImageCache.put("Empty", "Assets/Empty.png");
  Graphics.ImageCache.put("N", "Assets/N.png");
  Graphics.ImageCache.put("S", "Assets/S.png");
  Graphics.ImageCache.put("E", "Assets/E.png");
  Graphics.ImageCache.put("W", "Assets/W.png");
  Graphics.ImageCache.put("EW", "Assets/EW.png");
  Graphics.ImageCache.put("NE", "Assets/NE.png");
  Graphics.ImageCache.put("NS", "Assets/NS.png");
  Graphics.ImageCache.put("NSE", "Assets/NSE.png");
  Graphics.ImageCache.put("NSEW", "Assets/NSEW.png");
  Graphics.ImageCache.put("NSW", "Assets/NSW.png");
  Graphics.ImageCache.put("NW", "Assets/NW.png");
  Graphics.ImageCache.put("NEW", "Assets/NEW.png");
  Graphics.ImageCache.put("S", "Assets/S.png");
  Graphics.ImageCache.put("SE", "Assets/SE.png");
  Graphics.ImageCache.put("SW", "Assets/SW.png");
  Graphics.ImageCache.put("SEW", "Assets/SEW.png");
  Graphics.ImageCache.put("SW", "Assets/SW.png");
  Graphics.ImageCache.put("W", "Assets/W.png");

  class Cell {
    constructor(settings) {
      Object.assign(this, settings);
      this.images = {
        Empty: Graphics.ImageCache.get("Empty"),
        N: Graphics.ImageCache.get("N"),
        S: Graphics.ImageCache.get("S"),
        E: Graphics.ImageCache.get("E"),
        W: Graphics.ImageCache.get("W"),
        EW: Graphics.ImageCache.get("EW"),
        NE: Graphics.ImageCache.get("NE"),
        NS: Graphics.ImageCache.get("NS"),
        NSE: Graphics.ImageCache.get("NSE"),
        NSEW: Graphics.ImageCache.get("NSEW"),
        NSW: Graphics.ImageCache.get("NSW"),
        NW: Graphics.ImageCache.get("NW"),
        NEW: Graphics.ImageCache.get("NEW"),
        S: Graphics.ImageCache.get("S"),
        SE: Graphics.ImageCache.get("SE"),
        SW: Graphics.ImageCache.get("SW"),
        SEW: Graphics.ImageCache.get("SEW"),
        SW: Graphics.ImageCache.get("SW"),
        W: Graphics.ImageCache.get("W")
      };

      this.visited = false;
      this.neighbors = {
        up: {
          location: "up",
          line: [
            {
              x: settings.position.x,
              y: settings.position.y
            },
            {
              x: settings.position.x + 1,
              y: settings.position.y
            }
          ],
          connected: false
        }, 
        down: {
          location: "down",
          line: [
            {
              x: settings.position.x,
              y: settings.position.y + 1
            },
            {
              x: settings.position.x + 1,
              y: settings.position.y + 1
            }
          ],
          connected: false
        },
        left: {
          location: "left",
          line: [
            {
              x: settings.position.x,
              y: settings.position.y
            },
            {
              x: settings.position.x,
              y: settings.position.y + 1
            }
          ],
          connected: false
        },
        right: {
          location: "right",
          line: [
            {
              x: settings.position.x + 1,
              y: settings.position.y
            },
            {
              x: settings.position.x + 1,
              y: settings.position.y + 1
            }
          ],
          connected: false
        }
      };
    }

    getLineParams(line) {
      return line.map(point => ({
        x: point.x * this.mazeSettings.cellSize + this.mazeSettings.position.x,
        y: point.y * this.mazeSettings.cellSize + this.mazeSettings.position.y
      }));
    }

    render(context) {
      let name = "";

      if (!this.neighbors.up.connected) {
        name += "N";
      }
      if (!this.neighbors.down.connected) {
        name += "S";
      }
      if (!this.neighbors.right.connected) {
        name += "E";
      }
      if (!this.neighbors.left.connected) {
        name += "W";
      }

      if (!name) {
        name = "Empty";
      }

      let x = this.position.x * this.mazeSettings.cellSize + this.mazeSettings.position.x;
      let y = this.position.y * this.mazeSettings.cellSize + this.mazeSettings.position.y;
      context.drawImage(this.images[name], x, y, this.mazeSettings.cellSize, this.mazeSettings.cellSize);
    }
  }

  return Cell;
})();
