const fs = require('fs');
const assert = require('assert');

const input = fs.readFileSync('02-in.txt', 'utf-8')
    .split(',')
    .map(Number);

const op = {ADD: 1, MUL: 2, HALT: 99};

function runProgram(tape) {
    let ptr = 0;
    while (ptr < tape.length) {
        const [opcode, addrA, addrB, addrC] = tape.slice(ptr, ptr + 4);

        if (opcode === op.HALT) {
            break;
        } else if (opcode === op.ADD) {
            tape[addrC] = tape[addrA] + tape[addrB];
        } else if (opcode === op.MUL) {
            tape[addrC] = tape[addrA] * tape[addrB];
        } else {
            console.error('unknown opcode: ' + opcode);
            break;
        }

        ptr += 4;
    }

    return tape;
}

function run(noun, verb) {
    const mem = input.slice(0);
    mem[1] = noun;
    mem[2] = verb;

    runProgram(mem);

    return mem[0];
}

(async () => {
    assert.deepEqual(runProgram([1, 0, 0, 0, 99]), [2, 0, 0, 0, 99]);
    assert.deepEqual(runProgram([2, 3, 0, 3, 99]), [2, 3, 0, 6, 99]);
    assert.deepEqual(runProgram([2, 4, 4, 5, 99, 0]), [2, 4, 4, 5, 99, 9801]);
    assert.deepEqual(runProgram([1, 1, 1, 4, 99, 5, 6, 0, 99]), [30, 1, 1, 4, 2, 5, 6, 0, 99]);

    console.log('result part 1:', run(12, 2));

    outer: for (let noun = 0; noun <= 99; noun++) {
        for (let verb = 0; verb <= 99; verb++) {
            const res = run(noun, verb);
            if (res === 19690720) {
                console.log('result part 2:', 100 * noun + verb);
                break outer;
            }
        }
    }
})();