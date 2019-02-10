import GameObject from "./GameObject.js";
import Sound from "./../Sound.js";

export default
class BlueFlag extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.flag.spritesheet.animations.flag;
		this.animated = true;
		this.frameStart = 0;
		this.frameEnd = 13;
		this.offsetY -= 26;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: take flag by a player (only by enemy player)
			return false;
		});
	}
}