

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    setX(value) {
        this.x = value;
    }

    getX() {
        return this.x;
    }

    setY(value) {
        this.y = value;
    }

    getY(value) {
        return this.y;
    }
    //   basic set of getters and setters

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    added(vector) {
        let x = this.x + vector.x;
        let y = this.y + vector.y;
        return new Vector(x, y);
    }

    subtract(vector) {
        let x = this.x - vector.x;
        let y = this.y - vector.y;
    }

    subtracted(vector) {
        let x = this.x - vector.x;
        let y = this.y - vector.y;
        //   creating temporary variables for new x and y variables,
        //   original vector is unchanged
        return new Vector(x, y);
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    multiplied(scalar) {
        let x = this.x * scalar;
        let y = this.y * scalar;
        return new Vector(x, y);
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    divided(scalar) {
        let x = this.x / scalar;
        let y = this.y / scalar;
        return new Vector(x, y);
    }
    
    dot(other_vector) {
        //   returns the dot product between the vector on which the method is called
        //   and the vector passed as a parameter
        //   has a commutative property: a.dot(b) = b.dot(a)
        return this.x * other_vector.x + this.y * other_vector.y;
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
        //   can also be represented as this.dot(this)
    }

    length() {
        return Math.sqrt(this.lengthSquared());
    }

    normalize() {
        if (this.x === 0 && this.y === 0)
            throw new Error("Zero vector cannot be normalised");
        this.divide(this.length());
    }

    normalized() {
        if (this.x === 0 && this.y === 0)
            throw new Error("Zero vector cannot be normalised");
        return this.divided(this.length());
    }

    rotatedBy(angle, axis = new Vector()) {
        //   defined as anticlockwise rotation by angle
        let rotated_vector = this.subtracted(axis);
        //   first tranlate the axis to the origin

        rotated_vector = new Vector(
            rotated_vector.x * Math.cos(angle) - rotated_vector.y * Math.sin(angle),
            rotated_vector.x * Math.sin(angle) + rotated_vector.y * Math.cos(angle)
        );
        //   rotate vector like that

        rotated_vector.add(axis);
        //   translate the axis back
        return rotated_vector;
    }

    reflectedInX() {
        let new_y = this.y * (-1);
	    return new Vector(this.x, new_y);
    }

    reflectedInY() {
        let new_x = this.x * (-1);
	    return new Vector(new_x, this.y);
    }

    //   Allows to easily spread vector coordinates using 
    //   spread operator
    [Symbol.iterator] = function* () {
        yield this.x;
        yield this.y;
    }
}


export {Vector as default};