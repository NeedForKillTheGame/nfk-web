import GameObject from "./GameObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import Weapon from "./Weapon.js";
import Bullet from "./Bullet.js";

// object which can move on the direction and traectory
// when reach a player OR a brick then fires event (explosion, damage)
// Here could be all weapon bullets, including rail, machine (speed = 100 = immediate)
export default
class WeaponGauntlet extends Weapon  {
	constructor(g, player) {
		super(g, player);

		this.itemId = Constants.C_WPN_GAUNTLET;
		this.offsetX = -1;
		// sprite
		this.texture = g.resources.gauntlet.spritesheet.animations.gauntlet;
		this.animated = true;
		this.frameStopped = 0;
		this.frameStart = 1;
		this.frameEnd = 3;
		this.container = player.graphics.container;
		this.offsetX = -8;
	}

	// state = 0 | 1 | 2 (2 = attack?)
	use(state) {
		this.play();
		console.log(state);
		Sound.play('fire_gauntl' + state);
	}
}
