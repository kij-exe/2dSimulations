import IOHandler from "./IOHandler.js";
import PointMass from "../model/particle-projection/PointMass.js";
import Vector from "../utility/Vector.js";
import ViewPointMass from "../view/ViewPointMass.js";
import PositionEvent from "../model/particle-projection/PositionEvent.js"
import VelocityEvent from "../model/particle-projection/VelocityEvent.js"
import TimeEvent from "../model/particle-projection/TimeEvent.js"


class ParticleProjectionIO extends IOHandler {
    constructor(id, sim, view) {
        super(id, sim, view)

        this.next_particle_id = 0;
        this.next_event_id = 0;

        this.body_list = [];

        console.log("ParticleProjectionIO instantiated");

        this.initialize();
    }

    initialize() {
        this.createParticleArea();
        this.createEventArea();
        // this.createTimeSlider();

    }

    createParticleArea() {
        let particle_area = document.createElement("div");
        particle_area.id = "particle_area" + this.id;

        this.io_area.appendChild(particle_area);

        let container = document.createElement("div");
        container.style.display = "flex";
        particle_area.appendChild(container);

        this.createAreaTitle(container);
        //   first the title is created
        this.createParticleInput(particle_area);
        //   create an input area
        this.createParticleList(particle_area);
        //   then the particle list area first because
        //   the button will refer to it
        this.createParticleMenuButton(container);
        //   then the button is created
    }

    createAreaTitle(container) {
        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.innerHTML = "List of particles";
        container.appendChild(title);
    }

    createParticleList(particle_area) {
        let particle_list = document.createElement("div");
        particle_list.id = "particle_list" + this.id;

        particle_area.appendChild(particle_list);
    }
    
    createParticleMenuButton(container) {
        let button = document.createElement("button");
        button.innerHTML = "<";

        button.onclick = () => {
            let particle_input = document.getElementById("particle_input" + this.id);
            if (particle_input.style.display == "none") {
                button.innerHTML = "v";
                particle_input.style.display = "block";
            }
            else {
                button.innerHTML = "<";
                particle_input.style.display = "none";
            }
        }

        container.appendChild(button);
    }

    createParticleInput(particle_area) {
        let particle_input = document.createElement("div");
        particle_input.classList.add("box");
        particle_input.style.display = "none";
        particle_input.id = "particle_input" + this.id;

        particle_area.appendChild(particle_input);

        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.id = "particle_input_title" + this.id;
        title.innerHTML = "New Particle " + this.next_particle_id;

        let top_container = document.createElement("div");
        top_container.style.display = "flex";
        top_container.style.flexFlow = "wrap";
        top_container.appendChild(title);

        particle_input.appendChild(top_container);

        this.createPositionInput(top_container);
        this.createVelocityInput(top_container);

        this.createAddParticleButton(particle_input);
    }

    createPositionInput(top_container) {
        let position_container = document.createElement("div");
        position_container.style.display = "flex";
    
        let position_title = document.createElement("p");
        position_title.innerHTML = "Position =  ";

        let column = this.createColumn(
            "position_x_input" + this.id,
            "position_y_input" + this.id
        );

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
        column.innerHTML = `<math xmlns="http://www.w3.org/1998/Math/MathML">
                                <mrow>
                                    <mo>(</mo>
                                    <mtable>
                                        <mtr>
                                            <mtd><mi><input id="${top_id}"/></mi></mtd>
                                        </mtr>
                                        <mtr>
                                            <mtd><mi><input id="${bottom_id}"/></mi></mtd>
                                        </mtr>
                                    </mtable>
                                    <mo>)</mo>
                                </mrow>
                            </math>`
        return column;
    }
    
    createAddParticleButton(particle_input) {
        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "space-between";

        let add_button = document.createElement("button");
        add_button.innerHTML = "Add";
        add_button.style.flexGrow = "1";
        add_button.onclick = () => {
            this.addParticle();
        }

        container.appendChild(add_button);

        particle_input.appendChild(container);
        
    }

