'use strict';

export default class Timer {

    time  = 0;  // sec
    _timer;      // timer handler

    start() {

        this._timer = setInterval(() => {
            this.time++;
        }, 1000);

    }

    pause() {
        clearInterval(this._timer);
    }

    reset() {
        this.time = 0;
    }

    getTime() {

            let minutes  = Math.floor(this.time/60),
                seconds = this.time%60;

            if (minutes < 10) minutes = `0${minutes}`;
            if (seconds < 10) seconds = `0${seconds}`;

            return `${minutes}:${seconds}`;

    }

}