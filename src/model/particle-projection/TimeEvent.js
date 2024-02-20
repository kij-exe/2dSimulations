import Event from "./Event.js";


class TimeEvent extends Event {
    constructor(body, io_handler, event_id) {
        super(body, io_handler, event_id);
    }

    setTime(time, current_time) {
        this.occurs_at = time * 1000 + current_time;
    }
}

export {TimeEvent as default};


