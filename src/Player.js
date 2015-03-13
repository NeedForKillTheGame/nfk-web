import Map from "./Map.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";

var isBrick = Map.isBrick;
var trunc = Utils.trunc;

export default
class Player {
    constructor() {

        this.x = 0.0;
        this.y = 0.0;

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
            isBrick(trunc((this.x - 9) / 32), trunc((this.y + 25) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y + 23) / 16))

            || isBrick(trunc(trunc(this.x + 9) / 32), trunc(trunc(this.y + 25) / 16))
            && !isBrick(trunc(trunc(this.x + 9) / 32), trunc(trunc(this.y + 23) / 16))

            || isBrick(trunc((this.x - 9) / 32), trunc((this.y + 24) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y + 8) / 16))

            || isBrick(trunc((this.x + 9) / 32), trunc((this.y + 24) / 16))
            && !isBrick(trunc((this.x + 9) / 32), trunc((this.y + 8) / 16));
    }

    updateCacheBrickCrouchOnHead() {
        this.cacheBrickCrouchOnHead =
            isBrick(trunc((this.x - 8) / 32), trunc((this.y - 9) / 16))
            && !isBrick(trunc((this.x - 8) / 32), trunc((this.y - 7) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 9) / 16))
            && !isBrick(trunc((this.x + 8) / 32), trunc((this.y - 7) / 16))

            || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 16) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 16) / 16));
    }

    updateCacheBrickOnHead() {
        this.cacheBrickOnHead =
            isBrick(trunc((this.x - 9) / 32), trunc((this.y - 25) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 25) / 16))
            && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x - 9) / 32), trunc((this.y - 24) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 8) / 16))

            || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 24) / 16))
            && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 8) / 16));
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
}