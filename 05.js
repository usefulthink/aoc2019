const assert = require('assert');
const runIntcodeProgram = require('./intcode/interpreter');

if (process.env.RUN_TESTS) {
  (async () => {
    // prettier-ignore
    const test1 = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
    const test2 = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

    // prettier-ignore
    const test3 = [
      3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
      1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
      999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99
    ];

    let out = [];
    await runIntcodeProgram(test1, [0], out);
    assert.deepEqual(out, [0]);

    out = [];
    await runIntcodeProgram(test2, [0], out);
    assert.deepEqual(out, [0]);

    out = [];
    await runIntcodeProgram(test3.slice(), [1], out);
    assert.deepEqual(out, [999]);

    out = [];
    await runIntcodeProgram(test3.slice(), [8], out);
    assert.deepEqual(out, [1000]);

    out = [];
    await runIntcodeProgram(test3.slice(), [10], out);
    assert.deepEqual(out, [1001]);
  })().then(
    () => {
      console.log('tests complete');
    },
    err => {
      console.error(err);
      process.exit(1);
    }
  );
}

const mem = require('fs')
  .readFileSync('05-in.txt', 'utf8')
  .split(',')
  .map(Number);

(async () => {
  const output1 = [];
  const output2 = [];

  await runIntcodeProgram(mem.slice(), [1], output1);
  await runIntcodeProgram(mem.slice(), [5], output2);

  console.log({output1, output2});
})().catch(err => console.error(err));
