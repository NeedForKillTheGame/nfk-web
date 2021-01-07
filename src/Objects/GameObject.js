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
		this.animationSpeed = 0.2;
		this.animateOneTime = false; // for animated sprite animate only once without repeat (ex. open/close door). This can be a callback
		this.frameStopped = 0; // stopped frame
		this.frameStart = 0; // first frame
		this.frameEnd = 0; // last frame, set 0 will reach end of frames automatically
		this.rotation = 0;

		this.texture = null; // PIXI.Texture
		this.sprite = null; // PIXI.Sprite
		this.anchor = false;
		this.texture_repeat = false;

		this.bullet = false;

		this.overlaps = []; // DXID of players who intersect the object now
		this.container = this.g.render.mapGraphics; // container to add sprite
		this.timerIds = [];
	}
		
	spawn() {
		//console.log("spawn " + this.constructor.name + " at " + this.x + "/" + this.y);

		if (this.animated)
		{
			this.sprite = new PIXI.AnimatedSprite(this.texture);
			this.sprite.animationSpeed = this.animationSpeed; 
			this.sprite.play();
			
			if (this.frameEnd == 0) {
				this.frameEnd = this.sprite.totalFrames - 1;
			}

			// ignore first frame when animate
			var that = this;
			this.sprite.onFrameChange = (f) => {
				// if animate one time and reach end of frames
				if (that.animateOneTime && f == that.frameEnd ) {
					that.sprite.gotoAndStop(that.frameStopped); // stop
					that.animateOneTime(); // callback
				} 
				// do not change frame if playing was stopped
				if (!that.sprite.playing) {
					return;
				}
				// if first frame = 0 or reach the end, then move to the first (which must be > 0)
				if (f == 0 && that.frameStart > 0 || f == that.frameEnd) {
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
			if (this.texture_repeat)
				this.sprite = new PIXI.TilingSprite(this.texture, this.width, this.height);
			else
				this.sprite = new PIXI.Sprite(this.texture);
		}
		this.sprite.rotation = this.rotation;
		if (this.anchor) {
			this.sprite.anchor.set(this.anchor);
		}


		this.setX(this.x);
		this.setY(this.y);
		
		// add object in container (by default map graphics)
		this.container.addChild(this.sprite);
		
		// mech object (debug)
		this.mech = this.g.render.createMech(0, 0, this.width, this.height);
		this.mech.visible = false;
	}	
	
	play() {
		if (this.sprite.play) {
			this.sprite.play();
		}
	}
	stop() {
		if (this.sprite.gotoAndStop) {
			this.sprite.gotoAndStop(this.frameStopped); // stop
		}
	}

	show() {
		this.sprite.visible = true;
	}

	hide() {
		this.sprite.visible = false;
	}

	is_visible() {
		return !this.sprite || this.sprite.visible;
	}

	/* does not work if object is invisible */
	is_overlap() {
		return this._is_overlap;
	}

	setX(x) {
		this.x = x;
		this.sprite.x = this.x + this.offsetX;
	}
	setY(y) {
		this.y = y;
		this.sprite.y = this.y + this.offsetY;
	}

	// speed = animations speed, 0.01 is slowest
	// callback = execute after full invisible
	fadeOut(speed, callback) {
		if (!speed)
			speed = 0.1;
		var that = this;
		var timerId =  this.g.timerManager.addTickTimer(1, 0, function(id, tick) {
			that.sprite.alpha -= speed; 
			if (that.sprite.alpha <= 0) {
				that.hide();
				if (callback)
					callback();
				that.g.timerManager.stopTimer(id);
			}
		});
		this.timerIds.push(timerId);
	}

	fadeIn(speed, callback) {
		if (!speed)
			speed = 0.1;
		this.show();
		this.sprite.alpha = 0;
		var that = this;
		var timerId =  this.g.timerManager.addTickTimer(1, 0, function(id, tick){
			that.sprite.alpha += speed; 
			if (that.sprite.alpha >= 1) {
				if (callback)
					callback();
				that.g.timerManager.stopTimer(id);
			}
		});
		this.timerIds.push(timerId);
	}
	
	// rectangle
	rect() {
		return {
			x1: this.x - (this.width * this.sprite.anchor.x) + this.g.render.mapDx,
			y1: this.y - (this.height * this.sprite.anchor.y) + this.g.render.mapDy,
			x2: this.x - (this.width * this.sprite.anchor.x) + this.width + this.g.render.mapDx,
			y2: this.y - (this.height * this.sprite.anchor.y) + this.height + this.g.render.mapDy			
		};
	}
	
	handleCollisions(player, callback) {
		// do not check collision for dead players
		if (player.dead)
			return false;
		
		// if object is invisible then it does not exist
		if ( !this.is_visible() )
			return false;

		
		var idx = this.overlaps.indexOf(player.DXID);

		var overlap = Utils.rectOverlap(this.rect(), player.rect());
		// if player eat object then call the callback function
		if ( overlap ) {
			this._is_overlap = true;
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
			this._is_overlap = false;
		}
	}

	handleBrickCollisions(brick, callback) {
		// handle collision with bricks only with type of bullets
		if (!this.bullet) {
			return false;
		}

		// if object is invisible then it does not exist
		if ( !this.is_visible() )
			return false;

		var brickUid = brick.col + '_' + brick.row + '_' + brick.idx;
		var idx = this.overlaps.indexOf(brickUid);

		var overlap = Utils.rectOverlap(this.rect(), brick.rect());
		// if brick eat object then call the callback function
		if ( overlap ) {
			// if brick already entered the object then do not fire overlap event twice
			if (idx != -1) {
				return false;
			}
			this.overlaps.push(brickUid);
			//console.log("iteract with object");
			return callback(brick);
		} else {
			// if brick does not more intersect the object then remove it from overlaps
			if (idx != -1) {
				this.overlaps.splice(idx, 1);
			}
		}
	}

	destroy() {
		for (var id in this.timerIds) {
			this.g.timerManager.removeTimer(id);
		}
		
		//this.sprite.destroy(); // FIXME: destroy cause an error sometimes for bullets. Actually we can not destroy it, JS vm will destroy it automatically cause of no references
		this.container.removeChild(this.sprite);
		//this.mech.destroy();
		if (this.g.config.mech) {
			this.g.render.removeMech(this.mech);
		}
	}
}