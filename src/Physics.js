import Constants from "./Constants.js";
import Sound from "./Sound.js";
import Map from "./Map.js";
import Utils from "./Utils.js";

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const BRICK_WIDTH = Constants.BRICK_WIDTH;
const BRICK_HEIGHT = Constants.BRICK_HEIGHT;
const PLAYER_WIDTH = Constants.PLAYER_WIDTH;
const PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;
const GRAVITY = Constants.GRAVITY;

//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
var isBrick = Map.isBrick;


/**
 * Проверяет на возможную колизию при движении вверх или вниз.
 * А именно проверяет два брика в одной строке
 * @param {number} row
 * @param {number} leftCol
 * @param {number} rightCol
 */
function hasPlayerCollisionVertical(row, leftCol, rightCol) {
    return isBrick(row, leftCol) || leftCol !== rightCol && isBrick(row, rightCol);
}

var tmpRow = 0;
/**
 * Проверяет на возможную колизию при движении лево или вправо
 * А именно проверяет колонку из бриков от bottom до top
 * @param {number} bottomRow
 * @param {number} topRow
 * @param {number} col
 */
function hasPlayerCollisionHorizontal(bottomRow, topRow, col) {
    tmpRow = bottomRow;
    while (tmpRow >= topRow) {
        if (isBrick(tmpRow, col)) {
            return true;
        }
        tmpRow--;
    }

    return false;
}

var tmpNewJustOnBrick = false;
var tmpNewBottomRow = 0;
var tmpNewTopRow = 0;
var tmpNewLeftCol = 0;
var tmpNewRightCol = 0;

var tmpNewBottom = 0.0;
var tmpNewLeft = 0.0;

var tmpToBeCheсkedRow = -100; //сильно отрицательное значение - ничего проверять не надо
var tmpToBeCheckedCol = -100;

var tmpPlayerHasCollizionVertical = false;
var tmpPlayerHasCollizionHorizontal = false;

