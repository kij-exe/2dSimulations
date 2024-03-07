import RigidBody from "../general-purpose/RigidBody.js";


class Polygon extends RigidBody {
    constructor(id, vertices) {
        super(id);
        this.vertices = vertices;
    }

    getVertices() {
        return this.vertices;
    }
}

export {Polygon as default}; 