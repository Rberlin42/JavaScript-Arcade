/////////////////////////////////////////////////
// 				Game Levels 					/
/////////////////////////////////////////////////
const LEVELS = [
	[{"x":0, "y":25, "w":1}, {"x":128, "y":25, "w":1}, {"x":256, "y":25, "w":1}, {"x":384, "y":25, "w":1},
	 {"x":64, "y":50, "w":1}, {"x":192, "y":50, "w":1}, {"x":320, "y":50, "w":1}, {"x":448, "y":50, "w":1}],

	[{"x":0, "y":25, "w":1}, {"x":128, "y":25, "w":1}, {"x":256, "y":25, "w":1}, {"x":384, "y":25, "w":1},
	 {"x":64, "y":50, "w":2}, {"x":192, "y":50, "w":2}, {"x":320, "y":50, "w":2}, {"x":448, "y":50, "w":2},
	 {"x":0, "y":75, "w":3}, {"x":128, "y":75, "w":3}, {"x":256, "y":75, "w":3}, {"x":384, "y":75, "w":3}],

	[{"x":64, "y":25, "w":1}, {"x":128, "y":25, "w":1}, {"x":192, "y":25, "w":1}, {"x":256, "y":25, "w":1}, {"x":320, "y":25, "w":1}, {"x":384, "y":25, "w":1}, 
	 {"x":64, "y":50, "w":2}, {"x":128, "y":50, "w":2}, {"x":192, "y":50, "w":2}, {"x":256, "y":50, "w":2}, {"x":320, "y":50, "w":2}, {"x":384, "y":50, "w":2},
	 {"x":64, "y":75, "w":3}, {"x":128, "y":75, "w":3}, {"x":192, "y":75, "w":3}, {"x":256, "y":75, "w":3}, {"x":320, "y":75, "w":3}, {"x":384, "y":75, "w":3},
	 {"x":64, "y":100, "w":4}, {"x":128, "y":100, "w":4}, {"x":192, "y":100, "w":4}, {"x":256, "y":100, "w":4}, {"x":320, "y":100, "w":4}, {"x":384, "y":100, "w":4}],

	[{"x":0, "y":25, "w":5}, {"x":64, "y":25, "w":5}, {"x":128, "y":25, "w":5}, {"x":192, "y":25, "w":5},
	 {"x":256, "y":25, "w":5}, {"x":320, "y":25, "w":5}, {"x":384, "y":25, "w":5}, {"x":448, "y":25, "w":5},
	 {"x":0, "y":125, "w":5}, {"x":64, "y":125, "w":5}, {"x":128, "y":125, "w":5}, {"x":192, "y":125, "w":5},
	 {"x":256, "y":125, "w":5}, {"x":320, "y":125, "w":5}, {"x":384, "y":125, "w":5}, {"x":448, "y":125, "w":5},
	 {"x":0, "y":50, "w":5}, {"x":0, "y":100, "w":5}, {"x":448, "y":50, "w":5}, {"x":448, "y":100, "w":5},
	 {"x":64, "y":75, "w":3}, {"x":128, "y":75, "w":2}, {"x":192, "y":75, "w":1},
	 {"x":256, "y":75, "w":1}, {"x":320, "y":75, "w":2}, {"x":384, "y":75, "w":3}],

	[{"x":0, "y":25, "w":5}, {"x":64, "y":25, "w":5}, {"x":128, "y":25, "w":5}, {"x":192, "y":25, "w":5},
	 {"x":256, "y":25, "w":5}, {"x":320, "y":25, "w":5}, {"x":384, "y":25, "w":5}, {"x":448, "y":25, "w":5},
	 {"x":0, "y":50, "w":5}, {"x":64, "y":50, "w":5}, {"x":128, "y":50, "w":6}, {"x":192, "y":50, "w":5},
	 {"x":256, "y":50, "w":5}, {"x":320, "y":50, "w":6}, {"x":384, "y":50, "w":5}, {"x":448, "y":50, "w":5},
	 {"x":0, "y":75, "w":6}, {"x":64, "y":75, "w":6}, {"x":128, "y":75, "w":5}, {"x":192, "y":75, "w":6},
	 {"x":256, "y":75, "w":6}, {"x":320, "y":75, "w":5}, {"x":384, "y":75, "w":6}, {"x":448, "y":75, "w":6},
	 {"x":0, "y":100, "w":5}, {"x":64, "y":100, "w":5}, {"x":128, "y":100, "w":6}, {"x":192, "y":100, "w":5},
	 {"x":256, "y":100, "w":5}, {"x":320, "y":100, "w":6}, {"x":384, "y":100, "w":5}, {"x":448, "y":100, "w":5},
	 {"x":0, "y":125, "w":5}, {"x":64, "y":125, "w":5}, {"x":128, "y":125, "w":5}, {"x":192, "y":125, "w":5},
	 {"x":256, "y":125, "w":5}, {"x":320, "y":125, "w":5}, {"x":384, "y":125, "w":5}, {"x":448, "y":125, "w":5}]

];

