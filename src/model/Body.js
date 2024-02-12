import Vector from "../utility/Vector.js";


class Body {
    constructor(id) {
        this.position = new Vector();
        this.velocity = new Vector();
        this.acceleration = new Vector();

        this.id = id;
    }

    getPosition() {
        return this.position;
    }

    getVelocity() {
        return this.velocity;
    }

    getAcceleration() {
        return this.acceleration;
    }

    getId() {
        return this.id;
    }
}


export {Body as default};