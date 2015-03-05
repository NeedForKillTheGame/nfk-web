import Howl from "Howl";

var jump = new Howl({
    urls: ['sounds/jump1.wav']
});

export default {
    jump() {
        jump.play();
    }
}