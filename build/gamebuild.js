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
	localPlayer.setLeft(respawn.col * Constants.BRICK_WIDTH);
	localPlayer.setBottom(respawn.row * Constants.BRICK_HEIGHT + Constants.BRICK_HEIGHT - 1);

	function gameLoop(timestamp) {
	    stats.begin();

	    localPlayer.keyUp = Keyboard.keyUp;
	    localPlayer.keyDown = Keyboard.keyDown;
	    localPlayer.keyLeft = Keyboard.keyLeft;
	    localPlayer.keyRight = Keyboard.keyRight;

	    updateGame(localPlayer, timestamp);
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
	            MapEditor.show();
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
	        return bricks[row][col];
	    },

	    getMapBricks: function getMapBricks() {
	        return bricks;
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

	    PLAYER_MAX_VELOCITY_X: 3,

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
	    if (e.keyCode < 37 || e.keyCode > 40) {
	        return;
	    }

	    if (e.target.nodeName.toLowerCase() !== "textarea") {
	        e.preventDefault();
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
	    }
	});

	document.addEventListener("keyup", function (e) {
	    if (e.keyCode < 37 || e.keyCode > 40) {
	        return;
	    }

	    if (e.target.nodeName.toLowerCase() !== "textarea") {
	        e.preventDefault();
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
	    }
	});

	module.exports = keysState;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _prototypeProperties = function (child, staticProps, instanceProps) { if (staticProps) Object.defineProperties(child, staticProps); if (instanceProps) Object.defineProperties(child.prototype, instanceProps); };

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var Utils = _interopRequire(__webpack_require__(10));

	var Constants = _interopRequire(__webpack_require__(3));

	var PLAYER_WIDTH = Constants.PLAYER_WIDTH;

	var Player = (function () {
	    function Player() {
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

	        this.doubleJumpCountdown = 0;

	        this.cacheBottomRow = 0;
	        this.cacheTopRow = 0;
	        this.cacheLeftCol = 0;
	        this.cacheRightCol = 0;

	        //Кеширующий флаг - находится ли игрок по вертикали ровно на каком-то брике
	        //Проверить это просто: координата игрока по вертикали+1 целочисленно делится на высоту бриков
	        //((player.bottom + 1) % BRICK_HEIGHT) === 0
	        this.cacheJustOnBrick = false;

	        this.cacheBlockedBottom = false;
	        this.cacheBlockedTop = false;
	        this.cacheBlockedLeft = false;
	        this.cacheBlockedRight = false;
	    }

	    _prototypeProperties(Player, null, {
	        setLeft: {
	            value: function setLeft(newLeft) {
	                if (newLeft !== this.left) {
	                    this.left = newLeft;
	                    this.cacheLeftCol = Utils.getLeftBorderCol(newLeft);
	                    this.cacheRightCol = Utils.getRightBorderCol(newLeft + PLAYER_WIDTH);
	                }
	            },
	            writable: true,
	            configurable: true
	        },
	        setBottom: {
	            value: function setBottom(newBottom) {
	                if (newBottom !== this.bottom) {
	                    this.bottom = newBottom;
	                    this.cacheJustOnBrick = Utils.getPlayerJustOnBrick(newBottom);
	                    this.cacheBottomRow = Utils.getBottomBorderRow(newBottom);
	                    this.cacheTopRow = Utils.getPlayerTopRow(newBottom, this.crouch);
	                }
	            },
	            writable: true,
	            configurable: true
	        },
	        setCrouch: {
	            value: function setCrouch(newCrouch) {
	                if (newCrouch !== this.crouch) {
	                    this.crouch = newCrouch;
	                    this.cacheTopRow = Utils.getPlayerTopRow(this.bottom, newCrouch);
	                }
	            },
	            writable: true,
	            configurable: true
	        }
	    });

	    return Player;
	})();

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

	var stage = new PIXI.Stage(0);
	var mapGraphics = new PIXI.Graphics();
	mapGraphics.beginFill(10066329);
	mapGraphics.lineStyle(1, 12303291);
	stage.addChild(mapGraphics);

	var localPlayerGraphics = new PIXI.Graphics();
	localPlayerGraphics.beginFill(11184895);
	//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
	localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, BRICK_HEIGHT * 3);
	localPlayerGraphics.endFill();
	stage.addChild(localPlayerGraphics);

	var dot1 = new PIXI.Graphics();
	stage.addChild(dot1);

	var dot2 = new PIXI.Graphics();
	stage.addChild(dot2);

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

	var Sound = _interopRequire(__webpack_require__(11));

	var Map = _interopRequire(__webpack_require__(2));

	var Utils = _interopRequire(__webpack_require__(10));

	//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
	var BRICK_WIDTH = Constants.BRICK_WIDTH;
	var BRICK_HEIGHT = Constants.BRICK_HEIGHT;
	var PLAYER_WIDTH = Constants.PLAYER_WIDTH;
	var PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;
	var GRAVITY = Constants.GRAVITY;

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

	var tmpNewBottomRow = 0;
	var tmpNewTopRow = 0;
	var tmpNewLeftCol = 0;
	var tmpNewRightCol = 0;

	var tmpNewBottom = 0;
	var tmpNewLeft = 0;

	var tmpToBeCheсkedRow = -100; //сильно отрицательное значение - ничего проверять не надо
	var tmpToBeCheckedCol = -100;

	var tmpPlayerHasCollizionVertical = false;
	var tmpPlayerHasCollizionHorizontal = false;

	var tmpNewBottomBorderRowMinus4 = 0;
	var tmpColForRowMinus4 = 0;

	var tmpOnEdge = false;

	function updatePlayerPosition(player) {
	    tmpOnEdge = false;
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

	    //Частный случай: если игрок хочет войт внутрь брика по горизонтали, посмотрим, а что если его приподнять на пару пикселей вверх?
	    if (player.velocityY !== 0) {
	        if (player.velocityX !== 0 || player.keyLeft != player.keyRight) {
	            if (player.velocityX === 0) {
	                tmpNewBottomBorderRowMinus4 = Utils.getBottomBorderRow(tmpNewBottom - (player.keyUp ? 8 : 4));
	            } else {
	                tmpNewBottomBorderRowMinus4 = Utils.getBottomBorderRow(tmpNewBottom - 8);
	            }

	            if (tmpNewBottomBorderRowMinus4 != tmpNewBottomRow) {
	                if (player.velocityX === 0) {
	                    tmpColForRowMinus4 = player.keyLeft ? Utils.getLeftBorderCol(player.left - 1) : Utils.getRightBorderCol(player.left + PLAYER_WIDTH + 1);
	                } else {
	                    tmpColForRowMinus4 = player.velocityX < 0 ? tmpNewLeftCol : tmpNewRightCol;
	                }

	                if (isBrick(tmpNewBottomRow, tmpColForRowMinus4) && !isBrick(tmpNewBottomBorderRowMinus4, tmpColForRowMinus4)) {
	                    //Если приподняться вверх на 1 или 4 пикселя, то обнаруживаем, что коллизии нет!
	                    //Проверим, можем ли мы пройти в этот тоннель по высоте?
	                    if (!isBrick(tmpNewBottomBorderRowMinus4 - 1, tmpColForRowMinus4) && (player.crouch || !isBrick(tmpNewBottomBorderRowMinus4 - 2, tmpColForRowMinus4))) {
	                        //По высоте проходим!
	                        //Так сделаем это - приподнимимся
	                        if (player.velocityX === 0) {
	                            player.setLeft(player.left + (player.keyLeft ? -1 : 1));
	                        } else {
	                            player.setLeft(tmpNewLeft);
	                        }
	                        player.setBottom(Utils.getBottomBorder(tmpNewBottomBorderRowMinus4));
	                        log("зацепление за уголок");
	                        tmpOnEdge = true;
	                        return;
	                    }
	                }
	            }
	        }
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
	    /*
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
	    */
	    //Если же падали вниз и пытались зати в какую-то стену влево или вправо - надо попытаться туда зайти, чуть чуть приподняв игрока!
	    //это чтобы не проваливаться в дырки наверну dm2
	    /*
	    if (player.velocityY > 0
	        && (player.velocityX !== 0 || player.keyLeft != player.keyRight)) {
	        var checkCol;
	        if (player.velocityX === 0) {
	            checkCol = player.keyLeft ? Utils.getLeftBorderCol(player.left - 1) : Utils.getRightBorderCol(player.left + 1 + PLAYER_WIDTH);
	        } else {
	            checkCol = player.velocityX < 0 ? tmpNewLeftCol : tmpNewRightCol;
	        }
	        tmpNewBottomBorderRowMinus4 = Utils.getBottomBorderRow(tmpNewBottom - 4);
	        if (tmpNewBottomBorderRowMinus4 != tmpNewBottomRow
	            && (
	                (player.velocityX < 0 || player.keyLeft)
	            && hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewTopRow, tmpNewLeftCol)
	            && !hasPlayerCollisionHorizontal(tmpNewBottomBorderRowMinus4, tmpNewBottomBorderRowMinus4 - (player.crouch ? 1 : 2), tmpNewLeftCol)
	            ||
	                (player.velocityX > 0 || player.keyRight)
	            && hasPlayerCollisionHorizontal(tmpNewBottomRow, tmpNewTopRow, tmpNewRightCol)
	            && !hasPlayerCollisionHorizontal(tmpNewBottomBorderRowMinus4, tmpNewBottomBorderRowMinus4 - (player.crouch ? 1 : 2), tmpNewRightCol)
	            )
	        ) {
	            if (player.velocityX === 0) {
	                player.setLeft(player.left + (player.keyLeft ? -1 : 1));
	            } else {
	                player.setLeft(tmpNewLeft);
	            }
	            player.setBottom(Utils.getBottomBorder(tmpNewBottomBorderRowMinus4));
	            return;
	         }
	    }
	    */

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
	    player.cacheBlockedBottom = player.cacheJustOnBrick && hasPlayerCollisionVertical(player.cacheBottomRow + 1, player.cacheLeftCol, player.cacheRightCol);

	    //Над человеком находится брик пиксель-в-пиксель, если по вертикали он находится ровно в сетке бриков
	    //и выше находится брик (нужно проверить по левой правой половине игрока и по правой половине игрока)!
	    player.cacheBlockedTop = player.cacheJustOnBrick && hasPlayerCollisionVertical(player.cacheTopRow - 1, player.cacheLeftCol, player.cacheRightCol);

	    //Игрок упёрся в стену слева, если левая координата игрока целочисленно делится на ширину бриков и колонкой слева где-то есть стена (коллизия)
	    player.cacheBlockedLeft = player.left % BRICK_WIDTH === 0 && hasPlayerCollisionHorizontal(player.cacheBottomRow, player.cacheTopRow, player.cacheLeftCol - 1);

	    //Игрок упёрся в стену справа, если он НЕ упёрся в левую сторону
	    //и левая координата + ширина игрока целочисленно делится на ширину бриков
	    // и колонкой справа где-то есть стена (коллизия)
	    player.cacheBlockedRight = !player.cacheBlockedLeft && (player.left + PLAYER_WIDTH) % BRICK_WIDTH === 0 && hasPlayerCollisionHorizontal(player.cacheBottomRow, player.cacheTopRow, player.cacheRightCol + 1);
	}

	var tmpEdgeBrickTestCol = 0;
	function isEdgeBrickJumpPossible(player) {
	    /*
	     if (player.velocityX === 0) {
	     return false;
	     }
	     */
	    if (player.velocityX < 0 /*&& player.keyRight */ || false && player.velocityX === 0 && player.keyLeft) {
	        tmpEdgeBrickTestCol = Utils.getLeftBorderCol(player.left - 3);
	    } else if (player.velocityX > 0 /* && player.keyLeft*/ || false && player.velocityX === 0 && player.keyRight) {
	        tmpEdgeBrickTestCol = Utils.getRightBorderCol(player.left + PLAYER_WIDTH + 3);
	    } else {
	        return false;
	    }

	    return isBrick(Utils.getBottomBorderRow(player.bottom), tmpEdgeBrickTestCol) && !isBrick(Utils.getBottomBorderRow(player.bottom - 3), tmpEdgeBrickTestCol);
	}

	function makeJump(player, fromEdge) {
	    if (false) {
	        return false;
	    }
	    if (player.doubleJumpCountdown > 0) {
	        player.velocityY = -3;
	        player.doubleJumpCountdown = 0;
	        log("double jump " + player.left + "x" + player.bottom + " " + (fromEdge ? " from edge" : ""));
	    } else {
	        player.velocityY = -2.9;
	        player.doubleJumpCountdown = 8;
	        log("jump " + player.left + "x" + player.bottom + " " + (fromEdge ? " from edge" : ""));
	    }
	    Sound.jump();
	}

	function updatePlayerVelocityYAndCrouch(player) {
	    if (player.doubleJumpCountdown > 0) {
	        player.doubleJumpCountdown--;
	    }

	    /*
	        if (isEdgeBrickJumpPossible(player) && player.keyUp && !player.cacheBlockedTop) {
	            makeJump(player, true);
	            return;
	        }
	    */

	    //Если мы стоим на земле - значит можно приседать и прыгать! Проверим...
	    if (player.cacheBlockedBottom) {
	        //Если нажата кнопка вверх - попытка прыгнуть!
	        if (player.keyUp) {
	            if (!player.cacheBlockedTop) {
	                //Можно прыгать, т.к. над головой ничего не мешает!
	                makeJump(player);
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
	                player.velocityX /= player.cacheBlockedBottom ? 1.14 : 1.025;
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
	    if (player.velocityX < 0 && player.cacheBlockedLeft || player.velocityX > 0 && player.cacheBlockedRight) {
	        player.velocityX = 0;
	    }
	}

	function updatePlayerVelocity(player) {
	    updatePlayerVelocityYAndCrouch(player);
	    updatePlayerVelocityX(player);
	}

	function runPhysicsOneFrame(player) {

	    //Стратегия расчёта физики следующая:
	    //Используя текущие значения скорости (расчитанные в предыдущем кадре) сделаем перемещение игрока
	    //Проверим столкновения со стенами, сделаем корректировку позиции игрока, если он провалился внутрь какой-нибудь стены
	    //Перед обновлением позиции игрока запомним старые значения колонки
	    updatePlayerPosition(player);

	    //После корректировки позиции игрока, обновим кеширующие поля, показывающие упёрся ли игрок в какую-то стену или пол или потолок
	    //Благодаря этим кеширующим полям мы сможем обнулить скорости в следующем методе
	    updatePlayerBlockedDirections(player);

	    //Расчитаем новые значения скоростей на основе нажатых кнопок и констант с ускорениями (гравитация, трение и проч)
	    //(новые скорости будут применены только в следующем фрейме)
	    updatePlayerVelocity(player);
	}

	var time = 0;
	var tmpDeltaTime = 0;
	var tmpDeltaPhysicFrames = 0;

	function updateGame(player, timestamp) {

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

	var logLine = 0;
	var textarea = document.getElementById("log");
	function log(text) {
	    logLine++;
	    textarea.innerHTML = logLine + " " + text + "\n" + textarea.innerHTML.substring(0, 1000);
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
	    e.preventDefault();MapEditor.show();
	});

	var MapEditor = {
	    show: function show() {
	        mapEditorForm.style.display = "block";
	        showMapEditorLink.style.display = "none";
	    },

	    setContent: function setContent(maptext) {
	        document.getElementById("maptext").innerHTML = maptext;
	    }
	};

	module.exports = MapEditor;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Constants = _interopRequire(__webpack_require__(3));

	//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
	var BRICK_WIDTH = Constants.BRICK_WIDTH;
	var BRICK_HEIGHT = Constants.BRICK_HEIGHT;

	module.exports = {

	    /**
	     * Возвращает номер колонки бриков (считая от 0) внутри которой находится координата X левого края игрока
	     * @param {number} x координата левого края игрока
	     * @returns {number} номер колонки бриков (считая от 0)
	     */
	    getLeftBorderCol: function getLeftBorderCol(x) {
	        return Math.floor(x / BRICK_WIDTH);
	    },

	    /**
	     * Возвращает номер колонки бриков (считая от 0) внутри которой находится координата X правого края игрока
	     * @param {number} x правого края игрока
	     * @returns {number} номер колонки бриков (считая от 0)
	     */
	    getRightBorderCol: function getRightBorderCol(x) {
	        return Math.ceil(x / BRICK_WIDTH) - 1;
	    },

	    /**
	     * Возвращает номер строки бриков (считая от 0) внутри которой находится координата Y верхнего края игрока
	     * @param {number} y верхнего края игрока
	     * @returns {number} номер строки бриков (считая от 0)
	     */
	    getTopBorderRow: function getTopBorderRow(y) {
	        return Math.floor(y / BRICK_HEIGHT);
	    },

	    /**
	     * Возвращает номер строки бриков (считая от 0) внутри которой находится координата Y верхнего края игрока
	     * @param {number} y верхнего края игрока
	     * @returns {number} номер строки бриков (считая от 0)
	     */
	    getBottomBorderRow: function getBottomBorderRow(y) {
	        return Math.ceil(y / BRICK_HEIGHT) - 1;
	    },

	    /**
	     * Возвращает нижнюю границу (координату Y) указанной строки бриков
	     * @param {number} row строка бриков считая от 0
	     * @returns {number}
	     */
	    getBottomBorder: function getBottomBorder(row) {
	        return row * BRICK_HEIGHT + BRICK_HEIGHT;
	    },

	    /**
	     * Возвращает левую границу (координата X) указанной колонки бриков
	     * @param {number} col колонка бриков считая от 0
	     * @returns {number}
	     */
	    getLeftBorder: function getLeftBorder(col) {
	        return col * BRICK_WIDTH;
	    },

	    /**
	     * Возвращает левую границу (координата X) указанной колонки бриков
	     * @param {number} col колонка бриков считая от 0
	     * @returns {number}
	     */
	    getRightBorder: function getRightBorder(col) {
	        return col * BRICK_WIDTH + BRICK_WIDTH;
	    },

	    /**
	     * Метод возвращает true, если по вертикали игрок расположился ровно по стеке бриков
	     * @param {number} bottom координата по Y нижнего края игрока
	     * @returns {boolean}
	     */
	    getPlayerJustOnBrick: function getPlayerJustOnBrick(bottom) {
	        return bottom % BRICK_HEIGHT === 0;
	    },

	    /**
	     * Возвращает номеро строки в бриках (считая от 0), внутри которой находится верхний край игрока (голова)
	     * @param {number} bottom координата нижней границы игрока по Y
	     * @param {boolean} crouch приседает или игрок? (от этого зависит его высота, следовательно зависит и top row)
	     * @returns {number}
	     */
	    getPlayerTopRow: function getPlayerTopRow(bottom, crouch) {
	        return this.getTopBorderRow(bottom - (crouch ? 2 : 3) * BRICK_HEIGHT);
	    }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var Howl = _interopRequire(__webpack_require__(12));

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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Howl;

/***/ }
/******/ ])