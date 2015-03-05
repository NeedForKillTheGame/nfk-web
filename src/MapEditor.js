var mapEditorForm = document.getElementById('mapeditor');
var showMapEditorLink = document.getElementById('mapeditor-link');
showMapEditorLink.addEventListener('click', e => {e.preventDefault(); showMapEditor()});

export default {
    show() {
        mapEditorForm.style.display = "block";
        showMapEditorLink.style.display = "none";

    },

    setContent(maptext) {
        document.getElementById('maptext').innerHTML = maptext;
    }
}