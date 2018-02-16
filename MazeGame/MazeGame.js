(function () {
  const EVENTS = {
    MOVE_UP: 1,
    MOVE_DOWN: 2,
    MOVE_LEFT: 3,
    MOVE_RIGHT: 4,
    SHOOT: 5,
    HINT: 6,
    TOGGLE_BREADCRUMBS: 7,
    TOGGLE_PATH: 8,
    TOGGLE_SCORE: 9
  };
  
  class MazeGame { 
    constructor() {

      // TODO: pass this in
      this.canvas = document.getElementById("canvas-main");
      this.canvasGroup = document.getElementsByClassName("canvas-group")[0];

      // this.canvas.style.width = "1000px";
      // this.canvas.style.height = "1200px";
      this.context = this.canvas.getContext("2d");
      this.gameSettings = {
        showBreadcrumbs: false,
        showPath: false,
        showScore: true
      };
      this.mazeSettings = {
        size: {
          rows: 20,
          columns: 20,
          width: 20 * 48,
          height: 20 * 48 // Intentionally same as width
          // width: this.canvas.width / 2,
          // height: this.canvas.height / 2
        },
        cellSize: 48,
        gameSettings: this.gameSettings
      };
      // Center maze in canvas
      this.mazeSettings.position = {
        x: (this.canvas.width - this.mazeSettings.size.columns * this.mazeSettings.cellSize) / 2,
        y: (this.canvas.height - this.mazeSettings.size.rows * this.mazeSettings.cellSize) - 20
        // x: this.canvas.width / 4,
        // y: this.canvas.height / 4
      };
      // Math.min(this.mazeSettings.size.width / this.mazeSettings.size.columns,
      //   this.mazeSettings.size.height / this.mazeSettings.size.rows);

      this.fog = document.createElement("canvas");
      this.fog.classList.add("game-canvas");
      this.fog.height = this.canvas.height;
      this.fog.width = this.canvas.width;
      this.canvasGroup.appendChild(this.fog);
      this.fogContext = this.fog.getContext("2d");
      this.fogContext.fillRect(this.mazeSettings.position.x, this.mazeSettings.position.y,
        this.mazeSettings.size.width, this.mazeSettings.size.height);

      this.fog2 = document.createElement("canvas");
      this.fog2.classList.add("game-canvas");
      this.fog2.height = this.canvas.height;
      this.fog2.width = this.canvas.width;
      this.canvasGroup.appendChild(this.fog2);
      this.fogContext2 = this.fog2.getContext("2d");
      this.fogContext2.fillRect(this.mazeSettings.position.x, this.mazeSettings.position.y,
        this.mazeSettings.size.width, this.mazeSettings.size.height);

      this.gameState = {
        maze: new Game.Maze(this.mazeSettings),
        numMoves: 0,
        score: 1000,
        time: 0
      };
      this.gameState.player = new Game.Player({
        mazeSettings: this.mazeSettings,
        position: Object.assign({}, this.gameState.maze.settings.start.position),
        currentCell: this.gameState.maze.getCell({ x: 0, y: 0 })
      });

      this.projectiles = [];
      this.monsters = [];
      this.hints = [];
      this.scores = [];
      // Create a new random monster at least half the maze cells away
      let x = Math.floor(Math.random() * this.mazeSettings.size.columns / 2) + this.mazeSettings.size.columns / 2;
      let y = Math.floor(Math.random() * this.mazeSettings.size.rows / 2) + this.mazeSettings.size.rows / 2;
      this.monsters.push(new Game.Monster({
        currentCell: this.gameState.maze.getCell({ x: x, y: y}),
        mazeSettings: this.mazeSettings
      }));

      this.events = [];
      this.keyBindings = {
        32: EVENTS.SHOOT, // space
        37: EVENTS.MOVE_LEFT,
        38: EVENTS.MOVE_UP,
        39: EVENTS.MOVE_RIGHT,
        40: EVENTS.MOVE_DOWN,
        66: EVENTS.TOGGLE_BREADCRUMBS, // B
        72: EVENTS.HINT, // H
        80: EVENTS.TOGGLE_PATH, // P
        89: EVENTS.TOGGLE_SCORE // Y
      };

      // TODO: capture keypressed and keyup. Keep keydown event in list until keyup
      this.eventHandlers = {
        [EVENTS.MOVE_LEFT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_RIGHT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_UP]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_DOWN]: (event) => this.movePlayer(event),
        [EVENTS.SHOOT]: (event) => this.shoot(event),
        [EVENTS.HINT]: (event) => this.hint(event),
        [EVENTS.TOGGLE_BREADCRUMBS]: (event) => this.gameSettings.showBreadcrumbs = !this.gameSettings.showBreadcrumbs,
        [EVENTS.TOGGLE_PATH]: (event) => this.gameSettings.showPath = !this.gameSettings.showPath,
        [EVENTS.TOGGLE_SCORE]: (event) => this.gameSettings.showScore = !this.gameSettings.showScore
      };
    }

    // Thanks to https://codepen.io/zyklus/pen/prvnb
    // I don't completely know how this works
    updateFog() {
      let pos = this.getAbsolutePosition(this.gameState.player.currentCell.position);
      // partially hide the entire map and re-reval where we are now
      this.fogContext.globalCompositeOperation = 'source-over';
      this.fogContext.clearRect( this.mazeSettings.position.x, this.mazeSettings.position.y, this.mazeSettings.size.width, this.mazeSettings.size.width );
      this.fogContext.fillStyle = 'rgba( 0, 0, 0, .7 )';
      this.fogContext.fillRect ( this.mazeSettings.position.x, this.mazeSettings.position.y, this.mazeSettings.size.width, this.mazeSettings.size.width );

      let r1 = this.mazeSettings.cellSize * 2;
      let r2 = this.mazeSettings.cellSize * 4;

      var radGrd = this.fogContext.createRadialGradient( pos.x, pos.y, 
        r1, pos.x, pos.y, r2);
      radGrd.addColorStop(  0, 'rgba( 0, 0, 0,  1 )' );
      radGrd.addColorStop( .8, 'rgba( 0, 0, 0, .1 )' );
      radGrd.addColorStop(  1, 'rgba( 0, 0, 0,  0 )' );

      this.fogContext.globalCompositeOperation = 'destination-out';
      this.fogContext.fillStyle = radGrd;
      this.fogContext.fillRect( pos.x - 300, pos.y - 300, 300*2, 300*2 );

      // Context 2 stays dark black, but is never cleared
      var radGrd = this.fogContext2.createRadialGradient( pos.x, pos.y, r1, pos.x, pos.y, r2 );
      radGrd.addColorStop(  0, 'rgba( 0, 0, 0,  1 )' );
      radGrd.addColorStop( .8, 'rgba( 0, 0, 0, .1 )' );
      radGrd.addColorStop(  1, 'rgba( 0, 0, 0,  0 )' );

      this.fogContext2.globalCompositeOperation = 'destination-out';
      this.fogContext2.fillStyle = radGrd;
      this.fogContext2.fillRect( pos.x - r2, pos.y - r2, r2*2, r2*2 );
    }

    getAbsolutePosition(position) {
      return {
        x: position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
        y: position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y
      };
    }

    hint(event) {
      this.hints.push(new Game.HintGhost({
        mazeSettings: this.mazeSettings,
        position: Object.assign({}, this.gameState.player.currentCell.position),
        currentCell: this.gameState.player.currentCell,
        directions: this.gameState.maze.currentShortestPath.slice(0, 3),
        direction: this.gameState.player.direction
      }));
      this.gameState.score -= 25;
      this.addScore(-25, this.gameState.player.currentCell.position);
    }

    shoot(event) {
      this.projectiles.push(new Game.Projectile(Object.assign({
        direction: this.gameState.player.direction,
        mazeSettings: this.mazeSettings
      }, this.getAbsolutePosition(this.gameState.player.position))));
    }

    updatePath(event) {
      let cell = this.gameState.maze.getCell(this.gameState.player.position);
      this.gameState.player.currentCell = cell;
      if (this.gameState.maze.currentShortestPath.length > 1 && cell === this.gameState.maze.currentShortestPath[1].cell) {
        this.gameState.maze.currentShortestPath.shift();
      } else if (cell !== this.gameState.maze.currentShortestPath[0].cell && cell != this.gameState.maze.settings.end) {
        let action;
        switch (event) {
          case EVENTS.MOVE_LEFT:
            action = "right";
            break;
          case EVENTS.MOVE_RIGHT:
          action = "left";
            break;
          case EVENTS.MOVE_UP:
            action = "down";
            break;
          case EVENTS.MOVE_DOWN:
          action = "up";
            break;
        }

        this.gameState.maze.currentShortestPath.unshift({
          cell: cell,
          action: action
        });
      }
    }

    movePlayer(event, elapsedTime) {
      let cell = this.gameState.maze.getCell(this.gameState.player.position);
      if (event === EVENTS.MOVE_LEFT) {
        this.gameState.player.direction = Game.DIRECTION.LEFT;
        if (cell.neighbors.left.connected) {
          this.gameState.player.position.x -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_RIGHT) {
        this.gameState.player.direction = Game.DIRECTION.RIGHT;
        if (cell.neighbors.right.connected) {
          this.gameState.player.position.x += 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_UP) {
        this.gameState.player.direction = Game.DIRECTION.UP;
        if (cell.neighbors.up.connected) {
          this.gameState.player.position.y -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_DOWN) {
        this.gameState.player.direction = Game.DIRECTION.DOWN;
        if (cell.neighbors.down.connected) {
          this.gameState.player.position.y += 1;
          this.numMoves += 1;
        }
      }

      this.updatePath(event);
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

    addScore(points, position) {
      let pos = this.getAbsolutePosition(position);
      this.scores.push(new Game.FloatingText({
        text: (points >= 0 ? "+" : "") + points,
        fillStyle: points >= 0 ? "gold" : "red",
        start: pos,
        end: { x: pos.x, y: pos.y - 40 },
        duration: 1500
      }));
    }

    intersectsMonster(projectileLine) {
      for (const monster of this.monsters) {
        if (monster.getBoundingBox().some((line) => this.intersects(projectileLine[0].x, projectileLine[0].y, projectileLine[1].x, projectileLine[1].y,
          line[0].x, line[0].y, line[1].x, line[1].y))) {
            this.monsters = this.monsters.filter((m) => m !== monster);
            this.addScore(100, monster.currentCell.position);
            this.gameState.score += 100;
            return true;
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

      this.hints = this.hints.filter((hint) => !hint.done);
      for (const hint of this.hints) {
        hint.update(elapsedTime);
      }

      this.scores = this.scores.filter((score) => !score.done);
      for (const score of this.scores) {
        score.update(elapsedTime);
      }

      this.gameState.score -= elapsedTime / 1000;
      this.gameState.time += elapsedTime;

      if (currentCell === this.gameState.maze.settings.end) {
        this.done = true;
        Game.scores.push({
          score: this.gameState.score,
          time: this.gameState.time
        });
      }
    }

    toReadableTime(milliseconds) {
      let seconds = ((milliseconds / 1000) % 60).toFixed().toLocaleString().padStart(2, "0");
      let minutes = (milliseconds / (1000 * 60)).toFixed().toLocaleString().padStart(2, "0");
      
      return minutes + ":" + seconds;
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

      for (const hint of this.hints) {
        hint.render(this.context);
      }

      for (const score of this.scores) {
        score.render(this.context);
      }

      Game.Text.draw(this.context, {
        text: "Score: " + this.gameState.score.toFixed(),
        x: 40,
        y: 40
      });
      Game.Text.draw(this.context, {
        text: "Time: " + this.toReadableTime(this.gameState.time),
        x: this.canvas.width - 250,
        y: 40
      });

      this.updateFog();
    }

    gameLoop(currentTime) {
      if (!this.done) {
        let elapsedTime = currentTime - this.previousTime;
        this.previousTime = currentTime;
      
        this.processInput();
        this.update(elapsedTime);
        this.render(elapsedTime);
      
        requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
      }
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
