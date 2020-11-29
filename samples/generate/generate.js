
const fs = require('fs')

const evmasm = require('../..');

const filename = process.argv[2];

const text = fs.readFileSync(filename).toString();

const code = evmasm.compile(text);

console.log(code);


