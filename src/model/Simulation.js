

class Simulation {
    constructor() {
        this.is_active = true;
    }

    isActive() {
        return is_active;
    }

    pause() {
        console.log("pause sim function invoked");
    }

    continue() {
        console.log("continue simulation function invoked");
    }

    update() {
        console.log("update method invoked")
    }
}


export {Simulation as default};