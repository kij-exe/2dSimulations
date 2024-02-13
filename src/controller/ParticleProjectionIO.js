import IOHandler from "./IOHandler.js";
import PointMass from "../model/particle-projection/PointMass.js";
import Vector from "../utility/Vector.js";
import ViewPointMass from "../view/ViewPointMass.js";


class ParticleProjectionIO extends IOHandler {
    constructor(id, sim, view) {
        super(id, sim, view)

        this.next_particle_id = 0;
        this.next_event_id = 0;
        console.log("ParticleProjectionIO instantiated");
    }

    initialize() {
        this.createParticleArea();
        // this.createEventArea();
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
        let particle_list = this.createParticleList(particle_area);
        //   then the particle list area first because
        //   the button will refer to it
        this.createNewParticleButton(container, particle_list);
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
        particle_area.appendChild(particle_list);

        return particle_list;
    }
    
    createNewParticleButton(container, particle_list) {
        let button = document.createElement("button");
        button.innerHTML = "+";

        button.onclick = () => {
            this.createParticleInput(particle_list);
        }

        container.appendChild(button);
    }

    createParticleInput(particle_list) {
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
        this.createAddCancelButtons(particle_input);
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
    
    createAddCancelButtons(particle_input) {
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


export {ParticleProjectionIO as default}