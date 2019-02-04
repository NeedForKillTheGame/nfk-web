import Map from "./Map.js";
import Constants from "./Constants.js";
import Keyboard from "./Keyboard.js";
import Player from "./Player.js";
import {initPlayersEntity, renderMap, renderGame} from "./Render.js";
import {updateGame} from "./Physics.js";
import Stats from "Stats";
import Demo from "./Demo.js";
import Sound from "./Sound.js";

var stats = new Stats();
document.getElementById('fps').appendChild(stats.domElement);


var demoSpeed = 1;
var players = [];

// set volume
Sound.updateVolume(0.3);

// load demo
var demo = new Demo();
//demo.loadFromQuery(init);
demo.load("demo.json", init); // for debug load local demo
console.log("prs loaded");


function init(demo)
{
	var timer = 0;
	players = demo.players;

	Map.loadNFKMap(demo.data.Map.Bricks);
	renderMap();

	initPlayersEntity(players);

	/*
	// FIXME: respawn is not for demo
	for (var i = 0; i < players.length; i++)
	{
		//just for safe respawn
		var respawn = Map.getRandomRespawn();
		players[i].setXY(respawn.col * Constants.BRICK_WIDTH + 10, respawn.row * Constants.BRICK_HEIGHT - 24);
	}
	*/

	var gametic = 0;
	function gameLoop(timestamp) {
		stats.begin();

		//players[0].keyUp = Keyboard.keyUp;
		//players[0].keyDown = Keyboard.keyDown;
		//players[0].keyLeft = Keyboard.keyLeft;
		//players[0].keyRight = Keyboard.keyRight;

		for (var i = 0; i < players.length; i++)
		{
			// player physics
			updateGame(players[i], timestamp);
			// player graphics
			renderGame(players[i]);
		}

		for (var i = 0; i < demoSpeed; i++)
		{
			demo.nextFrame(gametic);
		}
		
		if (++gametic > 60)
			gametic = 0;
		
		requestAnimationFrame(gameLoop); //infinite render loop
		
		stats.end();
	}

	requestAnimationFrame(gameLoop);


}

