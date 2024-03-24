import IOHandler from "./IOHandler.js";
import PointMass from "../model/particle-projection/PointMass.js";
import Vector from "../utility/Vector.js";
import ViewPointMass from "../view/ViewPointMass.js";
import PositionEvent from "../model/particle-projection/PositionEvent.js"
import VelocityEvent from "../model/particle-projection/VelocityEvent.js"
import TimeEvent from "../model/particle-projection/TimeEvent.js"
import Trajectory from "../view/Trajectory.js";


class ParticleProjectionIO extends IOHandler {
    constructor(id, sim, view, io_canvas_container) {
        super(id, sim, view, io_canvas_container)

        this.next_particle_id = 0;
        this.next_event_id = 0;

        this.body_list = [];

        this.initialize();
    }

    initialize() {
        this.INCORRECT_TYPE_ERROR = `
        Input values must be numbers with a decimal point or in the format Xe+/-Y for 
        <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mrow>
                <mi>X</mi>
                <mo>*</mo>
                <msup>
                    <mi>10</mi>
                    <mrow>
                        <mo>+/-</mo>
                        <mi>Y</mi>
                    </mrow>
                </msup>
            </mrow>
        </math>
        `;
        this.OUT_OF_RANGE_VALUES  = "Input values must be between -10000 and 10000";
        this.INVALID_EVENT_ERROR = "Such event will never occur";
        this.PARTICLE_NOT_CHOSEN = "Choose the particle first";
        
        this.createParticleArea();
        this.createEventArea();
        this.createTimeControl();
        this.createKeyboardInput();
    }

    createParticleArea() {
        let particle_area = document.createElement("div");
        particle_area.id = "particle_area" + this.id;
        particle_area.style.flexGrow = "1";

        this.io_area.appendChild(particle_area);

        let header_container = document.createElement("div");
        header_container.style.display = "flex";
        //   header container
        particle_area.appendChild(header_container);

        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.innerHTML = "List of particles";
        header_container.appendChild(title);
        //   first the title is created
        
        this.createParticleMenuButton(header_container);
        //   then the button is created

        this.createParticleInput(particle_area);
        //   create an input area

        let particle_list = document.createElement("div");
        particle_list.id = "particle_list" + this.id;
        particle_area.appendChild(particle_list);
        //   then the particle list area
    }
    
    createParticleMenuButton(header_container) {
        let button = document.createElement("button");
        button.innerHTML = "<";

        button.onclick = () => {
            let particle_input = document.getElementById("particle_input" + this.id);

            if (particle_input.style.display == "none") {
                //   change button state to show that the menu is opened
                button.innerHTML = "v";
                //   reveal the menu
                particle_input.style.display = "block";

                //   start canvas input chain
                this.view.getCanvas().onclick = (event) => {
                    this.canvasPositionInput(event);
                }
            }
            else {
                //   change button state to show that the menu is closed
                button.innerHTML = "<";
                //   hide the menu
                particle_input.style.display = "none";

                //   remove canvas input
                this.view.getCanvas().onclick = null;

            }
            //   switches particle_input display
            //   between none and block
        }

        header_container.appendChild(button);
    }

    getPositionFromClickEvent(event) {
        //   Get the target (canvas element itself)
        const target = event.target;
        //   Get the bounding rectangle of target
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        //   x and y relative to the top left corner 
        //   with y axis pointing downwards
        return this.view.toSimSpace(new Vector(x, y));
    }

    //   input from the canvas
    canvasPositionInput(event) {
        let position = this.getPositionFromClickEvent(event);

        document.getElementById("position_x_input" + this.id).value = position.getX();
        document.getElementById("position_y_input" + this.id).value = position.getY();

        this.view.getCanvas().onclick = (event) => {
            this.canvasVelocityInput(event, position);
        }
    }

    canvasVelocityInput(event, position) {
        let nextClick = this.getPositionFromClickEvent(event);
        let velocity = nextClick.subtracted(position);
        velocity.multiply(Math.sqrt(this.view.getScale()) / 4);

        document.getElementById("velocity_x_input" + this.id).value = velocity.getX();
        document.getElementById("velocity_y_input" + this.id).value = velocity.getY();

        this.view.getCanvas().onclick = (event) => {
            this.canvasPositionInput(event);
        }
    }

