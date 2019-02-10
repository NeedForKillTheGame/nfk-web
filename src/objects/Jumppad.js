import GameObject from "./GameObject.js";
import Sound from "./../Sound.js";

export default
class Jumppad extends GameObject {
	constructor(g, x, y, strong) {
		super(g, x, y);
		this.itemId = strong ? 39 : 38;
		this.strong = strong;
		
		this.texture = g.resources.jumppad.spritesheet.animations.jumppad;
		this.animated = true;
		this.width = 32;
		this.height = 16;
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