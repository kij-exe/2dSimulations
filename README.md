# Particle Projection Simulation | Y13 Project

Static web application that allows to interactively launch particles with different velocities and observe their trajectories.
Can be accessed by the link https://kij-exe.github.io/2dSimulations/.

- Create a new simulation
- You can add new particles either with a list of particles drop-down menu or by clicking on the canvas twice to define a velocity vector and press Shift + B to launch a new particle.
- Simulation can be started and stopped/continued by pressing Space key (first need to click on the canvas).
- You can reset the simulation to its initial state with the Backspace key.
- You can zoom in and out with I/O keys.
- WASD keys are used to move the camera around the simulation space (press Shift + W/A/S/D to speed up) 

The event system allows to create stopping points for simulation to track specific conditions. In this way, you can stop the simulation when a particle reaches a specific speed or position by the x or y-axis. For example, you can get the position of a particle when it is at its highest point on trajectory. All you need to do is set up an event for when the particle reaches the speed of 0 by the y-axis and observe the position of a particle on the window on the right when the simulation stops.
