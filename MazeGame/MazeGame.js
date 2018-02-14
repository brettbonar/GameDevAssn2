(function () {
  const EVENTS = {
    MOVE_UP: 1,
    MOVE_DOWN: 2,
    MOVE_LEFT: 3,
    MOVE_RIGHT: 4
  };
  
  class MazeGame { 
    constructor() {
      // TODO: pass this in
      this.canvas = document.getElementById("canvas-main");
      this.canvas.style.width = "800px";
      this.canvas.style.height = "800px";
      this.context = this.canvas.getContext("2d");
      this.mazeSettings = {
        size: {
          rows: 20,
          columns: 20,
          width: this.canvas.width,
          height: this.canvas.height
          // width: this.canvas.width / 2,
          // height: this.canvas.height / 2
        }
      };
      this.mazeSettings.cellSize = 48;
      // Center maze in canvas
      this.mazeSettings.position = {
        x: (this.canvas.width - this.mazeSettings.size.columns * this.mazeSettings.cellSize) / 2,
        y: (this.canvas.height - this.mazeSettings.size.rows * this.mazeSettings.cellSize) / 2
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

      this.events = [];
      this.keyBindings = {
        37: EVENTS.MOVE_LEFT,
        38: EVENTS.MOVE_UP,
        39: EVENTS.MOVE_RIGHT,
        40: EVENTS.MOVE_DOWN
      };
      this.eventHandlers = {
        [EVENTS.MOVE_LEFT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_RIGHT]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_UP]: (event) => this.movePlayer(event),
        [EVENTS.MOVE_DOWN]: (event) => this.movePlayer(event)
      };
    }

    movePlayer(event) {
      let cell = this.gameState.maze.getCell(this.gameState.player.position);
      if (event === EVENTS.MOVE_LEFT) {
        this.gameState.player.orientation = -1;
        if (cell.neighbors.left.connected) {
          this.gameState.player.position.x -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_RIGHT) {
        this.gameState.player.orientation = 1;
        if (cell.neighbors.right.connected) {
          this.gameState.player.position.x += 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_UP) {
        if (cell.neighbors.up.connected) {
          this.gameState.player.position.y -= 1;
          this.numMoves += 1;
        }
      } else if (event === EVENTS.MOVE_DOWN) {
        if (cell.neighbors.down.connected) {
          this.gameState.player.position.y += 1;
          this.numMoves += 1;
        }
      }
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

    update() {
      let currentCell = 
        this.gameState.maze.getCell(this.gameState.player.position);
      currentCell.visited = true;
      this.gameState.maze.visitedCells.push(currentCell);
    }

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.gameState.maze.render(this.context);
      this.gameState.player.render(this.context);
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
  setTimeout(function () {
    Game.thisGame = new MazeGame();
    Game.thisGame.start();
  });
})();
