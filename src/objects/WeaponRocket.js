import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponRocket extends Weapon  {
	constructor(g, player) {
		super(g, player);

		this.itemId = Constants.C_WPN_ROCKET;
		this.ammo = 10; // init ammo
		this.maxAmmo = 50; // max ammo

		// sprite
		this.texture = g.resources.weapons.textures['weapons-' + (this.itemId - 2) + '.png'];
		this.container = player.graphics.container;
	}

	newBullet(x, y, inertialX, inertialY) {
		return new BulletRocket(this.g, this.player, x, y, inertialX, inertialY);
	}

	fire(x, y, inertialX, inertialY) {
		super.fire(x, y, inertialX, inertialY);
		Sound.play('fire_rocket');
	}
}

class BulletRocket extends Bullet  {
	// player = player who attacks
	constructor(g, player, x, y, inertialX, inertialY) {
		super(g, player, x, y);
		this.g = g;
		this.bullet = true;		

		this.inertialX = inertialX;
		this.inertialY = inertialY;
		this.width = 13;
		this.height = 7;

		this.rotation = player.weapon.sprite.rotation;
		if (player.dir == Constants.DIR_LS || player.dir == Constants.DIR_LW) {
			this.dir = Constants.DIR_LS;
		}
		this.speed = 6;

		this.texture = g.resources.bullets.textures['tile005.png'];
		this.explosion = g.resources.explosion.spritesheet.animations.explosion;
	}

	spawn() {
		super.spawn();

		// add glow 
		this.glow = new GameObject(this.g, 0, 0);
		this.glow.anchor = 0.5;
		this.glow.offsetX = -8;
		this.glow.texture = this.g.resources.glow.texture;
		this.glow.container = this.sprite;
		this.glow.spawn();
	}
}