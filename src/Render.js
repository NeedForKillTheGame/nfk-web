import PIXI from "PIXI";
import Constants from "./Constants.js";

var renderer = PIXI.autoDetectRenderer(640, 480);
//renderer.view.style.display = "block";
var gameEl = document.getElementById('game');
gameEl.appendChild(renderer.view);

var localPlayerGraphics = new PIXI.Graphics();
localPlayerGraphics.beginFill(0xAAAAFF);
localPlayerGraphics.lineStyle(1, 0xFFFFFF);
localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, Constants.BRICK_HEIGHT * 3);
//localPlayerGraphics.endFill();

var stage = new PIXI.Stage(0x000000);
stage.addChild(localPlayerGraphics);

var mapGraphics = new PIXI.Graphics();
mapGraphics.beginFill(0x999999);
mapGraphics.lineStyle(1, 0xBBBBBB);
stage.addChild(mapGraphics);

export function renderMap(mapBricks) {
    for (var row = 0; row < Constants.MAP_ROWS; row++) {
        for (var col = 0; col < Constants.MAP_COLS; col++) {
            if (mapBricks[row][col]) {
                mapGraphics.drawRect(col * Constants.BRICK_WIDTH, row * Constants.BRICK_HEIGHT, Constants.BRICK_WIDTH, Constants.BRICK_HEIGHT);
            }
        }
    }

    renderer.render(stage);
}

export function renderFrame(player) {
    localPlayerGraphics.x = Math.round(player.x - 10);

    if (player.crouch) {
        localPlayerGraphics.y = Math.round(player.y - 8);
        localPlayerGraphics.height = 2 / 3;
    } else {
        localPlayerGraphics.y = Math.round(player.y - 24);
        localPlayerGraphics.height = 1;
    }

    renderer.render(stage);
}
