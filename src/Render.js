import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";

const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const BRICK_WIDTH = Constants.BRICK_WIDTH;

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
renderer.view.style.display = "block";
var gameEl = document.getElementById('game');
gameEl.appendChild(renderer.view);

var stage = new PIXI.Stage(0x000000);
var mapGraphics = new PIXI.Graphics();
mapGraphics.beginFill(0x999999);
mapGraphics.lineStyle(1, 0xAAAAAA);
stage.addChild(mapGraphics);

var localPlayerGraphics = new PIXI.Graphics();
localPlayerGraphics.beginFill(0xAAAAFF);
//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
localPlayerGraphics.drawRect(0, 0, 20, BRICK_HEIGHT * 3);
localPlayerGraphics.endFill();
stage.addChild(localPlayerGraphics);

var localPlayerCenter = new PIXI.Graphics();
localPlayerCenter.beginFill(0x0000AA);
localPlayerCenter.drawRect(0, 0, 2, 2);
localPlayerCenter.endFill();
stage.addChild(localPlayerCenter);

var dot1 = new PIXI.Graphics();
stage.addChild(dot1);

var dot2 = new PIXI.Graphics();
stage.addChild(dot2);

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

    if (floatCamera) {
        tmpX = halfWidth;
        tmpY = halfHeight;
        mapGraphics.x = halfWidth - player.x;
        mapGraphics.y = halfHeight - player.y;
    } else {
        tmpX = player.x + mapDx;
        tmpY = player.y + mapDy;
    }

    localPlayerGraphics.x = tmpX - 10; //player.x - 10;
    if (player.crouch) {
        localPlayerGraphics.y = tmpY - 8; //player.y - 8;
        localPlayerGraphics.height = 2 / 3;
    } else {
        localPlayerGraphics.y = tmpY - 24; //player.y - 24;
        localPlayerGraphics.height = 1;
    }

    localPlayerCenter.x = tmpX - 1; //player.x-1;
    localPlayerCenter.y = tmpY - 1;

    renderer.render(stage);
}
