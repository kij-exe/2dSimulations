

class IOHandler {
    constructor(id, sim, view) {
        this.id = id;
        this.sim = sim;
        this.view = view;

        this.createIOarea();
        this.initialize();
    }

    createIOarea() {
        this.io_area = document.createElement("div");
        //   create an io_area

        let sim_area = document.getElementById("sim_area" + this.id);
        this.io_area.style.flexGrow = "1";

        let p = document.createElement("p");
        p.innerHTML = "text"
        this.io_area.appendChild(p)
        
        sim_area.appendChild(this.io_area);
        //   put io_area on the screen
    }

    initialize() {
    }
}

export {IOHandler as default};