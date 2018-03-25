
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

exports['compile comparison opcodes'] = function (test) {
	test.equal(compiler.compile('lt'), '10');
	test.equal(compiler.compile('gt'), '11');
	test.equal(compiler.compile('slt'), '12');
	test.equal(compiler.compile('sgt'), '13');
	test.equal(compiler.compile('eq'), '14');
	test.equal(compiler.compile('iszero'), '15');
}

exports['compile bitwise opcodes'] = function (test) {
	test.equal(compiler.compile('and'), '16');
	test.equal(compiler.compile('or'), '17');
	test.equal(compiler.compile('xor'), '18');
	test.equal(compiler.compile('not'), '19');
	test.equal(compiler.compile('byte'), '1a');
}

