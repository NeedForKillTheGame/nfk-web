import PIXI from "PIXI";
import Keyboard from "./Keyboard.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";

 // labels on the screen (pause, timer, following)
export default
class ScreenLabels  {
    constructor(g) {
		this.g = g;
		this.stage = g.render.stage;


		this.textPause = new PIXI.Text("Game Paused", { fontFamily : 'Arial', fontSize: 25, fill : 'red', align : 'center' });
		this.textPause.anchor = new PIXI.Point(0.5, 0.5);
		this.textPause.x = window.innerWidth / 2;
		this.textPause.y = window.innerHeight / 2;
		this.stage.addChild(this.textPause);
		
		this.gameTime = new PIXI.Text("0:00", { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'center' });
		this.gameTime.anchor = new PIXI.Point(0.5, 0.5);
		this.gameTime.x = window.innerWidth - 145;
		this.gameTime.y = 20;
		this.stage.addChild(this.gameTime);


		this.textUsage = new PIXI.Text("ESC = pause    TAB = score board", { fontFamily : 'Arial', fontSize: 12, fill : 'white', align : 'left' });
		this.textUsage.x = 15;
		this.textUsage.y = window.innerHeight - 20;
		this.textUsage.alpha = 0.5;
		this.stage.addChild(this.textUsage);




		this.scoreboard = new Scoreboard(g);
		this.scoreboard.container.visible = false; // set invisible
	}
	
	
	adjustPosition()
	{
		// show pause label when game paused
		this.textPause.visible = this.g.gamestate.paused;
		// show scoreboard by tab key or at the end of the game
		this.scoreboard.container.visible = Keyboard.keyTab || this.g.gamestate.gameend;


		if (this.textPause.visible) {
			Utils.bringToFront(this.textPause);
		}
		if (this.scoreboard.container.visible) {
			Utils.bringToFront(this.scoreboard.container);
			this.scoreboard.update();
		}

		this.gameTime.text = Utils.formatGameTime(this.g.gamestate.gametime);
	}


	destroy() {
		this.stage.removeChild(this.textPause);
	}
}


class Scoreboard {
	constructor(g) {
		this.g = g;
		
		this.colorRed = PIXI.utils.string2hex('#FF4500');
		this.colorBlue = PIXI.utils.string2hex('#00BFFF');

		this.textStyle =  { fontFamily : 'Arial', fontSize: 14, fill : 'white', align : 'left' };
		this.textStyleRed =  { fontFamily : 'Arial', fontSize: 14, fontWeight: "bold", fill : this.colorRed, align : 'left' };
		this.textStyleBlue =  { fontFamily : 'Arial', fontSize: 14, fontWeight: "bold", fill : this.colorBlue, align : 'left' };


		// scoreboard
		this.container = new PIXI.Container();
		var width = 500;
		var height = 260;
		this.container.x = window.innerWidth / 2 - width/2;
		this.container.y = window.innerHeight / 2 - height/2;
		this.g.render.stage.addChild(this.container);

		this.background = new PIXI.Graphics();
		this.background.beginFill(0x000); // Red
		this.background.drawRect(0, 0, width, height);
		this.background.endFill();
		this.background.alpha = 0.8;
		this.container.addChild(this.background);

		this.textItems = new PIXI.Graphics();
		this.container.addChild(this.textItems);

		
		this.lastUpdated = 0;
	}

	update() {
		// update every second
		if (this.lastUpdated >= this.g.gamestate.gametime) {
			return;			
		}
		this.updateScoreboard();
		this.lastUpdated = this.g.gamestate.gametime;
	}

	
	updateScoreboard() {

		// remove all children first
		for (var i = this.textItems.children.length - 1; i >= 0; i--) {
			this.textItems.children[i].destroy();
			this.textItems.removeChild(this.textItems.children[i]);
		};


		// players table 

		var titleName = new PIXI.Text("NAME", this.textStyleRed);
		titleName.x = 30;
		titleName.y = 70;
		this.textItems.addChild(titleName);

		var titleFrags = new PIXI.Text("FRAGS", this.textStyleRed);
		titleFrags.x = 300;
		titleFrags.y = 70;
		this.textItems.addChild(titleFrags);

		var titlePing = new PIXI.Text("PING", this.textStyleRed);
		titlePing.x = 400;
		titlePing.y = 70;
		this.textItems.addChild(titlePing);

		var redFrags = 0;
		var blueFrags = 0;
		for (var i = 0; i < this.g.players.length; i++) {
			var offsetY = 90 + i * 20;

			var color = this.colorRed;
			if (this.g.players[i].team == Constants.C_TEAMBLUE) {
				color = this.colorBlue;
				blueFrags += this.g.players[i].frags;
			} else {
				redFrags += this.g.players[i].frags;
			}
			var teamRect = new PIXI.Graphics();
			teamRect.beginFill(color);
			teamRect.drawRect(20, offsetY + 3, 5, 10);
			teamRect.endFill();
			this.textItems.addChild(teamRect);

			var textName = new PIXI.Text(this.g.players[i].displayName, this.textStyle);
			textName.x = 30;
			textName.y = offsetY;
			this.textItems.addChild(textName);

			var textFrags = new PIXI.Text(this.g.players[i].frags, this.textStyle);
			textFrags.x = 300;
			textFrags.y = offsetY;
			this.textItems.addChild(textFrags);

			var textPing = new PIXI.Text(this.g.players[i].ping, this.textStyle);
			textPing.x = 400;
			textPing.y = offsetY;
			this.textItems.addChild(textPing);
		}


		// summary table

		var titleRedCaptures = new PIXI.Text("RED CAPTURES: " + this.g.gamestate.redscore, this.textStyleRed);
		titleRedCaptures.x = 150;
		titleRedCaptures.y = 20;
		this.textItems.addChild(titleRedCaptures);

		var titleRedScore = new PIXI.Text("RED SCORE: " + redFrags, this.textStyleRed);
		titleRedScore.x = 177;
		titleRedScore.y = 40;
		this.textItems.addChild(titleRedScore);


		var titleBlueCaptures = new PIXI.Text("BLUE CAPTURES: " + this.g.gamestate.bluescore, this.textStyleBlue);
		titleBlueCaptures.x = 300;
		titleBlueCaptures.y = 20;
		this.textItems.addChild(titleBlueCaptures);

		var titleBlueScore = new PIXI.Text("BLUE SCORE: " + blueFrags, this.textStyleBlue);
		titleBlueScore.x = 327;
		titleBlueScore.y = 40;
		this.textItems.addChild(titleBlueScore);


	}
	
}