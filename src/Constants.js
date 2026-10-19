export default {

    BRICK_WIDTH: 32,
    BRICK_HEIGHT: 16,

    PLAYER_MAX_VELOCITY_X: 3,

    //NFK runs its game logic and physics at a fixed 50 FPS (TPowerTimer.FPS = 50)
    PHYSICS_FRAME_MS: 20,

    //TPlayer.dir: 0/1 - walking left/right, 2/3 - standing left/right
    DIR_LW: 0,
    DIR_RW: 1,
    DIR_LS: 2,
    DIR_RS: 3
};
