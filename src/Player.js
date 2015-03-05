
export default class Player {
    constructor() {

        this.left = 0;
        this.bottom = 0;

        this.velocityX = 0;
        this.velocityY = 0;

        //Current state of pressed keys
        this.keyUp = false;
        this.keyDown = false;
        this.keyLeft = false;
        this.keyRight = false;

        this.crouch = false; //current crouch state

        this.cacheBottomRow = 0;
        this.cacheHeadRow = 0;
        this.cacheLeftCol = 0;
        this.cacheRightCol = 0;

        //Кеширующий флаг - находится ли игрок по вертикали ровно на каком-то брике
        //Проверить это просто: координата игрока по вертикали+1 целочисленно делится на высоту бриков
        //((player.bottom + 1) % BRICK_HEIGHT) === 0
        this.cacheJustOnBrick = false;
    }
}