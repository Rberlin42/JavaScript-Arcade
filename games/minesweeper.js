// MINESWEEPER

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels
const HEIGHT = 16;
const WIDTH = 16;
const TILE_SIZE = BOARD_SIZE / WIDTH;
const NUM_MINES = 40; // intermediate


// DOM elements
var high_score;
var board;
var scoreBoard;

var minesLeft;
var flagsPlaced;
var firstClick;

var score = 0;
var hScore = 0;

var gameEnd;

var field = new Array(WIDTH);
//window.field;
/*
0 = un-checked
1-8 = 1-8
9 = flag
10 = failed bomb
11 = empty
*/
var mineField = new Array(WIDTH);
//window.mineField;
/*
0 = no bomb
1 = bomb
*/



// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
	game_over = $("#game-over");

	board.font = "20px courier";
	board.textAlign = "center";

	$("#game-title").html("Minesweeper");
	$("#sb").text("Reset");

	$("#controls-text").html("Left click to reveal a square,<br>Right click to mark a mine.<br>Don't click any mines!")

	var canv = document.getElementById('board');
	canv.addEventListener('click', getClickInfo, false);
	canv.addEventListener('contextmenu', function(e){
		e.preventDefault();
		getClickInfo(e);
	}, false);

	reset();
});

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
	if(type == 2){
		if(field[x][y] == 0){
			field[x][y] = 9; // set flag
			flagsPlaced++;
			if(mineField[x][y] == 1) minesLeft--;
		}
		else if(field[x][y] == 9){
			field[x][y] = 0; // remove flag
			flagsPlaced--;
			if(mineField[x][y] == 1) minesLeft++;
		}
	}
	else if(type == 0){
		if(firstClick){
			setAllMines(x, y); // generate mines
			firstClick = false;
		}

		if(field[x][y] == 0){
			if(mineField[x][y] == 1){ // clicked on a bomb
				field[x][y] = 10;
				draw();
				dead();
				updateScore();
				return;
			}
			else if(mineField[x][y] == 0 || anyNearbyZeroes(x, y)){
				if(numNearbyMines(x, y) == 0) revealMines(x, y);
				else field[x][y] = numNearbyMines(x, y);
			}
		}
	}

	draw();

	if(minesLeft == 0) victory();
	updateScore();
}

function revealMines(x, y){
	var i;
	var j;
	if(field[x][y] != 0) return;
	if(mineField[x][y] == 1) {}
	else if(numNearbyMines(x, y) == 0) field[x][y] = 11;
	else field[x][y] = numNearbyMines(x, y);
	for(i = -1; i <= 1; i++){
		for(j = -1; j <= 1; j++){
			if(!inField(x + i, y + j)) continue;
			if(field[x + i][y + j] != 0) continue;
			if(i == 0 && j == 0) continue;

			if(numNearbyMines(x + i, y + j) == 0) revealMines(x + i, y + j);	
			else field[x + i][y + j] = numNearbyMines(x + i, y + j);
			draw();
		}
	}
}

function victory(){
	var i;
	var j;
	for(i = 0; i < WIDTH; i++){
		for(j = 0; j < HEIGHT; j++){
			if(field[i][j] == 0) return; // if any are unrevealed/marked = not complete
		}
	}

	game_over.html("You Win!");
	game_over.addClass("win");
	gameEnd = true;
}
function dead(){

	game_over.html("Game Over");

	//game_over.addClass("win");
	gameEnd = true;
}

function updateScore(){
	score = flagsPlaced;
	scoreBoard.html(flagsPlaced.toString() + " / 40 Mines Marked");

	if(gameEnd){
		$('#game-over').show();
		hScore = Math.max(hScore, NUM_MINES - minesLeft);
		high_score.html("High Score: " + hScore.toString());
	}
	
}

function numMines(x, y){ // return the number of mines around a tile
	var num = 0;
	var i;
	var j;
	for(i = -1; i <= 1; i++){
		for(j = -1; j <= 1; j++){
			if(i != 0 && j != 0){
				if(isMine(x, y)) num++;
			}
		}
	}
	return num;
}

function inField(x, y){ // return whether a given tile is in the board
	return (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT);
}

function isMine(x, y){ // return whether a tile is a mine
	if(inField(x, y)){
		return (mineField[x][y] == 1);
	}
	return false;
}

