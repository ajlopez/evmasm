
const evmasm = require('../..');
const fs = require('fs');

const code = fs.readFileSync(process.argv[2]).toString();

const bytecode = evmasm.compile(code);

console.log(bytecode);

