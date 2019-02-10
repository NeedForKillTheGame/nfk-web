import Map from "./Map.js";
import Constants from "./Constants.js";
import Keyboard from "./Keyboard.js";
import Player from "./Player.js";
import {renderGame} from "./Render.js";
import {updateGame} from "./Physics.js";
import Stats from "Stats";
import Demo from "./Demo.js";
import Sound from "./Sound.js";
import Global from "./G.js";

var stats = new Stats();
document.getElementById('fps').appendChild(stats.domElement);


var G = new Global();

console.log("mode: " + G.config.mode);

PIXI.loader
	.add('sarge_wd', "images/models/sarge/wd.json")
	.add('sarge_wr', "images/models/sarge/wr.json")
	.add('sarge_wb', "images/models/sarge/wb.json")
	.add('palette', "images/palette.png")
	.add('weapons', "images/weapons.json")
	.add('explosion', "images/explosion.json") // animation
	.add('mgun', "images/mgun.json") // animation
	.add('jumppad', "images/jumppad.json") // animation
	.add('gaunlet', "images/gaunlet.json") // animation
	.add('medkits', "images/medkits.json")
	.add('portal', "images/portal.png")
	.add('flash', "images/flash.png") // animation
	.add('mega', "images/mega.json") // animation
	.add('flag', "images/flag.json") // animation
	.add('powerup', "images/powerup.json") // animation
	.add('armors', "images/armors.json") // animation
	.add('items', "images/items.json") // animation

	
	.load(run);
	
function run(loader, resources) {
	
	G.resources = resources;
	
	// load demo
	if (G.config.mode == 'development') {
		G.demo.load("demo5.json", init); // for debug load local demo
	} else {
		G.demo.loadFromQuery(init); // for production
	}
	console.log("demo loaded");
}		


async function init()
{
	var timer = 0;

	await G.map.loadFromDemo(G.demo.data.Map);
	G.render.renderMap();
	
	/*
	// FIXME: respawn is not for demo
	for (var i = 0; i < G.players.length; i++)
	{
		//just for safe respawn
		var respawn = Map.getRandomRespawn();
		G.players[i].setXY(respawn.col * Constants.BRICK_WIDTH + 10, respawn.row * Constants.BRICK_HEIGHT - 24);
	}
	*/

	var gametic = 0;
	function gameLoop(timestamp) {
		stats.begin();

		//G.players[0].keyUp = Keyboard.keyUp;
		//G.players[0].keyDown = Keyboard.keyDown;
		//G.players[0].keyLeft = Keyboard.keyLeft;
		//G.players[0].keyRight = Keyboard.keyRight;

		// if game not paused
		if (!G.paused)
		{
			for (var i = 0; i < G.players.length; i++)
			{
				// player physics
				G.players[i].physics.updateGame(timestamp);
				// player graphics
				G.render.renderGame(G.players[i]);
			}

			// for debug
			if (G.config.mech) {
				G.render.renderMech();			
			}
			
			// if end of demo then stop rendering
			if ( !G.demo.nextFrame(gametic) )
				return;
			
			if (++gametic > Constants.FPS)
				gametic = 0;
		}
		
		requestAnimationFrame(gameLoop); //infinite render loop
		
		stats.end();
		
	}

	requestAnimationFrame(gameLoop);


}

