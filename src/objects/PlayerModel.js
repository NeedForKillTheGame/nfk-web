import GameObject from "./GameObject.js";
import Sound from "./../Sound.js";

export default
class PlayerModel extends GameObject {
	constructor(g, container, model, color, type) {
		super(g, 0, 0);
		
		// sprite
		//console.log(g.resources[model]);
		this.texture = g.resources[model].spritesheet.animations[model + '/' + type + color];
		this.animated = true;
		this.frameStart = 1;
		this.container = container;

		this.spawn();
		this.sprite.anchor.set(0.5);
		this.sprite.animationSpeed = 0.3;
	}

	handleCollisions(player) {
		// do nothing
		return false;
	}
}