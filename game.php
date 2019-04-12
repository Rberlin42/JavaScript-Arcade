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
		<h1 id="game-title"></h1>
		<div id="game-container">
			<canvas id="board" width="512" height="512"></canvas>
			<h2 id="game-over">Game Over</h2>
		</div>
		<h1 id="score">Score: 0</h1>
		<h1 id="hs">High Score: 0</h1>
		<div><button onclick="reset()">Start</button></div>
		<div id="controls">
			<h2>Controls</h2>
		</div>
	</body>
</html>