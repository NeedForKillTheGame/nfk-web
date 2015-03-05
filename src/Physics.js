import Constants from "./Constants.js";
import Sound from "./Sound.js";
import Map from "./Map.js";

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const BRICK_WIDTH = Constants.BRICK_WIDTH;
const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const PLAYER_WIDTH = Constants.PLAYER_WIDTH;
const PLAYER_MAXSPEED = Constants.PLAYER_MAXSPEED;
const GRAVITY = Constants.GRAVITY;

//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
var isBrick = Map.isBrick;

function getCol(x) {
    return Math.floor(x / BRICK_WIDTH);
}

function getRow(y) {
    return Math.floor(y / BRICK_HEIGHT)
}

function getBottom(row) {
    return row * BRICK_HEIGHT + BRICK_HEIGHT - 1;
}

function getLeft(col) {
    return col * BRICK_WIDTH;
}

function hasPlayerCollisionWithMap(newLeft, newBottom, crouch) {
    //В худшем случае игрок может быть поверх восьми бриков: два по горизонтали и четыре по вертикали
    //Проверим каждый из этих бриков - если ли там брик от карты?
    var leftCol = getCol(newLeft),
        rightCol = getCol(newLeft + PLAYER_WIDTH);

    //Занимаемые игроком строки (снизу вверх, от bottom до головы игрока)
    var row1 = getRow(newBottom), //первая (самя нижняя) строка определяется просто по нижней координате
        row2 = row1 - 1, //строка выше - тут тоже просто
        row3, row4;
    if (crouch) {
        //Если игрок присел, то он занимает либо 2 (если на земле) либо 3 строки (если в воздухе)
        //Соответсвенно, определим, занимает ли он третью строку? (присевший в полёте игрок)
        row3 = getRow(newBottom - BRICK_HEIGHT * 2 + 1); //Y координата головы присевшего игрока: bottom - BRICK_HEIGHT * 3 + 1
        row4 = null;
    } else {
        //Если игрок стоит, то он занимает либо 3 (если на земле) либо 4 сторки (если в воздухе)
        row3 = row2 - 1;
        row4 = getRow(newBottom - BRICK_HEIGHT * 3 + 1); //Y координата головы стоящего игрока: bottom - BRICK_HEIGHT * 3 + 1
    }

    //Проверим задевает ли игрок один из 8 бриков?
    //Проверим коллизии по левой колонке
    //а затем проверим коллизии по правой колонке, если правая колонка отличается от левой (небольшая оптимизация в коде
    return (
        isBrick(row1, leftCol)
        || isBrick(row2, leftCol)
        || row2 !== row3 && isBrick(row3, leftCol)
        || row3 !== row4 && isBrick(row4, leftCol)

        ) || leftCol !== rightCol && (

        isBrick(row1, rightCol)
        || isBrick(row2, rightCol)
        || row2 !== row3 && isBrick(row3, rightCol)
        || row3 !== row4 && isBrick(row4, rightCol)
        );
}

function updatePlayerCacheValues(player) {
    player.cacheJustOnBrick = ((player.bottom + 1) % BRICK_HEIGHT) === 0;
    player.cacheBottomRow = getRow(player.bottom);
    player.cacheHeadRow = player.cacheBottomRow - (player.crouch ? 2 : 3) + (player.cacheJustOnBrick ? 1 : 0);
    player.cacheLeftCol = getCol(player.left);
    player.cacheRightCol = getCol(player.left + PLAYER_WIDTH);

}