function updatePlayerPosition(player) {

    if (player.velocityX === 0 && player.velocityY === 0) {
        //Если не было никакого движения, нечего обновлять, просто выходим из этого метода
        return;
    }

    if (player.velocityY) {
        //Если было движение по Y, то нужно расчитать новые значения по Y
        tmpNewBottom = player.bottom + player.velocityY;
        tmpNewBottomRow = Utils.getBottomBorderRow(tmpNewBottom);
        tmpNewTopRow = Utils.getPlayerTopRow(tmpNewBottom, player.crouch);

        //Одействительно ли игрок пересёк какую-либо строку по вертикали?
        if (tmpNewBottomRow !== player.cacheBottomRow || tmpNewTopRow !== player.cacheTopRow) {
            tmpToBeCheсkedRow = player.velocityY > 0 ? tmpNewBottomRow : tmpNewTopRow;
        } else {
            tmpToBeCheсkedRow = -100;
        }

    } else {
        //Движения по Y не было, то берём старые значения по Y
        tmpNewBottom = player.bottom;
        tmpNewBottomRow = player.cacheBottomRow;
        tmpNewTopRow = player.cacheTopRow;

        tmpToBeCheсkedRow = -100;
    }

    if (player.velocityX) {
        //Если было движение по X, то нужно  расчитать новые значения по X
        tmpNewLeft = player.left + player.velocityX;
        tmpNewLeftCol = Utils.getLeftBorderCol(tmpNewLeft);
        tmpNewRightCol = Utils.getRightBorderCol(tmpNewLeft + PLAYER_WIDTH);

        //действительно ли игрок пересёк какую-либо колонку по горизонтали?
        if (tmpNewLeftCol !== player.cacheLeftCol || tmpNewRightCol !== player.cacheRightCol) {
            tmpToBeCheckedCol = player.velocityX > 0 ? tmpNewRightCol : tmpNewLeftCol;
        } else {
            tmpToBeCheckedCol = -100;
        }

    } else {
        //Движения по X не было, то берём старые значения по X
        tmpNewLeft = player.left;
        tmpNewLeftCol = player.cacheLeftCol;
        tmpNewRightCol = player.cacheRightCol;

        tmpToBeCheckedCol = -100;
    }

    if (tmpToBeCheсkedRow === -100 && tmpToBeCheckedCol === -100) {
        //Игрок не пересекал строк или столбцов, значит и коллизий не должно было возникнуть!
        //Больше ничего не проверяем, просто обновим координаты
        player.setLeft(tmpNewLeft);
        player.setBottom(tmpNewBottom);
        return;
    }

    //Было какое-то движение. Проверим частный случай зацепления за брик:
    //например, игрок прижат к правой стене и жмёт вправо и одновременно он подлетает вверх. Стена заканчивается и он
    //должен зацепиться за горизонтальный брик (если, конечно, голове ничего не помешает)!
    if (player.cacheBottomRow - tmpNewBottomRow === 1
        && player.keyLeft !== player.keyRight
        && (
        player.keyLeft
        && player.cacheBlockedLeft
        && !hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewBottomRow - (player.keyDown ? 1 : 2), player.cacheLeftCol - 1)
        && !hasPlayerCollisionVertical(tmpNewBottomRow, player.cacheLeftCol - 1, player.cacheRightCol)
        ||
        player.keyRight
        && player.cacheBlockedRight
        && !hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewBottomRow - (player.keyDown ? 1 : 2), player.cacheRightCol + 1)
        && !hasPlayerCollisionVertical(tmpNewBottomRow, player.cacheLeftCol, player.cacheRightCol + 1)
        )
    ) {

        player.setLeft(player.left + (player.keyLeft ? -1 : 1));
        player.setBottom(Utils.getBottomBorder(tmpNewBottomRow));
        return;

    }

    //Если же падали внизу и приседали и пытались зати в какую-то стену влево или вправо - надо попытаться туда зайти!
    if (player.cacheTopRow - tmpNewTopRow === -1
        && player.keyDown
        && player.keyLeft !== player.keyRight
        && (
        player.keyLeft
        && player.cacheBlockedLeft
        && !hasPlayerCollisionHorizontal(tmpNewTopRow + 1, tmpNewTopRow, player.cacheLeftCol - 1)
        && !hasPlayerCollisionVertical(tmpNewTopRow + 1, player.cacheLeftCol - 1, player.cacheRightCol)
        ||
        player.keyRight
        && player.cacheBlockedRight
        && !hasPlayerCollisionHorizontal(tmpNewTopRow + 1, tmpNewTopRow, player.cacheRightCol + 1)
        && !hasPlayerCollisionVertical(tmpNewTopRow + 1, player.cacheLeftCol, player.cacheRightCol + 1)
        )
    ) {
        player.setLeft(player.left + (player.keyLeft ? -1 : 1));
        player.setBottom(Utils.getBottomBorder(tmpNewTopRow + 1));
        player.setCrouch(true);
        return;

    }

    //Было какое-то движение в результате которого игрок пересёк границу бриков. Проверим, не возникло ли коллизий?
    tmpPlayerHasCollizionVertical = tmpToBeCheсkedRow !== -100 && hasPlayerCollisionVertical(tmpToBeCheсkedRow, tmpNewLeftCol, tmpNewRightCol);
    tmpPlayerHasCollizionHorizontal = tmpToBeCheckedCol !== -100 && hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewTopRow, tmpToBeCheckedCol);

    if (!tmpPlayerHasCollizionVertical && !tmpPlayerHasCollizionHorizontal) {
        //Коллизий не обнаружилось!
        player.setLeft(tmpNewLeft);
        player.setBottom(tmpNewBottom);
        return;
    }

    //Есть какие-то коллизии. Либо по вертикали, либо по горизонтали, либо и обе

    //Для начала попробуем скорректировать координату по вертикали, елси была коллизия по вертикали
    if (tmpPlayerHasCollizionVertical) {
        //Какая-то коллизия есть... Для начала попробуем скорректировать положение по вертикали, вернув старое,
        // и посмотреть, удалось ли исправить коллизии

        //При проверке новой коллизии по вертикали используем старое значение либо cacheBottomRow, либо cacheTopRow
        //Если двигались вниз, значит вертикальная коллизия возникала в bottom и именно его и будем проверять повторно
        //Если двигались вверх, значит коллизия была вверзу и будем проверять top
        tmpToBeCheсkedRow = player.velocityY > 0 ? player.cacheBottomRow : player.cacheTopRow;

        tmpPlayerHasCollizionVertical = hasPlayerCollisionVertical(tmpToBeCheсkedRow, tmpNewLeftCol, tmpNewRightCol);
        //Горизонтальную коллизию тоже нужно проверять по старым переменным player.cacheBottomRow и player.cacheTopRow
        tmpPlayerHasCollizionHorizontal = tmpToBeCheckedCol !== -100 && hasPlayerCollisionHorizontal(player.cacheBottomRow, player.cacheTopRow, tmpToBeCheckedCol);
        if (!tmpPlayerHasCollizionVertical && !tmpPlayerHasCollizionHorizontal) {

            //После корректировки по вертикали коллизии исчезли!
            player.setLeft(tmpNewLeft);

            //Если движение было вниз и игрок прошел сквозь пол, чуть-чуть приподнимаем игрока, чтобы он оказался ровно на полу
            //и используем для этого старое значение строки bottom: player.cacheBottomRow

            //Если же движение было вверх и игрок прошел сквозь потолок, чуть-чуть приспускаем игрока, чтобы он оказался ровно под потолком
            //и используем для этого
            player.setBottom(Utils.getBottomBorder(player.velocityY > 0 ? player.cacheBottomRow : tmpNewBottomRow));

            return;
        }
    }

    //Если дошли до этого момента: либо корректировка по вертикали не помогла, либо по вертикали вообще не было коллизии
    //и коллизия была только по горизонтали
    if (tmpPlayerHasCollizionHorizontal) {
        //Какая-то коллизия по горизонтали есть... Попробуем скорректировать положение по горизонтали, вернув старое,
        // и посмотреть, удалось ли исправить коллизии

        //При проверке новой коллизии по горизонтали используем старое значение либо cacheLeftCol, либо cacheRight
        //Если двигались влево, значит горизонтальная коллизия возникала в left и именно его и будем проверять повторно
        //Если двигались вправо, значит коллизия была справа и будем проверять right
        tmpToBeCheckedCol = player.velocityX > 0 ? player.cacheRightCol : player.cacheLeftCol;

        tmpPlayerHasCollizionHorizontal = hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewTopRow, tmpToBeCheckedCol);
        //Вертикальную коллизию тоже нужно проверять по старым переменным player.cacheLeftCol и player.cacheRightCol
        tmpPlayerHasCollizionVertical = tmpToBeCheсkedRow !== -100 && hasPlayerCollisionVertical(tmpToBeCheсkedRow, player.cacheLeftCol, player.cacheRightCol);
        if (!tmpPlayerHasCollizionVertical && !tmpPlayerHasCollizionHorizontal) {
            //Корректировка по X помогла, теперь нужно чётко упереться в нужную стену
            if (player.velocityX > 0) {
                //Если двигались вправо, то упираемся в правую стену
                player.setLeft(Utils.getRightBorder(player.cacheRightCol) - PLAYER_WIDTH);
            } else {
                //Если двигались влево, то упираемся в левую стену, используя старое значение player.cacheLeftCol
                player.setLeft(Utils.getLeftBorder(player.cacheLeftCol));
            }
            player.setBottom(tmpNewBottom);
            return;
        }
    }

    //Если не помогла ни корректировка по X, ни корректировка по Y по отдельности, нужно применить одновременную корректировку и по X и по Y
    //Комментарии к этим корректировкам см. выше
    if (player.velocityX > 0) {
        player.setLeft(Utils.getRightBorder(player.cacheRightCol) - PLAYER_WIDTH);
    } else {
        player.setLeft(Utils.getLeftBorder(player.cacheLeftCol));
    }
    player.setBottom(Utils.getBottomBorder(player.velocityY > 0 ? player.cacheBottomRow : tmpNewBottomRow));

}

