

class Simulation {
    constructor() {
        this.is_active = true;
    }

    isActive() {
        return this.is_active;
    }

    pause() {
        this.is_active = false;
    }

    continue() {
        this.is_active = true;
    }

    update() {
    }
}


export {Simulation as default};