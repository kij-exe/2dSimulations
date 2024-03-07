import ViewBody from "./ViewBody.js";


class VeiwPolygon extends ViewBody {
    constructor(body, color="black") {
        super(body, color);
    }

    redraw(view) {
        view.drawPolygon(this.body.getVertices(), this.color, false, true);
    }
}


export {VeiwPolygon as default};