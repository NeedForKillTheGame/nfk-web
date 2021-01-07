import PIXI from "PIXI";
import Utils from "./Utils.js";

export default
class Slider extends PIXI.Graphics {

	/*
		callback is a function that called when slider value changed
	*/
	constructor(render, callback, callback_tooltip) {
		super();

		this.color = 0xFE0200; // pink
		this.loadColor = 0xE5E5E6; // white

		this.initWidth = this.width = 451;
		// for mobile device
		if (this.initWidth > window.innerWidth)
			this.initWidth = this.width = window.innerWidth - 50;

		// fill slider border
		this.lineStyle(1, this.color, 1, 0.5, true); 
		this.beginFill(this.color, 0.1);
		this.drawRect(0, 0, this.initWidth, 18);
		this.drawRect(0, 0, 0, 18);

		this.loaded = true;
		// add elapsed area
		this.elapsed = new PIXI.Graphics();
		this.elapsed.beginFill(this.color, 0.8);
		this.elapsed.drawRect(0, 5, 1, 8);
		this.addChild(this.elapsed);
		// the same loading area
		this.elapsedLoading = new PIXI.Graphics();
		this.elapsedLoading.beginFill(this.color, 0.3);
		this.elapsedLoading.drawRect(0, 5, 1, 8);
		this.elapsedLoading.visible = false;
		this.addChild(this.elapsedLoading);

		// add slider button
		this.button = new PIXI.Graphics();
		this.button.beginFill(this.color, 1);
		this.button.drawCircle(9, 9, 6);
		this.addChild(this.button);

		// add tooltip
		this.tooltip = new PIXI.Text("00:00", { fontFamily : 'Arial', fontSize: 12, fill : 'white', align : 'center' });
		this.tooltip.anchor = new PIXI.Point(0.5, 0.5);
		this.tooltip.x = 0;
		this.tooltip.y = -10;
		this.tooltip.visible = false;
		this.addChild(this.tooltip);

		// add frame counter
		this.counter = new PIXI.Text("0", { fontFamily : 'Arial', fontSize: 12, fill : 'white', align : 'center' });
		this.counter.x = this.width + 6;
		this.counter.y = 2;
		this.addChild(this.counter);

		// init
		this.resize(render);


		// properties
		this.initHeight = this.height;
		this.value = 0;
		this.minValue = 0;
		this.setMaxValue(10); // init
		this.callback = callback;
		this.callback_tooltip = callback_tooltip;
	}

    /**
     * Show object
     * @param {boolean} alpha - set alpha to 1
     */
    show(alpha = false){
        this.visible = true
        alpha && (this.alpha = 1)
        return this
	}


	onmousedown(e) {
		if ( this.onmousebounds(e) ) {
			this.mousedown = true;
			//console.log("slider mousedown");
			if (this.onmousebounds_button(e)) {
				this.mousedown_button = true;
				//console.log("button mousedown");
			}
			this.onmousemove(e);
			return true;
		}
		return false;
	}
	onmouseup(e) {
		if (this.mousedown) {
			this.mousedown = false;
			this.mousedown_button = false;
			//console.log("slider mouseup");
			return true;
		}
		return false;
	}
	onmousemove(e) {
		// support touch from mobile devices
		if (e.changedTouches) {
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				e.clientX = touches[i].pageX;
				e.clientY = touches[i].pageY;
			}
		}

		// show tooltip
		if ( this.onmousebounds(e)  ) {
			var new_val = this._getValueFromAbsX(e.clientX - this.button.width / 2);
			this.setTooltip(this.callback_tooltip(new_val));

			this.tooltip.visible = true;
			this.tooltip.x = e.clientX - this.x;
		} else {
			this.tooltip.visible = false;
		}

		//console.log(e);
		if (this.mousedown) {
			var new_x = e.clientX - this.button.width / 2;

			this.setValue(this._getValueFromAbsX(new_x));

			//console.log("slider move", new_x);
			return true;
		}
		return false;
	}

	/* check is mouse cursor hover on the slider area */
	onmousebounds(e) {
		// support touch from mobile devices
		if (e.changedTouches) {
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				e.clientX = touches[i].pageX;
				e.clientY = touches[i].pageY;
			}
		}

		//console.log("slider coords", this.x, this.y, this.width, this.height);
		if (e.clientX >= this.x &&
			e.clientX <= this.x + this.initWidth &&
			e.clientY >= this.y &&
			e.clientY <= this.y + this.initHeight) {
				return true;
			}
			return false;
	}

	/* check is mouse cursor hover on the slider button */
	onmousebounds_button(e) {
		// support touch from mobile devices
		if (e.changedTouches) {
			var touches = e.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				e.clientX = touches[i].pageX;
				e.clientY = touches[i].pageY;
			}
		}

		//console.log("slider button coords", this.button.x, this.button.y, this.button.width, this.button.height);
		if (e.clientX >= this.x + this.button.x &&
			e.clientX <= this.x + this.button.x + this.button.width &&
			e.clientY >= this.y + this.button.y &&
			e.clientY <= this.y + this.button.y + this.button.height) {
				return true;
			}
			return false;
	}

	setMaxValue(val) {
		this.interval = this.initWidth / val; // slider step interval
		console.log("slider interval", this.interval);
	}



	setValue(val) {
		if (val <= this.minValue)
			val = this.minValue;
		if (val > this.maxValue)
			val = this.maxValue;
		if (this.value == val)
			return;
			
		this.value = val;
		this.onChange();
	}
	
	getValue() {
		return this.value;
	}

	setTooltip(val) {
		this.tooltip.text = val;
	}
	getTooltip() {
		return this.tooltip.text;
	}

	/* on slider change event */
	onChange() {
		// set new x for slider button
		var new_x = this.getValue() * this.interval;
		// fix bounds if move outer
		if (new_x > this.initWidth - this.button.width)
			new_x = this.initWidth - this.button.width;
		this.button.x = new_x;
		this.elapsed.width = this.button.x + this.button.width / 2;

		// update counter
		this.counter.text = this.getValue();

		//console.log("slider value", this.getValue());
		if (this.callback)
			this.callback(this.getValue());
		this.setLoaded(false);
	}

	/* calc value from button coords */
	_getValueFromAbsX(new_x) {
		if (new_x < this.x)
			new_x = this.x;
		if (new_x > this.x + this.initWidth - this.button.width)
			new_x = this.x + this.initWidth - this.button.width;
		// exclude slider x pos
		new_x -= this.x + 1;
		
		return Math.round(new_x / this.interval);
	}

	setLoaded(val) {
		if (val && !this.loaded) {
			//console.log("complete");
			this.loaded = true;
			this.elapsedLoading.visible = false;
			this.elapsed.visible = true;
		}
		if (!val && this.loaded) {
			//console.log("loading");
			this.loaded = false;
			this.elapsedLoading.width = this.elapsed.width;
			this.elapsedLoading.visible = true;
			this.elapsed.visible = false;
		}
	}

	getLoaded() {
		return this.loaded;
	}

	resize(render) {
		this.x = render.app.view.width / 2 - this.width/2;
		this.y = render.app.view.height - 40;
	}
}