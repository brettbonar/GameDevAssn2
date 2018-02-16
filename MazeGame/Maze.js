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

      // if (this.visited) {
      //   let imgHeight = this.mazeSettings.cellSize / 3;
      //   let imgWidth = imgHeight * this.breadcrumb.width / this.breadcrumb.height;
      //   let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
      //   let offsety = (this.mazeSettings.cellSize - imgHeight) / 2;
      //   let x = this.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
      //   let y = this.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;

      //   context.drawImage(this.breadcrumb, x, y, imgWidth, imgHeight);
      // }
    }
  }

  class Maze {
    constructor(settings) {
      this.wall = new Image();
      this.wall.src = "Assets/wall.png";
      this.background = new Image();
      this.background.src = "Assets/background.png";

      this.breadcrumb = new Image();
      this.breadcrumb.src = "Assets/knob.png";
      this.rope = new Image();
      this.rope.src = "Assets/rope-texture.png";
      this.ropeVertical = new Image();
      this.ropeVertical.src = "Assets/rope-vertical.png";

      this.upstairs = new Image();
      this.upstairs.src = "Assets/upstairs.png";
      this.downstairs = new Image();
      this.downstairs.src = "Assets/downstairs.png";

      this.signs = {
        up: new Image(),
        right: new Image(),
        left: new Image(),
        down: new Image()
      };
      this.signs.up.src = "Assets/sign-up.png",
      this.signs.right.src = "Assets/sign-right.png";
      this.signs.left.src = "Assets/sign-left.png";
      this.signs.down.src = "Assets/sign-down.png";

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
      // Get random start and end points
      this.settings.start = this.maze[0][0];
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

    // TODO: draw line with texture -- rotate texture somehow?
    drawRope(context, position, rotate, opposite) {
      let imgHeight;
      let imgWidth;
      if (rotate) {    
        imgHeight = this.settings.cellSize / 2;
        imgWidth = imgHeight * this.rope.height / this.rope.width;
      } else {
        imgWidth = this.settings.cellSize / 2;
        imgHeight = imgWidth * this.rope.height / this.rope.width;
      }
      let offsetx = (this.settings.cellSize - imgWidth) / 2;
      let offsety = (this.settings.cellSize - imgHeight) / 2;

      if (rotate) {
        if (opposite) {
          offsety -= this.settings.cellSize / 4;
        } else {
          offsety += this.settings.cellSize / 4;
        }
      } else {
        if (opposite) {
          offsetx += this.settings.cellSize / 4;
        } else {
          offsetx -= this.settings.cellSize / 4;
        }
      }


      let x = position.x * this.settings.cellSize + offsetx + this.settings.position.x;
      let y = position.y * this.settings.cellSize + offsety + this.settings.position.y;

      if (rotate) {
        // // save the unrotated context of the canvas so we can restore it later
        // // the alternative is to untranslate & unrotate after drawing
        // context.save();
        
        // context.translate(x + imgWidth / 2, y + imgHeight / 2);
        // context.rotate(Math.PI / 180);
        // context.translate(-(x + imgWidth / 2), -(y + imgHeight / 2));
        
        // // we’re done with the rotating so restore the unrotated context
        // context.drawImage(this.rope, x, y, imgWidth, imgHeight);
        // context.restore();
        context.drawImage(this.ropeVertical, x, y, imgWidth, imgHeight);
      } else {
        context.drawImage(this.rope, x, y, imgWidth, imgHeight);
      }
      
    }

    getLineParams(line) {
      let lineParams = [];
      line.forEach((point) => {
        lineParams.push({
          x: point.x * this.settings.cellSize + this.settings.cellSize / 2 + this.settings.position.x,
          y: point.y * this.settings.cellSize + this.settings.cellSize / 2 + this.settings.position.y
        });
      });

      return lineParams;
    }

    drawRope(context, lines) {
      context.save();
      context.lineWidth = 4;
      Game.Line.draw(context, {
        lines: lines,
        strokeStyle: context.createPattern(this.rope, "repeat")
        // fillStyle: this.style.fillStyle
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

      for (const cell of this.visitedCells) {
        let imgHeight = this.settings.cellSize / 4;
        let imgWidth = imgHeight * this.breadcrumb.width / this.breadcrumb.height;
        let offsetx = (this.settings.cellSize - imgWidth) / 2;
        let offsety = (this.settings.cellSize - imgHeight) / 2;
        let x = cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
        let y = cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;

        context.drawImage(this.breadcrumb, x, y, imgWidth, imgHeight);
      }
    }

    drawPath(context) {
      let prev;
      for (let i = 0; i < this.currentShortestPath.length; i++) {
        let path = this.currentShortestPath[i];
        if (prev && path.action !== prev.action) {
          let imgHeight = this.settings.cellSize;
          let imgWidth = imgHeight * this.signs[path.action].width / this.signs[path.action].height;
          let offsetx = (this.settings.cellSize - imgWidth) / 2;
          let offsety = -10;//(this.settings.cellSize - imgHeight) / 2;
          let x = path.cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
          let y = path.cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;
  
          context.drawImage(this.signs[path.action], x, y, imgWidth, imgHeight);
        }
        prev = path;
      }
    }

    drawEntranceAndExit(context) {
      {
      let cell = this.settings.start;
      let imgHeight = this.settings.cellSize * 0.75;
      let imgWidth = imgHeight * this.upstairs.width / this.upstairs.height;
      let offsetx = (this.settings.cellSize - imgWidth) / 2;
      let offsety = (this.settings.cellSize - imgHeight) / 2;
      let x = cell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
      let y = cell.position.y * this.settings.cellSize + offsety + this.settings.position.y;
      context.drawImage(this.upstairs, x, y, imgWidth, imgHeight);
      }
      
      let endCell = this.settings.end;
      let imgHeight = this.settings.cellSize * 0.75;
      let imgWidth = imgHeight * this.downstairs.width / this.downstairs.height;
      let offsetx = (this.settings.cellSize - imgWidth) / 2;
      let offsety = (this.settings.cellSize - imgHeight) / 2;
      let x = endCell.position.x * this.settings.cellSize + offsetx + this.settings.position.x;
      let y = endCell.position.y * this.settings.cellSize + offsety + this.settings.position.y;
      context.drawImage(this.downstairs, x, y, imgWidth, imgHeight);
    }

    render(context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);

      var pattern = context.createPattern(this.background, "repeat");
      context.fillStyle = pattern;
      context.fillRect(0, 0, context.canvas.width, context.canvas.height);

      let lines = [];
      this.maze.forEach((col) => {
        col.forEach((cell) => {
          cell.render(context);
          
          // Object.values(cell.neighbors).forEach((neighbor) => {
          //   if (!neighbor.connected) {
          //     lines.push(cell.getLineParams(context, neighbor.line));
          //   }
          // });
        });
      });

      if (this.settings.gameSettings.showBreadcrumbs) {
        this.drawBreadcrumbs(context);
      }
      this.drawEntranceAndExit(context);

      if (this.settings.gameSettings.showPath) {
        this.drawPath(context);
      }
      // context.lineWidth = 12;
      // Game.Line.draw(context, {
      //   lines: lines,
      //   //strokeStyle: "#444444"
      //   strokeStyle: context.createPattern(this.wall, "repeat")
      //   // fillStyle: this.style.fillStyle
      // });
    }

    getCell(position) {
      return this.maze[position.x][position.y];
    }
  }

  Game.Maze = Maze;
})();
