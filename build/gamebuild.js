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
	document.getElementById("fps").appendChild(stats.domElement);

	Map.loadFromQuery();
	renderMap();

	var localPlayer = new Player();

	//just for safe respawn
	var respawn = Map.getRandomRespawn();
	localPlayer.setXY(respawn.col * Constants.BRICK_WIDTH + 10, respawn.row * Constants.BRICK_HEIGHT - 24);

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

	var MapEditor = _interopRequire(__webpack_require__(11));

	var Constants = _interopRequire(__webpack_require__(3));

	var rows = 0;
	var cols = 0;
	var bricks = [];
	var respawns = [];

	function parseMapText(mapText) {
	    var lines = mapText.replace("\r", "").split("\n");
	    rows = lines.length;
	    //Determine max cols trough all rows
	    for (row = 0; row < rows; row++) {
	        if (lines[row] !== undefined && cols < lines[row].length) {
	            cols = lines[row].length;
	        }
	    }
	    bricks = [];
	    var row, col, char;
	    for (row = 0; row < rows; row++) {
	        bricks[row] = [];
	        for (col = 0; col < cols; col++) {
	            if (lines[row] !== undefined || lines[row][col] !== undefined) {
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

	    isBrick: function isBrick(col, row) {
	        return bricks[row][col];
	    },

	    getRows: function getRows() {
	        return rows;
	    },

	    getCols: function getCols() {
	        return cols;
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

	    PLAYER_MAX_VELOCITY_X: 3
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

	var Map = _interopRequire(__webpack_require__(2));

	var Utils = _interopRequire(__webpack_require__(10));

	var Constants = _interopRequire(__webpack_require__(3));

	var isBrick = Map.isBrick;
	var trunc = Utils.trunc;

	var Player = (function () {
	    function Player() {
	        _classCallCheck(this, Player);

	        this.x = 0;
	        this.y = 0;

	        this.velocityX = 0;
	        this.velocityY = 0;

	        //Current state of pressed keys
	        this.keyUp = false;
	        this.keyDown = false;
	        this.keyLeft = false;
	        this.keyRight = false;

	        this.crouch = false; //current crouch state

	        this.doublejumpCountdown = 0;

	        this.cacheOnGround = false;
	        this.cacheBrickOnHead = false;
	        this.cacheBrickCrouchOnHead = false;

	        this.speedJump = 0;
	    }

	    _prototypeProperties(Player, null, {
	        setX: {
	            value: function setX(newX) {
	                if (newX != this.x) {
	                    this.x = newX;
	                    this.updateCaches();
	                }
	            },
	            writable: true,
	            configurable: true
	        },
	        setY: {
	            value: function setY(newY) {
	                if (newY != this.y) {
	                    this.y = newY;
	                    this.updateCaches();
	                }
	            },
	            writable: true,
	            configurable: true
	        },
	        setXY: {
	            value: function setXY(newX, newY) {
	                if (newX !== this.x || newY !== this.y) {
	                    this.x = newX;
	                    this.y = newY;
	                    this.updateCaches();
	                }
	            },
	            writable: true,
	            configurable: true
	        },
	        updateCaches: {
	            value: function updateCaches() {
	                this.updateCacheOnGround();
	                this.updateCacheBrickOnHead();
	                this.updateCacheBrickCrouchOnHead();
	            },
	            writable: true,
	            configurable: true
	        },
	        updateCacheOnGround: {
	            value: function updateCacheOnGround() {
	                this.cacheOnGround = isBrick(trunc((this.x - 9) / 32), trunc((this.y + 25) / 16)) && !isBrick(trunc((this.x - 9) / 32), trunc((this.y + 23) / 16)) || isBrick(trunc(trunc(this.x + 9) / 32), trunc(trunc(this.y + 25) / 16)) && !isBrick(trunc(trunc(this.x + 9) / 32), trunc(trunc(this.y + 23) / 16)) || isBrick(trunc((this.x - 9) / 32), trunc((this.y + 24) / 16)) && !isBrick(trunc((this.x - 9) / 32), trunc((this.y + 8) / 16)) || isBrick(trunc((this.x + 9) / 32), trunc((this.y + 24) / 16)) && !isBrick(trunc((this.x + 9) / 32), trunc((this.y + 8) / 16));
	            },
	            writable: true,
	            configurable: true
	        },
	        updateCacheBrickCrouchOnHead: {
	            value: function updateCacheBrickCrouchOnHead() {
	                this.cacheBrickCrouchOnHead = isBrick(trunc((this.x - 8) / 32), trunc((this.y - 9) / 16)) && !isBrick(trunc((this.x - 8) / 32), trunc((this.y - 7) / 16)) || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 9) / 16)) && !isBrick(trunc((this.x + 8) / 32), trunc((this.y - 7) / 16)) || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 23) / 16)) || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 23) / 16)) || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 16) / 16)) || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 16) / 16));
	            },
	            writable: true,
	            configurable: true
	        },
	        updateCacheBrickOnHead: {
	            value: function updateCacheBrickOnHead() {
	                this.cacheBrickOnHead = isBrick(trunc((this.x - 9) / 32), trunc((this.y - 25) / 16)) && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 23) / 16)) || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 25) / 16)) && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 23) / 16)) || isBrick(trunc((this.x - 9) / 32), trunc((this.y - 24) / 16)) && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 8) / 16)) || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 24) / 16)) && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 8) / 16));
	            },
	            writable: true,
	            configurable: true
	        },
	        isOnGround: {
	            value: function isOnGround() {
	                return this.cacheOnGround;
	            },
	            writable: true,
	            configurable: true
	        },
	        isBrickOnHead: {
	            value: function isBrickOnHead() {
	                return this.cacheBrickOnHead;
	            },
	            writable: true,
	            configurable: true
	        },
	        isBrickCrouchOnHead: {
	            value: function isBrickCrouchOnHead() {
	                return this.cacheBrickCrouchOnHead;
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
	mapGraphics.lineStyle(1, 11184810);
	stage.addChild(mapGraphics);

	var localPlayerGraphics = new PIXI.Graphics();
	localPlayerGraphics.beginFill(11184895);
	//localPlayerGraphics.lineStyle(1, 0xFFFFFF);
	localPlayerGraphics.drawRect(0, 0, 20, BRICK_HEIGHT * 3);
	localPlayerGraphics.endFill();
	stage.addChild(localPlayerGraphics);

	var localPlayerCenter = new PIXI.Graphics();
	localPlayerCenter.beginFill(170);
	localPlayerCenter.drawRect(0, 0, 2, 2);
	localPlayerCenter.endFill();
	stage.addChild(localPlayerCenter);

	var dot1 = new PIXI.Graphics();
	stage.addChild(dot1);

	var dot2 = new PIXI.Graphics();
	stage.addChild(dot2);

	var floatCamera = false;

	function renderMap() {
	    var tmpRows = Map.getRows();
	    var tmpCols = Map.getCols();
	    var tmpRow, tmpCol;
	    floatCamera = tmpRows > 30 || tmpCols > 20;
	    for (tmpRow = 0; tmpRow < tmpRows; tmpRow++) {
	        for (tmpCol = 0; tmpCol < tmpCols; tmpCol++) {
	            if (Map.isBrick(tmpCol, tmpRow)) {
	                mapGraphics.drawRect(tmpCol * 32, tmpRow * 16, 31, 15);
	            }
	        }
	    }
	    renderer.render(stage);
	}

	var tmpX = 0;
	var tmpY = 0;

	function renderGame(player) {

	    if (floatCamera) {
	        tmpX = 320;
	        tmpY = 240;
	        mapGraphics.x = 320 - player.x;
	        mapGraphics.y = 240 - player.y;
	    } else {
	        tmpX = player.x;
	        tmpY = player.y;
	    }

	    localPlayerGraphics.x = tmpX - 10; //player.x - 10;
	    if (player.crouch) {
	        localPlayerGraphics.y = tmpY - 8; //player.y - 8;
	        localPlayerGraphics.height = 2 / 3;
	    } else {
	        localPlayerGraphics.y = tmpY - 24; //player.y - 24;
	        localPlayerGraphics.height = 1;
	    }

	    localPlayerCenter.x = tmpX - 1; //player.x-1;
	    localPlayerCenter.y = tmpY - 1;

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

	var Sound = _interopRequire(__webpack_require__(9));

	var Map = _interopRequire(__webpack_require__(2));

	var Utils = _interopRequire(__webpack_require__(10));

	//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
	var PLAYER_MAX_VELOCITY_X = Constants.PLAYER_MAX_VELOCITY_X;

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
	                player.velocityX /= 1.14; // ongroud stop speed.
	            } else {
	                player.velocityX /= 1.025; // inair stopspeed.
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
	        } else if (player.isBrickCrouchOnHead() && player.velocityY < 0) {
	            // fly up
	            player.velocityY = 0;
	            player.doublejumpCountdown = 3;
	            player.setY(trunc(Math.round(player.y) / 16) * 16 + 8);
	        }
	    }

	    // HORZ CHECK
	    if (player.velocityX != 0) {
	        tmpCol = trunc(Math.round(defx + (player.velocityX < 0 ? -11 : 11)) / 32);
	        tmpY = player.crouch ? player.y : defy;
	        if (isBrick(tmpCol, trunc(Math.round(tmpY - (player.crouch ? 8 : 16)) / 16)) || isBrick(tmpCol, trunc(Math.round(tmpY) / 16)) || isBrick(tmpCol, trunc(Math.round(tmpY + 16) / 16))) {
	            player.setX(trunc(defx / 32) * 32 + (player.velocityX < 0 ? 9 : 22));
	            player.velocityX = 0;
	            player.speedJump = 0;
	            if (defx != player.x) {
	                log("wall", player);
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

	    if (player.velocityX < -5) player.velocityX = -5;
	    if (player.velocityX > 5) player.velocityX = 5;
	    if (player.velocityY < -5) player.velocityY = -5;
	    if (player.velocityY > 5) player.velocityY = 5;
	}

	var tmpAbsMaxVelocityX = 0;
	var tmpSign = 0;
	var velocityYSpeedJump = [0, 0, 0.4, 0.8, 1, 1.2, 1.4];
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
	        player.velocityY = 0; // really nice thing :)
	    }

	    tmpCurJump = false;

	    if (player.speedJump > 0 && (player.keyUp !== tmpLastKeyUp || player.keyLeft && speedJumpDirection !== -1 || player.keyRight && speedJumpDirection !== 1)) {
	        player.speedJump = 0;
	        log("sj 0 - change keys", player);
	    }

	    tmpLastKeyUp = player.keyUp;

	    if (player.keyUp) {
	        // JUMP!
	        if (player.isOnGround() && !player.isBrickOnHead()) {

	            if (player.doublejumpCountdown > 4) {
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
	                    log("dj higher (bonus +" + round(tmpDjBonus) + ")", player);
	                } else {
	                    log("dj standart", player);
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

	                log("jump", player);

	                if (player.speedJump < 6 && !tmpLastWasJump && player.keyLeft !== player.keyRight) {
	                    speedJumpDirection = player.keyLeft ? -1 : 1;
	                    player.speedJump++;
	                    log("increase sj", player);
	                }
	            }

	            tmpCurJump = true;
	        }
	    } else {
	        if (player.isOnGround() && player.speedJump > 0) {
	            player.speedJump = 0;
	            log("sj 0 - on ground", player);
	        }
	    }

	    // CROUCH
	    if (!player.keyUp && player.keyDown) {
	        if (player.isOnGround()) {
	            player.crouch = true;
	        } else if (!player.isBrickCrouchOnHead()) {
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
	var textarea = document.getElementById("log");
	function log(text, player) {
	    logLine++;
	    if (player.velocityX !== 0) {
	        tmpSpeedX = (player.velocityX < 0 ? -1 : 1) * velocityXSpeedJump[player.speedJump];
	    } else {
	        tmpSpeedX = 0;
	    }
	    textarea.value = logLine + " " + text + " (x: " + round(player.x) + ", y: " + round(player.y) + ", dx: " + round(tmpSpeedX) + ", dy: " + round(player.velocityY) + ", sj: " + player.speedJump + ")" + "\n" + textarea.value.substring(0, 1000);
	}

	function round(val) {
	    return trunc(val) + "." + Math.abs(trunc(val * 10) - trunc(val) * 10);
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	module.exports = {
	    trunc: Math.trunc || function (val) {
	        return val < 0 ? Math.ceil(val) : Math.floor(val);
	    }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var mapEditorForm = document.getElementById("mapeditor");
	var showMapEditorLink = document.getElementById("mapeditor-link");
	var maptextarea = document.getElementById("maptext");
	var showurl = document.getElementById("shorturl");
	showMapEditorLink.addEventListener("click", function (e) {
	    e.preventDefault();MapEditor.show();
	});

	document.getElementById("short-link").addEventListener("click", function (e) {
	    e.preventDefault();
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.open("GET", "map.php?maptext=" + encodeURIComponent(maptextarea.value), false);
	    xmlhttp.send(null);
	    showurl.value = "http://nfk.pqr.su/game/map.php?mapid=" + xmlhttp.responseText;
	});

	var MapEditor = {
	    show: function show() {
	        mapEditorForm.style.display = "block";
	        showMapEditorLink.style.display = "none";
	    },

	    setContent: function setContent(maptext) {
	        maptextarea.value = maptext;
	    }
	};

	module.exports = MapEditor;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Howl;

/***/ }
/******/ ])