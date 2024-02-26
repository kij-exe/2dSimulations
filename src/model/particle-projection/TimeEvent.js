import Event from "./Event.js";


class TimeEvent extends Event {
    constructor(body, io_handler, id) {
        super(body, io_handler, id);
    }

    setTime(time, current_time) {
        this.occurs_at = time * 1000 + current_time;
    }
}

export {TimeEvent as default};


