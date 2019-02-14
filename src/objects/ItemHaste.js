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
		this.spawnDelay = Utils.random(30, 60); // first spawn random time
		this.respawnTime = 120;
	}

	show() {
		super.show();
		Sound.play('powerup_haste');
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: set haste for a player
			Sound.play("powerup_haste");
			return true;
		});
	}
}