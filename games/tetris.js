// Starter code for new games

// Global constants
const BOARD_SIZE = 525;	// Canvas size in pixels
const TILE_SIZE = 25;
const GRID_WIDTH = 12;
const GRID_HEIGHT = BOARD_SIZE/TILE_SIZE;
const GRID_SIZE = GRID_WIDTH*TILE_SIZE;
const CLOCK_SPEED = 1000;


// DOM elements
var high_score;
var board;
var scoreBoard;

// Game variables
var timer;
var score = 0;
var hScore = 0;
var piece;
var grid;
var nextPiece;


// store some DOM elements when the document is loaded
// add key press listeners
// set the title and controls
$(document).ready(function(){
	// set board size
	$("canvas").remove();
	$("#game-container").prepend("<canvas id='board' width='525' height='525'></canvas>");

	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
	$(document).keydown(keyPressed);

	// set titles
	$("#game-title").text("Tetris");
	$("title").text("Javascript Arcade - Tetris");

	// set controls
	$("#controls").append("<p>Up Arrow: Rotate piece 90&deg;</p>");
	$("#controls").append("<p>Right Arrow: Move piece right</p>");
	$("#controls").append("<p>Left Arrow: Move piece left</p>");
	$("#controls").append("<p>Down Arrow: Move piece down one</p>");
	$("#controls").append("<p>Spacebar: Drop piece</p>");
});

//restart the game
function reset(){
	$("game-over").hide();
	clearInterval(timer);

	score = 0;
	piece = new Piece();
	grid = new Array(GRID_HEIGHT);
	for(var i = 0; i < GRID_HEIGHT; i++){
		grid[i] = new Array(GRID_WIDTH);
		for(var j = 0; j < GRID_WIDTH; j++)
			grid[i][j] = null;
	}
	draw();

	timer = setInterval(gameLoop, CLOCK_SPEED);
}

// Game over
function gameOver(){
	clearInterval(timer);
	$("game-over").show();
}

// Handle key presses for the arrow keys
function keyPressed(e){
	var code = e.keyCode;
	if((code >= 37 && code <= 40) || code == 32){
		e.preventDefault();
		if(code == 38)
			piece.rotate();
		if(code == 37)
			piece.moveLeft();
		if(code == 39)
			piece.moveRight();
		if(code == 40)
			piece.moveDown();
		if(code == 32){
			piece.drop();
			setPiece();
		}
		draw();
	}
}

// Main game loop
function gameLoop(){

	// move the piece down 
	// set the piece and get a new one
	if(!piece.moveDown())
		setPiece();

	// check if we cleared any rows
	checkRows();

	draw();

	// update the score board
	scoreBoard.html("Score: " + score.toString());
	high_score.html("High Score: " + hScore.toString());
}

// Draw the current state to the canvas
function draw(){
	board.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
	piece.draw();

	// draw the blocks on the board
	for(var i = 0; i < GRID_HEIGHT; i++)
		for(var j = 0; j < GRID_WIDTH; j++)
			if(grid[i][j] != null){
				var b = new Block(j, i, grid[i][j]);
				b.draw();
			}
	
	//draw the separating line
	board.strokeStyle = "white";
	board.beginPath();
	board.moveTo(GRID_SIZE, 0);
	board.lineTo(GRID_SIZE, BOARD_SIZE);
	board.stroke();

}

// place the piece on the board
// re-initialze a new piece
function setPiece(){
	//add to the grid
	var blocks = [new Block(piece.x, piece.y, piece.color)];
	for(var i = 0; i < 3; i++)
		blocks.push(new Block(piece.x + piece.blocks[i][0], piece.y + piece.blocks[i][1], piece.color));
	blocks.forEach((b) => {
		grid[b.y][b.x] = b.color;
	});

	// get new piece
	piece = new Piece();
}