//restart the game
function reset(){
	// called when the start button is clicked
	// Add code to start/restart the game
	var i;
	var j;
	for(i = 0; i < WIDTH; i++){
		field[i] = new Array(HEIGHT);
		mineField[i] = new Array(HEIGHT);
		for(j = 0; j < HEIGHT; j++){
			field[i][j] = 0; 
			mineField[i][j] = 0;
		}
	}

	minesLeft = NUM_MINES;
	flagsPlaced = 0;
	firstClick = true;
	gameEnd = false;

	$("#game-over").hide();
	updateScore();

	board.clearRect(0, 0, 512, 512);
	draw();
}

function setAllMines(x, y){
	var minesPlaced = 0;
	var i;
	var j;
	while(minesPlaced < NUM_MINES){
		i = Math.floor(Math.random() * WIDTH);
		j = Math.floor(Math.random() * HEIGHT);
		if(isAdjacent(x, y, i, j) || (x == i && y == j)) continue;
		if(mineField[i][j] == 1) continue;
		else {
			mineField[i][j] = 1;
			minesPlaced++;
		}
	}
	return;
}

function numNearbyMines(x, y){
	var count = 0;
	var i;
	var j;
	for(i = -1; i <= 1; i++){
		for(j = -1; j <= 1; j++){
			if(i == 0 && j == 0) continue;
			if(!inField(x + i, y + j)) continue;
			if(mineField[x + i][y + j] == 1) count++;
		}
	}
	return count;
}

function anyNearbyZeroes(x, y){
	var i;
	var j;
	for(i = -1; i <= 1; i++){
		for(j = -1; j <= 1; j++){
			if(i == 0 && j == 0) continue;
			if(field[x + i][y + j] == 0 && numNearbyMines(x + i, y + j) == 0) return true;
		}
	}
	return false;
}

function isAdjacent(x, y, i, j){
	return (Math.abs(x - i) == 1 || Math.abs(y - j) == 1);
}

function draw0(x, y){
	board.fillStyle = "#C9ECFF";
	board.fillRect((x * TILE_SIZE )+ 1, (y * TILE_SIZE) + 1, ((x + 1) * TILE_SIZE) - 1, ((y + 1) * TILE_SIZE) - 1);
}

function draw1(x, y){
	draw11(x, y);
	board.fillStyle = "#42BCFF";
	board.fillText("1", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw2(x, y){
	draw11(x, y);
	board.fillStyle = "#35CE91";
	board.fillText("2", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw3(x, y){
	draw11(x, y);
	board.fillStyle = "#FF849B";
	board.fillText("3", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw4(x, y){
	draw11(x, y);
	board.fillStyle = "#3C76FC";
	board.fillText("4", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw5(x, y){
	draw11(x, y);
	board.fillStyle = "#C11F3C"; 
	board.fillText("5", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw6(x, y){
	draw11(x, y);
	board.fillStyle = "#209380"; 
	board.fillText("6", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw7(x, y){
	draw11(x, y);
	board.fillStyle = "#000000"; 
	board.fillText("7", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw8(x, y){
	draw11(x, y);
	board.fillStyle = "#878787"; 
	board.fillText("8", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw9(x, y){
	draw0(x, y);
	board.fillStyle = "#FF849B"; 
	board.fillText("@", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw10(x, y){
	draw0(x, y);
	board.fillStyle = "#000000"; 
	board.fillText("#", (x + 0.5) * TILE_SIZE, (y + 0.725) * TILE_SIZE);
}

function draw11(x, y){
	board.fillStyle = "#E9E9E9";
	board.fillRect((x * TILE_SIZE ) + 1, (y * TILE_SIZE) + 1, ((x + 1) * TILE_SIZE) - 1, ((y + 1) * TILE_SIZE) - 1);
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
	draw8, // 8
	draw9, // 9 = flag
	draw10, // 10 = bomb
	draw11 // 11 = empty
];

function draw(){
	var i;
	var j;
	for(i = 0; i < WIDTH; i++){
		for(j = 0; j < HEIGHT; j++){
			board.clearRect(i * TILE_SIZE, j * TILE_SIZE, (i + 1) * TILE_SIZE, (j + 1) * TILE_SIZE);
			drawFunctions[field[i][j]](i, j);
		}
	}
	board.fillStyle = "#0000FF";
	board.fillRect(0, 0, 1, 1);
}

