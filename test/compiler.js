
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

exports['compile sha3 opcode'] = function (test) {
	test.equal(compiler.compile('sha3'), '20');
}

exports['compile environment opcodes'] = function (test) {
	test.equal(compiler.compile('address'), '30');
	test.equal(compiler.compile('balance'), '31');
	test.equal(compiler.compile('origin'), '32');
	test.equal(compiler.compile('caller'), '33');
	test.equal(compiler.compile('callvalue'), '34');
	test.equal(compiler.compile('calldataload'), '35');
	test.equal(compiler.compile('calldatasize'), '36');
	test.equal(compiler.compile('calldatacopy'), '37');
	test.equal(compiler.compile('codesize'), '38');
	test.equal(compiler.compile('codecopy'), '39');
	test.equal(compiler.compile('gasprice'), '3a');
	test.equal(compiler.compile('extcodesize'), '3b');
	test.equal(compiler.compile('extcodecopy'), '3c');
	test.equal(compiler.compile('returndatasize'), '3d');
	test.equal(compiler.compile('returndatacopy'), '3e');
}

exports['compile block opcodes'] = function (test) {
	test.equal(compiler.compile('blockhash'), '40');
	test.equal(compiler.compile('coinbase'), '41');
	test.equal(compiler.compile('timestamp'), '42');
	test.equal(compiler.compile('number'), '43');
	test.equal(compiler.compile('difficulty'), '44');
	test.equal(compiler.compile('gaslimit'), '45');
}

exports['compile pop opcode'] = function (test) {
	test.equal(compiler.compile('pop'), '50');
}

exports['compile memory opcodes'] = function (test) {
	test.equal(compiler.compile('mload'), '51');
	test.equal(compiler.compile('mstore'), '52');
	test.equal(compiler.compile('mstore8'), '53');
}

exports['compile storage opcodes'] = function (test) {
	test.equal(compiler.compile('sload'), '54');
	test.equal(compiler.compile('sstore'), '55');
}

exports['compile jump opcodes'] = function (test) {
	test.equal(compiler.compile('jump'), '56');
	test.equal(compiler.compile('jumpi'), '57');
	test.equal(compiler.compile('jumpdest'), '5b');
}

exports['compile pc opcode'] = function (test) {
	test.equal(compiler.compile('pc'), '58');
}

exports['compile msize opcode'] = function (test) {
	test.equal(compiler.compile('msize'), '59');
}

exports['compile gas opcode'] = function (test) {
	test.equal(compiler.compile('gas'), '5a');
}

exports['compile push opcodes'] = function (test) {
	for (var k = 1; k <= 32; k++) {
		var opcode = 'push' + k;
		var expected = (0x60 + k - 1).toString(16);
		test.strictEqual(compiler.compile(opcode), expected);
	}
}

