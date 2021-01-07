import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponShaft extends Weapon  {
	constructor(g, player) {
		super(g, player);
		this.g = g;

		this.itemId = Constants.C_WPN_SHAFT;
		this.ammo = 10; // init ammo
		this.maxAmmo = 50; // max ammo

		// sprite
		this.texture = g.resources.weapons.textures['weapons-' + (this.itemId - 2) + '.png'];
		this.container = player.graphics.container;
	}

	spawn() {
		super.spawn();

		// draw attack trail
		var graphics = new PIXI.Graphics();
		graphics.lineStyle(3, 0xffffff);
		graphics.moveTo(20, 0);
		graphics.lineTo(150, 0);
		graphics.endFill();
		this.fireObject = new GameObject(this.g, 0, 0);
		this.fireObject.sprite = graphics;
		this.fireObject.container = this.sprite;
		this.fireObject.spawn();
		this.fireObject.hide();
	}

	fire(ammo) {
		this.fireObject.show();
		Sound.play('fire_shaft_begin');
		// TODO: play infinite until end
		//Sound.play('fire_shaft');
	}

	stop() {
		this.fireObject.hide();
		Sound.play('fire_shaft_end');
	}
}

