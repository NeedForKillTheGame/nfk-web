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
		this.disableButton(true);

		// button properties
		this.orient = obj.orient;
		this.wait = obj.wait;
		this.target = obj.target;
		this.shootable = obj.shootable;

		this.enabled = false;
		this.targetObjs = [];
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			// TODO: handle collisions and trigger door activations

			that.findTargets(function(target){
				// do not handle if already activated
				if (target.enabled && that.enabled)
					return;
				that.enableButton();
				
				target.delayed_action(player, function(){
					// disable button on complete
					that.disableButton();
				});
			});


			return false;
		});
	}

	enableButton(force) {
		if (this.enabled && !force)
			return;
		Sound.play("button");
		this.enabled = true;
		this._switchButton(this.orient);
		//console.log("button enabled", this.target);
	}
	disableButton(force) {
		if (!this.enabled && !force)
			return;
		this.enabled = false;
		this._switchButton(this.BTN_DISABLED);
		//console.log("button disabled", this.target);
	}
	_switchButton(type) {
		this.texture.frame = new PIXI.Rectangle(
			type * 24,
			0, 
			24, 
			24);
	}

	/* exec callback for each target */
	findTargets(callback) {
		if (this.targetObjs.length) {
			if (callback) {
				this.targetObjs.forEach(function(target){
					callback(target);
				})
			}
			return this.targetObjs;
		}

		// find target and cache result
		for (var i = 0; i < this.g.objects.length; i++) {
			var entry = this.g.objects[i];
			if (entry.targetname == this.target) {
				this.targetObjs.push(entry);
			}
		}
		return this.findTargets(callback);
	}
}