const BRICK_COLORS = ["#ff0000", "#b7310c", "#913a08", "#51260d", "#351f13",
					  "#77457c", "#4e2f51", "#3b2a3d", "#1d1528", "#2e2a33"];

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels
const PI = Math.PI;
const CLOCK_SPEED = 5;


// DOM elements
var high_score;
var board;
var scoreBoard;

var timer;
var lives;
var level = 0;
var hScore = 0;

// game objects
var ball;
var paddle;
var arrow;
var bricks;


// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");

	$(document).keydown(keyPressed);
	$(document).keyup(keyRelease);

	// set titles
	$("#game-title").text("Brick Breaker");
	$("title").text("Javascript Arcade - Brick Breaker");
	scoreBoard.html("Level: " + (level+1));
	high_score.html("High Score: " + (hScore+1));
});

//restart the game
function reset(){
	$("#game-over").hide();
	clearInterval(timer);
	score = 0;
	lives = 3;
	level = 0;
	setLevel(level);
	timer = setInterval(gameLoop, CLOCK_SPEED);
}
// Game over
function gameOver(){
	clearInterval(timer);
	$("#game-over").show();
}

// set up the board for the given level
function setLevel(l){
	bricks = [];
	var level = LEVELS[l%LEVELS.length];
	addedWeight = Math.floor(l / LEVELS.length) + 1;
	for(var i = 0; i < level.length; i++){
		x = level[i]["x"];
		y = level[i]["y"];
		w = level[i]["w"] * addedWeight;
		bricks.push(new Brick(x, y, w));
	}
	ball = new Ball();
	paddle = new Paddle();
	arrow = new Arrow(ball.x, ball.y);
}


// key listeners
function keyPressed(e){
	// move the paddle with the arrow keys
	// launch the ball if we're serving
	if(arrow === undefined || paddle == undefined) return;
	var code = e.keyCode;
	if(code == 37 || code == 39 || code == 32)
		e.preventDefault();
	if(code == 37 && !arrow.visible)
		paddle.dx = -1;
	if(code == 39 && !arrow.visible)
		paddle.dx = 1;
	if(code == 32 && arrow.visible){
		ball.velocity = 2;
		ball.direction = arrow.direction;
		arrow.visible = false;
	}
}
function keyRelease(e){
	// stop the paddle when we release the arrow keys
	if(arrow === undefined || paddle == undefined) return;
	var code = e.keyCode;
	if(code == 37 && paddle.dx == -1)
		paddle.dx = 0;
	if(code == 39 && paddle.dx == 1)
		paddle.dx = 0;
}


function gameLoop(){
	ball.update();
	paddle.update();
	arrow.update();

	//remove dead bricks
	bricks = bricks.filter((b) => {return b.weight > 0;});

	//check if the level is beat
	if(bricks.length == 0){
		setLevel(++level);
		hScore = Math.max(hScore, level);
	}
	// update the score board
	scoreBoard.html("Level: " + (level+1));
	high_score.html("High Score: " + (hScore+1));

	draw();
}

// draw all objects onto the canvas
function draw(){
	board.clearRect(0,0,BOARD_SIZE,BOARD_SIZE);
	ball.draw();
	bricks.forEach((b) => {b.draw();});
	paddle.draw();
	arrow.draw();
	for(var i = 0; i < lives; i++)
		drawHeart(475 - (i*50), 475);
}
function drawHeart(x, y){
	board.strokeStyle = "pink";
	board.fillStyle = "pink";
	var d = 30;
	board.beginPath();
    board.moveTo(x, y + d / 4);
    board.quadraticCurveTo(x, y, x + d / 4, y);
    board.quadraticCurveTo(x + d / 2, y, x + d / 2, y + d / 4);
    board.quadraticCurveTo(x + d / 2, y, x + d * 3/4, y);
    board.quadraticCurveTo(x + d, y, x + d, y + d / 4);
    board.quadraticCurveTo(x + d, y + d / 2, x + d * 3/4, y + d * 3/4);
    board.lineTo(x + d / 2, y + d);
    board.lineTo(x + d / 4, y + d * 3/4);
    board.quadraticCurveTo(x, y + d / 2, x, y + d / 4);
    board.stroke();
    board.fill();
}

//function is called when we lose a life
function loseLife(){
	lives--;
	if(lives == 0)
		gameOver();
	ball = new Ball();
	paddle = new Paddle();
	arrow = new Arrow(ball.x, ball.y);
}

