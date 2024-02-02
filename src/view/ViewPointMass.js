import ViewBody from "./ViewBody.js";


class ViewPointMass extends ViewBody {
    constructor(body, color) {
        super(body, color);
        //   body is an instance of PointMass in this case
    }

    redraw(view) {
        view.drawPoint(this.body.getPosition(), this.color);
        //   the position of the point mass is its centre
    }
}


export {ViewPointMass as default};