export default {
    trunc: Math.trunc || function (val) {
        return val < 0 ? Math.ceil(val) : Math.floor(val);
    }
};
