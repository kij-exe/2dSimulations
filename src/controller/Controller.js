import ParticleProjectionSim from "../model/particle-projection/ParticleProjectionSim.js";
import GeneralPurposeSim from "../model/general-purpose/GeneralPurposeSim.js";
import ParticleProjectionIO from "./ParticleProjectionIO.js";
import GeneralPurposeIO from "./GeneralPurposeIO.js";
import ViewSim from "../view/ViewSim.js";
import Simulation from "../model/Simulation.js";
import PriorityQueue from "../utility/PriorityQueue.js"


class Controller {
    constructor() {
        this.sim_list = [];
        this.view_list = [];
        this.io_list = [];
        //   lists of simulations, views and input/output handlers, the 
    	//   simulation, its view and io handler are stored by the same
        //   index in the list

        this.sim_names = ["Particle projection simulation", 
                        "General-purpose simulation"];
        this.sim_classes = ["ParticleProjection", "GeneralPurpose"];
        //   lists of simulation names and their class identifiers
        //   can be easily changed if a new simulation is added
        
        this.select = document.createElement("select");
        //   creating a select element for a dropdown menu
        
        let option = document.createElement("option");
        option.value = -1
        option.innerHTML = "Choose a simulation";
        this.select.appendChild(option)
        //   add a default option to the drop-down menu that prompts the
        //   user to choose a simulation
        
        for (let i = 0; i < this.sim_names.length; i++) {
            let option = document.createElement("option");
            //   creating an option
            option.value = i;
            //   value to associate an option with a simulation
            option.innerHTML = this.sim_names[i];
            //   fills option with the name of the simulation 
            this.select.appendChild(option);
            //   add the option to the dropdown menu
        }
        //   value of each option will correspond to the index of
        //   corresponding simulation in the sim_list and to the
        //   name of its group of classes
    
        let add_sim_button = document.createElement("button");
        //   instantiating a button that creates a new simulation
        add_sim_button.innerHTML = "+";

        add_sim_button.onclick = () => {
            this.addSim();
        }
        //   assigning the function of adding a simulation to the button
        //   click on the button will invoke an add_sim function
        //   of the controller with associated index that is selected
    
        this.next_id = 0;
        //   id of the next simulation

        let body_element = document.getElementsByTagName("body")[0];
        
        //   retreive the body tag from the page
        body_element.appendChild(this.select);
        body_element.appendChild(add_sim_button);
        //   put the dropdown and the button on the screen
        
        requestAnimationFrame((timestamp) => {
            this.prev_timestamp = timestamp;
            //   the first instance when the update method is called
            this.update(timestamp);
            //   start the update loop
        });
    }

    update(timestamp) {
        let dt = timestamp - this.prev_timestamp;
        //   calculating time from the last update
        this.prev_timestamp = timestamp;

        for (let i = 0; i < this.sim_list.length; i++) {
            if (this.sim_list[i].isActive()) {
                //   update and redraw every active simulation
                this.sim_list[i].update(dt);
                this.view_list[i].redraw();
            }
        }

        requestAnimationFrame((timestamp) => {
            this.update(timestamp);
        });
    }

    addSim() {
        let index = parseInt(this.select.value);
        //   temporary variable for the option on the dropdown menu
        if (index === -1)
            return
        //   if no option is chosen (value of -1), no simulation is added
	
        let class_group = this.sim_classes[index];
	    //   name of the group of classes the added simulation belongs to

	    let body_element = document.getElementsByTagName("body")[0];
        //   retrieve the body element
        let sim_area = document.createElement("div");
        sim_area.id = "sim_area" + this.next_id.toString();
        //   assigning an identifier to the new simulation area

        let sim = eval("new " + class_group + "Sim()"); 
        this.sim_list.push(sim);
        //   instantiating sim object for the new simulation and
        //   adding it to the list 

        let terminate_sim_button = document.createElement("button");
        terminate_sim_button.innerHTML = "X";
        terminate_sim_button.classList.add("sim_area_button");

        let pause_sim_button = document.createElement("button");
        pause_sim_button.innerHTML = "||";
        pause_sim_button.classList.add("sim_area_button");

        let continue_sim_button = document.createElement("button");
        continue_sim_button.innerHTML = ">";
        continue_sim_button.classList.add("sim_area_button");
        //   instantiating buttons, labeling them and assigning
        //   a sim_area_button CSS class

        terminate_sim_button.onclick = () => {
            this.terminateSim(sim);
        }

        pause_sim_button.onclick = () => {
            sim.pause();
        }

        continue_sim_button.onclick = () => {
            sim.continue();
        }
        //   adding buttons that terminate, pause and continue the simulation
        //   and assigning to them corresponding function using clousers

        let title = document.createElement("p");
        title.innerHTML = this.sim_names[index];
        title.classList.add("title");
        //   creating a title paragraph html tag and setting its 
        //   content to the name of the new simulation being added

        let container = document.createElement("div");
        container.style.display = "flex";
        container.appendChild(title);
        container.appendChild(pause_sim_button);
        container.appendChild(continue_sim_button);
        container.appendChild(terminate_sim_button);

        sim_area.appendChild(container);
        //   adding buttons and the title on the sim_area

        body_element.appendChild(sim_area);

        let view = new ViewSim(this.next_id);
        this.view_list.push(view);
        let io = eval("new " + class_group + "IO(this.next_id, sim, view)");
        this.io_list.push(io);
        //   creating ViewSim and IOHandler objects

        this.next_id++;
        //   increment id for the next simulation
    }

    terminateSim(sim) {
        for (let i = 0; i < this.sim_list.length; i++) {
            if (this.sim_list[i] == sim) {
                //   i will represent an index of the simulation in the lists
                let id = this.view_list[i].getId();
                //   getting an id of the simulation
                let sim_area = document.getElementById("sim_area" + id);
                sim_area.remove();
                //   remove entire simulation area

                this.sim_list.splice(i, 1);
                this.view_list.splice(i, 1);
                this.io_list.splice(i, 1);
                //   remove all references to the simulation from the controller lists

                return
                //   stop the function as the simulation was found
            }
        }
    }
}


export {Controller as default}