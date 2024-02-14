

class Simulation {
    constructor() {
        this.is_active = false;
        this.body_list = [];
        this.time = 0;
    }

    isActive() {
        return this.is_active;
    }

    pause() {
        this.is_active = false;
    }

    continue() {
        // console.log("Time start: " + new Date().getTime());
        this.is_active = true;
    }

    getTime() {
        return this.time;
    }

    addBody(body) {
        this.body_list.push(body);
    }

    deleteBody(body_to_delete) {
        for (let i = 0; i < this.body_list.length; i++) {
            if (this.body_list[i] == body_to_delete)
                this.body_list.splice(i, 1);
        }
    }

    update() {
    }
}


export {Simulation as default};