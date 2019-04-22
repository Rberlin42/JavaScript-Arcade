// MINESWEEPER

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels
const HEIGHT = 8;
const WIDTH = 8;
const TILE_SIZE = BOARD_SIZE / WIDTH;
const TOTAL_TIME = BOARD_SIZE;

// DOM elements
var board;
var scoreBoard;

var grid = new Array(WIDTH);
/*
	0 = empty (rare)
	1-7 = 7 colors
*/

var moves;

var score = 0;
var hScore = 0;

var gameEnd;
var paused;

var timer;
var time = 0;

var x1;
var y1;
var x2;
var y2;

var swapped;

// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
	game_over = $("#game-over");

	board.font = "20px courier";
	board.textAlign = "center";

	$("#game-title").html("Color Swap"); // or something like that
	$("#sb").text("Restart");

	$("#controls-text").html("Make lines of 3+ same-color blocks to clear rows and gain time. You can only swap adjacent blocks.<br>Don't let the timer run out!")

	var i;
	for(i = 0; i < WIDTH; i++){
		grid[i] = new Array(HEIGHT);
	}

	var canv = document.getElementById('board');
	canv.addEventListener('click', getClickInfo, false);
	canv.addEventListener('contextmenu', function(e){
		e.preventDefault();
		getClickInfo(e);
	}, false);

	reset();
	timer = setInterval(setTimer, 100);
	
});

function setTimer(){
	time++;
	draw();
	if(time == TOTAL_TIME) end();
}

function getClickInfo(e){

	if(gameEnd) return;

	var xCoord1 = e.pageX;
	var yCoord1 = e.pageY;

	var xBoard = xCoord1 - (($(document).width() / 2) - (BOARD_SIZE / 2));
	var yBoard = yCoord1 - 70;

	var rl = e.button;
	
	processClick(Math.floor(xBoard / TILE_SIZE), Math.floor(yBoard / TILE_SIZE), rl);
}

function processClick(x, y, type){
	if(!(isAdjacent(x1, y1, x, y))){
		x1 = x;
		y1 = y;
		x2 = -1;
		y2 = -1;
	} 
	else{
		if(canSwap(x1, y1, x, y)){
			x2 = x;
			y2 = y;
			clearInterval(timer);
			swap(x1, y1, x, y);
			draw();
			swapped = true;
			setTimeout(function(){
				draw();
				swapped = false;
				clear(x1, y1, x, y);
				setTimeout(function(){
					timer = setInterval(setTimer, 100);
					scoreBoard.html("Blocks Cleared: " + score.toString());
				}, 400);

			}, 100);
		}
		else {
			x1 = x;
			y1 = y;
			x2 = -1;
			y2 = -1;
		}
	}
}

function end(){
	$('#game-over').show();
	hScore = Math.max(hScore, score);
	high_score.html("High Score: " + hScore.toString());
	gameEnd = true;
}

function inGrid(x, y){ // return whether a given tile is in the board
	return (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT);
}

function is3H(x, y, z){
	var i;
	var count = 0;
	for(i = -1; i <= 1; i++){
		if(i == 0) continue;
		if(inGrid(x + i, y)){
			if(grid[x + i][y] == z){
				count++;
				if(inGrid(x + (2 * i), y)){
					if(grid[x + (2 * i)][y] == z) count++;
				} 
			}
		}
	}
	return (count >= 2);
}

function is3V(x, y, z){
	var i;
	var count = 0;
	for(i = -1; i <= 1; i++){
		if(i == 0) continue;
		if(inGrid(x, y + i)){
			if(grid[x][y + i] == z){
				count++;
				if(inGrid(x, y + (2 * i))){
					if(grid[x][y + (2 * i)] == z) count++;
				} 
			}
		}
	}
	return (count >= 2);
}

function is3(x, y, z){
	return (is3H(x, y, z) || is3V(x, y, z));
}

function isAdjacent(x, y, a, b){
	return((Math.abs(x - a) + Math.abs(y - b)) <= 1);
}

function canSwap(x, y, a, b){

	if(!isAdjacent(x, y, a, b)) return false;

	var t1 = grid[x][y];
	var t2 = grid[a][b];
	if(t1 == t2) return false;

	return (is3(x, y, grid[a][b]) || is3(a, b, grid[x][y]));

}

function clearH(x, y, z){
	var cleared = 0;
	var i = 1;
	while(inGrid(x - i, y) && grid[x - i][y] == z){
		if(grid[x - i][y] == z){
			grid[x - i][y] = 0;
			cleared += 1;
		}
		i++;
	}
	i = 1;
	while(inGrid(x + i, y) && grid[x + i][y] == z){
		if(grid[x + i][y] == z){
			grid[x + i][y] = 0;
			cleared += 1;
		}
		i++;
	}
	return cleared;
}

