const OPCODE = {
  ADD: 1,
  MUL: 2,
  IN: 3,
  OUT: 4,
  JNZ: 5,
  JZ: 6,
  LT: 7,
  EQ: 8,
  HALT: 99
};
exports.OPCODE = OPCODE;

// prettier-ignore
exports.OP = {
    [OPCODE.ADD]:  {mnemonic: 'ADD',  code:  1, arity: 2, hasResult: true,  length: 4},
    [OPCODE.MUL]:  {mnemonic: 'MUL',  code:  2, arity: 2, hasResult: true,  length: 4},
    [OPCODE.IN]:   {mnemonic: 'IN',   code:  3, arity: 0, hasResult: true,  length: 2},
    [OPCODE.OUT]:  {mnemonic: 'OUT',  code:  4, arity: 1, hasResult: false, length: 2},
    [OPCODE.JNZ]:  {mnemonic: 'JNZ',  code:  5, arity: 2, hasResult: false, length: 3},
    [OPCODE.JZ]:   {mnemonic: 'JZ',   code:  6, arity: 2, hasResult: false, length: 3},
    [OPCODE.LT]:   {mnemonic: 'LT',   code:  7, arity: 2, hasResult: true,  length: 4},
    [OPCODE.EQ]:   {mnemonic: 'EQ',   code:  8, arity: 2, hasResult: true,  length: 4},
    [OPCODE.HALT]: {mnemonic: 'HALT', code: 99, arity: 0, hasResult: false, length: 1},
};

exports.MODE = {
  INDIRECT: 0,
  IMMEDIATE: 1
};
