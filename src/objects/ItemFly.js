import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemFly extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.powerup.spritesheet.animations.fly;
		this.animated = true;
		this.offsetY = -16;
	
		// properties
		this.itemId = Constants.IT_POWERUP_FLIGHT;
		this.spawnDelay = Utils.random(30, 60); // first spawn random time
		this.respawnTime = 120;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: set fly for a player
			return true;
		});
	}
}