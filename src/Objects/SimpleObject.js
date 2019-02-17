import GameObject from "./GameObject.js";

// can be taken by a player and spawn every X seconds
export default
class SimpleObject extends GameObject {
	constructor(g, x, y) {
		super(g, x, y);
		
		this.spawnDelay = 0; // spawn object with a delay (seconds)
		this.respawnTime = 0; // auto-respawn the object after take by a player
	}

	spawn() {
		super.spawn();

		// spawn with a delay
		if (this.spawnDelay > 0) {
			this.sprite.visible = false;
			var that = this;
			var timerId =  this.g.timerManager.addTimeout(this.spawnDelay, function(id, tick){
				that.sprite.visible = true;
			});
			this.timerIds.push(timerId);
		}
	}
	
	handleCollisions(player, callback) {
		// player eat object
		if (super.handleCollisions(player, callback)) {
			// "remove" it
			this.sprite.visible = false;
			// respawn after this.respawntime
			if (this.respawnTime > 0) {
				var that = this;
				var timerId = this.g.timerManager.addTimeout(this.respawnTime, function(id, tick){
					that.sprite.visible = true;
					//console.log("respawn object " + that.itemId);
				});
				this.timerIds.push(timerId);
			}
		}
	}

}