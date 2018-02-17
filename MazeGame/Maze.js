Game.Maze = (function () {
  Graphics.ImageCache.put("wall", "Assets/wall.png");
  Graphics.ImageCache.put("knob", "Assets/knob.png");
  Graphics.ImageCache.put("rope-texture", "Assets/rope-texture.png");
  Graphics.ImageCache.put("upstairs", "Assets/upstairs.png");
  Graphics.ImageCache.put("downstairs", "Assets/downstairs.png");
  Graphics.ImageCache.put("sign-up", "Assets/sign-up.png");
  Graphics.ImageCache.put("sign-right", "Assets/sign-right.png");
  Graphics.ImageCache.put("sign-left", "Assets/sign-left.png");
  Graphics.ImageCache.put("sign-down", "Assets/sign-down.png");

  class Maze {
    constructor(settings) {
      this.visitedCells = [];
      this.settings = settings;
      this.maze = new Array(settings.size.columns);
      for (let col = 0; col < settings.size.columns; col++) {
        this.maze[col] = new Array(settings.size.rows);
        for (let row = 0; row < settings.size.rows; row++) {
          this.maze[col][row] = new Game.Cell({
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

    constructPath(state, meta) {
      let actions = [];
      while (true) {
        let row = meta.find((element) => element.cell === state);
        if (row) {
          state = row.parent;
          actions.push({
            cell: row.parent,
            action: row.action
          });
        } else {
          break;
        }
      }

      return actions.reverse();
    }

    setShortestPath() {
      let open = [this.settings.start];
      let closed = new Set();
      let meta = [];

      while (open.length > 0) {
        let parent = open.pop();
        if (parent === this.settings.end) {
          let path = this.constructPath(parent, meta);
          path.push({ cell: this.settings.end });
          return path;
        }
        for (let action in parent.neighbors) {
          let neighbor = parent.neighbors[action];
          if (neighbor.connected) {
            if (closed.has(neighbor.cell)) {
              continue;
            }

            if (!open.includes(neighbor.cell)) {
              meta.push({
                cell: neighbor.cell,
                parent: parent,
                action: action
              });
              open.unshift(neighbor.cell);
            }
          }
        }
        closed.add(parent);
      }
    }

    setPath() {
      this.settings.start = this.maze[0][0];
      // Get random end point along one of the far edges
      let side = Math.random();
      if (side < 0.5) {
        // Max X
        this.settings.end = this.maze[this.settings.size.columns - 1][Math.floor(Math.random() * this.settings.size.rows)];
      } else {
        // Max Y
        this.settings.end = this.maze[Math.floor(Math.random() * this.settings.size.columns)][this.settings.size.rows - 1];
      }
      this.shortestPath = this.setShortestPath();
      this.currentShortestPath = this.shortestPath.slice();
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

      this.setPath();

      // Save walls
      this.walls = [];
      for (const col of this.maze) {
        for (const cell of col) {
          Object.values(cell.neighbors).forEach((neighbor) => {
            if (!neighbor.connected) {
              this.walls.push(cell.getLineParams(neighbor.line));
            }
          });
        }
      }
    }

    getLineParams(line) {
      return line.map(point => ({
        x: point.x * this.settings.cellSize + this.settings.cellSize / 2 + this.settings.position.x,
        y: point.y * this.settings.cellSize + this.settings.cellSize / 2 + this.settings.position.y
      }));
    }

    drawRope(context, lines) {
      context.save();
      context.lineWidth = 4;
      Graphics.Line.draw(context, {
        lines: lines,
        strokeStyle: context.createPattern(Graphics.ImageCache.get("rope-texture"), "repeat")
      });
      context.restore();
    }

    drawBreadcrumbs(context) {
      let ropes = [];
      for (const i of this.visitedCells.keys()) {
        let current = this.visitedCells[i];
        let prev = this.visitedCells[i - 1];

        if (i > 0) {
          ropes.push(this.getLineParams([prev.position, current.position]));
        }
      }

      this.drawRope(context, ropes);

      let img = Graphics.ImageCache.get("knob");
      for (const cell of this.visitedCells) {
        let imgHeight = this.settings.cellSize / 4;
        let imgWidth = imgHeight * img.width / img.height;
        let offsetx = (this.settings.cellSize - imgWidth) / 2;
        let offsety = (this.settings.cellSize - imgHeight) / 2;
        let x = cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
        let y = cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;

        context.drawImage(img, x, y, imgWidth, imgHeight);
      }
    }

    drawPath(context) {
      let prev;
      for (let i = 0; i < this.currentShortestPath.length; i++) {
        let path = this.currentShortestPath[i];
        if (prev && path.action && path.action !== prev.action) {
          let img = Graphics.ImageCache.get("sign-" + path.action);
          let imgHeight = this.settings.cellSize;
          let imgWidth = imgHeight * img.width / img.height;
          let offsetx = (this.settings.cellSize - imgWidth) / 2;
          let offsety = -10;
          let x = path.cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
          let y = path.cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;
  
          context.drawImage(img, x, y, imgWidth, imgHeight);
        }
        prev = path;
      }
    }

    drawEntranceAndExit(context, image, cell) {
      let height = this.settings.cellSize * 0.75;
      let width = height * image.width / image.height;
      let offsetx = (this.settings.cellSize - width) / 2;
      let offsety = (this.settings.cellSize - height) / 2;
      let startx = cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
      let starty = cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;
      context.drawImage(image, startx, starty, width, height);
    }

    render(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      let lines = [];
      for (const col of this.maze) {
        for (const cell of col) {
          cell.render(context);
        }
      }

      if (this.settings.gameSettings.showBreadcrumbs) {
        this.drawBreadcrumbs(context);
      }

      this.drawEntranceAndExit(context, Graphics.ImageCache.get("upstairs"), this.settings.start);
      this.drawEntranceAndExit(context, Graphics.ImageCache.get("downstairs"), this.settings.end);

      if (this.settings.gameSettings.showPath) {
        this.drawPath(context);
      }
    }

    getCell(position) {
      return this.maze[position.x][position.y];
    }
  }

  return Maze;
})();
