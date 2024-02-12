

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

        let canvas_io = document.getElementById("sim_area" + this.id);
        this.io_area.style.display = "flex";
        let p = document.createElement("p");
        p.innerHTML = "text"
        this.io_area.style.flexGrow = "1";
        // p.style.flexGrow = "0";
        this.io_area.appendChild(p)

        canvas_io.appendChild(this.io_area);
        //   put io_area on the screen
    }

    initialize() {

    }
}

export {IOHandler as default};