function updatePlayerPosition(player) {
    var newLeft = player.left + player.velocityX;
    var newBottom = player.bottom + player.velocityY;

    var hasCollision = hasPlayerCollisionWithMap(newLeft, newBottom, player.crouch);
    if (!hasCollision) {
        player.left = newLeft;
        player.bottom = newBottom;
        return;
    }

    var correctedNewBottom;
    if (player.velocityY != 0) {
        //было движение по Y
        //скорректируем позицию по Y, чтобы он был чётко на брике
        var newRow = getRow(newBottom);

        if (player.velocityY > 0) {
            //Если игрок двигался вниз и провалился в пол, то его нужно поднять на один брик вверх
            correctedNewBottom = getBottom(newRow - 1);
        } else {
            //А если двигался наверх, значит он упёрся в потолок, значит его нужно чуть-чуть приспустить вниз, чтобы он оказался ровно на целом числе бриков
            correctedNewBottom = getBottom(newRow);
        }

        //После корректировки позиции по Y проверим, осталась ли коллизия?
        hasCollision = hasPlayerCollisionWithMap(newLeft, correctedNewBottom, player.crouch);
        if (!hasCollision) {
            //Корретировка по Y помогла
            player.left = newLeft;
            player.bottom = correctedNewBottom;
            return;
        }
    }

    var correctedNewLeft;
    if (player.velocityX != 0) {
        //было движение по X
        //скорректируем позицию по X, чтобы он был чётко упёрт в стену
        if (player.velocityX > 0) {
            //Если игрок двигался вправо и заехал в стену. Узнаем координату начала этой стены и расположим игрока вплотную правым боком
            var colRight = getCol(newLeft + PLAYER_WIDTH);
            correctedNewLeft = getLeft(colRight) - PLAYER_WIDTH - 1;
            player.cacheRighBlocked = true;
        } else {
            //А если двигался влево, значит он чуть заехал внутрь левой стены, узнаем её координаты брика правее левой стены
            var colLeft = getCol(newLeft);
            correctedNewLeft = getLeft(colLeft + 1);
        }

        //После корректировки позиции по Y проверим, осталась ли коллизия?
        hasCollision = hasPlayerCollisionWithMap(correctedNewLeft, newBottom, player.crouch);
        if (!hasCollision) {
            //Корретировка по Х помогла
            player.left = correctedNewLeft;
            player.bottom = newBottom;
            return;
        }
    }

    //Если не помогла ни корректировка по X, ни корректировка по Y по отдельности, нужно применить одновременную корректировку и по X и по Y
    if (typeof correctedNewLeft !== "undefined") {
        player.left = correctedNewLeft;
    }

    if (typeof correctedNewBottom !== "undefined") {
        player.bottom = correctedNewBottom;
    }
}

function isBrickOnHead(player) {
    return player.cacheJustOnBrick
        && (isBrick(player.cacheHeadRow - 1, player.cacheLeftCol)
        || player.cacheLeftCol !== player.cacheRightCol && isBrick(player.cacheHeadRow - 1, player.cacheRightCol));
}

function updatePlayerVelocityYAndCrouch(player, onGround) {
    //Если мы стоим на земле - значит можно приседать и прыгать! Проверим...
    if (onGround) {
        //Если нажата кнопка вверх - попытка прыгнуть!
        if (player.keyUp) {
            if (!isBrickOnHead(player)) {
                //Можно прыгать, т.к. над головой ничего не мешает!
                player.velocityY = -3;
                Sound.jump();
            }
        } else {

            //Если мы на земле и не нажата кнопка вверх - принудительно обнуляем вертикальную скорость
            //это даст классный эффект зацепления за брик
            player.velocityY = 0;

            if (player.keyDown) {
                //Если нажата кнопка вниз - приседаем
                player.crouch = true;
            } else {
                //Если кнопка вниз отпущена - проверим, можем ли мы встать? Если брик над головой, то статус приседания
                //должен сохраниться. Если же брика над головой нет - то игрок долежн автоматичеси встать
                player.crouch = player.crouch && isBrickOnHead(player);
            }
        }

    } else {
        //Мы не на земле, мы в воздухе!
        //нужно принудительно отменить приседание
        player.crouch = false;

        //применим гравитацию
        player.velocityY = player.velocityY + (GRAVITY * 2.80); // --> 10

        if (player.velocityY > 0) {
            //При падении вниз ускоряемся быстрее!
            player.velocityY *= 1.1; // progressive inertia

            if (player.velocityY > 5) {
                //Максимальная скорость падения
                player.velocityY = 5;
            }

        } else {
            //В процессе полёта вверх
            if (isBrickOnHead(player)) {
                //Если над головой вплотную брик - обнуляем вертикальную скорость, чтобы через фрейм начать падать
                player.velocityY = 0;
            } else if (player.velocityY > -1) {
                //тормозим сильнее при приближении к вершине полёта
                player.velocityY /= 1.11; // progressive inertia
            }
        }
    }
}

