import Map from "./Map.js";
import Demo from "./Demo.js";
import Render from "./Render.js";
import Sound from "./Sound.js";


// global class with all data
export default
class Global {
	constructor() {		
		this.resources = {};
		this.map = new Map(this);
		// pixi
		this.render = new Render(this); 

		this.players = [];
		// demo data
		this.demo = new Demo(this);
		// all objects on the map
		this.objects = [];
		
		// game paused or not
		this.paused = false;
		
		
		this.config = {
			demoServiceUrl: 'http://nfk.harpywar.com:8080/demo?url=',
			mode: process.env.NODE_ENV, // 'devemopment' or 'production', depends on running enviroment
			volume: 0.1,
			default_bg: 2,
			mech: true, // rectangle for objects
			brickMech: false // rectangle for bricks
		}

		// init volume
		Sound.setVolume(this.config.volume);
		
		
	}
}