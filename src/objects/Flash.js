import GameObject from "./GameObject.js";

export default
// animation of player's teleportation
class Flash extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
		this.strong = strong;
		
		this.texture = g.resources.jumppad.spritesheet.animations.jumppad;
		this.animated = true;
		this.width = 32;
		this.height = 16;
	}

	handleCollisions(player) {
		// do nothing, just a visual effect
		return false;
	}
}