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
mapGraphics.lineStyle(1, 0xBBBBBB);
stage.addChild(mapGraphics);

var localPlayerGraphics = new PIXI.Graphics();
localPlayerGraphics.beginFill(0xAAAAFF);
//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, BRICK_HEIGHT * 3);
localPlayerGraphics.endFill();
stage.addChild(localPlayerGraphics);


var dot1 = new PIXI.Graphics();
stage.addChild(dot1);

var dot2 = new PIXI.Graphics();
stage.addChild(dot2);

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
    /*
    localPlayerGraphics.x = player.left;

    if (player.crouch) {
        localPlayerGraphics.height = 2 / 3;
        localPlayerGraphics.y = player.bottom - BRICK_HEIGHT * 2 + 1;
    } else {
        localPlayerGraphics.y = player.bottom - BRICK_HEIGHT * 3 + 1;
        localPlayerGraphics.height = 1;
    }
    */

    localPlayerGraphics.x = player.x - 10;
    if (player.crouch) {
        localPlayerGraphics.y = player.y - 8;
        localPlayerGraphics.height = 2 / 3;
    } else {
        localPlayerGraphics.y = player.y - 24;
        localPlayerGraphics.height = 1;
    }
    /*
    var mapBricks = Map.getMapBricks();
    if (mapBricks.length) {

        var z = 9;
        var y = localPlayerGraphics.y + 23;
        var x = localPlayerGraphics.x + 10;

        dot1.x = Math.floor(x - z);
        dot1.y = Math.floor(y + 24);
        dot2.x = Math.floor(x - z);
        dot2.y = Math.floor(y + 8);
        if (mapBricks[Math.floor(dot1.y / 16)][Math.floor(dot1.x / 32)]
        && !mapBricks[Math.floor(dot2.y / 16)][Math.floor(dot2.x / 32)]) {
            dot1.beginFill(0x00FF00);
            dot1.drawRect(0, 0, 1, 1);
            dot2.beginFill(0x00FF00);
            dot2.drawRect(0, 0, 1, 1);
        } else {
            dot1.beginFill(0xFF0000);
            dot1.drawRect(0, 0, 1, 1);
            dot2.beginFill(0xFF0000);
            dot2.drawRect(0, 0, 1, 1);
        }

         if (bbb[ trunc(x-z) div 32, trunc(y+25) div 16].block = true) and
         (bbb[ trunc(x-z) div 32, trunc(y+23) div 16].block = false) then begin result := true; exit; end;
         if (bbb[ trunc(x+z) div 32, trunc(y+25) div 16].block = true) and
         (bbb[ trunc(x+z) div 32, trunc(y+23) div 16].block = false) then begin result := true; exit; end;
         if (bbb[ trunc(x-z) div 32, trunc(y+24) div 16].block = true) and
         (bbb[ trunc(x-z) div 32, trunc(y+8)  div 16].block = false) then begin result := true; exit; end;
         if (bbb[ trunc(x+z) div 32, trunc(y+24) div 16].block = true) and
         (bbb[ trunc(x+z) div 32, trunc(y+8)  div 16].block = false) then begin result := true; exit; end;
    }*/
    renderer.render(stage);
}
