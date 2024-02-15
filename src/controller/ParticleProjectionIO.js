import IOHandler from "./IOHandler.js";
import PointMass from "../model/particle-projection/PointMass.js";
import Vector from "../utility/Vector.js";
import ViewPointMass from "../view/ViewPointMass.js";
import PositionEvent from "../model/particle-projection/PositionEvent.js"


class ParticleProjectionIO extends IOHandler {
    constructor(id, sim, view) {
        super(id, sim, view)

        this.next_particle_id = 0;
        this.next_event_id = 0;

        this.body_list = [];

        console.log("ParticleProjectionIO instantiated");
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
        this.createParticleList(particle_area);
        //   then the particle list area first because
        //   the button will refer to it
        this.createNewParticleButton(container);
        //   then the button is created
    }

    createAreaTitle(container) {
        let title = document.createElement("p");
        title.classList.add("title");
        title.innerHTML = "List of particles";
        container.appendChild(title);
    }

    createParticleList(particle_area) {
        let particle_list = document.createElement("div");
        particle_list.id = "particle_list" + this.id;

        particle_area.appendChild(particle_list);
    }
    
    createNewParticleButton(container) {
        let button = document.createElement("button");
        button.innerHTML = "+";

        button.onclick = () => {
            this.createParticleInput();
        }

        container.appendChild(button);
    }

    createParticleInput() {
        let particle_input = document.getElementById("particle_input" + this.id);
        if (particle_input != undefined)
            particle_input.remove();

        particle_input = document.createElement("div");
        particle_input.id = "particle_input" + this.id;

        let particle_area = document.getElementById("particle_area" + this.id);
        particle_area.appendChild(particle_input);

        let title = document.createElement("p");
        title.innerHTML = "Particle " + this.next_particle_id;

        particle_input.appendChild(title);

        this.createPositionInput(particle_input);
        this.createVelocityInput(particle_input);
        this.createAddCancelParticleButtons(particle_input);
    }

    createPositionInput(particle_input) {
        let position_container = document.createElement("div");
        position_container.style.display = "flex";
        position_container.style.flexFlow = "row wrap";
    
        let position_title = document.createElement("p");
        position_title.innerHTML = "Position";

        let x_label = document.createElement("label");
        x_label.innerHTML = "x";

        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "position_x_input" + this.id;

        let y_label = document.createElement("label");
        y_label.innerHTML = "y";

        let y_input = document.createElement("input");
        y_input.type = "text";  
        y_input.id = "position_y_input" + this.id;

        position_container.appendChild(position_title);
        position_container.appendChild(x_label);
        position_container.appendChild(x_input);
        position_container.appendChild(y_label);
        position_container.appendChild(y_input);

        particle_input.appendChild(position_container);
    }

    createVelocityInput(particle_input) {
        let velocity_container = document.createElement("div");
        velocity_container.style.display = "flex";
        velocity_container.style.flexFlow = "row wrap";
    
        let velocity_title = document.createElement("p");
        velocity_title.innerHTML = "Velocity";

        let x_label = document.createElement("label");
        x_label.innerHTML = "x";

        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "velocity_x_input" + this.id;

        let y_label = document.createElement("label");
        y_label.innerHTML = "y";

        let y_input = document.createElement("input");
        y_input.type = "text";  
        y_input.id = "velocity_y_input" + this.id;

        velocity_container.appendChild(velocity_title);
        velocity_container.appendChild(x_label);
        velocity_container.appendChild(x_input);
        velocity_container.appendChild(y_label);
        velocity_container.appendChild(y_input);

        particle_input.appendChild(velocity_container);

    }
    
    createAddCancelParticleButtons(particle_input) {
        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.justifyContent = "space-between";

        let add_button = document.createElement("button");
        add_button.innerHTML = "Add";
        add_button.style.flexGrow = "1";
        add_button.onclick = () => {
            this.addParticle();
        }

        let cancel_button = document.createElement("button");
        cancel_button.innerHTML = "Cancel";
        cancel_button.style.flexGrow = "1";
        cancel_button.onclick = () => {
            document.getElementById("particle_input" + this.id).remove();
        }

        container.appendChild(add_button);
        container.appendChild(cancel_button);

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
    }

    createParticleOutput(particle) {
        let particle_list = document.getElementById("particle_list" + this.id);

        let container = document.createElement("div");
        container.style.display = "flex";

        let title = document.createElement("p");
        title.innerHTML = "Particle " + particle.getId();

        let output_container = document.createElement("div");

        this.createPositionOutput(output_container, particle.getId());
        this.createVelocityOutput(output_container, particle.getId());

        container.appendChild(title);
        container.appendChild(output_container);

        particle_list.appendChild(container);

        this.createRemoveButton(container, particle_list, particle.getId());
    }

