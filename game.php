<!-- This page serves as an interface for all the minigames. -->

<!DOCTYPE html>
<html>
	<head>
		<title></title>
		<link rel="stylesheet" href="styles/game_style.css"/>
		<script type="text/javascript" src="scripts/jquery-3.3.1.min.js"></script>
		<?php
			$gameFile = $_GET["game"];
			if(isset($gameFile)){
				echo "<script type='text/javascript' src='games/" . $gameFile . ".js'></script>";
			}
		?>
	</head>

	<body>
		<div id="title-box">
			<div class="ctmenu"><button id="ctbutton">?</button><div id="ctcontent"><h2>Controls</h2></div></div>
			<h1 id="game-title"></h1>
		</div>
		<div id="game-container">
			<canvas id="board" width="512" height="512"></canvas>
			<h2 id="game-over" class="red">Game Over</h2>
		</div>
		<div id="scoreboard">
			<h1 id="score">Score: 0</h1>
			<h1 id="hs">High Score: 0</h1>
		</div>
		<div id="box"><button id="sb" onclick="reset()">Start</button></div>
	</body>
</html>