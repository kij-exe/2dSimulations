import PriorityQueue from "../utility/PriorityQueue.js"


//   function for initialising the basic priority queue:
//   [null, 30, 25, 20, 10, 3, 12, 18, 2, 4]
//   used for both stage 1 and 2 tests
function initializeQueue() {
    let pq = new PriorityQueue((a, b) => a - b);
    //   priority queue with the comparator that 
    //   prioritises the larger element
    for (let element of [30, 25, 20, 10, 3, 12, 18, 2, 4]) {
        pq.push(element);
    }
    return pq;
}


describe("Stage 1 testing", () => {
    let pq = initializeQueue();

    test("test (0)", () => {
        expect(pq.heap).toEqual([null, 30, 25, 20, 10, 3, 12, 18, 2, 4]);
    });

    test("test (1)", () => {
        pq.push(12)
        expect(pq.heap).toEqual([null, 30, 25, 20, 10, 12, 12, 18, 2, 4, 3]);
    });
    
    test("test (2)", () => {
        pq.push(29)
        expect(pq.heap).toEqual([null, 30, 29, 20, 10, 25, 12, 18, 2, 4, 3, 12]);
    });
    
    test("test (3)", () => {
        pq.push(-10)
        expect(pq.heap).toEqual([null, 30, 29, 20, 10, 25, 12, 18, 2, 4, 3, 12, -10]);
    });
    
    test("test (4)", () => {
        pq.push(42)
        expect(pq.heap).toEqual([null, 42, 29, 30, 10, 25, 20, 18, 2, 4, 3, 12, -10, 12]);
    });
});

describe("Stage 2 testing", () => {
    let pq = initializeQueue();

    test("test (1)", () => {
        expect(pq.pop()).toEqual(30);
        expect(pq.heap).toEqual([null, 25, 10, 20, 4, 3, 12, 18, 2]);
        expect(pq.peek()).toEqual(25);
    });

    test("test (2)", () => {
        expect(pq.pop()).toEqual(25);
        expect(pq.heap).toEqual([null, 20, 10, 18, 4, 3, 12, 2]);
        expect(pq.peek()).toEqual(20);
    });

    test("test (3)", () => {
        expect(pq.pop()).toEqual(20);
        expect(pq.heap).toEqual([null, 18, 10, 12, 4, 3, 2]);
        expect(pq.peek()).toEqual(18);
    });

    test("test (4)", () => {
        expect(pq.pop()).toEqual(18);
        expect(pq.heap).toEqual([null, 12, 10, 2, 4, 3]);
        expect(pq.peek()).toEqual(12);
    });

    test("test (5)", () => {
        expect(pq.pop()).toEqual(12);
        expect(pq.heap).toEqual([null, 10, 4, 2, 3]);
        expect(pq.peek()).toEqual(10);
    });

    test("test (6)", () => {
        expect(pq.pop()).toEqual(10);
        expect(pq.heap).toEqual([null, 4, 3, 2]);
        expect(pq.peek()).toEqual(4);
    });

    test("test (7)", () => {
        expect(pq.pop()).toEqual(4);
        expect(pq.heap).toEqual([null, 3, 2]);
        expect(pq.peek()).toEqual(3);
    });

    test("test (8)", () => {
        expect(pq.pop()).toEqual(3);
        expect(pq.heap).toEqual([null, 2]);
        expect(pq.peek()).toEqual(2);
    });

    test("test (9)", () => {
        expect(pq.pop()).toEqual(2);
        expect(pq.heap).toEqual([null]);
        expect(pq.peek()).toEqual(null);
    });

    test("test (10)", () => {
        expect(pq.pop()).toEqual(null);
        expect(pq.heap).toEqual([null]);
        expect(pq.peek()).toEqual(null);
    });
});