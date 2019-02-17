import Map from "./Map.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";
import PlayerGraphics from "./PlayerGraphics.js";
import PlayerPhysics from "./Physics.js";
import Sound from "./Sound.js";
import WeaponGauntlet from "./objects/WeaponGauntlet.js";
import WeaponMachine from "./objects/WeaponMachine.js";
import WeaponShotgun from "./objects/WeaponShotgun.js";
import WeaponGrenade from "./objects/WeaponGrenade.js";
import WeaponRocket from "./objects/WeaponRocket.js";
import WeaponShaft from "./objects/WeaponShaft.js";
import WeaponRail from "./objects/WeaponRail.js";
import WeaponPlasma from "./objects/WeaponPlasma.js";
import WeaponBfg from "./objects/WeaponBfg.js";

export default
class Player {
    constructor(g, DXID, name) {
		this.g = g;
		this.stage = g.render.stage;
		this.map = g.map; // Map obj


		this.DXID = DXID;
        this.x = 0.0;
        this.y = 0.0;
		
        this.name = name;
        this.displayName = Utils.filterNickName(name); // filtered name (without color codes)
        this.health = 0;
        this.armor = 0;
        this.frags = 0;
        this.ping = '0';
		
		this.follow = false; // follow camera
		
        this.velocityX = 0.0;
        this.velocityY = 0.0;
        
        this.crouch = false; //current crouch state
		this.dir = Constants.DIR_RS; // direction
		this.dead = 0; // 0 = alive, 1 or 2 = dead
		this.BALLOON = false; // FIXME: what's this ???
		this.team = Constants.C_TEAMNON;
		this.model = 'sarge'; // // use setModel() for change
        this.modelColor = 'default';
        
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
		
		this.graphics = null; // PlayerGraphics	obj	
		this.physics = null; // PlayerPhysics obj	

        this.flag = null; // if true then player takes enemy flag

        // init graphics, physics
        this._init();

        this.powerups = []; // taken powerups
        
        this.weapons = [
            new WeaponGauntlet(this.g, this),
            new WeaponMachine(this.g, this),
            new WeaponShotgun(this.g, this),
            new WeaponGrenade(this.g, this),
            new WeaponRocket(this.g, this),
            new WeaponShaft(this.g, this),
            new WeaponRail(this.g, this),
            new WeaponPlasma(this.g, this),
            new WeaponBfg(this.g, this)
        ];
		this.weapon = this.weapons[0]; // set machine default
        for (var w in this.weapons) {
            this.weapons[w].spawn();
        }
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
			y1: this.y - (this.height() / 2) + this.g.render.mapDy + 1 + (this.crouch ? Constants.BRICK_HEIGHT / 2 : 0),
			x2: this.x + (this.width() / 2)  + this.g.render.mapDx,
			y2: this.y + (this.height() / 2) + this.g.render.mapDy + 1 + (this.crouch ? Constants.BRICK_HEIGHT / 2 : 0),
		};
	}

    setModel(model, color) {
        this.model = model;
        this.modelColor = color;
        // set defaults if not found
        if (!this.graphics.animations[this.model]) {
            this.model = 'sarge';
            console.log("reset model (model not found " + model + ")");
        }
        if (!this.graphics.animations[this.model][this.modelColor]) {
            this.modelColor = 'default';
            console.log("reset color (model not found " + model + "+" + color + ")");
        }
        this.graphics.updateModel();
    }
		
	addHealth(val, max) {
		this.health += val;
		if (this.health > max)
			this.health = max;
		if (this.health <= 0)
			this.setDead(1);
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
	setWeapon(weaponId) {
        // TODO: switch weapon only if exists
        for (var w in this.weapons) {
            this.weapons[w].hide();
        }
        this.weapon = this.weapons[weaponId];
        if (this.dead == 0) {
            this.weapon.show();
        }
    }
	
    setCrouch(val) {
        if (this.crouch == val)
            return;

        this.crouch = val;
        this.graphics.updateModel();
    }
    setDead(val) {
        if (this.dead == val)
            return;

        this.dead = val;
        this.graphics.updateModel();
        
        if (this.dead > 0) {
            Sound.playDeath(this);
            // hide weapon
            this.weapon.hide();
        }
        // drop flag
        if (this.flag) {
            this.flag.setY(this.flag.rect().y + 16); // TODO: make flag physics instead of this, so it can move onto the floor itself
            this.flag = null;
        }
        // clear powerups
        this.powerups = [];
    }

	changeTeam(team){
		console.log("player " + this.name + " selected team " + team);
		this.team = team;
        
        this.setModel(this.model, team == Constants.C_TEAMRED 
            ? 'red'
            : team == Constants.C_TEAMBLUE
                ? 'blue'
                : Constants.C_TEAMNON);
		this.graphics.updateModel();
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

    jump() {
        // TODO: move code to jump here
        Sound.playModel(this.model, 'jump');
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