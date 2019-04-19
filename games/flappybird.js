// Starter code for new games

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels


// DOM elements
var high_score;
var board;
var scoreBoard;


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


Bird.prototype.draw = function () {
    ctx.drawImage(sprites, 360, 81 + (this.frame * 70), 80, 70, this.x, this.y, this.w, this.h);
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
Pipe.prototype.draw = function () {
    ctx.drawImage(sprites, 360, 0, 80, 80, this.x, this.y, this.w, this.h);
}

// Update call
Pipe.prototype.update = function () {
    this.x -= this.speed;

    // Check if the pipe is out of the screen
    if (this.x + this.w <= 0) {
        this.x = 360; 

        // If the pipe is the top one
        if (this.y <= 320) {
            this.y = -(Math.random() * (150 - 50) + 50); 
            // If the pipe is the bottom one
        } else {
            this.y = 320 + (Math.random() * (150 - 50) + 50);
        }
    }
}

function Background(x, y, w, h, speed) {
    // Physical properties
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
}

// Draw call
Background.prototype.draw = function() {
    ctx.drawImage(sprites, 0, 0, 360, 640, this.x, this.y, this.w, this.h);
}

// Update call
Background.prototype.update = function() {
    // Make it move to left with a constant speed
    this.x -= this.speed;

    // If it gets out from the screen, make it jump to the starting position so it seamlessy keeps scrolling endlessly
    if (this.x <= -360) {
        this.x = 360;
    }
}

// Establish the screen
var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext('2d');
ctx.font = 'bold 56px Comic Sans MS';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.lineWidth = 2;
ctx.strokeStyle = 'black';

// Load sprites into a global variable
var sprites = document.getElementById('sprites');

// Custom function for writing a stroked text
function drawText(text, x, y) {
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
    ctx.strokeText(text, x, y);
}

// Custom function for drawing a tint on the screen
function drawTint(x, y, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, w, h);
}


var score = 0; 
var pressed = false; 
var isPaused = true; 
var isGameOver = false; t


var player = new Bird(32, 240, 80, 70);
var pipeTop = new Pipe(360, 0, 80, 300, 2);
var pipeBottom = new Pipe(360, 480, 80, 300, 2);
var background1 = new Background(0, 0, 360, 640, 2);
var background2 = new Background(360, 0, 360, 640, 2);

document.addEventListener('keydown', function(event) {
    // Up arrow button: Player control
    if (event.keyCode === 38 && pressed === false) {
        player.moveUp(2); 
        pressed = true; // Mark this true so the player can not keep the button pressed
    }

    if (event.keyCode === 13) {
        if (isGameOver) {
            window.location.reload();
        }

        if (isPaused) {
            isPaused = false;
        }
    }

    if (event.keyCode === 27 && !isPaused && !isGameOver) {
        isPaused = true;
    }
}, false);

document.addEventListener('keyup', function(event) {
    pressed = false;
}, false);

function gameLoop() {

    if (!isPaused && !isGameOver) {
        player.update();
        pipeTop.update();
        pipeBottom.update();
        background1.update();
        background2.update();
    }

    ctx.clearRect(0, 0, 360, 640);

    background1.draw();
    background2.draw();

    player.draw();
    pipeTop.draw();
    pipeBottom.draw();

    if (isPaused) {
        drawTint(0, 0, 360, 640);
        drawText('Hit "Enter"', 180, 310);
        drawText('to play!', 180, 380);
        if (score > 0) {
            drawText(score, 180, 52);
        }
    } else if (isGameOver) {
        drawTint(0, 0, 360, 640);
        drawText('Game Over', 180, 310);
        drawText('Score: ' + score, 180, 380);
    } else {
        drawTint(0, 0, 360, 64);
        drawText(score, 180, 52);
    }

    window.requestAnimationFrame(gameLoop);
}

gameLoop(); 
