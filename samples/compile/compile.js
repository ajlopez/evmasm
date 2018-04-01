
var evmasm = require('../..');
var fs = require('fs');

var code = fs.readFileSync(process.argv[2]).toString();

var bytecode = evmasm.compile(code);

console.log(bytecode);

