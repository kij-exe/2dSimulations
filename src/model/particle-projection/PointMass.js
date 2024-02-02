import Body from "../Body.js";


class PointMass extends Body {
    constructor(initial_position, initial_velocity, acceleration, created_at, id) {
        super(id);
        this.initial_position = initial_position;
        this.initial_velocity = initial_velocity;
        this.acceleration = acceleration;
        this.created_at = created_at;

        this.position = initial_position;
        this.velocity = initial_velocity;
    }

    update(time) {
        let t = time - this.created_at;
        //   calculate time from the creation of the object
        ds = this.initial_velocity.multiplied(t);
        //   initialising ds variable that represents change in position
        //   and calculating the first part of the equation

        ds.add(this.acceleration.multiplied(t * t / 2));
        //   adding the change caused by acceleration

        this.position = this.initial_position.add(ds); 
        //   updating position

        dv = a.multiplied(t);
        //   initialising change in velocity variable
        this.velocity = this.initial_velocity.add(dv);
        //   updating velocity
    }
}

export {PointMass as default};