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

function findIntersections(ls1, ls2) {
    const intersections = [];
    for (let i = 2; i < ls1.length; i += 2) {
        const a = ls1.slice(i - 2, i + 2);

        for (let j = 2; j < ls2.length; j += 2) {
            const b = ls2.slice(j - 2, j + 2);

            const intersection = intersect(a, b);
            if (intersection) {
                intersections.push(intersection);
            }
        }
    }

    return intersections;
}

// test from challenge
assert.deepEqual(
    findIntersections(parse('R8,U5,L5,D3'), parse('U7,R6,D4,L4')),
    [[6, 5], [3, 3]]
);

const intersections = findIntersections(parse(cableA), parse(cableB));

console.log('result: ', Math.min(...intersections.map(([x, y]) => x + y)));