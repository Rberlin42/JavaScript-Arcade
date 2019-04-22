// MINESWEEPER

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels
const HEIGHT = 64;
const WIDTH = 64;
const TILE_SIZE = BOARD_SIZE / WIDTH;


// DOM elements
var high_score;
var board;
var scoreBoard;

var direction;

var score = 0;
var hScore = 0;

var gameEnd;

var birdx;
var birdy;

var trees;
var treeTimer;

var upcounter;

var bird = new Image();
var tree = new Image();

test = new aTree();

// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
	game_over = $("#game-over");

	bird.src = "resources/bird.png";
	tree.src = "resources/tree.png";

	board.font = "20px courier";
	board.textAlign = "center";

	$("#game-title").html("Flappy Bird 1");
	$("#sb").text("Restart");

	$("#controls-text").html("Click any button to fly up!")

	var canv = document.getElementById('board');
	canv.addEventListener('click', getClickInfo, false);
	canv.addEventListener('contextmenu', function(e){
		e.preventDefault();
		getClickInfo(e);
	}, false);

	$(document).keydown(keyPressed);
	$(document).keyup(keyRelease);


	bird.addEventListener("load", function(){
		setInterval(function(){
			moveBird();
			test.draw();
			draw();
			updateScore();
		}, 10);
	}, false);

	trees = new Array();

	reset();
});

function moveBird(){
	if(gameEnd) return;
	moveTrees();
	birdx += 1;
	birdy += (direction * 2);
	if(birdy >= (BOARD_SIZE - HEIGHT) || birdy <= 0) end();
	upcounter++;
	if(upcounter > 20) direction = 1;
	treeTimer += 0.66;
}

function moveTrees(){
	if(gameEnd) return;
	var i;
	for(i = 0; i < trees.length; i++){
		trees[i].x -= 2;
		trees[i].draw();

		if(trees[i].x >= 105 && trees[i].x <= 95 + WIDTH){
			if(trees[i].y >= birdy + 10 || trees[i].y + trees[i].height - HEIGHT <= birdy - 5) end();
		}

		if(trees[i].x <= 0 - WIDTH){
			score++;
			trees.splice( i, 1 );
		}
	}

	if(treeTimer > 30 && Math.floor(Math.random() * 1000) > 990){
		treeTimer = 0;
		trees.push(new aTree());
	} else if(treeTimer > 75){
		treeTimer = 0;
		trees.push(new aTree());
	}
}

function keyPressed(){
	direction = -2.5;
	upcounter = 0;
}
function keyRelease(){
	direction = 1;
	upcounter = 0;
}

function getClickInfo(e){

	if(gameEnd) return;

	var xCoord1 = e.pageX;
	var yCoord1 = e.pageY;

	var xBoard = xCoord1 - (($(document).width() / 2) - (BOARD_SIZE / 2));
	var yBoard = yCoord1 - 70;

	var rl = e.button;
	
}



function end(){
	$('#game-over').show();
	hScore = Math.max(hScore, score);
	high_score.html("High Score: " + hScore.toString());
	gameEnd = true;
}

function updateScore(){
	scoreBoard.html("Score: " + score);
}

function reset(){
	$('#game-over').hide();
	birdy = 224;
	score = 0;
	upcounter = 0;
	direction = 1;
	treeTimer = 0;

	while(trees.length > 0){
		trees.pop();
	}
	var i;
	for(i = trees.length - 1; i >= 0; i--){
	 	trees[i].clear;
	 	trees.pop();
	}
	trees.push(new aTree());

	gameEnd = false;
}


function drawBird(x, y){
	board.drawImage(bird, 100, birdy, WIDTH, HEIGHT);
}
function drawTree(x, y){
	board.drawImage(tree, x, y, WIDTH, HEIGHT * 3);
}

var drawFunctions = [
	drawBird, // 0 = un-checked
	drawTree // 1
];

function draw(){
	if(gameEnd) return;
	board.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

	board.fillStyle = "#eeeeee";
	board.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);
	drawBird();
	moveTrees();
}

function aTree(){
	this.x = BOARD_SIZE - WIDTH;
	this.y = Math.floor(Math.random() * 128) + 75;
	this.height =  Math.floor(Math.random() * 200) + 128;

	this.draw = function(){
		drawTree(this.x, this.y - (HEIGHT * 3));
		drawTree(this.x, this.y + this.height);
	}
	this.clear = function(){
		this.x = 0 - WIDTH;
	}
}