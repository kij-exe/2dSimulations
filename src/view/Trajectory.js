import Vector from "../utility/Vector.js";
import ViewBody from "./ViewBody.js";


class Trajectory extends ViewBody {
    constructor(body, scale, color="grey", layer=0) {
        super(body, color, layer);
        this.starting_point = body.getInitialPosition();

        let x0 = this.starting_point.getX();
        let y0 = this.starting_point.getY();
        let vx = body.getInitialVelocity().getX();
        let vy = body.getInitialVelocity().getY();
        let a = -9.8;
        // set of constant parameters

        let f = (x) => {
            return y0 + vy*(x - x0)/vx + a*(x - x0)*(x - x0)/(2*vx*vx);
        }
        // y = f(x)

        let df = (x) => {
            return vy/vx + a*(x - x0)/(vx*vx);
        }
        // derivative of f(x)

        let x2 = x0 + vx * (60/Math.sqrt(scale));
        let y2 = f(x2);
        this.end_point = new Vector(x2, y2);

        let m0 = df(x0);
        let m2 = df(x2);
        //   derivatives of two tangents

        let x1 = (y2 - y0 + m0*x0 - m2*x2) / (m0 - m2);
        //   x coordinate of the intersection of two tangents 
        this.control_point = new Vector(x1, y0 + m0 * (x1 - x0));
    }

    redraw(view) {
        view.drawParabolaBy(this.starting_point, this.control_point, this.end_point, this.color);
    }
}

export {Trajectory as default};
