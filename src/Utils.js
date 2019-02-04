export default {
    trunc: Math.trunc || function (val) {
        return val < 0 ? Math.ceil(val) : Math.floor(val);
    },
	ord(str) {
		return str.charCodeAt(0);
	},
	// return random from 0 to max-1
	random(max) {
		return Math.floor(Math.random() * max);
	},
	
	
};