    createParticleInput(particle_area) {
        let particle_input = document.createElement("div");
        particle_input.classList.add("box");
        particle_input.style.display = "none";
        particle_input.id = "particle_input" + this.id;
        //   particle input area

        particle_area.appendChild(particle_input);

        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.id = "particle_input_title" + this.id;
        title.innerHTML = "New Particle " + this.next_particle_id;
        //   title for the area
        //   it must be updated every time new Particle is added

        let top_container = document.createElement("div");
        top_container.style.display = "flex";
        top_container.style.flexFlow = "wrap";
        top_container.appendChild(title);
        //   container for the title and inputs
        //   it separates them from the button

        particle_input.appendChild(top_container);

        this.createPositionInput(top_container);
        this.createVelocityInput(top_container);
        //   creating inputs for position and velocity

        this.createAddParticleButton(particle_input);
        //   button that adds new particles

        let error_message = document.createElement("p");
        error_message.id = "particle_error_message" + this.id;
        error_message.innerHTML = this.INCORRECT_TYPE_ERROR;
        error_message.style.display = "none";
        error_message.classList.add("error_message");
        particle_input.appendChild(error_message);
        //   element to indicate an input error
    }

    createPositionInput(top_container) {
        let position_container = document.createElement("div");
        position_container.style.display = "flex";
        //   a container for all position input

        let position_title = document.createElement("p");
        position_title.innerHTML = "Position =  ";

        let column = this.createColumn(
            "position_x_input" + this.id,
            "position_y_input" + this.id
        );
        //   column input

        position_container.appendChild(position_title);
        position_container.appendChild(column);

        top_container.appendChild(position_container);
    }

    createVelocityInput(top_container) {
        let velocity_container = document.createElement("div");
        velocity_container.style.display = "flex";
    
        let velocity_title = document.createElement("p");
        velocity_title.innerHTML = "Velocity = ";

        let column = this.createColumn(
            "velocity_x_input" + this.id,
            "velocity_y_input" + this.id
        )

        velocity_container.appendChild(velocity_title);
        velocity_container.appendChild(column);

        top_container.appendChild(velocity_container);

    }

    createColumn(top_id, bottom_id) {
        let column = document.createElement("div");
        column.innerHTML = `
        <math xmlns="http://www.w3.org/1998/Math/MathML">
            <mrow>
                <mo>(</mo>
                <mtable>
                    <mtr>
                        <mtd><mi><input id="${top_id}" type="text" autocomplete="off"/></mi></mtd>
                    </mtr>
                    <mtr>
                        <mtd><mi><input id="${bottom_id}" type="text" autocomplete="off"/></mi></mtd>
                    </mtr>
                </mtable>
                <mo>)</mo>
            </mrow>
        </math>
        `
        return column;
    }
    
    createAddParticleButton(particle_input) {
        let container = document.createElement("div");
        container.style.display = "flex";
        //   flex container for a button to extend

        let add_button = document.createElement("button");
        add_button.innerHTML = "Add";
        add_button.style.flexGrow = "1";
        //   allows button to take up all space
        add_button.onclick = () => {
            this.addParticle();
        }

        container.appendChild(add_button);

        particle_input.appendChild(container);
    }

    addParticle() {
        let position_x = parseFloat(document.getElementById("position_x_input" + this.id).value);
        let position_y = parseFloat(document.getElementById("position_y_input" + this.id).value);
        let velocity_x = parseFloat(document.getElementById("velocity_x_input" + this.id).value);
        let velocity_y = parseFloat(document.getElementById("velocity_y_input" + this.id).value);
        //   retrieve values from inputs 
        
        let error_message = document.getElementById("particle_error_message" + this.id);

        for (let value of [position_x, position_y, velocity_x, velocity_y]) {
            if (isNaN(value)) {
                error_message.innerHTML = this.INCORRECT_TYPE_ERROR;
                error_message.style.display = "block";
                return;
            }
            
            if (value < -10000 || value > 10000) {
                error_message.innerHTML = this.OUT_OF_RANGE_VALUES;
                error_message.style.display = "block";
                return;
            }
        }
        //   validations

        let particle = new PointMass(
            new Vector(position_x, position_y),
            new Vector(velocity_x, velocity_y),
            new Vector(0, -9.8),
            this.sim.getTime(),
            this.next_particle_id++ //  get and increment at the same time
        );
        //   initialise new particle

        this.sim.addBody(particle);

        let view_particle = new ViewPointMass(particle, "black");
        this.view.addBody(view_particle);

        this.view.adjustMapping(particle);

        let trajectory = new Trajectory(particle, this.view.getScale());
        this.view.addBody(trajectory);

        this.body_list.push(particle);
        //   add the particle to io_list's own body_list

        this.createParticleOutput(particle);
        //   create an output window for the particle

        this.resetParticleChoice();
        //   reset the select element for the events
        //   because new particle has been added

        let particle_input_title = document.getElementById("particle_input_title" + this.id);
        particle_input_title.innerHTML = "New Particle " + this.next_particle_id;
        //   update title for the next particle

        error_message.style.display = "none";
        //   hide error message when particle is added successfully
    }

