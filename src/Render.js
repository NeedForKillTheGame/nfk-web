import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";

const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const BRICK_WIDTH = Constants.BRICK_WIDTH;

var renderer = PIXI.autoDetectRenderer(640, 480);
//renderer.view.style.display = "block";
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
export function renderMap() {
    var tmpRows = Map.getRows();
    var tmpCols = Map.getCols();
    var tmpRow, tmpCol;
    floatCamera = (tmpRows > 30) || (tmpCols > 20);
    for (tmpRow = 0; tmpRow < tmpRows; tmpRow++) {
        for (tmpCol = 0; tmpCol < tmpCols; tmpCol++) {
            if (Map.isBrick(tmpCol, tmpRow)) {
                mapGraphics.drawRect(tmpCol * 32, tmpRow * 16, 31, 15);
            }
        }
    }
    renderer.render(stage);
}

var tmpX = 0;
var tmpY = 0;
export function renderGame(player) {

    if (floatCamera) {
        tmpX = 320;
        tmpY = 240;
        mapGraphics.x = 320 - player.x;
        mapGraphics.y = 240 - player.y;
    } else {
        tmpX = player.x;
        tmpY = player.y;
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
