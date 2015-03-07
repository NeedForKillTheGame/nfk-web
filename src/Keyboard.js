var keysState = {
    keyUp: false,
    keyDown: false,
    keyLeft: false,
    keyRight: false
};

document.addEventListener('keydown', e => {
    if (e.keyCode < 37 || e.keyCode > 40) {
        return;
    }

    if (e.target.nodeName.toLowerCase() !== 'textarea') {
        e.preventDefault();
        switch (e.keyCode) {
            case 38:
                keysState.keyUp = true;
                break;

            case 37:
                keysState.keyLeft = true;
                break;

            case 39:
                keysState.keyRight = true;
                break;

            case 40:
                keysState.keyDown = true;
                break;
        }
    }
});

document.addEventListener('keyup', e => {
    if (e.keyCode < 37 || e.keyCode > 40) {
        return;
    }

    if (e.target.nodeName.toLowerCase() !== 'textarea') {
        e.preventDefault();
        switch (e.keyCode) {
            case 38:
                keysState.keyUp = false;
                break;

            case 37:
                keysState.keyLeft = false;
                break;

            case 39:
                keysState.keyRight = false;
                break;

            case 40:
                keysState.keyDown = false;
                break;
        }
    }
});

export default keysState;
