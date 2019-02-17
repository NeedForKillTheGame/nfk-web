import Map from "./Map.js";
import Demo from "./Demo.js";
import Render from "./Render.js";
import Sound from "./Sound.js";
import ScreenLabels from "./ScreenLabels.js";
import PlayerModel from "./objects/PlayerModel.js";
import TimerManager from "./TimerManager.js";



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
		// objects on the map
		this.objects = [];

		// timers
		this.timerManager = new TimerManager();

		// screen labels
		this.labels = new ScreenLabels(this); // labels on the screen

		// game state
		this.gamestate = {
			gametime: 0,
			gametic: 0,
			paused: false,
		};

		
		this.config = {
			demoServiceUrl: 'http://nfk.harpywar.com:8080/demo?url=',
			mode: process.env.NODE_ENV, // 'devemopment' or 'production', depends on running enviroment
			volume: 0.1, // 0.1
			default_bg: 2,
			mech: false, // rectangle for objects
			brickMech: false // rectangle for bricks
		}

		// init volume
		Sound.setVolume(this.config.volume);
	}

	initPlayerModels(container) {
		// don't forget to add model to "Sound.js"
		// and resources to app.js / PIXI.loader()
		return {
			'sarge': {
				'default':	this.getPlayerModels(container, 'sarge', 'd'),
				'red':		this.getPlayerModels(container, 'sarge', 'r'),
				'blue':		this.getPlayerModels(container, 'sarge', 'b'),
				'nuker':	this.getPlayerModels(container, 'sarge', 'nuker'),
				'white':	this.getPlayerModels(container, 'sarge', 'white'),
				'yellow':	this.getPlayerModels(container, 'sarge', 'bn'),
				'dark':		this.getPlayerModels(container, 'sarge', 'dk'),
			},
			'keel': {
				'default': 	this.getPlayerModels(container, 'keel', 'd'),
				'red': 		this.getPlayerModels(container, 'keel', 'r'),
				'blue': 	this.getPlayerModels(container, 'keel', 'b'),
				'nuker': 	this.getPlayerModels(container, 'keel', 'n'),
				'white': 	this.getPlayerModels(container, 'keel', 'white1'),
				'yellow':	this.getPlayerModels(container, 'keel', 'y'),
				'dark':		this.getPlayerModels(container, 'keel', 'dk'),
			},
			'xaero': {
				'default':	this.getPlayerModels(container, 'xaero', 'd'),
				'red':		this.getPlayerModels(container, 'xaero', 'r'),
				'blue':		this.getPlayerModels(container, 'xaero', 'b'),
				'silver':	this.getPlayerModels(container, 'xaero', 's'),
				'white':	this.getPlayerModels(container, 'xaero', 'w'),
				'yellow':	this.getPlayerModels(container, 'xaero', 'y'),
				'green':	this.getPlayerModels(container, 'xaero', 'g'),
				'dark':		this.getPlayerModels(container, 'xaero', 'dk'),
			},
			'crashed': {
				'default':	this.getPlayerModels(container, 'crashed', 'd'),
				'red':		this.getPlayerModels(container, 'crashed', 'r'),
				'blue':		this.getPlayerModels(container, 'crashed', 'b'),
				'green':	this.getPlayerModels(container, 'crashed', 'g'),
			},
			'doom2': {
				'default':	this.getPlayerModels(container, 'doom2', 'd'),
				'red':		this.getPlayerModels(container, 'doom2', 'r'),
				'blue':		this.getPlayerModels(container, 'doom2', 'b'),
				'magenta':	this.getPlayerModels(container, 'doom2', 'm'),
				'white':	this.getPlayerModels(container, 'doom2', 'w'),
				'yellow':	this.getPlayerModels(container, 'doom2', 'y'),
				'green':	this.getPlayerModels(container, 'doom2', 'g'),
				'dark':		this.getPlayerModels(container, 'doom2', 'dk'),
				'phobos':	this.getPlayerModels(container, 'doom2', 'p'),
			}
		};
	}
	getPlayerModels(container, model, color) {
		return [
			new PlayerModel(this, container, model, color, 'w'), // walk
			new PlayerModel(this, container, model, color, 'c'), // crouch
			new PlayerModel(this, container, model, color, 'd'), // death
		];
	}
}