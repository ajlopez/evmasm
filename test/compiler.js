
var compiler = require('../lib/compiler');

exports['compile stop opcode'] = function (test) {
	test.equal(compiler.compile('stop'), '00');
}

exports['compile arithmetic opcodes'] = function (test) {
	test.equal(compiler.compile('add'), '01');
	test.equal(compiler.compile('mul'), '02');
	test.equal(compiler.compile('sub'), '03');
	test.equal(compiler.compile('div'), '04');
}

