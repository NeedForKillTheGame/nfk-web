import Map from "./Map.js";
import Utils from "./Utils.js";
import Constants from "./Constants.js";

var isBrick = Map.isBrick;

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
        this.cacheOnGround = isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getBottomBorderRow(this.y + 25)) && !isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getBottomBorderRow(this.y + 23))
        || isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getBottomBorderRow(this.y + 25)) && !isBrick(Utils.getLeftBorderCol(this.x + 9), Utils.getBottomBorderRow(this.y + 23))
        || isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getBottomBorderRow(this.y + 24)) && !isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getBottomBorderRow(this.y + 8))
        || isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getBottomBorderRow(this.y + 24)) && !isBrick(Utils.getLeftBorderCol(this.x + 9), Utils.getBottomBorderRow(this.y + 8));
    }

    updateCacheBrickCrouchOnHead() {
        this.cacheBrickCrouchOnHead = isBrick(Utils.getLeftBorderCol(this.x - 8), Utils.getTopBorderRow(this.y - 9)) && !isBrick(Utils.getLeftBorderCol(this.x - 8), Utils.getTopBorderRow(this.y - 7))
        || isBrick(Utils.getRightBorderCol(this.x + 8), Utils.getTopBorderRow(this.y - 9)) && !isBrick(Utils.getLeftBorderCol(this.x + 8), Utils.getTopBorderRow(this.y - 7))
        || isBrick(Utils.getLeftBorderCol(this.x - 8), Utils.getTopBorderRow(this.y - 23))
        || isBrick(Utils.getRightBorderCol(this.x + 8), Utils.getTopBorderRow(this.y - 23))
        || isBrick(Utils.getLeftBorderCol(this.x - 8), Utils.getTopBorderRow(this.y - 16))
        || isBrick(Utils.getRightBorderCol(this.x + 8), Utils.getTopBorderRow(this.y - 16));
    }

    updateCacheBrickOnHead() {
        this.cacheBrickOnHead = isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getTopBorderRow(this.y - 25)) && !isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getTopBorderRow(this.y - 23))
        || isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getTopBorderRow(this.y - 25)) && !isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getTopBorderRow(this.y - 23))
        || isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getTopBorderRow(this.y - 24)) && !isBrick(Utils.getLeftBorderCol(this.x - 9), Utils.getTopBorderRow(this.y - 8))
        || isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getTopBorderRow(this.y - 24)) && !isBrick(Utils.getRightBorderCol(this.x + 9), Utils.getTopBorderRow(this.y - 8));
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