    addParticle() {
        let position_x = document.getElementById("position_x_input" + this.id).value;
        let position_y = document.getElementById("position_y_input" + this.id).value;
        let velocity_x = document.getElementById("velocity_x_input" + this.id).value;
        let velocity_y = document.getElementById("velocity_y_input" + this.id).value;

        // validations to add

        let particle = new PointMass(
            new Vector(parseInt(position_x), parseInt(position_y)),
            new Vector(parseInt(velocity_x), parseInt(velocity_y)),
            new Vector(0, -9.8),
            this.sim.getTime(),
            this.next_particle_id++
        );
        this.sim.addBody(particle);

        let view_particle = new ViewPointMass(particle, "red");
        this.view.addBody(view_particle);

        this.body_list.push(particle);

        this.createParticleOutput(particle);

        this.resetParticleChoice();
        //   reset the select element for the events
        //   because new particle has been added

        let particle_input_title = document.getElementById("particle_input_title" + this.id);
        particle_input_title.innerHTML = "New Particle " + this.next_particle_id;
    }

    createParticleOutput(particle) {
        let particle_list = document.getElementById("particle_list" + this.id);

        let output_container = document.createElement("div");
        output_container.classList.add("box");

        let top_container = document.createElement("div");
        top_container.style.display = "flex";

        let title = document.createElement("p");
        title.style.marginRight = "auto";
        title.innerHTML = "Particle " + particle.getId();
        top_container.appendChild(title);

        this.createPositionOutput(top_container, particle.getId());
        this.createVelocityOutput(top_container, particle.getId());

        output_container.appendChild(top_container);

        particle_list.appendChild(output_container);

        this.createRemoveButton(output_container, particle.getId());
    }

    createPositionOutput(top_container, particle_id) {
        let position_ouput = document.createElement("div");
        position_ouput.style.display = "flex";

        let position_title = document.createElement("p");
        position_title.innerHTML = "Position = ";

        let column = this.createColumn(
            "position_x_value" + particle_id + "_" + this.id,
            "position_y_value" + particle_id + "_" + this.id
        );

        position_ouput.appendChild(position_title);
        position_ouput.appendChild(column);

        top_container.appendChild(position_ouput);
    }

    createVelocityOutput(top_container, particle_id) {
        let velocity_ouput = document.createElement("div");
        velocity_ouput.style.display = "flex";

        let velocity_title = document.createElement("p");
        velocity_title.innerHTML = "Velocity = ";

        let column = this.createColumn(
            "velocity_x_value" + particle_id + "_" + this.id,
            "velocity_y_value" + particle_id + "_" + this.id
        );

        velocity_ouput.appendChild(velocity_title);
        velocity_ouput.appendChild(column);

        top_container.appendChild(velocity_ouput);
    }

    createRemoveButton(output_container, particle_id) {
        let button = document.createElement("button");
        button.style.width = "100px";
        //   temporary
        button.innerHTML = "Remove";
        button.onclick = () => {
            let particle = this.body_list[particle_id];
            this.sim.deleteBody(particle);
            this.view.deleteBody(particle);

            this.body_list[particle_id] = null;

            this.resetParticleChoice();
            //   reset a particle drop down

            output_container.remove();
            button.remove();
        }
        
        output_container.appendChild(button);
    }

    update() {
        for (let particle of this.body_list) {
            if (particle == null)
                continue;
            this.updatePositionOutput(particle);
            this.updateVelocityOutput(particle);
        }
    }

    updatePositionOutput(particle) {
        let x_value = document.getElementById("position_x_value" + particle.getId() + "_" + this.id);
        let y_value = document.getElementById("position_y_value" + particle.getId() + "_" + this.id);

        let position = particle.getPosition();

        x_value.value = Math.trunc(position.x * 1000) / 1000;
        y_value.value = Math.trunc(position.y * 1000) / 1000;
    }

