

class IOHandler {
    constructor(id, sim, view, io_canvas_container) {
        this.id = id;
        this.sim = sim;
        this.view = view;

        this.createIOarea(io_canvas_container);
    }

    createIOarea(io_canvas_container) {
        this.io_area = document.createElement("div");
        this.io_area.classList.add("container");
        // this.io_area.style.display = "flex";
        this.io_area.style.flexGrow = "1";
        //   create an io_area
        
        io_canvas_container.appendChild(this.io_area);
        //   put io_area on the page
    }
}

export {IOHandler as default};