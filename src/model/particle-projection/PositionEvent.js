import Vector from "../../utility/Vector.js";
import Event from "./Event.js";


class PositionEvent extends Event {
    constructor(body, io_handler, id) {
        super(body, io_handler, id);
    }

    calculateTime(value, axis) {
        const a = this.body.getAcceleration().dot(axis) / 2;
        const b = this.body.getInitialVelocity().dot(axis);
        const c = this.body.getInitialPosition().dot(axis) - value;
        //   calculating coefficients for the quadratic equation
        //   from the equation of motion in a form of ax^2+bx+c=0

        if (a == 0 && b == 0) {
            this.occurs_at = -1;
            return;
            //   invalid if both a and b are zero
        }
        
        if (a == 0) {
            //   if only a is zero, then there might be a solution
            let x = (-1) * c / b;
            if (x <= 0) 
                this.occurs_at = -1;
            else
                this.occurs_at = x * 1000 + this.body.createdAt();
            return
        }

        let D = b * b - 4 * a * c;
        //   calculating discriminant

        if (D < 0) {
            this.occurs_at = -1;
            return
            //   end function
        }
        
        let x1 = ((-1) * b - Math.sqrt(D)) / (2 * a);
        let x2 = ((-1) * b + Math.sqrt(D)) / (2 * a);

        if (x2 < x1) {
            let temp = x2;
            x2 = x1;
            x1 = temp;
            //   swap x1 and x2 so x2 >= x1
        }
        //   two solutions where x1 <= x2

        
        if (x2 <= 0) {
            this.occurs_at = -1
            return
        }
        //   if the largest solution is negative, then the particle 
        //   never reaches the value

        if (x1 <= 0)
            this.occurs_at = x2 * 1000 + this.body.createdAt();
        else
            this.occurs_at = x1 * 1000 + this.body.createdAt();
        //   if the first value is positive, then the particle first 
        //   reaches the value after x1 seconds and the second time
        //   after x2 seconds
    }

    setXtime(value) {
        this.calculateTime(value, new Vector(1, 0));
    }

    setYtime(value) {
        this.calculateTime(value, new Vector(0, 1));
    }
}


export {PositionEvent as default};