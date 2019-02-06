import Map from "./Map.js";
import Demo from "./Demo.js";
import Render from "./Render.js";
import Sound from "./Sound.js";


// global class with all data
export default
class Global {
	constructor() {
		this.map = new Map(this);
		this.players = [];
		// demo data
		this.demo = new Demo(this);
		// all objects on the map
		this.gameObjects = [];
		
		// pixi stage
		this.render = new Render(this); // PIXI.Stage
		
		
		this.config = {
			mode: process.env.NODE_ENV, // 'devemopment' or 'production', depends on running enviroment
			volume: 0.3,
			default_bg: 2
		}
		this.const = {
			mode: process.env.NODE_ENV, // 'devemopment' or 'production', depends on running enviroment
			fps: 50, // do not change, 50 fps is in nfk
			volume: 0.3,
			default_bg: 2
		}
		// init volume
		Sound.setVolume(this.config.volume);
		
		
	}
}