//returns -1 if they don't intersect or if it's on its way out
//returns 1 if they intersect on a vertical side of the rect
//returns 0 if they intersect on a horizontal side of the rect
function intersect(ball, rect){
	if(ball.x+ball.radius < rect.x || ball.x-ball.radius > rect.x+rect.length ||
		ball.y+ball.radius < rect.y || ball.y-ball.radius > rect.y+rect.height)
		return -1;

	//0 top
	//1 right
	//2 bottom
	//3 left
	sides = [];
	var dir = ball.direction % (2*PI);
	while(dir < 0)
		dir += 2*PI;
	if(dir > 0 && dir < PI)
		sides.push(2);
	if(dir > PI/2 && dir < (3/2)*PI)
		sides.push(1);
	if(dir > PI)
		sides.push(0);
	if(dir < PI/2 || dir > (3/2)*PI)
		sides.push(3);

	var m = -Math.tan(dir);

	for(var i = 0; i < sides.length; i++){
		if(sides[i] == 0){
			var y = rect.y;
			var x = (y - ball.y + (m * ball.x)) / m;
			if(m == 5443746451065123)
				x = ball.x;
			if(x >= rect.x && x <= rect.x+rect.length){
				if(ball.y > rect.y+rect.height/2)
					return -1;
				return 0;
			}
		}
		if(sides[i] == 1){
			var x = rect.x+rect.length;
			var y = m * (x - ball.x) + ball.y;
			if(y >= rect.y && y <= rect.y+rect.height){
				if(ball.x < rect.x+rect.length/2)
					return -1;
				return 1;
			}
		}
		if(sides[i] == 2){
			var y = rect.y+rect.height;
			var x = (y - ball.y + (m * ball.x)) / m;
			if(m == 16331239353195370)
				x = ball.x;
			if(x >= rect.x && x <= rect.x+rect.length){
				if(ball.y < rect.y+rect.height/2)
					return -1;
				return 0;
			}
		}
		if(sides[i] == 3){
			var x = rect.x;
			var y = m * (x - ball.x) + ball.y;
			if(y >= rect.y && y <= rect.y+rect.height){
				if(ball.x > rect.x+rect.length/2)
					return -1;
				return 1;
			}
		}
	}
}

/////////////////////////////////////////////////
// 				Object Implementations 			/
/////////////////////////////////////////////////

// object to point in the direction of the serve
function Arrow(x, y){
	this.x = x;
	this.y = y;
	this.dx = -.01;
	this.length = 100;
	this.direction = PI/2;
	this.visible = true;

	this.draw = function(){
		if(this.visible){
			board.setLineDash([5, 3]);
			board.strokeStyle = "white";
			board.beginPath();
			board.moveTo(this.x, this.y);
			board.lineTo(Math.cos(this.direction)*this.length + x, y - Math.sin(this.direction)*this.length);
			board.stroke();
		}
	}

	this.update = function(){
		this.direction += this.dx;
		if(this.direction < PI/10)
			this.dx = .01;
		if(this.direction > 9*PI/10)
			this.dx = -.01;
	}
}

// object for the ball
function Ball(){
	this.x = 256;
	this.y = 445;

	this.velocity = 0;
	this.direction = PI/4;
	this.radius = 5;

	this.draw = function(){
		board.strokeStyle = "white";
		board.fillStyle = "white";
		board.beginPath();
		board.arc(this.x, this.y, this.radius, 0, 2*PI);
		board.stroke();
		board.fill();
	}

	this.checkCollision = function(){
		//check the borders
		if(this.y-this.radius <= 0)
			this.direction = -this.direction
		if(this.x+this.radius >= BOARD_SIZE || this.x-this.radius <= 0)
			this.direction = PI-this.direction;
		if(this.y > BOARD_SIZE){
			loseLife();
			return;
		}


		//check the paddle
		var c = intersect(this, paddle);
		if(c == 0){
			this.direction = -this.direction;

			var diff = (this.x - paddle.x - paddle.length / 2) / (paddle.length/2);

			//calculate change in velocity and direction
			var y = Math.sin(this.direction) * this.velocity;
			var x = Math.cos(this.direction) * this.velocity;
			x += diff;

			this.velocity = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
			this.direction = Math.atan(y / x);
			if(this.direction < 0)
				this.direction += PI;
		}
		if(c == 1)
			this.direction = PI - this.direction;
			
		//check for bricks
		for(var i = 0; i < bricks.length; i++){
			c = intersect(this, bricks[i]);
			if(c == 0)
				this.direction = -this.direction;
			if(c == 1)
				this.direction = PI - this.direction;
			if(c != -1)
				bricks[i].weight--;
		}
	}

	this.update = function(){
		this.checkCollision();
		this.y -= this.velocity*Math.sin(this.direction);
		this.x += this.velocity*Math.cos(this.direction);
	}
}

// object for each brick on the board
function Brick(x, y, w){
	this.x = x;
	this.y = y;
	this.weight = w;
	this.height = 25;
	this.length = 64;

	this.draw = function(){
		board.fillStyle = "gray";
		board.fillRect(this.x, this.y, this.length, this.height);
		if(this.weight <= 10)
			board.fillStyle = BRICK_COLORS[this.weight-1];
		else
			board.fillStyle = "#303030";
		board.fillRect(this.x+2, this.y+2, this.length-4, this.height-4);
	}
}

// represents the player's paddle
function Paddle(){
	this.x = 221;
	this.y = 450;
	this.length = 70;
	this.height = 6;
	this.dx = 0;
	this.speed = 1;

	this.draw = function(){
		board.fillStyle = "green";
		board.fillRect(this.x, this.y, this.length, this.height);
		}

		this.update = function(){
			this.x += this.dx*this.speed;
			if(this.x < 0){
				this.x = 0;
			}
			if(this.x+this.length > BOARD_SIZE)
				this.x = BOARD_SIZE-this.length;
		}
}