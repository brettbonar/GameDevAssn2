class Cell {
  constructor(position) {
    this.position = position;
    this.neighbors = {
      up: null,
      down: null,
      left: null,
      right: null
    };
  }
}

class Maze {
  constructor(settings) {
    this.settings = settings;
    this.maze = new Array(settings.size);
    for (let row = 0; row < settings.size; row++) {
      this.maze[row] = new Array(settings.size);
      for (let col = 0; col < settings.size; col++) {
        this.maze[row][col] = new Cell({ row: row, col: col });
      }
    }
  }
}
