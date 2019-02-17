import PIXI from "PIXI";
import Constants from "./Constants.js";
import Console from "./Console.js";
import Utils from "./Utils.js";
import PlayerModel from "./objects/PlayerModel.js";

export default
class PlayerGraphics  {
    constructor(g, player) {
		this.g = g;
		this.stage = g.render.stage;
		this.player = player;
	
		//this.playerGraphics = new PIXI.Graphics();
		//this.playerGraphics.beginFill(0xAAAAFF);
		////this.playerGraphics.lineStyle(1, 0xFFFFFF);
		//this.playerGraphics.drawRect(0, 0, this.player.width(), this.player.height());
		//this.playerGraphics.endFill();
		//this.stage.addChild(this.playerGraphics);

		this.container = new PIXI.Container();
		console.log("c1", this.container);
		this.stage.addChild(this.container);
		this.obj = null;
		this.animations = this.g.initPlayerModels(this.container);
		this.updateModel();

		this.playerName = new PIXI.Text(player.displayName, { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'center' });
		this.playerName.anchor = new PIXI.Point(0.5, 0.5);
		//this.playerName.scale.x = this.playerName.scale.y;
		this.playerName.y -= 50;
		this.container.addChild(this.playerName);
		
		this.playerHA = new PIXI.Text("0 / 0", { fontFamily : 'Arial', fontSize: 12, fill : 'white', align : 'center' });
		this.playerHA.anchor = new PIXI.Point(0.5, 0.5);
		//this.playerHA.scale.x = this.playerName.scale.y;
		this.playerHA.y -= 36;
		this.container.addChild(this.playerHA);
		
		
		// player mech object (debug)
		this.mech = this.g.render.createMech(0, 0, this.player.width(), this.player.height());
		this.mech.visible = false;
	}
	
	getWeaponTexture(weaponId) {
		// cut texture rectangle for weapon from the palette
		var weaponTexture = null;
		
		// gaunlett
		if (weaponId == 0) {
			weaponTexture = this.g.resources.gaunlet.textures[0];
		}
		// machine
		else if (weaponId == 1) {
			weaponTexture = this.g.resources.mgun.textures[0];
		} 
		// others
		else {
			weaponTexture = this.g.resources.weapons.textures[weaponId];
		}
				
		return weaponTexture;
	}
	
	// model = sarge
	// color = d|b|r
	// walktype = w
	updateModel() {
		// hide all player animations
		for (var m in this.animations) {
			for (var c in this.animations[m]) {
				for (var i = 0; i < this.animations[m][c].length; i++)
					this.animations[m][c][i].sprite.visible = false;
			}
		}
		var type = this.player.crouch ? 1 : 0;
		if (this.player.dead > 0) {
			type = 2;
			console.log("dead " + type);
		}
		// show current animation
		this.obj = this.animations[this.player.model][this.player.modelColor][type].sprite;
		this.obj.visible = true;
		this.play();
	}

	play() {
		if (!this.obj.playing)
			this.obj.gotoAndPlay(0);
	}
	stop() {
		if (this.obj.playing)
			this.obj.gotoAndStop(0);
	}
	
	
	adjustPosition(tmpX, tmpY)
	{
		
		if (this.player.dir == Constants.DIR_LS || this.player.dir == Constants.DIR_RS) {
			// stand
			this.stop();
		} else {
			// walk
			this.play();
		}
		
		// player direction
		this.container.scale.x = this.player.dir == Constants.DIR_LS || this.player.dir == Constants.DIR_LW ? -1 : 1;
		// morror display name and hud
		this.playerName.scale.x = this.playerHA.scale.x = this.container.scale.x;

		this.container.x = tmpX; //player.x - 10;
		if (this.player.crouch) {
			tmpY += 5;
		}
		this.container.y = tmpY; //player.y - 24;

		this.playerHA.text = this.player.health + ' / ' + this.player.armor;
		/*
		this.playerName.x = tmpX;
		this.playerName.y = this.obj.y - 48;
        
		this.playerHA.x = tmpX;
		this.playerHA.y = this.obj.y - 34;
		
		*/

		this.player.weapon.sprite.angle = this.player.fangle;

		// player with a flag
		if (this.player.flag) {
			this.player.flag.setY(this.player.y);
			if (this.player.dir == Constants.DIR_RW || this.player.dir == Constants.DIR_RS) {
				this.player.flag.setX(this.player.x - 20);
				this.player.flag.sprite.scale.x = -1;
				this.player.flag.sprite.angle = -45;
			} else {
				this.player.flag.setX(this.player.x + 20);
				this.player.flag.sprite.scale.x = 1;
				this.player.flag.sprite.angle = 45;
			}
		}
	}
	
	// health and armor
	updatePlayerHA(text, x, y) {
		
	}
	
	
	destroy() {
		this.stage.removeChild(this.obj);
		this.stage.removeChild(this.playerCenter);
		this.stage.removeChild(this.playerName);
		this.stage.removeChild(this.playerHA);
		this.stage.removeChild(this.mech);
	}
}