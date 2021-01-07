import SpecialObject from "./SpecialObject.js";
import Constants from "../Constants.js";
import Sound from "../Sound.js";
import PIXI from "PIXI";

export default
class Trigger extends SpecialObject {
	constructor(g, x, y, obj) {
		super(g, x, y);

		this.texture = PIXI.Texture.EMPTY;
		this.texture_repeat = true;
		this.width = obj.length * Constants.BRICK_WIDTH;
		this.height = obj.dir * Constants.BRICK_HEIGHT;

		// trigger properties
		this.length = obj.length;
		this.dir = obj.dir;
		this.wait = obj.wait;
		this.target = obj.target;

		this.enabled = false;
		this.targetObj = null;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){

			var target = that.findTarget();

			// do not handle if already activated
			if (target.enabled)
				return;

			//console.log("trigger activated", target.targetname);
			target.delayed_action(player, function(){
				//console.log("trigger deactivated", target.targetname);
			});
			return false;
		});
	}


	findTarget() {
		if (this.targetObj)
			return this.targetObj;

		// find target and cache result
		for (var i = 0; i < this.g.objects.length; i++) {
			var entry = this.g.objects[i];
			if (entry.targetname == this.target) {
				this.targetObj = entry;
			}
		}
		return this.targetObj;
	}
}