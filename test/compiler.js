
var compiler = require('../lib/compiler');

exports['compile stop opcode'] = function (test) {
	test.equal(compiler.compile('stop'), '00');
}

exports['compile opcode in uppercase and mixed case'] = function (test) {
	test.equal(compiler.compile('STOP'), '00');
	test.equal(compiler.compile('Add'), '01');
}

exports['compile arithmetic opcodes'] = function (test) {
	test.equal(compiler.compile('add'), '01');
	test.equal(compiler.compile('mul'), '02');
	test.equal(compiler.compile('sub'), '03');
	test.equal(compiler.compile('div'), '04');

	test.equal(compiler.compile('sdiv'), '05');
	test.equal(compiler.compile('mod'),  '06');
	test.equal(compiler.compile('smod'), '07');
	test.equal(compiler.compile('addmod'), '08');
	test.equal(compiler.compile('mulmod'), '09');
	test.equal(compiler.compile('exp'),  '0a');
	test.equal(compiler.compile('signextend'),  '0b');
}


