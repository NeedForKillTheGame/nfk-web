import SpecialObject from "./SpecialObject.js";
import Constants from "../Constants.js";
import Sound from "./../Sound.js";
import PIXI from "PIXI";

export default
class Button extends SpecialObject {
	constructor(g, x, y, obj) {
		super(g, x, y);

		this.texture = g.resources.button.texture.clone();
		this.BTN_DISABLED = 6;
		this.disableButton();

		// button properties
		this.orient = obj.orient;
		this.wait = obj.wait;
		this.target = obj.target;
		this.shootable = obj.shootable;

		this.enabled = false;
		this.targetObj = null;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: handle collisions and trigger door activations

			var target = that.findTarget();

			// do not handle if already activated
			if (target.enabled && that.enabled)
				return;
			that.enableButton();
			Sound.play("button");
			
			target.delayed_action(player, function(){
				// disable button on complete
				that.disableButton();
			});

			return false;
		});
	}

	enableButton() {
		this.enabled = true;
		this._switchButton(this.orient);
		//console.log("button enabled", that.wait, target);
	}
	disableButton() {
		this.enabled = false;
		this._switchButton(this.BTN_DISABLED);
		//console.log("button disabled");
	}
	_switchButton(type) {
		this.texture.frame = new PIXI.Rectangle(
			type * 24,
			0, 
			24, 
			24);
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