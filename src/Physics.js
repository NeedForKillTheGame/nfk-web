import Howl from "Howl";
import Constants from "./Constants.js";

var mapBricks;
var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;

var jumpSound = new Howl({
    urls: ['sounds/jump1.wav']
});

const BRICK_WIDTH = Constants.BRICK_WIDTH;
const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const PLAYER_MAXSPEED = Constants.PLAYER_MAXSPEED;
const GRAVITY = Constants.GRAVITY;

function isBrick(x, y) {
    var row = Math.floor(y / BRICK_HEIGHT);
    var col = Math.floor(x / BRICK_WIDTH);
    if (typeof mapBricks[row] == "undefined") {
        return false;
    }
    return mapBricks[row][col];
}

function isOnGround(playerX, playerY) {

    return isBrick(playerX - 9, playerY + 25) && !isBrick(playerX - 9, playerY + 23)
        || isBrick(playerX + 9, playerY + 25) && !isBrick(playerX + 9, playerY + 23)
        || isBrick(playerX - 9, playerY + 24) && !isBrick(playerX - 9, playerY + 8)
        || isBrick(playerX + 9, playerY + 24) && !isBrick(playerX + 9, playerY + 8);
}

function isBrickCrouchOnHead(playerX, playerY) {
    return isBrick(playerX - 8, playerY - 9) && !isBrick(playerX - 8, playerY - 7)
        || isBrick(playerX + 8, playerY - 9) && !isBrick(playerX + 8, playerY - 7)
        || isBrick(playerX - 8, playerY - 23)
        || isBrick(playerX + 8, playerY - 23)
        || isBrick(playerX - 8, playerY - 16)
        || isBrick(playerX + 8, playerY - 16);
}

function isBrickOnHead(playerX, playerY) {
    return isBrick(playerX - 9, playerY - 25) && !isBrick(playerX - 9, playerY - 23)
        || isBrick(playerX + 9, playerY - 25) && !isBrick(playerX + 9, playerY - 23)
        || isBrick(playerX - 9, playerY - 24) && !isBrick(playerX - 9, playerY - 8)
        || isBrick(playerX + 9, playerY - 24) && !isBrick(playerX + 9, playerY - 8);
}

function playerphysic(player) {

    // --!-!-!=!=!= ULTIMATE 3d[Power]'s PHYSIX M0DEL =!=!=!-!-!--

    var defx = player.x;
    var defy = player.y;
    player.velocityY = player.velocityY + (GRAVITY * 2.80); // --> 10

    if (player.velocityY > -1 && player.velocityY < 0) {
        player.velocityY /= 1.11; // progressive inertia
    }
    if (player.velocityY > 0 && player.velocityY < 5) {
        player.velocityY *= 1.1; // progressive inertia
    }

    if (player.velocityX < -0.2 || player.velocityX > 0.2) {
        if (player.dir > 1) {
            //No active key left/right pressed
            if (isOnGround(player.x, player.y)) {
                player.velocityX /= 1.14;    // ongroud stop speed.
            }
            else {
                player.velocityX /= 1.025;   // inair stopspeed.
            }
        }
    } else {
        //completelly stop if velocityX less then 0.2
        player.velocityX = 0;
    }

    player.x += player.velocityX;
    player.y += player.velocityY;

    // wall CLIPPING

    if (player.crouch) {

        //VERTICAL CHECNING
        if (isBrickCrouchOnHead(player.x, player.y) && isOnGround(player.x, player.y)) {
            player.velocityY = 0;
            player.y = Math.floor(Math.round(player.y) / 16) * 16 + 8;
        } else if (isBrickCrouchOnHead(player.x, player.y) && player.velocityY < 0) {      // fly up
            player.velocityY = 0;
            player.doublejumpCountdown = 3;
            player.y = Math.floor(Math.round(player.y) / 16) * 16 + 8;
        } else if (isOnGround(player.x, player.y) && player.velocityY > 0) {
            player.velocityY = 0;
            player.y = Math.floor(Math.round(player.y) / 16) * 16 + 8;
        }

        // HORZ CHECK
        if (player.velocityX < 0) {    // check clip wallz.
            if (isBrick(defx - 10, player.y - 8)
                || isBrick(defx - 10, player.y)
                || isBrick(defx - 10, player.y + 16)) {
                player.x = Math.floor(defx / 32) * 32 + 9;
                player.velocityX = 0;
            }
        }
        if (player.velocityX > 0) {
            if (isBrick(defx + 10, player.y - 8)
                || isBrick(defx + 10, player.y)
                || isBrick(defx + 10, player.y + 16)) {
                player.x = Math.floor(defx / 32) * 32 + 22;
                player.velocityX = 0;
            }
        }

    } else {
        if (player.velocityX < 0) {    // check clip wallz.
            if (isBrick(defx - 10, defy - 16)
                || isBrick(defx - 10, defy)
                || isBrick(defx - 10, defy + 16)) {
                player.x = Math.floor(defx / 32) * 32 + 9;
                player.velocityX = 0;
            }
        }
        if (player.velocityX > 0) {
            if (isBrick(defx + 10, defy - 16)
                || isBrick(defx + 10, defy)
                || isBrick(defx + 10, defy + 16)) {
                player.x = Math.floor(defx / 32) * 32 + 22;
                player.velocityX = 0;
            }
        }
    }

    if (isBrickOnHead(player.x, player.y) && isOnGround(player.x, player.y)) {
        player.velocityY = 0;
        player.y = Math.floor(player.y / 16) * 16 + 8;
    } else if (isBrickOnHead(player.x, player.y) && player.velocityY < 0) {      // fly up
        player.velocityY = 0;
        player.doublejumpCountdown = 3;
        //player.y = Math.round(player.y / 16) * 16 + 8;
    } else if (isOnGround(player.x, player.y) && (player.velocityY > 0)) {
        player.velocityY = 0;
        player.y = Math.floor(player.y / 16) * 16 + 8;
    }

    if (player.velocityX < -5)  player.velocityX = -5;
    if (player.velocityX > 5)  player.velocityX = 5;
    if (player.velocityY < -5) player.velocityY = -5;
    if (player.velocityY > 5)  player.velocityY = 5;

    if (player.y > 480)  player.y = 100;

}

