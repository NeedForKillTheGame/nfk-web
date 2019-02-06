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
	
	getDelphiString(str)
	{
		if (str.length == 0)
			return str;

		// first char is string length
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
	}
};
