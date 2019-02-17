import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponGrenade extends Weapon  {
	constructor(g, player) {
		super(g, player);

		this.itemId = Constants.C_WPN_GRENADE;
		this.ammo = 10; // init ammo
		this.maxAmmo = 50; // max ammo

		// sprite
		this.texture = g.resources.weapons.textures['weapons-' + (this.itemId - 2) + '.png'];
		this.container = player.graphics.container;
	}

	// TODO: not implemented

	fireVector(x, y, inertialX, inertialY) {
		Sound.play('fire_gren');
		super.fire(x, y, inertialX, inertialY);
	}
}
