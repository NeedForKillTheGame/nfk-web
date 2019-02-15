import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemArmor5 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.items.textures['item-' + (this.itemId - 1) + '.png'];

		// properties
		this.itemId = Constants.IT_SHARD;
		this.respawnTime = 30;
		this.armor = 5;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			player.addArmor(that.armor);
			Sound.play("shard");
			return true;
		});
	}
}