// check if any rows are completed
function checkRows(){
	for(var y = 0; y < GRID_HEIGHT; y++){
		var completed = true;
		for(var x = 0; x < GRID_WIDTH; x++)
			if(grid[y][x] == null)
				completed = false;

		// if the row is completed, clear it and shift everything down
		if(completed){
			grid.splice(y, 1);
			var newLine = new Array(GRID_WIDTH);
			for(var i = 0; i < GRID_WIDTH; i++)
				newLine[i] == null;
			grid.splice(0, 0, newLine);
		}
	}
}

/////////////////////////////////////////////////
// 				Object Implementations 			/
/////////////////////////////////////////////////

// Represents a square on the board
function Block(x, y, c){
	this.x = x;
	this.y = y;
	this.color = c;

	this.draw = function(){
		board.fillStyle = "gray";
		board.fillRect(this.x*TILE_SIZE, this.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
		board.fillStyle = this.color;
		board.fillRect(this.x*TILE_SIZE+1, this.y*TILE_SIZE+1, TILE_SIZE-2, TILE_SIZE-2);
	}
}

/*
BLOCK TYPES:
0: I
1: O
2: T
3: J
4: L
5: S
6: Z
*/
function Piece(x, y){
	this.x = 6;
	this.y = 0;
	var type = Math.floor(Math.random() * 7);

	switch(type){
		case 0:
			this.blocks = [[-1, 0], [1, 0], [2, 0]];
			this.color = "#00ffff";
			break;
		case 1:
			this.blocks = [[1, 0], [0, 1], [1, 1]];
			this.color = "#ffff00";
			break;
		case 2:
			this.blocks = [[-1, 0], [1, 0], [0, 1]];
			this.color = "#aa00ff";
			break;
		case 3:
			this.blocks = [[-1, 0], [1, 0], [1, 1]];
			this.color = "#0000ff";
			break;
		case 4:
			this.blocks = [[1, 0], [-1, 0], [-1, 1]];
			this.color = "#ff6e00";
			break;
		case 5:
			this.blocks = [[1, 0], [0, 1], [-1, 1]];
			this.color = "#00ff00";
			break;
		case 6:
			this.blocks = [[-1, 0], [0, 1], [1, 1]];
			this.color = "#ff0000";
			break;
	}

	this.draw = function(){
		var blocks = [new Block(this.x, this.y, this.color)];
		for(var i = 0; i < 3; i++)
			blocks.push(new Block(this.x + this.blocks[i][0], this.y + this.blocks[i][1], this.color));
		blocks.forEach((b) => {b.draw();});
	}

	// return if the piece is on the screen
	this.validSpot = function(){
		// check bounds
		if(this.x < 0 || this.x >= GRID_WIDTH)
			return false;
		if(this.y < 0 || this.y >= GRID_HEIGHT)
			return false;
		// check other pieces
		if(grid[this.y][this.x] != null)
			return false;

		for(var i = 0; i < 3; i++){
			var x = this.x + this.blocks[i][0];
			var y = this.y + this.blocks[i][1];

			// check bounds
			if(x < 0 || x >= GRID_WIDTH)
				return false;
			if(y < 0 || y >= GRID_HEIGHT)
				return false;

			// check other pieces
			if(grid[y][x] != null)
				return false;
		}

		


		return true;
	}

	this.moveDown = function(){
		this.y++
		if(!this.validSpot()){
			this.y--;
			return false;
		}
		return true;
	}

	// rotate the piece 90 degrees
	this.rotate = function(){
		for(var i = 0; i < 3; i++){
			temp = this.blocks[i][0];
			this.blocks[i][0] = this.blocks[i][1];
			this.blocks[i][1] = temp * -1;
		}
		if(!this.validSpot()){
			for(var i = 0; i < 3; i++){
				temp = this.blocks[i][0];
				this.blocks[i][0] = this.blocks[i][1] * -1;
				this.blocks[i][1] = temp;
			}
		}
	}

	this.moveLeft = function(){
		this.x--;
		if(!this.validSpot())
			this.x++;
	}
	this.moveRight = function(){
		this.x++;
		if(!this.validSpot())
			this.x--;
	}
	this.drop = function(){
		while(this.moveDown()){}
	}
}