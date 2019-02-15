import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemArmor50 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.armors.spritesheet.animations.armors;
		this.animated = true;
		this.frameStart = 0;
		this.frameEnd = 19;
		
		// properties
		this.itemId = Constants.IT_YELLOW_ARMOR;
		this.respawnTime = 30;
		this.armor = 50;
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