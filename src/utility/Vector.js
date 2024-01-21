

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
        //   creating temporary variables for new x and y variables,
        //   original vector is unchanged
        return new Vector(x, y);
    }

    subtract(vector) {
        let x = this.x - vector.x;
        let y = this.y - vector.y;
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
}


export {Vector as default};