function updatePlayerVelocityX(player, onGround) {

    if (player.keyLeft === player.keyRight) {
        //Если обе кнопки false (отжаты) или обе кнопки true (обе нажаты) - считаем, что игрок никуда _активно_ не идёт
        if (Math.abs(player.velocityX < 0.2)) {
            //Если в процессе естественного торможения горизоантальная скорость упала меньше чем до 0.2 - окончательно
            //останавливаем движение
            player.velocityX = 0;
        } else {
            //Скорость ещё не окончательно упала, продолжаем торможение
            //Томожение по земле с коэффициентом 1.14, по воздуху 1.025
            player.velocityX /= onGround ? 1.14 : 1.025;
        }

    } else {

        //Похоже одна из кнопок всё-таки нажата (либо вправо, либо влево)
        var absMaxSpeed = PLAYER_MAXSPEED;
        if (player.crouch) {
            //Если игрок присел - максимальная скросто меньше, чем если он стоит
            absMaxSpeed--;
        }

        //Чтобы унифицировать дальнейшие формулы, введём переменную со знаком + или - и будем умножать на неё
        var sign = player.keyLeft ? -1 : 1;

        if (player.velocityX * sign < 0) {
            //Человек по инерции всё ещё имеет скорость по X в противоположном направлении, чем нажата кнопка
            //(т.е. человек хочет сделать разворот). В этом случае ускоряем разворот на 0.8!
            player.velocityX += sign * 0.8;
        }

        var absVelocityX = Math.abs(player.velocityX);
        if (absVelocityX < absMaxSpeed) {
            //Мы ещё не достигли максимальной скорости, продолжаем увеличивать скорость
            player.velocityX += sign * 0.35;
        } else if (absVelocityX > absMaxSpeed) {
            //Мы превзошли максимальную скорость - ограничим себя
            player.velocityX = sign * absMaxSpeed;
        }

    }
}

function updatePlayerVelocity(player) {
    //Человек находится на земле, если его нижняя координата+1 целочисленно делится на высоту брика (т.е. остаток=0)
    //и ниже находится брик!
    var onGround = player.cacheJustOnBrick
        && (isBrick(player.cacheBottomRow + 1, player.cacheLeftCol)
        || player.cacheLeftCol !== player.cacheRightCol && isBrick(player.cacheBottomRow + 1, player.cacheRightCol));
    updatePlayerVelocityYAndCrouch(player, onGround);
    updatePlayerVelocityX(player, onGround);
}

function runPhysicsOneFrame(player) {
    //Для начала обновим кешируюие поля внутри объекта player, которые помогут нам с дальнейшими расчётами
    updatePlayerCacheValues(player);

    //Стратегия расчёта физики следующая:
    //1. Используя текущие значения скорости (расчитанные в предыдущем кадре) сделаем перемещение игрока
    //2. Проверим столкновения со стенами, сделаем корректировку позиции игрока, если он провалился внутрь какой-нибудь стены
    updatePlayerPosition(player);
    //3. Расчитаем новые значения скоростей на основе нажатых кнопок и констант с ускорениями (гравитация, трение и проч)
    //(новые скорости будут применены только в следующем фрейме)
    updatePlayerVelocity(player);
}

var time = 0;

export function updateGame(player) {

    if (time === 0) {
        //Это первый запуск функции, начальное время игры ещё не было установлено
        //Установим это время на 20мс назад, чтобы просчитать физику одного физического фрейма
        time = new Date().getTime() - 16.6;
    }

    //Физика основана на константах из NFK
    //В NFK физика была привзяна к FPS=50, поэтому вск константы были из расчёта FPS=50
    //В новой реализации физика не должна быть привязана к FPS выдаваемому компьютером, а будте привязана к времени
    //Время одного кадра из расчёта оригинальной NFK = 1сек/50 = 20мили секунд
    //Чтобы сохранить все старые константы, почитаем какое перемещение нужно сделать за реально прошедшее время deltaTime?
    var deltaTime = new Date().getTime() - time;
    //Назовём 20милисекундный интервал "физическим фреймом"
    //Посчитаем, сколько физических фреймов прошло за delltaTime?
    var deltaPhysicFrames = Math.floor(deltaTime / 16.6);
    if (deltaPhysicFrames === 0) {
        //Ещё не накопилось достаточно времени, чтобы начёт расчёт хотя бы одного физического фрейма!
        //Прерываем выполнение функции
        return false;
    }

    //Сдвинем указатель time вперёд на нужно число физических фреймов для следующей итерации
    time += deltaPhysicFrames * 16.6;

    //Есть один или несколько физических фреймов, которые нужно общитать в физической модели, сделаем это в цикле
    if (deltaPhysicFrames === 1) {
        //В большинстве случаев фрейм будет ровно один, так что для производительности рассмотрим этот вариант отдельно
        runPhysicsOneFrame(player);
    } else {
        //Нужно сделать несколько перемещений в цикле
        while (deltaPhysicFrames > 0) {
            runPhysicsOneFrame(player);
            deltaPhysicFrames--;
        }
    }
}