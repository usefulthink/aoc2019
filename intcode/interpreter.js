const assert = require('assert');
const {MODE, OPCODE, OP} = require('./constants');

module.exports = runIntcodeProgram;

function readInstruction(mem, ip) {
  const instruction = mem[ip];
  const [, m3, m2, m1, code] = instruction
    .toString()
    .padStart(5, '0')
    .match(/([01])([01])([01])([0-9]{2})/)
    .map(Number);

  const op = OP[code];
  if (!op) {
    throw new Error('unknown opcode: ' + code);
  }

  const addrModes = [m1, m2, m3];
  const args = [];

  for (let i = 0; i < op.arity; i++) {
    const value = mem[ip + 1 + i];
    const mode = addrModes[i];

    args.push({
      value,
      mode
    });
  }

  // result will always use immediate mode
  if (op.hasResult) {
    args.push({value: mem[ip + op.arity + 1], mode: MODE.IMMEDIATE});
  }

  for (let i = 0; i < args.length; i++) {
    const {mode, value} = args[i];
    args[i].resolvedValue = mode === MODE.IMMEDIATE ? value : mem[value];
  }

  return {address: ip, ...op, args};
}

/**
 * Runs the intcode-program in the memory-array given as first parameter with
 * inputs specified via the second parameter.
 * @param {number[]} mem the memory containing program and data
 * @param {Iterable|AsyncIterable} input something that can be iterated over to
 *     get input values.
 *     Supports async iterators to implement blocking on I/O.
 * @param {Array|{push: function(item):void}} output
 *     An object with a push-method to write data to.
 * @param {function(Instruction, number[]): Promise} debugCallback
 *     called after each instruction with the instruction executed and the
 *     state of the memory after execution. Can return a promise to halt
 *     execution until the promise is resolved.
 * @returns {Promise}
 */
async function runIntcodeProgram(
  mem,
  input = [],
  output = [],
  debugCallback = async (instruction, mem) => {}
) {
  const inputIterator = (
    input[Symbol.asyncIterator] || input[Symbol.iterator]
  ).call(input);

  let ip = 0;

  loop: while (ip < mem.length) {
    const instruction = readInstruction(mem, ip);
    const args = instruction.args.map(arg => arg.resolvedValue);

    switch (instruction.code) {
      // ---- ARITHMETIC
      case OPCODE.ADD:
        mem[args[2]] = args[0] + args[1];
        break;
      case OPCODE.MUL:
        mem[args[2]] = args[0] * args[1];
        break;

      // ---- I/O
      case OPCODE.IN:
        mem[args[0]] = (await inputIterator.next()).value;
        break;
      case OPCODE.OUT:
        output.push(args[0]);
        break;

      // ---- BRANCHING
      case OPCODE.JNZ:
        if (args[0] !== 0) {
          ip = args[1];
          continue loop;
        }
        break;
      case OPCODE.JZ:
        if (args[0] === 0) {
          ip = args[1];
          continue loop;
        }
        break;

      // ---- COMPARISON
      case OPCODE.LT:
        mem[args[2]] = args[0] < args[1] ? 1 : 0;
        break;
      case OPCODE.EQ:
        mem[args[2]] = args[0] === args[1] ? 1 : 0;
        break;

      // ---- CONTROL
      case OPCODE.HALT:
        return;
      default:
        throw new Error('invalid operation: ' + instruction.code);
    }

    await debugCallback(instruction, mem);

    ip += instruction.length;
  }
}

/**
 * @typedef {Object} Argument
 * @property {number} value
 * @property {MODE.IMMEDIATE|MODE.INDIRECT} mode
 * @property {number} resolvedValue
 *
 * @typedef {Object} Instruction
 * @property {number} address
 * @property {number} code
 * @property {string} mnemonic
 * @property {number} arity
 * @property {boolean} hasResult
 * @property {number} length
 * @property {Argument[]} args
 */
