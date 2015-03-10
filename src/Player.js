import Utils from "./Utils.js";
import Constants from "./Constants.js";

const PLAYER_WIDTH = Constants.PLAYER_WIDTH;

export default class Player {
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

        this.cacheBottomRow = 0;
        this.cacheTopRow = 0;
        this.cacheLeftCol = 0;
        this.cacheRightCol = 0;

        //Кеширующий флаг - находится ли игрок по вертикали ровно на каком-то брике
        //Проверить это просто: координата игрока по вертикали+1 целочисленно делится на высоту бриков
        //((player.bottom + 1) % BRICK_HEIGHT) === 0
        this.cacheJustOnBrick = false;

        this.cacheBlockedBottom = false;
        this.cacheBlockedTop = false;
        this.cacheBlockedLeft = false;
        this.cacheBlockedRight = false;
    }

    setLeft(newLeft) {
        if (newLeft !== this.left) {
            this.left = newLeft;
            this.cacheLeftCol = Utils.getLeftBorderCol(newLeft);
            this.cacheRightCol = Utils.getRightBorderCol(newLeft + PLAYER_WIDTH);
        }
    }

    setBottom(newBottom) {
        if (newBottom !== this.bottom) {
            this.bottom = newBottom;
            this.cacheJustOnBrick = Utils.getPlayerJustOnBrick(newBottom);
            this.cacheBottomRow = Utils.getBottomBorderRow(newBottom);
            this.cacheTopRow = Utils.getPlayerTopRow(newBottom, this.crouch);
        }
    }

    setCrouch(newCrouch) {
        if (newCrouch !== this.crouch) {
            this.crouch = newCrouch;
            this.cacheTopRow = Utils.getPlayerTopRow(this.bottom, newCrouch);
        }
    }
}