export function playermove(player, _mapBricks) {

    //dirty hack
    mapBricks = _mapBricks;
    keyUp = player.keyUp;
    keyDown = player.keyDown;
    keyLeft = player.keyLeft;
    keyRight = player.keyRight;

    if (player.doublejumpCountdown > 0) {
        player.doublejumpCountdown--;
    }

    playerphysic(player);

    var onGround = isOnGround(player.x, player.y);
    var brickOnHead = isBrickOnHead(player.x, player.y);
    var brickCrouchOnHead = isBrickCrouchOnHead(player.x, player.y);

    if (onGround) {
        player.velocityY = 0;  // really nice thing :)
    }

    if (keyUp) {
        // JUMP!
        if (onGround && !brickOnHead) {
            if (player.doublejumpCountdown > 4) {
                // double jumpz
                player.doublejumpCountdown = 14;
                player.velocityY = -3;
                player.crouch = false;
            } else {
                if (player.doublejumpCountdown === 0) {
                    player.doublejumpCountdown = 14;
                }
                player.velocityY = -2.9;
            }

            jumpSound.play();
        }
    }

    // CROUCH
    if (!keyUp && keyDown) {
        if (isOnGround(player.x, player.y)) {
            player.crouch = true;
        }
        else if (!brickCrouchOnHead) {
            player.crouch = false;
        }
    } else {
        if (brickCrouchOnHead) {
            player.crouch = true;

        } else {
            player.crouch = false;

        }
    }

    if (!brickCrouchOnHead && !onGround) {
        player.crouch = false;
    }

    if (keyLeft && keyRight || !keyLeft && !keyRight) {
        //If both keys down OR non of the keys pressed - stop moving
        if (player.dir < 2) {
            player.dir = player.dir + 2;
        }

    } else {
        //One of the keys pressed - left or right, starting calculation
        var maxSpeed = PLAYER_MAXSPEED;
        if (player.crouch) {
            maxSpeed--;
        }

        //While moving left - speed should be negative value
        var sign = keyLeft ? -1 : 1;

        if (player.velocityX * sign < 0) {
            //We are currently moving in opposite direction
            //So we make a fast turn with 0.8 acceleration
            player.velocityX += sign * 0.8;
        }

        var absVelocityX = Math.abs(player.velocityX);
        if (absVelocityX < maxSpeed) {
            //We are not at the maximum speed yet, continue acceleration
            player.velocityX += sign * 0.35;
        } else if (absVelocityX > maxSpeed) {
            //Somehow we are out of the speed limit. Let's limit it!
            player.velocityX = sign * maxSpeed;
        }

        //Finally change current direction flag
        player.dir = keyLeft ? 0 : 1;
    }
}