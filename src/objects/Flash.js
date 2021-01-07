import GameObject from "./GameObject.js";

export default
// animation of player's teleportation
class Flash extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.jumppad.spritesheet.animations.jumppad;
		this.animated = true;
		this.width = 32;
		this.height = 16;
		
		// properties
		this.strong = strong;
	}

	handleCollisions(player) {
		// do nothing, just a visual effect
		return false;
	}
}