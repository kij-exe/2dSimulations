import Vector from "../../utility/Vector.js";
import Event from "./Event.js";


class VelocityEvent extends Event {
    constructor(body, io_handler, event_id) {
        super(body, io_handler, event_id);
    }

    calculateTime(value, axis) {
        let b = this.body.getAcceleration().dot(axis);
        let c = this.body.getInitialVelocity().dot(axis) - value;
        //   calculating coefficients for the equation
        //   bx + c = 0

        if (b == 0) {
            this.occurs_at = -1;
            return
            //   invalid if b is zero
        }

        let x = (-1) * c / b;
        if (x <= 0) 
            this.occurs_at = -1;
        else
            this.occurs_at = x * 1000 + this.body.createdAt();
    }

    setXtime(value) {
        this.calculateTime(value, new Vector(1, 0));
    }

    setYtime(value) {
        this.calculateTime(value, new Vector(0, 1));
    }
}


export {VelocityEvent as default};

