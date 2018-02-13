(function () {
  const EVENTS = {
    MOVE_UP: 0,
    MOVE_DOWN: 1,
    MOVE_LEFT: 2,
    MOVE_RIGHT: 3
  };
  
  class MazeGame { 
    constructor() {
      // TODO: pass this in
      this.canvas = document.getElementById("canvas-main");
      this.context = this.canvas.getContext("2d");
      this.gameState = {
        maze: new Game.Maze({
          size: {
            rows: 20, columns: 20
          }
        }),
        player: new Game.Character({

        })
      };
      this.inputs = [];
      this.keyBindings = {
        37: EVENTS.MOVE_LEFT,
        38: EVENTS.MOVE_UP,
        39: EVENTS.MOVE_RIGHT,
        40: EVENTS.MOVE_DOWN
      };
      this.eventHandlers = {};

      this.eventHandlers[EVENTS.MOVE_LEFT] = function (event) {
        this.gameState.player.move(event);
      }
      this.eventHandlers[EVENTS.MOVE_RIGHT] = function (event) {
        this.gameState.player.move(event);
      }
      this.eventHandlers[EVENTS.MOVE_UP] = function (event) {
        this.gameState.player.move(event);
      }
      this.eventHandlers[EVENTS.MOVE_DOWN] = function (event) {
        this.gameState.player.move(event);
      }
    }

    handleKeyEvent(e) {
      let event = this.keyBindings[e.keyCode];
      if (event) {
        this.inputs.push(event);
      }
    }

    processInput() {
      // TODO: stuff
    }

    update() {
      // TODO: stuff
    }

    render() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.gameState.maze.render(this.context);
      //this.gameState.player.render(this.context);
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
