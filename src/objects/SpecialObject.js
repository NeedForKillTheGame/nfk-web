import GameObject from "./GameObject.js";

// player can iteract with a special object (attack button, teleportation)
export default
class SpecialObject extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
	}
	
	handleCollisions(player, callback) {
		return super.handleCollisions(player, callback);
	}

}