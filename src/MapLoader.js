import * as MapEditor from "./MapEditor.js";
import Constants from "./Constants.js";

function parseMapText(mapText) {
    var lines = mapText.split("\n");
    var mapBreaks = [], row, col;
    for (row = 0; row < Constants.MAP_ROWS; row++) {
        mapBreaks[row] = [];
        for (col = 0; col < Constants.MAP_COLS; col++) {
            mapBreaks[row][col] = !(typeof lines[row] === "undefined" || typeof lines[row][col] === "undefined" || lines[row][col] === ' ');
        }
    }

    return mapBreaks;
}

export function loadMapFromQuery() {
    var mapText;
    //loock if any map name is in query string?
    var queryString = window.location.href.slice(window.location.href.indexOf('?') + 1);
    if (queryString.indexOf('maptext=') === 0) {
        mapText = decodeURIComponent(queryString.substring(8)).replace(/\+/g, ' ');
        MapEditor.showMapEditor();
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

    MapEditor.setMapEditorContent(mapText);

    return parseMapText(mapText);
}