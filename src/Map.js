//import MapEditor from "./MapEditor.js";
import Constants from "./Constants.js";
import Console from "./Console.js";
import Utils from "./Utils.js";


/*
function parseMapText(mapText) {
    var lines = mapText.replace("\r", '').split("\n");
    rows = lines.length;
    //Determine max cols trough all rows
    for (row = 0; row < rows; row++) {
        if (lines[row] !== undefined && cols < lines[row].length) {
            cols = lines[row].length;
        }
    }
    bricks = [];
    var row, col, char;
    for (row = 0; row < rows; row++) {
        bricks[row] = [];
        for (col = 0; col < cols; col++) {
            if (lines[row] !== undefined || lines[row][col] !== undefined) {
                char = lines[row][col];
            } else {
                char = ' ';
            }
            bricks[row][col] = (char === '0');

            if (char === 'R') {
                respawns.push({row: row, col: col});
            }
        }
    }
}
*/


export default
class Map {
	constructor(g) {
		this.g = g;
		this.rows = 0;
		this.cols = 0;
		this.bricks = [];
		this.respawns = [];
		this.bg = 1; // background id
		
		this.paletteImage = "images/palette.png";
		this.paletteIndex = 6;
		
		this.paletteCustomImage = null;
		this.paletteCustomIndex = 54;
	}
	
	
	async loadFromDemo(demoMap) {
		this.bg = demoMap.Header.BG;
		if (this.bg == 0) 
			this.bg = this.g.config.default_bg; // set default bg if not set
		
		this.loadNFKMap(demoMap.Bricks);
		
		// set palette 
		if (demoMap.PaletteBytes) {
			this.paletteCustomImage = "data:image/png;base64," + demoMap.PaletteBytes;
			await this.g.render.updatePaletteTexture(this.paletteCustomImage);
		}
	}
	
	// bricksData = array of base64 encoded lines with bytes
	loadNFKMap(bricksData) {
		var lines = bricksData; 
		this.rows = lines.length;
		for (var y = 0; y < lines.length; y++)
		{
			this.bricks[y] = [];	
			var line = window.atob(lines[y]);
			this.cols = line.length;
			for (var x = 0; x < line.length; x++)
			{
				var b = Utils.ord(line[x]);
				this.bricks[y][x] = b > 53 ? b : false;
				
				// TODO: add game objects which <= 53
				
				if (b == 34 || b == 35 || b == 36)
					this.respawns.push({row: x, col: y});
			}
		}
	}
	
	/*
	// FIXME: (HarpyWar) change it to load vertically like NFK map
    loadFromQuery() {
        var mapText;
        //loock if any map name is in query string?
        var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        if (queryString.indexOf('maptext=') === 0) {
            mapText = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
            MapEditor.show();
            Console.writeText('map loaded from url');
        }
        else {
            var mapfile;
            if (queryString.indexOf('mapfile=') === 0) {
                mapfile = queryString.substring(8) + '.txt';
            } else {
                mapfile = 'dm2.txt';
            }
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open('GET', 'maps/' + mapfile, false);
            xmlhttp.send(null);
            mapText = xmlhttp.responseText;

            Console.writeText('map loaded: ' + mapfile);
        }

        MapEditor.setContent(mapText);
        parseMapText(mapText);
    },
*/
    isBrick(row, col) {
        return row >= this.rows || col >= this.cols || row < 0 || col < 0 || this.bricks[row][col];
    }
	
	getBrick(row, col) {
		return this.bricks[row][col];
	}
	

    getRows() {
        return this.cols;
    }

    getCols() {
        return this.rows;
    }

    getRandomRespawn() {
        return this.respawns[Utils.random(respawns.length)];
    }
}