

class ViewBody {
    constructor(body, color="black", layer=1) {
        this.body = body;
        this.color = color;
        this.layer = layer;
    }

    getBody() {
        return this.body;
    }

    getId() {
        return this.body.getId();
    }

    getLayer() {
        return this.layer;
    }

    redraw(view) {
    }
}


export {ViewBody as default};