const assert = require('assert');

const [cableA, cableB] = require('fs').readFileSync('03-in.txt', 'utf-8')
    .split('\n');

function move(p, op) {
    const [x, y] = p;
    const d = Number(op.slice(1));
    switch (op.charAt(0)) {
        case 'R':
            return [x + d, y];
        case 'L':
            return [x - d, y];
        case 'U':
            return [x, y + d];
        case 'D':
            return [x, y - d];
    }
}

function parse(string) {
    const pathOps = string.split(',');

    let p = [0, 0];
    const lineString = [...p];
    for (let i = 0; i < pathOps.length; i++) {
        p = move(p, pathOps[i])
        lineString.push(...p);
    }

    return lineString;
}

assert.deepEqual(parse('U10'), [0, 0, 0, 10]);
assert.deepEqual(parse('R75,D30'), [0, 0, 75, 0, 75, -30]);

function intersect(a, b) {
    // check a || b
    if (a[0] === a[2] && b[0] === b[2]) return null;
    if (a[1] === a[3] && b[1] === b[3]) return null;

    // we know that a ⟂ b
    const [vx, vy0, , vy1] = a[0] === a[2] ? a : b;
    const [hx0, hy, hx1] = a[0] === a[2] ? b : a;

    if (Math.min(vy0, vy1) >= hy) return null;
    if (Math.max(vy0, vy1) <= hy) return null;
    if (Math.min(hx0, hx1) >= vx) return null;
    if (Math.max(hx0, hx1) <= vx) return null;

    return [vx, hy];
}

// parallels
assert.equal(intersect([0, 2, 4, 2], [2, 2, 4, 2]), null);
assert.equal(intersect([2, 0, 2, 4], [3, 1, 3, 3]), null);

// perpendicular, not intersecting
assert.equal(intersect([0, 0, 5, 0], [2, 1, 2, 3]), null);

// intersection
assert.deepEqual(intersect([0, 2, 4, 2], [1, 0, 1, 3]), [1, 2]);

function distance(ax, ay, bx, by) {
    return Math.abs(bx - ax) + Math.abs(by - ay);
}

function findIntersections(ls1, ls2) {
    const intersections = [];
    let lengthA = 0;
    let lengthB = 0;

    for (let i = 2; i < ls1.length; i += 2) {
        const a = ls1.slice(i - 2, i + 2);

        for (let j = 2; j < ls2.length; j += 2) {
            const b = ls2.slice(j - 2, j + 2);
            const intersection = intersect(a, b);
            if (intersection) {
                const [x, y] = intersection;

                const length =
                    lengthA + distance(a[0], a[1], x, y)
                    + lengthB + distance(b[0], b[1], x, y);

                intersections.push({x, y, length});
            }

            lengthB += distance(...b);
        }

        lengthA += distance(...a);
        lengthB = 0;
    }

    return intersections;
}

// test from challenge
assert.deepEqual(
    findIntersections(parse('R8,U5,L5,D3'), parse('U7,R6,D4,L4')),
    [{x: 6, y: 5, length: 30}, {x: 3, y: 3, length: 40}]
);

function getClosestDistance(cableA, cableB) {
    const intersections = findIntersections(parse(cableA), parse(cableB));

    return Math.min(...intersections.map(i => i.length));
    // const {x, y} = intersections.find(i => i.length === minLength);
    //
    // return x + y;
}

assert.equal(getClosestDistance(
    'R8,U5,L5,D3',
    'U7,R6,D4,L4'),
    30);
assert.equal(getClosestDistance(
    'R75,D30,R83,U83,L12,D49,R71,U7,L72',
    'U62,R66,U55,R34,D71,R55,D58,R83'),
    610);
assert.equal(getClosestDistance(
    'R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51',
    'U98,R91,D20,R16,D67,R40,U7,R15,U6,R7'),
    410);

console.log('result 3b: ', getClosestDistance(cableA, cableB));