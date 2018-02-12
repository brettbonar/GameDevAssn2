(function () {
  class Cell {
    constructor(position) {
      this.position = position;
      this.neighbors = {};

      this.neighbors.up = {
        line: [
          {
            x: position.x,
            y: position.y
          },
          {
            x: position.x + 1,
            y: position.y
          }
        ]
      };

      this.neighbors.down = {
        line: [
          {
            x: position.x,
            y: position.y + 1
          },
          {
            x: position.x + 1,
            y: position.y + 1
          }
        ]
      };

      this.neighbors.left = {
        line: [
          {
            x: position.x,
            y: position.y
          },
          {
            x: position.x,
            y: position.y + 1
          }
        ]
      };

      this.neighbors.right = {
        line: [
          {
            x: position.x + 1,
            y: position.y
          },
          {
            x: position.x + 1,
            y: position.y + 1
          }
        ]
      };
    }

    getLineParams(context, edge, settings) {
      let params = {
        line: [],
        strokeStyle: settings.strokeStyle,
        fillStyle: settings.fillStyle
      };
      let scale = context.canvas.width / settings.size;

      edge.line.forEach(function (point) {
        params.line.push({
          x: point.x * scale,
          y: point.y * scale
        });
      });

      return params;
    }

    render(context, settings) {
      Object.keys(this.neighbors).forEach((key) => {
        if (this.neighbors[key]) {
          Game.Line.draw(context, this.getLineParams(context, this.neighbors[key], settings));
        }
      });
    }
  }

  class Maze {
    constructor(settings) {
      this.settings = settings;
      this.maze = new Array(settings.size);
      for (let row = 0; row < settings.size; row++) {
        this.maze[row] = new Array(settings.size);
        for (let col = 0; col < settings.size; col++) {
          this.maze[row][col] = new Cell({ row: row, col: col, size: settings.size });
        }
      }
    }

    render(context) {
      this.maze.forEach((row) => {
        row.forEach((cell) => {
          cell.render(context, this.settings);
        });
      });
    }
  }

  Game.Maze = Maze;
})();
