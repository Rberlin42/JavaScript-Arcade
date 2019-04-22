// Starter code for new games

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels

// DOM elements
var high_score;
var board;
var scoreBoard;
var hScore = 0;
var score = 0; 

var pressed = false; 
var isPaused = true; 
var isGameOver = false; 


var player = new Bird(32, 240, 80, 70);
var pipeTop = new Pipe(360, 0, 80, 300, 2);
var pipeBottom = new Pipe(360, 480, 80, 300, 2);


// store some DOM elements when the document is loaded
// add key press listeners
// set the title and controls
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");

	// set titles
	$("#game-title").text("Flappy Birds");
	$("title").text("Javascript Arcade - Title");

	// set controls
    $("#controls").append("<p>use up and down to control the bird</p>");
});

//restart the game
function reset(){
    $("#game-over").hide();
    isPaused = false;
    isGameOver = false;
    score = 0;
    player = new Bird(32, 240, 80, 70);
    pipeTop = new Pipe(0, 0, 200, 100, 2);
    pipeBottom = new Pipe(512, 400, 80, 300, 2);
    gameLoop();
}

// Game over
function gameOver(){
    $("#game-over").show();
    player.fallSpeed = 0;
}

function Bird(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fallSpeed = 0;
    this.ySpeed = 0;

    this.scored = false;
    this.frame = 0; // This will be either 0 or 1, based on this the sprite will be animated
}


function drawBird (aBird) {
    board.fillStyle = "#FF0000";
    board.fillRect( aBird.x, aBird.y, aBird.w, aBird.h);
}

Bird.prototype.update = function () {
    // Handle the gravity
    this.fallSpeed += 0.1; 
    this.y += this.fallSpeed + this.ySpeed; 

    if (this.x + this.w >= pipeTop.x && this.x <= pipeTop.x + pipeTop.w) {
        // Then check if it touches any of the pipes on the y axis
        if (this.y + this.h >= pipeBottom.y || this.y <= pipeTop.y + pipeTop.h) {
            isGameOver = true;
        } else {
            if (!this.scored) {
                score++;
                hScore = Math.max(hScore, score);
                scoreBoard.html("Score: " + score.toString());
                high_score.html("High Score: " + hScore.toString());
                this.scored = true;
            }
        }
    }

    // Die when hit the ground
    if (this.y >= 600) {
        isGameOver = true;
    }

    if (pipeTop.x >= 360) {
        this.scored = false;
    }

    // Handle the animation based on going up or down
    if (this.fallSpeed <= 1) {
        this.frame = 1;
    } else {
        this.frame = 0;
    }
}

Bird.prototype.moveUp = function (speed) {
    this.fallSpeed = 0;
    this.ySpeed = -speed;
}

function Pipe(x, y, w, h, speed) {
    // Physical properties
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
}

// Draw call
function drawPipe(pipe) {
    board.fillStyle = "black";
    board.fillRect(pipe.x, pipe.y, pipe.w, pipe.h);
}

// Update call
function updatePipe(pipe) {
    pipe.x -= pipe.speed;

    // Check if the pipe is out of the screen
    if (pipe.x + pipe.w <= 0) {
        pipe.x = 480; 

        // If the pipe is the top one
        if (pipe.y <= 250) {
            pipe.y = -(Math.random() * (200 - 50) + 50); 
            // If the pipe is the bottom one
        } else {
            pipe.y = 320 + (Math.random() * (200 - 50) + 50);
        }
    }
}




// Custom function for writing a stroked text
function drawText(text, x, y) {
    board.fillStyle = 'white';
    board.fillText(text, x, y);
    board.strokeText(text, x, y);
}

// Custom function for drawing a tint on the screen
function drawTint(x, y, w, h) {
    board.fillStyle = 'white';
    board.fillRect(x, y, w, h);
}



document.addEventListener('keydown', function(event) {
    // Up arrow button: Player control
    if (event.keyCode === 38 && pressed === false) {
        player.moveUp(2); 
        pressed = true; // Mark this true so the player can not keep the button pressed
    }

}, false);

document.addEventListener('keyup', function(event) {
    pressed = false;
}, false);

function gameLoop() {

    if (!isGameOver) {
        player.update();
        updatePipe(pipeTop);
        updatePipe(pipeBottom);
    }

    board.clearRect(0, 0, 512, 512);

    drawBird(player);
    drawPipe(pipeTop);
    drawPipe(pipeBottom);

    if (isGameOver) {
        gameOver();
    } 

    window.requestAnimationFrame(gameLoop);
}
