

class Util {
    //   define as accepting a, b, c for an equation of the form
    //   ax^2 + bx + c = 0
    //   output list of two roots (in ascending order)
    //   if there is only one root, both elements are the same
    //   if there no roots, both elements are NaN
    static solveQuadratic(a, b, c) {
        let D = b * b - 4 * a * c;
        //   calculating discriminant

        if (D < 0) {
            return [NaN, NaN];
        }
        
        let x1 = ((-1) * b - Math.sqrt(D)) / (2 * a);
        let x2 = ((-1) * b + Math.sqrt(D)) / (2 * a);

        if (x2 < x1) {
            let temp = x2;
            x2 = x1;
            x1 = temp;
            //   swap x1 and x2 so x2 >= x1
        }
        //   two solutions where x1 <= x2

        return [x1, x2]
    }

    //   b, c for
    //   bx + c = 0
    //   output single number
    //   if no roots, output NaN
    static solveLinear(b, c) {
        if (b == 0) {
            return NaN;
            //   no roots if b is zero
        }

        let x = (-1) * c / b;
        return x;
    }
}

export {Util as default};

