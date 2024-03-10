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

        this.target_scale = 40;
        this.INITIAL_SCALE = 40;
        this.scale = 40;

        this.target_translation = new Vector(0 + 50, this.canvas.height - 50);
        this.INITIAL_TRANSLATION = new Vector(0 + 50, this.canvas.height - 50);
        this.translation = new Vector(0 + 50, this.canvas.height - 50);

        this.coordinate_axis = new CoordinateAxis();
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

    resetScale() {
        this.target_scale = this.INITIAL_SCALE;
    }

    resetTranslation() {
        this.target_translation = this.INITIAL_TRANSLATION;
    }

    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //   clearing canvas area from the previous frame

        this.scale += (this.target_scale - this.scale) / 15;
        this.translation.add(this.target_translation.subtracted(this.translation).divided(15));

        this.coordinate_axis.redraw(this);
        
        for (let i = 0; i < this.body_list.length; i++) {
            this.body_list[i].redraw(this);
            //   redrawing each body separately, if bodies are stored by layers,
            //   then first bodies will be below later bodies
        }

        // this.ctx.beginPath();
        // this.ctx.moveTo(50, 50);
        // this.ctx.lineTo(750, 50);
        // this.ctx.lineTo(750, 400);
        // this.ctx.lineTo(50, 400);
        // this.ctx.lineTo(50, 50);

        // this.ctx.strokeStyle = "blue";
        // this.ctx.stroke();
    }

    addBody(body) {
        this.body_list.push(body);
        let i = this.body_list.length - 1;
        while (i > 0 && this.body_list[i - 1].getLayer() > this.body_list[i].getLayer()) {
            //   while the end of the list has not been reached
            //   and the body at (i) is on lower layers than body (i+1) 
            let temp = this.body_list[i - 1];
            this.body_list[i - 1] = this.body_list[i]
            this.body_list[i] = temp;
            //   swap them
            i--;
        }
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
            if (this.body_list[i].getId() == id) {
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
        this.target_scale = scale;
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
        this.target_translation = this.target_translation.added(vector);
    }

    increaseScaleBy(value) {
        this.target_scale *= value;
    }

    drawParabolaBy(starting_point, control_point, end_point, color="black") {
        this.ctx.beginPath();
        this.ctx.moveTo(...this.toCanvas(starting_point));
        this.ctx.quadraticCurveTo(
            ...this.toCanvas(control_point),
            ...this.toCanvas(end_point)
        );

        this.ctx.strokeStyle = color;
        this.ctx.stroke();
    }

    adjustMapping(particle) {
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

        let f = (x) => {
            return y0 + vy * (x - x0) / vx + a * (x - x0) * (x - x0) / (2 * vx * vx);
        }

        let x3 = Util.solveLinear(a / (vx * vx), vy / vx) + x0;
        let y3 = f(x3)
        if (x3 != null)
            list_of_points.push(new Vector(x3, y3));
        //   highest point on trajectory

        let y2 = f(0);
        if (Math.abs(y2 - y0) <= Math.abs(y3 - y0) * 1.5)
            //   add only if it is closer to starting point than 
            //   1.5 times distance by y between starting point and highest point 
            list_of_points.push(new Vector(0, y2));
        //   y intersection point

        let min_x = 0, max_x = 0, min_y = 0, max_y = 0;

        for (let point of list_of_points) {
            // let body = new PointMass(point, new Vector(), new Vector(), 0, particle.getId());
            // this.addBody(new ViewPointMass(body, "red", 0));

            min_x = Math.min(min_x, point.getX());
            max_x = Math.max(max_x, point.getX());
            min_y = Math.min(min_y, point.getY());
            max_y = Math.max(max_y, point.getY());
        }

        // let rect = new Polygon(particle.getId(), [
        //     new Vector(min_x, min_y),
        //     new Vector(min_x, max_y),
        //     new Vector(max_x, max_y),
        //     new Vector(max_x, min_y)
        // ])
        // this.addBody(new VeiwPolygon(rect));

        let width = max_x - min_x;
        let height = max_y - min_y;
        let rect_centre = new Vector((min_x + max_x) / 2, (min_y + max_y) / 2)

        this.target_scale = Math.min(700 / width, 350 / height);

        let screen_centre = new Vector(this.canvas.width / 2, this.canvas.height / 2);
        this.target_translation = screen_centre.added(rect_centre.multiplied(-this.target_scale).reflectedInX());
    }
}


export {ViewSim as default};