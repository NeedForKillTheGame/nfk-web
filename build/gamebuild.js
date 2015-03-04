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
/******/ 	__webpack_require__.p = "";
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

	var loadMapFromQuery = __webpack_require__(2).loadMapFromQuery;

	var Keyboard = _interopRequire(__webpack_require__(3));

	var Player = _interopRequire(__webpack_require__(4));

	var _RenderJs = __webpack_require__(5);

	var renderMap = _RenderJs.renderMap;
	var renderFrame = _RenderJs.renderFrame;

	var playermove = __webpack_require__(6).playermove;

	var Stats = _interopRequire(__webpack_require__(1));

	var localPlayer = new Player();

	//just for safe respawn
	localPlayer.x = 100;
	localPlayer.y = 100;

	var mapBricks = loadMapFromQuery();
	renderMap(mapBricks);

	var statsRender = new Stats();
	document.getElementById("fpsrender").appendChild(statsRender.domElement);

	var statsUpdate = new Stats();
	document.getElementById("fpsupdate").appendChild(statsUpdate.domElement);

	setInterval(function () {
	    statsUpdate.begin();
	    localPlayer.keyUp = Keyboard.keyUp;
	    localPlayer.keyDown = Keyboard.keyDown;
	    localPlayer.keyLeft = Keyboard.keyLeft;
	    localPlayer.keyRight = Keyboard.keyRight;
	    playermove(localPlayer, mapBricks);
	    statsUpdate.end();
	}, 1000 / 50); //50 fps for player update!

	function render() {
	    statsRender.begin();
	    renderFrame(localPlayer);
	    requestAnimationFrame(render); //infinite render loop
	    statsRender.end();
	}
	requestAnimationFrame(render);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Stats;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

	exports.loadMapFromQuery = loadMapFromQuery;

	var MapEditor = _interopRequireWildcard(__webpack_require__(9));

	var Constants = _interopRequire(__webpack_require__(10));

	function parseMapText(mapText) {
	    var lines = mapText.split("\n");
	    var mapBreaks = [],
	        row,
	        col;
	    for (row = 0; row < Constants.MAP_ROWS; row++) {
	        mapBreaks[row] = [];
	        for (col = 0; col < Constants.MAP_COLS; col++) {
	            mapBreaks[row][col] = !(typeof lines[row] === "undefined" || typeof lines[row][col] === "undefined" || lines[row][col] === " ");
	        }
	    }

	    return mapBreaks;
	}

	function loadMapFromQuery() {
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

	    MapEditor.setMapEditorContent(mapText);

	    return parseMapText(mapText);
	}

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 3 */
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

	var Player = function Player() {
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
	    this.dir = 3; //0 - look left and keyLeft pressed; 1 - look right and keyRight pressed, 2 - just look left, 3 - just look right

	    this.doublejumpCountdown = 0;
	};

	module.exports = Player;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	exports.renderMap = renderMap;
	exports.renderFrame = renderFrame;

	var PIXI = _interopRequire(__webpack_require__(7));

	var Constants = _interopRequire(__webpack_require__(10));

	var renderer = PIXI.autoDetectRenderer(640, 480);
	//renderer.view.style.display = "block";
	var gameEl = document.getElementById("game");
	gameEl.appendChild(renderer.view);

	var localPlayerGraphics = new PIXI.Graphics();
	localPlayerGraphics.beginFill(11184895);
	localPlayerGraphics.lineStyle(1, 16777215);
	localPlayerGraphics.drawRect(0, 0, Constants.PLAYER_WIDTH, Constants.BRICK_HEIGHT * 3);
	//localPlayerGraphics.endFill();

	var stage = new PIXI.Stage(0);
	stage.addChild(localPlayerGraphics);

	var mapGraphics = new PIXI.Graphics();
	mapGraphics.beginFill(10066329);
	mapGraphics.lineStyle(1, 12303291);
	stage.addChild(mapGraphics);

	function renderMap(mapBricks) {
	    for (var row = 0; row < Constants.MAP_ROWS; row++) {
	        for (var col = 0; col < Constants.MAP_COLS; col++) {
	            if (mapBricks[row][col]) {
	                mapGraphics.drawRect(col * Constants.BRICK_WIDTH, row * Constants.BRICK_HEIGHT, Constants.BRICK_WIDTH, Constants.BRICK_HEIGHT);
	            }
	        }
	    }

	    renderer.render(stage);
	}

	function renderFrame(player) {
	    localPlayerGraphics.x = Math.round(player.x - 10);

	    if (player.crouch) {
	        localPlayerGraphics.y = Math.round(player.y - 8);
	        localPlayerGraphics.height = 2 / 3;
	    } else {
	        localPlayerGraphics.y = Math.round(player.y - 24);
	        localPlayerGraphics.height = 1;
	    }

	    renderer.render(stage);
	}

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

	exports.playermove = playermove;

	var Howl = _interopRequire(__webpack_require__(8));

	var Constants = _interopRequire(__webpack_require__(10));

	var mapBricks;
	var keyUp = false;
	var keyDown = false;
	var keyLeft = false;
	var keyRight = false;

	var jumpSound = new Howl({
	    urls: ["sounds/jump1.wav"]
	});

	var BRICK_WIDTH = Constants.BRICK_WIDTH;
	var BRICK_HEIGHT = Constants.BRICK_HEIGHT;
	var PLAYER_MAXSPEED = Constants.PLAYER_MAXSPEED;
	var GRAVITY = Constants.GRAVITY;

	function isBrick(x, y) {
	    var row = Math.floor(y / BRICK_HEIGHT);
	    var col = Math.floor(x / BRICK_WIDTH);
	    if (typeof mapBricks[row] == "undefined") {
	        return false;
	    }
	    return mapBricks[row][col];
	}

	function isOnGround(playerX, playerY) {

	    return isBrick(playerX - 9, playerY + 25) && !isBrick(playerX - 9, playerY + 23) || isBrick(playerX + 9, playerY + 25) && !isBrick(playerX + 9, playerY + 23) || isBrick(playerX - 9, playerY + 24) && !isBrick(playerX - 9, playerY + 8) || isBrick(playerX + 9, playerY + 24) && !isBrick(playerX + 9, playerY + 8);
	}

	function isBrickCrouchOnHead(playerX, playerY) {
	    return isBrick(playerX - 8, playerY - 9) && !isBrick(playerX - 8, playerY - 7) || isBrick(playerX + 8, playerY - 9) && !isBrick(playerX + 8, playerY - 7) || isBrick(playerX - 8, playerY - 23) || isBrick(playerX + 8, playerY - 23) || isBrick(playerX - 8, playerY - 16) || isBrick(playerX + 8, playerY - 16);
	}

	function isBrickOnHead(playerX, playerY) {
	    return isBrick(playerX - 9, playerY - 25) && !isBrick(playerX - 9, playerY - 23) || isBrick(playerX + 9, playerY - 25) && !isBrick(playerX + 9, playerY - 23) || isBrick(playerX - 9, playerY - 24) && !isBrick(playerX - 9, playerY - 8) || isBrick(playerX + 9, playerY - 24) && !isBrick(playerX + 9, playerY - 8);
	}

	function playerphysic(player) {

	    // --!-!-!=!=!= ULTIMATE 3d[Power]'s PHYSIX M0DEL =!=!=!-!-!--

	    var defx = player.x;
	    var defy = player.y;
	    player.velocityY = player.velocityY + GRAVITY * 2.8; // --> 10

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
	                player.velocityX /= 1.14; // ongroud stop speed.
	            } else {
	                player.velocityX /= 1.025; // inair stopspeed.
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
	        } else if (isBrickCrouchOnHead(player.x, player.y) && player.velocityY < 0) {
	            // fly up
	            player.velocityY = 0;
	            player.doublejumpCountdown = 3;
	            player.y = Math.floor(Math.round(player.y) / 16) * 16 + 8;
	        } else if (isOnGround(player.x, player.y) && player.velocityY > 0) {
	            player.velocityY = 0;
	            player.y = Math.floor(Math.round(player.y) / 16) * 16 + 8;
	        }

	        // HORZ CHECK
	        if (player.velocityX < 0) {
	            // check clip wallz.
	            if (isBrick(defx - 10, player.y - 8) || isBrick(defx - 10, player.y) || isBrick(defx - 10, player.y + 16)) {
	                player.x = Math.floor(defx / 32) * 32 + 9;
	                player.velocityX = 0;
	            }
	        }
	        if (player.velocityX > 0) {
	            if (isBrick(defx + 10, player.y - 8) || isBrick(defx + 10, player.y) || isBrick(defx + 10, player.y + 16)) {
	                player.x = Math.floor(defx / 32) * 32 + 22;
	                player.velocityX = 0;
	            }
	        }
	    } else {
	        if (player.velocityX < 0) {
	            // check clip wallz.
	            if (isBrick(defx - 10, defy - 16) || isBrick(defx - 10, defy) || isBrick(defx - 10, defy + 16)) {
	                player.x = Math.floor(defx / 32) * 32 + 9;
	                player.velocityX = 0;
	            }
	        }
	        if (player.velocityX > 0) {
	            if (isBrick(defx + 10, defy - 16) || isBrick(defx + 10, defy) || isBrick(defx + 10, defy + 16)) {
	                player.x = Math.floor(defx / 32) * 32 + 22;
	                player.velocityX = 0;
	            }
	        }
	    }

	    if (isBrickOnHead(player.x, player.y) && isOnGround(player.x, player.y)) {
	        player.velocityY = 0;
	        player.y = Math.floor(player.y / 16) * 16 + 8;
	    } else if (isBrickOnHead(player.x, player.y) && player.velocityY < 0) {
	        // fly up
	        player.velocityY = 0;
	        player.doublejumpCountdown = 3;
	        //player.y = Math.round(player.y / 16) * 16 + 8;
	    } else if (isOnGround(player.x, player.y) && player.velocityY > 0) {
	        player.velocityY = 0;
	        player.y = Math.floor(player.y / 16) * 16 + 8;
	    }

	    if (player.velocityX < -5) player.velocityX = -5;
	    if (player.velocityX > 5) player.velocityX = 5;
	    if (player.velocityY < -5) player.velocityY = -5;
	    if (player.velocityY > 5) player.velocityY = 5;

	    if (player.y > 480) player.y = 100;
	}

	function playermove(player, _mapBricks) {

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
	        player.velocityY = 0; // really nice thing :)
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
	        } else if (!brickCrouchOnHead) {
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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = PIXI;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Howl;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	exports.showMapEditor = showMapEditor;
	exports.setMapEditorContent = setMapEditorContent;
	var mapEditorForm = document.getElementById("mapeditor");
	var showMapEditorLink = document.getElementById("mapeditor-link");
	showMapEditorLink.addEventListener("click", function (e) {
	    e.preventDefault();showMapEditor();
	});

	function showMapEditor() {
	    mapEditorForm.style.display = "block";
	    showMapEditorLink.style.display = "none";
	}

	function setMapEditorContent(maptext) {
	    document.getElementById("maptext").innerHTML = maptext;
	}

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

/***/ },
/* 10 */
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

/***/ }
/******/ ])