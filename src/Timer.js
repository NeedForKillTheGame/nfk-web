
export default
class Timer {
	constructor(id, tickInterval, stopAfter, callback) {
		this.id = id; // timer identifier
		this.tickInterval = tickInterval;
		this.stopAfter = stopAfter;
		this.callback = callback;

		this.stop();
	}

	start() {
		this.enabled = true;
		//console.log("enable timer");
	}
	stop() {
		this.enabled = false;
		this.ticks = 0;
		//console.log("disable timer");
	}

	// this function executes every tic
	tick() {
		if (!this.enabled || !this.callback) {
			return;
		}
		if (this.ticks++ % this.tickInterval == 0) {
			this.callback(this.id, Math.floor(this.ticks / this.tickInterval));
		}
		if (this.stopAfter > 0 && this.ticks >= this.stopAfter) {
			this.stop();
		}
	}
}