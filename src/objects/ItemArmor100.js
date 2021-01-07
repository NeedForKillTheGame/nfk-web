import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemArmor100 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.armors.spritesheet.animations.armors;
		this.animated = true;
		this.frameStart = 20;
		this.frameEnd = 39;
		this.offsetY = -5;

		// properties
		this.itemId = Constants.IT_RED_ARMOR;
		this.respawnTime = 30;
		this.armor = 100;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			player.addArmor(that.armor);
			Sound.play("armor");
			return true;
		});
	}
}