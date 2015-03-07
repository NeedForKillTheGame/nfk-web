import Constants from "./Constants.js";

//Вынесем константы из объекта Constants в отедельные константы, чтобы не писать везде Constants.<название_константы>
const BRICK_WIDTH = Constants.BRICK_WIDTH;
const BRICK_HEIGHT = Constants.BRICK_HEIGHT;

export default {

    /**
     * Возвращает номер колонки бриков (считая от 0) внутри которой находится координата X левого края игрока
     * @param {number} x координата левого края игрока
     * @returns {number} номер колонки бриков (считая от 0)
     */
    getLeftBorderCol(x) {
        return Math.floor(x / BRICK_WIDTH);
    },

    /**
     * Возвращает номер колонки бриков (считая от 0) внутри которой находится координата X правого края игрока
     * @param {number} x правого края игрока
     * @returns {number} номер колонки бриков (считая от 0)
     */
    getRightBorderCol(x) {
        return Math.ceil(x / BRICK_WIDTH) - 1;
    },

    /**
     * Возвращает номер строки бриков (считая от 0) внутри которой находится координата Y верхнего края игрока
     * @param {number} y верхнего края игрока
     * @returns {number} номер строки бриков (считая от 0)
     */
    getTopBorderRow(y) {
        return Math.floor(y / BRICK_HEIGHT);
    },

    /**
     * Возвращает номер строки бриков (считая от 0) внутри которой находится координата Y верхнего края игрока
     * @param {number} y верхнего края игрока
     * @returns {number} номер строки бриков (считая от 0)
     */
    getBottomBorderRow(y) {
        return Math.ceil(y / BRICK_HEIGHT) - 1;
    },

    /**
     * Возвращает нижнюю границу (координату Y) указанной строки бриков
     * @param {number} row строка бриков считая от 0
     * @returns {number}
     */
    getBottomBorder(row) {
        return row * BRICK_HEIGHT + BRICK_HEIGHT;
    },

    /**
     * Возвращает левую границу (координата X) указанной колонки бриков
     * @param {number} col колонка бриков считая от 0
     * @returns {number}
     */
    getLeftBorder(col) {
        return col * BRICK_WIDTH;
    },

    /**
     * Возвращает левую границу (координата X) указанной колонки бриков
     * @param {number} col колонка бриков считая от 0
     * @returns {number}
     */
    getRightBorder(col) {
        return col * BRICK_WIDTH + BRICK_WIDTH;
    },

    /**
     * Метод возвращает true, если по вертикали игрок расположился ровно по стеке бриков
     * @param {number} bottom координата по Y нижнего края игрока
     * @returns {boolean}
     */
    getPlayerJustOnBrick(bottom) {
        return bottom % BRICK_HEIGHT === 0;
    },

    /**
     * Возвращает номеро строки в бриках (считая от 0), внутри которой находится верхний край игрока (голова)
     * @param {number} bottom координата нижней границы игрока по Y
     * @param {boolean} crouch приседает или игрок? (от этого зависит его высота, следовательно зависит и top row)
     * @returns {number}
     */
    getPlayerTopRow(bottom, crouch) {
        return this.getTopBorderRow(bottom - (crouch ? 2 : 3) * BRICK_HEIGHT);
    }
};