    updateVelocityOutput(particle) {
        let x_value = document.getElementById("velocity_x_value" + particle.getId() + "_" + this.id);
        let y_value = document.getElementById("velocity_y_value" + particle.getId() + "_" + this.id);

        let velocity = particle.getVelocity();

        x_value.value = Math.trunc(velocity.x * 1000) / 1000;
        y_value.value = Math.trunc(velocity.y * 1000) / 1000;
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
    }

    createEventMenuButton(container) {
        let button = document.createElement("button");
        button.innerHTML = "<";

        button.onclick = () => {
            let event_input = document.getElementById("event_input" + this.id);
            let event_title = document.getElementById("event_title" + this.id);

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
        
        this.createAddEventButton(event_input);
    }

    createEventTypeChoice(event_input) {
        let drop_down = document.createElement("select");
        drop_down.id = "event_type_choice" + this.id;

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Event Type";
        drop_down.appendChild(option);

        let event_types = ["Position Event", "Velocity Event", "Time Event"];

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

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Particle";
        drop_down.appendChild(option);

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
                position_condition.style.display = "flex";
                add_button.onclick = () => {
                    this.addPositionEvent();
                }
                break;
            case "1":
                //   Velocity Event
                velocity_condition.style.display = "flex";
                add_button.onclick = () => {
                    this.addVelocityEvent();
                }
                break;
            case "2":
                //   Time Event
                time_condition.style.display = "flex";
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

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        //   add validations
        let particle = this.body_list[particle_id];

        let event = new PositionEvent(particle, this, this.next_event_id);

        if (!isNaN(x_value) && !(x_value === ""))
            event.setXtime(parseInt(x_value));
        else if (!isNaN(y_value) && !(y_value === ""))
            event.setYtime(parseInt(y_value));
        else {
            console.log("invalid 0");
            return;
        }

        if (!event.isValid()) {
            console.log("invalid");
            return;
        }

        this.sim.addEvent(event);

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    addVelocityEvent() {
        let x_value = document.getElementById("vx_event_condition" + this.id).value;
        let y_value = document.getElementById("vy_event_condition" + this.id).value;

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        //   add validations
        let particle = this.body_list[particle_id];

        let event = new VelocityEvent(particle, this, this.next_event_id);

        if (!isNaN(x_value) && !(x_value === ""))
            event.setXtime(parseInt(x_value));
        else if (!isNaN(y_value) && !(y_value === ""))
            event.setYtime(parseInt(y_value));
        else {
            console.log("invalid 0");
            return;
        }

        if (!event.isValid()) {
            console.log("invalid");
            return;
        }

        this.sim.addEvent(event);

        this.next_event_id++;
        this.resetNextEventTitle();

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    addTimeEvent() {
        let time = document.getElementById("time_event_condition" + this.id).value;

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        //   add validations
        let particle = this.body_list[particle_id];

        let event = new TimeEvent(particle, this, this.next_event_id);

        if (isNaN(time) || (time === ""))
            return;
        
        event.setTime(time);

        if (!event.isValid()) {
            console.log("invalid");
            return;
        }

        this.sim.addEvent(event);

        this.next_event_id++;
        this.resetNextEventTitle();
    }

    // createEventArea() {
        // create dedicated section on the I/O area
        // put the drop-down list on the section
        // //   options of the list are PositionEvent/VelocityEvent/TimeEvent
        // //   it defines the type of event to be added
        // create occurred events section on the event area
        // //   initially empty 
        // create the “add_event_button”
        // “add_event_button” listen for the click
        //     invoke this.addEvent() function on click
        // //   this function starts the process of adding a new event
    
    // }

    // createTimeSlider() {

    // }
}
//   update event drop-down every time a particle gets deleted or created!!!!!!!!

export {ParticleProjectionIO as default}