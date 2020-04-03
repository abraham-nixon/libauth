/* eslint-disable functional/no-expression-statement */
import test from 'ava';

import { hexToBin } from '../lib';

import { expectCompilationResult } from './compiler.e2e.spec.helper';

test(
  '[BCH compiler] language – empty script',
  expectCompilationResult,
  '',
  {},
  { bytecode: hexToBin(''), success: true }
);

test(
  '[BCH compiler] language – compile BigIntLiterals to script numbers',
  expectCompilationResult,
  '42 -42 2147483647 -2147483647',
  {},
  { bytecode: hexToBin('2aaaffffff7fffffffff'), success: true }
);

test(
  "[BCH compiler] language – compile UTF8Literal (')",
  expectCompilationResult,
  "'abc\"`👍'",
  {},
  { bytecode: hexToBin('6162632260f09f918d'), success: true }
);

test(
  '[BCH compiler] language – compile UTF8Literal (")',
  expectCompilationResult,
  '"abc\'`👍"',
  {},
  { bytecode: hexToBin('6162632760f09f918d'), success: true }
);

test(
  '[BCH compiler] language – compile HexLiteral',
  expectCompilationResult,
  '0xdeadbeef',
  {},
  { bytecode: hexToBin('deadbeef'), success: true }
);

test(
  '[BCH compiler] language – compile opcodes',
  expectCompilationResult,
  'OP_0 OP_1 OP_ADD',
  {},
  { bytecode: hexToBin('005193'), success: true }
);

test(
  '[BCH compiler] language – comments',
  expectCompilationResult,
  `// a comment
  0xab
  // another comment
  0xcd
  /**
   * A third, multi-line
   * comment
   */
  0xef
  `,
  {},
  { bytecode: hexToBin('abcdef'), success: true }
);

test(
  '[BCH compiler] language – empty push (push an empty byte array, i.e. OP_0)',
  expectCompilationResult,
  '<>',
  {},
  { bytecode: hexToBin('00'), success: true }
);

test(
  '[BCH compiler] language – minimize BigIntLiteral pushes',
  expectCompilationResult,
  '< -1 > <0> <1> <2> <3> <4> <5> <6> <7> <8> <9> <10> <11> <12> <13> <14> <15> <16> <17>',
  {},
  {
    bytecode: hexToBin('4f005152535455565758595a5b5c5d5e5f600111'),
    success: true,
  }
);

test(
  '[BCH compiler] language – minimize HexLiteral pushes',
  expectCompilationResult,
  '<0x81> <> <0x01> <0x02> <0x03> <0x04> <0x05> <0x06> <0x07> <0x08> <0x09> <0x0a> <0x0b> <0x0c> <0x0d> <0x0e> <0x0f> <0x10> <0x11>',
  {},
  {
    bytecode: hexToBin('4f005152535455565758595a5b5c5d5e5f600111'),
    success: true,
  }
);

test(
  "[BCH compiler] language – don't minimize <0x00>",
  expectCompilationResult,
  '<0x00>',
  {},
  {
    bytecode: hexToBin('0100'),
    success: true,
  }
);

test(
  '[BCH compiler] language – push UTF8Literal',
  expectCompilationResult,
  '<"abc">',
  {},
  {
    bytecode: hexToBin('03616263'),
    success: true,
  }
);

test(
  '[BCH compiler] language – push opcodes',
  expectCompilationResult,
  '<OP_0> <OP_1> <OP_2>',
  {},
  {
    bytecode: hexToBin('010001510152'),
    success: true,
  }
);

test(
  '[BCH compiler] language – nested pushes (center minimized to OP_1)',
  expectCompilationResult,
  '<<<<1>>>>',
  {},
  {
    bytecode: hexToBin('03020151'),
    success: true,
  }
);

test(
  '[BCH compiler] language – complex script',
  expectCompilationResult,
  `
// there are plenty of ways to push 0/call OP_0
<0> OP_0 0x00 <''> <$(OP_0)> <$(< -1 > < 1 > OP_ADD)>
/**
 * A multi-line comment 🚀
 * Followed by some UTF8Literals
 */
'abc' "'🧙'"
// a comment at the end
`,
  {},
  {
    bytecode: hexToBin('00000000000061626327f09fa79927'),
    success: true,
  }
);
