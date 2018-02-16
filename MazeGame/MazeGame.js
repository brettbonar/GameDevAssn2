(function () {
  const EVENTS = {
    MOVE_UP: 1,
    MOVE_DOWN: 2,
    MOVE_LEFT: 3,
    MOVE_RIGHT: 4,
    SHOOT: 5
  };
  
  class MazeGame { 
    constructor() {
      // TODO: pass this in
      this.canvas = document.getElementById("canvas-main");
      // this.canvas.style.width = "1000px";
      // this.canvas.style.height = "1200px";
      this.context = this.canvas.getContext("2d");
      this.mazeSettings = {
        size: {
          rows: 20,
          columns: 20,
          width: this.canvas.width,
          height: this.canvas.width // Intentionally same as width
          // width: this.canvas.width / 2,
          // height: this.canvas.height / 2
        }
      };
      this.mazeSettings.cellSize = 48;
      // Center maze in canvas
      this.mazeSettings.position = {
        x: (this.canvas.width - this.mazeSettings.size.columns * this.mazeSettings.cellSize) / 2,
        y: (this.canvas.height - this.mazeSettings.size.rows * this.mazeSettings.cellSize) - 20
        // x: this.canvas.width / 4,
        // y: this.canvas.height / 4
      };
      // Math.min(this.mazeSettings.size.width / this.mazeSettings.size.columns,
      //   this.mazeSettings.size.height / this.mazeSettings.size.rows);

      this.gameState = {
        maze: new Game.Maze(this.mazeSettings),
        player: new Game.Player({
          mazeSettings: this.mazeSettings,
          position: {
            x: 0,
            y: 0
          }
        }),
        numMoves: 0
      };

      this.projectiles = [];
      this.monsters = [];
      // Create a new random monster at least half the maze cells away
      let x = Math.floor(Math.random() * this.mazeSettings.size.columns / 2) + this.mazeSettings.size.columns / 2;
      let y = Math.floor(Math.random() * this.mazeSettings.size.rows / 2) + this.mazeSettings.size.rows / 2;
      this.monsters.push(new Game.Monster({
        currentCell: this.gameState.maze.getCell({ x: x, y: y}),
        mazeSettings: this.mazeSettings
      }));

      this.events = [];
      this.keyBindings = {
        32: EVENTS.SHOOT,
        37: EVENTS.MOVE_LEFT,
        38: EVENTS.MOVE_UP,
        39: EVENTS.MOVE_RIGHT,
        40: EVENTS.MOVE_DOWN
      };

      // TODO: capture keypressed and keyup. Keep keydown event in list until keyup
      this.eventHandlers = {
        [EVENTS.MOVE_LEFT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_RIGHT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_UP]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_DOWN]: (event) => this.movePlayer(event),
        [EVENTS.SHOOT]: (event) => this.shoot(event)
      };

    }

    getAbsolutePosition(position) {
      return {
        x: position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
        y: position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y
      };
    }

    shoot(event) {
      this.projectiles.push(new Game.Projectile(Object.assign({
        direction: this.gameState.player.direction,
        mazeSettings: this.mazeSettings
      }, this.getAbsolutePosition(this.gameState.player.position))));
    }

    updatePath() {
      let cell = this.gameState.maze.getCell(this.gameState.player.position);
      if (this.gameState.maze.currentShortestPath.length > 1 && cell === this.gameState.maze.currentShortestPath[1].cell) {
        this.gameState.maze.currentShortestPath.shift();
      }
    }

    movePlayer(event, elapsedTime) {
      let cell = this.gameState.maze.getCell(this.gameState.player.position);
      if (event === EVENTS.MOVE_LEFT) {
        this.gameState.player.direction = Game.Player.DIRECTION.LEFT;
        if (cell.neighbors.left.connected) {
          this.gameState.player.position.x -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_RIGHT) {
        this.gameState.player.direction = Game.Player.DIRECTION.RIGHT;
        if (cell.neighbors.right.connected) {
          this.gameState.player.position.x += 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_UP) {
        this.gameState.player.direction = Game.Player.DIRECTION.UP;
        if (cell.neighbors.up.connected) {
          this.gameState.player.position.y -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_DOWN) {
        this.gameState.player.direction = Game.Player.DIRECTION.DOWN;
        if (cell.neighbors.down.connected) {
          this.gameState.player.position.y += 1;
          this.numMoves += 1;
        }
      }

      this.updatePath();
    }

    handleKeyEvent(e) {
      let event = this.keyBindings[e.keyCode];
      if (event) {
        this.events.push(event);
      }
    }

    processInput() {
      while (this.events.length > 0) {
        let event = this.events.shift();
        if (this.eventHandlers[event]) {
          this.eventHandlers[event](event);
        }
      }
    }

    intersects(a, b, c, d, p, q, r, s) {
      // https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
      var det, gamma, lambda;
      det = (c - a) * (s - q) - (r - p) * (d - b);
      if (det === 0) {
        return false;
      } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
      }
    }

    intersectsWall(projectileLine) {
      for (const line of this.gameState.maze.walls) {
        if (this.intersects(projectileLine[0].x, projectileLine[0].y, projectileLine[1].x, projectileLine[1].y,
          line[0].x, line[0].y, line[1].x, line[1].y)) {
            return true;
          }
      }
      return false;
    }

    intersectsMonster(projectileLine) {
      for (const monster of this.monsters) {
        // TODO: save dimensions somewhere
        let imgWidth = this.mazeSettings.cellSize / 2;
        let imgHeight = imgWidth;;

        let offsetx = (this.mazeSettings.cellSize - imgWidth) / 2;
        let offsety = (this.mazeSettings.cellSize - imgHeight) / 4;
        let x = monster.currentCell.position.x * this.mazeSettings.cellSize + offsetx + this.mazeSettings.position.x;
        let y = monster.currentCell.position.y * this.mazeSettings.cellSize + offsety + this.mazeSettings.position.y;
  
        let ul = { x: x, y: y };
        let ur = { x: x + imgWidth, y: y };
        let lr = { x: x + imgWidth, y: y + imgHeight };
        let ll = { x: x, y: y + imgHeight };

        let lines = [[ul, ur], [ur, lr], [lr, ll], [ll, ul]];
        if (lines.some((line) => this.intersects(projectileLine[0].x, projectileLine[0].y, projectileLine[1].x, projectileLine[1].y,
          line[0].x, line[0].y, line[1].x, line[1].y))) {
            this.monsters = this.monsters.filter((m) => m !== monster);
            return true;
            // TODO: add points
          }
      }

      return false;
    }

    update(elapsedTime) {
      let currentCell = 
        this.gameState.maze.getCell(this.gameState.player.position);
      if (currentCell !== this.gameState.maze.visitedCells[this.gameState.maze.visitedCells.length - 1]) {
        currentCell.visited = true;
        this.gameState.maze.visitedCells.push(currentCell);
      }

      for (const monster of this.monsters) {
        monster.update(elapsedTime);
      }

      for (const projectile of this.projectiles) {
        projectile.update(elapsedTime);
        let projectileLine = [projectile.last, { x: projectile.x, y: projectile.y}];
        if (this.intersectsMonster(projectileLine)) {
          projectile.remove = true;
        } else if (this.intersectsWall(projectileLine)) {
          projectile.remove = true;
        }
      }

      this.projectiles = this.projectiles.filter((projectile) => !projectile.remove);
    }

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.gameState.maze.render(this.context);
      this.gameState.player.render(this.context);
      for (const projectile of this.projectiles) {
        projectile.render(this.context);
      }

      for (const monster of this.monsters) {
        monster.render(this.context);
      }
    }

    gameLoop(currentTime) {
      let elapsedTime = currentTime - this.previousTime;
      this.previousTime = currentTime;
    
      this.processInput();
      this.update(elapsedTime);
      this.render(elapsedTime);
    
      requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
    }
      
    start() {
      this.previousTime = performance.now();
      requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
      document.addEventListener("keydown", (event) => this.handleKeyEvent(event));
    }

    static get EVENTS() { return EVENTS; }
  }

  Game.MazeGame = MazeGame;
})();
