import Body from "../Body.js";


class PointMass extends Body {
    constructor(initial_position, initial_velocity, acceleration, created_at, id = null) {
        super(id);
        this.initial_position = initial_position;
        this.initial_velocity = initial_velocity;
        this.acceleration = acceleration;
        this.created_at = created_at;

        this.position = initial_position;
        this.velocity = initial_velocity;
    }

    getInitialPosition() {
        return this.initial_position;
    }

    getInitialVelocity() {
        return this.initial_velocity;
    }

    createdAt() {
        return this.created_at;
    }

    //   time in seconds since the particle was created
    calculatePositionAt(time) {
        let ds = this.initial_velocity.multiplied(time);
        //   initialising ds variable that represents change in position
        //   and calculating the first part of the equation

        ds.add(this.acceleration.multiplied(time * time / 2));
        //   adding the change caused by acceleration

        return this.initial_position.added(ds); 
    }

    //   time in miliseconds since simulation started
    update(time) {
        let t = (time - this.created_at) / 1000;

        this.position = this.calculatePositionAt(t); 
        //   updating position

        let dv = this.acceleration.multiplied(t);
        //   initialising change in velocity variable
        this.velocity = this.initial_velocity.added(dv);
        //   updating velocity
    }
}

export {PointMass as default};