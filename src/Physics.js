import Constants from "./Constants.js";
import Sound from "./Sound.js";
import Map from "./Map.js";
import Utils from "./Utils.js";
import Console from "./Console.js";

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;

//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
var isBrick = Map.isBrick;
var trunc = Utils.trunc;

var defx = 0;
var defy = 0;

var tmpCol = 0;
var tmpY = 0;
var tmpSpeedX = 0;
function playerphysic(player) {
    // --!-!-!=!=!= ULTIMATE 3d[Power]'s PHYSIX M0DEL =!=!=!-!-!--

    defx = player.x;
    defy = player.y;
    player.velocityY = player.velocityY + 0.056;

    if (player.velocityY > -1 && player.velocityY < 0) {
        player.velocityY /= 1.11; // progressive inertia
    }
    if (player.velocityY > 0 && player.velocityY < 5) {
        player.velocityY *= 1.1; // progressive inertia
    }

    if (player.velocityX < -0.2 || player.velocityX > 0.2) {
        if (player.keyLeft === player.keyRight) {
            //No active key left/right pressed
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

    if (player.velocityX !== 0) {
        tmpSpeedX = (player.velocityX < 0 ? -1 : 1) * velocityXSpeedJump[player.speedJump];
    } else {
        tmpSpeedX = 0;
    }
    player.setXY(player.x + player.velocityX + tmpSpeedX, player.y + player.velocityY);

    // wall CLIPPING
    if (player.crouch) {
        //VERTICAL CHECNING WHEN CROUCH FIRST
        if (player.isOnGround() && (player.isBrickCrouchOnHead() || player.velocityY > 0)) {
            player.velocityY = 0;
            player.setY(trunc(Math.round(player.y) / 16) * 16 + 8);
        } else if (player.isBrickCrouchOnHead() && player.velocityY < 0) {      // fly up
            player.velocityY = 0;
            player.doublejumpCountdown = 3;
            player.setY(trunc(Math.round(player.y) / 16) * 16 + 8);
        }
    }

    // HORZ CHECK
    if (player.velocityX != 0) {
        tmpCol = trunc(Math.round(defx + (player.velocityX < 0 ? -11 : 11)) / 32);
        tmpY = player.crouch ? player.y : defy;
        if (
            isBrick(tmpCol, trunc(Math.round(tmpY - (player.crouch ? 8 : 16)) / 16))
            || isBrick(tmpCol, trunc(Math.round(tmpY) / 16))
            || isBrick(tmpCol, trunc(Math.round(tmpY + 16) / 16))
        ) {
            player.setX(trunc(defx / 32) * 32 + (player.velocityX < 0 ? 9 : 22));
            player.velocityX = 0;
            player.speedJump = 0;
            if (defx != player.x) {
                log('wall', player);
            }
        }
    }

    //Vertical check again after x change
    if (player.isOnGround() && (player.isBrickOnHead() || player.velocityY > 0)) {
        player.velocityY = 0;
        player.setY(trunc(Math.round(player.y) / 16) * 16 + 8);
    } else if (player.isBrickOnHead() && player.velocityY < 0) {
        // fly up
        player.velocityY = 0;
        player.doublejumpCountdown = 3;
    }

    if (player.velocityX < -5)  player.velocityX = -5;
    if (player.velocityX > 5)  player.velocityX = 5;
    if (player.velocityY < -5) player.velocityY = -5;
    if (player.velocityY > 5)  player.velocityY = 5;
}

var tmpAbsMaxVelocityX = 0;
var tmpSign = 0;
var velocityYSpeedJump = [0, 0, 0.4, 0.8, 1.0, 1.2, 1.4];
var velocityXSpeedJump = [0, 0.33, 0.8, 1.1, 1.4, 1.8, 2.2];
var tmpLastWasJump = false;
var tmpCurJump = false;
var speedJumpDirection = 0;
var tmpLastKeyUp = false;
var tmpDjBonus = 0;
function playermove(player) {

    playerphysic(player);

    if (player.doublejumpCountdown > 0) {
        player.doublejumpCountdown--;
    }

    if (player.isOnGround()) {
        player.velocityY = 0;  // really nice thing :)
    }

    tmpCurJump = false;

    if (player.speedJump > 0
        && (player.keyUp !== tmpLastKeyUp
        || player.keyLeft && speedJumpDirection !== -1
        || player.keyRight && speedJumpDirection !== 1)
    ) {
        player.speedJump = 0;
        log('sj 0 - change keys', player);
    }

    tmpLastKeyUp = player.keyUp;

    if (player.keyUp) {
        // JUMP!
        if (player.isOnGround() && !player.isBrickOnHead() && !tmpLastWasJump) {

            if (player.doublejumpCountdown > 4 && player.doublejumpCountdown < 11) {
                // double jumpz
                player.doublejumpCountdown = 14;
                player.velocityY = -3;

                if (player.velocityX !== 0) {
                    tmpSpeedX = Math.abs(player.velocityX) + velocityXSpeedJump[player.speedJump];
                } else {
                    tmpSpeedX = 0;
                }

                if (tmpSpeedX > 3) {
                    tmpDjBonus = tmpSpeedX - 3;
                    player.velocityY -= tmpDjBonus;
                    log('dj higher (bonus +' + round(tmpDjBonus) + ')', player);
                } else {
                    log('dj standart', player);
                }
                player.crouch = false;
                Sound.jump();

                //player.velocityY += velocityYSpeedJump[player.speedJump];
            } else {
                if (player.doublejumpCountdown === 0) {
                    player.doublejumpCountdown = 14;
                    Sound.jump();
                }
                player.velocityY = -2.9;
                player.velocityY += velocityYSpeedJump[player.speedJump];

                log('jump', player);

                if (player.speedJump < 6 && !tmpLastWasJump && player.keyLeft !== player.keyRight) {
                    speedJumpDirection = player.keyLeft ? -1 : 1;
                    player.speedJump++;
                    log('increase sj', player);
                }
            }

            tmpCurJump = true;
        }
    } else {
        if (player.isOnGround() && player.speedJump > 0 && !player.keyDown) {
            player.speedJump = 0;
            log('sj 0 - on ground', player);
        }
    }

    // CROUCH
    if (!player.keyUp && player.keyDown) {
        if (player.isOnGround()) {
            player.crouch = true;
        }
        else if (!player.isBrickCrouchOnHead()) {
            player.crouch = false;
        }
    } else {
        player.crouch = player.isOnGround() && player.isBrickCrouchOnHead();
    }

    tmpLastWasJump = tmpCurJump;

    if (player.keyLeft !== player.keyRight) {
        //One of the keys pressed - left or right, starting calculation
        tmpAbsMaxVelocityX = PLAYER_MAX_VELOCITY_X;
        if (player.crouch) {
            tmpAbsMaxVelocityX--;
        }

        //While moving left - speed should be negative value
        tmpSign = player.keyLeft ? -1 : 1;

        if (player.velocityX * tmpSign < 0) {
            //We are currently moving in opposite direction
            //So we make a fast turn with 0.8 acceleration
            player.velocityX += tmpSign * 0.8;
        }

        var absVelocityX = Math.abs(player.velocityX);
        if (absVelocityX < tmpAbsMaxVelocityX) {
            //We are not at the maximum speed yet, continue acceleration
            player.velocityX += tmpSign * 0.35;
        } else if (absVelocityX > tmpAbsMaxVelocityX) {
            //Somehow we are out of the speed limit. Let's limit it!
            player.velocityX = tmpSign * tmpAbsMaxVelocityX;
        }
    }
}

function runPhysicsOneFrame(player) {

    //Стратегия расчёта физики следующая:
    //Используя текущие значения скорости (расчитанные в предыдущем кадре) сделаем перемещение игрока
    //Проверим столкновения со стенами, сделаем корректировку позиции игрока, если он провалился внутрь какой-нибудь стены
    //Перед обновлением позиции игрока запомним старые значения колонки
    playermove(player);
}

var time = 0;
var tmpDeltaTime = 0;
var tmpDeltaPhysicFrames = 0;

export function updateGame(player, timestamp) {

    if (time === 0) {
        //Это первый запуск функции, начальное время игры ещё не было установлено
        //Установим это время на 16мс назад, чтобы просчитать физику одного физического фрейма
        time = timestamp - 16;
    }

    //Физика основана на константах из NFK
    //В NFK физика была привзяна к FPS=50, поэтому вск константы были из расчёта FPS=50
    //В новой реализации физика не должна быть привязана к FPS выдаваемому компьютером, а будет привязана к времени
    //Сделаем расчёт исходя из 60 FPS (т.е. игра будет чуть быстрее, чем оригинальная): 1сек/60 = 16мили секунд
    //Чтобы сохранить все старые константы, почитаем какое перемещение нужно сделать за реально прошедшее время deltaTime?
    tmpDeltaTime = timestamp - time;
    //Назовём 20милисекундный интервал "физическим фреймом"
    //Посчитаем, сколько физических фреймов прошло за delltaTime?
    tmpDeltaPhysicFrames = trunc(tmpDeltaTime / 16);
    if (tmpDeltaPhysicFrames === 0) {
        //Ещё не накопилось достаточно времени, чтобы начёт расчёт хотя бы одного физического фрейма!
        //Прерываем выполнение функции
        return false;
    }

    //Сдвинем указатель time вперёд на нужно число физических фреймов для следующей итерации
    time += tmpDeltaPhysicFrames * 16.6;

    //Есть один или несколько физических фреймов, которые нужно общитать в физической модели, сделаем это в цикле
    if (tmpDeltaPhysicFrames === 1) {
        //В большинстве случаев фрейм будет ровно один, так что для производительности рассмотрим этот вариант отдельно
        runPhysicsOneFrame(player);
    } else {
        //Нужно сделать несколько перемещений в цикле
        while (tmpDeltaPhysicFrames > 0) {
            runPhysicsOneFrame(player);
            tmpDeltaPhysicFrames--;
        }
    }
}

var logLine = 0;
var textarea = document.getElementById('log');
var newText = '';
function log(text, player) {
    logLine++;
    if (player.velocityX !== 0) {
        tmpSpeedX = (player.velocityX < 0 ? -1 : 1) * velocityXSpeedJump[player.speedJump];
    } else {
        tmpSpeedX = 0;
    }
    newText = logLine
    + ' '
    + text
    + ' (x: ' + round(player.x)
    + ', y: ' + round(player.y)
    + ', dx: ' + round(tmpSpeedX)
    + ', dy: ' + round(player.velocityY)
    + ', sj: ' + player.speedJump
    + ')';
    textarea.value = newText + "\n" + textarea.value.substring(0, 1000);
    Console.writeText(newText);
}

function round(val) {
    return trunc(val) + '.' + Math.abs(trunc(val * 10) - trunc(val) * 10)
}