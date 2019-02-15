//import MapEditor from "./MapEditor.js";
import Constants from "./Constants.js";
import Console from "./Console.js";
import Utils from "./Utils.js";

import ItemMedkit5 from "./objects/ItemMedkit5.js";
import ItemMedkit25 from "./objects/ItemMedkit25.js";
import ItemMedkit50 from "./objects/ItemMedkit50.js";
import ItemMedkit100 from "./objects/ItemMedkit100.js";
import ItemArmor5 from "./objects/ItemArmor5.js";
import ItemArmor50 from "./objects/ItemArmor50.js";
import ItemArmor100 from "./objects/ItemArmor100.js";
import ItemQuad from "./objects/ItemQuad.js";
import ItemFly from "./objects/ItemFly.js";
import ItemHaste from "./objects/ItemHaste.js";
import ItemBattle from "./objects/ItemBattle.js";
import ItemInvis from "./objects/ItemInvis.js";
import ItemRegen from "./objects/ItemRegen.js";
import ItemAmmo from "./objects/ItemAmmo.js";
import ItemWeapon from "./objects/ItemWeapon.js";

import RedFlag from "./objects/RedFlag.js";
import BlueFlag from "./objects/BlueFlag.js";

import Jumppad from "./objects/Jumppad.js";
import Portal from "./objects/Portal.js";





export default
class Map {
	constructor(g) {
		this.g = g;
		this.rows = 0;
		this.cols = 0;
		this.bricks = []; // two dimensional array of bricks, contains only brick index (legacy)
		this.brickObjects = []; // array of brick objects (for easier iteration)

		this.specialObjects = [];
		this.respawns = [];
		this.bg = 1; // background id
		
		this.paletteImage = "images/palette.png";
		this.paletteIndex = 6; // offset for normal palette
		
		this.paletteCustomImage = null;
		this.paletteCustomIndex = 54; // offset for custom palette

	}
	
	
	async loadFromDemo(demoMap) {
		this.bg = demoMap.Header.BG;
		if (this.bg == 0) 
			this.bg = this.g.config.default_bg; // set default bg if not set
		
		this.loadNFKMap(demoMap.Bricks);
		
		// set palette 
		if (demoMap.PaletteBytes) {
			this.paletteCustomImage = "data:image/png;base64," + demoMap.PaletteBytes;
			await this.g.render.updatePaletteTexture(this.paletteCustomImage);
		}
		this.specialObjects = demoMap.Objects;
	}
	
	// bricksData = array of base64 encoded lines with bytes
	loadNFKMap(bricksData) {
		var lines = bricksData; 
		this.rows = lines.length;
		for (var y = 0; y < lines.length; y++)
		{
			this.bricks[y] = [];	
			var line = window.atob(lines[y]);
			this.cols = line.length;
			for (var x = 0; x < line.length; x++)
			{
				var b = Utils.ord(line[x]);
				this.bricks[y][x] = b;
				
				// TODO: add game objects which <= 53
				
				if (b == 34 || b == 35 || b == 36)
					this.respawns.push({row: x, col: y});
			}
		}
	}
	