    createPositionOutput(output_container, particle_id) {
        let position_ouput = document.createElement("div");
        position_ouput.style.display = "flex";

        let x_label = document.createElement("label");
        x_label.innerHTML = "x";
        let y_label = document.createElement("label");
        y_label.innerHTML = "y";

        let x_value = document.createElement("p");
        x_value.id = "position_x_value" + particle_id + "_" + this.id;
        let y_value = document.createElement("p");
        y_value.id = "position_y_value" + particle_id + "_" + this.id;

        position_ouput.appendChild(x_label);
        position_ouput.appendChild(x_value);
        position_ouput.appendChild(y_label);
        position_ouput.appendChild(y_value);

        output_container.appendChild(position_ouput);
    }

    createVelocityOutput(output_container, particle_id) {
        let velocity_ouput = document.createElement("div");
        velocity_ouput.style.display = "flex";

        let x_label = document.createElement("label");
        x_label.innerHTML = "x";
        let y_label = document.createElement("label");
        y_label.innerHTML = "y";

        let x_value = document.createElement("p");
        x_value.id = "velocity_x_value" + particle_id + "_" + this.id;
        let y_value = document.createElement("p");
        y_value.id = "velocity_y_value" + particle_id + "_" + this.id;
        
        velocity_ouput.appendChild(x_label);
        velocity_ouput.appendChild(x_value);
        velocity_ouput.appendChild(y_label);
        velocity_ouput.appendChild(y_value);

        output_container.appendChild(velocity_ouput);
    }

    createRemoveButton(container, particle_list, particle_id) {
        let button = document.createElement("button");
        button.style.width = "100px";
        //   temporary
        button.innerHTML = "Remove";
        button.onclick = () => {
            let particle = this.body_list[particle_id];
            this.sim.deleteBody(particle);
            this.view.deleteBody(particle);

            this.body_list[particle_id] = null;

            container.remove();
            button.remove();
        }
        
        particle_list.appendChild(button);
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

        x_value.innerHTML = Math.trunc(position.x * 1000) / 1000;
        y_value.innerHTML = Math.trunc(position.y * 1000) / 1000;
    }

    updateVelocityOutput(particle) {
        let x_value = document.getElementById("velocity_x_value" + particle.getId() + "_" + this.id);
        let y_value = document.getElementById("velocity_y_value" + particle.getId() + "_" + this.id);

        let velocity = particle.getVelocity();

        x_value.innerHTML = Math.trunc(velocity.x * 1000) / 1000;
        y_value.innerHTML = Math.trunc(velocity.y * 1000) / 1000;
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

        this.createNewEventButton(container);
    }

    createNewEventButton(container) {
        let button = document.createElement("button");
        button.innerHTML = "+";

        button.onclick = () => {
            this.createEventInput();
        }

        container.appendChild(button);
    }

    createEventInput() {
        let event_input = document.getElementById("event_input" + this.id);
        if (event_input != undefined)
            event_input.remove();
        
        let event_area = document.getElementById("event_area" + this.id);

        event_input = document.createElement("div");
        event_input.id = "event_input" + this.id;

        let title = document.createElement("p");
        title.innerHTML = "Event " + this.next_event_id;
        event_input.appendChild(title);

        this.createEventTypeChoice(event_input);
        this.createParticleChoice(event_input);

        let condition = document.createElement("p");
        condition.innerHTML = "Condition";
        event_input.appendChild(condition);

        let condition_container = document.createElement("div");
        condition_container.id = "condition_container" + this.id;
        event_input.appendChild(condition_container);
        //   a container where condition input will reside
        //   created before actual conditions for 
        //   the buttons to be below conditions

        event_area.appendChild(event_input);

        this.createAddCancelEventButtons(event_input);
    }

