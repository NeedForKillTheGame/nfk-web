import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

export default
class ItemAmmo extends SimpleObject {
	constructor(g, x, y, itemId, ammo) {
		super(g, x, y);
		
		// sprite
		this.texture = g.resources.items.textures['item-' + (itemId - 1) + '.png'];

		// properties
		this.itemId = itemId;
		this.ammo = ammo;
		this.respawnTime = 30;
	}

	handleCollisions(player) {
		var that = this;
		super.handleCollisions(player, function(player){
			player.addWeaponAmmo(this.itemId, this.ammo);
			Sound.play("ammopkup");
			that.sprite.visible = false;
			return true;
		});
	}
}