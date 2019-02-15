import GameObject from "./GameObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class Jumppad extends GameObject {
	constructor(g, x, y, strong) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.jumppad.spritesheet.animations.jumppad;
		this.animated = true;
		
		// properties
		this.itemId = strong ? Constants.IT_JUMPPAD2 : Constants.IT_JUMPPAD;
		this.strong = strong;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: jump a player, use this.strong
			Sound.play("jumppad");
			return false;
		});
	}
}