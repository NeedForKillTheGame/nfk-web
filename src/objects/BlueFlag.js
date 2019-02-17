import GameObject from "./GameObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class BlueFlag extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
		// remember init position for a flag
		this.initX = x;
		this.initY = y;

		// sprite
		this.texture = g.resources.flag.spritesheet.animations.flag;
		this.animated = true;
		this.frameStart = 0;
		this.frameEnd = 13;
		this.offsetY -= 26;

		// properties
		this.itemId = Constants.IT_BLUE_FLAG;
	}

	returnToBase() {
		// remove flag from player
		for (var i = 0; i < this.g.players.length; i++) {
			if (this.g.players[i].flag && this.g.players[i].flag.itemId == this.itemId) {
				this.g.players[i].flag = null;
			}
		}

		// reset coords
		this.setX(this.initX);
		this.setY(this.initY);
		this.sprite.scale.x = 1;
		this.sprite.angle = 0;
	}



	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: take flag by a player (only by enemy player)
			return false;
		});
	}
}