import SimpleObject from "./SimpleObject.js";
import Sound from "./../Sound.js";
import Constants from "./../Constants.js";

/*
TODO:
если патроны брать они пропадают, если оружия нет

Оружие: при подборе, максимум, патроны. 
Рокет: 10, 50, 5, 
шафт: 130, 200, 70, 
рейл: 10, 50, 5
плазма: 50, 100, 30
гранаты: 10, 25, 5,
дробовик: 10, 50, 10, 
мг: 100, 100, 50. 

Если берёшь пушку в её месте, а у тебя она уже есть, то патронов добавляется до уровня "При подборе", если берёшь пушку с трупа, то патронов прибавляется на уровень "При подборе". Если берёшь патроны до того, как взял пушку и в совокупности патронов взято меньше, чем при подборе пушки, то дополняется до уровня "При подборе", иначе - до уровня сколько взял в сумме патронов. Мг не выпадает с трупа. Время респов айтемов: мега - 60, Броня - 30, рейл - 30, аптечка +50 - 30, шафт - 40. Всё остальное  - 20.


*/

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