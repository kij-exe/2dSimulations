import ViewBody from "./ViewBody.js";


class VeiwPolygon extends ViewBody {
    constructor(body, color="black", layer=2) {
        super(body, color, layer);
    }

    redraw(view) {
        view.drawPolygon(this.body.getVertices(), this.color, false, true);
    }
}


export {VeiwPolygon as default};