    createParticleOutput(particle) {
        let particle_list = document.getElementById("particle_list" + this.id);

        let output_container = document.createElement("div");
        output_container.classList.add("box");
        //   container for an output block

        let top_container = document.createElement("div");
        top_container.style.display = "flex";
        top_container.style.flexFlow = "wrap";
        //   container for a title and button

        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.innerHTML = "Particle " + particle.getId();
        top_container.appendChild(title);

        this.createPositionOutput(top_container, particle.getId());
        this.createVelocityOutput(top_container, particle.getId());
        //   creating outputs for each property

        output_container.appendChild(top_container);

        particle_list.appendChild(output_container);

        this.createRemoveButton(output_container, particle.getId());
        //   button to remove the particle after it is added
    }

    createPositionOutput(top_container, particle_id) {
        let position_output = document.createElement("div");
        position_output.style.display = "flex";
        //   container for an output block

        let position_title = document.createElement("p");
        position_title.innerHTML = "Position = ";

        let column = this.createColumn(
            "position_x_value" + particle_id + "_" + this.id,
            "position_y_value" + particle_id + "_" + this.id
        );

        position_output.appendChild(position_title);
        position_output.appendChild(column);

        top_container.appendChild(position_output);
    }

    createVelocityOutput(top_container, particle_id) {
        let position_output = document.createElement("div");
        position_output.style.display = "flex";

        let velocity_title = document.createElement("p");
        velocity_title.innerHTML = "Velocity = ";

        let column = this.createColumn(
            "velocity_x_value" + particle_id + "_" + this.id,
            "velocity_y_value" + particle_id + "_" + this.id
        );

        position_output.appendChild(velocity_title);
        position_output.appendChild(column);

        top_container.appendChild(position_output);
    }

    update() {
        for (let particle of this.body_list) {
            if (particle == null)
                continue;
            this.updatePositionOutput(particle);
            this.updateVelocityOutput(particle);
        }
        if (this.sim.isActive())
            this.updateThumb();
    }

    updatePositionOutput(particle) {
        let x_value = document.getElementById("position_x_value" + particle.getId() + "_" + this.id);
        let y_value = document.getElementById("position_y_value" + particle.getId() + "_" + this.id);
        //   retrieve html elements that represent output

        let position = particle.getPosition();

        x_value.value = Math.round(position.getX() * 100) / 100;
        y_value.value = Math.round(position.getY() * 100) / 100;
        //   assign values rounded to 2 dp
    }

    updateVelocityOutput(particle) {
        let x_value = document.getElementById("velocity_x_value" + particle.getId() + "_" + this.id);
        let y_value = document.getElementById("velocity_y_value" + particle.getId() + "_" + this.id);
        //   retrieve html elements that represent output

        let velocity = particle.getVelocity();

        x_value.value = Math.round(velocity.x * 100) / 100;
        y_value.value = Math.round(velocity.y * 100) / 100;
        //   assign values rounded to 2 dp
    }

    createRemoveButton(output_container, particle_id) {
        let button = document.createElement("button");
        button.style.width = "100px";
        //   fixed small width to avoid accidental clicks
        button.innerHTML = "Remove";

        button.onclick = () => {
            let particle = this.body_list[particle_id];
            this.sim.deleteBody(particle);
            this.view.deleteById(particle.getId());

            this.body_list[particle_id] = null;
            //   remove particle from sim, view and io

            this.resetParticleChoice();
            //   reset a particle drop down

            output_container.remove();
            button.remove();
            //   remove particle from HTML
        }
        
        output_container.appendChild(button);
        //   add button on the page
    }

