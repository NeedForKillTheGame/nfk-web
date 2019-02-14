import PIXI from "PIXI";

 // labels on the screen (pause, timer, following)
export default
class ScreenLabels  {
    constructor(g) {
		this.g = g;
		console.log(g);
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
	}
	
	
	adjustPosition()
	{
		if (this.g.gamestate.paused) {
			this.textPause.visible = true;
		} else {
			this.textPause.visible = false;
		}

		this.gameTime.text = Math.floor(this.g.gamestate.gametime / 60).toString().padStart(2, '0') + ':' + (this.g.gamestate.gametime % 60).toString().padStart(2, '0');
	}
	

	destroy() {
		this.stage.removeChild(this.textPause);
	}
}