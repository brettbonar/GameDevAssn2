(function () {
  class MazeGame { 
    constructor() {
      // TODO: pass this in
      this.canvas = document.getElementById("canvas-main");
      this.context = this.canvas.getContext("2d");
      this.gameState = {
        maze: new Game.Maze({ size: 10 })
      };
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
    
      this.update(elapsedTime);
      this.render(elapsedTime);
    
      requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
    }
      
    start() {
      this.previousTime = performance.now();
      requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
    }
  }

  Game.MazeGame = MazeGame;
  setTimeout(function () {
    Game.thisGame = new MazeGame();
    Game.thisGame.start();
  });
})();
