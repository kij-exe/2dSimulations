

class IOHandler {
    constructor(id, sim, view) {
        this.id = id;
        this.sim = sim;
        this.view = view;

        this.createIOarea();
    }

    createIOarea() {
        this.io_area = document.createElement("div");
        this.io_area.classList.add("container");
        //   create an io_area

        let sim_area = document.getElementById("sim_area" + this.id);
        this.io_area.style.flexGrow = "1";
        
        sim_area.appendChild(this.io_area);
        //   put io_area on the screen
    }
}

export {IOHandler as default};