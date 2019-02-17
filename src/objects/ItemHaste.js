import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemHaste extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.powerup.spritesheet.animations.haste;
		this.animated = true;
		this.offsetY = -16;
		
		// properties
		this.itemId = Constants.IT_POWERUP_HASTE;
		this.spawnDelay = 0; // FIXME: actually should be random between 30 and 60, but in demo event we set visible by force
		this.respawnTime = 120;
	}

	spawn() {
		super.spawn();
		this.hide(); // FIXME: it will be shown by demo event
	}

	show() {
		super.show();
		Sound.play('powerup');
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: set haste for a player
			player.addPowerup(that.itemId);
			Sound.play("powerup_haste");
			return true;
		});
	}
}