import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Bullet from "./Bullet.js";


// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class Weapon extends GameObject {
	constructor(g, player) {
		super(g, 0, 0);
		this.g = g;
		this.player = player;

		this.offsetX = -1;
		this.offsetY = -6;

		// properties
		this.bullet = ''; // bullet class name
		this.ammo = 0; // current
		this.maxAmmo = 0; // max
	}

	spawn() {
		super.spawn();

		this.sprite.anchor.set(0.35, 0.5); // center of player
		//this.sprite.scale.x = this.sprite.scale.y =  -1;
	}

	addAmmo(amount) {
		this.ammo += amount;
		if (this.ammo > this.maxAmmo) {
			this.ammo = this.maxAmmo;
		}
	}
	
	handleCollisions(player, callback) {
		return false;
	}

	// plasma, rocket, bfg
	fire(x, y, inertialX, inertialY) {
		if (!this.newBullet)
			return;
		var bullet = this.newBullet(x, y, inertialX, inertialY);
		//console.log("fire ", x, y, inertialX, inertialY);
		bullet.spawn();
	}

	// other weaapons which already have destination (cx, cy)
	fireVector(x, y, cx, cy, inertialX, inertialY) {
		if (!this.newBullet)
			return;
		var bullet = this.newBullet(x, y, cx, cy, inertialX, inertialY);
		//console.log("vector fire ", x, y, cx, cy, inertialX, inertialY);
		bullet.spawn();
	}
}

