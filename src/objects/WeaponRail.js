import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponRail extends Weapon  {
	constructor(g, player) {
		super(g, player);

		this.itemId = Constants.C_WPN_RAIL;
		this.ammo = 10; // init ammo
		this.maxAmmo = 50; // max ammo

		// sprite
		this.texture = g.resources.weapons.textures['weapons-' + (this.itemId - 2) + '.png'];
		this.container = player.graphics.container;
		//this.bullet = new RailBullet();
	}

	newBullet(x, y, cx, cy, inertialX, inertialY) {
		return new BulletRail(this.g, this.player, x, y, inertialX, inertialY);
	}

	fireVector(x, y, cx, cy, inertialX, inertialY) {
		super.fireVector(x, y, cx, cy, inertialX, inertialY);
		Sound.play('fire_rail');
	}
}

class BulletRail extends Bullet  {
	constructor(g, player, srcX, srcY, destX, destY) {
		super(g, player, destX, destY);

		this.srcX = srcX;
		this.srcY = srcY;
		this.width = this.height = 16;

		this.texture = g.resources.railhit.texture;
		var that = this;

		this.fadeOut(0.01, function(){
			that.destroy();
		});
	}

	spawn() {
		super.spawn();

		// draw rail trace
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(2, 0xffffff);
		graphics.moveTo(this.srcX, this.srcY);
		graphics.lineTo(this.x, this.y);
		graphics.endFill();
		this.fireObject = new GameObject(this.g, 0, 0);
		this.fireObject.sprite = graphics;
		//this.fireObject.container = this.sprite;
		this.fireObject.spawn();

		var that = this;
		this.fireObject.fadeOut(0.08, function(){
			that.fireObject.destroy();
		});
	}
}