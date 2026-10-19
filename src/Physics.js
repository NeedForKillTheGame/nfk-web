import Constants from "./Constants.js";
import Sound from "./Sound.js";
import Map from "./Map.js";
import Utils from "./Utils.js";
import Console from "./Console.js";

//Физика повторяет playerphysic() и движение игрока из playermove() оригинального NFK строчка-в-строчку.
//Источник: Unit1.pas из https://github.com/NeedForKillTheGame/nfk-reconstruction (исходники NFK 0.77,
//playermove там побайтно совпадает с NFK.exe 0.77)

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;
const PHYSICS_FRAME_MS = Constants.PHYSICS_FRAME_MS;
const DIR_LW = Constants.DIR_LW;
const DIR_RW = Constants.DIR_RW;

//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
var isBrick = Map.isBrick;
var trunc = Utils.trunc;
var round = Utils.round;
var fround = Math.fround || function (val) { return val; };

//0.75 strafe-jump tables, indexed by player.speedJump. They are "single" in NFK, hence fround()
var strafeTableX = [0, 0.33, 0.8, 1.1, 1.4, 1.8, 2.2].map(fround);
var strafeTableY = [0, 0, 0.4, 0.8, 1.0, 1.2, 1.4].map(fround);

var defx = 0;
var defy = 0;
var tmpCol = 0;
var tmpY = 0;
var tmpSpeed = 0;

//bbb[col, round(y) div 16].block
function hasWall(col, y) {
    return isBrick(col, trunc(round(y) / 16));
}

