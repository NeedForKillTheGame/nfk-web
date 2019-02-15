import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemMedkit100 extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.mega.spritesheet.animations.mega;
		this.animated = true;
		
		// properties
		this.itemId = Constants.IT_HEALTH_100;
		this.respawnTime = 60;
		this.health = 100;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			player.addHealth(that.health, 200);
			Sound.play("health100");
			return true;
		});
	}
}