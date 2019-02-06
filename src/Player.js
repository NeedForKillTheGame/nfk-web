import Map from "./Map.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";
import PlayerGraphics from "./PlayerGraphics.js";
import PlayerPhysics from "./Physics.js";


export default
class Player {
    constructor(DXID, name, g) {
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

        //Current state of pressed keys
        this.keyUp = false;
        this.keyDown = false;
        this.keyLeft = false;
        this.keyRight = false;

        this.crouch = false; //current crouch state

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
			this.graphics = new PlayerGraphics(this.stage, this);
			this.physics = new PlayerPhysics(this, this.map);
	}
	
	isDead() {
		return this.health <= 0;
	}
	
	height() {
		return Constants.BRICK_HEIGHT * (this.crouch ? 2 : 3);
	}
	width() {
		return Constants.PLAYER_WIDTH;
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