import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemQuad extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.powerup.spritesheet.animations.quad;
		this.animated = true;
		this.offsetY = -16;
		
		// properties
		this.itemId = Constants.IT_POWERUP_QUAD;
		this.spawnDelay = 120; // FIXME: actually should be random between 30 and 60, but in demo event we set visible by force
		this.respawnTime = 120;
	}

	show() {
		super.show();
		Sound.play('powerup_quad');
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: increase damage for a player
			Sound.play("powerup_quad");
			return true;
		});
	}
}