import Event from "./Event.js";


class TimeEvent extends Event {
    constructor(body, io_handler, event_id) {
        super(body, io_handler, event_id);
    }

    setTime(time) {
        this.occurs_at = time;
    }
}

export {TimeEvent as default};


