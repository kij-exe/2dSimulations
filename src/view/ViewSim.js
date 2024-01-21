

class ViewSim {
    constructor(id) {
        this.id = id;
        console.log("ViewSim instantiated");
    }

    getId() {
        return this.id;
    }

    redraw() {
        console.log("redraw method invoked");
    }
}


export {ViewSim as default};