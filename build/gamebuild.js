/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Map = _interopRequire(__webpack_require__(2));

	var Constants = _interopRequire(__webpack_require__(3));

	var Keyboard = _interopRequire(__webpack_require__(4));

	var Player = _interopRequire(__webpack_require__(5));

	var _RenderJs = __webpack_require__(6);

	var renderMap = _RenderJs.renderMap;
	var renderGame = _RenderJs.renderGame;

	var updateGame = __webpack_require__(7).updateGame;

	var Stats = _interopRequire(__webpack_require__(1));

	var stats = new Stats();
	document.getElementById("fpsstats").appendChild(stats.domElement);

	Map.loadFromQuery();
	renderMap();

	var localPlayer = new Player();

	//just for safe respawn
	var respawn = Map.getRandomRespawn();
	localPlayer.left = respawn.col * Constants.BRICK_WIDTH;
	localPlayer.bottom = respawn.row * Constants.BRICK_HEIGHT + Constants.BRICK_HEIGHT - 1;

	function gameLoop() {
	    stats.begin();

	    localPlayer.keyUp = Keyboard.keyUp;
	    localPlayer.keyDown = Keyboard.keyDown;
	    localPlayer.keyLeft = Keyboard.keyLeft;
	    localPlayer.keyRight = Keyboard.keyRight;

	    updateGame(localPlayer);
	    renderGame(localPlayer);

	    requestAnimationFrame(gameLoop); //infinite render loop

	    stats.end();
	}

	requestAnimationFrame(gameLoop);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Stats;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var MapEditor = _interopRequire(__webpack_require__(9));

	var Constants = _interopRequire(__webpack_require__(3));

	var bricks = [];
	var respawns = [];

	function parseMapText(mapText) {
	    var lines = mapText.split("\n");
	    bricks = [];
	    var row, col, char;
	    for (row = 0; row < Constants.MAP_ROWS; row++) {
	        bricks[row] = [];
	        for (col = 0; col < Constants.MAP_COLS; col++) {
	            if (typeof lines[row] !== "undefined" || typeof lines[row][col] !== "undefined") {
	                char = lines[row][col];
	            } else {
	                char = " ";
	            }
	            bricks[row][col] = char === "0";

	            if (char === "R") {
	                respawns.push({ row: row, col: col });
	            }
	        }
	    }
	}

	module.exports = {
	    loadFromQuery: function loadFromQuery() {
	        var mapText;
	        //loock if any map name is in query string?
	        var queryString = window.location.href.slice(window.location.href.indexOf("?") + 1);
	        if (queryString.indexOf("maptext=") === 0) {
	            mapText = decodeURIComponent(queryString.substring(8)).replace(/\+/g, " ");
	            MapEditor.showMapEditor();
	        } else {
	            var mapfile;
	            if (queryString.indexOf("mapfile=") === 0) {
	                mapfile = queryString.substring(8) + ".txt";
	            } else {
	                mapfile = "dm2.txt";
	            }
	            var xmlhttp = new XMLHttpRequest();
	            xmlhttp.open("GET", "maps/" + mapfile, false);
	            xmlhttp.send(null);
	            mapText = xmlhttp.responseText;
	        }

	        MapEditor.setContent(mapText);
	        parseMapText(mapText);
	    },

	    isBrick: function isBrick(row, col) {
	        if (typeof bricks[row] == "undefined") {
	            return false;
	        }
	        return bricks[row][col];
	    },

	    getRandomRespawn: function getRandomRespawn() {
	        return respawns[Math.floor(Math.random() * respawns.length)];
	    }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {

	    BRICK_WIDTH: 32,
	    BRICK_HEIGHT: 16,

	    PLAYER_WIDTH: 20,

	    PLAYER_MAXSPEED: 3,

	    MAP_ROWS: 30,
	    MAP_COLS: 20,

	    GRAVITY: 0.02
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var keysState = {
	    keyUp: false,
	    keyDown: false,
	    keyLeft: false,
	    keyRight: false
	};

	document.addEventListener("keydown", function (e) {
	    switch (e.keyCode) {
	        case 38:
	            keysState.keyUp = true;
	            break;

	        case 37:
	            keysState.keyLeft = true;
	            break;

	        case 39:
	            keysState.keyRight = true;
	            break;

	        case 40:
	            keysState.keyDown = true;
	            break;
	    }
	});

	document.addEventListener("keyup", function (e) {
	    switch (e.keyCode) {
	        case 38:
	            keysState.keyUp = false;
	            break;

	        case 37:
	            keysState.keyLeft = false;
	            break;

	        case 39:
	            keysState.keyRight = false;
	            break;

	        case 40:
	            keysState.keyDown = false;
	            break;
	    }
	});

	module.exports = keysState;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var Player = function Player() {
	    _classCallCheck(this, Player);

	    this.left = 0;
	    this.bottom = 0;

	    this.velocityX = 0;
	    this.velocityY = 0;

	    //Current state of pressed keys
	    this.keyUp = false;
	    this.keyDown = false;
	    this.keyLeft = false;
	    this.keyRight = false;

	    this.crouch = false; //current crouch state

	    this.cacheBottomRow = 0;
	    this.cacheHeadRow = 0;
	    this.cacheLeftCol = 0;
	    this.cacheRightCol = 0;

	    //Кеширующий флаг - находится ли игрок по вертикали ровно на каком-то брике
	    //Проверить это просто: координата игрока по вертикали+1 целочисленно делится на высоту бриков
	    //((player.bottom + 1) % BRICK_HEIGHT) === 0
	    this.cacheJustOnBrick = false;
	};

	module.exports = Player;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	exports.renderMap = renderMap;
	exports.renderGame = renderGame;

	var PIXI = _interopRequire(__webpack_require__(8));

	var Constants = _interopRequire(__webpack_require__(3));

	var Map = _interopRequire(__webpack_require__(2));

	var BRICK_HEIGHT = Constants.BRICK_HEIGHT;
	var BRICK_WIDTH = Constants.BRICK_WIDTH;

	var renderer = PIXI.autoDetectRenderer(640, 480);
	//renderer.view.style.display = "block";
	var gameEl = document.getElementById("game");
	gameEl.appendChild(renderer.view);

	var localPlayerGraphics = new PIXI.Graphics();
	localPlayerGraphics.beginFill(11184895);
	//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
	localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, BRICK_HEIGHT * 3);
	localPlayerGraphics.endFill();

	var stage = new PIXI.Stage(0);
	stage.addChild(localPlayerGraphics);

	var mapGraphics = new PIXI.Graphics();
	mapGraphics.beginFill(10066329);
	mapGraphics.lineStyle(1, 12303291);
	stage.addChild(mapGraphics);

	function renderMap() {
	    for (var row = 0; row < Constants.MAP_ROWS; row++) {
	        for (var col = 0; col < Constants.MAP_COLS; col++) {
	            if (Map.isBrick(row, col)) {
	                mapGraphics.drawRect(col * BRICK_WIDTH, row * BRICK_HEIGHT, BRICK_WIDTH, BRICK_HEIGHT);
	            }
	        }
	    }

	    renderer.render(stage);
	}

	function renderGame(player) {
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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	exports.updateGame = updateGame;

	var Constants = _interopRequire(__webpack_require__(3));

	var Sound = _interopRequire(__webpack_require__(10));

	var Map = _interopRequire(__webpack_require__(2));

	//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
	var BRICK_WIDTH = Constants.BRICK_WIDTH;
	var BRICK_HEIGHT = Constants.BRICK_HEIGHT;
	var PLAYER_WIDTH = Constants.PLAYER_WIDTH;
	var PLAYER_MAXSPEED = Constants.PLAYER_MAXSPEED;
	var GRAVITY = Constants.GRAVITY;

	//Вынесем указатель на функцию в отедельную переменную, чтобы не писать везде Map.isBrick(...)
	var isBrick = Map.isBrick;

	function getCol(x) {
	    return Math.floor(x / BRICK_WIDTH);
	}

	function getRow(y) {
	    return Math.floor(y / BRICK_HEIGHT);
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
	    var row1 = getRow(newBottom),
	        //первая (самя нижняя) строка определяется просто по нижней координате
	    row2 = row1 - 1,
	        //строка выше - тут тоже просто
	    row3,
	        row4;
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
	    return isBrick(row1, leftCol) || isBrick(row2, leftCol) || row2 !== row3 && isBrick(row3, leftCol) || row3 !== row4 && isBrick(row4, leftCol) || leftCol !== rightCol && (isBrick(row1, rightCol) || isBrick(row2, rightCol) || row2 !== row3 && isBrick(row3, rightCol) || row3 !== row4 && isBrick(row4, rightCol));
	}

	function updatePlayerCacheValues(player) {
	    player.cacheJustOnBrick = (player.bottom + 1) % BRICK_HEIGHT === 0;
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
	    return player.cacheJustOnBrick && (isBrick(player.cacheHeadRow - 1, player.cacheLeftCol) || player.cacheLeftCol !== player.cacheRightCol && isBrick(player.cacheHeadRow - 1, player.cacheRightCol));
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
	        player.velocityY = player.velocityY + GRAVITY * 2.8; // --> 10

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
	    var onGround = player.cacheJustOnBrick && (isBrick(player.cacheBottomRow + 1, player.cacheLeftCol) || player.cacheLeftCol !== player.cacheRightCol && isBrick(player.cacheBottomRow + 1, player.cacheRightCol));
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

	function updateGame(player) {

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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = PIXI;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var mapEditorForm = document.getElementById("mapeditor");
	var showMapEditorLink = document.getElementById("mapeditor-link");
	showMapEditorLink.addEventListener("click", function (e) {
	    e.preventDefault();showMapEditor();
	});

	module.exports = {
	    show: function show() {
	        mapEditorForm.style.display = "block";
	        showMapEditorLink.style.display = "none";
	    },

	    setContent: function setContent(maptext) {
	        document.getElementById("maptext").innerHTML = maptext;
	    }
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Howl = _interopRequire(__webpack_require__(11));

	var jump = new Howl({
	    urls: ["sounds/jump1.wav"]
	});

	module.exports = {
	    jump: (function (_jump) {
	        var _jumpWrapper = function jump() {
	            return _jump.apply(this, arguments);
	        };

	        _jumpWrapper.toString = function () {
	            return _jump.toString();
	        };

	        return _jumpWrapper;
	    })(function () {
	        jump.play();
	    })
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Howl;

/***/ }
/******/ ])