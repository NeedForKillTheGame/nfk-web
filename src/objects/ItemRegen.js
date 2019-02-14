import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "../Constants.js";

export default
class ItemRegen extends SimpleObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.powerup.spritesheet.animations.invis;
		this.animated = true;
		this.offsetY = -16;
		
		// properties
		this.itemId = Constants.IT_POWERUP_REGENERATION;
		this.spawnDelay = Utils.random(30, 60); // first spawn random time
		this.respawnTime = 120;
	}

	show() {
		super.show();
		Sound.play('powerup_regen');
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: set regeneration for a player
			Sound.play("powerup_regen"); // todo: play every second until health < 200
			return true;
		});
	}
}