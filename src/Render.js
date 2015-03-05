import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";

const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const BRICK_WIDTH = Constants.BRICK_WIDTH;

var renderer = PIXI.autoDetectRenderer(640, 480);
//renderer.view.style.display = "block";
var gameEl = document.getElementById('game');
gameEl.appendChild(renderer.view);

var localPlayerGraphics = new PIXI.Graphics();
localPlayerGraphics.beginFill(0xAAAAFF);
//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, BRICK_HEIGHT * 3);
localPlayerGraphics.endFill();

var stage = new PIXI.Stage(0x000000);
stage.addChild(localPlayerGraphics);

var mapGraphics = new PIXI.Graphics();
mapGraphics.beginFill(0x999999);
mapGraphics.lineStyle(1, 0xBBBBBB);
stage.addChild(mapGraphics);

export function renderMap() {
    for (var row = 0; row < Constants.MAP_ROWS; row++) {
        for (var col = 0; col < Constants.MAP_COLS; col++) {
            if (Map.isBrick(row, col)) {
                mapGraphics.drawRect(col * BRICK_WIDTH, row * BRICK_HEIGHT, BRICK_WIDTH, BRICK_HEIGHT);
            }
        }
    }

    renderer.render(stage);
}

export function renderGame(player) {
    localPlayerGraphics.x = player.left;

    if (player.crouch) {
        localPlayerGraphics.height = 2 / 3;
        localPlayerGraphics.y = player.bottom - BRICK_HEIGHT * 2 + 1;
    } else {
        localPlayerGraphics.y = player.bottom - BRICK_HEIGHT * 3 + 1;
        localPlayerGraphics.height = 1;
    }

    renderer.render(stage);
}
