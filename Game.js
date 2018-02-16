(function () {

  Game.newGame = function () {
    Game.thisGame = new Game.MazeGame();
    Game.thisGame.start();
  };

  Game.highScores = function () {
    // Get the modal
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

  };

  Game.scores = [];

  Game.DIRECTION = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  Game.credits = function () {
  };
})();
