import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";
import Utils from "./Utils.js";
import Slider from "./Slider.js";

export default
class Render {
	constructor(g) {
		this.g = g;
		this.map = g.map;
		
		var that = this;

		this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { antialias: false, resolution: 1, transparent: true});
		this.app.view.style.display = "block";
		var gameEl = document.getElementById('game');
		gameEl.appendChild(this.app.view);
		
		this.stage = this.app.stage;

		this.mapGraphics = new PIXI.Graphics();
		this.mapGraphics.beginFill(0x999999);
		this.mapGraphics.lineStyle(1, 0xAAAAAA);
		this.stage.addChild(this.mapGraphics);

		this.floatCamera = false;
		this.halfWidth = 0;
		this.halfHeight = 0;
		this.mapDx = 0;
		this.mapDy = 0;
		
		this.bricksPerLine = 8; // 

		this.paletteCustomTexture = null;
		this.bricksPerLineCustom = 0;

		this.slider = new Slider(this, function(val){ 
			// slider change event
			that.g.demo.setFrameId(val); 
		}, function(frameId){ 
			//console.log(frameId);
			// update time in tooltip on mousemove
			var text = "00:00";
			if (frameId > 0)
			if (that.g.demo.data && that.g.demo.data.DemoUnits && that.g.demo.data.DemoUnits[frameId]) {
				var time = that.g.demo.data.DemoUnits[frameId].DData.gametime;
				text = Utils.formatGameTime(time);
			}
			return text;
		});
		this.app.stage.addChild(this.slider);

		window.addEventListener('resize', function() { 
			that.recalcFloatCamera(that);
		}, false);