function clearV(x, y, z){
	var cleared = 0;
	var i = 1;
	while(inGrid(x, y - i) && grid[x][y - i] == z){
		if(grid[x][y - i] == z){
			grid[x][y - i] = 0;
			cleared += 1;
		}
		i++;
	}
	i = 1;
	while(inGrid(x, y + i) && grid[x][y + i] == z){
		if(grid[x][y + i] == z){
			grid[x][y + i] = 0;
			cleared += 1;
		}
		i++;
	}
	return cleared;
}

function clearRow(x, y, z){
	var cleared = 0;
	if(is3H(x, y, z)) cleared += clearH(x, y, z);
	if(is3V(x, y, z)) cleared += clearV(x, y, z);
	if(cleared > 0){
		grid[x][y] = 0;
		cleared += 1;
	}
	score += cleared;
	return cleared;
}

function clearNextNumUp(x, y){
	if(!inGrid(x, y)) return -1;
	if(grid[x][y] != 0){
		var ret = grid[x][y];
		grid[x][y] = 0;
		return ret;
	}
	return clearNextNumUp(x, y - 1);
}

function dropDown(){
	var i;
	var j;
	for(i = WIDTH - 1; i >= 0; i--){
		for(j = HEIGHT - 1; j >= 0; j--){
			grid[i][j] = Math.max(0, clearNextNumUp(i, j));
		}
	}
}

function fill(){
	var i;
	var j;
	for(i = 0; i < WIDTH; i++){
		for(j = 0; j < HEIGHT; j++){
			if(grid[i][j] == 0) grid[i][j] = Math.floor((Math.random() * 7) + 1);
		}
	}
}

function swap(x, y, a, b){
	var t1 = grid[x][y];
	var t2 = grid[a][b];
	grid[x][y] = t2;
	grid[a][b] = t1;
}

function clear(x, y, a, b){
	var t1 = grid[a][b];
	var t2 = grid[x][y];

	var cleared = false;
	if(is3(x, y, t2)){
		time = Math.max(time - (10 * clearRow(x, y, t2)), 0);
		cleared = true;
	} 
	if(is3(a, b, t1)){
		time = Math.max(time - (10 * clearRow(a, b, t1)), 0);
		cleared = true;
	}
	if(cleared){
		dropDown();
		fill();

		x1 = -1;
		y1 = -1;
		x2 = -1;
		y2 = -1;
	}
}

function reset(){
	$('#game-over').hide();
	gameEnd = false;
	paused = false;
	time = 0;
	swapped = false;

	x1 = -1;
	y1 = -1;
	x2 = -1;
	y2 = -1;

	var x;
	var y;
	for(i = 0; i < WIDTH; i++){
		for(j = 0; j < HEIGHT; j++){
			grid[i][j] = Math.floor((Math.random() * 7) + 1);
		}
	}

	draw();
}

function draw0(x, y){}

function draw1(x, y){
	board.fillStyle = "#42BCFF";
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw2(x, y){
	board.fillStyle = "#35CE91";
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw3(x, y){
	board.fillStyle = "#FF849B";
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw4(x, y){
	board.fillStyle = "#3C76FC";
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw5(x, y){
	board.fillStyle = "#C11F3C"; 
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw6(x, y){
	board.fillStyle = "#209380"; 
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function draw7(x, y){
	board.fillStyle = "#000000"; 
	board.fillRect((x * TILE_SIZE )+ 5, (y * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
}

function drawSelect(x, y){
	if(swapped) {
		board.fillStyle = "#EEADFF";
	} else {
		board.fillStyle = "#D684ED"; 
	}
	board.fillRect((x * TILE_SIZE ), (y * TILE_SIZE), TILE_SIZE, TILE_SIZE);
}

var drawFunctions = [
	draw0, // 0 = un-checked
	draw1, // 1
	draw2, // 2
	draw3, // 3
	draw4, // 4
	draw5, // 5
	draw6, // 6
	draw7, // 7
	drawSelect
];

function draw(){

	board.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
	board.fillStyle = "#C9ECFF";
	board.fillRect(0, time, BOARD_SIZE, BOARD_SIZE - time);

	if(inGrid(x1, y1)) drawSelect(x1, y1);
	if(inGrid(x2, y2)) drawSelect(x2, y2);

	var i;
	var j;
	for(i = 0; i < WIDTH; i++){
		for(j = 0; j < HEIGHT; j++){
			board.clearRect((i * TILE_SIZE) + 5, (j * TILE_SIZE) + 5, TILE_SIZE - 10, TILE_SIZE - 10);
			drawFunctions[grid[i][j]](i, j);
		}
	}
}
