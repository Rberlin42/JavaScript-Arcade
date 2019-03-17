// Starter code for new games

// Global constants
const BOARD_SIZE = 512;	// Canvas size in pixels


// DOM elements
var high_score;
var board;
var scoreBoard;


// store some DOM elements when the document is loaded
// add key press listeners
$(document).ready(function(){
	board = $("#board")[0].getContext("2d");
	scoreBoard = $("#score");
	high_score = $("#hs");
});

//restart the game
function reset(){
	// called when the start button is clicked
	// Add code to start/restart the game
}