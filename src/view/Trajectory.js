import Vector from "../utility/Vector.js";
import ViewBody from "./ViewBody.js";


class Trajectory extends ViewBody {
    constructor(body, color="black") {
        super(body, color);
        this.starting_point = body.getInitialPosition();

        let x0 = this.starting_point.getX();
        let y0 = this.starting_point.getY();
        let vx = body.getInitialVelocity().getX();
        let vy = body.getInitialVelocity().getY();
        let a = -9.8;

        let f = (x) => {
            return vy*(x - x0)/vx + a*(x - x0)*(x - x0)/(2*vx*vx);
        }

        let df = (x) => {
            return vy/vx + a*(x - x0)/(vx*vx);
        }

        let x1 = x0 + vx*60;
        //   the value in (vx * value) must be adjusted to the scale
        let y1 = f(x1) + y0;
        this.end_point = new Vector(x1, y1);

        let m0 = df(x0);
        let m1 = df(x1);

        let x_control = (y1 - y0 + m0*x0 - m1*x1) / (m0 - m1);

        this.control_point = new Vector(x_control, y0 + m0 * (x_control - x0));
    }

    redraw(view) {
        // view.drawPoint(this.starting_point, "red", 7);
        // view.drawPoint(this.control_point, "red", 7);
        // view.drawPoint(this.end_point, "red", 7);
        view.drawParabolaBy(this.starting_point, this.control_point, this.end_point, this.color);
    }
    // address the problem of sharp corners
}

export {Trajectory as default};
