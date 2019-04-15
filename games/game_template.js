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
	$("#game-title").text("Title");
	$("title").text("Javascript Arcade - Title");

	// set controls
	$("#controls").append("<p>key: does this function</p>");
});

//restart the game
function reset(){
	$("#game-over").hide();
	// called when the start button is clicked
	// Add code to start/restart the game
}

// Game over
function gameOver(){
	$("#game-over").show();
}