function updatePlayerBlockedDirections(player) {
    //Человек находится на земле, если по вертикали он находится ровно в сетке бриков
    //и ниже находится брик (нужно проверить по левой правой половине игрока и по правой половине игрока)!
    player.cacheBlockedBottom = player.cacheJustOnBrick
    && hasPlayerCollisionVertical(player.cacheBottomRow + 1, player.cacheLeftCol, player.cacheRightCol);

    //Над человеком находится брик пиксель-в-пиксель, если по вертикали он находится ровно в сетке бриков
    //и выше находится брик (нужно проверить по левой правой половине игрока и по правой половине игрока)!
    player.cacheBlockedTop = player.cacheJustOnBrick
    && hasPlayerCollisionVertical(player.cacheTopRow - 1, player.cacheLeftCol, player.cacheRightCol);

    //Игрок упёрся в стену слева, если левая координата игрока целочисленно делится на ширину бриков и колонкой слева где-то есть стена (коллизия)
    player.cacheBlockedLeft = player.left % BRICK_WIDTH === 0
    && hasPlayerCollisionHorizontal(player.cacheBottomRow, player.cacheTopRow, player.cacheLeftCol - 1);

    //Игрок упёрся в стену справа, если он НЕ упёрся в левую сторону
    //и левая координата + ширина игрока целочисленно делится на ширину бриков
    // и колонкой справа где-то есть стена (коллизия)
    player.cacheBlockedRight = !player.cacheBlockedLeft
    && (player.left + PLAYER_WIDTH) % BRICK_WIDTH === 0
    && hasPlayerCollisionHorizontal(player.cacheBottomRow, player.cacheTopRow, player.cacheRightCol + 1);
}

