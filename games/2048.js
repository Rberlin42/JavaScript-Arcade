// Starter code for new games

// Global constants
const BOARD_SIZE = 512;	// Canvas BOARD_SIZE in pixels
var gridLength = 122; //(BOARD_SIZE/ 4) - 6;
var fontSize = 60;// gridLength / 2


// DOM elements
var high_score;
var board;
var scoreBoard;
var grids = [];
var score = 0;
var hScore = 0;


// store some DOM elements when the document is loaded
// add key press listeners
// set the title and controls
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
  high_score = $("#hs");
  $("#board").css("background-color", "black");
  $(document).keydown(keyPressed);
    
  createGrids();
  drawAllGrids();
  pasteNewGrid();
  pasteNewGrid();

	// set titles
	$("#game-title").text("2048");
	$("title").text("Javascript Arcade - 2048");

	// set controls
	$("#controls").append("<p>Arrow Keys: move the grids</p>");
});


function grid(row, coll) {
    this.value = 0;
    this.x = coll * gridLength + 5 * (coll + 1);
    this.y = row * gridLength + 5 * (row + 1);
}

//fill the grids[] with null grid
function createGrids() {
    var i, j;
    for(i = 0; i < 4; i++) {
      grids[i] = [];
      for(j = 0; j < 4; j++) {
        grids[i][j] = new grid(i, j);
      }
    }
}

// Handle key presses for the arrow keys
function keyPressed(e){
	var code = e.keyCode;
	if(code == 37){
		slideLeft();
	}
	if(code == 38){
		slideUp();
	}
	if(code == 39){
		slideRight();
	}
	if(code == 40){
		slideDown();
	}
}

//restart the game
function reset(){
	$("#game-over").hide();
	// called when the start button is clicked
    // Add code to start/restart the game
    createGrids();
    drawAllGrids();
    pasteNewGrid();
    pasteNewGrid();
}

// Game over
function gameOver(){
	$("#game-over").show();
}


function draw(){
    board.clearRect(0, 0, 512, 512);
    drawgird();
}



function drawGrid(grid) {
    board.beginPath();
    board.rect(grid.x, grid.y, gridLength, gridLength);
    switch (grid.value){
      case 0 : board.fillStyle = '#A9A9A9'; break;
      case 2 : board.fillStyle = '#D2691E'; break;
      case 4 : board.fillStyle = '#FF7F50'; break;
      case 8 : board.fillStyle = '#ffbf00'; break;
      case 16 : board.fillStyle = '#bfff00'; break;
      case 32 : board.fillStyle = '#40ff00'; break;
      case 64 : board.fillStyle = '#00bfff'; break;
      case 128 : board.fillStyle = '#FF7F50'; break;
      case 256 : board.fillStyle = '#0040ff'; break;
      case 512 : board.fillStyle = '#ff0080'; break;
      case 1024 : board.fillStyle = '#D2691E'; break;
      case 2048 : board.fillStyle = '#FF7F50'; break;
      case 4096 : board.fillStyle = '#ffbf00'; break;
      default : board.fillStyle = '#ff0080';
    }
    board.fill();
    if (grid.value) {
      board.font = fontSize + 'px Arial';
      board.fillStyle = 'white';
      board.textAlign = 'center';
      board.fillText(grid.value, grid.x + gridLength / 2, grid.y + gridLength / 2 + gridLength/7);
    }
}

function drawAllGrids() {
    var i, j;
    for(i = 0; i < 4; i++) {
      for(j = 0; j < 4; j++) {
        drawGrid(grids[i][j]);
      }
    }
}

function pasteNewGrid() {
    var countFree = 0;
    var i, j;
    for(i = 0; i < 4; i++) {
      for(j = 0; j < 4; j++) {
        if(!grids[i][j].value) {
          countFree++;
        }
      }
    }
    if(!countFree) {
      gameOver();
      return;
    }
    while(true) {
      var row = Math.floor(Math.random() * 4);
      var coll = Math.floor(Math.random() * 4);
      if(!grids[row][coll].value) {
        grids[row][coll].value = 2 * Math.ceil(Math.random() * 2);
        drawAllGrids();
        return;
      }
    }
}



function slideRight () {
    var i, j;
    var coll;
    for(i = 0; i < 4; i++) {
      for(j = 4 - 2; j >= 0; j--) {
        if(grids[i][j].value) {
          coll = j;
          while (coll + 1 < 4) {
            if (!grids[i][coll + 1].value) {
              grids[i][coll + 1].value = grids[i][coll].value;
              grids[i][coll].value = 0;
              coll++;
            } else if (grids[i][coll].value == grids[i][coll + 1].value) {
              grids[i][coll + 1].value *= 2;
              score +=  grids[i][coll + 1].value;
              hScore = Math.max(hScore, score);
              scoreBoard.html("Score: " + score.toString());
              high_score.html("High Score: " + hScore.toString());
              grids[i][coll].value = 0;
              break;
            } else {
              break;
            }
          }
        }
      }
    }
    pasteNewGrid();
  }
  
  function slideLeft() {
    var i, j;
    var coll;
    for(i = 0; i < 4; i++) {
      for(j = 1; j < 4; j++) {
        if(grids[i][j].value) {
          coll = j;
          while (coll - 1 >= 0) {
            if (!grids[i][coll - 1].value) {
              grids[i][coll - 1].value = grids[i][coll].value;
              grids[i][coll].value = 0;
              coll--;
            } else if (grids[i][coll].value == grids[i][coll - 1].value) {
              grids[i][coll - 1].value *= 2;
              score +=   grids[i][coll - 1].value;
              hScore = Math.max(hScore, score);
              scoreBoard.html("Score: " + score.toString());
              high_score.html("High Score: " + hScore.toString());
              grids[i][coll].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewGrid();
  }
  
  function slideUp() {
    var i, j, row;
    for(j = 0; j < 4; j++) {
      for(i = 1; i < 4; i++) {
        if(grids[i][j].value) {
          row = i;
          while (row > 0) {
            if(!grids[row - 1][j].value) {
              grids[row - 1][j].value = grids[row][j].value;
              grids[row][j].value = 0;
              row--;
            } else if (grids[row][j].value == grids[row - 1][j].value) {
              grids[row - 1][j].value *= 2;
              score +=  grids[row - 1][j].value;
              hScore = Math.max(hScore, score);
              scoreBoard.html("Score: " + score.toString());
              high_score.html("High Score: " + hScore.toString());
              grids[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewGrid();
  }
  
  function slideDown() {
    var i, j, row;
    for(j = 0; j < 4; j++) {
      for(i = 4 - 2; i >= 0; i--) {
        if(grids[i][j].value) {
          row = i;
          while (row + 1 < 4) {
            if (!grids[row + 1][j].value) {
              grids[row + 1][j].value = grids[row][j].value;
              grids[row][j].value = 0;
              row++;
            } else if (grids[row][j].value == grids[row + 1][j].value) {
              grids[row + 1][j].value *= 2;
              score +=  grids[row + 1][j].value;
              hScore = Math.max(hScore, score);
              scoreBoard.html("Score: " + score.toString());
              high_score.html("High Score: " + hScore.toString());
              grids[row][j].value = 0;
              break;
            } else {
              break; 
            }
          }
        }
      }
    }
    pasteNewGrid();
  }