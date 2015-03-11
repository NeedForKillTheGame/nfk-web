var mapEditorForm = document.getElementById('mapeditor');
var showMapEditorLink = document.getElementById('mapeditor-link');
var maptextarea = document.getElementById('maptext');
var showurl = document.getElementById('shorturl');
showMapEditorLink.addEventListener('click', e => {e.preventDefault(); MapEditor.show()});

document.getElementById('short-link').addEventListener('click', e=> {
    e.preventDefault();
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'map.php?maptext=' + encodeURIComponent(maptextarea.value), false);
    xmlhttp.send(null);
    showurl.value = 'http://nfk.pqr.su/game/map.php?mapid=' + xmlhttp.responseText;
});

var MapEditor = {
    show() {
        mapEditorForm.style.display = "block";
        showMapEditorLink.style.display = "none";

    },

    setContent(maptext) {
        maptextarea.value = maptext;
    }
};

export default MapEditor;