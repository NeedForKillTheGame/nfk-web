import SpecialObject from "./SpecialObject.js";
import Constants from "../Constants.js";
import Utils from "../Utils.js";
import PIXI from "PIXI";

export default
class Door extends SpecialObject {
	constructor(g, x, y, obj) {
		super(g, x, y);

		this.texture = g.resources.door.texture.clone();
		this.texture.frame = new PIXI.Rectangle(
			(obj.orient == 0 || obj.orient == 2) ? Constants.BRICK_WIDTH : 0, 
			0, 
			Constants.BRICK_WIDTH, 
			Constants.BRICK_HEIGHT);
		this.texture_repeat = true;

		if (obj.orient == 0 || obj.orient == 2)
			this.width = Constants.BRICK_WIDTH * obj.length; // horizontal
		else
			this.height = Constants.BRICK_HEIGHT * obj.length; // vertical
		
		// door properties
		this.orient = obj.orient;
		this.length = obj.length;
		this.wait = obj.wait;
		this.targetname = obj.targetname;
		this.special = obj.special;

		this.enabled = false; // closed
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: open when player near the door and handle collisions when close

			if (that.enabled)
				return;

			//console.log("door activated", that.targetname);
			that.delayed_action(player);

			return true;
		});
	}

	delayed_action(player, callback) {
		this.enabled = true;
		this.hide();

		var that = this;
		setTimeout(function(){
			if (callback)
				callback();
			// disable after 
			that.enabled = false;
			var overlap = player
				? Utils.rectOverlap(that.rect(), player.rect())
				: false;
			if (overlap) {
				// walt more if still interacted with an object
				that.delayed_action();
				return;
			}
			that.show();
			//console.log("door deactivated", that.targetname);
		}, that.wait / Constants.FPS * 1000);
	}
}