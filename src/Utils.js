export default {
    trunc: Math.trunc || function (val) {
        return val < 0 ? Math.ceil(val) : Math.floor(val);
    },

    //Delphi Round(): x87 rounds halves to the nearest even integer (2.5 -> 2, 3.5 -> 4), Math.round() rounds them up
    round: function (val) {
        var rounded = Math.round(val);
        return (rounded - val === 0.5 && rounded % 2 !== 0) ? rounded - 1 : rounded;
    }
};
