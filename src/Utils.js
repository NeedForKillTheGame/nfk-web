export default {
    trunc: Math.trunc || function (val) {
        return val < 0 ? Math.ceil(val) : Math.floor(val);
    },
	ord(str) {
		return str.charCodeAt(0);
	},

	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	random(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	},
	
	// remove element from document
	removeHtmlElement(elementId) {
		var element = document.getElementById(elementId);
		element.parentNode.removeChild(element);
	},


	// Clear nickname from special symbols
	// Example: 3H^#arpy^5War -> HarpyWar
	filterNickName(name) {
		var newName = "";
		for (var i = 0; i < name.length; i++)
		{
			if (name[i] == '^')
				i++;
			else
				newName += name[i];
		}
		return newName;
	},
	
	
	// first char is string length
	// then read until the length exceed
	getDelphiString(str)
	{
		if (str.length == 0)
			return str;

		var len = str[0].charCodeAt(0); 
		if (len <= str.length - 1)
			str = str.substring(1, len + 1);

		return str;
	},

	
	getImageDimensions(file) {
	  return new Promise (function (resolved, rejected) {
		var i = new Image()
		i.onload = function(){
		  resolved({w: i.width, h: i.height})
		};
		i.src = file
	  })
	},
	
	// check intersection of two rectangles
	// >= means exclude touch of rect borders, only real intersaction
	rectOverlap(a, b) {
		return !(a.x1 >= b.x2 || 
				b.x1 >= a.x2 || 
		        a.y1 >= b.y2 || 
				b.y1 >= a.y2);
	}
};
