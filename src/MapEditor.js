var mapEditorForm = document.getElementById('mapeditor');
var showMapEditorLink = document.getElementById('mapeditor-link');
showMapEditorLink.addEventListener('click', e => {e.preventDefault(); showMapEditor()});

export function showMapEditor() {
    mapEditorForm.style.display = "block";
    showMapEditorLink.style.display = "none";

}

export function setMapEditorContent(maptext) {
    document.getElementById('maptext').innerHTML = maptext;
}


