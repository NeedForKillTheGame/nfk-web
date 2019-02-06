import PIXI from "PIXI";
import Constants from "./Constants.js";
import Console from "./Console.js";
import Utils from "./Utils.js";

export default
class PlayerGraphics  {
    constructor(stage, player) {
		this.stage = stage;
		this.player = player;
	
		this.playerGraphics = new PIXI.Graphics();
		this.playerGraphics.beginFill(0xAAAAFF);
		//this.playerGraphics.lineStyle(1, 0xFFFFFF);
		this.playerGraphics.drawRect(0, 0, this.player.width(), this.player.height());
		this.playerGraphics.endFill();
		this.stage.addChild(this.playerGraphics);

		this.playerCenter = new PIXI.Graphics();
		this.playerCenter.beginFill(0x0000AA);
		this.playerCenter.drawRect(0, 0, 2, 2);
		this.playerCenter.endFill();
		this.stage.addChild(this.playerCenter);


		this.playerName = new PIXI.Text(player.displayName, { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'center' });
		this.playerName.anchor = new PIXI.Point(0.5, 0.5);
		this.playerName.height = 80;
		this.playerName.scale.x = this.playerName.scale.y;
		this.stage.addChild(this.playerName);
		
		this.playerHA = new PIXI.Text("0 / 0", { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'center' });
		this.playerHA.anchor = new PIXI.Point(0.5, 0.5);
		this.playerHA.height = 70;
		this.playerHA.scale.x = this.playerName.scale.y;
		this.stage.addChild(this.playerHA);
		
		//var dot1 = new PIXI.Graphics();
		//this.stage.addChild(dot1);
        //
		//var dot2 = new PIXI.Graphics();
		//this.stage.addChild(dot2);

		this.initHeight = this.playerGraphics.height;
	}
	
	adjustPosition(tmpX, tmpY)
	{
		this.playerGraphics.x = tmpX - 10; //player.x - 10;
		if (this.player.crouch) {
			this.playerGraphics.y = tmpY - 8; //player.y - 8;
			this.playerGraphics.height = this.initHeight / 3 * 2;
		} else {
			this.playerGraphics.y = tmpY - 24; //player.y - 24;
			this.playerGraphics.height = this.initHeight;
		}

		this.playerCenter.x = tmpX - 1; //player.x-1;
		this.playerCenter.y = tmpY - 1;
		
		this.playerName.x = tmpX;
		this.playerName.y = this.playerGraphics.y - 25;

		this.playerHA.x = tmpX;
		this.playerHA.y = this.playerGraphics.y - 9;
		this.playerHA.setText(this.player.health + ' / ' + this.player.armor);
	}
	
	// health and armor
	updatePlayerHA(text, x, y) {
		
	}
	
	
	destroy() {
		this.stage.removeChild(this.playerGraphics);
		this.stage.removeChild(this.playerCenter);
		this.stage.removeChild(this.playerName);
		this.stage.removeChild(this.playerHA);
	}
}