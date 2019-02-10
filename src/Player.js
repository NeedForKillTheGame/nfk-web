import Map from "./Map.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";
import PlayerGraphics from "./PlayerGraphics.js";
import PlayerPhysics from "./Physics.js";


export default
class Player {
    constructor(g, DXID, name) {
		this.g = g;
		this.stage = g.render.stage;
		this.map = g.map;


		this.DXID = DXID;
        this.x = 0.0;
        this.y = 0.0;
		
        this.name = name;
        this.displayName = Utils.filterNickName(name); // filtered name
        this.health = 0;
        this.armor = 0;
		
		this.follow = false;
		
        this.velocityX = 0.0;
        this.velocityY = 0.0;
		
        this.crouch = false; //current crouch state
		this.dir = 0; // direction
		this.dead = 0; // 0-2
		this.weapon = 0; // 0-7
		this.BALLOON = false; // ???
		this.team = 0;
		this.model = 'sarge'; // TODO: make allow model change and if not found then use sarge
		
		this.rewardtime = 0; //?
		this.fangle = 0; // angle of weapon
		
		
		this.ammo_mg = 100; 
		this.ammo_sg = 0; 
		this.ammo_gl = 0; 
		this.ammo_rl = 0; 
		this.ammo_sh = 0; 
		this.ammo_rg = 0; 
		this.ammo_pl = 0; 
		this.ammo_bfg = 0;
		
        //Current state of pressed keys
        this.keyUp = false;
        this.keyDown = false;
        this.keyLeft = false;
        this.keyRight = false;


        this.doublejumpCountdown = 0;

        this.cacheOnGround = false;
        this.cacheBrickOnHead = false;
        this.cacheBrickCrouchOnHead = false;

        this.speedJump = 0;
		
		this.graphics = null;		
		this.physics = null;	


		this._init();
    }

	// init player graphics and physics
	_init()
	{
			this.graphics = new PlayerGraphics(this.g, this);
			this.physics = new PlayerPhysics(this.g, this);
	}
	

	height() {
		return this.crouch ? Constants.PLAYER_HEIGHT_CROUCH: Constants.PLAYER_HEIGHT;
	}
	width() {
		return Constants.PLAYER_WIDTH;
	}
	
	// player rectangle
	rect() {
		return {
			x1: this.x - (this.width() / 2)  + this.g.render.mapDx,
			y1: this.y - (this.height() / 2) + this.g.render.mapDy,
			x2: this.x + (this.width() / 2)  + this.g.render.mapDx,
			y2: this.y + (this.height() / 2) + this.g.render.mapDy,
		};
	}

		
	addHealth(val, max) {
		this.health += val;
		if (this.health > max)
			this.health = max;
		if (this.health <= 0)
			this.dead = 1;
	}		
	addArmor(val) {
		this.admor += val;
		if (this.admor > 200)
			this.admor = 200;
	}
	
	addWeapon(weaponId) {
		
	}
	
	addWeaponAmmo(ammoId, amount) {
		
	}
	
	
	
	changeTeam(team){
		console.log("player " + this.name + " selected team " + team);
		this.team = team;
		
		var color = team == 0 ? 'r' : 'b';
		this.graphics.setModel(this.model, color, 'w');
	}
	
    setX(newX) {
        if (newX != this.x) {
            this.x = newX;
            this.updateCaches();
        }
    }

    setY(newY) {
        if (newY != this.y) {
            this.y = newY;
            this.updateCaches();
        }
    }

    setXY(newX, newY) {
        if (newX !== this.x || newY !== this.y) {
            this.x = newX;
            this.y = newY;
            this.updateCaches();
        }
    }

    updateCaches() {
        this.updateCacheOnGround();
        this.updateCacheBrickOnHead();
        this.updateCacheBrickCrouchOnHead();
    }

    updateCacheOnGround() {
        this.cacheOnGround =
            this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y + 25) / 16))
            && !this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y + 23) / 16))

            || this.map.isBrick(Utils.trunc(Utils.trunc(this.x + 9) / 32), Utils.trunc(Utils.trunc(this.y + 25) / 16))
            && !this.map.isBrick(Utils.trunc(Utils.trunc(this.x + 9) / 32), Utils.trunc(Utils.trunc(this.y + 23) / 16))

            || this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y + 24) / 16))
            && !this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y + 8) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y + 24) / 16))
            && !this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y + 8) / 16));
    }

    updateCacheBrickCrouchOnHead() {
        this.cacheBrickCrouchOnHead =
            this.map.isBrick(Utils.trunc((this.x - 8) / 32), Utils.trunc((this.y - 9) / 16))
            && !this.map.isBrick(Utils.trunc((this.x - 8) / 32), Utils.trunc((this.y - 7) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 8) / 32), Utils.trunc((this.y - 9) / 16))
            && !this.map.isBrick(Utils.trunc((this.x + 8) / 32), Utils.trunc((this.y - 7) / 16))

            || this.map.isBrick(Utils.trunc((this.x - 8) / 32), Utils.trunc((this.y - 23) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 8) / 32), Utils.trunc((this.y - 23) / 16))

            || this.map.isBrick(Utils.trunc((this.x - 8) / 32), Utils.trunc((this.y - 16) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 8) / 32), Utils.trunc((this.y - 16) / 16));
    }

    updateCacheBrickOnHead() {
        this.cacheBrickOnHead =
            this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y - 25) / 16))
            && !this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y - 23) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y - 25) / 16))
            && !this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y - 23) / 16))

            || this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y - 24) / 16))
            && !this.map.isBrick(Utils.trunc((this.x - 9) / 32), Utils.trunc((this.y - 8) / 16))

            || this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y - 24) / 16))
            && !this.map.isBrick(Utils.trunc((this.x + 9) / 32), Utils.trunc((this.y - 8) / 16));
    }

    isOnGround() {
        return this.cacheOnGround;
    }

    isBrickOnHead() {
        return this.cacheBrickOnHead;
    }

    isBrickCrouchOnHead() {
        return this.cacheBrickCrouchOnHead;
    }
	
	destroy() {
		this.graphics.destroy();
	}
}