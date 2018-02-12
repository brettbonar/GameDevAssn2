(function () {
  class Cell {
    constructor(position) {
      this.position = position;
      this.neighbors = {
        up: {
          line: [
            {
              x: position.x,
              y: position.y
            },
            {
              x: position.x + 1,
              y: position.y
            }
          ],
        }, 
        down: {
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
        },
        left: {
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
        },
        right: {
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
        }
      };
    }

    getLineParams(context, line, settings) {
      let params = {
        line: [],
        strokeStyle: settings.strokeStyle,
        fillStyle: settings.fillStyle
      };
      let xScale = context.canvas.width / settings.size.columns;
      let yScale = context.canvas.height / settings.size.rows;
      let scale = Math.min(xScale, yScale);

      line.forEach(function (point) {
        params.line.push({
          x: point.x * scale,
          y: point.y * scale
        });
      });

      return params;
    }

    render(context, settings) {
      Object.values(this.neighbors).forEach((neighbor) => {
        if (neighbor.cell) {
          Game.Line.draw(context, this.getLineParams(context, neighbor.line, settings));
        }
      });
    }
  }

  class Maze {
    constructor(settings) {
      this.settings = settings;
      this.maze = new Array(settings.size.columns);
      for (let col = 0; col < settings.size.columns; col++) {
        this.maze[col] = new Array(settings.size.rows);
        for (let row = 0; row < settings.size.rows; row++) {
          this.maze[col][row] = new Cell({ x: col, y: row, size: settings.size });
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

    removeNeighbor(cell, neighborCell) {
      Object.values(cell.neighbors).forEach(function (neighbor) {
        if (neighbor.cell === neighborCell) {
          neighbor.cell = null;
        }
      });
    }

    removeRandomEdge(cell, grid) {
      // TODO: optimize
      let neighbors = [];
      Object.values(cell.neighbors).forEach(function (neighbor) {
        if (neighbor.cell) {
          neighbors.push(neighbor.cell);
        }
      });
      let inNeighbors = [...new Set([...neighbors].filter(x => grid.includes(x)))];
      let neighborCell = inNeighbors[Math.floor(Math.random () * inNeighbors.length)];
      
      this.removeNeighbor(cell, neighborCell);
      this.removeNeighbor(neighborCell, cell);
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
      this.maze.forEach((col) => {
        col.forEach((cell) => {
          cell.render(context, this.settings);
        });
      });
    }
  }

  Game.Maze = Maze;
})();
