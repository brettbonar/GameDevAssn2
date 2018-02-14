(function () {
  class Cell {
    constructor(settings) {
      Object.assign(this, settings);
      this.textures = {
        Empty: "Assets/Empty.png",
        N: "Assets/N.png",
        S: "Assets/S.png",
        E: "Assets/E.png",
        W: "Assets/W.png",
        EW: "Assets/EW.png",
        NE: "Assets/NE.png",
        NS: "Assets/NS.png",
        NSE: "Assets/NSE.png",
        NSEW: "Assets/NSEW.png",
        NSW: "Assets/NSW.png",
        NW: "Assets/NW.png",
        NEW: "Assets/NEW.png",
        S: "Assets/S.png",
        SE: "Assets/SE.png",
        SW: "Assets/SW.png",
        SEW: "Assets/SEW.png",
        SW: "Assets/SW.png",
        W: "Assets/W.png",
      };
      this.images = {};

      Object.keys(this.textures).forEach((name) => {
        this.images[name] = new Image();
        this.images[name].src = this.textures[name];
      });
      this.breadcrumb = new Image();
      this.breadcrumb.src = "Assets/candle.png";

      this.visited = false;
      this.neighbors = {
        up: {
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

    getLineParams(context, line) {
      let lineParams = [];
      line.forEach((point) => {
        lineParams.push({
          x: point.x * this.mazeSettings.cellSize + this.mazeSettings.position.x,
          y: point.y * this.mazeSettings.cellSize + this.mazeSettings.position.y
        });
      });

      return lineParams;
    }

    render(context) {
      // let name = "";

      // if (!this.neighbors.up.connected) {
      //   name += "N";
      // }
      // if (!this.neighbors.down.connected) {
      //   name += "S";
      // }
      // if (!this.neighbors.right.connected) {
      //   name += "E";
      // }
      // if (!this.neighbors.left.connected) {
      //   name += "W";
      // }

      // if (!name) {
      //   name = "Empty";
      // }

      // let x = this.position.x * this.mazeSettings.cellSize + this.mazeSettings.position.x;
      // let y = this.position.y * this.mazeSettings.cellSize + this.mazeSettings.position.y;
      // context.drawImage(this.images[name], x, y, this.mazeSettings.cellSize, this.mazeSettings.cellSize);

      // let lines = []
      // Object.values(this.neighbors).forEach((neighbor) => {
      //   if (!neighbor.connected) {
      //     lines.push(this.getLineParams(context, neighbor.line));
      //   }
      // });

      // context.lineWidth = 16;
      // Game.Line.draw(context, {
      //   lines: lines,
      //   strokeStyle: context.createPattern(this.wall, "repeat")
      //   // fillStyle: this.style.fillStyle
      // });

      // if (this.visited) {
      //   Game.Circle.draw(context, {
      //     x: this.position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
      //     y: this.position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y,
      //     r: this.mazeSettings.cellSize / 8
      //   });
      // }

      if (this.visited) {
        let imgHeight = this.mazeSettings.cellSize / 3;
        let imgWidth = imgHeight * this.breadcrumb.width / this.breadcrumb.height;
        let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
        let offsety = (this.mazeSettings.cellSize - imgHeight) / 2;
        let x = this.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
        let y = this.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

        context.drawImage(this.breadcrumb, x, y, imgWidth, imgHeight);
      }
    }
  }

  class Maze {
    constructor(settings) {
      this.wall = new Image();
      this.wall.src = "Assets/wall.png";
      this.background = new Image();
      this.background.src = "Assets/background.png";
      this.visitedCells = [];
      this.settings = settings;
      this.maze = new Array(settings.size.columns);
      for (let col = 0; col < settings.size.columns; col++) {
        this.maze[col] = new Array(settings.size.rows);
        for (let row = 0; row < settings.size.rows; row++) {
          this.maze[col][row] = new Cell({
            position: {
              x: col, y: row
            },
            mazeSettings: settings
          });
        }
      }

      // TODO: optimize
      for (let col = 0; col < settings.size.columns; col++) {
        for (let row = 0; row < settings.size.rows; row++) {
          let cell = this.maze[col][row];
          if (col > 0) {
            cell.neighbors.left.cell = this.maze[col - 1][row];
          }
          if (col < settings.size.columns - 1) {
            cell.neighbors.right.cell = this.maze[col + 1][row];
          }
          if (row > 0) {
            cell.neighbors.up.cell = this.maze[col][row - 1];
          }
          if (row < settings.size.rows - 1) {
            cell.neighbors.down.cell = this.maze[col][row + 1];
          }
        }
      }

      this.randomize();
    }

    addNeighborsToFrontier(cell, frontier, grid) {
      Object.values(cell.neighbors).forEach(function (neighbor) {
        if (neighbor.cell && !frontier.includes(neighbor.cell) && !grid.includes(neighbor.cell)) {
          frontier.push(neighbor.cell);
        }
      });
    }

    removeEdge(cell, neighborCell) {
      Object.values(cell.neighbors).forEach(function (neighbor) {
        if (neighbor.cell === neighborCell) {
          neighbor.connected = true;
        }
      });
    }

    removeRandomEdge(cell, grid) {
      let neighbors = [];
      Object.values(cell.neighbors).forEach(function (neighbor) {
        if (neighbor.cell) {
          neighbors.push(neighbor.cell);
        }
      });
      let inNeighbors = [...new Set([...neighbors].filter(x => grid.includes(x)))];
      let neighborCell = inNeighbors[Math.floor(Math.random () * inNeighbors.length)];
      
      this.removeEdge(cell, neighborCell);
      this.removeEdge(neighborCell, cell);
    }

    randomize() {
      // Randomized Prim's
      let x = Math.floor(Math.random() * this.settings.size.columns);
      let y = Math.floor(Math.random() * this.settings.size.rows);
      let current = this.maze[x][y];
      let grid = [current];
      let frontier = [];
      this.addNeighborsToFrontier(current, frontier, grid);

      while (frontier.length > 0) {
        current = frontier[Math.floor(Math.random() * frontier.length)];
        this.removeRandomEdge(current, grid);
        this.addNeighborsToFrontier(current, frontier, grid);
        frontier.splice(frontier.indexOf(current), 1);
        grid.push(current);
      }
    }

    render(context) {
      var pattern = context.createPattern(this.background, 'repeat');
      context.fillStyle = pattern;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      let lines = [];
      this.maze.forEach((col) => {
        col.forEach((cell) => {
          cell.render(context);
          
          Object.values(cell.neighbors).forEach((neighbor) => {
            if (!neighbor.connected) {
              lines.push(cell.getLineParams(context, neighbor.line));
            }
          });
        });
      });

      context.lineWidth = 12;
      Game.Line.draw(context, {
        lines: lines,
        //strokeStyle: "#444444"
        strokeStyle: context.createPattern(this.wall, "repeat")
        // fillStyle: this.style.fillStyle
      });
    }

    getCell(position) {
      return this.maze[position.x][position.y];
    }
  }

  Game.Maze = Maze;
})();
