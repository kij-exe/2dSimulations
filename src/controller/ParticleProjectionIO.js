import IOHandler from "./IOHandler.js";


class ParticleProjectionIO extends IOHandler {
    constructor(id, sim, view) {
        super(id, sim, view)
        console.log("ParticleProjectionIO instantiated");
    }

    initialize() {
        this.createParticleArea();
        this.createEventArea();
        this.createTimeSlider();
    }

    createParticleArea() {
        // create dedicated section on the I/O area
        // put the “List of particles” title on the section
        // create particle list section on the particle area
        // //   this section is dedicated for the list of particle which is 
        // //   initially empty
        // create the “add_particle_button”
        // “add_particle_button” listen for the click
        //     invoke this.addParticle() function on click
        // //   this function starts the process of adding a new particle 
    
    }

    createEventArea() {
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
    
    }

    createTimeSlider() {

    }
}


export {ParticleProjectionIO as default}