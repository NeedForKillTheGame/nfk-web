import Utils from "./../Utils.js";
import Constants from "./../Constants.js";


export default
class GameObject {
	constructor(g, x, y) {
		this.g = g;

		this.x = x;
		this.y = y;
		this.offsetX = 0; // sprite offset by x on the map
		this.offsetY = 0; // sprite offset by y on the map
		this.width = Constants.BRICK_WIDTH; // sprite width
		this.height = Constants.BRICK_HEIGHT; // sprite height
		this.animated = false; // sprite position inside image
		this.frameStart = 0; // first frame
		this.frameEnd = 0; // last frame
		
		this.spawnDelay = 0; // spawn object with a delay (seconds)
		
		this.texture = null; // PIXI.Texture
		this.sprite = null; // PIXI.Sprite
		this.timers = []; // array of setInterval or setTimeout
		
		this.overlaps = []; // DXID of players who intersect the object now
	}
		
	spawn() {
		console.log("spawn " + this.constructor.name + " at " + this.x + "/" + this.y);

		if (this.animated)
		{
			this.sprite = new PIXI.AnimatedSprite(this.texture);
			this.sprite.animationSpeed = 0.3; 
			this.sprite.play();
			
			// ignore first frame when animate
			var that = this;
			this.sprite.onFrameChange = (f) => {
				if (f == that.frameEnd) {
					that.sprite.gotoAndPlay(that.frameStart);
				}
			};
		}
		else
		{
			/*
			var texture = new PIXI.Texture(
				this.texture, 
				new PIXI.Rectangle(
					this.spritePos * this.width, 
					0,
					this.width, 
					this.height));
			*/
			this.sprite = new PIXI.Sprite(this.texture);
		}
		
		
		
		this.sprite.x = this.x + this.offsetX;
		this.sprite.y = this.y + this.offsetY;
		
		// add object on the map graphics
		this.g.render.mapGraphics.addChild(this.sprite);
		
		// mech object (debug)
		this.mech = this.g.render.createMech(0, 0, this.width, this.height);
		
		// spawn with a delay
		if (this.spawnDelay) {
			console.log("set invisible ");
			this.sprite.visible = false;
			var that = this;
			this.timers.push(setTimeout(function(){
				that.sprite.visible = true;
			}, this.spawnDelay * 1000));
		}
	}	
	
	visible() {
		return !this.sprite || this.sprite.visible;
	}
	
	// rectangle
	rect() {
		return {
			x1: this.x + this.g.render.mapDx,
			y1: this.y + this.g.render.mapDy,
			x2: this.x + this.width + this.g.render.mapDx,
			y2: this.y + this.height + this.g.render.mapDy			
		};
	}
	
	handleCollisions(player, callback) {
		// do not check collision for dead players
		if (player.dead)
			return false;
		
		// if object is invisible then it does not exist
		if ( !this.visible() )
			return false;

		
		var idx = this.overlaps.indexOf(player.DXID);

		var overlap = Utils.rectOverlap(this.rect(), player.rect());
		// if player eat object then call the callback function
		if ( overlap ) {
			// if player already entered the object then do not fire overlap event twice
			if (idx != -1) {
				return false;
			}
			this.overlaps.push(player.DXID);
			console.log("iteract with object");
			return callback(player);
		} else {
			// if player does not more intersect the object then remove it from overlaps
			if (idx != -1) {
				this.overlaps.splice(idx, 1);
			}
		}
	}

	destroy() {
		for (var i = 0; i < this.timers.length; i++) {
			clearInterval(this.timers[i]);
		}
		
		this.sprite.destroy();
		this.g.render.mapGraphics.removeChild(this.sprite);
		this.mech.destroy();
		if (this.g.config.mech) {
			console.log("remove mech");
			this.g.render.removeMech(this.mech);
		}
	}
}