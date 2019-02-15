import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemMedkit50 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.medkits.textures['Medkits-2.png']

		// properties
		this.itemId = Constants.IT_HEALTH_50;
		this.respawnTime = 30;
		this.health = 50;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			if (player.health >= 100)
				return false;
			player.addHealth(that.health, 100);
			Sound.play("health50");
			return true;
		});
	}
}