import Vector from "../utility/Vector.js"

describe("addition / subtraction", () => {
    test("(2,9) + (4,8)", () => {
        expect(new Vector(2,9).added(new Vector(4,8))).toEqual(new Vector(6,17));
    })
    
    test("(2,9) - (4,8)", () => {
        expect(new Vector(2,9).subtracted(new Vector(4,8))).toEqual(new Vector(-2,1));
    })
    
    test("(-10,-11) + (3,3)", () => {
        expect(new Vector(-10,-11).added(new Vector(3,3))).toEqual(new Vector(-7,-8));
    })
    
    test("(-10,-11) - (3,3)", () => {
        expect(new Vector(-10,-11).subtracted(new Vector(3,3))).toEqual(new Vector(-13,-14));
    })
    
    test("(3,3) - (-10,-11)", () => {
        expect(new Vector(3,3).added(new Vector(-10,-11))).toEqual(new Vector(-7,-8));
    })
    
    test("(3,3) - (-10,-11)", () => {
        expect(new Vector(3,3).subtracted(new Vector(-10,-11))).toEqual(new Vector(13,14));
    })
});

describe("Multiplication / division", () => {
    test("(6,12) * 3", () => {
        expect(new Vector(6,12).multiplied(3)).toEqual(new Vector(18,36));
    })

    test("(6,12) / 3", () => {
        expect(new Vector(6,12).divided(3)).toEqual(new Vector(2,4));
    })

    test("(-7,200) * 4", () => {
        expect(new Vector(-7,200).multiplied(4)).toEqual(new Vector(-28,800));
    })

    test("(-7,200) / 4", () => {
        expect(new Vector(-7,200).divided(4)).toEqual(new Vector(-1.75,50));
    })

    test("(0,90) * -10", () => {
        expect(new Vector(0,90).multiplied(-10)).toEqual(new Vector(0,-900));
    })

    test("(0,90) / -10", () => {
        expect(new Vector(0,90).divided(-10)).toEqual(new Vector(0,-9));
    })
})

describe("dot product", () => {
    test("(0,10) . (-7,9)", () => {
        expect(new Vector(0,10).dot(new Vector(-7,9))).toEqual(90);
    })

    test("(2,2) . (-1,2)", () => {
        expect(new Vector(2,2).dot(new Vector(-1,2))).toEqual(2);
    })

    test("(0,10) . (-7,9)", () => {
        expect(new Vector(0,10).dot(new Vector(-7,0))).toEqual(0);
    })
})

describe("length", () => {
    test("length of (3,4)", () => {
        expect(new Vector(3,4).length()).toEqual(5);
    })
    
    test("length of (12,-5)", () => {
        expect(new Vector(12,-5).length()).toEqual(13);
    })
})


describe("lengthSquared", () => {
    test("squared length of (2,3)", () => {
        expect(new Vector(2,3).lengthSquared()).toEqual(13);
    })
    
    test("squared length of (6,-10)", () => {
        expect(new Vector(6,-10).lengthSquared()).toEqual(136);
    })
})

describe("normalisation", () => {
    test("normalise (2,3)", () => {
        expect(new Vector(3,-4).normalized()).toEqual(new Vector(0.6,-0.8));
    })
    
    test("normalise (80,-60)", () => {
        expect(new Vector(80,-60).normalized()).toEqual(new Vector(0.8,-0.6));
    })
})
