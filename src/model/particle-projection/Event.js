

class Event {
    constructor(body, io_handler, event_id) {
        this.body = body;
        //   assigning a body to the event
        this.occurs_at = -1;
        //   an attribute representing the time that event occurs at 
        this.io_handler = io_handler;
        //   reference to the input output handler of this simulation
        this.event_id = event_id;
        //   an id of this particular event (will be assigned by the
        //   IO Handler)
    }

    getTime() {
        return this.occurs_at;
    }

    isValid() {
        return this.occurs_at > 0;
        //   return true if the time the event occurs is greater than 
	    //   0 (returns false if occurs_at is -1 or 0, meaning that event
        //   is not valid or not yet specified)

    }

    execute() {
        return;
        this.io_handler.executeEvent(this.body, this.occurs_at, this.event_id);
        //   provides enough details for an io handler to produce 
        //   relevant output on the screen
    }

    static compare(event1, event2) {
        return event2.occurs_at - event1.occurs_at;
        //   will return a positive number whenever the second event
        //   occurs later, in this way priorotising the earlier events
    }
}

export {Event as default};