    createEventArea() {
        let event_area = document.createElement("div");
        event_area.id = "event_area" + this.id;

        let container = document.createElement("div");
        container.style.display = "flex";

        let title = document.createElement("p");
        title.innerHTML = "Events";
        title.style.marginRight = "auto";

        container.appendChild(title)

        let occurred_events = document.createElement("div");
        occurred_events.id = "occurred_events" + this.id;

        event_area.append(container);
        event_area.appendChild(occurred_events);

        this.io_area.appendChild(event_area);

        this.createEventInput(event_area);

        this.createEventMenuButton(container);

        let event_queue = document.createElement("div");
        event_queue.id = "event_queue" + this.id;
        event_area.appendChild(event_queue);
    } 

    createEventMenuButton(container) {
        let button = document.createElement("button");
        button.innerHTML = "<";

        button.onclick = () => {
            let event_input = document.getElementById("event_input" + this.id);

            if (event_input.style.display == "none") {
                event_input.style.display = "block";
                button.innerHTML = "v";
            }
            else {
                event_input.style.display = "none";
                button.innerHTML = "<";
            }
        }

        container.appendChild(button);
    }

    createEventInput(event_area) {
        let event_input = document.createElement("div");
        event_input.style.display = "none";
        event_input.classList.add("box");
        event_input.id = "event_input" + this.id;

        let title = document.createElement("p");
        title.id = "next_event_title" + this.id;
        title.innerHTML = "Event " + this.next_event_id;
        event_input.appendChild(title);

        this.createEventTypeChoice(event_input);
        //   drop-down menu for the event type

        let particle_drop_down = document.createElement("select");
        particle_drop_down.id = "particle_choice" + this.id;
        event_input.appendChild(particle_drop_down);
        //   create the drop-down for a particle

        let condition_title = document.createElement("p");
        condition_title.innerHTML = "Condition";
        event_input.appendChild(condition_title);

        event_area.appendChild(event_input);

        this.resetParticleChoice();
        //   reset particle drop-down


        this.createPositionEventInput(event_input);
        this.createVelocityEventInput(event_input);
        this.createTimeEventInput(event_input);

        let error_message = document.createElement("p");
        error_message.id = "event_error_message" + this.id;
        error_message.style.display = "none";
        error_message.classList.add("error_message");
        event_input.appendChild(error_message);
        
        this.createAddEventButton(event_input);
    }

    createEventTypeChoice(event_input) {
        let drop_down = document.createElement("select");
        drop_down.id = "event_type_choice" + this.id;

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Event Type";
        drop_down.appendChild(option);
        //   default option

        let event_types = ["Position Event", "Velocity Event", "Time Event"];
        //   defines the order where
        //   0 - Position; 1 - Velocity; 2 - Time;

        for (let i = 0; i < event_types.length; i++) {
            let option = document.createElement("option");
            //   creating an option
            option.value = i;
            option.innerHTML = event_types[i];
            drop_down.appendChild(option);
            //   add the option to the dropdown menu
        }

        event_input.appendChild(drop_down);

        drop_down.onchange = () => {
            this.toggleCondition(drop_down);
        }
    }

    resetParticleChoice() {
        let drop_down = document.getElementById("particle_choice" + this.id);
        drop_down.innerHTML = "";
        //   empty previous contents

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Particle";
        drop_down.appendChild(option);
        //   default option

        for (let i = 0; i < this.body_list.length; i++) {
            if (this.body_list[i] == null)
                continue;
            let option = document.createElement("option");
            //   creating an option
            option.value = i;
            option.innerHTML = "Particle " + i;
            drop_down.appendChild(option);
            //   add the option to the dropdown menu
        }
    }

    toggleCondition(drop_down) {
        let choice = drop_down.value;
        let position_condition = document.getElementById("position_condition" + this.id);
        let velocity_condition = document.getElementById("velocity_condition" + this.id);
        let time_condition = document.getElementById("time_condition" + this.id);

        for (let condition of [position_condition, velocity_condition, time_condition])
            condition.style.display = "none";
        //   turn off every condition input

        let add_button = document.getElementById("add_event_button" + this.id);

        switch (choice) {
            case "-1":
                add_button.onclick = null;
                break;
            case "0":
                //   Position Event
                position_condition.style.display = "block";
                add_button.onclick = () => {
                    this.addPositionEvent();
                }
                break;
            case "1":
                //   Velocity Event
                velocity_condition.style.display = "block";
                add_button.onclick = () => {
                    this.addVelocityEvent();
                }
                break;
            case "2":
                //   Time Event
                time_condition.style.display = "block";
                add_button.onclick = () => {
                    this.addTimeEvent();
                }
                break;
        }
    }