    createEventTypeChoice(event_input) {
        let drop_down = document.createElement("select");
        drop_down.id = "event_type_choice" + this.id;

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Choose Event Type";
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
            this.createConditionInput(drop_down);
        }
    }

    createParticleChoice(event_input) {
        let drop_down = document.createElement("select");
        drop_down.id = "particle_choice" + this.id;

        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Choose The Particle";
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

        event_input.appendChild(drop_down);
    }

    createConditionInput(drop_down) {
        let condition_input = document.getElementById("condition_input" + this.id);
        if (condition_input != undefined)
            condition_input.remove();

        let choice = parseInt(drop_down.value);

        let add_button = document.getElementById("add_event_button" + this.id);

        switch (choice) {
            case -1:
                add_button.onclick = null;
                break;
            case 0:
                //   Position Event
                add_button.onclick = () => {
                    this.addPositionEvent();
                }
                this.createPositionEventInput();
                break;
            case 1:
                //   Velocity Event
                add_button.onclick = () => {
                    this.addVelocityEvent();
                }
                this.createVelocityEventInput();
                break;
            case 2:
                //   Time Event
                add_button.onclick = () => {
                    this.addTimeEvent();
                }
                this.createTimeEventInput();
                break;
        }
    }

    createPositionEventInput() {
        let condition_container = document.getElementById("condition_container" + this.id);
        
        let condition_input = document.createElement("div");
        condition_input.id = "condition_input" + this.id;
        condition_input.style.display = "flex";

        let x_input_container = document.createElement("div");
        let x_label = document.createElement("label");
        x_label.innerHTML = "x";
        
        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "x_event_condition" + this.id;

        x_input_container.appendChild(x_label);
        x_input_container.appendChild(x_input);

        condition_input.appendChild(x_input_container);

        let y_input_container = document.createElement("div");
        let y_label = document.createElement("label");
        y_label.innerHTML = "y";
        
        let y_input = document.createElement("input");
        y_input.type = "text";
        y_input.id = "y_event_condition" + this.id;

        y_input_container.appendChild(y_label);
        y_input_container.appendChild(y_input);

        condition_input.appendChild(y_input_container);

        condition_container.appendChild(condition_input);
    }

    createVelocityEventInput() {
        let condition_container = document.getElementById("condition_container" + this.id);
        
        let condition_input = document.createElement("div");
        condition_input.id = "condition_input" + this.id;
        condition_input.style.display = "flex";

        let x_input_container = document.createElement("div");
        let x_label = document.createElement("label");
        x_label.innerHTML = "vx";
        
        let x_input = document.createElement("input");
        x_input.type = "text";
        x_input.id = "vx_event_condition" + this.id;

        x_input_container.appendChild(x_label);
        x_input_container.appendChild(x_input);

        condition_input.appendChild(x_input_container);

        let y_input_container = document.createElement("div");
        let y_label = document.createElement("label");
        y_label.innerHTML = "vy";
        
        let y_input = document.createElement("input");
        y_input.type = "text";
        y_input.id = "vy_event_condition" + this.id;

        y_input_container.appendChild(y_label);
        y_input_container.appendChild(y_input);

        condition_input.appendChild(y_input_container);

        condition_container.appendChild(condition_input);
    }
    //   x -> vx, y -> vy

    createTimeEventInput() {
        let condition_container = document.getElementById("condition_container" + this.id);
        
        let condition_input = document.createElement("div");
        condition_input.id = "condition_input" + this.id;
        condition_input.style.display = "flex";

        let time_input_container = document.createElement("div");
        let label_start = document.createElement("label");
        label_start.innerHTML = "Stop after";
        
        let label_finish = document.createElement("label");
        label_finish.innerHTML = "seconds";

        let time_input = document.createElement("input");
        time_input.type = "text";
        time_input.id = "time_event_condition" + this.id;

        time_input_container.appendChild(label_start);
        time_input_container.appendChild(time_input);
        time_input_container.appendChild(label_finish);

        condition_input.appendChild(time_input_container);

        condition_container.appendChild(condition_input);
    }

    createAddCancelEventButtons(event_input) {
        let button_container = document.createElement("div");
        button_container.style.display = "flex";
        
        let add_button = document.createElement("button");
        add_button.style.flexGrow = "1";
        add_button.id = "add_event_button" + this.id;
        add_button.innerHTML = "Add";
        //   onclick will be defined when the drop down is changed 

        let cancel_button = document.createElement("button");
        cancel_button.style.flexGrow = "1";
        cancel_button.innerHTML = "Cancel";

        cancel_button.onclick = () => {
            event_input.remove();
        }

        button_container.appendChild(add_button);
        button_container.appendChild(cancel_button);

        event_input.appendChild(button_container);
    }

    addPositionEvent() {
        let x_value = document.getElementById("x_event_condition" + this.id).value;
        let y_value = document.getElementById("y_event_condition" + this.id).value;

        let particle_id = parseInt(document.getElementById("particle_choice" + this.id).value);
        //   add validations
        let particle = this.body_list[particle_id];

        let event = new PositionEvent(particle, this, this.next_event_id++);

        if (!isNaN(x_value) && !(x_value === ""))
            event.setXtime(x_value);
        else if (!isNaN(y_value) && !(y_value === ""))
            event.setYtime(y_value);
        else {
            console.log("invalid 0");
            return;
        }

        if (!event.isValid()) {
            console.log("invalid");
            return;
        }

        this.sim.addEvent(event);
    }

    addVelocityEvent() {

    }

    addTimeEvent() {

    }



    // createParticleArea() {
    //     let particle_area = document.createElement("div");
    //     let title =  document.createElement("p");
    //     title.innerHTML = "list of particles";

    //     particle_area.appendChild(title);
        // create dedicated section on the I/O area
        // put the “List of particles” title on the section
        // create particle list section on the particle area
        // //   this section is dedicated for the list of particle which is 
        // //   initially empty
        // create the “add_particle_button”
        // “add_particle_button” listen for the click
        //     invoke this.addParticle() function on click
        // //   this function starts the process of adding a new particle 
    
    // }

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