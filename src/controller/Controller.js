import ParticleProjectionSim from "../model/particle-projection/ParticleProjectionSim.js";
import GeneralPurposeSim from "../model/general-purpose/GeneralPurposeSim.js";
import ParticleProjectionIO from "./ParticleProjectionIO.js";
import GeneralPurposeIO from "./GeneralPurposeIO.js";
import ViewSim from "../view/ViewSim.js";


class Controller {
    constructor() {
        this.sim_list = [];
        this.view_list = [];
        this.io_list = [];
        //   lists of simulations, views and input/output handlers, the 
    	//   simulation, its view and io handler are stored by the same
        //   index in the list

        this.sim_names = ["Particle projection simulation" 
                         /*"General-purpose simulation"*/];
        this.sim_classes = ["ParticleProjection"/*"GeneralPurpose"*/];
        //   lists of simulation names and their class identifiers
        //   can be easily changed if a new simulation is added

        this.createSimulationsDropDown();

        this.next_id = 0;
        //   id of the next simulation

        this.createAddSimButton();

        document.addEventListener('mouseup', (event) => {
            let canvasElements = document.getElementsByTagName("canvas");
            if (
                (
                    document.activeElement === null ||
                    document.activeElement === document.body ||
                    document.activeElement.tagName === "BUTTON" ||
                    document.activeElement.type == "range"
                ) &&
                canvasElements.length > 0
            ) {
                canvasElements[0].focus();
            }
        });

        this.startUpdateLoop();
    }

    createSimulationsDropDown() {
        this.select = document.createElement("select");
        this.select.style.marginRight = "auto";
        //   creating a select element for a dropdown menu
        
        let option = document.createElement("option");
        option.value = -1;
        option.innerHTML = "Choose a simulation";
        this.select.appendChild(option);
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

        let header = document.getElementById("header");
        //   retreive the body tag from the page
        header.appendChild(this.select);
        //   add the drop-down on the page
    }
    
    createAddSimButton() {
        let add_sim_button = document.createElement("button");
        //   instantiating a button that creates a new simulation
        add_sim_button.innerHTML = "+";

        add_sim_button.onclick = () => {
            this.addSim();
        }
        //   assigning the function of adding a simulation to the button
        //   click on the button will invoke an add_sim function
        //   of the controller with associated index that is selected

        let header = document.getElementById("header");       
        //   retreive the body tag from the page
        header.appendChild(add_sim_button);
    }

    startUpdateLoop() {     
        requestAnimationFrame((timestamp) => {
            this.prev_timestamp = timestamp;
            //   the first instance when the update method is called
            this.update(timestamp);
            //   start the update loop
        });
    }

    update(timestamp) {
        let dt = timestamp - this.prev_timestamp;
        //   calculating time elapsed from the last frame
        this.prev_timestamp = timestamp;
        //   for the next update call to calculate dt

        for (let i = 0; i < this.sim_list.length; i++) {
            if (this.sim_list[i].isActive()) {
                //   update and redraw every active simulation
                this.sim_list[i].update(dt);
            }

            this.view_list[i].redraw();
            this.io_list[i].update();
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

        let sim_area = this.createSimArea();

        let sim = eval("new " + class_group + "Sim()"); 
        this.sim_list.push(sim);
        //   instantiating sim object for the new simulation and
        //   adding it to the list 

        this.createSimHeader(sim, sim_area, index);

        let canvas_time_io_container = document.createElement("div");
        canvas_time_io_container.id = "canvas_time_io_container" + this.next_id;
        canvas_time_io_container.style.display = "flex";
        sim_area.appendChild(canvas_time_io_container);
        //   container for io area, canvas and time control

        let canvas_time_container = document.createElement("div");
        // canvas_time_container.style.display = "flex";
        // canvas_time_container.style.flexDirection = "column";
        canvas_time_container.id = "canvas_time_container" + this.next_id;
        canvas_time_io_container.appendChild(canvas_time_container);
        //   container for canvas and time control

        let view = new ViewSim(this.next_id, canvas_time_container);
        this.view_list.push(view);
        let io = eval("new " + class_group + "IO(this.next_id, sim, view, canvas_time_io_container)");
        this.io_list.push(io);
        //   creating ViewSim and IOHandler objects

        this.next_id++;
        //   increment id for the next simulation;
    }

    createSimArea() {
        let sim_area = document.createElement("div");
        sim_area.id = "sim_area" + this.next_id.toString();
        //   assigning an identifier to the new simulation area
        
        sim_area.classList.add("box");
        sim_area.style.marginTop = "10px";
        sim_area.style.marginBottom = "10px";

        //   sim area styling

	    let body_element = document.getElementsByTagName("body")[0];
        //   retrieve the body element
        body_element.appendChild(sim_area);

        return sim_area;
    }

    createSimHeader(sim, sim_area, index) {
        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.width = "100%";

        let title = document.createElement("p");
        title.innerHTML = this.sim_names[index];
        title.style.marginRight = "auto";
        //   creating a title paragraph html tag and setting its 
        //   content to the name of the new simulation being added
        container.appendChild(title);

        this.createSimButtons(sim, container);

        sim_area.appendChild(container);
        //   adding buttons and the title on the sim_area
    }

    createSimButtons(sim, container) {
        let terminate_sim_button = document.createElement("button");
        terminate_sim_button.innerHTML = "&#10006;";
        terminate_sim_button.classList.add("sim_area_button");

        let pause_sim_button = document.createElement("button");
        pause_sim_button.innerHTML = "&#10073;&#10073;";
        pause_sim_button.classList.add("sim_area_button");

        let continue_sim_button = document.createElement("button");
        continue_sim_button.innerHTML = "&#9654;";
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
        
        container.appendChild(pause_sim_button);
        container.appendChild(continue_sim_button);
        container.appendChild(terminate_sim_button);
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

                return;
                //   stop the function as the simulation was found
            }
        }
    }
}


export {Controller as default}