import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponShotgun extends Weapon  {
	constructor(g, player) {
		super(g, player);

		this.itemId = Constants.C_WPN_SHOTGUN;
		this.ammo = 10; // init ammo
		this.maxAmmo = 50; // max ammo

		// sprite
		this.texture = g.resources.weapons.textures['weapons-' + (this.itemId - 2) + '.png'];
		this.container = player.graphics.container;
		//this.bullet = new RailBullet();
	}

	newBullet(x, y, cx, cy, inertialX, inertialY) {
		return new BulletShotgun(this.g, this.player, x, y);
	}
	
	fireVector(x, y, cx, cy, inertialX, inertialY) {
		super.fireVector(x, y, cx, cy, inertialX, inertialY);
		Sound.play('fire_shotgun');
	}
}

// similar with machine
class BulletShotgun extends Bullet  {
	constructor(g, player, x, y) {
		super(g, player, x, y);

		this.width = this.height = 16;

		this.texture = g.resources.bullets.spritesheet.animations.tile;
		this.animated = true;
		this.animationSpeed = 0.05;
		this.frameStart = 0;
		this.frameEnd = 2;
		var that = this;
		// destroy after animation completed
		this.animateOneTime = function() {
			that.destroy();
		};
	}
}