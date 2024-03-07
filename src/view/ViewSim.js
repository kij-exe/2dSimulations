import Polygon from "../model/general-purpose/Polygon.js";
import PointMass from "../model/particle-projection/PointMass.js";
import Util from "../utility/Util.js";
import Vector from "../utility/Vector.js";
import CoordinateAxis from "./CoordinateAxis.js";
import Trajectory from "./Trajectory.js";
import ViewPointMass from "./ViewPointMass.js";
import VeiwPolygon from "./ViewPolygon.js";


class ViewSim {
    constructor(id, canvas_time_io_container) {
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
        this.canvas.tabIndex = 1;
        //   make canvas focusable

        canvas_time_io_container.appendChild(this.canvas);
        //   add canvas on the page

        this.ctx = this.canvas.getContext("2d");
        //   getting access to "context" of the canvas for drawing purposes
        this.ctx.lineWidth = 2;

        this.scale = 40;
        this.translation = new Vector(0 + 50, this.canvas.height - 50);

        this.coordinate_axis = new CoordinateAxis();

        this.test();
    }

    getId() {
        return this.id;
    }

    getCanvas() {
        return this.canvas;
    }

    getScale() {
        return this.scale;
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //   clearing canvas area from the previous frame

        for (let i = 0; i < this.body_list.length; i++) {
            this.body_list[i].redraw(this);
            //   redrawing each body separately, if bodies are stored by layers,
            //   then first bodies will be below later bodies
        }

        this.coordinate_axis.redraw(this);
    }

    addBody(body) {
        this.body_list.push(body);
    }

    deleteBody(body) {
        for (let i = 0; i < this.body_list.length; i++) {
            if (this.body_list[i] == body || this.body_list[i].getBody() == body) {
                this.body_list.splice(i, 1);
                break;
            }
        }
    }
    // when adding layers, implement insertion sort as the list will be partially sorted

    deleteById(id) {
        for (let i = 0; i < this.body_list.length; i++) {
            if (this.body_list[i].getBody().getId() == id) {
                this.body_list.splice(i, 1);
                i--;
            }
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

    toSimSpace(vector) {
        let new_vector = vector.subtracted(this.translation);
        new_vector.divide(this.scale);
        return new_vector.reflectedInX();
    }

    scaled(value) {
        return value * this.scale;
    }

    drawPolygon(vertices, color="black", toFill=true, toStroke=false) {
        this.ctx.moveTo(...this.toCanvas(vertices[0]));
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

        if (toStroke) {
            this.ctx.strokeStyle = color;
            this.ctx.stroke(); 
        }
    
        if (toFill) {
            this.ctx.fillStyle = color;
            this.ctx.fill(); 
        }
    }

    drawCircle(center, radius, color="black") {
        this.ctx.fillStyle = color;

        let translated_center = this.toCanvas(center);
    
        this.ctx.beginPath();
        this.ctx.arc(
            ...translated_center,
            this.scaled(radius) /* radius */,
            0, 2 * Math.PI /* whole circle */
        )
    
        this.ctx.fill();
        //   fill the shape
    }

    drawPoint(center, color="black", radius=5) {
        let unscaled_radius = radius / this.scale;
        this.drawCircle(center, unscaled_radius, color);
    }

    inversedTranslated(vector) {
        let new_vector = vector.reflectedInX();
        //   reflecting the vector
        new_vector.add(this.translation);
        //   translating the vector to a new position
        return new_vector;
    }
    
    setScale(scale) {
        this.scale = scale;
    }

    drawLine(start, finish, color="black") {
        //   unscaled
        this.ctx.beginPath();
        this.ctx.moveTo(...this.inversedTranslated(start));
        //   starting point
        this.ctx.lineTo(...this.inversedTranslated(finish));
        //   end point
        this.ctx.closePath();
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    renderTextByTopRight(point, text, color="black") {
        this.ctx.fillStyle = color;

        this.ctx.font = "18px serif";
        this.ctx.textAlign = "right";
        this.ctx.textBaseline  = "top";
        this.ctx.fillText(
            text,
            ...this.inversedTranslated(point)
        );
    }

    drawArrow(start, finish, color="black") {
        this.ctx.strokeStyle = color;

        let angle = Math.PI / 8;
        let arrow = finish.subtracted(start);
        let reversed_arrow_unit = arrow.multiplied(-1).normalized();
        //   direction of the arrow
        let left_wing = reversed_arrow_unit.rotatedBy(-angle).multiplied(15);
        let right_wing = reversed_arrow_unit.rotatedBy(angle).multiplied(15);

        this.ctx.beginPath();
        this.ctx.moveTo(...this.inversedTranslated(start));
        this.ctx.lineTo(...this.inversedTranslated(finish));
        this.ctx.stroke();
        //   first draw the base completely
        this.ctx.beginPath();
        //   start new path for the head of the arrow
        this.ctx.moveTo(...this.inversedTranslated(finish.added(left_wing)));
        this.ctx.lineTo(...this.inversedTranslated(finish));
        this.ctx.lineTo(...this.inversedTranslated(finish.added(right_wing)));
        this.ctx.stroke();
    }

    increaseTranslationBy(vector) {
        this.translation.add(vector);
    }

    increaseScaleBy(value) {
        this.scale *= value;
    }

    drawParabolaBy(starting_point, control_point, end_point, color="black") {
        this.ctx.beginPath();
        this.ctx.moveTo(...this.toCanvas(starting_point));
        this.ctx.quadraticCurveTo(...this.toCanvas(control_point), ...this.toCanvas(end_point));

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    adjustMapping(particle) {
        return;
        let initial_position = particle.getInitialPosition();
        let list_of_points = [initial_position];

        let x0 = initial_position.getX();
        let y0 = initial_position.getY();
        let vx = particle.getInitialVelocity().getX();
        let vy = particle.getInitialVelocity().getY();
        let a = -9.8;

        let roots = Util.solveQuadratic(a / (2*vx*vx), vy / vx, y0);
        if (!isNaN(roots[0])) {
            let x1 = roots[0] + x0;
            let x2 = roots[1] + x0;
            list_of_points.push(new Vector(x2, 0));
            list_of_points.push(new Vector(x1, 0));
        }
        else {
            // add a point symmetrically to the starting point to compensate for roots being lost
        }

        let y1 = y0 + vy * (-x0) / vx + a * x0 * x0 / (2 * vx * vx);
        list_of_points.push(new Vector(0, y1));

        let time = Util.solveLinear(a, vy);
        list_of_points.push(particle.calculatePositionAt(time));

        let min_x = 0, max_x = 0, min_y = 0, max_y = 0;

        for (let point of list_of_points) {
            let body = new PointMass(point, new Vector(), new Vector(), 0);
            this.addBody(new ViewPointMass(body, "red"));

            min_x = Math.min(min_x, point.getX());
            max_x = Math.max(max_x, point.getX());
            min_y = Math.min(min_y, point.getY());
            max_y = Math.max(max_y, point.getY());
        }
        
        let rect = new Polygon(particle.getId(), [
            new Vector(min_x, min_y),
            new Vector(min_x, max_y),
            new Vector(max_x, max_y),
            new Vector(max_x, min_y)
        ])
        this.addBody(new VeiwPolygon(rect));
    }

    test() {
        // REMINDER::::: turn off auto suggestions for inputs
    }
}


export {ViewSim as default};