// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels
const GRID_SIZE = 32;
const CLOCK_SPEED = 64;
const TILE_SIZE = BOARD_SIZE / GRID_SIZE;

// DOM elements
var high_score;
var board;
var scoreBoard;

// Game variables
var timer;
var score = 0;
var hScore = 0;
var snake;
var food;


// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
	$(document).keydown(keyPressed);
});

// Handle key presses for the arrow keys
function keyPressed(e){
	var code = e.keyCode;
	if(code == 37){
		if(!equals(snake.tail[0].y, snake.tail[1].y)){
			snake.x_direction = -1;
			snake.y_direction = 0;
		}
	}
	if(code == 38){
		if(!equals(snake.tail[0].x, snake.tail[1].x)){
			snake.x_direction = 0;
			snake.y_direction = -1;
		}
	}
	if(code == 39){
		if(!equals(snake.tail[0].y, snake.tail[1].y)){
			snake.x_direction = 1;
			snake.y_direction = 0;
		}
	}
	if(code == 40){
		if(!equals(snake.tail[0].x, snake.tail[1].x)){
			snake.x_direction = 0;
			snake.y_direction = 1;
		}
	}
}

//restart the game
function reset(){
	clearInterval(timer);

	snake = new Snake();
	food = new Food();
	score = 0;

	timer = setInterval(gameLoop, CLOCK_SPEED);
}
// Game over
function gameOver(){
	clearInterval(timer);
	board.clearRect(0, 0, 512, 512);
}

// Main game loop
function gameLoop(){
	checkEat();
	snake.update();
	draw();

	// update the score board
	scoreBoard.html("Score: " + score.toString());
	high_score.html("High Score: " + hScore.toString());
}

// Draw the current state to the canvas
function draw(){
	board.clearRect(0, 0, 512, 512);
	food.draw();
	snake.draw();
}

// approximate equals
function equals(x, y){
	return Math.abs(x-y) < .01;
}

// Check if the snake is on the food
function checkEat(){
	if(equals(snake.tail[0].x, food.position.x) && equals(snake.tail[0].y, food.position.y)){
		food = new Food();
		snake.grow();
		score++;
		hScore = Math.max(hScore, score);
	}
}




/////////////////////////////////////////////////
// 				Object Implementations 			/
/////////////////////////////////////////////////

// Represents a square on the board
function Point(x, y){
	this.x = x;
	this.y = y;

	this.draw = function(){
		board.fillRect(this.x*TILE_SIZE, this.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
	}
}

// Object for the snake
function Snake(){

	//initialize the snake to a length of three at the center of the board
	this.tail = [new Point(GRID_SIZE/2, GRID_SIZE/2), new Point(GRID_SIZE/2-1, GRID_SIZE/2), new Point(GRID_SIZE/2-2, GRID_SIZE/2)];
	this.x_direction = 1;
	this.y_direction = 0;

	this.draw = function(){
		board.fillStyle = "yellow";
		for(var i = 0; i < this.tail.length; i++){
			this.tail[i].draw();
		}
	}

	this.update = function(){
		// update the position
		for(var i = this.tail.length-1; i > 0; i--){
			this.tail[i].x = this.tail[i-1].x;
			this.tail[i].y = this.tail[i-1].y;
		}
		this.tail[0].x += this.x_direction;
		this.tail[0].y += this.y_direction;

		//boundaries
		if(this.tail[0].x >= GRID_SIZE)
			gameOver();
		if(this.tail[0].x < 0)
			gameOver();
		if(this.tail[0].y >= GRID_SIZE)
			gameOver();
		if(this.tail[0].y < 0)
			gameOver();

		//check for collision
		for(var i = 1; i < this.tail.length; i++){
			if(equals(this.tail[0].x, this.tail[i].x) && equals(this.tail[0].y, this.tail[i].y))
				gameOver();
		}
	}

	this.grow = function(){
		this.tail.push(new Point(0,0))
	}
}

// Represents the food
function Food(){
	this.position = new Point(0, 0);

	//set a new random position that isn't on the snake
	while(true){

		this.position.x = Math.floor(Math.random() * GRID_SIZE);
		this.position.y = Math.floor(Math.random() * GRID_SIZE);

		for(var i = 0; i < snake.tail.length; i++)
			if(equals(this.position.x, snake.tail[i].x) && equals(this.position.y, snake.tail[i].y))
				continue;
		break;
	}
	
	this.draw = function(){
		board.fillStyle = "red";
		this.position.draw();
	}
}