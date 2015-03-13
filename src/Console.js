document.addEventListener('keydown', function (e) {
    if (e.keyCode === 192) {
        openClose();
        e.preventDefault();
    }
});

var isOpen = false;
var el = document.getElementById('console');
var elContent = document.getElementById('console-content');
var elInput = document.getElementById('console-input');

var html = elContent.innerHTML;
elInput.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        var text = elInput.value.trim();
        Console.writeText(text);
        if (text.indexOf('map ') === 0) {
            document.location.href = "?mapfile=" + text.substring(4);
        } else if (text === 'help') {
            Console.writeText('Available commands:');
            Console.writeText('help');
            Console.writeText('map <mapname>');
        }
        elInput.value = '';
    }
});

function openClose() {
    isOpen = !isOpen;
    if (isOpen) {
        el.classList.add('open');
        elContent.scrollTop = elContent.scrollHeight;
        elInput.value = '';
        elInput.focus();
    } else {
        el.classList.remove('open');
    }
}

function htmlescape(html) {
    return html
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/"/g, '&quot;');
}

var Console = {
    writeText(addText) {
        html += '<br>' + htmlescape(addText);
        if (html.length > 5000) {
            html = html.substring(html.length - 5000);
        }
        elContent.innerHTML = html;
        elContent.scrollTop = elContent.scrollHeight;
    }
};

export default Console;