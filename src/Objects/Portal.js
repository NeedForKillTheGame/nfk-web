import SpecialObject from "./SpecialObject.js";

export default
class Portal extends SpecialObject {
	constructor(g, x, y) {
		// adjust init sprite position on the map
		y -= 32;
		x -= 16;
		
		super(g, x, y);

		this.texture = g.resources.portal.texture;
		this.spritePos = 0;
		this.width = 64;
		this.height = 48;
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