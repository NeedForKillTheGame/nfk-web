import GameObject from "./GameObject.js";
import Constants from "./../Constants.js";
import Utils from "./../Utils.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class Bullet extends GameObject {
	constructor(g, player, x, y) {
		super(g, x, y);

		this.player = player;
		this.DXID = Utils.random(1, 9999999); // FIXME: generate unique number witjhout collisoons

		this.inertialX = 0;
		this.inertialY = 0;
		this.speed = 0;
		this.dir = Constants.DIR_RS; // directiol left or right, if left then sprite will be flipped by horisontal Constants.DIR_LS || Constants.DIR_RS
	
		this.anchor = 0.5;
		this.explosion = null; // animation
	}

	spawn() {
		super.spawn();
		this.g.objects.push(this);

		this.sprite.scale.x *= this.dir == Constants.DIR_LS ? -1 : 1;
		
		// if bullet has no inertion then do not add timer
		// inertion have only rocket, plasma, bfg
		if (!this.bullet) {
			return;
		}


		var that = this;
		var timerId =  this.g.timerManager.addTickTimer(1, 0, function(id, tick){
			// move by angle
			var x = that.x + that.speed * Math.cos(that.rotation);
			var y = that.y + that.speed * Math.sin(that.rotation);
			if (that.dir == Constants.DIR_LS) {
				x = that.x - that.speed * Math.cos(that.rotation);
			}
			that.setX(x);
			that.setY(y);
		});
		this.timerIds.push(timerId);
	}
	
	handleCollisions(player) {
		// do not handle explosion for vector
		if (!this.bullet) {
			return false;
		}
		var that = this;
		return super.handleCollisions(player, function(player){
			if (that.player.DXID != player.DXID) {
				that.explode();
				that.destroy();
				return true;
			}
			return false;
		});
	}
	handleBrickCollisions(brick) {
		if (!this.bullet) {
			return false;
		}
		var that = this;
		return super.handleCollisions(brick, function(brick){
			// TODO display explosion
			that.explode();
			that.destroy();
			return true;
		});
	}

	explode() {
		if (this.explosion) {
			this.expl = new GameObject(this.g, this.x, this.y);
			this.expl.texture = this.explosion;
			this.expl.animated = true;
			this.expl.animationSpeed = 0.3;
			this.expl.anchor = 0.5;
			var that = this;
			// destroy  after animation completed
			this.expl.animateOneTime = function() {
				that.expl.destroy();
			};
			this.expl.spawn();
		}
	}

	destroy() {
		super.destroy();

		// remove from objects
		for (var i = 0; i < this.g.objects.length; i++) {
			if (this.g.objects[i].DXID == this.DXID) {
				this.g.objects.splice(i, 1);
				break;
			}
		}
	}

}