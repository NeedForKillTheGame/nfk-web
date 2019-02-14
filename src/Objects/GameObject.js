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
		this.animateOneTime = false; // for animated sprite animate only once without repeat (ex. open/close door)
		this.frameStart = 0; // first frame
		this.frameEnd = 0; // last frame, set 0 will reach end of frames automatically

		this.texture = null; // PIXI.Texture
		this.sprite = null; // PIXI.Sprite
		
		this.overlaps = []; // DXID of players who intersect the object now
		this.container = this.g.render.mapGraphics; // container to add sprite
		this.timerIds = [];
	}
		
	spawn() {
		console.log("spawn " + this.constructor.name + " at " + this.x + "/" + this.y);

		if (this.animated)
		{
			this.sprite = new PIXI.AnimatedSprite(this.texture);
			this.sprite.animationSpeed = 0.2; 
			this.sprite.play();
			
			if (this.frameEnd == 0) {
				this.frameEnd = this.sprite.totalFrames - 1;
			}

			// ignore first frame when animate
			var that = this;
			this.sprite.onFrameChange = (f) => {
				// if animate one time and reach end of frames
				if (that.animateOneTime && f == that.frameEnd + 1) {
					that.sprite.gotoAndStop(that.frameStart); // stop
				} 
				// do not change frame if playing was stopped
				if (!that.sprite.playing) {
					return;
				}
				// if first frame = 0 or reach the end, then move to the first (which must be > 0)
				if (f == 0 && that.frameStart > 0 || f == that.frameEnd + 1) {
					that.sprite.gotoAndPlay(that.frameStart); // loop
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
		this.container.addChild(this.sprite);
		
		// mech object (debug)
		this.mech = this.g.render.createMech(0, 0, this.width, this.height);
		this.mech.visible = false;
	}	
	

	show() {
		this.sprite.visible = true;
	}

	hide() {
		this.sprite.visible = false;
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
			//console.log("iteract with object");
			return callback(player);
		} else {
			// if player does not more intersect the object then remove it from overlaps
			if (idx != -1) {
				this.overlaps.splice(idx, 1);
			}
		}
	}

	destroy() {
		for (var id in this.timerIds) {
			this.g.timerManager.removeTimer(id);
		}
		
		this.sprite.destroy();
		this.container.removeChild(this.sprite);
		this.mech.destroy();
		if (this.g.config.mech) {
			this.g.render.removeMech(this.mech);
		}
	}
}