	spawnObjects() {
		// destroy old objects if exist
		this._destroyObjects();

		// add all map simpleobjects (medkits, armors, weapons)
		for (var y = 0; y < this.g.map.bricks.length; y++) {
			for (var x = 0; x < this.g.map.bricks[y].length; x++) {
				var brick = this.g.map.bricks[y][x];
				var x_coord = y * Constants.BRICK_WIDTH; // yes coords are messed up :/
				var y_coord = x * Constants.BRICK_HEIGHT;
				// do not handle real bricks (map buildings)
				if (this.g.map.bricks[y][x] > 53)
				{
					continue;
				}
				
				if (brick >= Constants.IT_SHOTGUN && brick <= Constants.IT_BFG)
					this.g.objects.push(new ItemWeapon(this.g, x_coord, y_coord, brick));
				if (brick >= Constants.IT_AMMO_MACHINEGUN && brick <= Constants.IT_AMMO_BFG) {
					var ammo = 10; // all weapons
					if (brick == Constants.IT_AMMO_MACHINEGUN) ammo = 100;
					//if (brick == Constants.IT_AMMO_SHOTGUN) ammo = 10;
					//if (brick == Constants.IT_AMMO_GRENADE) ammo = 10;
					//if (brick == Constants.IT_AMMO_ROCKET) ammo = 10;
					//if (brick == Constants.IT_AMMO_SHAFT) ammo = 10;
					//if (brick == Constants.IT_AMMO_RAIL) ammo = 10;
					if (brick == Constants.IT_AMMO_PLASMA) ammo = 50;
					//if (brick == Constants.IT_AMMO_BFG) ammo = 10;
					this.g.objects.push(new ItemWeapon(this.g, x_coord, y_coord, brick, 10)); // FIXME: add ammo for each weapon
				}
				
				if (brick == Constants.IT_SHARD)
					this.g.objects.push(new ItemArmor5(this.g, x_coord, y_coord));
				if (brick == Constants.IT_YELLOW_ARMOR)
					this.g.objects.push(new ItemArmor50(this.g, x_coord, y_coord));
				if (brick == Constants.IT_RED_ARMOR)
					this.g.objects.push(new ItemArmor100(this.g, x_coord, y_coord));
				if (brick == Constants.IT_HEALTH_5)
					this.g.objects.push(new ItemMedkit5(this.g, x_coord, y_coord));
				if (brick == Constants.IT_HEALTH_25)
					this.g.objects.push(new ItemMedkit25(this.g, x_coord, y_coord));
				if (brick == Constants.IT_HEALTH_50)
					this.g.objects.push(new ItemMedkit50(this.g, x_coord, y_coord));
				if (brick == Constants.IT_HEALTH_100)
					this.g.objects.push(new ItemMedkit100(this.g, x_coord, y_coord));
				
				if (brick == Constants.IT_POWERUP_REGENERATION)
					this.g.objects.push(new ItemRegen(this.g, x_coord, y_coord));
				if (brick == Constants.IT_POWERUP_BATTLESUIT)
					this.g.objects.push(new ItemBattle(this.g, x_coord, y_coord));
				if (brick == Constants.IT_POWERUP_HASTE)
					this.g.objects.push(new ItemHaste(this.g, x_coord, y_coord));
				if (brick == Constants.IT_POWERUP_QUAD)
					this.g.objects.push(new ItemQuad(this.g, x_coord, y_coord));
				if (brick == Constants.IT_POWERUP_FLIGHT)
					this.g.objects.push(new ItemFly(this.g, x_coord, y_coord));
				if (brick == Constants.IT_POWERUP_INVISIBILITY)
					this.g.objects.push(new ItemInvis(this.g, x_coord, y_coord));
				

				if (brick == Constants.IT_JUMPPAD)
					this.g.objects.push(new Jumppad(this.g, x_coord, y_coord, false));
				if (brick == Constants.IT_JUMPPAD2)
					this.g.objects.push(new Jumppad(this.g, x_coord, y_coord, true));
				
				if (brick == Constants.IT_BLUE_FLAG)
					this.g.objects.push(new BlueFlag(this.g, x_coord, y_coord));
				if (brick == Constants.IT_RED_FLAG)
					this.g.objects.push(new RedFlag(this.g, x_coord, y_coord));
			}
		}
		
		// add special objects
		for (var i = 0; i < this.specialObjects.length; i++) {
			var obj = this.specialObjects[i];
			var x_coord = obj.x * Constants.BRICK_WIDTH;
			var y_coord = obj.y * Constants.BRICK_HEIGHT;

			if (obj.objtype == 1)
				this.g.objects.push(new Portal(this.g, x_coord, y_coord));
			
		}
		
		// spawn all objects
		for (var i = 0; i < this.g.objects.length; i++) {
			this.g.objects[i].spawn();
		}
		console.log("spawned " + this.g.objects.length + " objects");
	}
	
	_destroyObjects() {
		for (var i = 0; i < this.g.objects.length; i++) {
			this.g.objects[i].destroy();
		}
		this.g.objects = [];
		console.log("destroy objects");
	}
		
	destroyBrickObjects() {
		for (var i = 0; i < this.brickObjects.length; i++) {
			this.g.render.mapGraphics(this.sprite);
			this.g.render.removeMech(this.mech);
			this.brickObjects[i].sprite.destroy();
			this.brickObjects[i].mech.destroy();
		}
		this.brickObjects = [];
	}

    isBrick(row, col) {
        return row >= this.rows || col >= this.cols || row < 0 || col < 0 || this.bricks[row][col] > 53;
    }
	
	getBrick(row, col) {
		return this.bricks[row][col];
	}

	// rectangle of a brick
	brickRect(col, row) { 
		return {
			x1: row * Constants.BRICK_WIDTH + this.g.render.mapDx,
			y1: col * Constants.BRICK_HEIGHT + this.g.render.mapDy,
			x2: row * Constants.BRICK_WIDTH + Constants.BRICK_WIDTH + this.g.render.mapDx,
			y2: col * Constants.BRICK_HEIGHT + Constants.BRICK_HEIGHT + this.g.render.mapDy,
		};
	}
	

    getRows() {
        return this.cols;
    }

    getCols() {
        return this.rows;
    }

    getRandomRespawn() {
        return this.respawns[Utils.random(0, respawns.length)];
	}

}