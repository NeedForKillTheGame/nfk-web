
import Timer from './Timer.js';
import Utils from './Utils.js';
import Constants from './Constants.js';

/*
usage:

var timerId = this.g.timerManager.addTimer(1, 0, function(id, tick) {
	console.log("timer " + id + " tick " + tick);
});

*/

export default
class TimerManager {
	constructor() {
		this.timers = [];
	}

	// run every timeInterval seconds
	// id = unique timer id
	// stopAfter = stop and destroy after X seconds. 0 = infinite loop
	// callback = fuunction to call every time
	addTimer(timeInterval, stopAfter, callback) {
		return this.addTickTimer(timeInterval * Constants.FPS, stopAfter * Constants.FPS, callback);
	}

	// add timer which will executes one time after a delay
	addTimeout(delay, callback) {
		var that = this;
		var timerId = this.addTickTimer(delay * Constants.FPS, delay * Constants.FPS * 2, function(id, tick) {
			// ignore zero tick, because it executes immediately after start
			if (tick == 1) {
				callback(id, tick);
				that.removeTimer(id);
			}
		});
		return timerId;
	}

	// run every tickInterval ticks (60 ticks/FPS per a second)
	// id = unique timer id
	// stopAfter = stop after X ticks. 0 = infinite loop
	// callback = fuunction to call every time
	addTickTimer(tickInterval, stopAfter, callback) {
		var id = Utils.random(1, 9999999);
		var t = new Timer(id, tickInterval, stopAfter, callback);
		t.start();
		this.timers.push(t);
		return id;
	}

	// call each timer every tick
	tick() {
		for (var i = 0; i < this.timers.length; i++) {
			this.timers[i].tick();
		}
	}

	stopTimer(id) {
		for (var i = 0; i < this.timers.length; i++) {
			if (this.timers[i].id == id) {
				this.timers[i].stop();
				break;
			}
		}
	}
	startTimer(id) {
		for (var i = 0; i < this.timers.length; i++) {
			if (this.timers[i].id == id) {
				this.timers[i].start();
				break;
			}
		}
	}

	removeTimer(id) {
		for (var i = 0; i < this.timers.length; i++) {
			if (this.timers[i].id == id) {
				this.timers.splice(i, 1);
				break;
			}
		}
	}

	// remove all timers
	clearTimers() {
		this.timers = [];
	}

	
}