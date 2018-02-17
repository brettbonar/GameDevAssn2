Game.MazeGame = (function () {
  Graphics.ImageCache.put("treasure", "Assets/treasure.png");

  const EVENTS = {
    MOVE_UP: 1,
    MOVE_DOWN: 2,
    MOVE_LEFT: 3,
    MOVE_RIGHT: 4,
    SHOOT: 5,
    HINT: 6,
    TOGGLE_BREADCRUMBS: 7,
    TOGGLE_PATH: 8,
    TOGGLE_SCORE: 9,
    QUIT: 10
  };
  
  class MazeGame { 
    constructor(size, hardMode) {
      this.canvas = document.getElementById("canvas-main");
      this.context = this.canvas.getContext("2d");

      this.gameSettings = {
        showBreadcrumbs: false,
        showPath: false,
        showScore: true,
        hardMode: hardMode
      };
      
      this.mazeSettings = {
        gameSettings: this.gameSettings,
        cellSize: 42
      };
      this.mazeSettings.size = {
        rows: size,
        columns: size,
        width: size * this.mazeSettings.cellSize,
        height: size * this.mazeSettings.cellSize
      };
      // Center maze in canvas
      this.mazeSettings.position = {
        x: (this.canvas.width - this.mazeSettings.size.columns * this.mazeSettings.cellSize) / 2,
        y: (this.canvas.height - this.mazeSettings.size.rows * this.mazeSettings.cellSize) / 2
      };

      if (this.gameSettings.hardMode) {
        this.canvasGroup = document.getElementsByClassName("canvas-group")[0];
        this.lightFog = document.createElement("canvas");
        this.lightFog.classList.add("game-canvas");
        this.lightFog.height = this.canvas.height;
        this.lightFog.width = this.canvas.width;
        this.canvasGroup.appendChild(this.lightFog);
        this.lightFogContext = this.lightFog.getContext("2d");
        this.lightFogContext.fillRect(this.mazeSettings.position.x, this.mazeSettings.position.y,
          this.mazeSettings.size.width, this.mazeSettings.size.height);

        this.darkFog = document.createElement("canvas");
        this.darkFog.classList.add("game-canvas");
        this.darkFog.height = this.canvas.height;
        this.darkFog.width = this.canvas.width;
        this.canvasGroup.appendChild(this.darkFog);
        this.darkFogContext = this.darkFog.getContext("2d");
        this.darkFogContext.fillRect(this.mazeSettings.position.x, this.mazeSettings.position.y,
          this.mazeSettings.size.width, this.mazeSettings.size.height);
      }

      this.gameState = {
        maze: new Game.Maze(this.mazeSettings),
        numMoves: 0,
        score: 1000,
        time: 0
      };

      this.projectiles = [];
      this.monsters = [];
      this.hints = [];
      this.scores = [];
      this.treasures = [];
      this.traps = [];

      this.events = [];
      this.keyBindings = {
        27: EVENTS.QUIT, // ESC
        32: EVENTS.SHOOT, // space
        37: EVENTS.MOVE_LEFT,
        38: EVENTS.MOVE_UP,
        39: EVENTS.MOVE_RIGHT,
        40: EVENTS.MOVE_DOWN,
        65: EVENTS.MOVE_LEFT, // A
        66: EVENTS.TOGGLE_BREADCRUMBS, // B
        68: EVENTS.MOVE_RIGHT, // D
        72: EVENTS.HINT, // H
        73: EVENTS.MOVE_UP, // I
        74: EVENTS.MOVE_LEFT, // J
        75: EVENTS.MOVE_DOWN, // K
        76: EVENTS.MOVE_RIGHT, // L
        80: EVENTS.TOGGLE_PATH, // P
        83: EVENTS.MOVE_DOWN, // S
        87: EVENTS.MOVE_UP, // W
        89: EVENTS.TOGGLE_SCORE // Y
      };

      // TODO: capture keypressed and keyup. Keep keydown event in list until keyup
      this.eventHandlers = {
        [EVENTS.QUIT]: (event) => Game.back(),
        [EVENTS.MOVE_LEFT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_RIGHT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_UP]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_DOWN]: (event) => this.movePlayer(event),
        [EVENTS.SHOOT]: (event) => this.shoot(event),
        [EVENTS.HINT]: (event) => this.hint(event),
        [EVENTS.TOGGLE_BREADCRUMBS]: (event) => this.gameSettings.showBreadcrumbs = !this.gameSettings.showBreadcrumbs,
        [EVENTS.TOGGLE_PATH]: (event) => this.showPath(),
        [EVENTS.TOGGLE_SCORE]: (event) => this.gameSettings.showScore = !this.gameSettings.showScore
      };

      this.initializeCharacters();
    }

    showPath() {
      this.gameSettings.showPath = !this.gameSettings.showPath;
      if (this.gameSettings.showPath) {
        this.addScore(-100, this.gameState.player.currentCell.position);
      }
    }

    createRandomMonsters() {
      // Create a new random monster at least half the maze cells away
      for (let i = 0; i < this.mazeSettings.size.columns / 10; i++) {
        let x = Math.floor(Math.random() * this.mazeSettings.size.columns / 2) + this.mazeSettings.size.columns / 2;
        let y = Math.floor(Math.random() * this.mazeSettings.size.rows / 2) + this.mazeSettings.size.rows / 2;
        this.monsters.push(new Game.Monster({
          currentCell: this.gameState.maze.getCell({ x: Math.floor(x), y: Math.floor(y)}),
          mazeSettings: this.mazeSettings
        }));
      }
    }

    createRandomTraps() {
      for (let i = 0; i < this.mazeSettings.size.columns / 4; i++) {
        let x = Math.floor(Math.random() * this.mazeSettings.size.columns - 1) + 1;
        let y = Math.floor(Math.random() * this.mazeSettings.size.rows - 1) + 1;
        this.traps.push(new Game.Trap({
          currentCell: this.gameState.maze.getCell({ x: Math.floor(x), y: Math.floor(y)}),
          mazeSettings: this.mazeSettings
        }));
      }
    }

    initializeCharacters() {
      this.gameState.player = new Game.Player({
        mazeSettings: this.mazeSettings,
        position: Object.assign({}, this.gameState.maze.settings.start.position),
        currentCell: this.gameState.maze.getCell({ x: 0, y: 0 })
      });

      if (this.gameSettings.hardMode) {
        this.createRandomMonsters();
        this.createRandomTraps();
      }      

      // Create a new treasure chest at least half the maze cells away
      let x = Math.floor(Math.random() * this.mazeSettings.size.columns / 2) + this.mazeSettings.size.columns / 2;
      let y = Math.floor(Math.random() * this.mazeSettings.size.rows / 2) + this.mazeSettings.size.rows / 2;
      this.treasures.push(this.gameState.maze.getCell({ x: Math.floor(x), y: Math.floor(y)}));
    }

    // Thanks to https://codepen.io/zyklus/pen/prvnb
    updateFog() {
      let pos = this.getAbsolutePosition(this.gameState.player.currentCell.position);
      // partially hide the entire map and re-reval where we are now
      this.lightFogContext.globalCompositeOperation = "source-over";
      this.lightFogContext.clearRect( this.mazeSettings.position.x, this.mazeSettings.position.y, this.mazeSettings.size.width, this.mazeSettings.size.height );
      this.lightFogContext.fillStyle = "rgba( 0, 0, 0, .7 )";
      this.lightFogContext.fillRect ( this.mazeSettings.position.x, this.mazeSettings.position.y, this.mazeSettings.size.width, this.mazeSettings.size.height );

      let r1 = this.mazeSettings.cellSize * 2;
      let r2 = this.mazeSettings.cellSize * 4;

      var radGrd = this.lightFogContext.createRadialGradient( pos.x, pos.y, 
        r1, pos.x, pos.y, r2);
      radGrd.addColorStop(  0, "rgba( 0, 0, 0,  1 )" );
      radGrd.addColorStop( .8, "rgba( 0, 0, 0, .1 )" );
      radGrd.addColorStop(  1, "rgba( 0, 0, 0,  0 )" );

      this.lightFogContext.globalCompositeOperation = "destination-out";
      this.lightFogContext.fillStyle = radGrd;
      this.lightFogContext.fillRect( pos.x - 300, pos.y - 300, 300*2, 300*2 );

      // Context 2 stays dark black, but is never cleared
      var radGrd = this.darkFogContext.createRadialGradient( pos.x, pos.y, r1, pos.x, pos.y, r2 );
      radGrd.addColorStop(  0, "rgba( 0, 0, 0,  1 )" );
      radGrd.addColorStop( .8, "rgba( 0, 0, 0, .1 )" );
      radGrd.addColorStop(  1, "rgba( 0, 0, 0,  0 )" );

      this.darkFogContext.globalCompositeOperation = "destination-out";
      this.darkFogContext.fillStyle = radGrd;
      this.darkFogContext.fillRect( pos.x - r2, pos.y - r2, r2*2, r2*2 );
    }

    getAbsolutePosition(position) {
      return {
        x: position.x * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.x,
        y: position.y * this.mazeSettings.cellSize + this.mazeSettings.cellSize / 2 + this.mazeSettings.position.y
      };
    }

    end() {
      if (this.lightFog) {
        this.canvasGroup.removeChild(this.lightFog);
        this.canvasGroup.removeChild(this.darkFog);
      }
    }

    hint(event) {
      this.hints.push(new Game.HintGhost({
        mazeSettings: this.mazeSettings,
        position: Object.assign({}, this.gameState.player.currentCell.position),
        currentCell: this.gameState.player.currentCell,
        directions: this.gameState.maze.currentShortestPath.slice(0, 3),
        direction: this.gameState.player.direction
      }));
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
          this.gameState.score -= 1;
        }
      } else if (event === EVENTS.MOVE_RIGHT) {
        this.gameState.player.direction = Game.DIRECTION.RIGHT;
        if (cell.neighbors.right.connected) {
          this.gameState.player.position.x += 1;
          this.numMoves += 1;
          this.gameState.score -= 1;
        }
      } else if (event === EVENTS.MOVE_UP) {
        this.gameState.player.direction = Game.DIRECTION.UP;
        if (cell.neighbors.up.connected) {
          this.gameState.player.position.y -= 1;
          this.numMoves += 1;
          this.gameState.score -= 1;
        }
      } else if (event === EVENTS.MOVE_DOWN) {
        this.gameState.player.direction = Game.DIRECTION.DOWN;
        if (cell.neighbors.down.connected) {
          this.gameState.player.position.y += 1;
          this.numMoves += 1;
          this.gameState.score -= 1;
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
        if ((!this.done || event === EVENTS.QUIT) && this.eventHandlers[event]) {
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
      this.gameState.score += points;
      let pos = this.getAbsolutePosition(position);
      this.scores.push(new Graphics.FloatingText({
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
            return true;
          }
      }

      return false;
    }

    evaluatePlayerPosition(currentCell) {
      if (currentCell !== this.gameState.maze.visitedCells[this.gameState.maze.visitedCells.length - 1]) {
        currentCell.visited = true;
        this.gameState.maze.visitedCells.push(currentCell);
      }

      if (this.treasures.includes(currentCell)) {
        this.addScore(100, currentCell.position);
        this.treasures.splice(this.treasures.indexOf(currentCell), 1);
      }

      let activeTraps = this.traps.filter((trap) => trap.active);
      for (const trap of activeTraps) {
        if (trap.currentCell === currentCell && !trap.hit) {
          trap.hit = true;
          this.addScore(-50, currentCell.position);
        } else if (trap.currentCell !== currentCell) {
          trap.hit = false;
        }
      }

      if (currentCell === this.gameState.maze.settings.end) {
        this.done = true;
        Game.scores.push({
          score: this.gameState.score,
          time: this.toReadableTime(this.gameState.time),
          size: this.mazeSettings.size.rows,
          hardMode: this.gameSettings.hardMode
        });
      }
    }

    update(elapsedTime) {
      if (this.done) {
        return;
      }

      let currentCell = 
        this.gameState.maze.getCell(this.gameState.player.position);

      this.monsters = this.monsters.filter((monster) => !monster.dead);
      for (const monster of this.monsters) {
        monster.update(elapsedTime, currentCell);
        if (monster.currentCell === currentCell) {
          monster.dead = true;
          this.addScore(-100, monster.currentCell.position);
        }
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

      for (const trap of this.traps) {
        trap.update(elapsedTime);
      }

      this.gameState.score -= elapsedTime / 1000;
      this.gameState.time += elapsedTime;

      this.evaluatePlayerPosition(currentCell);
    }

    toReadableTime(milliseconds) {
      let seconds = ((milliseconds / 1000) % 60).toFixed().toLocaleString().padStart(2, "0");
      let minutes = (milliseconds / (1000 * 60)).toFixed().toLocaleString().padStart(2, "0");
      
      return minutes + ":" + seconds;
    }

    drawTreasure(cell) {
      let img = Graphics.ImageCache.get("treasure");
      let pos = this.getAbsolutePosition(cell.position);
      let imgWidth = this.mazeSettings.cellSize / 2;
      let imgHeight = imgWidth * img.height / img.width;
      this.context.drawImage(img, pos.x - 15, pos.y - 10, this.mazeSettings.cellSize / 2, this.mazeSettings.cellSize / 2);
    }

    drawVictory() {
      this.context.save();
      this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.restore();

      if (this.gameSettings.hardMode) {
        this.lightFogContext.clearRect(0, 0, this.lightFog.width, this.lightFog.height);
        this.darkFogContext.clearRect(0, 0, this.darkFog.width, this.darkFog.height);
      }

      Graphics.Text.draw(this.context, {
        text: "Victory!",
        font: "60px Comic Sans MS",
        textAlign: "center",
        x: this.canvas.width / 2,
        y: this.canvas.height / 2
      });
    }

    drawScores() {
      let scoreText = "Score: " + this.gameState.score.toFixed();
      if (this.gameSettings.showScore) {
        Graphics.Text.draw(this.context, {
          text: scoreText,
          x: this.mazeSettings.position.x,
          y: this.mazeSettings.position.y - 30
        });
      }

      let timex = this.mazeSettings.position.x + this.mazeSettings.size.width - 150;
      let timey = this.mazeSettings.position.y - 30;
      let timeText = "Time: " + this.toReadableTime(this.gameState.time);
      if (this.mazeSettings.size.width < this.context.measureText(scoreText + timeText).width) {
        timex = this.mazeSettings.position.x;
        timey = this.mazeSettings.position.y + this.mazeSettings.size.height + 40;
      }

      Graphics.Text.draw(this.context, {
        text: timeText,
        x: timex,
        y: timey
      });
    }

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.gameState.maze.render(this.context);

      for (const trap of this.traps) {
        trap.render(this.context);
      }

      for (const treasure of this.treasures) {
        this.drawTreasure(treasure);
      }

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

      if (this.gameSettings.hardMode) {
        this.updateFog();
      }

      this.drawScores();

      if (this.done) {
        this.drawVictory();
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

  return MazeGame;
})();
