

export default
class SimpleObject extends GameObject {
	constructor(g) {
		this.g = g.

		this.x = 0.0;
		this.y = 0.0;
		this.width = 0;
		this.height = 0;
		
		this.texture = null; // PIXI.Texture
		this.sprite = null; // PIXI.Sprite
	}
	
	// TODO:
	// 1) add auto-respawn for armor, health, weapon, powerup
	// 2) add animation for portal, armor
	// 3) add plasma object, rocket object
	
	
	collisionWithPlayer(callback) {
		// check collision witn all players
		for (var i = 0; i < this.g.players.length; i++) {
			// do not check collision for dead players
			if ( this.players[k].isDead() )
				continue;
			
			callback();
		}
		return;
	}

	destroy {
		this.g.stage.removeChild(this.texture);
	}
}