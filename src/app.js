import {loadMapFromQuery} from "./MapLoader.js";
import Keyboard from "./Keyboard.js";
import Player from "./Player.js";
import {renderMap, renderFrame} from "./Render.js";
import {playermove} from "./Physics.js";
import Stats from "Stats";

var localPlayer = new Player();

//just for safe respawn
localPlayer.x = 100;
localPlayer.y = 100;

var mapBricks = loadMapFromQuery();
renderMap(mapBricks);

var statsRender = new Stats();
document.getElementById('fpsrender').appendChild(statsRender.domElement);

var statsUpdate = new Stats();
document.getElementById('fpsupdate').appendChild(statsUpdate.domElement);

setInterval(() => {
    statsUpdate.begin();
    localPlayer.keyUp = Keyboard.keyUp;
    localPlayer.keyDown = Keyboard.keyDown;
    localPlayer.keyLeft = Keyboard.keyLeft;
    localPlayer.keyRight = Keyboard.keyRight;
    playermove(localPlayer, mapBricks);
    statsUpdate.end();

}, 1000 / 50); //50 fps for player update!

function render() {
    statsRender.begin();
    renderFrame(localPlayer);
    requestAnimationFrame(render); //infinite render loop
    statsRender.end();
}

requestAnimationFrame(render);

