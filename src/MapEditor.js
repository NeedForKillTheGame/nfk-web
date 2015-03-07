var mapEditorForm = document.getElementById('mapeditor');
var showMapEditorLink = document.getElementById('mapeditor-link');
showMapEditorLink.addEventListener('click', e => {e.preventDefault(); MapEditor.show()});

var MapEditor = {
    show() {
        mapEditorForm.style.display = "block";
        showMapEditorLink.style.display = "none";

    },

    setContent(maptext) {
        document.getElementById('maptext').innerHTML = maptext;
    }
};

export default MapEditor;