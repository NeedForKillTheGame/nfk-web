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

	}
	
	getWeaponTexture(weaponId) {
		// cut texture rectangle for weapon from the palette
		var weaponTexture = null;
		
		// gaunlett
		if (weaponId == 0) {
			weaponTexture = new PIXI.Texture(
				this.g.resources.gaunlett.texture, 
				new PIXI.Rectangle(
					0, 
					0,
					Constants.BRICK_WIDTH, 
					28));	
		}
		// machine
		else if (weaponId == 1) {
			weaponTexture = new PIXI.Texture(
				this.g.resources.machine.texture, 
				new PIXI.Rectangle(
					40, 
					0,
					40, 
					13));
		} 
		// others
		else {
			weaponTexture = new PIXI.Texture(
				this.g.resources.palette.texture, 
				new PIXI.Rectangle(
					(weaponId - 1) * Constants.BRICK_WIDTH, 
					0,
					Constants.BRICK_WIDTH, 
					Constants.BRICK_HEIGHT));
		}
				
		return weaponTexture;
	}
	
	initAnimation() {
		var frames = [];

		for (var i = 0; i < 19; i++) {
			frames.push(PIXI.Texture.fromFrame('wd_' + i + '.png'));
		}

		// animated player
		this.obj = new PIXI.extras.AnimatedSprite(frames);
		this.obj.anchor.set(0.5);
		this.obj.animationSpeed = 0.3; 
		this.obj.play();
		
		// ignore first frame when animate
		var that = this;
		this.obj.onFrameChange = (f) => {
			if (f == that.obj.totalFrames - 1) {
				that.obj.gotoAndPlay(1);
			}
		};
		//var anim = new PIXI.extras.AnimatedSprite(sheet.animations["wd"]);
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
		if (this.player.velocityX == 0) {
			this.stop();
		} else {
			this.play();
		}
		
		// FIXME: possible wrong directions? 0,3 for left side, and 1,2 for the right
		//        somthing wrong here, flip sometimes incorrect
		this.obj.scale.x = this.player.dir == 0 || this.player.dir == 3 ? -1 : 1;

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
	}
}