    resetNextEventTitle() {
        let title = document.getElementById("next_event_title" + this.id);
        title.innerHTML = "Event " + this.next_event_id;
    }

    createPositionEventInput(event_input) {
        let condition_container = document.createElement("div");
        condition_container.id = "position_condition" + this.id;
        condition_container.style.display = "none";

        let x_label = document.createElement("label");
        x_label.innerHTML = "x";
        
        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "x_event_condition" + this.id;

        condition_container.appendChild(x_label);
        condition_container.appendChild(x_input);

        let y_label = document.createElement("label");
        y_label.innerHTML = "y";
        
        let y_input = document.createElement("input");
        y_input.type = "text";
        y_input.id = "y_event_condition" + this.id;

        condition_container.appendChild(y_label);
        condition_container.appendChild(y_input);

        event_input.appendChild(condition_container);
    }

    createVelocityEventInput(event_input) {
        let condition_container = document.createElement("div");
        condition_container.id = "velocity_condition" + this.id;
        condition_container.style.display = "none";

        let x_label = document.createElement("label");
        x_label.innerHTML = "vx";
        
        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "vx_event_condition" + this.id;

        condition_container.appendChild(x_label);
        condition_container.appendChild(x_input);

        let y_label = document.createElement("label");
        y_label.innerHTML = "vy";
        
        let y_input = document.createElement("input");
        y_input.type = "text";
        y_input.id = "vy_event_condition" + this.id;

        condition_container.appendChild(y_label);
        condition_container.appendChild(y_input);

        event_input.appendChild(condition_container);
    }
    //   x -> vx, y -> vy

    createTimeEventInput(event_input) {
        let condition_container = document.createElement("div");
        condition_container.id = "time_condition" + this.id;
        condition_container.style.display = "none";

        let label_start = document.createElement("label");
        label_start.innerHTML = "Stop after";
        
        let label_finish = document.createElement("label");
        label_finish.innerHTML = "seconds";

        let time_input = document.createElement("input");
        time_input.type = "text";
        time_input.id = "time_event_condition" + this.id;

        condition_container.appendChild(label_start);
        condition_container.appendChild(time_input);
        condition_container.appendChild(label_finish);

        event_input.appendChild(condition_container);
    }

    createAddEventButton(event_input) {
        let button_container = document.createElement("div");
        button_container.style.display = "flex";
        
        let add_button = document.createElement("button");
        add_button.style.flexGrow = "1";
        add_button.id = "add_event_button" + this.id;
        add_button.innerHTML = "Add";
        //   onclick is defined when event type is chosen

        button_container.appendChild(add_button);

        event_input.appendChild(button_container);
    }