function updatePlayerVelocityYAndCrouch(player, oldBottomRow) {
    //Если мы стоим на земле - значит можно приседать и прыгать! Проверим...
    if (player.cacheBlockedBottom) {
        //Если нажата кнопка вверх - попытка прыгнуть!
        if (player.keyUp) {
            if (!player.cacheBlockedTop) {
                //Можно прыгать, т.к. над головой ничего не мешает!
                player.velocityY = -3;
                Sound.jump();
            }
        } else {

            //Если мы на земле и не нажата кнопка вверх - принудительно обнуляем вертикальную скорость
            //это даст классный эффект зацепления за брик.
            //Но это редкий случай, когда мы оказались на брике пиксель-в-пиксель в полёте вверх
            player.velocityY = 0;

            if (player.keyDown) {
                //Если нажата кнопка вниз - приседаем
                player.setCrouch(true);
            } else {
                //Если кнопка вниз отпущена - проверим, можем ли мы встать? Если брик над головой, то статус приседания
                //должен сохраниться. Если же брика над головой нет - то игрок долежн автоматичеси встать
                player.setCrouch(player.crouch && player.cacheBlockedTop);
            }
        }

    } else {
        //Мы не на земле, мы в воздухе!
        //нужно принудительно отменить приседание
        player.setCrouch(false);

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
            if (player.cacheBlockedTop) {
                //Если над головой вплотную брик - обнуляем вертикальную скорость, чтобы через фрейм начать падать
                player.velocityY = 0;
            } else if (player.velocityY > -1) {
                //тормозим сильнее при приближении к вершине полёта
                player.velocityY /= 1.11; // progressive inertia
            }
        }
    }
}

