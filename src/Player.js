export default class Player {
    constructor() {

        this.x = 0;
        this.y = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        //Current state of pressed keys
        this.keyUp = false;
        this.keyDown = false;
        this.keyLeft = false;
        this.keyRight = false;

        this.crouch = false; //current crouch state
        this.dir = 3; //0 - look left and keyLeft pressed; 1 - look right and keyRight pressed, 2 - just look left, 3 - just look right

        this.doublejumpCountdown = 0;

    }
}