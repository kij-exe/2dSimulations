import Simulation from "../Simulation.js";
import PriorityQueue from "../../utility/PriorityQueue.js";
import Event from "./Event.js"
import TimeEvent from "./TimeEvent.js";


class ParticleProjectionSim extends Simulation {
    constructor() {
        super();
        this.event_queue = new PriorityQueue(Event.compare);
        this.test();
    }

    update(dt) {
        console.log(dt);
        //   parameter dt denotes the change in time from the previous 
        //   frame 
        this.time += dt;

        let event = this.event_queue.peek();
        //   peek the first event from the queue	
        // console.log(dt);
        
        console.log("seconds now " + this.time/1000)
        if (!this.event_queue.isEmpty() && event.getTime() < this.time) {
            console.log("event found")
            //   if the time the event occurs is greater than the
            //   current time the simulation is at
            event.execute();
            this.pause();
            //   execute the procedure defined when event was created
            this.time = event.getTime();
            //   set the time of the simulation to the moment when
            //   event has occured
            this.event_queue.pop();
            //   remove event from the queue
        }

        for (let i = 0; i < this.body_list.length; i++) {
            this.body_list[i].update(this.time);
        }
    }

    addEvent(event) {
        this.event_queue.push(event);
    }

    test() {
        // for (let time of [5, 10, 12, 20]) {
        //     let event = new TimeEvent(null, null, 0);
        //     event.setTime(time*1000);
        //     //   time multiplied by 1000 to convert it to miliseconds
        //     this.event_queue.push(event);
        // }
    }
}


export {ParticleProjectionSim as default};