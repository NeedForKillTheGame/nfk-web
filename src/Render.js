import PIXI from "PIXI";
import Constants from "./Constants.js";
import Map from "./Map.js";
import Utils from "./Utils.js";


export default
class Render {
	constructor(g) {
		this.g = g;
		this.map = g.map;
		var that = this;
		
		this.renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, { antialias: false, resolution: 1, transparent: true});
		this.renderer.view.style.display = "block";
		var gameEl = document.getElementById('game');
		gameEl.appendChild(this.renderer.view);
		

		/*
		var g_TICK = 20; // 1000/20 = 50 frames per second
		var g_Time = 0;
		// change fps
		ticker.add(function (delta) {
			// Limit to the frame rate
			var timeNow = (new Date()).getTime();
			var timeDiff = timeNow - g_Time;
			if (timeDiff < g_TICK)
				return;

			// We are now meeting the frame rate, so reset the last time the animation is done
			g_Time = timeNow;

			// Now do the animation

			// rotate the container!
			// use delta to create frame-independent tranform
			container.rotation -= 0.01 * delta;
			g_Bunny0.x += 1;
		});
		*/
		
		// follow next player
		gameEl.onclick = function (e) {
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

		
		this.stage = new PIXI.Stage(0x000000);
		this.mapGraphics = new PIXI.Graphics();
		this.mapGraphics.beginFill(0x999999);
		this.mapGraphics.lineStyle(1, 0xAAAAAA);
		this.stage.addChild(this.mapGraphics);

		this.floatCamera = false;
		this.halfWidth = 0;
		this.halfHeight = 0;
		this.mapDx = 0;
		this.mapDy = 0;
		
		this.paletteTexture = PIXI.BaseTexture.fromImage(this.map.paletteImage);
		this.bricksPerLine = 8; // 

		this.paletteCustomTexture = null;
		this.bricksPerLineCustom = 0;

		
		window.addEventListener('resize', function() { that.recalcFloatCamera(that) }, false);
	}
	
	
	async updatePaletteTexture(image) {
		//var texture = PIXI.Texture.from('images/palette.jpg');
		//let sprite = new PIXI.Sprite.from('assets/image.png');
		this.paletteCustomTexture = PIXI.BaseTexture.fromImage(image);
		// FIXME: get size of image directly, otherwise this.paletteCustomTexture
		var size = await Utils.getImageDimensions(image);

		this.bricksPerLineCustom = Math.floor(size.w / Constants.BRICK_WIDTH);
		console.log("palette loaded = " + this.paletteCustomTexture.hasLoaded);
		console.log("change palette. Brickes per line " + this.paletteCustomTexture.width + " " + this.bricksPerLineCustom);
	}


	renderMap() {
		document.body.style.background = "url('images/bg_" + this.map.bg + ".jpg')";

		var tmpRows = this.map.getRows();
		var tmpCols = this.map.getCols();
		var tmpRow, tmpCol;
		for (tmpRow = 0; tmpRow < tmpRows; tmpRow++) {
			for (tmpCol = 0; tmpCol < tmpCols; tmpCol++) {
				if (this.map.isBrick(tmpCol, tmpRow)) {
					var brickIdx = this.map.getBrick(tmpCol, tmpRow);
					
					var pal = this.paletteTexture;
					var bpr = this.bricksPerLine;
					// custom palette from map
					if (this.map.paletteCustomImage != null && brickIdx <= 181) {
						pal = this.paletteCustomTexture;
						bpr = this.bricksPerLineCustom;
						brickIdx -= this.map.paletteCustomIndex;
					} else {
						brickIdx -= this.map.paletteIndex;
					}

					var brickTexture = new PIXI.Texture(
						pal, 
						new PIXI.Rectangle(
							brickIdx % bpr * Constants.BRICK_WIDTH, 
							Math.floor(brickIdx / bpr) * Constants.BRICK_HEIGHT, 
							Constants.BRICK_WIDTH, 
							Constants.BRICK_HEIGHT));

					
					var brickSprite = new PIXI.Sprite(brickTexture);
					brickSprite.position.x = tmpCol * Constants.BRICK_WIDTH;
					brickSprite.position.y = tmpRow * Constants.BRICK_HEIGHT;
				
					//console.log(brickIdx + " / " 
					//	+ brickIdx % bpr * Constants.BRICK_WIDTH + " " 
					//	+ Math.floor(brickIdx / bpr) * Constants.BRICK_HEIGHT); // debug
				
					this.mapGraphics.drawRect(tmpCol * 32, tmpRow * 16, 31, 15); // (old) rectangle without a texture
					this.mapGraphics.addChild(brickSprite);
				}
			}
		}
		this.recalcFloatCamera(this);
		this.renderer.render(this.stage);
	}
	
	// when browser size changed this event fixes the map view
	recalcFloatCamera(render) {
		console.log("resize event");
		
		render.renderer.view.width = window.innerWidth - 20;
		render.renderer.view.height = window.innerHeight;

		render.floatCamera = render.map.getRows() > (window.innerHeight) / 16 || (render.map.getCols() > (window.innerWidth - 20) / 32);
		if (render.floatCamera) {
			render.halfWidth = Math.floor((window.innerWidth - 20) / 2);
			render.halfHeight = Math.floor((window.innerHeight) / 2);

		} else {
			render.mapGraphics.x = render.mapDx = Math.floor(((window.innerWidth - 20) - render.map.getCols() * 32) / 2);
			render.mapGraphics.y = render.mapDy = Math.floor(((window.innerHeight) - render.map.getRows() * 16) / 2);
		}
	}


	renderGame(player) {
				
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

		this.renderer.render(this.stage);
	}

}



