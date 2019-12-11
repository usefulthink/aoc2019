const chalk = require('chalk');
const runIntcodeProgram = require('./intcode/interpreter');
const instructionToString = require('./intcode/instruction-to-string');
const iostream = require('./intcode/iostream');

async function runAmplifierController(ampProgram, phaseSettings) {
  let signalValue = 0;
  console.log(phaseSettings);

  // index i stores the stream that is output of amplifier i
  const channels = [];
  for (let i = 0; i < 5; i++) {
    channels[i] = iostream((tag, data) =>
      console.log(chalk.yellow(`[${i} -> ${(i + 1) % 5}] %s`), tag)
    );
  }

  const programPromises = [];
  for (let i = 0; i < 5; i++) {
    const inputChannel = channels[(i + 4) % 5];
    const outputChannel = channels[i];

    inputChannel.push(phaseSettings[i]);

    programPromises.push(
      runIntcodeProgram(
        ampProgram.slice(),
        inputChannel.outputStream(),
        outputChannel,

        (instruction, mem) =>
          console.log(
            chalk.red(`[${i}] `) + instructionToString(instruction, mem)
          )
      )
    );
  }

  // write initial seed-value for amp 0
  channels[4].push(0);

  await Promise.all(programPromises);

  const [lastOutput] = channels[4].end();

  return lastOutput;
}

function permutations(list) {
  // Empty list has one permutation
  if (list.length === 0) {
    return [[]];
  }

  const result = [];
  for (let i = 0; i < list.length; i++) {
    const copy = list.slice();
    const head = copy.splice(i, 1)[0];

    result.push(
      ...permutations(copy).map(permutation => [head, ...permutation])
    );
  }

  return result;
}

function getPossiblePhaseSettings(part) {
  if (part === 'a') {
    return permutations([0, 1, 2, 3, 4]);
  }

  return permutations([5, 6, 7, 8, 9]);
}

(async () => {
  const program = require('fs')
    .readFileSync('07-in.txt', 'utf8')
    .split(',')
    .map(Number);

  const possiblePhaseSettings = getPossiblePhaseSettings('b');

  let maxOutput = 0;
  let bestPhaseSetting = null;

  for (let phaseSetting of possiblePhaseSettings) {
    const output = await runAmplifierController(program, phaseSetting);

    if (output > maxOutput) {
      maxOutput = output;
      bestPhaseSetting = phaseSetting;
    }
  }

  console.log({maxOutput, bestPhaseSetting});
})();
