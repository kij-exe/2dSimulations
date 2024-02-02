

class Event {

    static compare(event1, event2) {
        return event1.occurs_at - event2.occurs_at;
    }
}

export {Event as default};