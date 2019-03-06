import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemMedkit5 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.medkits.textures['Medkits-0.png']

		// properties
		this.itemId = Constants.IT_HEALTH_5;
		this.respawnTime = 30;
		this.health = 5;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			player.addHealth(that.health, 200);
			Sound.play("health5");
			return true;
		});
	}
}