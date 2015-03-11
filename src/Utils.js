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
    }
};