		gameEl.onmousemove = function (e) {
			if (that.slider.onmousemove(e))
				return;
		};
		gameEl.onmouseup = function (e) {
			if (that.slider.onmouseup(e))
				return;
		};
		gameEl.onmousedown = function (e) {
			if (that.slider.onmousedown(e))
				return;

			// follow next player
			var followId = -1;
			for (var i = 0; i < that.g.players.length; i++) {
				if (that.g.players[i].follow) {
					that.g.players[i].follow = false;
					followId = i + 1;
					if (followId > that.g.players.length - 1)
						followId = 0;
				}
			}
			if (followId == -1)
				return;
			that.g.players[followId].follow = true;
			console.log('Follow player ' + that.g.players[followId].displayName);
		};

	}
	
	
	async updatePaletteTexture(image) {
		//var texture = PIXI.Texture.from('images/palette.jpg');
		//let sprite = new PIXI.Sprite.from('assets/image.png');
		this.paletteCustomTexture = PIXI.BaseTexture.from(image);
		// FIXME: get size of image directly, otherwise this.paletteCustomTexture
		var size = await Utils.getImageDimensions(image);

		this.bricksPerLineCustom = Math.floor(size.w / Constants.BRICK_WIDTH);
		console.log("palette loaded = " + this.paletteCustomTexture.hasLoaded);
		console.log("change palette. Brickes per line " + this.paletteCustomTexture.width + " " + this.bricksPerLineCustom);
	}


	renderMap() {
		document.body.style.background = "url('images/bg_" + this.map.bg + ".jpg')";
		var that = this;
		this.g.map.destroyBrickObjects();

		var tmpRows = this.map.getRows();
		var tmpCols = this.map.getCols();
		var tmpRow, tmpCol;
		for (tmpRow = 0; tmpRow < tmpRows; tmpRow++) {
			for (tmpCol = 0; tmpCol < tmpCols; tmpCol++) {
				if (!this.map.isBrick(tmpCol, tmpRow))
					continue;

				var brickIdx = this.map.getBrick(tmpCol, tmpRow);

				var pal = this.g.resources.palette.texture;
				var bpr = this.bricksPerLine;
				// custom palette from map
				if (this.map.paletteCustomImage != null && brickIdx > 53 && brickIdx <= 181) {
					pal = this.paletteCustomTexture;
					bpr = this.bricksPerLineCustom;
					brickIdx -= this.map.paletteCustomIndex;
				} else {
					brickIdx -= this.map.paletteIndex;
				}

				// cut texture rectangle for brick from the palette
				var brickTexture = new PIXI.Texture(
					pal, 
					new PIXI.Rectangle(
						brickIdx % bpr * Constants.BRICK_WIDTH, 
						Math.floor(brickIdx / bpr) * Constants.BRICK_HEIGHT, 
						Constants.BRICK_WIDTH, 
						Constants.BRICK_HEIGHT));

				// create brick sprite
				var brickSprite = new PIXI.Sprite(brickTexture);
				brickSprite.position.x = tmpCol * Constants.BRICK_WIDTH;
				brickSprite.position.y = tmpRow * Constants.BRICK_HEIGHT;
			
				//console.log(brickIdx + " / " 
				//	+ brickIdx % bpr * Constants.BRICK_WIDTH + " " 
				//	+ Math.floor(brickIdx / bpr) * Constants.BRICK_HEIGHT); // debug
			
				this.map.brickObjects.push({
					idx: brickIdx,
					row: tmpRow,
					col: tmpCol,
					rect: function () {
						return that.map.brickRect(this.row, this.col);
					},
					sprite: brickSprite,
					mech: this.g.config.brickMech 
						? this.g.render.createMech(0, 0, Constants.BRICK_WIDTH, Constants.BRICK_HEIGHT)
						: null
				});

				this.mapGraphics.addChild(brickSprite);
			}
		}

		this.map.spawnObjects();
		
		this.recalcFloatCamera(this);
		this.app.render(this.stage);

		// update slider
		this.slider.setMaxValue(this.g.demo.data.DemoUnits.length);
	}
	
	// when browser size changed this event fixes the map view
	recalcFloatCamera(render) {
		console.log("resize event");
		
		render.app.view.width = window.innerWidth - 20;
		render.app.view.height = window.innerHeight;

		render.floatCamera = render.map.getRows() > (window.innerHeight) / 16 || (render.map.getCols() > (window.innerWidth - 20) / 32);
		if (render.floatCamera) {
			render.halfWidth = Math.floor((window.innerWidth - 20) / 2);
			render.halfHeight = Math.floor((window.innerHeight) / 2);

		} else {
			render.mapGraphics.x = render.mapDx = Math.floor(((window.innerWidth - 20) - render.map.getCols() * 32) / 2);
			render.mapGraphics.y = render.mapDy = Math.floor(((window.innerHeight) - render.map.getRows() * 16) / 2);
		}
		
		// update slider
		this.slider.resize(render);
	}


	renderGame(player) {
				
		// position of a player on the map
		var tmpX = player.x + this.mapDx;
		var tmpY = player.y + this.mapDy;
		
		if (this.floatCamera) {
			if (player.follow)
			{
				// update map position depending on the following player 
				this.mapDx = this.mapGraphics.x = this.halfWidth - player.x;
				this.mapDy = this.mapGraphics.y = this.halfHeight - player.y; 
			}
		}
		
		player.graphics.adjustPosition(tmpX, tmpY);

		this.app.render(this.stage);
	}

	renderLabels() {
		// update slider
		var frameId = this.g.demo.getFrameId();
		this.slider.setValue(frameId);
		// TODO: here we can update slider current label (time)
		if (this.g.demo.data.DemoUnits && this.g.demo.data.DemoUnits[frameId]) {
			var gametime = this.g.demo.data.DemoUnits[frameId].DData.gametime;
			// FIXME: gametime can differ for 1 second in g.gamestate, just check all variants
			if (gametime == this.g.gamestate.gametime ||
				 gametime-1 == this.g.gamestate.gametime || 
				 gametime+1 == this.g.gamestate.gametime)
				this.slider.setLoaded(true); // set loaded flag
		}

		this.g.labels.adjustPosition();
	}
	
	renderMech() {
		// mech of players
		for (var i = 0; i < this.g.players.length; i++) {
			this.g.players[i].graphics.mech.x = this.g.players[i].rect().x1;
			this.g.players[i].graphics.mech.y = this.g.players[i].rect().y1;
			this.g.players[i].graphics.mech.width = this.g.players[i].rect().x2 - this.g.players[i].rect().x1;
			this.g.players[i].graphics.mech.height = this.g.players[i].rect().y2 - this.g.players[i].rect().y1;
			this.g.players[i].graphics.mech.visible = true;
		}
		// mech of objects
		for (var i = 0; i < this.g.objects.length; i++) {
			this.g.objects[i].mech.x = this.g.objects[i].rect().x1;
			this.g.objects[i].mech.y = this.g.objects[i].rect().y1;
			this.g.objects[i].mech.width = this.g.objects[i].rect().x2 - this.g.objects[i].rect().x1;
			this.g.objects[i].mech.height = this.g.objects[i].rect().y2 - this.g.objects[i].rect().y1;
			this.g.objects[i].mech.visible = true;
		}

		// mech of bricks
		if (this.g.config.brickMech)
		{
			for (var i = 0; i < this.g.map.brickObjects.length; i++) {
				var rect = this.g.map.brickObjects[i].rect();
				this.g.map.brickObjects[i].mech.x = rect.x1;
				this.g.map.brickObjects[i].mech.y = rect.y1;
				this.g.map.brickObjects[i].mech.width = rect.x2 - rect.x1;
				this.g.map.brickObjects[i].mech.height = rect.y2 - rect.y1;
				this.g.map.brickObjects[i].mech.visible = true;
			}
		}
	}
	
	
	
	// create and add mech object (for debug)
	createMech(x, y, w, h) {
		var mech = new PIXI.Graphics();
		//mech.beginFill(0xFF00FF, 1);
		mech.lineStyle(1, 0xFF00FF, 1, 0.5, true); 
		mech.drawRect(x, y, w, h);
		mech.drawRect(x, y, 0, h); // FIXME: draw left line
		this.stage.addChild(mech);
		return mech;
	}
	removeMech(mech) {
		this.stage.removeChild(mech);
	}
}



