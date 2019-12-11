const chalk = require('chalk');
const {MODE} = require('./constants');

module.exports = function instructionToString(instruction, mem) {
  const argsStr = instruction.args
    .map(arg =>
      arg.mode === MODE.IMMEDIATE
        ? chalk.greenBright(arg.value)
        : chalk.grey(
            '(' +
              chalk.dim.blue(arg.value) +
              ` -> ${chalk.blueBright(arg.resolvedValue)})`
          )
    )
    .join(' ');

  let resultStr = '';
  if (instruction.hasResult) {
    const resultAddr = instruction.args[instruction.arity].resolvedValue;
    resultStr = chalk.dim.cyan(`(= ${mem[resultAddr]})`);
  }

  return [
    chalk.grey(instruction.address.toString().padStart(4, ' ')),
    chalk.white(instruction.mnemonic.padStart(4, ' ')),
    argsStr,
    resultStr
  ].join(' ');
};
