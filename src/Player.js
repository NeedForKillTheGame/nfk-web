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

        this.velocityX = 0.0; //TPlayer.InertiaX
        this.velocityY = 0.0; //TPlayer.InertiaY

        //Current state of pressed keys
        this.keyUp = false;
        this.keyDown = false;
        this.keyLeft = false;
        this.keyRight = false;

        this.crouch = false; //current crouch state
        this.dir = Constants.DIR_RS; //walking (0, 1) or standing (2, 3) to the left/right, set by the keys of the previous frame
        this.dead = 0;

        this.doublejumpCountdown = 0;

        this.groundTicks = 0; //TPlayer.field_358: frames on the ground since landing, 255 right after a jump
        this.speedJump = 0;   //TPlayer.field_359: strafe-jump charge 0..6
    }

    setX(newX) {
        this.x = newX;
    }

    setY(newY) {
        this.y = newY;
    }

    setXY(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    //The brick checks below are evaluated on every call with the current coordinates, exactly like
    //IsOnground(), BrickOnHead() and BrickCrouchOnHead() in NFK

    isOnGround() {
        var z = this.dead > 0 ? 0 : 9; //corpses do not stick to walls
        return isBrick(trunc((this.x - z) / 32), trunc((this.y + 25) / 16))
            && !isBrick(trunc((this.x - z) / 32), trunc((this.y + 23) / 16))

            || isBrick(trunc((this.x + z) / 32), trunc((this.y + 25) / 16))
            && !isBrick(trunc((this.x + z) / 32), trunc((this.y + 23) / 16))

            || isBrick(trunc((this.x - z) / 32), trunc((this.y + 24) / 16))
            && !isBrick(trunc((this.x - z) / 32), trunc((this.y + 8) / 16))

            || isBrick(trunc((this.x + z) / 32), trunc((this.y + 24) / 16))
            && !isBrick(trunc((this.x + z) / 32), trunc((this.y + 8) / 16));
    }

    isBrickOnHead() {
        return isBrick(trunc((this.x - 9) / 32), trunc((this.y - 25) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 25) / 16))
            && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x - 9) / 32), trunc((this.y - 24) / 16))
            && !isBrick(trunc((this.x - 9) / 32), trunc((this.y - 8) / 16))

            || isBrick(trunc((this.x + 9) / 32), trunc((this.y - 24) / 16))
            && !isBrick(trunc((this.x + 9) / 32), trunc((this.y - 8) / 16));
    }

    isBrickCrouchOnHead() {
        return isBrick(trunc((this.x - 8) / 32), trunc((this.y - 9) / 16))
            && !isBrick(trunc((this.x - 8) / 32), trunc((this.y - 7) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 9) / 16))
            && !isBrick(trunc((this.x + 8) / 32), trunc((this.y - 7) / 16))

            || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 23) / 16))

            || isBrick(trunc((this.x - 8) / 32), trunc((this.y - 16) / 16))

            || isBrick(trunc((this.x + 8) / 32), trunc((this.y - 16) / 16));
    }
}
