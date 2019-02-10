import SpecialObject from "./SpecialObject.js";

export default
class Portal extends SpecialObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.portal.texture;
		this.offsetX = -16;
		this.offsetY = -32;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: teleportation
			//       change this method so bullets also can iteract? (with a button)
			return false;
		});
	}
}