    addPositionEvent() {
        let x_value = document.getElementById("x_event_condition" + this.id).value;
        let y_value = document.getElementById("y_event_condition" + this.id).value;
        //   retrieving user input for conditions 

        let error_message = document.getElementById("event_error_message" + this.id);
        error_message.style.display = "none";

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        if (particle_id == -1) {
            error_message.innerHTML = this.PARTICLE_NOT_CHOSEN;
            error_message.style.display = "block";
            return;
        }
        //   validating particle choice
        let particle = this.body_list[particle_id];
        //   retrieving the required particle

        let event = new PositionEvent(particle, this, this.next_event_id);

        if (!isNaN(x_value) && !(x_value === ""))
            event.setXtime(parseFloat(x_value));
            //   validating x_value
        else if (!isNaN(y_value) && !(y_value === ""))
            event.setYtime(parseFloat(y_value));
            //   validating y_value
        else {
            error_message.innerHTML = this.INCORRECT_TYPE_ERROR;
            error_message.style.display = "block";
            return;
        }

        if (!event.isValid()) {
            error_message.innerHTML = this.INVALID_EVENT_ERROR;
            error_message.style.display = "block";
            return;
        }

        this.sim.addEvent(event);

        this.enqueueEvent(event, this.sim);

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    addVelocityEvent() {
        let x_value = document.getElementById("vx_event_condition" + this.id).value;
        let y_value = document.getElementById("vy_event_condition" + this.id).value;
        //   retrieving user input for conditions 
        
        let error_message = document.getElementById("event_error_message" + this.id);
        error_message.style.display = "none";

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        if (particle_id == -1) {
            error_message.innerHTML = this.PARTICLE_NOT_CHOSEN;
            error_message.style.display = "block";
            return;
        }
        //   validating particle choice
        let particle = this.body_list[particle_id];
        //   retrieving the required particle

        let event = new VelocityEvent(particle, this, this.next_event_id);

        if (!isNaN(x_value) && !(x_value === ""))
            event.setXtime(parseFloat(x_value));
            //   validating x_value
        else if (!isNaN(y_value) && !(y_value === ""))
            event.setYtime(parseFloat(y_value));
            //   validating y_value
        else {
            error_message.innerHTML = this.INCORRECT_TYPE_ERROR;
            error_message.style.display = "block";
            return;
        }

        if (!event.isValid()) {
            error_message.innerHTML = this.INVALID_EVENT_ERROR;
            error_message.style.display = "block";
            return;
        }

        this.sim.addEvent(event);

        this.enqueueEvent(event, this.sim);

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    addTimeEvent() {
        let time = document.getElementById("time_event_condition" + this.id).value;
        
        let error_message = document.getElementById("event_error_message" + this.id);
        error_message.style.display = "none";

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        if (particle_id == -1) {
            error_message.innerHTML = this.PARTICLE_NOT_CHOSEN;
            error_message.style.display = "block";
            return;
        }
        //   validating particle choice
        let particle = this.body_list[particle_id];

        let event = new TimeEvent(particle, this, this.next_event_id);

        if (isNaN(time) || (time === "")) {
            error_message.innerHTML = this.INCORRECT_TYPE_ERROR;
            error_message.style.display = "block";
            return;
        }
        
        event.setTime(parseFloat(time), this.sim.getTime());
        if (!event.isValid()) {
            error_message.innerHTML = this.INVALID_EVENT_ERROR;
            error_message.style.display = "block";
            return;
        }

        this.sim.addEvent(event);

        this.enqueueEvent(event, this.sim);

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    enqueueEvent(event, sim) {
        let event_queue = document.getElementById("event_queue" + this.id);

        let enqueued_event = document.createElement("div");
        enqueued_event.id = "enqueued_event" + event.getId() + "_" + this.id;
        enqueued_event.classList.add("box");
        enqueued_event.style.display = "flex";
        enqueued_event.style.flexFlow = "wrap";

        let title = document.createElement("p");
        title.innerHTML = "Event " + event.getId();
        title.style.marginRight = "auto";
        enqueued_event.appendChild(title);

        let occurs_in_label = document.createElement("label");
        occurs_in_label.innerHTML = "Occurs in";
        
        let occurs_in_value = document.createElement("input");
        let time = (event.getTime() - sim.getTime()) / 1000;
        //   calculating the time before event occurs and converting it to seconds
        occurs_in_value.value = Math.round(time * 1000) / 1000;

        enqueued_event.appendChild(occurs_in_label);
        enqueued_event.appendChild(occurs_in_value);

        event_queue.appendChild(enqueued_event);
    }

    executeEvent(event) {
        let enqueued_event = document.getElementById("enqueued_event" + event.getId() + "_" + this.id);
        enqueued_event.remove();
    }

    createTimeControl() {
        let canvas_time_container = document.getElementById("canvas_time_container" + this.id);

        let time_control_container = document.createElement("div");
        time_control_container.style.display = "flex";

        canvas_time_container.appendChild(time_control_container);

        this.createResetButton(time_control_container);
        this.createTimeSlider(time_control_container);
        this.createTimeInput(time_control_container);
    }

    createResetButton(time_control_container) {
        let button = document.createElement("button");
        button.innerHTML = '<i class="material-icons" style="background-color: rgba(0, 0, 0, 0); color: #39498C">&#xe042;</i>';

        button.onclick = () => {
            this.sim.resetTime();
            this.updateThumb();
            //   update positions
            this.view.resetScale();
            this.view.resetTranslation();
            //   reset mapping of simulation space on the screen
        }

        time_control_container.appendChild(button);
    }

    createTimeSlider(time_control_container) {
        let slider_container = document.createElement("div");
        slider_container.style.display = "flex";
        slider_container.style.flexGrow = 1;
        slider_container.style.position = "relative";
        slider_container.style.marginLeft = "10px"; 
        slider_container.style.marginRight = "10px";
        
        let slider = document.createElement("input");
        slider.id = "time_slider" + this.id;
        slider.type = "range";
        slider.style.flexGrow = 1;
        
        slider.min = -5;
        slider.max = 70;
        slider.value = 0;
        slider.step = "any";

        let datalist = document.createElement("datalist");
        for (let i of [0, 60]) {
            let option = document.createElement("option");
            option.innerHTML = i;
            datalist.appendChild(option);
        }
        slider_container.appendChild(datalist);
        slider.setAttribute("list", "marks");

        slider.oninput = () => {
            this.sim.pause();
            this.sim.resetTime(parseFloat(slider.value) * 1000);

            this.updateThumb();
        }

        time_control_container.appendChild(slider_container);
        slider_container.appendChild(slider);

        this.createTickMarks(slider_container);

        let thumb_text = document.createElement("span");
        thumb_text.id = "thumb_text" + this.id;
        thumb_text.classList.add("ticktext");
        thumb_text.style.top = "22px";
        slider_container.appendChild(thumb_text);
        this.updateThumb();
    }

    createTickMarks(slider_container) {
        let tick0 = document.createElement("div");
        tick0.classList.add("tickmark");
        tick0.style.left = `calc(6px + 5 * (100% - 12px) / 75 - 1px)`;
        slider_container.appendChild(tick0);

        let ticktext0 = document.createElement("span");
        ticktext0.innerHTML = 0;
        ticktext0.classList.add("ticktext");
        ticktext0.style.top = "22px";
        ticktext0.style.right = `calc(6px + 70 * (100% - 12px) / 75 + 8px)`;
        slider_container.appendChild(ticktext0);

        let tick60 = document.createElement("div");
        tick60.classList.add("tickmark");
        tick60.style.left = `calc(6px + 65 * (100% - 12px) / 75 - 1px)`;
        slider_container.appendChild(tick60);
        
        let ticktext60 = document.createElement("span");
        ticktext60.innerHTML = 60;
        ticktext60.classList.add("ticktext");
        ticktext60.style.top = "22px";
        ticktext60.style.right = `calc(6px + 10 * (100% - 12px) / 75 + 8px)`;
        slider_container.appendChild(ticktext60);
    }
    
    updateThumb() {
        let slider = document.getElementById("time_slider" + this.id);
        let thumb_text = document.getElementById("thumb_text" + this.id);

        let value = this.sim.getTime() / 1000;
        let clamped_value = Math.max(-5, Math.min(value, 70));
        slider.value = clamped_value;

        thumb_text.innerHTML = Math.round(value);
        thumb_text.style.right = `calc(6px + ${70 - clamped_value} * (100% - 12px) / 75 + 8px)`

    }

    createTimeInput(time_control_container) {
        let input = document.createElement("input");
        input.type = "text";
        input.style.marginRight = "4px"; 
        input.style.marginLeft = "4px"; 

        input.onchange = () => {
            let value = input.value;
            if (!isNaN(value)) {
                this.sim.pause();
                this.sim.resetTime(parseFloat(value) * 1000);
                this.updateThumb();
            }
        }

        time_control_container.appendChild(input);
    }

    createKeyboardInput() {
        let canvas = this.view.getCanvas();
        let key_dictionary = {};

        canvas.onkeyup = canvas.onkeydown = (event) => {
            const is_pressed = event.type == "keydown";
            key_dictionary[event.code] = is_pressed;

            if (key_dictionary["KeyW"]) {
                this.view.increaseTranslationBy(new Vector(0, 2 + event.shiftKey*10));
            }
            if (key_dictionary["KeyA"]) {
                this.view.increaseTranslationBy(new Vector(2 + event.shiftKey*10, 0));
            }
            if (key_dictionary["KeyS"]) {
                this.view.increaseTranslationBy(new Vector(0, -2 - event.shiftKey*10));
            }
            if (key_dictionary["KeyD"]) {
                this.view.increaseTranslationBy(new Vector(-2 - event.shiftKey*10, 0));
            }
            if (key_dictionary["KeyI"]) {
                this.view.increaseScaleBy(1/1.2);
            }
            if (key_dictionary["KeyO"]) {
                this.view.increaseScaleBy(1.2);
            }
            if (key_dictionary["Space"]) {
                event.preventDefault();
                this.sim.toggle();
            }
            if (key_dictionary["Backspace"]) {
                this.sim.resetTime();
                this.updateThumb();
                //   update positions
            }
            if (key_dictionary["KeyB"] && event.shiftKey) {
                this.addParticle();
            }
        }
    }
}

export {ParticleProjectionIO as default}