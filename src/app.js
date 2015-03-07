import Map from "./Map.js";
import Constants from "./Constants.js";
import Keyboard from "./Keyboard.js";
import Player from "./Player.js";
import {renderMap, renderGame} from "./Render.js";
import {updateGame} from "./Physics.js";
import Stats from "Stats";

var stats = new Stats();
document.getElementById('fpsstats').appendChild(stats.domElement);

Map.loadFromQuery();
renderMap();

var localPlayer = new Player();

//just for safe respawn
var respawn = Map.getRandomRespawn();
localPlayer.setLeft(respawn.col * Constants.BRICK_WIDTH);
localPlayer.setBottom(respawn.row * Constants.BRICK_HEIGHT + Constants.BRICK_HEIGHT - 1);

function gameLoop(timestamp) {
    stats.begin();

    localPlayer.keyUp = Keyboard.keyUp;
    localPlayer.keyDown = Keyboard.keyDown;
    localPlayer.keyLeft = Keyboard.keyLeft;
    localPlayer.keyRight = Keyboard.keyRight;

    updateGame(localPlayer, timestamp);
    renderGame(localPlayer);

    requestAnimationFrame(gameLoop); //infinite render loop

    stats.end();
}

requestAnimationFrame(gameLoop);

