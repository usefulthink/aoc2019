const assert = require('assert');

// guessing a password
const checks = [
  // six-digit number
  s => s.length === 6 && Number(s).toString(10) === s,

  // Two adjacent digits are the same (like 22 in 122345).
  s =>
    s
      .split('')
      .reduce((res, c) => {
        const [[prev, n] = [], ...rest] = res;
        return c === prev
          ? [[c, n + 1], ...rest]
          : [[c, 1], [prev, n], ...rest];
      }, [])
      .some(([, n]) => n === 2),

  // Going from left to right, the digits never decrease; they only ever increase
  // or stay the same (like 111123 or 135679).
  s =>
    Number.isFinite(
      +s.split('').reduce((max, digit) => (digit >= max ? digit : Infinity))
    )
];

function isCandidate(value) {
  return checks.every(fn => fn(value));
}

assert.equal(isCandidate('111111'), false);
assert.equal(isCandidate('223450'), false);
assert.equal(isCandidate('123789'), false);
assert.equal(isCandidate('112233'), true);
assert.equal(isCandidate('123444'), false);
assert.equal(isCandidate('111122'), true);

function numCandidates(min, max) {
  let candidates = 0;
  for (let i = min; i <= max; i++) {
    if (isCandidate(i.toString())) candidates++;
  }

  return candidates;
}

console.log('4b - number of candidates: ', numCandidates(165432, 707912));
