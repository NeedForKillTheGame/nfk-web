import PIXI from "PIXI";
import Constants from "./Constants.js";
import Console from "./Console.js";
import Utils from "./Utils.js";

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

		this.obj = null;
		this.animations = null;
		this.setModel(this.player.model, 'd', 'w');
		this.initAnimation();

		this.playerName = new PIXI.Text(player.displayName, { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'center' });
		this.playerName.anchor = new PIXI.Point(0.5, 0.5);
		//this.playerName.scale.x = this.playerName.scale.y;
		this.playerName.y -= 48;
		this.stage.addChild(this.playerName);
		
		this.playerHA = new PIXI.Text("0 / 0", { fontFamily : 'Arial', fontSize: 12, fill : 'white', align : 'center' });
		this.playerHA.anchor = new PIXI.Point(0.5, 0.5);
		//this.playerHA.scale.x = this.playerName.scale.y;
		this.playerHA.y -= 34;
		this.stage.addChild(this.playerHA);
		
		
		
		// draw weapon
		

		
		
		// create weapon sprite
	    this.weaponSprite = new PIXI.Sprite(this.getWeaponTexture(this.player.weapon));
		this.weaponSprite.anchor.set(0.5); // center of player
		this.weaponSprite.position.x += 4;
		this.weaponSprite.position.y -= 6;
		this.weaponSprite.scale.x = this.weaponSprite.scale.y =  -1;

		
        this.obj.addChild(this.weaponSprite);

		
		// player mech object (debug)
		this.mech = this.g.render.createMech(0, 0, this.player.width(), this.player.height());
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
	setModel(model, color, walktype) {
		var type = walktype + color;
		var name = model + "_" + type;
		this.animations = this.g.resources[name].spritesheet.animations[type];
		console.log(this.g.resources[name]);
		//if (this.obj)
		//	this.obj.textures = this.g.resources[name].textures;
	}
	
	initAnimation() {
		console.log(this.g.resources.sarge_wd);
		console.log(this.frames);
		// animated player
		this.obj = new PIXI.AnimatedSprite(this.animations);
		this.obj.anchor.set(0.5);
		this.obj.animationSpeed = 0.3; 
		this.obj.play();
		console.log(this.obj);
		// ignore first frame when animate
		var that = this;
		this.obj.onFrameChange = (f) => {
			if (f == that.obj.totalFrames - 1) {
				that.obj.gotoAndPlay(1);
			}
		};
		//var anim = new PIXI.AnimatedSprite(sheet.animations["wd"]);
		this.stage.addChild(this.obj);
	}
	
	play() {
		if (!this.obj.playing)
			this.obj.gotoAndPlay(1);
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
		this.obj.scale.x = this.player.dir == Constants.DIR_LS || this.player.dir == Constants.DIR_LW ? -1 : 1;

		this.obj.x = tmpX; //player.x - 10;
		if (this.player.crouch) {
			this.obj.y = tmpY; //player.y - 8;
			//this.obj.height = this.initHeight / 3 * 2;
		} else {
			this.obj.y = tmpY; //player.y - 24;
			//this.obj.height = this.initHeight;
		}

		this.playerName.x = tmpX;
		this.playerName.y = this.obj.y - 48;
        
		this.playerHA.x = tmpX;
		this.playerHA.y = this.obj.y - 34;
		this.playerHA.text = this.player.health + ' / ' + this.player.armor;
		
		this.weaponSprite.texture = this.getWeaponTexture(this.player.weapon);
		this.weaponSprite.angle = this.player.fangle;
		
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