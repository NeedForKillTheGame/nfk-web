var keysState = {
    keyUp: false,
    keyDown: false,
    keyLeft: false,
    keyRight: false,
    keyTab: false,

    onKeyUp: function(keyCode, callback) {
        callbacks.push({ event: 'keyup', keyCode: keyCode, f: callback });
    }
};

var callbacks = [];

document.addEventListener('keydown', e => {
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
                
            case 9:
                keysState.keyTab = true;
                break;
        }

        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i].event == 'keydown' && e.keyCode == callbacks[i].keyCode) {
                callbacks[i].f();
            }
        }
    }
});

document.addEventListener('keyup', e => {
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
                
            case 9:
                keysState.keyTab = false;
                break;
        }

        for (var i = 0; i < callbacks.length; i++) {
            if (callbacks[i].event == 'keyup' && e.keyCode == callbacks[i].keyCode) {
                callbacks[i].f();
            }
        }
    }
});

export default keysState;
