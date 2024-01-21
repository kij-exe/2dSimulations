

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
        console.log("update method invoked")
    }
}


export {Simulation as default};