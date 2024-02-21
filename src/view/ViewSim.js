import Vector from "../utility/Vector.js";


class ViewSim {
    constructor(id) {
        this.id = id;
        this.body_list = [];
        // initialising set of attributes to their initial values

        this.canvas = document.createElement("canvas");
        //   creating the canvas html element
        this.canvas.width = 800;
        this.canvas.height = 450;
        //   width and height must be assigned in JS
        //   so the graphics is not stretched to fit the space
        this.canvas.style.alignSelf = "start";
        //   prevent the canvas from stretching
        
        let sim_area = document.getElementById("sim_area" + id);

        //   line break before adding the simulation
        sim_area.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");
        //   getting access to "context" of the canvas for drawing purposes

        this.scale = 40;
        this.translation = new Vector(0, this.canvas.height);
    }

    getId() {
        return this.id;
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //   clearing canvas area from the previous frame
        for (let i = 0; i < this.body_list.length; i++) {
            this.body_list[i].redraw(this);
            //   redrawing each body separately, if bodies are stored by layers,
            //   then first bodies will be below later bodies
        }
        this.test();
    }

    addBody(body) {
        this.body_list.push(body);
    }

    deleteBody(body) {
        for (let i = 0; i < this.body_list.length; i++) {
            if (this.body_list[i] == body || this.body_list[i].getBody() == body)
                this.body_list.splice(i, 1);
        }
    }

    //   converting coordinates from simulation space
    toCanvas(vector) {
        let new_vector = vector.reflectedInX();
        //   reflecting the vector
        new_vector.multiply(this.scale);
        //   scaling relative to the origin
        new_vector.add(this.translation);
        //   translating the vector to a new position
        return new_vector;
    }

    scaled(value) {
        return value * this.scale;
    }

    drawPolygon(vertices, color) {
        this.ctx.moveTo(...vertices[0]);
        this.ctx.beginPath();
        //   start path at the first vertex
        for (let vertex of vertices) {
            let translated_vertex = this.toCanvas(vertex);
            //   translate to canvas coordinates
            this.ctx.lineTo(...translated_vertex);
            //   line to the next vertex
        }
        //   move to each vertex in order
        this.ctx.closePath();
    
        this.ctx.fillStyle = color;
        this.ctx.fill(); 
    }

    drawCircle(center, radius, color) {
        let translated_center = this.toCanvas(center);
    
        this.ctx.beginPath();
        this.ctx.arc(
            ...translated_center,
            this.scaled(radius) /* radius */,
            0, 2 * Math.PI /* whole circle */
        )
        this.ctx.closePath();
    
        this.ctx.fillStyle = color;
        this.ctx.fill();
        //   fill the shape
    }

    drawPoint(center, color) {
        let unscaled_radius = 5 / this.scale;
        this.drawCircle(center, unscaled_radius, color);
    }
    
    test() {
        
    }    
}


export {ViewSim as default};