function playerphysic(player) {
    // --!-!-!=!=!= ULTIMATE 3d[Power]'s PHYSIX M0DEL =!=!=!-!-!--

    defx = player.x;
    defy = player.y;
    player.velocityY = player.velocityY + 0.056; // Gravity*2.80

    if (player.velocityY > -1 && player.velocityY < 0) {
        player.velocityY /= 1.11; // progressive inertia
    }
    if (player.velocityY > 0 && player.velocityY < 5) {
        player.velocityY *= 1.1; // progressive inertia
    }

    if (player.velocityX < -0.2 || player.velocityX > 0.2) {
        //Slow down only if no left/right key was pressed in the previous frame (player stands: dir 2 or 3)
        if (player.dir > DIR_RW) {
            if (player.isOnGround()) {
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

    if (player.dead > 0 && player.isOnGround()) {
        player.velocityX /= 1.03;   // corpse stop speed.
    }

    player.x = player.x + player.velocityX;
    player.y = player.y + player.velocityY;

    // 0.75: airborne resets the grounded-frames counter
    if (!player.isOnGround()) {
        player.groundTicks = 0;
    }

    // wall CLIPPING
    if (player.crouch) {
        //VERTICAL CHECKING when crouch goes first
        if (player.isBrickCrouchOnHead() && player.isOnGround()) {
            player.velocityY = 0;
            player.y = trunc(round(player.y) / 16) * 16 + 8;
        } else if (player.isBrickCrouchOnHead() && player.velocityY < 0) {      // fly up
            player.velocityY = 0;
            player.doublejumpCountdown = 3;
            player.y = trunc(round(player.y) / 16) * 16 + 8;
        } else if (player.isOnGround() && player.velocityY > 0) {
            player.velocityY = 0;
            player.y = trunc(round(player.y) / 16) * 16 + 8;
        }
    }

    // HORZ CHECK: crouching player is checked at the new y (y-8, y, y+16), standing one at the old y (y-16, y, y+16)
    tmpY = player.crouch ? player.y : defy;
    if (player.velocityX < 0) {
        tmpCol = trunc(round(defx - 10) / 32);
        if (hasWall(tmpCol, tmpY - (player.crouch ? 8 : 16)) || hasWall(tmpCol, tmpY) || hasWall(tmpCol, tmpY + 16)) {
            player.x = trunc(defx / 32) * 32 + 9;
            player.velocityX = 0;
            player.speedJump = 0;   // 0.75: wall hit kills strafe charge
            if (defx != player.x) {
                log('wall', player);
            }
        }
    }
    if (player.velocityX > 0) {
        tmpCol = trunc(round(defx + 10) / 32);
        if (hasWall(tmpCol, tmpY - (player.crouch ? 8 : 16)) || hasWall(tmpCol, tmpY) || hasWall(tmpCol, tmpY + 16)) {
            player.x = trunc(defx / 32) * 32 + 22;
            player.velocityX = 0;
            player.speedJump = 0;   // 0.75: wall hit kills strafe charge
            if (defx != player.x) {
                log('wall', player);
            }
        }
    }

    //Vertical check again after x change
    if (player.isBrickOnHead() && player.isOnGround()) {
        player.velocityY = 0;
        player.y = trunc(round(player.y) / 16) * 16 + 8;
    } else if (player.isBrickOnHead() && player.velocityY < 0) {
        // fly up
        player.velocityY = 0;
        player.doublejumpCountdown = 3;
        player.y = trunc(round(player.y) / 16) * 16 + 8;
    } else if (player.isOnGround() && player.velocityY > 0) {
        player.velocityY = 0;
        if (player.groundTicks < 255) {
            player.groundTicks++; // 0.75: count grounded frames
        }
        player.y = trunc(round(player.y) / 16) * 16 + 8;
    }

    //There is no water and lava in nfk-web maps, so only the normal move limits (NFK: -1..1 / -2..2 in water)
    if (player.velocityY < -5) player.velocityY = -5;
    if (player.velocityY > 5)  player.velocityY = 5;
    if (player.velocityX < -5) player.velocityX = -5;
    if (player.velocityX > 5)  player.velocityX = 5;

    if (player.y > 16 * 250) player.y = 16 * 250 - 16;
}

function playermove(player) {

    playerphysic(player);

    if (player.doublejumpCountdown > 0) {
        player.doublejumpCountdown--;
    }

    if (player.isOnGround()) {
        player.velocityY = 0;  // really nice thing :)
    }

    //Holding the jump key jumps again on every landing, NFK has no "key released" check.
    //Swimming up and the flight powerup branches of NFK are skipped: nfk-web has no water and items.
    //isDoubleJumpPossible() of NFK always returns false, so only isOnGround() matters.
    if (player.keyUp && player.isOnGround() && !player.isBrickOnHead()) {
        // JUMP!
        // 0.75 strafe-jump charge: jumped again within 5 frames after landing
        if (player.groundTicks < 5 && player.speedJump < 6) {
            player.speedJump++;
            log('increase sj', player);
        }
        player.groundTicks = 255;

        if (player.doublejumpCountdown > 4) {
            // double jumpz
            player.doublejumpCountdown = 14;
            player.velocityY = -3;
            player.crouch = false;
            log('dj', player);
        } else {
            if (player.doublejumpCountdown === 0) {
                player.doublejumpCountdown = 14;
                Sound.jump();
            }
            player.velocityY = -2.9; // simplephysics 1 (default in 0.77), it is -2 with simplephysics 0
            log('jump', player);
        }
        player.velocityY += strafeTableY[player.speedJump]; // 0.75 strafe-jump boost
    }

    // CROUCH
    if (!player.keyUp) {
        if (player.keyDown) {
            if (player.isOnGround()) {
                player.crouch = true;
            }
        } else if (!player.isBrickCrouchOnHead()) {
            player.crouch = false;
        }
    }

    if (!player.isBrickCrouchOnHead() && !player.isOnGround()) {
        player.crouch = false;
    }

    //dir of the current frame is used by the next frame friction in playerphysic()
    if (player.dir < 2) {
        player.dir += 2;
    }

    if (player.keyLeft && player.keyRight) {
        player.speedJump = 0;   // 0.75: left+right cancels strafe charge
        return;
    }

    // 0.75: bleed off strafe charge when slow, or after being grounded a while
    if ((Math.abs(player.velocityX) < 3.0 || player.groundTicks > 5 && player.groundTicks < 150) && player.speedJump > 0) {
        player.speedJump--;
    }

    if (player.keyLeft) {
        tmpSpeed = player.crouch ? PLAYER_MAX_VELOCITY_X - 1 : fround(PLAYER_MAX_VELOCITY_X + strafeTableX[player.speedJump]);

        if (player.velocityX > 0) player.velocityX -= 0.8; //fast turn
        if (player.velocityX > -tmpSpeed) player.velocityX -= 0.35;
        if (player.velocityX < -tmpSpeed) player.velocityX = -tmpSpeed;
        player.dir = DIR_LW;
    }

    if (player.keyRight) {
        tmpSpeed = player.crouch ? PLAYER_MAX_VELOCITY_X - 1 : fround(PLAYER_MAX_VELOCITY_X + strafeTableX[player.speedJump]);

        if (player.velocityX < 0) player.velocityX += 0.8; //fast turn
        if (player.velocityX < tmpSpeed) player.velocityX += 0.35;
        if (player.velocityX > tmpSpeed) player.velocityX = tmpSpeed;
        player.dir = DIR_RW;
    }
}

var time = 0;
var tmpDeltaPhysicFrames = 0;

export function updateGame(player, timestamp) {

    if (time === 0) {
        //Это первый запуск функции, начальное время игры ещё не было установлено
        //Установим это время на один физический фрейм назад, чтобы просчитать физику одного физического фрейма
        time = timestamp - PHYSICS_FRAME_MS;
    }

    //Физика основана на константах из NFK, а в NFK физика привязана к FPS=50
    //Поэтому физику считаем фиксированными "физическими фреймами" по 20мс, независимо от FPS браузера
    //Посчитаем, сколько физических фреймов прошло с прошлого расчёта?
    tmpDeltaPhysicFrames = trunc((timestamp - time) / PHYSICS_FRAME_MS);
    if (tmpDeltaPhysicFrames === 0) {
        //Ещё не накопилось достаточно времени, чтобы начёт расчёт хотя бы одного физического фрейма!
        //Прерываем выполнение функции
        return false;
    }

    //Сдвинем указатель time вперёд ровно на просчитанные физические фреймы, остаток времени перейдёт в следующую итерацию
    time += tmpDeltaPhysicFrames * PHYSICS_FRAME_MS;

    //Есть один или несколько физических фреймов, которые нужно общитать в физической модели, сделаем это в цикле
    while (tmpDeltaPhysicFrames > 0) {
        playermove(player);
        tmpDeltaPhysicFrames--;
    }
}

var logLine = 0;
var textarea = document.getElementById('log');
var newText = '';
function log(text, player) {
    logLine++;
    newText = logLine
    + ' '
    + text
    + ' (x: ' + roundLog(player.x)
    + ', y: ' + roundLog(player.y)
    + ', dx: ' + roundLog(player.velocityX)
    + ', dy: ' + roundLog(player.velocityY)
    + ', sj: ' + player.speedJump
    + ')';
    textarea.value = newText + "\n" + textarea.value.substring(0, 1000);
    Console.writeText(newText);
}

function roundLog(val) {
    return trunc(val) + '.' + Math.abs(trunc(val * 10) - trunc(val) * 10)
}
