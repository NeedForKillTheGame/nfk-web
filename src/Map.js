import MapEditor from "./MapEditor.js";
import Constants from "./Constants.js";

var bricks = [];
var respawns = [];

function parseMapText(mapText) {
    var lines = mapText.split("\n");
    bricks = [];
    var row, col, char;
    for (row = 0; row < Constants.MAP_ROWS; row++) {
        bricks[row] = [];
        for (col = 0; col < Constants.MAP_COLS; col++) {
            if (typeof lines[row] !== "undefined" || typeof lines[row][col] !== "undefined") {
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

export default {
    loadFromQuery() {
        var mapText;
        //loock if any map name is in query string?
        var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
        if (queryString.indexOf('maptext=') === 0) {
            mapText = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
            MapEditor.show();
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
        }

        MapEditor.setContent(mapText);
        parseMapText(mapText);
    },

    isBrick(row, col) {
        return bricks[row][col];
    },

    getRandomRespawn() {
        return respawns[Math.floor(Math.random() * respawns.length)];
    }
}