var tmpAbsVelocityXMax = 0;
var tmpVelocityXSign = 0;
function updatePlayerVelocityX(player) {

    if (player.keyLeft === player.keyRight) {

        //Если обе кнопки false (отжаты) или обе кнопки true (обе нажаты) - считаем, что игрок никуда _активно_ не идёт
        if (player.velocityX !== 0) {
            //Если скорость ещё не упала окончательно до нуля - продолжаем тормозить


            if (Math.abs(player.velocityX) < 0.2) {
                //Если в процессе естественного торможения горизоантальная скорость упала меньше чем до 0.2 - окончательно
                //останавливаем движение
                player.velocityX = 0;
            } else {
                //Скорость ещё не окончательно упала, продолжаем торможение
                //Томожение по земле с коэффициентом 1.14, по воздуху 1.025
                player.velocityX /= (player.cacheBlockedBottom ? 1.14 : 1.025);
            }
        }

    } else {

        //Похоже одна из кнопок всё-таки нажата (либо вправо, либо влево)
        tmpAbsVelocityXMax = PLAYER_MAX_VELOCITY_X;
        if (player.crouch) {
            //Если игрок присел - максимальная скросто меньше, чем если он стоит
            tmpAbsVelocityXMax--;
        }

        //Чтобы унифицировать дальнейшие формулы, введём переменную со знаком + или - и будем умножать на неё
        tmpVelocityXSign = player.keyLeft ? -1 : 1;

        if (player.velocityX * tmpVelocityXSign < 0) {
            //Человек по инерции всё ещё имеет скорость по X в противоположном направлении, чем нажата кнопка
            //(т.е. человек хочет сделать разворот). В этом случае ускоряем разворот на 0.8!
            player.velocityX += tmpVelocityXSign * 0.8;
        }

        if (Math.abs(player.velocityX) < tmpAbsVelocityXMax) {
            //Мы ещё не достигли максимальной скорости, продолжаем увеличивать скорость
            player.velocityX += tmpVelocityXSign * 0.35;
        } else {
            //Мы превзошли максимальную скорость - ограничим себя
            player.velocityX = tmpVelocityXSign * tmpAbsVelocityXMax;
        }
    }

    //После всех расчётов обнулим скорость, если мы упёрлись в какую-то стену, но продолжаем туда идти
    if (player.velocityX < 0 && player.cacheBlockedLeft
        || player.velocityX > 0 && player.cacheBlockedRight) {
        player.velocityX = 0;
    }
}

function updatePlayerVelocity(player, oldBottomRow) {
    updatePlayerVelocityYAndCrouch(player, oldBottomRow);
    updatePlayerVelocityX(player);
}

var tmpOldBottomRow = 0;
function runPhysicsOneFrame(player) {

    //Стратегия расчёта физики следующая:
    //Используя текущие значения скорости (расчитанные в предыдущем кадре) сделаем перемещение игрока
    //Проверим столкновения со стенами, сделаем корректировку позиции игрока, если он провалился внутрь какой-нибудь стены
    //Перед обновлением позиции игрока запомним старые значения колонки
    tmpOldBottomRow = player.cacheBottomRow;
    updatePlayerPosition(player);

    //После корректировки позиции игрока, обновим кеширующие поля, показывающие упёрся ли игрок в какую-то стену или пол или потолок
    //Благодаря этим кеширующим полям мы сможем обнулить скорости в следующем методе
    updatePlayerBlockedDirections(player);

    //Расчитаем новые значения скоростей на основе нажатых кнопок и констант с ускорениями (гравитация, трение и проч)
    //(новые скорости будут применены только в следующем фрейме)
    updatePlayerVelocity(player, tmpOldBottomRow);
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
    tmpDeltaPhysicFrames = Math.floor(tmpDeltaTime / 16);
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