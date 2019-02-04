import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";
import PlayerGraphics from "./PlayerGraphics.js";
import PlayerPhysics from "./Physics.js";

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.display = "block";
var gameEl = document.getElementById('game');
gameEl.appendChild(renderer.view);


var stage = new PIXI.Stage(0x000000);
var mapGraphics = new PIXI.Graphics();
mapGraphics.beginFill(0x999999);
mapGraphics.lineStyle(1, 0xAAAAAA);
stage.addChild(mapGraphics);

// init graphics and physics
export function initPlayersEntity(players)
{
	// init players graphics
	for (var i = 0; i < players.length; i++)
	{
		players[i].graphics = new PlayerGraphics(stage, players[i]);
		players[i].physics = new PlayerPhysics(players[i]);
	}
}



var floatCamera = false;
var halfWidth = 0;
var halfHeight = 0;
var mapDx = 0;
var mapDy = 0;
function recalcFloatCamera() {
    renderer.view.width = window.innerWidth - 20;
    renderer.view.height = window.innerHeight;

    floatCamera = Map.getRows() > (window.innerHeight) / 16 || (Map.getCols() > (window.innerWidth - 20) / 32);
    if (floatCamera) {
        halfWidth = Math.floor((window.innerWidth - 20) / 2);
        halfHeight = Math.floor((window.innerHeight) / 2);

    } else {
        mapGraphics.x = mapDx = Math.floor(((window.innerWidth - 20) - Map.getCols() * 32) / 2);
        mapGraphics.y = mapDy = Math.floor(((window.innerHeight) - Map.getRows() * 16) / 2);
    }
}

window.addEventListener('resize', recalcFloatCamera, false);

export function renderMap() {
    var tmpRows = Map.getRows();
    var tmpCols = Map.getCols();
    var tmpRow, tmpCol;
    for (tmpRow = 0; tmpRow < tmpRows; tmpRow++) {
        for (tmpCol = 0; tmpCol < tmpCols; tmpCol++) {
            if (Map.isBrick(tmpCol, tmpRow)) {
                mapGraphics.drawRect(tmpCol * 32, tmpRow * 16, 31, 15);
            }
        }
    }
    renderer.render(stage);
    recalcFloatCamera();
}

var tmpX = 0;
var tmpY = 0;
export function renderGame(player) {
			
	tmpX = player.x + mapDx;
	tmpY = player.y + mapDy;
	
	if (floatCamera) {
		if (player.follow)
		{
			// update map position depending on the following player 
			mapDx = mapGraphics.x = halfWidth - player.x;
			mapDy = mapGraphics.y = halfHeight - player.y; 
		}
	}
	
	player.graphics.adjustPosition(tmpX, tmpY);

    renderer.render(stage);
}
