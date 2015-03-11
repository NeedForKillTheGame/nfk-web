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

export function renderMap() {
    for (var row = 0; row < Map.getRows(); row++) {
        for (var col = 0; col < Map.getCols(); col++) {
            if (Map.isBrick(col, row)) {
                mapGraphics.drawRect(col * BRICK_WIDTH, row * BRICK_HEIGHT, BRICK_WIDTH - 1, BRICK_HEIGHT - 1);
            }
        }
    }

    renderer.render(stage);
}

export function renderGame(player) {

    localPlayerGraphics.x = player.x - 10;
    if (player.crouch) {
        localPlayerGraphics.y = player.y - 8;
        localPlayerGraphics.height = 2 / 3;
    } else {
        localPlayerGraphics.y = player.y - 24;
        localPlayerGraphics.height = 1;
    }

    localPlayerCenter.x = player.x-1;
    localPlayerCenter.y = player.y-1;

    renderer.render(stage);
}
